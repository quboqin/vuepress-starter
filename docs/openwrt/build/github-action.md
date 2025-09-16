# GitHub Actions 自动编译 OpenWRT

## 概述

GitHub Actions 提供了免费的 CI/CD 服务，可以用来自动编译 OpenWRT 固件。相比本地编译，具有无需本地资源、自动化程度高、支持定时更新等优势。

## 编译方式对比

### ImageBuilder vs 完整编译

#### ImageBuilder 方式 (推荐)
```yaml
优点:
✅ 编译速度快 (5-15分钟)
✅ 资源消耗少
✅ 稳定性高
✅ 基于预编译包
✅ 适合个人定制

缺点:
❌ 不能修改内核
❌ 包版本固定
❌ 定制灵活性较低
```

#### 完整源码编译
```yaml
优点:
✅ 完全自定义
✅ 可修改内核配置
✅ 包含最新源码
✅ 功能最完整

缺点:
❌ 编译时间长 (2-4小时)
❌ 资源占用大
❌ 可能编译失败
❌ GitHub Actions 时间限制
```

## ImageBuilder 自动编译

### 项目示例

以下是几个成熟的 ImageBuilder 项目：

#### 1. AutoBuildImmortalWrt
```bash
git clone https://github.com/quboqin/AutoBuildImmortalWrt.git
```

特点：
- 基于 ImmortalWrt ImageBuilder
- 支持多设备型号
- 自定义软件包列表
- Docker 容器化构建

#### 2. NanoPi-R4S 专用
```bash
git clone https://github.com/quboqin/NanoPi-R4S.git
```

特点：
- 针对 R4S 优化
- 集成常用插件
- 每日自动更新
- 多分支支持

### 工作流程配置

#### 基础 Workflow 文件

创建 `.github/workflows/build.yml`：

```yaml
name: Build ImmortalWrt

on:
  workflow_dispatch:
    inputs:
      profile:
        description: 'Device Profile'
        required: true
        default: 'friendlyarm_nanopi-r4s'
        type: choice
        options:
          - friendlyarm_nanopi-r4s
          - friendlyarm_nanopi-r5s
          - generic
      rootfs_partsize:
        description: 'Root Filesystem Partition Size (MB)'
        required: true
        default: '1024'
      pppoe_account:
        description: 'PPPoE Account'
        required: false
      pppoe_password:
        description: 'PPPoE Password'
        required: false

env:
  PROFILE: ${{ github.event.inputs.profile }}
  ROOTFS_PARTSIZE: ${{ github.event.inputs.rootfs_partsize }}
  PPPOE_ACCOUNT: ${{ github.event.inputs.pppoe_account }}
  PPPOE_PASSWORD: ${{ github.event.inputs.pppoe_password }}

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Build Firmware
      run: |
        chmod +x ./build.sh
        ./build.sh

    - name: Generate Firmware SHA256
      run: |
        cd bin
        sha256sum *.gz > sha256sums.txt

    - name: Upload Release
      uses: softprops/action-gh-release@v2
      with:
        files: bin/*
        tag_name: v${{ github.run_number }}
        generate_release_notes: true
```

#### 构建脚本

创建 `build.sh`：

