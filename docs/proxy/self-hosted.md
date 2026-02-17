---
sidebar: auto
---

# 自建服务器搭建指南

## 概述

自建服务器相比使用机场服务，具有更高的安全性、隐私性和可控性。本指南详细介绍从VPS选择到协议部署的完整流程。

## VPS服务商推荐 (2026)

### 顶级线路VPS

| 服务商 | 特点 | 价格范围 | 推荐线路 | 速度评价 |
|--------|------|----------|----------|----------|
| **搬瓦工 (BandwagonHost)** | 老牌稳定，速度快，晚高峰不掉链子，中国大陆访问海外速度天花板 | $5-10/月 | 洛杉矶/香港 CN2 GIA，日本软银 | ⭐⭐⭐⭐⭐ |
| **DMIT** | CN2 GIA线路，速度快，企业级稳定性 | $10-20/月 | 美西CN2 GIA | ⭐⭐⭐⭐⭐ |
| **VMISS** | 美国洛杉矶VPS提供三网CN2 GIA高端网络 | 待查 | 美国洛杉矶 CN2 GIA | ⭐⭐⭐⭐⭐ |
| **GigsGigsCloud** | 日本、美国CN2 GIA/CTG线路，电信联通双程优化 | 待查 | 日本 SimpleCloud V，美国 SimpleCloud V | ⭐⭐⭐⭐ |

### 性价比VPS

| 服务商 | 特点 | 价格范围 | 推荐线路 | 适用场景 |
|--------|------|----------|----------|----------|
| **Vultr** | 按小时计费，随时换IP，使用普通BGP线路 | $5/月起 | 日本东京、韩国首尔、新加坡等全球多地机房 | 轻度使用，临时需求 |
| **HostDare** | 便宜CN2 GIA | $20-40/年 | 美西CN2 | 预算有限用户 |
| **Racknerd** | 超低价年付 | $10-20/年 | 美西 | 入门用户 |
| **狗云 (DogYun)** | 主打便宜的CN2 GIA套餐，最具性价比之一 | 待查 | 双程CN2 GIA | 性价比追求者 |
| **AkileCloud** | 全球多机房覆盖，支持CN2/GIA | 待查 | CN2/GIA | 多地区需求 |

### 搬瓦工CN2 GIA套餐详情 (2026年推荐)

**CN2 GIA-E 套餐（推荐）：**
- **配置**：1GB内存 / 2核CPU / 20GB硬盘 / 1TB流量 / 2.5Gbps带宽
- **价格**：**$49.99/季度** 或 **$169.99/年**
- **机房选择**：DC6 CN2 GIA-E、DC9 CN2 GIA、日本软银等
- **特点**：如果主要目标是在中国大陆建站或科学上网，这是首选

## 线路类型对比

### CN2 GIA vs 普通BGP

| 线路类型 | 延迟 | 稳定性 | 价格 | 适用场景 |
|---------|------|--------|------|----------|
| **CN2 GIA** | 低 | 高 | 高 | 对速度和稳定性要求高 |
| **CN2 GT** | 中 | 中 | 中 | 日常使用，性价比 |
| **普通BGP** | 高 | 低 | 低 | 轻度使用 |

**CN2 GIA特点：**
- 电信、联通、移动三网直连
- 晚高峰不拥堵
- 延迟稳定在150ms以内
- 适合流媒体、游戏加速

## 一键搭建脚本推荐

### 1. 3X-UI 面板 (⭐推荐)

基于Xray核心的可视化管理面板，功能最全面。

**特点：**
- ✅ 可视化Web面板管理
- ✅ 支持VMess/VLESS/Trojan/Shadowsocks/Reality
- ✅ 流量统计，多用户管理
- ✅ 内置SSL证书自动申请和续期
- ✅ 支持Telegram Bot通知

