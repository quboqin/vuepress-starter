# 科学上网完全指南

## 概述

本文档整理了科学上网相关的所有技术方案，包括协议对比、机场推荐、自建服务器、软路由配置、家庭网络拓扑、客户端设置、内网穿透和NAS方案等内容。

---

## 1. 科学上网协议与VPN对比

### 主流协议对比 (2025-2026)

| 协议 | 延迟 | 抗封锁能力 | 复杂度 | 最佳使用场景 |
|------|------|------------|--------|--------------|
| **VLESS+Reality+Vision** | 160-210ms | 9/10 | 高 | 最高隐蔽性，政治敏感期 |
| **Hysteria2** | 110-150ms | 7/10 | 中等 | 游戏、4K流媒体、实时应用 |
| **Shadowsocks-2022** | 130-160ms | 6/10 | 低 | 高速光纤用户(1Gbps+) |
| **Trojan/Trojan-Go** | 170-230ms | 8/10 | 中等 | 稳定可靠，HTTPS伪装 |
| **VMess+WebSocket+TLS** | 150-200ms | 7/10 | 中等 | 配合CDN使用 |
| **TUIC v5** | 140-180ms | 5/10 | 中等 | TCP多路复用，云工作负载 |

### VPN vs 代理协议对比

| 特性 | 商业VPN | 代理协议(SS/V2Ray/Trojan) |
|------|---------|---------------------------|
| **加密方式** | 全流量加密 | 按需加密 |
| **价格** | 月费20-80元 | 机场2-15元/月，自建VPS更便宜 |
| **隐蔽性** | 容易被识别封锁 | 伪装HTTPS流量，更难检测 |
| **适用场景** | 隐私保护、企业办公 | 突破网络限制、科学上网 |
| **速度** | 受限于VPN服务商 | 取决于节点质量，可自建优化 |

### 协议选择建议

- **新手用户**: Shadowsocks-2022 或 Trojan，配置简单
- **追求速度**: Hysteria2 (QUIC协议，抗丢包能力强)
- **追求隐蔽**: VLESS+Reality+Vision (消除TLS指纹)
- **流媒体解锁**: VMess+CDN 或 Trojan
- **游戏加速**: Hysteria2 低延迟首选

---

## 2. 科学上网机场推荐 (2025-2026)

### 第一梯队：高端专线机场

| 机场名称 | 核心优势 | 起步价格 | 特点 |
|----------|----------|----------|------|
| **WgetCloud** | 自建机房，商务首选 | ¥69/月 | 高端商务，不拥堵 |
| **Mikasa** | 试用之王，亲民专线 | ¥11.25/月 | 注册送流量，买一送二 |
| **AllBlue** | 速度之王，极低延迟 | ¥14.25/月 | 全专线IPLC |
| **SSRDOG** | 流媒体解锁强 | ¥25/月 | 深港专线，防失联 |
| **Tolink** | 综合最佳，双线路 | ¥14.25/月 | IEPL专线，免费试用 |

### 性价比机场 (¥15/月以下)

| 机场名称 | 月付价格 | 流量 | 协议 | 特点 |
|----------|----------|------|------|------|
| **大哥云** | ¥19.9 | 100G | Trojan | 一键客户端 |
| **闪电猫** | ¥20 | 100G | Shadowsocks | 老牌稳定 |
| **Taishan Net** | ¥10 | 128G | VLESS/Trojan | 按量付费可选 |
| **银河云** | ¥18 | 不限 | - | 不限设备数 |
| **精灵学院** | ¥8 | 30G | - | 经济入门 |

### 选择机场的注意事项

⚠️ **避坑指南：**
1. **一定要有备用机场**，避免完全失联
2. **优先选择月付**，满意后再购买长期套餐
3. **新疆地区用户**购买前最好先咨询客服
4. **警惕"1元机场"**，往往伴随跑路和隐私泄露风险
5. **查看运营时间**，选择运营2年以上的服务商

---

## 3. 自建服务器搭建指南

### VPS推荐 (2025-2026)

| 服务商 | 特点 | 价格范围 | 推荐线路 |
|--------|------|----------|----------|
| **DMIT** | CN2 GIA线路，速度快 | $10-20/月 | 美西CN2 GIA |
| **搬瓦工** | 老牌稳定，Just My Socks | $5-10/月 | 洛杉矶/香港 |
| **Vultr** | 按小时计费，随时换IP | $5/月起 | 多地区可选 |
| **HostDare** | 便宜CN2 GIA | $20-40/年 | 美西CN2 |
| **Racknerd** | 超低价年付 | $10-20/年 | 美西 |

