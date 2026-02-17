---
sidebar: auto
---

# 内网穿透方案

## 概述

内网穿透技术允许外网访问位于NAT或防火墙后的内网设备和服务，是家庭服务器、NAS、远程办公的重要工具。本章介绍多种内网穿透方案的原理、配置和选择建议。

## 方案对比 (2026)

### 主流方案对比表

| 方案 | 原理 | 配置难度 | 速度 | 成本 | 适用场景 |
|------|------|----------|------|------|----------|
| **FRP** | 反向代理 | ⭐⭐⭐⭐ | 快 | 云服务器费用 | 技术人员、固定场景 |
| **NPS** | 反向代理+Web管理 | ⭐⭐⭐ | 快 | 云服务器费用 | 小型团队 |
| **ZeroTier** | P2P虚拟局域网 | ⭐⭐⭐ | 快(直连时) | 免费(25设备) | 跨国组网 |
| **Tailscale** | P2P+中继 | ⭐⭐ | 快 | 免费(100设备) | 国外用户 |
| **Netbird** | P2P开源方案 | ⭐⭐ | 快 | 免费 | 注重隐私 |
| **Cloudflare Tunnel** | 云服务反向代理 | ⭐⭐⭐ | 中等 | 免费 | Web服务 |
| **ngrok** | 第三方反向代理 | ⭐⭐ | 中等 | 免费/付费 | 临时演示 |
| **花生壳** | 第三方中继 | ⭐ | 慢 | 付费 | 小白用户 |

### 2026年推荐选择

**截至2026年1月的最新评估：**

- **拥有服务器用户**：推荐 **FRP**
- **拥有域名用户**：推荐 **Cloudflare Tunnel**
- **大多数用户**：推荐 **ZeroTier** 或 **Tailscale**
- **追求完全开源**：推荐 **Netbird**（唯一一个客户端到服务器端都全部开源的方案）

## FRP详细配置

### FRP简介

FRP（Fast Reverse Proxy）是一个高性能的反向代理应用，支持TCP、UDP、HTTP、HTTPS等多种协议。

**核心优势：**
- 高性能、低延迟
- 支持多种协议
- 配置灵活，功能强大
- 开源免费，社区活跃

### 服务端部署

#### 安装FRP Server

**下载最新版本：**
```bash
# 下载FRP（检查最新版本）
wget https://github.com/fatedier/frp/releases/download/v0.52.0/frp_0.52.0_linux_amd64.tar.gz

# 解压
tar -xzf frp_0.52.0_linux_amd64.tar.gz
cd frp_0.52.0_linux_amd64

# 移动到系统目录
mv frps /usr/local/bin/
mkdir -p /etc/frp
mv frps.ini /etc/frp/
```

#### 配置frps.ini

**基础配置：**
```ini
[common]
# FRP服务端监听端口
bind_port = 7000

# 认证token（客户端需要相同）
token = your_secret_token_here

# 仪表盘端口（可选）
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = your_dashboard_password

# 日志配置
log_file = /var/log/frps.log
log_level = info
log_max_days = 3

# vhost HTTP端口
vhost_http_port = 80
vhost_https_port = 443
```

**高级配置：**
```ini
[common]
bind_port = 7000
token = your_secret_token_here

# 允许的端口范围
allow_ports = 2000-3000,3001,3003,4000-50000

# TCP多路复用
tcp_mux = true

# 心跳配置
heartbeat_timeout = 90

# 最大连接池
max_pool_count = 5

# 子域名配置
subdomain_host = yourdomain.com

# 自定义404页面
custom_404_page = /etc/frp/404.html
```

#### 创建systemd服务

```ini
# /etc/systemd/system/frps.service
[Unit]
Description=FRP Server Service
After=network.target

[Service]
Type=simple
User=nobody
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.ini
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

**启动服务：**
```bash
systemctl daemon-reload
systemctl start frps
systemctl enable frps
systemctl status frps
```

### 客户端配置

#### 安装FRP Client

```bash
# 下载（Linux示例）
wget https://github.com/fatedier/frp/releases/download/v0.52.0/frp_0.52.0_linux_amd64.tar.gz
tar -xzf frp_0.52.0_linux_amd64.tar.gz

# Windows用户下载对应版本
# macOS用户下载darwin版本
```

#### 配置frpc.ini

**基础配置示例：**
```ini
[common]
# 服务器地址
server_addr = your_server_ip
server_port = 7000
token = your_secret_token_here

# 日志配置
log_file = /var/log/frpc.log
log_level = info

# 启用TCP多路复用
tcp_mux = true

