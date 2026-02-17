# 自建VPS服务器搭建指南

## 目录
- [准备工作](#准备工作)
- [VPS选购指南](#vps选购指南)
- [3X-UI面板搭建](#3x-ui面板搭建)
- [Reality协议配置](#reality协议配置)
- [BBR加速优化](#bbr加速优化)
- [日常维护与管理](#日常维护与管理)

---

## 准备工作

### 需要的工具

| 工具 | 用途 | 下载地址 |
|------|------|----------|
| **SSH客户端** | 连接VPS服务器 | FinalShell, Termius, PuTTY |
| **域名** | SSL证书和伪装 | Namesilo, Cloudflare |
| **VPS服务器** | 部署代理服务 | DMIT, Vultr, 搬瓦工 |

### 域名购买与配置

#### 1. 购买域名
推荐Namesilo（便宜且送隐私保护）:
1. 访问 [namesilo.com](https://namesilo.com)
2. 搜索想要的域名
3. 注册账号并购买
4. 开启WHOIS隐私保护

#### 2. 配置Cloudflare DNS
```
步骤：
1. 注册Cloudflare账号
2. 添加域名
3. 修改Namesilo的NS服务器为Cloudflare提供的
4. 等待DNS生效（通常几分钟到几小时）
5. 添加A记录指向VPS IP
```

---

## VPS选购指南

### 线路类型对比

| 线路类型 | 特点 | 价格 | 推荐度 |
|----------|------|------|--------|
| **CN2 GIA** | 电信精品网，直连 | 较高 | ⭐⭐⭐⭐⭐ |
| **CN2 GT** | 电信普通CN2 | 中等 | ⭐⭐⭐⭐ |
| **BGP** | 三网优化 | 中等 | ⭐⭐⭐⭐ |
| **普通线路** | 国际出口 | 便宜 | ⭐⭐⭐ |

### 推荐VPS商家

#### 高端选择（¥50-100/月）

| 商家 | 特点 | 价格 | 链接 |
|------|------|------|------|
| **DMIT** | CN2 GIA，速度快 | $10-20/月 | dmit.io |
| **搬瓦工** | 老牌稳定，Just My Socks | $5-10/月 | bandwagonhost.com |

#### 性价比选择（¥20-50/月）

| 商家 | 特点 | 价格 | 链接 |
|------|------|------|------|
| **Vultr** | 按小时计费，随时换IP | $5/月起 | vultr.com |
| **HostDare** | 便宜CN2 GIA | $20-40/年 | hostdare.com |

#### 入门选择（¥10-20/月）

| 商家 | 特点 | 价格 | 链接 |
|------|------|------|------|
| **Racknerd** | 超低价年付 | $10-20/年 | racknerd.com |
| **CloudCone** | 洛杉矶机房 | $15/年 | cloudcone.com |

### 系统选择

推荐 **Debian 11/12** 或 **Ubuntu 20.04/22.04**:
- 社区支持好
- 教程丰富
- 稳定性高

---

## 3X-UI面板搭建

### 什么是3X-UI

3X-UI是基于Xray核心的可视化面板，支持：
- VMess / VLESS / Trojan / Shadowsocks
- XTLS / Reality / Vision
- 多用户管理
- 流量统计
- IP限制
- 到期时间管理

### 一键安装脚本

#### 方式一：官方安装脚本
```bash
# 安装3X-UI
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

#### 方式二：国内加速安装
```bash
# 使用GitHub代理加速
bash <(curl -Ls https://mirror.ghproxy.com/https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

### 安装过程

```
安装步骤：
1. 运行安装脚本
2. 设置面板端口（默认2053）
3. 设置面板路径（默认随机）
4. 设置用户名和密码
5. 等待安装完成

安装完成后会显示：
- 面板访问地址
- 用户名
- 密码
```

### 面板访问与配置

#### 访问面板
```
地址: https://你的VPS_IP:2053/设置的路径
示例: https://1.2.3.4:2053/xui
```

⚠️ **注意**: 使用HTTPS访问，浏览器会提示证书不安全，选择继续访问

#### 基础设置

1. **修改默认设置**
   ```
   面板设置 -> 基础设置
   ├── 面板端口: 修改为非默认端口
   ├── 面板路径: 修改为非默认路径
   ├── 用户名: 修改
   └── 密码: 设置强密码
   ```

2. **配置Telegram机器人**（可选）
   ```
   面板设置 -> Telegram机器人设置
   ├── 启用机器人: 开启
   ├── 机器人Token: 从@BotFather获取
   └── 用户ID: 从@userinfobot获取
   ```

---

## Reality协议配置

### 什么是Reality

Reality是2023年推出的TLS指纹伪装技术：
- **无服务端TLS指纹**: 消除服务器特征
- **目的地伪装**: 向真实网站发起握手
- **前向保密**: 保持TLS 1.3安全特性

### 创建VLESS+Reality节点

#### 步骤1：进入入站列表
```
面板 -> 入站列表 -> 添加入站
```

#### 步骤2：基础配置
```
基本信息：
├── 备注: 节点名称（如：美国-Reality）
├── 协议: VLESS
├── 端口: 443（推荐）
└── 传输: tcp
```

#### 步骤3：安全设置
```
安全设置：
├── 安全: reality
├── reality模式: 自动生成
├── 目标网站: www.bilibili.com（推荐）
├── 服务器名称: www.bilibili.com
└── 公钥: 点击生成
```

#### 步骤4：客户端ID
```
客户端设置：
├── UUID: 点击生成
├── 流控: xtls-rprx-vision
└── 加密: none
```

#### 步骤5：完成配置
点击"添加"后，面板会显示：
- 分享链接
- 二维码
- 客户端配置JSON

### Reality配置示例

```json
{
  "v": "2",
  "ps": "美国-Reality",
  "add": "你的VPS_IP",
  "port": "443",
  "id": "你的UUID",
  "net": "tcp",
  "type": "none",
  "host": "",
  "path": "",
  "tls": "reality",
  "sni": "www.bilibili.com",
  "fp": "chrome",
  "pbk": "你的公钥",
  "sid": "你的ShortID",
  "spx": "/"
}
```

### 推荐的目标网站

| 网站 | 域名 | 说明 |
|------|------|------|
| **B站** | www.bilibili.com | 推荐，国内访问正常 |
| **淘宝** | www.taobao.com | 电商网站 |
| **京东** | www.jd.com | 电商网站 |
| **百度** | www.baidu.com | 搜索引擎 |
| **知乎** | www.zhihu.com | 内容社区 |

**选择原则**:
1. 国内可以正常访问
2. 使用TLS 1.3
3. 访问量大，不突兀

---

## BBR加速优化

### 什么是BBR

BBR (Bottleneck Bandwidth and Round-trip propagation time) 是Google开发的TCP拥塞控制算法，可以：
- 提升网络吞吐量
- 降低延迟
- 改善网络稳定性

### 检查当前拥塞控制算法

```bash
# 查看当前算法
sysctl net.ipv4.tcp_congestion_control

# 输出示例：
# net.ipv4.tcp_congestion_control = cubic
```

### 开启BBR

#### 方法1：脚本自动开启
```bash
# 使用3X-UI自带功能
# 面板 -> 其他设置 -> BBR设置 -> 开启
```

#### 方法2：手动配置
```bash
# 编辑sysctl配置
echo 'net.core.default_qdisc=fq' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf

# 应用配置
sysctl -p

# 验证开启
sysctl net.ipv4.tcp_available_congestion_control
lsmod | grep bbr
```

### BBR版本对比

| 版本 | 特点 | 推荐度 |
|------|------|--------|
| **BBR** | 原版 | ⭐⭐⭐⭐ |
| **BBR Plus** | 优化版 | ⭐⭐⭐⭐⭐ |
| **BBR2** | 实验版 | ⭐⭐⭐⭐ |

### 安装BBR Plus

```bash
# 一键安装脚本
wget -N --no-check-certificate "https://raw.githubusercontent.com/chiakge/Linux-NetSpeed/master/tcp.sh"
chmod +x tcp.sh
./tcp.sh
```

选择菜单：
- 选项5: 安装BBR Plus内核
- 重启后再次运行，选择选项7: 开启BBR Plus加速

### 其他优化参数

```bash
# 编辑 /etc/sysctl.conf
cat >> /etc/sysctl.conf << EOF
# 文件描述符限制
fs.file-max = 65535

# TCP连接优化
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535

# TCP内存优化
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# 连接跟踪优化
net.netfilter.nf_conntrack_max = 65536
net.netfilter.nf_conntrack_tcp_timeout_established = 600

# 启用SYN Cookies
net.ipv4.tcp_syncookies = 1
EOF

# 应用配置
sysctl -p
```

---

## 日常维护与管理

### 面板管理命令

```bash
# 3X-UI管理脚本
x-ui              # 显示管理菜单
x-ui start        # 启动面板
x-ui stop         # 停止面板
x-ui restart      # 重启面板
x-ui status       # 查看状态
x-ui log          # 查看日志
x-ui update       # 更新面板
x-ui uninstall    # 卸载面板
```

### 查看服务状态

```bash
# 查看Xray状态
systemctl status xray

# 查看Xray日志
journalctl -u xray -f

# 查看系统资源占用
top
htop
```

### 备份与恢复

#### 备份配置
```bash
# 导出数据库
# 面板 -> 其他设置 -> 备份与恢复 -> 导出

# 手动备份
sqlite3 /etc/x-ui/x-ui.db ".dump" > x-ui-backup.sql
```

#### 恢复配置
```bash
# 导入数据库
# 面板 -> 其他设置 -> 备份与恢复 -> 导入

# 手动恢复
systemctl stop x-ui
sqlite3 /etc/x-ui/x-ui.db < x-ui-backup.sql
systemctl start x-ui
```

### 用户管理

#### 添加用户
```
入站列表 -> 编辑 -> 客户端列表
├── 添加客户端
├── 设置UUID
├── 设置流量限制
├── 设置到期时间
└── 设置IP限制
```

#### 流量监控
```
面板首页显示：
├── 总流量统计
├── 各节点流量
├── 在线用户数
└── 系统资源使用
```

### 安全加固

#### 1. 修改SSH端口
```bash
# 编辑SSH配置
nano /etc/ssh/sshd_config

# 修改以下行
Port 你的自定义端口
PermitRootLogin no
PasswordAuthentication no  # 如果使用密钥登录

# 重启SSH
systemctl restart sshd
```

#### 2. 配置防火墙
```bash
# 安装ufw
apt install ufw -y

# 默认策略
ufw default deny incoming
ufw default allow outgoing

# 允许必要端口
ufw allow 你的SSH端口/tcp
ufw allow 443/tcp
ufw allow 你的面板端口/tcp

# 启用防火墙
ufw enable
```

#### 3. 启用fail2ban
```bash
# 安装fail2ban
apt install fail2ban -y

# 配置
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 你的SSH端口
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

# 启动
systemctl restart fail2ban
```

### 定期维护清单

```
每周检查：
□ 流量使用情况
□ 节点连通性
□ 系统资源使用
□ 日志异常

每月检查：
□ 更新面板到最新版
□ 系统安全更新
□ 备份配置
□ 检查用户到期情况

每季度：
□ 更换目标网站
□ 更换UUID（可选）
□ 评估VPS性能
```

---

## 常见问题排查

### 问题1：无法连接节点

```bash
# 检查Xray是否运行
systemctl status xray

# 检查端口监听
netstat -tulnp | grep xray

# 检查防火墙
ufw status

# 检查日志
journalctl -u xray -n 50
```

### 问题2：速度慢

```bash
# 检查服务器带宽
speedtest-cli

# 检查BBR是否开启
sysctl net.ipv4.tcp_congestion_control

# 检查是否被限速
# 更换端口尝试
```

### 问题3：面板无法访问

```bash
# 检查面板状态
x-ui status

# 重启面板
x-ui restart

# 检查端口占用
netstat -tulnp | grep 你的面板端口
```

---

## 总结

### 搭建流程回顾

```
1. 购买VPS和域名
2. 配置DNS解析
3. 安装3X-UI面板
4. 创建VLESS+Reality节点
5. 开启BBR加速
6. 配置客户端连接
7. 定期维护
```

### 推荐配置组合

**最佳隐蔽性**:
- 协议: VLESS + Reality + Vision
- 目标网站: www.bilibili.com
- 端口: 443

**最佳速度**:
- 协议: Hysteria2
- 端口: 443
- BBR Plus加速

**最佳兼容性**:
- 协议: Trojan
- 端口: 443
- WebSocket+TLS

---

**最后更新**: 2026年2月

**免责声明**: 本文仅供技术学习交流，请遵守当地法律法规。