### 一键搭建脚本推荐

#### 1. 3X-UI 面板 (推荐)
基于Xray核心，支持多协议
```bash
# 安装命令
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)

# 特点：
# - 可视化面板管理
# - 支持VMess/VLESS/Trojan/Shadowsocks/Reality
# - 流量统计，多用户管理
# - 内置SSL证书申请
```

#### 2. mack-a 八合一脚本
```bash
# 安装命令
wget -P /root -N --no-check-certificate "https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh" && chmod 700 /root/install.sh && /root/install.sh

# 支持协议：
# - VLESS+Reality+Vision
# - VLESS+TLS+WS
# - Trojan+TLS
# - VMess+TLS+WS
```

#### 3. 233boy V2Ray脚本
```bash
# 安装命令
bash <(curl -s -L https://git.io/v2ray.sh)

# 特点：
# - 支持绝大多数传输协议
# - WebSocket + TLS
# - HTTP/2
# - 动态端口
# - 集成BBR和锐速优化
```

### BBR加速优化
```bash
# 开启BBR (所有脚本通常会自动开启)
echo 'net.core.default_qdisc=fq' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_congestion_control=bbr' >> /etc/sysctl.conf
sysctl -p

# 验证BBR是否开启
sysctl net.ipv4.tcp_available_congestion_control
lsmod | grep bbr
```

---

## 4. OpenWRT架构、编译与配置

### OpenWRT固件分支对比

| 固件 | 维护者 | 更新频率 | 特色功能 | 推荐指数 |
|------|--------|----------|----------|----------|
| **ImmortalWrt** | 社区 | 频繁 | 官方跟进快，设备支持多 | ⭐⭐⭐⭐⭐ |
| **Lean LEDE** | coolsnowwolf | 定期 | 插件丰富，稳定性好 | ⭐⭐⭐⭐ |
| **OpenWrt官方** | OpenWrt团队 | 定期 | 原生体验，长期支持 | ⭐⭐⭐⭐ |

### 软路由硬件推荐

#### 入门级 (500-1000元)
| 设备 | 价格 | CPU | 内存 | 适用场景 |
|------|------|-----|------|----------|
| **NanoPi R2S** | ~400元 | RK3328四核 | 1GB | 中等负载 |
| **小娱C5** | ~300元 | MT7621A双核 | 256MB | 简单家庭网络 |

#### 进阶级 (1000-3000元)
| 设备 | 价格 | CPU | 内存 | 适用场景 |
|------|------|-----|------|----------|
| **NanoPi R4S** | ~800元 | RK3399六核 | 4GB | 高性能路由 ⭐推荐 |
| **NanoPi R5S** | ~1200元 | RK3568四核 | 4GB | 双2.5G网口 |
| **x86软路由** | 1500-3000元 | N5105/J4125 | 8GB | 极致性能 |

### 编译环境准备 (Ubuntu/Debian)
```bash
# 安装依赖
sudo apt update -y
sudo apt install -y ack antlr3 aria2 asciidoc autoconf automake autopoint binutils bison build-essential \
bzip2 ccache cmake cpio curl device-tree-compiler fastjar flex gawk gettext gcc-multilib g++-multilib \
git gperf haveged help2man intltool libc6-dev-i386 libelf-dev libglib2.0-dev libgmp3-dev libltdl-dev \
libmpc-dev libmpfr-dev libncurses5-dev libncursesw5-dev libreadline-dev libssl-dev libtool lrzsz \
mkisofs msmtp nano ninja-build p7zip p7zip-full patch pkgconf python2.7 python3 python3-pip libpython3-dev

# 克隆源码
git clone https://github.com/coolsnowwolf/lede.git
cd lede

# 更新软件源
./scripts/feeds update -a
./scripts/feeds install -a

# 配置编译选项
make menuconfig

# 开始编译 (-j 参数为并发数，建议为CPU核心数+1)
make -j$(nproc) V=s
```

### OpenWRT代理插件对比

