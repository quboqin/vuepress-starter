# 代理服务配置指南

## 概述

代理服务是 OpenWRT 路由器实现"科学上网"的核心功能。本指南详细介绍主流代理插件的配置方法，包括 Passwall、SSR Plus、OpenClash 等，帮助您构建稳定高效的网络代理环境。

## 代理插件对比

### 主流插件特点

| 插件 | 开发者 | 支持协议 | 特色功能 | 适用场景 |
|------|--------|----------|----------|----------|
| **Passwall** | xiaorouji | V2Ray/Xray/Trojan | 多协议支持，配置简单 | 新手用户，稳定需求 |
| **SSR Plus** | fw876 | SS/SSR/V2Ray | 老牌插件，生态完善 | 传统用户，轻量需求 |
| **OpenClash** | vernesong | Clash核心 | 规则丰富，性能强劲 | 高级用户，定制需求 |
| **Hello World** | jerrykuku | 多协议 | 界面美观，功能全面 | 注重体验的用户 |

### 性能对比

```yaml
内存占用:
  SSR Plus: ~10MB
  Passwall: ~15MB
  OpenClash: ~25MB
  Hello World: ~20MB

CPU占用:
  SSR Plus: 低
  Passwall: 中等
  OpenClash: 较高
  Hello World: 中等

功能丰富度:
  SSR Plus: ⭐⭐⭐
  Passwall: ⭐⭐⭐⭐
  OpenClash: ⭐⭐⭐⭐⭐
  Hello World: ⭐⭐⭐⭐
```

## Passwall 配置

### 安装 Passwall

```bash
# 通过 opkg 安装（需要先添加软件源）
opkg update
opkg install luci-app-passwall

# 安装依赖组件
opkg install passwall
opkg install dns2socks
opkg install microsocks
```

### 基本配置

#### 1. 添加节点

```
路径：服务 → Passwall → 节点列表

节点配置参数：
- 节点备注: 自定义名称
- 类型: V2Ray/Xray/Trojan/SS/SSR
- 服务器地址: 节点IP或域名
- 端口: 服务端口
- 用户ID/密码: 认证信息
- 传输协议: TCP/WS/gRPC等
- 安全传输: TLS配置
```

#### 2. 基本设置

```
路径：服务 → Passwall → 基本设置

主要配置：
✓ 启用
TCP节点: 选择可用节点
UDP节点: 通常与TCP相同
分流模式:
  - 不代理: 全部直连
  - 全局代理: 全部走代理
  - 智能分流: 按规则分流（推荐）
```

#### 3. DNS 配置

```
路径：服务 → Passwall → DNS

DNS 设置：
✓ 启用 DNS 服务器
远程 DNS: 1.1.1.1 (或 8.8.8.8)
本地 DNS: 114.114.114.114 (或 223.5.5.5)

高级选项：
✓ 启用 ChinaDNS-NG
UDP DNS 服务器: 116.228.111.118
可信 DNS: 1.1.1.1
```

### 高级配置

#### 访问控制

```
路径：服务 → Passwall → 访问控制

设备配置：
- 源地址: 设备IP或网段
- 代理模式:
  - 默认: 使用全局设置
  - 直连: 该设备不走代理
  - 代理: 该设备强制走代理
- 节点: 指定特定节点

示例配置：
192.168.1.100    代理    美国节点    # NAS设备
192.168.1.0/24   默认    -          # 其他设备
```

#### 规则列表

```
路径：服务 → Passwall → 规则管理

内置规则：
- gfwlist: 被封锁的网站列表
- chnroute: 中国大陆IP段
- chnlist: 中国大陆域名列表

自定义规则：
- 代理列表: 强制走代理的域名/IP
- 直连列表: 强制直连的域名/IP
- 阻止列表: 直接阻断的域名/IP
```

### 节点订阅

#### 配置订阅源

```
路径：服务 → Passwall → 节点订阅

订阅配置：
- 备注: 订阅源名称
- 订阅地址: 机场提供的订阅链接
- 通过代理更新: ✓（如果需要）
- 自动更新: 启用并设置更新时间

更新操作：
1. 手动更新: 点击"更新"按钮
2. 自动更新: 每天凌晨2点（可调整）
```

## SSR Plus 配置

### 基本配置

#### 1. 服务器节点