# HTTP代理（穿透Web服务）
[web]
type = http
local_ip = 127.0.0.1
local_port = 80
custom_domains = your-domain.com

# HTTPS服务
[web_https]
type = https
custom_domains = your-domain.com
plugin = https2http
plugin_local_addr = 127.0.0.1:80

# SSH穿透
[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000

# RDP远程桌面
[rdp]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 7001

# 文件服务器
[file_server]
type = tcp
local_ip = 192.168.1.100
local_port = 445
remote_port = 8445
```

**群晖NAS配置：**
```ini
[common]
server_addr = your_server_ip
server_port = 7000
token = your_secret_token_here

# DSM Web界面
[dsm]
type = https
custom_domains = nas.yourdomain.com
plugin = https2https
plugin_local_addr = 192.168.1.100:5001
plugin_host_header_rewrite = 192.168.1.100

# Photo Station
[photo]
type = http
custom_domains = photo.yourdomain.com
local_ip = 192.168.1.100
local_port = 80
```

#### Windows客户端systemd替代

**创建Windows服务（管理员权限）：**
```batch
# 使用NSSM工具
nssm install frpc "C:\frp\frpc.exe" "-c" "C:\frp\frpc.ini"
nssm set frpc AppDirectory "C:\frp"
nssm set frpc DisplayName "FRP Client"
nssm set frpc Description "FRP内网穿透客户端"
nssm set frpc Start SERVICE_AUTO_START
```

### 安全加固

**服务端防火墙：**
```bash
# 仅开放必要端口
ufw allow 7000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7500/tcp  # 仪表盘（可选）
```

**启用TLS加密：**
```ini
# frps.ini
[common]
tls_enable = true

# frpc.ini  
[common]
tls_enable = true
```

## ZeroTier配置

### ZeroTier简介

ZeroTier是基于P2P技术的虚拟局域网解决方案，能够在任何网络环境下建立加密的点对点连接。

**核心特性：**
- P2P直连，速度快
- 免费版支持25设备
- 跨平台支持（Windows/macOS/Linux/iOS/Android）
- NAT穿透能力强

### 创建网络

1. **注册账号**
   - 访问 [ZeroTier Central](https://my.zerotier.com/)
   - 注册并登录

2. **创建Network**
   ```
   点击 "Create A Network"
   记录Network ID（16位字符）
   ```

3. **网络设置**
   ```
   Network Name: 自定义名称
   Access Control: Private（需要授权）
   IP Range: 自动分配或手动设置（如：192.168.192.0/24）
   ```

### 客户端安装

#### Linux安装

```bash
# 官方安装脚本
curl -s https://install.zerotier.com | sudo bash

# 加入网络
sudo zerotier-cli join <network_id>

# 查看状态
sudo zerotier-cli status
sudo zerotier-cli listnetworks
```

#### Windows/macOS安装

1. 下载客户端
   - Windows: [ZeroTier One](https://www.zerotier.com/download/)
   - macOS: 同上

2. 安装并启动

3. 加入网络
   ```
   右键托盘图标 → Join Network
   输入Network ID
   ```

#### Android/iOS安装

- **Android**: Google Play Store搜索"ZeroTier"
- **iOS**: App Store搜索"ZeroTier"

### 授权设备

```
返回ZeroTier Central
Members标签页
勾选设备前的Auth复选框
分配IP地址（可选）
```

### 群晖NAS接入ZeroTier

**套件中心安装：**
```
1. 打开套件中心
2. 搜索"ZeroTier"
3. 安装并打开
4. 输入Network ID
5. 加入网络
6. 在ZeroTier Central授权设备
```

## Tailscale配置

### Tailscale简介

Tailscale基于WireGuard协议，提供更简单的P2P组网方案，在国外用户中极为流行。

**核心优势：**
- 基于WireGuard，安全性高
- 配置极其简单
- 免费版支持100设备
- 自动NAT穿透
- ACL访问控制

### 快速开始

#### 安装客户端

**Linux：**
```bash
# 官方安装脚本
curl -fsSL https://tailscale.com/install.sh | sh

# 启动并登录
sudo tailscale up

# 查看状态
tailscale status
```

**Windows/macOS：**
- 下载 [Tailscale客户端](https://tailscale.com/download)
- 安装并登录（使用Google/Microsoft/GitHub账号）

#### 设备互联

```
1. 所有设备安装Tailscale并登录同一账号
2. 自动组网，无需额外配置
3. 使用Tailscale分配的IP互相访问
```

### 高级功能

#### Exit Node（出口节点）

**设置设备为Exit Node：**
```bash
# 广告该设备为Exit Node
sudo tailscale up --advertise-exit-node

# 在管理后台批准
# https://login.tailscale.com/admin/machines
```

**使用Exit Node：**
```bash
# 选择Exit Node
tailscale up --exit-node=<exit-node-ip>

# 停止使用
tailscale up --exit-node=
```

#### Subnet Router（子网路由）

**共享本地网段：**
```bash
# 广告本地子网
sudo tailscale up --advertise-routes=192.168.1.0/24

# 启用IP转发
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 在管理后台批准子网路由
```

#### MagicDNS

自动为设备分配域名：
```
设置 → DNS → MagicDNS → 启用
访问：device-name.tail-scale.ts.net
```

## Cloudflare Tunnel配置

### Cloudflare Tunnel简介

Cloudflare Tunnel（原Argo Tunnel）将内网服务安全地暴露到公网，无需开放端口或配置防火墙。

**核心优势：**
- 完全免费
- 无需公网IP
- 自动HTTPS
- DDoS防护
- 无流量限制

### 安装cloudflared

**Linux：**
```bash
# 下载最新版本
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# 或使用包管理器
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
```

**Windows/macOS：**
- 下载对应平台安装包
- [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases)

### 创建Tunnel

**1. 登录Cloudflare：**
```bash
cloudflared tunnel login
```
浏览器自动打开，选择要使用的域名。

**2. 创建Tunnel：**
```bash
cloudflared tunnel create my-tunnel
```
记录Tunnel ID和凭证文件路径。

**3. 配置路由：**
```bash
cloudflared tunnel route dns my-tunnel tunnel.yourdomain.com
```

**4. 创建配置文件：**
```yaml
# ~/.cloudflared/config.yml
tunnel: <tunnel-id>
credentials-file: /path/to/credentials.json

ingress:
  # Web服务
  - hostname: tunnel.yourdomain.com
    service: http://localhost:80
  
  # SSH服务  
  - hostname: ssh.yourdomain.com
    service: ssh://localhost:22
  
  # 其他服务
  - hostname: nas.yourdomain.com
    service: https://192.168.1.100:5001
    originRequest:
      noTLSVerify: true
  
  # 默认规则（必须）
  - service: http_status:404
```

**5. 运行Tunnel：**
```bash
# 测试运行
cloudflared tunnel run my-tunnel

# 安装为系统服务
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared
```

### 多服务配置

```yaml
tunnel: <tunnel-id>
credentials-file: /root/.cloudflared/credentials.json

ingress:
  # 主站
  - hostname: www.yourdomain.com
    service: http://localhost:80
  
  # 博客
  - hostname: blog.yourdomain.com
    service: http://localhost:8080
  
  # 文件服务器
  - hostname: files.yourdomain.com
    service: http://192.168.1.100:8000
  
  # Jellyfin媒体服务器
  - hostname: media.yourdomain.com
    service: http://192.168.1.100:8096
  
  - service: http_status:404
```

## 其他方案

### Netbird

**完全开源的WireGuard管理平台**

**快速开始：**
```bash
# 安装客户端
wget https://github.com/netbirdio/netbird/releases/latest/download/netbird_linux_amd64.tar.gz
tar -xzf netbird_linux_amd64.tar.gz
sudo mv netbird /usr/local/bin/

# 启动并登录
netbird up
```

### ngrok

**临时演示和开发测试**

```bash
# 安装ngrok
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# 添加authtoken
ngrok config add-authtoken <your-token>

# 启动HTTP隧道
ngrok http 80

# 启动TCP隧道
ngrok tcp 22
```

## 方案选择建议

### 根据场景选择

**个人家庭使用：**
- 简单易用：**Tailscale** 或 **ZeroTier**
- 注重隐私：**Netbird**
- 有公网服务器：**FRP**

**小型团队/企业：**
- 专业方案：**FRP** + VPS
- 快速部署：**Tailscale** Teams版
- Web服务：**Cloudflare Tunnel**

**临时需求：**
- 开发测试：**ngrok**
- 演示展示：**ngrok** 或 **Cloudflare Tunnel**

### 性能对比

| 方案 | 直连速度 | 中继速度 | NAT穿透率 |
|------|----------|----------|-----------|
| FRP | ⭐⭐⭐⭐⭐ | N/A | N/A |
| ZeroTier | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Tailscale | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cloudflare | ⭐⭐⭐⭐ | N/A | ⭐⭐⭐⭐⭐ |

---

**更新时间：** 2026年2月
**下一章：** [家庭NAS方案](./nas.md)
**返回目录：** [科学上网完全指南](./README.md)