| 插件 | 内存占用 | CPU占用 | 功能丰富度 | 适用场景 |
|------|----------|---------|------------|----------|
| **SSR Plus** | ~10MB | 低 | ⭐⭐⭐ | 传统用户，轻量需求 |
| **Passwall** | ~15MB | 中等 | ⭐⭐⭐⭐ | 新手用户，稳定需求 |
| **OpenClash** | ~25MB | 较高 | ⭐⭐⭐⭐⭐ | 高级用户，定制需求 |
| **Hello World** | ~20MB | 中等 | ⭐⭐⭐⭐ | 注重体验的用户 |

### Passwall基本配置
```bash
# 安装
opkg update
opkg install luci-app-passwall
opkg install dns2socks microsocks

# DNS配置推荐：
# 远程DNS: 1.1.1.1 或 8.8.8.8
# 本地DNS: 114.114.114.114 或 223.5.5.5
# 启用 ChinaDNS-NG
```

---

## 5. PVE服务器安装与网络配置

### PVE硬件要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 64位处理器 | 4核及以上 |
| 内存 | 4GB | 8GB及以上 |
| 存储 | 50GB | 100GB SSD |
| 网络 | 千兆网卡 | 1Gbps及以上 |

### PVE安装步骤

1. **下载镜像**: https://www.proxmox.com/en/downloads
2. **制作启动盘**: 使用Rufus或Ventoy
3. **安装系统**:
   - 选择 "Install Proxmox VE (Graphical)"
   - 磁盘分区：/ext4 20GB, swap=内存大小, 剩余给xfs
   - 设置静态IP、网关、DNS
   - 设置root密码

### 安装后优化
```bash
# 更换国内软件源 (中科大)
sed -i 's|deb http://ftp.debian.org|deb https://mirrors.ustc.edu.cn|g' /etc/apt/sources.list
sed -i 's|deb http://security.debian.org|deb https://mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list
sed -i 's|http://download.proxmox.com|https://mirrors.ustc.edu.cn/proxmox|g' /etc/apt/sources.list.d/pve-enterprise.list

# 更新系统
apt update && apt upgrade -y

# 关闭企业订阅提示
sed -i 's/.*mediacenter.*/#&/' /usr/share/perl5/PVE/API2/Subscription.pm
systemctl restart pveproxy
```

### PVE网络配置模式

| 模式 | 特点 | 适用场景 |
|------|------|----------|
| **桥接模式** | 虚拟机直接共享物理网卡，需独立IP | 需要公网直接访问 |
| **NAT模式** | 内部私有IP，外部访问需端口转发 | 节省公网IP，隔离内网 |
| **路由模式** | 结合NAT与路由表，适合复杂子网 | 复杂网络环境 |

---

## 6. 家庭网络拓扑架构

### 方案对比

| 方案 | 主路由 | 旁路由 | 优点 | 缺点 |
|------|--------|--------|------|------|
| **方案一** | 光猫拨号 | 无 | 简单 | 光猫性能弱 |
| **方案二** | 硬路由拨号 | 无 | 稳定 | 功能受限 |
| **方案三** | 软路由拨号 | 无 | 功能全 | 单点故障风险 |
| **方案四** | 硬路由拨号 | 软路由 | 稳定+灵活 | 配置稍复杂 |

### 旁路由配置方案

#### 方案A：网关互指 (全局代理)
```
主路由 (192.168.1.1)
  ├── DHCP网关: 192.168.1.2 (指向旁路由)
  └── DNS: 192.168.1.2

旁路由 (192.168.1.2) - OpenWrt
  ├── LAN口静态IP: 192.168.1.2
  ├── 网关: 192.168.1.1 (指向主路由)
  ├── DNS: 114.114.114.114
  └── 关闭DHCP
```

#### 方案B：指定网关 (按需代理)
```
主路由 (192.168.1.1)
  ├── DHCP正常分配: 192.168.1.1
  └── 需要翻墙的设备手动设置网关为 192.168.1.2

旁路由 (192.168.1.2) - OpenWrt
  ├── 仅指定设备走旁路由
  └── 其他设备直连主路由
```

### OpenWRT旁路由设置步骤
```bash
# 1. 修改LAN口IP为同一网段
uci set network.lan.ipaddr='192.168.1.2'
uci set network.lan.netmask='255.255.255.0'

# 2. 设置网关指向主路由
uci set network.lan.gateway='192.168.1.1'

# 3. 设置DNS
uci set network.lan.dns='114.114.114.114'

# 4. 关闭DHCP
uci set dhcp.lan.ignore='1'

# 5. 关闭IPv6 DHCP
uci set dhcp.lan.ra='disabled'
uci set dhcp.lan.dhcpv6='disabled'

# 6. 应用设置
uci commit
/etc/init.d/network restart
/etc/init.d/dnsmasq restart
```

