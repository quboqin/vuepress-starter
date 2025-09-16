# OpenWRT 完整指南

## 概述

OpenWRT 是基于 Linux 的开源路由器固件系统，具有强大的扩展性和定制能力。本指南提供了从基础安装到高级应用的全面文档，帮助您构建稳定、高效、功能丰富的网络环境。

## 快速导航

### 🔧 硬件平台
- [NanoPi R4S 安装配置](hardware/r4s.md) - ARM64 高性能路由器
- [新路由3(Newifi3) 配置](hardware/newifi3.md) - 入门级路由器刷机
- [x86 平台部署](hardware/x86.md) - 软路由和虚拟化部署
- [Proxmox VE 虚拟化](hardware/pve.md) - 虚拟化环境优化

### 🌐 网络配置
- [DNS 配置完全指南](network/dns.md) - DNS 分流与优化
- [网络拓扑设计](network/topology.md) - 架构规划与设计

### 🏗️ 固件编译
- [固件类型与选择](build/firmware.md) - 固件格式详解
- [本地编译指南](build/compilation.md) - 源码编译配置
- [GitHub Actions 自动编译](build/github-action.md) - CI/CD 自动化

### 📱 应用服务
- [代理服务配置](applications/proxy.md) - 科学上网解决方案
- [系统服务管理](applications/services.md) - 文件共享、下载、媒体服务

## 功能特性

### 核心功能
- ✅ **多协议支持** - V2Ray、Xray、Trojan、Shadowsocks 等
- ✅ **智能分流** - 基于规则的流量分流
- ✅ **DNS 优化** - 防污染、分流解析、缓存优化
- ✅ **网络加速** - BBR、Turbo ACC、硬件卸载
- ✅ **设备管理** - DHCP、静态路由、访问控制

### 高级特性
- 🚀 **虚拟化支持** - Docker、LXC 容器部署
- 🚀 **存储服务** - Samba、WebDAV、FTP 文件共享
- 🚀 **下载工具** - Aria2、qBittorrent 下载中心
- 🚀 **媒体服务** - DLNA、Jellyfin 流媒体服务器
- 🚀 **监控运维** - 系统监控、日志分析、自动化维护

## 使用场景

### 家庭网络中心
```
功能需求：
✓ 全屋科学上网
✓ NAS 文件存储
✓ 影音娱乐中心
✓ 智能家居网关
✓ 游戏加速优化

推荐配置：
- 硬件: NanoPi R4S / x86 软路由
- 存储: 1TB+ SSD/HDD
- 网络: 千兆有线 + WiFi 6
```

### 小型办公网络
```
功能需求：
✓ 企业级安全防护
✓ VLAN 网络隔离
✓ VPN 远程接入
✓ 网络行为管控
✓ 高可用负载均衡

推荐配置：
- 硬件: x86 工控机 / 企业级路由
- 存储: RAID 冗余存储
- 网络: 多WAN 负载均衡
```

### 技术学习环境
```
功能需求：
✓ 虚拟化实验平台
✓ 容器化应用部署
✓ 网络技术验证
✓ 开源项目测试
✓ 编程开发环境

推荐配置：
- 硬件: 高配置 x86 主机
- 存储: 大容量 NVMe SSD
- 网络: 多网卡bond
```

## 硬件推荐

### 入门级方案 (500-1000元)
| 设备 | 价格 | CPU | 内存 | 适用场景 |
|------|------|-----|------|----------|
| **新路由3** | ~200元 | MT7621A 双核 | 512MB | 轻量使用，学习入门 |
| **小娱C5** | ~300元 | MT7621A 双核 | 256MB | 简单家庭网络 |
| **NanoPi R2S** | ~400元 | RK3328 四核 | 1GB | 中等负载，性价比高 |

### 进阶级方案 (1000-3000元)
| 设备 | 价格 | CPU | 内存 | 适用场景 |
|------|------|-----|------|----------|
| **NanoPi R4S** | ~800元 | RK3399 六核 | 4GB | 高性能路由，推荐 ⭐ |
| **NanoPi R5S** | ~1200元 | RK3568 四核 | 4GB | 最新架构，双2.5G网口 |
| **x86 软路由** | 1500-3000元 | Intel N5105/J4125 | 8GB | 极致性能，企业级 |

### 专业级方案 (3000元+)
| 设备 | 价格 | CPU | 内存 | 适用场景 |
|------|------|-----|------|----------|
| **工控主机** | 3000-5000元 | Intel i5/i7 | 16GB+ | 大型网络，虚拟化 |
| **企业路由器** | 5000元+ | 专用处理器 | 定制 | 商业环境，高可靠性 |

## 软件生态

### 主流固件分支

| 固件 | 维护者 | 更新频率 | 特色功能 | 推荐指数 |
|------|--------|----------|----------|----------|
| **ImmortalWrt** | 社区 | 频繁 | 官方跟进快，设备支持多 | ⭐⭐⭐⭐⭐ |
| **Lean LEDE** | coolsnowwolf | 定期 | 插件丰富，稳定性好 | ⭐⭐⭐⭐ |
| **Lienol** | Lienol | 定期 | 轻量化，资源占用少 | ⭐⭐⭐ |
| **OpenWrt 官方** | OpenWrt 团队 | 定期 | 原生体验，长期支持 | ⭐⭐⭐⭐ |

### 核心插件生态