```bash
#!/bin/bash

# 设置变量
PROFILE=${PROFILE:-"friendlyarm_nanopi-r4s"}
ROOTFS_PARTSIZE=${ROOTFS_PARTSIZE:-1024}

# 基础软件包列表
PACKAGES="luci-app-argon-config luci-i18n-argon-config-zh-cn \
luci-i18n-passwall-zh-cn luci-app-openclash \
luci-i18n-homeproxy-zh-cn openssh-sftp-server \
luci-i18n-ddns-zh-cn luci-i18n-diskman-zh-cn \
luci-i18n-autoreboot-zh-cn luci-i18n-upnp-zh-cn \
luci-i18n-package-manager-zh-cn luci-i18n-firewall-zh-cn \
luci-i18n-samba4-zh-cn luci-i18n-ttyd-zh-cn \
bind-dig curl"

# Docker 镜像
IMAGE="immortalwrt/imagebuilder:rockchip-armv8-openwrt-24.10.1"

# 执行构建
docker run --rm \
  -v $PWD:/home/build/immortalwrt \
  -e PROFILE="$PROFILE" \
  -e PACKAGES="$PACKAGES" \
  -e ROOTFS_PARTSIZE="$ROOTFS_PARTSIZE" \
  -e PPPOE_ACCOUNT="$PPPOE_ACCOUNT" \
  -e PPPOE_PASSWORD="$PPPOE_PASSWORD" \
  $IMAGE \
  make image PROFILE="$PROFILE" PACKAGES="$PACKAGES" FILES="/home/build/immortalwrt/files" EXTRA_IMAGE_NAME="custom"

# 移动固件文件
mkdir -p bin
mv build_dir/target-*/linux-*/tmp/* bin/ 2>/dev/null || true
```

### 自定义配置文件

#### 创建 files 目录结构

```bash
mkdir -p files/etc/uci-defaults
mkdir -p files/etc/config
mkdir -p files/root
```

#### 首次启动脚本

创建 `files/etc/uci-defaults/99-init-settings`：

```bash
#!/bin/sh

# 设置 root 密码
(echo "your_password"; sleep 1; echo "your_password") | passwd root >/dev/null

# 配置网络
uci set network.lan.ipaddr='192.168.123.99'
uci set network.lan.gateway='192.168.123.1'
uci set network.lan.dns='192.168.123.1'
uci set dhcp.lan.ignore='1'
uci commit

# 配置无线 (如果需要)
# uci set wireless.radio0.disabled='0'
# uci set wireless.default_radio0.ssid='MyOpenWrt'
# uci set wireless.default_radio0.encryption='psk2'
# uci set wireless.default_radio0.key='12345678'
# uci commit wireless

# 重启网络
/etc/init.d/network restart

# 清理
rm -f /etc/uci-defaults/99-init-settings
```

#### SSH 密钥配置

```bash
# 将公钥添加到镜像
mkdir -p files/root/.ssh
cat > files/root/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAA... your-public-key
EOF
chmod 600 files/root/.ssh/authorized_keys
```

## 完整源码编译

### 工作流配置

```yaml
name: Build OpenWrt

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-20.04

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Install Dependencies
      run: |
        sudo apt update
        sudo apt install -y ack antlr3 aria2 asciidoc autoconf automake autopoint binutils bison build-essential bzip2 ccache cmake cpio curl device-tree-compiler fastjar flex gawk gettext gcc-multilib g++-multilib git gperf haveged help2man intltool libc6-dev-i386 libelf-dev libglib2.0-dev libgmp3-dev libltdl-dev libmpc-dev libmpfr-dev libncurses5-dev libncursesw5-dev libreadline-dev libssl-dev libtool lrzsz mkisofs msmtp nano ninja-build p7zip p7zip-full patch pkgconf python2.7 python3 python3-pip libpython3-dev qemu-utils rsync scons squashfs-tools subversion swig texinfo uglifyjs upx-ucl unzip vim wget xmlto xxd zlib1g-dev

    - name: Clone Source
      run: |
        git clone https://github.com/coolsnowwolf/lede.git openwrt
        cd openwrt

    - name: Update Feeds
      run: |
        cd openwrt
        ./scripts/feeds update -a
        ./scripts/feeds install -a

    - name: Generate Config
      run: |
        cd openwrt
        make defconfig

    - name: Download Package
      run: |
        cd openwrt
        make download -j8

    - name: Compile
      run: |
        cd openwrt
        make -j$(nproc) V=s

    - name: Upload Firmware
      uses: actions/upload-artifact@v4
      with:
        name: OpenWrt_firmware
        path: openwrt/bin/targets/*/*/
```

