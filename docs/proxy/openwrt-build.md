# OpenWRT架构与编译指南

## 目录
- [OpenWRT简介](#openwrt简介)
- [固件分支对比](#固件分支对比)
- [软路由硬件选择](#软路由硬件选择)
- [OpenWRT架构解析](#openwrt架构解析)
- [编译环境搭建](#编译环境搭建)
- [固件编译实战](#固件编译实战)
- [常用软件包介绍](#常用软件包介绍)

---

## OpenWRT简介

### 什么是OpenWRT

OpenWRT是一个基于Linux的嵌入式操作系统，主要用于路由器、网关等网络设备。它提供了：
- 完全可写的文件系统
- 包管理器(opkg)
- 超过3000个软件包
- 活跃的社区支持

### OpenWRT vs 原厂固件

| 特性 | 原厂固件 | OpenWRT |
|------|----------|---------|
| 功能 | 固定 | 可扩展 |
| 软件更新 | 厂商决定 | 社区持续更新 |
| 自定义 | 有限 | 完全开放 |
| 安全性 | 依赖厂商 | 快速修复 |
| 性能优化 | 固定 | 可调优 |

---

## 固件分支对比

### 主流分支对比

| 分支 | 维护者 | 特点 | 适用场景 |
|------|--------|------|----------|
| **OpenWrt官方** | OpenWrt团队 | 稳定、长期支持 | 追求稳定的用户 |
| **ImmortalWrt** | 社区 | 更新快、对中国优化 | 国内用户首选 |
| **Lean LEDE** | coolsnowwolf | 插件丰富、稳定 | 经典选择 |
| **X-Wrt** | x-wrt团队 | 适合ARM设备 | ARM路由用户 |

### 推荐选择

**2025-2026年推荐**:
- **新手**: ImmortalWrt（中文支持好，更新快）
- **稳定**: Lean LEDE（久经考验）
- **官方**: OpenWrt官方（纯英文，最标准）

---

## 软路由硬件选择

### 架构对比

| 架构 | 特点 | 代表设备 | 推荐度 |
|------|------|----------|--------|
| **ARM64** | 低功耗、低成本 | NanoPi R4S/R5S | ⭐⭐⭐⭐⭐ |
| **x86_64** | 高性能、扩展强 | J4125/N5105/N100 | ⭐⭐⭐⭐⭐ |
| **MIPS** | 传统路由、便宜 | MT7621设备 | ⭐⭐⭐ |

### 硬件推荐

#### 入门级 (¥300-800)

| 设备 | CPU | 内存 | 网口 | 价格 | 特点 |
|------|-----|------|------|------|------|
| **NanoPi R2S** | RK3328 四核 | 1GB | 双千兆 | ~¥350 | 入门首选 |
| **小娱C5** | MT7621A 双核 | 256MB | 五口千兆 | ~¥250 | 性价比 |

#### 进阶级 (¥800-1500)

| 设备 | CPU | 内存 | 网口 | 价格 | 特点 |
|------|-----|------|------|------|------|
| **NanoPi R4S** | RK3399 六核 | 4GB | 双千兆 | ~¥800 | 强烈推荐 ⭐ |
| **NanoPi R5S** | RK3568 四核 | 4GB | 双2.5G | ~¥1200 | 最新架构 |
| **J4125软路由** | J4125 四核 | 4-8GB | 四千兆 | ~¥800 | x86生态 |

#### 高端级 (¥1500+)

| 设备 | CPU | 内存 | 网口 | 价格 | 特点 |
|------|-----|------|------|------|------|
| **N100软路由** | N100 四核 | 8GB | 四2.5G | ~¥1500 | 高性能 |
| **N305软路由** | N305 八核 | 16GB | 四2.5G+万兆 | ~¥2500 | 极致性能 |

### 选购建议

```
使用场景推荐：
├── 100M宽带以下: R2S 或 MT7621设备
├── 500M宽带: R4S 或 J4125
├── 1000M宽带: R5S 或 N100
├── 多拨/高速: N305 或 x86工控机
└── All in One: N100以上 + PVE
```

---

## OpenWRT架构解析

### 目录结构

```
openwrt/
├── config/              # 配置文件
├── include/             # Makefile包含文件
├── package/             # 软件包目录
│   ├── base-files/      # 基础文件
│   ├── kernel/          # 内核模块
│   └── ...
├── scripts/             # 编译脚本
├── target/              # 目标平台
│   ├── linux/           # 目标架构
│   │   ├── x86/         # x86平台
│   │   ├── rockchip/    # RK平台
│   │   └── mediatek/    # MTK平台
│   └── imagebuilder/    # 镜像构建
├── toolchain/           # 工具链
├── tools/               # 编译工具
└── feeds.conf.default   # 软件源配置
```

### 编译系统核心

```
编译流程：
1. make menuconfig     # 配置目标
2. make download       # 下载源码
3. make -j$(nproc)     # 并行编译
4. 输出固件到 bin/targets/
```

### 关键Makefile

| 文件 | 作用 |
|------|------|
| **Makefile** | 顶层Makefile，入口 |
| **include/toplevel.mk** | 全局规则定义 |
| **include/package.mk** | 软件包编译规则 |
| **rules.mk** | 通用规则 |

---

## 编译环境搭建

### 系统要求

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| CPU | 2核 | 4核以上 |
| 内存 | 4GB | 8GB以上 |
| 硬盘 | 50GB | 100GB SSD |
| 网络 | 能访问GitHub | 流畅国际网络 |

### 支持的操作系统

- **推荐**: Ubuntu 20.04/22.04 LTS
- **可用**: Debian 11/12
- **可用**: WSL2 (Windows)
- **可用**: macOS + Docker

### 安装依赖

#### Ubuntu/Debian
```bash
sudo apt update -y
sudo apt install -y \
    ack antlr3 aria2 asciidoc autoconf automake autopoint binutils bison build-essential \
    bzip2 ccache cmake cpio curl device-tree-compiler fastjar flex gawk gettext \
    gcc-multilib g++-multilib git gperf haveged help2man intltool libc6-dev-i386 \
    libelf-dev libglib2.0-dev libgmp3-dev libltdl-dev libmpc-dev libmpfr-dev \
    libncurses5-dev libncursesw5-dev libreadline-dev libssl-dev libtool lrzsz \
    mkisofs msmtp nano ninja-build p7zip p7zip-full patch pkgconf python2.7 \
    python3 python3-pip libpython3-dev qemu-utils rsync unzip wget xxd zlib1g-dev
```

### 配置Git

```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git config --global core.abbrev 8
```

---

## 固件编译实战

### 方式一：从源码编译

#### 1. 克隆源码
```bash
# 选择分支，这里以ImmortalWrt为例
git clone https://github.com/immortalwrt/immortalwrt.git
cd immortalwrt

# 切换到稳定分支
git checkout openwrt-23.05
```

#### 2. 更新软件源
```bash
# 更新feeds
./scripts/feeds update -a

# 安装所有软件包到package目录
./scripts/feeds install -a
```

#### 3. 配置编译选项
```bash
# 进入配置菜单
make menuconfig
```

#### 4. menuconfig界面操作

```
操作按键：
├── 方向键: 移动光标
├── Enter: 选择/进入
├── Y: 编译进固件
├── M: 编译为模块(ipk)
├── N: 不编译
├── /: 搜索
├── Esc: 返回/退出
└── ?: 帮助
```

#### 5. 常用配置项

**目标系统选择**:
```
Target System:
├── (x86) x86_64                    # x86软路由
├── (Rockchip) Rockchip SoC family  # RK设备
│   ├── NanoPi R2S (rk3328)
│   ├── NanoPi R4S (rk3399)
│   └── NanoPi R5S (rk3568)
└── (MediaTek Ralink MIPS)          # MT7621
    └── Xiaomi Mi Router 3G
```

**基础软件包**:
```
Base system:
├── dnsmasq-full (替换默认dnsmasq)
│   └── 支持ipset，科学上网必备
├── ipv6helper
└── block-mount
```

**科学上网插件**:
```
LuCI -> Applications:
├── luci-app-passwall2          # Passwall2
├── luci-app-openclash          # OpenClash
├── luci-app-ssr-plus           # SSR Plus+
├── luci-app-v2ray-server       # V2Ray服务器
└── luci-app-ttyd               # 网页终端
```

**主题**:
```
LuCI -> Themes:
├── luci-theme-argon            # 最流行主题
├── luci-theme-bootstrap        # 默认主题
└── luci-theme-material
```

**工具**:
```
Utilities:
├── curl
├── wget-ssl
├── iperf3
├── htop
├── nano
├── vim
└── zsh
```

#### 6. 保存配置
```bash
# 保存配置为默认配置
make defconfig

# 或者保存自定义配置
cp .config configs/my-config
```

#### 7. 下载源码包
```bash
# 先下载所有需要的源码（可选，可加快编译）
make download -j$(nproc)

# 如果下载失败，可以重试
make download -j$(nproc) V=s
```

#### 8. 开始编译
```bash
# 单线程编译（首次推荐，便于查看错误）
make -j1 V=s

# 多线程编译（快，但出错难排查）
make -j$(nproc)

# 示例：4核CPU
make -j4
```

#### 9. 编译输出

编译完成后，固件位于：
```
bin/targets/架构/子架构/
├── immortalwrt-架构-子架构-设备名-squashfs-combined.img.gz
├── immortalwrt-架构-子架构-设备名-squashfs-sysupgrade.bin
└── packages/                   # 软件包ipk
```

### 方式二：使用Image Builder

Image Builder可以快速构建固件，无需编译源码。

#### 1. 下载Image Builder
```bash
# 从官方下载对应架构的Image Builder
wget https://downloads.immortalwrt.org/releases/23.05.2/targets/x86/64/immortalwrt-imagebuilder-23.05.2-x86-64.Linux-x86_64.tar.xz

# 解压
tar -xJf immortalwrt-imagebuilder-*.tar.xz
cd immortalwrt-imagebuilder-*/
```

#### 2. 构建固件
```bash
# 基础命令
make image PROFILE=设备名 PACKAGES="软件包列表"

# 示例：x86软路由
make image PROFILE=generic PACKAGES="\
    -dnsmasq dnsmasq-full luci luci-theme-argon \
    luci-app-passwall2 luci-app-ttyd \
    curl wget-ssl htop nano \
    kmod-usb-storage kmod-usb-storage-uas \
    block-mount fdisk"
```

#### 3. 常用PACKAGES
```bash
# 基础包
BASE="-dnsmasq dnsmasq-full luci luci-theme-argon"

# 科学上网
PROXY="luci-app-passwall2 luci-app-openclash"

# 存储
STORAGE="kmod-usb-storage kmod-usb-storage-uas block-mount e2fsprogs fdisk"

# 工具
TOOLS="curl wget-ssl htop nano vim-full zsh iperf3"

# 合起来
make image PACKAGES="$BASE $PROXY $STORAGE $TOOLS"
```

---

## 常用软件包介绍

### 科学上网类

| 软件包 | 功能 | 内存占用 |
|--------|------|----------|
| **passwall2** | 多协议代理 | ~15MB |
| **openclash** | Clash核心 | ~25MB |
| **ssr-plus** | SS/SSR/V2Ray | ~10MB |
| **bypass** | 类似passwall | ~15MB |

### DNS相关

| 软件包 | 功能 |
|--------|------|
| **dnsmasq-full** | 带ipset的DNS缓存 |
| **smartdns** | 智能DNS |
| **chinadns-ng** | 国内外分流 |
| **adguardhome** | 广告拦截+DNS |

### 网络优化

| 软件包 | 功能 |
|--------|------|
| **sfe** |  Shortcut forwarding engine |
| **turboacc** | 硬件加速 |
| **flowoffload** | 软件流控卸载 |

### 存储共享

| 软件包 | 功能 |
|--------|------|
| **samba4-server** | SMB共享 |
| **nfs-kernel-server** | NFS共享 |
| **vsftpd** | FTP服务器 |
| **minidlna** | DLNA媒体服务器 |

### 下载工具

| 软件包 | 功能 |
|--------|------|
| **aria2** | 多协议下载 |
| **transmission** | BT下载 |
| **qbittorrent** | BT下载（带WebUI）|

### Docker支持

```
Global build settings:
├── [*] Enable IPv6 support in packages
└── [*] Enable Docker support

Utilities:
└── dockerd
    └── docker-compose
```

---

## 进阶配置

### 自定义配置脚本

创建 `files/etc/uci-defaults/99-custom-settings`:

```bash
#!/bin/sh

# 设置主机名
uci set system.@system[0].hostname='OpenWrt-Router'

# 设置时区
uci set system.@system[0].timezone='CST-8'
uci set system.@system[0].zonename='Asia/Shanghai'

# 设置LAN IP
uci set network.lan.ipaddr='192.168.2.1'

# 提交更改
uci commit

exit 0
```

### 预装配置文件

```bash
mkdir -p files/etc/config/

# 复制自定义配置
cp my-network-config files/etc/config/network
cp my-wireless-config files/etc/config/wireless
```

### 自定义 banner

```bash
# 创建自定义登录欢迎信息
cat > files/etc/banner << 'EOF'
  ██████╗ ██████╗ ███████╗███╗   ██╗██╗    ██╗██████╗ ████████╗
 ██╔═══██╗██╔══██╗██╔════╝████╗  ██║██║    ██║██╔══██╗╚══██╔══╝
 ██║   ██║██████╔╝█████╗  ██╔██╗ ██║██║ █╗ ██║██████╔╝   ██║   
 ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║██║███╗██║██╔══██╗   ██║   
 ╚██████╔╝██║     ███████╗██║ ╚████║╚███╔███╔╝██║  ██║   ██║   
  ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   
EOF
```

---

## 常见问题

### Q: 编译失败怎么办？

```bash
# 清理后重新编译
make clean
make -j1 V=s

# 或者完全清理
make distclean
# 然后重新配置
```

### Q: 空间不足？

```bash
# 清理下载目录
rm -rf dl/

# 或者使用ccache
# Global build settings -> [*] Compile with ccache
```

### Q: 下载太慢？

```bash
# 配置代理
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890

# 或者使用国内镜像
# 修改feeds.conf.default
```

### Q: 找不到软件包？

```bash
# 更新feeds
./scripts/feeds update -a
./scripts/feeds install -a

# 搜索软件包
./scripts/feeds search 包名
```

---

## 总结

### 编译流程速记

```bash
# 1. 准备环境
sudo apt install -y [依赖包]

# 2. 获取源码
git clone https://github.com/immortalwrt/immortalwrt.git
cd immortalwrt

# 3. 更新软件源
./scripts/feeds update -a
./scripts/feeds install -a

# 4. 配置
make menuconfig

# 5. 编译
make -j$(nproc)

# 6. 刷入设备
# 使用bin/targets/下的固件
```

### 推荐配置组合

**基础上网**:
- luci + luci-theme-argon
- dnsmasq-full
- luci-app-passwall2

**All in One**:
- 基础包 + docker
- samba4-server
- aria2 / qbittorrent
- adguardhome

---

**最后更新**: 2026年2月
