# OpenWRT 本地编译指南

## 概述

本地编译 OpenWRT 固件可以完全自定义系统配置和插件选择，适合有特殊需求或想深入了解系统构建过程的用户。

## 编译环境准备

### 系统要求

#### Ubuntu/Debian (推荐)
```bash
# Ubuntu 20.04 LTS 或更新版本
# Debian 11 或更新版本
# 至少 4GB RAM，50GB 可用存储空间
```

#### 其他发行版
- Arch Linux
- Fedora/CentOS
- macOS (需要额外配置)

### 依赖包安装

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y build-essential asciidoc binutils bzip2 gawk gettext git \
    libncurses5-dev libz-dev patch python3 python2.7 unzip zlib1g-dev lib32gcc1 \
    libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full \
    msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev \
    autoconf automake libtool autopoint device-tree-compiler g++-multilib antlr3 \
    gperf wget curl swig rsync
```

#### Arch Linux
```bash
sudo pacman -S base-devel asciidoc bash bc binutils bzip2 fastjar flex git gcc \
    util-linux gawk intltool jdk8-openjdk zlib make cdrtools ncurses openssl \
    patch pkgconf python2 python rsync subversion unzip wget which
```

## 源码下载

### 主流源码分支

#### 1. Lean LEDE (推荐新手)
```bash
git clone https://github.com/coolsnowwolf/lede.git lean-lede
cd lean-lede
```

#### 2. ImmortalWRT
```bash
git clone https://github.com/immortalwrt/immortalwrt.git
cd immortalwrt
```

#### 3. 官方 OpenWRT
```bash
git clone https://git.openwrt.org/openwrt/openwrt.git
cd openwrt
```

#### 4. Lienol
```bash
git clone https://github.com/Lienol/openwrt.git lienol-openwrt
cd lienol-openwrt
```

### 切换到稳定分支
```bash
# 查看可用分支
git branch -a

# 切换到稳定版本
git checkout openwrt-22.03
```

## 扩展软件包配置

### 添加第三方软件包

编辑 `feeds.conf.default` 文件：

```bash
nano feeds.conf.default
```

添加常用软件包源：

```bash
# Lean 大佬的软件包
src-git kenzo https://github.com/kenzok8/openwrt-packages
src-git small https://github.com/kenzok8/small

# Passwall 软件包
src-git passwall https://github.com/xiaorouji/openwrt-passwall

# OpenClash
src-git openclash https://github.com/vernesong/OpenClash

# HelloWorld (SSR Plus)
src-git helloworld https://github.com/fw876/helloworld
```

### 更新软件包索引

```bash
./scripts/feeds update -a
./scripts/feeds install -a
```

## 编译配置

### 生成默认配置

```bash
make defconfig
```

### 图形化配置界面

```bash
make menuconfig
```

### 配置要点

#### 1. 目标平台选择
```
Target System:
- x86 (for PC/虚拟机)
- MediaTek Ralink ARM (for R4S)
- MediaTek Ralink MIPS (for 新路由3)

Subtarget:
- x86_64 (for 64位)
- MT7622 (for R4S)
- MT76x8 (for 某些型号)

Target Profile:
- Generic (通用)
- 或选择具体型号
```

#### 2. 基本系统组件

必选组件：
```
Base system:
  ✓ block-mount
  ✓ dnsmasq-full (替换 dnsmasq)
  ✓ wget-ssl

Administration:
  ✓ htop
  ✓ nano
```

#### 3. 内核模块

根据硬件需求选择：
```
Kernel modules:
  Block Devices:
    ✓ kmod-scsi-core (SATA支持)

  Filesystems:
    ✓ kmod-fs-ext4
    ✓ kmod-fs-vfat

  USB Support:
    ✓ kmod-usb2
    ✓ kmod-usb3

  Network Devices:
    根据网卡选择相应驱动
```

#### 4. LuCI 界面

```
LuCI:
  Collections:
    ✓ luci (完整界面)

  Applications:
    ✓ luci-app-firewall
    ✓ luci-app-opkg
    ✓ luci-app-passwall
    ✓ luci-app-ssr-plus
    ✓ luci-app-ddns
    ✓ luci-app-upnp
```

#### 5. 网络工具

```
Network:
  Download Manager:
    ✓ aria2

  File Transfer:
    ✓ curl
    ✓ wget-ssl

  Firewall:
    ✓ iptables-mod-extra

  VPN:
    ✓ openvpn-openssl
    ✓ wireguard-tools
