# NanoPi R4S OpenWRT 安装与配置

## 概述

NanoPi R4S 是一款基于 RK3399 芯片的双网口路由器，内置 4GB RAM，支持外置 TF 卡扩展存储。本指南详细介绍了在 R4S 上安装和配置 OpenWRT 的完整流程。

## 硬件规格

- **CPU**: RK3399 六核处理器
- **内存**: 4GB LPDDR4
- **存储**: 支持 MicroSD 卡
- **网络**: 2个千兆以太网口
- **电源**: Type-C 5V/3A

## 固件下载与选择

### 推荐固件源

1. **官方第三方固件**
   - [R4S第三方固件](https://bigdongdong.gitbook.io/nanopi-r2s/r4sotherfirmware)
   - [DHDAXCW FusionWrt R4S](https://github.com/DHDAXCW/NanoPi-R4S)

### 固件基本信息

- **管理地址**: 192.168.8.1
- **默认账号**: root
- **默认密码**: 无（首次登录需设置）
- **内置插件**:
  - Passwall/Hello World/OpenClash
  - UU游戏加速器
  - DDNS
  - iperf3 测速

## 固件安装

### 工具准备

- **Windows**: 下载 [Rufus](https://rufus.ie/) 写盘工具
- **macOS**: 下载专用的 macOS 写盘工具或使用 [balenaEtcher](https://www.balena.io/etcher/)
- **Linux**: 使用 dd 命令或 balenaEtcher

### 安装步骤

1. **下载固件**
   - 选择适合的固件版本（通常选择 squashfs 格式）
   - 解压 .gz 文件（如需要）

2. **制作启动卡**
   - 插入 MicroSD 卡（建议 32GB 以上）
   - 使用写盘工具将固件写入 SD 卡
   - 完成后安全弹出 SD 卡

3. **首次启动**
   - 将 SD 卡插入 R4S
   - 连接网线到 LAN 口
   - 接通电源，等待启动（约 2-3 分钟）

## 通过 GitHub Action 自动编译

### 项目地址

- [NanoPi-R4S-2021 每天自动更新插件和内核版本](https://github.com/quboqin/NanoPi-R4S)

### 编译特性

- 每日自动更新
- 支持自定义插件选择
- 基于 Lean 源码
- 自动集成最新内核版本

### 使用方法

1. Fork 项目到自己的 GitHub 账号
2. 修改 `.config` 文件自定义插件
3. 启用 GitHub Actions
4. 等待自动编译完成
5. 下载编译好的固件

## 初始配置

### 网络配置

1. **访问管理界面**
   - 电脑连接 R4S 的 LAN 口
   - 浏览器访问 http://192.168.8.1
   - 首次登录设置密码

2. **WAN口配置**
   - 进入"网络 → 接口 → WAN"
   - 配置上网方式（PPPoE、DHCP等）
   - 设置自定义 DNS 服务器

3. **LAN口配置**
   - 修改 LAN IP 地址（如需要）
   - 配置 DHCP 服务
   - 设置静态地址分配

### SSH 配置

```bash
# 启用 SSH 密钥登录
ssh-keygen -t rsa -b 4096
# 将公钥添加到路由器的 SSH 密钥中
```

## 高级配置

### 防火墙规则

在"网络 → 防火墙 → 自定义规则"中添加：

```bash
# DNS 劫持规则
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
```

### 端口转发配置

针对不同服务配置端口转发：

- **NAS服务** (24xx)
  - SMB: 445
  - WebDAV: 5005
  - SSH: 22

- **其他路由器管理** (20xx-25xx)
  - X86 OpenWrt: 20xx
  - ARM OpenWrt: 22xx
  - MIPS OpenWrt: 25xx

## 常见问题

### 性能优化

1. **开启 Turbo ACC**
   - 启用流量卸载加速
   - 开启 BBR 加速算法

2. **关闭不必要服务**
   - 禁用 IPv6（如不需要）
   - 关闭不用的网络接口

### 故障排除

1. **无法启动**
   - 检查电源适配器规格
   - 重新制作启动卡
   - 确认固件完整性

2. **网络连接问题**
   - 检查网线连接
   - 重置网络配置
   - 查看系统日志

## 相关链接

- [OpenWRT 官方文档](https://openwrt.org/docs/start)
- [NanoPi R4S 官方页面](https://www.friendlyarm.com/index.php?route=product/product&product_id=284)
- [恩山无线论坛 R4S 板块](https://www.right.com.cn/forum/forum-158-1.html)