### VLAN划分方案 (进阶)
```
网络架构:
├── VLAN 10 - 管理网络 (192.168.10.0/24)
├── VLAN 20 - 家庭用户 (192.168.20.0/24) - 走旁路由
├── VLAN 30 - IoT设备 (192.168.30.0/24) - 直连
└── VLAN 40 - 访客网络 (192.168.40.0/24) - 限速
```

---

## 7. 手机/PC端翻墙客户端设置

### Windows客户端

| 客户端 | 特点 | 推荐版本 | 下载地址 |
|--------|------|----------|----------|
| **v2rayN** | 功能全面，支持多协议 | v7.x | https://github.com/2dust/v2rayN/releases |
| **Clash Verge Rev** | 界面美观，基于Mihomo | 最新版 | https://github.com/clash-verge-rev/clash-verge-rev/releases |
| **Clash Nyanpasu** | 新UI，体验好 | 最新版 | https://github.com/keiko233/clash-nyanpasu/releases |
| **Nekoray** | 跨平台，支持sing-box | 最新版 | https://github.com/MatsuriDayo/nekoray/releases |

**v2rayN配置步骤：**
1. 下载解压 `v2rayN-windows-64-SelfContained.zip`
2. 运行 `v2rayN.exe`
3. 订阅分组 → 订阅分组设置 → 粘贴订阅链接
4. 更新订阅 → 选择节点 → 右键设为活动服务器
5. 系统代理 → 自动配置系统代理

### Android客户端

| 客户端 | 特点 | 下载 |
|--------|------|------|
| **v2rayNG** | 官方客户端，稳定 | GitHub / Google Play |
| **Clash Meta for Android** | 规则强大 | GitHub |
| **Surfboard** | 兼容Surge配置 | Google Play |
| **FlClash** | 新兴客户端 | GitHub |

### iOS/macOS客户端

| 客户端 | 价格 | 特点 | 下载 |
|--------|------|------|------|
| **Shadowrocket (小火箭)** | $2.99 | 功能全面，推荐 | 美区App Store |
| **Quantumult X (圈叉)** | $7.99 | 规则强大 | 美区App Store |
| **Stash** | $3.99 | Clash兼容 | 美区App Store |
| **Surge** | $49.99 | 专业级 | 美区App Store |
| **Clash Verge Rev** | 免费 | Mac推荐 | GitHub |

**Shadowrocket配置：**
1. 购买下载后打开
2. 右上角+号 → 类型选择Subscribe
3. 粘贴订阅链接 → 保存
4. 选择节点 → 打开连接开关

### 客户端配置建议

```yaml
# Clash配置文件要点
proxies:
  - name: "节点选择"
    type: select
    proxies:
      - "自动选择"
      - "香港节点"
      - "美国节点"
      - "日本节点"
      - "DIRECT"

rules:
  # 局域网直连
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  
  # 国内直连
  - GEOIP,CN,DIRECT
  
  # 国外走代理
  - MATCH,节点选择
```

---

## 8. 内网穿透方案

### 方案对比

| 方案 | 原理 | 配置难度 | 速度 | 成本 | 适用场景 |
|------|------|----------|------|------|----------|
| **FRP** | 反向代理 | ⭐⭐⭐⭐ | 快 | 云服务器费用 | 技术人员、固定场景 |
| **NPS** | 反向代理+Web管理 | ⭐⭐⭐ | 快 | 云服务器费用 | 小型团队 |
| **ZeroTier** | P2P虚拟局域网 | ⭐⭐⭐ | 快(直连时) | 免费(25设备) | 跨国组网 |
| **Tailscale** | P2P+中继 | ⭐⭐ | 快 | 免费(100设备) | 国外用户 |
| **ngrok** | 反向代理 | ⭐⭐ | 中等 | 免费/付费 | 临时演示 |
| **花生壳** | 第三方中继 | ⭐ | 慢 | 付费 | 小白用户 |

### FRP部署示例

**服务端配置 (frps.ini):**
```ini
[common]
bind_port = 7000
token = your_secret_token

# 仪表盘配置 (可选)
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin
```

**客户端配置 (frpc.ini):**
```ini
[common]
server_addr = your_server_ip
server_port = 7000
token = your_secret_token

[web]
type = http
local_port = 80
custom_domains = your-domain.com

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
```