```
路径：服务 → ShadowSocksR Plus+

节点配置：
- 服务器地址: 节点IP
- 服务器端口: 服务端口
- 密码: 节点密码
- 加密方式: chacha20-ietf-poly1305 (推荐)
- 协议: origin (推荐)
- 混淆: plain (推荐)
```

#### 2. 访问控制

```
运行模式选择：
- 绕过大陆模式: 国外网站走代理，国内直连
- GFW列表模式: 仅被墙网站走代理
- 全局模式: 所有流量走代理
- 游戏模式: 针对游戏优化的代理模式

UDP转发: ✓ (启用)
DNS解析方式: 使用本地DNS服务解析
```

#### 3. DNS 设置

```
国外DNS服务器: 1.1.1.1
国内DNS服务器: 114.114.114.114

启用DNS缓存: ✓
缓存大小: 1024
```

### 订阅管理

```
路径：服务 → ShadowSocksR Plus+ → 服务器订阅

订阅设置：
- 订阅地址: 机场订阅链接
- 更新时间: 凌晨2点自动更新
- 通过代理更新: 根据需要选择
```

## OpenClash 配置

### 安装 OpenClash

```bash
# 下载最新版本
wget https://github.com/vernesong/OpenClash/releases/download/v0.x.x/luci-app-openclash_x.x.x_all.ipk

# 安装
opkg install luci-app-openclash_x.x.x_all.ipk

# 下载 Clash 核心
opkg install openclash-core
```

### 基本配置

#### 1. 全局设置

```
路径：服务 → OpenClash → 全局设置

基本设置：
✓ 启用 OpenClash
运行模式: Fake-IP模式（推荐）
堆栈类型: System
局域网控制: 启用
允许局域网: 启用
```

#### 2. 配置文件管理

```
路径：服务 → OpenClash → 配置文件订阅

导入配置方式：
1. 订阅链接: 粘贴机场订阅链接
2. 本地上传: 上传配置文件
3. 在线生成: 使用内置生成器

配置更新：
- 自动更新: 启用
- 更新间隔: 24小时
- 通过代理更新: 建议启用
```

#### 3. DNS 设置

```
路径：服务 → OpenClash → DNS设置

DNS模式: Fake-IP（推荐）
本地DNS劫持: 启用
自定义上游DNS服务器:
  NameServer:
    - 114.114.114.114
    - 223.5.5.5
  Fallback:
    - 1.1.1.1
    - 8.8.8.8
```

### 高级功能

#### 规则集管理

```
路径：服务 → OpenClash → 规则集订阅

推荐规则集：
- https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt
- https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt
- https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt
```

#### 自定义规则

```yaml
# 在配置文件中添加自定义规则
rules:
  # 局域网流量直连
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT

  # 广告拦截
  - DOMAIN-KEYWORD,ads,REJECT
  - DOMAIN-KEYWORD,analytics,REJECT

  # 流媒体分流
  - DOMAIN-SUFFIX,netflix.com,🎬 Netflix
  - DOMAIN-SUFFIX,youtube.com,📹 YouTube

  # 默认规则
  - GEOIP,CN,DIRECT
  - MATCH,🔰 节点选择
```

## 性能优化

### 系统优化

#### 内核参数调优

```bash
# 编辑 /etc/sysctl.conf
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.netdev_max_backlog = 5000' >> /etc/sysctl.conf
echo 'net.netfilter.nf_conntrack_max = 65536' >> /etc/sysctl.conf

# 应用设置
sysctl -p
```

#### 防火墙优化

```bash
# 优化连接跟踪
echo 'net.netfilter.nf_conntrack_tcp_timeout_established = 1800' >> /etc/sysctl.conf
echo 'net.netfilter.nf_conntrack_tcp_timeout_time_wait = 120' >> /etc/sysctl.conf
```

### 代理优化

#### 节点选择策略

```yaml
# 负载均衡
proxy-groups:
  - name: "🔰 节点选择"
    type: load-balance
    url: http://www.gstatic.com/generate_204
    interval: 300
    strategy: round-robin  # 轮询
    proxies:
      - "节点1"
      - "节点2"
      - "节点3"

# 故障转移
  - name: "♻️ 故障转移"
    type: fallback
    url: http://www.gstatic.com/generate_204
    interval: 300
    proxies:
      - "主节点"
      - "备用节点1"
      - "备用节点2"
```

#### 分流优化