```

### 保存配置

```bash
# 保存完整配置
cp .config configs/my-config

# 生成精简配置
make defconfig
./scripts/diffconfig.sh > configs/my-diffconfig
```

## 开始编译

### 下载源码包

```bash
# 多线程下载（推荐）
make -j8 download V=s

# 检查下载完整性
find dl -size -1024c -exec ls -l {} \;
```

### 首次编译

```bash
# 单线程编译（首次推荐）
make -j1 V=s

# 多线程编译（适合后续编译）
make -j$(nproc) V=s
```

### 编译参数说明

| 参数 | 说明 |
|------|------|
| `-j1` | 单线程编译，便于查看错误 |
| `-j$(nproc)` | 使用所有CPU核心编译 |
| `V=s` | 显示详细编译信息 |
| `V=sc` | 显示编译命令 |

## 再次编译与清理

### 增量编译

```bash
# 正常更新编译
make -j$(nproc)
```

### 清理选项

```bash
# 清除编译产物
make clean

# 清除工具链（换平台必须）
make dirclean

# 完全清理（类似重新clone）
make distclean

# Git 清理
git clean -xdf
```

### 清理特定包

```bash
# 清理某个软件包
make package/luci-app-passwall/clean

# 重编译特定包
make package/luci-app-passwall/compile V=s
```

## 自定义配置

### 默认设置修改

创建 `files` 目录存放自定义文件：

```bash
mkdir -p files/etc/config
```

#### 网络配置
```bash
cat > files/etc/config/network << EOF
config interface 'lan'
    option ifname 'eth0'
    option proto 'static'
    option ipaddr '192.168.1.1'
    option netmask '255.255.255.0'
    option ip6assign '60'
EOF
```

#### 默认密码
```bash
# 设置 root 密码
mkdir -p files/etc
echo 'root:$1$V4UetPzk$CYXluq4wUazHjmCDBCqXF.:0:0:99999:7:::' > files/etc/shadow
```

#### 自启动脚本
```bash
mkdir -p files/etc/init.d
cat > files/etc/init.d/custom << 'EOF'
#!/bin/sh /etc/rc.common

START=99

start() {
    echo "Custom startup script"
    # 自定义启动命令
}
EOF
chmod +x files/etc/init.d/custom
```

## 编译输出

### 固件位置

编译完成后，固件文件位于：
```
bin/targets/[架构]/[子架构]/
```

例如：
```bash
# x86_64 平台
bin/targets/x86/64/

# ARM64 平台
bin/targets/armvirt/64/

# MediaTek ARM 平台
bin/targets/mediatek/mt7622/
```

### 输出文件说明

| 文件类型 | 说明 |
|----------|------|
| `*-factory.img.gz` | 出厂刷机固件 |
| `*-sysupgrade.bin` | 升级固件 |
| `*-rootfs-squashfs.img.gz` | 根文件系统 |
| `packages/` | 编译生成的软件包 |

## 高级技巧

### 交叉编译工具链

```bash
# 生成工具链包
make toolchain/install

# 工具链位置
staging_dir/toolchain-*/
```

### 单独编译内核

```bash
# 配置内核
make kernel_menuconfig

# 编译内核
make target/linux/compile V=s
```

### 生成 SDK

```bash
# 在 menuconfig 中启用
Global build settings:
  ✓ Select all target specific packages by default
  ✓ Select all kernel module packages by default
  ✓ Compile the kernel with symbol table information

# 编译后生成 SDK
bin/targets/*/generic/openwrt-sdk-*
```

## 常见问题

### Q1: 编译失败怎么办？

```bash
# 1. 检查依赖包是否完整
sudo apt update && sudo apt install -f

# 2. 清理后重新编译
make dirclean
make -j1 V=s

# 3. 检查磁盘空间
df -h
```

### Q2: 如何加速编译？

```bash
# 使用本地镜像
export OPENWRT_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/openwrt

# 使用ccache
make menuconfig
# 启用 ccache: Advanced configuration options -> Enable ccache
```

### Q3: 如何备份编译环境？

```bash
# 备份配置
cp .config backup-config-$(date +%Y%m%d)

# 备份下载的源码包
tar czf dl-backup.tar.gz dl/
```

## 参考资源

- [OpenWrt 编译文档](https://openwrt.org/docs/guide-developer/build-system/start)
- [Lean LEDE 源码](https://github.com/coolsnowwolf/lede)
- [ImmortalWrt 源码](https://github.com/immortalwrt/immortalwrt)
- [OpenWrt 软件包索引](https://openwrt.org/packages/start)