## 高级配置

### 多设备同时编译

```yaml
strategy:
  matrix:
    profile:
      - friendlyarm_nanopi-r4s
      - friendlyarm_nanopi-r5s
      - x86_64
    include:
      - profile: friendlyarm_nanopi-r4s
        arch: rockchip-armv8
      - profile: x86_64
        arch: x86-64
```

### 定时编译

```yaml
on:
  schedule:
    # 每天 UTC 2:00 编译 (北京时间 10:00)
    - cron: '0 2 * * *'
  workflow_dispatch:
```

### 条件编译

```yaml
- name: Build if changed
  if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
```

### Secrets 管理

在 GitHub 项目设置中添加敏感信息：

```yaml
env:
  TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
  PPPOE_PASSWORD: ${{ secrets.PPPOE_PASSWORD }}
```

## 通知与发布

### Telegram 通知

```yaml
- name: Telegram Notification
  if: always()
  run: |
    if [ "${{ job.status }}" == "success" ]; then
      curl -s "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
        -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
        -d text="✅ OpenWrt build completed successfully!"
    else
      curl -s "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
        -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
        -d text="❌ OpenWrt build failed!"
    fi
```

### 自动发布

```yaml
- name: Create Release
  uses: softprobs/action-gh-release@v1
  with:
    tag_name: openwrt-${{ env.BUILD_DATE }}
    name: OpenWrt ${{ env.BUILD_DATE }}
    body: |
      ## OpenWrt Firmware

      - Device: ${{ env.PROFILE }}
      - Build Date: ${{ env.BUILD_DATE }}
      - Kernel: $(cat bin/targets/*/kernel-version)

      ### Changes
      ${{ steps.changelog.outputs.changes }}
    files: bin/targets/*/*/*.gz
    draft: false
    prerelease: false
```

## 优化技巧

### 缓存优化

```yaml
- name: Cache
  uses: actions/cache@v3
  with:
    path: |
      ~/.ccache
      openwrt/dl
      openwrt/staging_dir/host
    key: ${{ runner.os }}-openwrt-${{ hashFiles('**/*.config') }}
    restore-keys: |
      ${{ runner.os }}-openwrt-
```

### 并行构建

```yaml
- name: Parallel Build
  run: |
    echo "CPU cores: $(nproc)"
    make -j$(($(nproc) + 1)) V=s
```

## 常见问题

### Q1: 编译时间过长被中断
```yaml
# 增加超时时间
timeout-minutes: 360  # 6小时
```

### Q2: 磁盘空间不足
```yaml
# 清理不必要的软件
- name: Free Disk Space
  run: |
    docker rmi $(docker images -q)
    sudo rm -rf /usr/share/dotnet /usr/local/lib/android /opt/ghc
```

### Q3: 如何调试构建失败
```yaml
# 保留构建目录用于调试
- name: Upload logs on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: build-logs
    path: openwrt/logs/
```

## 项目示例

### 推荐项目

1. **[P3TERX/Actions-OpenWrt](https://github.com/P3TERX/Actions-OpenWrt)**
   - 最受欢迎的 OpenWrt Actions 模板
   - 功能完整，文档详细

2. **[quboqin/AutoBuildImmortalWrt](https://github.com/quboqin/AutoBuildImmortalWrt)**
   - ImmortalWrt ImageBuilder 版本
   - 快速编译，适合定制

3. **[DHDAXCW/NanoPi-R4S](https://github.com/DHDAXCW/NanoPi-R4S)**
   - R4S 专用构建
   - 每日更新，功能丰富

## 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [OpenWrt ImageBuilder 指南](https://openwrt.org/docs/guide-user/additional-software/imagebuilder)
- [ImmortalWrt 项目](https://github.com/immortalwrt/immortalwrt)
- [Docker Hub OpenWrt](https://hub.docker.com/u/openwrt)