**安装命令：**
```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

**安装后访问：**
```
URL: http://your-server-ip:54321
默认用户名: admin
默认密码: admin
```

**首次配置步骤：**
1. 修改管理员密码
2. 创建入站配置（添加协议）
3. 生成订阅链接
4. 在客户端导入订阅

### 2. mack-a 八合一脚本

支持多种协议组合的一键脚本，适合高级用户。

**支持协议：**
- VLESS+Reality+Vision
- VLESS+TLS+WS
- Trojan+TLS
- VMess+TLS+WS
- Hysteria2
- Tuic v5

**安装命令：**
```bash
wget -P /root -N --no-check-certificate "https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh" && chmod 700 /root/install.sh && /root/install.sh
```

**使用步骤：**
1. 运行脚本后按照菜单选择
2. 选择要安装的协议组合
3. 输入域名（如需TLS）
4. 等待自动安装完成
5. 记录生成的节点信息

### 3. 233boy V2Ray脚本

轻量级的V2Ray一键脚本，适合新手。

**特点：**
- 支持绝大多数传输协议
- WebSocket + TLS
- HTTP/2传输
- 动态端口功能
- 集成BBR和锐速优化

**安装命令：**
```bash
bash <(curl -s -L https://git.io/v2ray.sh)
```

### 4. Hysteria2 官方脚本

针对Hysteria2协议的官方一键脚本。

**安装命令：**
```bash
bash <(curl -fsSL https://get.hy2.sh/)
```

**配置文件位置：**
```
/etc/hysteria/config.yaml
```

**示例配置：**
```yaml
listen: :443

tls:
  cert: /etc/hysteria/cert.pem
  key: /etc/hysteria/key.pem

auth:
  type: password
  password: your_password_here

masquerade:
  type: proxy
  proxy:
    url: https://www.bing.com
    rewriteHost: true
```

## 服务器优化配置

### 系统优化

#### 开启BBR加速

BBR是Google开发的TCP拥塞控制算法，可以显著提升网络速度。

```bash
# 检查当前内核版本（需要4.9+）
uname -r

# 开启BBR
echo 'net.core.default_qdisc=fq' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf
sysctl -p

# 验证BBR是否开启
sysctl net.ipv4.tcp_available_congestion_control
lsmod | grep bbr
```

**验证输出应包含：**
```
net.ipv4.tcp_available_congestion_control = reno cubic bbr
tcp_bbr                20480  X
```

#### 系统参数优化

```bash
# 编辑 /etc/sysctl.conf
cat >> /etc/sysctl.conf << 'EOL'
# 网络优化参数
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5000
EOL

# 应用配置
sysctl -p
```

### 安全加固

#### 修改SSH端口

```bash
# 编辑 /etc/ssh/sshd_config
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config

# 重启SSH服务
systemctl restart sshd
```

#### 配置防火墙

```bash
# 安装UFW（Ubuntu/Debian）
apt install ufw -y

# 允许SSH端口
ufw allow 2222/tcp

# 允许代理端口（根据实际情况调整）
ufw allow 443/tcp
ufw allow 80/tcp

# 启用防火墙
ufw enable
```

#### 禁用密码登录，使用密钥认证

```bash
# 在本地生成密钥对
ssh-keygen -t rsa -b 4096

# 上传公钥到服务器
ssh-copy-id -p 2222 root@your-server-ip

# 禁用密码登录
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# 重启SSH
systemctl restart sshd
```

## 域名配置（TLS必需）

### 域名购买推荐

| 注册商 | 特点 | 价格 |
|--------|------|------|
| **Namesilo** | 免费隐私保护，价格透明 | $8.99/年 |
| **Cloudflare** | 批发价，无隐藏费用 | 成本价 |
| **GoDaddy** | 知名度高，支持支付宝 | $11.99/年 |
| **Namecheap** | 首年优惠，界面友好 | $8.88/年 |

### 域名解析设置

**使用Cloudflare DNS（推荐）：**

1. 将域名NS记录改为Cloudflare
2. 添加A记录指向VPS IP
3. 关闭橙色云朵（代理模式）
4. 等待DNS生效（通常5-10分钟）

**DNS记录配置：**
```
类型: A
名称: proxy
内容: your-server-ip
代理状态: 仅DNS（灰色云朵）
TTL: 自动
```

### SSL证书申请

#### 使用acme.sh自动申请

```bash
# 安装acme.sh
curl https://get.acme.sh | sh

# 设置Cloudflare API
export CF_Key="your_cloudflare_api_key"
export CF_Email="your_email@example.com"

# 申请证书
~/.acme.sh/acme.sh --issue --dns dns_cf -d proxy.yourdomain.com

# 安装证书到指定目录
~/.acme.sh/acme.sh --install-cert -d proxy.yourdomain.com \
--key-file /etc/v2ray/key.pem \
--fullchain-file /etc/v2ray/cert.pem \
--reloadcmd "systemctl restart v2ray"
```

## 协议部署详解

### VLESS+Reality+Vision 部署

**优势：**
- 最高隐蔽性
- 无需域名
- 消除TLS指纹

**3X-UI配置步骤：**
1. 登录3X-UI面板
2. 添加入站 → 选择VLESS
3. 传输协议选择TCP
4. 安全传输选择Reality
5. 配置Reality参数：
   - Dest: www.microsoft.com:443
   - ServerNames: www.microsoft.com
   - 自动生成私钥和短ID
6. 保存并启动

### Hysteria2 部署

**优势：**
- 速度最快
- 低延迟
- 抗丢包

**配置文件示例：**
```yaml
# /etc/hysteria/config.yaml
listen: :443

tls:
  cert: /etc/hysteria/cert.pem
  key: /etc/hysteria/key.pem

auth:
  type: password
  password: your_strong_password

masquerade:
  type: proxy
  proxy:
    url: https://www.bing.com
    rewriteHost: true

bandwidth:
  up: 1 gbps
  down: 1 gbps
```

### Trojan 部署

**优势：**
- 完全模拟HTTPS
- 稳定可靠

**使用trojan-go：**
```bash
# 下载trojan-go
wget https://github.com/p4gefau1t/trojan-go/releases/download/v0.10.6/trojan-go-linux-amd64.zip
unzip trojan-go-linux-amd64.zip
mv trojan-go /usr/local/bin/

# 创建配置文件
cat > /etc/trojan-go/config.json << 'EOL'
{
  "run_type": "server",
  "local_addr": "0.0.0.0",
  "local_port": 443,
  "remote_addr": "127.0.0.1",
  "remote_port": 80,
  "password": [
    "your_password_here"
  ],
  "ssl": {
    "cert": "/etc/trojan-go/cert.pem",
    "key": "/etc/trojan-go/key.pem"
  }
}
EOL

# 启动服务
trojan-go -config /etc/trojan-go/config.json
```

## 故障排除

### 常见问题

#### 1. 连接超时
**排查步骤：**
```bash
# 检查服务状态
systemctl status v2ray

# 检查端口监听
netstat -tulpn | grep 443

# 检查防火墙
ufw status

# 测试端口通畅
telnet your-server-ip 443
```

#### 2. 证书错误
**解决方法：**
```bash
# 重新申请证书
~/.acme.sh/acme.sh --renew -d proxy.yourdomain.com --force

# 检查证书有效期
openssl x509 -in /etc/v2ray/cert.pem -noout -dates
```

#### 3. 速度慢
**优化建议：**
- 确认BBR已开启
- 检查服务器带宽限制
- 尝试更换端口（443、8443等）
- 使用CDN加速（WebSocket+TLS）

## 安全建议

### 定期维护

```bash
# 每周执行的维护脚本
cat > /root/weekly_maintenance.sh << 'EOL'
#!/bin/bash
# 更新系统
apt update && apt upgrade -y

# 清理日志
journalctl --vacuum-time=7d

# 重启服务
systemctl restart v2ray

# 发送通知
echo "VPS维护完成 $(date)" | mail -s "VPS Maintenance" your@email.com
EOL

chmod +x /root/weekly_maintenance.sh

# 添加到cron
echo "0 2 * * 0 /root/weekly_maintenance.sh" | crontab -
```

### 监控服务

**使用netdata监控：**
```bash
# 安装netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# 访问监控面板
# http://your-server-ip:19999
```

## 成本估算

### 月度成本对比

| 方案 | VPS费用 | 域名费用 | 总成本/月 |
|------|---------|----------|-----------|
| 搬瓦工CN2 GIA | $56.66/月 | $0.75 | ~$57.4 |
| Vultr普通线路 | $5/月 | $0.75 | ~$5.75 |
| 机场服务对比 | - | - | ¥15-50 |

**长期使用建议：**
- 年付VPS更优惠（通常8-9折）
- 多域名共享SSL证书
- 搭配免费Cloudflare CDN

---

**更新时间：** 2026年2月
**下一章：** [OpenWRT配置](./openwrt.md)
**返回目录：** [科学上网完全指南](./README.md)