#### 网络代理
- **Passwall** - 多协议支持，配置简单
- **SSR Plus** - 老牌插件，生态完善
- **OpenClash** - Clash 核心，规则丰富
- **Hello World** - 界面美观，功能全面

#### 系统服务
- **Samba4** - 文件共享服务
- **Aria2** - 多协议下载器
- **Docker** - 容器化平台
- **DDNS** - 动态域名解析

#### 网络工具
- **SmartDNS** - 智能 DNS 解析
- **AdGuard Home** - 广告屏蔽
- **UPnP** - 即插即用协议
- **Wake on LAN** - 网络唤醒

## 最佳实践

### 安全配置
```bash
# 1. 修改默认密码
passwd root

# 2. 禁用 root SSH 密码登录
echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config

# 3. 配置防火墙规则
iptables -A INPUT -s 192.168.0.0/16 -j ACCEPT
iptables -A INPUT -j DROP

# 4. 启用自动更新
echo "0 2 * * 0 opkg update && opkg upgrade" >> /etc/crontabs/root
```

### 性能优化
```bash
# 1. 内核参数优化
echo 'net.core.netdev_max_backlog = 5000' >> /etc/sysctl.conf
echo 'net.netfilter.nf_conntrack_max = 65536' >> /etc/sysctl.conf

# 2. 启用 BBR 拥塞控制
echo 'net.ipv4.tcp_congestion_control = bbr' >> /etc/sysctl.conf

# 3. 优化存储性能
echo 'vm.dirty_ratio = 15' >> /etc/sysctl.conf
echo 'vm.dirty_background_ratio = 5' >> /etc/sysctl.conf

# 应用优化
sysctl -p
```

### 备份策略
```bash
# 自动配置备份脚本
#!/bin/sh
BACKUP_DIR="/mnt/shared/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份
sysupgrade -b $BACKUP_DIR/config_backup_$DATE.tar.gz

# 清理旧备份（保留最近7天）
find $BACKUP_DIR -name "config_backup_*.tar.gz" -mtime +7 -delete

# 添加到定时任务
echo "0 3 * * * /usr/bin/backup_config.sh" >> /etc/crontabs/root
```

## 常见问题

### ❓ 如何选择合适的硬件平台？
- **新手用户**: 推荐 NanoPi R4S，性能够用，社区支持好
- **高级用户**: 选择 x86 平台，扩展性强，支持虚拟化
- **商用环境**: 使用企业级设备，注重稳定性和技术支持

### ❓ 固件刷坏了怎么办？
- **救援模式**: 大多数设备支持 Breed、U-Boot 等救援模式
- **TTL 刷机**: 通过串口连接进行底层刷机
- **硬件恢复**: 短接闪存芯片强制进入刷机模式

### ❓ 如何实现稳定的代理服务？
- **多节点配置**: 配置多个代理节点，实现负载均衡
- **智能切换**: 启用节点健康检查和自动切换
- **DNS 优化**: 正确配置 DNS 分流，防止污染

### ❓ 网络性能如何优化？
- **硬件加速**: 启用 Turbo ACC、硬件 NAT 等加速功能
- **QoS 配置**: 合理配置流量控制和优先级
- **系统调优**: 优化内核参数和网络栈配置

## 技术支持

### 官方资源
- [OpenWrt 官方网站](https://openwrt.org/)
- [OpenWrt 官方文档](https://openwrt.org/docs/start)
- [设备兼容性列表](https://openwrt.org/toh/start)

### 社区资源
- [恩山无线论坛](https://www.right.com.cn/forum/) - 中文最大的 OpenWrt 社区
- [GitHub OpenWrt 项目](https://github.com/openwrt/openwrt)
- [Telegram 讨论群组](https://t.me/openwrt_zh)

### 学习资源
- [OpenWrt 开发者指南](https://openwrt.org/docs/guide-developer/start)
- [Linux 网络编程](https://www.kernel.org/doc/Documentation/networking/)
- [路由器原理解析](https://en.wikipedia.org/wiki/Router_(computing))

## 贡献指南

本文档是开源项目，欢迎大家参与完善：

1. **内容完善** - 补充缺失的配置说明
2. **错误修正** - 修复文档中的技术错误
3. **案例分享** - 分享实际使用经验
4. **翻译工作** - 帮助翻译英文文档

### 如何贡献
```bash
# 1. Fork 项目到自己的账号
git clone https://github.com/your-username/vuepress-starter.git

# 2. 创建功能分支
git checkout -b feature/improve-openwrt-docs

# 3. 提交改动
git add .
git commit -m "improve: 完善 OpenWRT DNS 配置说明"

# 4. 推送到远程仓库
git push origin feature/improve-openwrt-docs

# 5. 创建 Pull Request
```

## 更新日志

### v2.0.0 (2024-09-16)
- 🎉 完全重构文档结构
- ✨ 新增硬件平台专门指南
- ✨ 整合 DNS 配置完整解决方案
- ✨ 添加网络拓扑设计指南
- 🔧 优化图片资源管理
- 📖 补充最佳实践和故障排除

### v1.x.x (历史版本)
- 基础功能文档
- 单文件组织结构
- 基本配置说明

---

<div align="center">

**🌟 如果这个指南对您有帮助，请给项目一个 Star！**

[⬆️ 回到顶部](#openwrt-完整指南)

</div>