### ZeroTier快速开始
```bash
# 安装
curl -s https://install.zerotier.com | sudo bash

# 加入网络
zerotier-cli join <network_id>

# 查看状态
zerotier-cli status
zerotier-cli listnetworks
```

### Tailscale快速开始
```bash
# 安装
curl -fsSL https://tailscale.com/install.sh | sh

# 启动并登录
tailscale up

# 查看状态
tailscale status
```

---

## 9. 家庭NAS方案

### NAS系统对比

| 系统 | 类型 | 特点 | 适用人群 |
|------|------|------|----------|
| **Synology DSM** | 商业 | 软件生态最好 | 家用首选 |
| **QNAP QTS** | 商业 | 硬件配置高 | 进阶用户 |
| **TrueNAS CORE** | 开源 | ZFS文件系统 | 技术用户 |
| **TrueNAS SCALE** | 开源 | 基于Debian，Docker支持 | 技术用户 |
| **UnRAID** | 商业 | 灵活扩容，校验盘机制 | 影音爱好者 |
| **飞牛OS** | 国产 | 中文支持好，新兴系统 | 国内用户 |

### NAS选购推荐 (2025)

#### 品牌NAS
| 品牌/型号 | 盘位 | CPU | 内存 | 价格区间 | 特点 |
|-----------|------|-----|------|----------|------|
| **群晖 DS224+** | 2 | J4125 | 2GB | ¥2500-3000 | 入门首选 |
| **群晖 DS423+** | 4 | J4125 | 2GB | ¥3500-4000 | 家用均衡 |
| **群晖 DS923+** | 4 | AMD R1600 | 4GB | ¥4000-4500 | 性能升级 |
| **威联通 TS-464C2** | 4 | N5095 | 8GB | ¥2500-3000 | 性价比 |
| **绿联 DXP4800** | 4 | N100 | 8GB | ¥2000-2500 | 国产新锐 |
| **极空间 Z4Pro** | 4 | N97 | 8GB | ¥2500-3000 | 易用性强 |

#### DIY NAS配置推荐

**入门级 (1500-2500元):**
- CPU: J4125/N5105
- 内存: 8GB DDR4
- 机箱: 4盘位NAS机箱
- 系统: TrueNAS/黑群晖

**进阶级 (3000-5000元):**
- CPU: N100/i3-N305
- 内存: 16GB DDR4/5
- 机箱: 6-8盘位
- 万兆网卡 (可选)

### NAS硬盘推荐

| 类型 | 推荐型号 | 特点 | 价格(4TB) |
|------|----------|------|-----------|
| **机械盘-家用** | 希捷酷狼 | 专为NAS优化 | ¥600-700 |
| **机械盘-企业** | 西数HC320 | 企业级，稳定 | ¥800-900 |
| **SSD缓存** | 三星870 EVO | 读写加速 | ¥400-500 |

### NAS常用应用

| 应用类型 | 软件推荐 | 用途 |
|----------|----------|------|
| **下载** | Aria2/qBittorrent | PT/BT下载 |
| **影音** | Jellyfin/Plex/Emby | 媒体库管理 |
| **文件同步** | Syncthing | 多设备同步 |
| **网盘替代** | Nextcloud | 私有云盘 |
| **备份** | Duplicati/Borgmatic | 数据备份 |
| **相册** | Immich/PhotoPrism | 照片管理 |
| **监控** | ZoneMinder/Shinobi | NVR录像 |

---

## 总结建议

### 新手入门路线
1. **第一阶段**: 购买机场 + 使用v2rayN/Shadowrocket
2. **第二阶段**: 购买软路由(R4S) + 安装OpenWrt + Passwall
3. **第三阶段**: 购买VPS + 3X-UI自建节点
4. **第四阶段**: PVE虚拟化 + All in One (软路由+NAS+各种服务)

### 避坑提醒
⚠️ **绝对不要做:**
- 使用来路不明的免费节点
- 在重要设备上运行不明客户端
- 购买长期年付套餐(先月付测试)
- 忽视备份(配置文件、节点信息)

### 最佳实践
✅ **推荐做法:**
- 多机场备份，至少2-3个
- 自建+机场混合使用
- 定期更换节点密码/UUID
- 使用TLS加密和伪装
- 旁路由方案降低主路由风险

---

**最后更新**: 2026年2月
**免责声明**: 本文仅供技术学习交流，请遵守当地法律法规。