```yaml
# 地区分流
proxy-groups:
  - name: "🌍 国外媒体"
    type: select
    proxies:
      - "🇺🇸 美国节点"
      - "🇯🇵 日本节点"
      - "🇸🇬 新加坡节点"

  - name: "🎬 流媒体"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
      - "美国流媒体专线"
      - "香港流媒体专线"
```

## 故障排除

### 常见问题

#### 1. 节点连接失败

**检查步骤：**
```bash
# 测试节点连通性
ping node-ip-address

# 检查端口连通性
telnet node-ip-address port

# 查看代理日志
logread | grep passwall
# 或
logread | grep ssr-plus
# 或
logread | grep openclash
```

**解决方案：**
- 检查节点信息是否正确
- 确认服务器端口未被封禁
- 尝试更换其他节点
- 检查本地网络防火墙设置

#### 2. DNS 解析异常

**诊断命令：**
```bash
# 测试DNS解析
nslookup www.google.com
dig @1.1.1.1 www.google.com

# 检查DNS分流
nslookup -port=7913 www.google.com 127.0.0.1
```

**解决方法：**
- 重启 dnsmasq 服务
- 清空 DNS 缓存
- 检查 DNS 分流规则
- 更换可靠的 DNS 服务器

#### 3. 网站无法访问

**排查流程：**
```bash
# 检查代理状态
ps | grep -E "(v2ray|xray|trojan|ss-|ssr-)"

# 测试代理连接
curl --proxy socks5://127.0.0.1:1080 https://www.google.com

# 查看路由表
ip route show
iptables -t nat -L PREROUTING -n
```

### 性能监控

#### 监控脚本

```bash
#!/bin/sh
# 代理服务监控脚本

LOG_FILE="/tmp/proxy_monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# 检查进程状态
check_process() {
    local process=$1
    if pidof $process > /dev/null; then
        echo "$DATE - $process is running" >> $LOG_FILE
    else
        echo "$DATE - $process is NOT running" >> $LOG_FILE
        # 重启服务
        /etc/init.d/passwall restart
    fi
}

# 测试连接
test_connection() {
    local test_url="https://www.google.com"
    if curl -s --connect-timeout 10 --proxy socks5://127.0.0.1:1080 $test_url > /dev/null; then
        echo "$DATE - Proxy connection OK" >> $LOG_FILE
    else
        echo "$DATE - Proxy connection FAILED" >> $LOG_FILE
    fi
}

# 执行检查
check_process "v2ray"
check_process "xray"
test_connection
```

#### 自动化维护

```bash
# 添加到 crontab
cat >> /etc/crontabs/root << 'EOF'
# 代理服务监控 (每5分钟)
*/5 * * * * /usr/bin/proxy_monitor.sh

# 订阅更新 (每天凌晨2点)
0 2 * * * /etc/init.d/passwall reload

# 重启代理服务 (每周日凌晨3点)
0 3 * * 0 /etc/init.d/passwall restart
EOF
```

## 安全注意事项

### 隐私保护

#### 1. DNS 泄露防护

```bash
# 启用 DNS 劫持规则
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
```

#### 2. WebRTC 泄露防护

在浏览器中禁用 WebRTC，或安装相关扩展阻止 IP 泄露。

#### 3. 时区设置

```bash
# 设置正确的时区
uci set system.@system[0].timezone='UTC'
uci commit system
```

### 流量伪装

#### 1. 协议选择

- **V2Ray+WebSocket+TLS**: 伪装为HTTPS流量
- **Trojan**: 完全模拟HTTPS握手
- **ShadowTLS**: 真实TLS握手 + 数据传输

#### 2. 域名前置

```json
{
  "streamSettings": {
    "network": "ws",
    "security": "tls",
    "tlsSettings": {
      "serverName": "cloudflare.com"
    },
    "wsSettings": {
      "path": "/path",
      "headers": {
        "Host": "your-domain.com"
      }
    }
  }
}
```

## 总结

代理服务配置是一个相对复杂的技术环节，需要考虑：

1. **选择合适的插件**：根据技术水平和需求选择
2. **正确配置参数**：确保各项设置准确无误
3. **优化性能表现**：调整系统参数提升速度
4. **保证服务稳定**：建立监控和自动恢复机制
5. **注重隐私安全**：防止各类信息泄露
6. **定期维护更新**：保持软件和规则最新

通过正确的配置和优化，可以构建一个稳定、高效、安全的网络代理环境，满足不同场景的使用需求。