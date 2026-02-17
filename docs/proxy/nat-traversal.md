# 内网穿透方案详解

## 目录
- [内网穿透简介](#内网穿透简介)
- [方案对比](#方案对比)
- [FRP详细配置](#frp详细配置)
- [ZeroTier组网](#zerotier组网)
- [Tailscale组网](#tailscale组网)
- [NPS快速部署](#nps快速部署)
- [场景应用实例](#场景应用实例)

---

## 内网穿透简介

### 什么是内网穿透

内网穿透（NAT穿透）是将内网服务暴露到公网访问的技术。由于IPv4地址枯竭，大多数家庭网络没有公网IP，无法直接从外部访问内部设备。

### 常见应用场景

```
应用场景：
├── 远程访问家庭NAS
├── 远程桌面连接
├── 访问内网Web服务
├── 物联网设备远程管理
├── 开发调试Webhook
└── P2P直连传输
```

### 穿透原理

#### 1. 反向代理模式
```
用户 ──> 公网服务器(VPS) ──> 内网设备
       (有固定IP)         (通过客户端连接)
```

#### 2. P2P直连模式
```
用户 <────> 内网设备
   ↑ 通过NAT穿透直接连接 ↑
   (使用STUN/TURN协议)
```

---

## 方案对比

| 方案 | 类型 | 成本 | 速度 | 难度 | 推荐场景 |
|------|------|------|------|------|----------|
| **FRP** | 反向代理 | 需VPS | 快 | 中 | 稳定服务访问 |
| **ZeroTier** | P2P | 免费(25设备) | 快 | 低 | 组网、多设备 |
| **Tailscale** | P2P | 免费(100设备) | 快 | 低 | 团队、企业 |
| **NPS** | 反向代理 | 需VPS | 快 | 低 | Web管理、多用户 |
| **ngrok** | 反向代理 | 免费/付费 | 中等 | 低 | 开发调试 |
| **花生壳** | 反向代理 | 付费 | 慢 | 低 | 小白用户 |

### 方案选择建议

```
选择建议：
├── 有VPS，追求稳定 → FRP或NPS
├── 无VPS，轻量使用 → ZeroTier或Tailscale
├── 开发调试临时用 → ngrok免费版
├── 企业/团队组网 → Tailscale
└── 小白不求速度 → 花生壳
```

---

## FRP详细配置

### FRP架构

```
FRP架构：

公网服务器(frps)              内网设备(frpc)
┌──────────────┐             ┌──────────────┐
│ bind_port    │<────────────│ server_addr  │
│    :7000     │   控制连接   │  server_port │
├──────────────┤             ├──────────────┤
│ vhost_port   │<────────────│ local_port   │
│    :80/443   │   HTTP代理   │   :8080      │
├──────────────┤             ├──────────────┤
│ remote_port  │<────────────│ remote_port  │
│    :6000     │   TCP代理    │    :6000     │
└──────────────┘             └──────────────┘
```

### 服务端配置 (frps)

#### 1. 安装FRP

```bash
# 下载最新版
wget https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz

# 解压
tar -xzf frp_0.60.0_linux_amd64.tar.gz
cd frp_0.60.0_linux_amd64

# 复制到系统目录
mkdir -p /etc/frp
cp frps /usr/local/bin/
cp frps.toml /etc/frp/
```

#### 2. 配置frps.toml

```toml
# /etc/frp/frps.toml

# 监听端口
bindPort = 7000

# 认证token
token = "your_secure_token_123"

# 仪表板配置
dashboardPort = 7500
dashboardUser = "admin"
dashboardPwd = "admin_password"

# 日志
log.to = "/var/log/frps.log"
log.level = "info"
log.maxDays = 30

# 心跳检测
heartbeatTimeout = 90

# 允许端口范围
allowPorts = [
  { start = 6000, end = 7000 }
]
```

#### 3. 创建systemd服务

```bash
# /etc/systemd/system/frps.service
[Unit]
Description=FRP Server Service
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.toml

[Install]
WantedBy=multi-user.target
```

```bash
# 启动服务
systemctl daemon-reload
systemctl enable frps
systemctl start frps

# 查看状态
systemctl status frps
```

### 客户端配置 (frpc)

#### 1. 安装（Linux/macOS）

```bash
# 下载对应版本
tar -xzf frp_0.60.0_linux_amd64.tar.gz
cd frp_0.60.0_linux_amd64
cp frpc /usr/local/bin/
mkdir -p /etc/frp
cp frpc.toml /etc/frp/
```

#### 2. 配置frpc.toml

```toml
# /etc/frp/frpc.toml

serverAddr = "你的VPS_IP"
serverPort = 7000
token = "your_secure_token_123"

# Web服务穿透
[[proxies]]
name = "web"
type = "http"
localPort = 8080
customDomains = ["your-domain.com"]

# SSH穿透
[[proxies]]
name = "ssh"
type = "tcp"
localPort = 22
remotePort = 6000

# NAS管理界面
[[proxies]]
name = "nas"
type = "http"
localPort = 5000
customDomains = ["nas.your-domain.com"]
```

#### 3. 创建服务

```bash
# /etc/systemd/system/frpc.service
[Unit]
Description=FRP Client Service
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/frpc -c /etc/frp/frpc.toml

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable frpc
systemctl start frpc
```

### FRP + Nginx（HTTPS）

```nginx
# /etc/nginx/conf.d/frp.conf

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## ZeroTier组网

### 什么是ZeroTier

ZeroTier是虚拟局域网（VLAN）工具，通过P2P连接创建虚拟网络，让设备像在同一局域网内通信。

### 快速开始

#### 1. 注册账号

```
访问: https://my.zerotier.com
注册账号
创建Network，记录Network ID
```

#### 2. 安装客户端

**Linux:**
```bash
# 一键安装
curl -s https://install.zerotier.com | sudo bash

# 加入网络
zerotier-cli join <Network ID>

# 查看状态
zerotier-cli status
zerotier-cli listnetworks
```

**Windows/macOS:**
```
下载安装包，安装后点击Join Network，输入Network ID
```

#### 3. 授权设备

```
1. 登录 https://my.zerotier.com
2. 进入你的Network
3. 找到新加入的设备（显示在列表中）
4. 勾选Auth列的复选框授权
5. 分配固定IP（可选）
```

### 网络配置

```
ZeroTier虚拟网络：

子网: 192.168.192.0/24 (默认)

设备A (家里NAS)
├── ZT IP: 192.168.192.10
└── 物理IP: 192.168.1.50

设备B (公司电脑)
├── ZT IP: 192.168.192.20
└── 物理IP: 10.0.0.100

通信路径：
设备B ──> 192.168.192.10:22 ──> 访问NAS的SSH
（自动P2P直连或中继）
```

### 自建Moon节点（可选）

当P2P打洞失败时，使用Moon节点中继：

```bash
# 在有公网IP的服务器上部署Moon
zerotier-idtool initmoon identity.public > moon.json

# 编辑moon.json，修改stableEndpoints为公网IP

# 生成Moon文件
zerotier-idtool genmoon moon.json

# 创建moons.d目录，复制.moon文件
mkdir -p /var/lib/zerotier-one/moons.d
cp *.moon /var/lib/zerotier-one/moons.d/

# 重启ZeroTier
systemctl restart zerotier-one

# 客户端加入Moon
zerotier-cli orbit <moon_id> <moon_id>
```

---

## Tailscale组网

### Tailscale特点

- 基于WireGuard协议
- 支持100设备免费
- 自动NAT穿透
- 支持 exit node（出口节点）

### 快速开始

#### 1. 注册

```
访问: https://login.tailscale.com
使用Google/Microsoft/GitHub账号登录
```

#### 2. 安装

**Linux:**
```bash
# 一键安装
curl -fsSL https://tailscale.com/install.sh | sh

# 启动并登录
tailscale up

# 会显示登录链接，在浏览器中授权
```

**其他平台:**
```
下载客户端，登录同一账号即可自动组网
```

#### 3. 查看状态

```bash
# 查看设备列表
tailscale status

# 查看IP
tailscale ip -4

# ping其他设备
tailscale ping <hostname>
```

### 高级功能

#### Exit Node（全局代理）

```bash
# 在出口节点服务器上启用
sudo tailscale up --advertise-exit-node

# 在客户端使用
sudo tailscale up --exit-node=<exit-node-ip>

# 查看可用的exit node
tailscale exit-node list
```

#### Subnet Router（子网路由）

```bash
# 让其他设备访问整个子网
sudo tailscale up --advertise-routes=192.168.1.0/24,10.0.0.0/24

# 在控制台启用路由
# https://login.tailscale.com/admin/machines
```

---

## NPS快速部署

### NPS特点

- Web管理界面
- 多用户支持
- 可视化配置

### 服务端部署

#### 1. 下载安装

```bash
# 下载
wget https://github.com/ehang-io/nps/releases/download/v0.26.10/linux_amd64_server.tar.gz

# 解压
tar -xzf linux_amd64_server.tar.gz
mkdir -p /opt/nps
mv * /opt/nps/
cd /opt/nps
```

#### 2. 启动

```bash
# 安装并启动
./nps install
./nps start

# 默认端口
# Web管理: http://IP:8080
# 用户名: admin
# 密码: 123
```

#### 3. 配置

```ini
# conf/nps.conf
web_username=admin
web_password=your_password
web_port=8080
bridge_port=8024
public_vkey=your_secret_key
```

### 客户端连接

```bash
# 下载客户端
wget https://github.com/ehang-io/nps/releases/download/v0.26.10/linux_amd64_client.tar.gz

# 解压运行
./npc -server=你的IP:8024 -vkey=your_secret_key -type=tcp
```

---

## 场景应用实例

### 场景1：远程访问NAS

**需求**: 在外访问家里的TrueNAS

**方案**: FRP HTTP代理

```toml
# frpc.toml
[[proxies]]
name = "nas"
type = "http"
localPort = 80
customDomains = ["nas.yourdomain.com"]
```

### 场景2：远程SSH服务器

**需求**: SSH连接内网服务器

**方案**: FRP TCP端口转发

```toml
# frpc.toml
[[proxies]]
name = "ssh"
type = "tcp"
localPort = 22
remotePort = 6000

# 连接方式: ssh -p 6000 user@vps_ip
```

### 场景3：异地组网

**需求**: 公司和家里网络互通

**方案**: ZeroTier或Tailscale

```
配置:
├── 公司电脑加入ZeroTier
├── 家里NAS加入ZeroTier
└── 互相访问ZT分配的IP即可

公司电脑: 192.168.192.20 ──> 192.168.192.10 ──> 家里NAS
```

### 场景4：远程桌面

**需求**: RDP远程Windows电脑

**方案**: FRP TCP

```toml
# frpc.toml
[[proxies]]
name = "rdp"
type = "tcp"
localPort = 3389
remotePort = 13389

# 连接: mstsc -> vps_ip:13389
```

---

## 安全建议

### 1. 使用强认证

```
FRP: 设置复杂token
ZeroTier: 开启网络认证
NPS: 修改默认密码
```

### 2. 限制访问IP

```toml
# frps.toml
allowPorts = [
  { start = 6000, end = 6100 }
]
```

### 3. 使用HTTPS

```
所有Web服务使用HTTPS
使用Nginx反向代理+SSL证书
```

### 4. 防火墙设置

```bash
# 只允许必要端口
ufw allow 7000/tcp
ufw allow 7500/tcp
ufw allow 6000:7000/tcp
```

---

**最后更新**: 2026年2月
