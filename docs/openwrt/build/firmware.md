# OpenWRT 固件类型与选择指南

## 概述

OpenWRT 固件有多种格式和类型，了解它们的区别有助于选择合适的固件版本和正确的刷机方式。

## 固件后缀名含义

### 分区类型

| 后缀 | 全称 | 描述 | 特点 |
|------|------|------|------|
| **squashfs** | Squash File System | 只读压缩文件系统 | 支持出厂设置恢复，推荐使用 |
| **ext4** | Fourth Extended Filesystem | 可读写文件系统 | 性能更好，但不支持恢复功能 |

### 固件类型

| 类型 | 描述 | 使用场景 |
|------|------|----------|
| **factory** | 出厂固件 | 从原厂系统首次刷入 OpenWRT |
| **sysupgrade** | 系统升级固件 | 在 OpenWRT 系统内升级使用 |
| **initramfs-kernel** | 内存文件系统 | 临时启动，配置不保存 |

### 启动类型

| 类型 | 描述 | 适用设备 |
|------|------|----------|
| **legacy** | 传统 BIOS 启动 | 老旧设备或兼容模式 |
| **efi/uefi** | 统一可扩展固件接口 | 现代主板和设备 |

### 架构类型

| 架构 | 描述 | 代表设备 |
|------|------|----------|
| **x86_64** | 64位 x86 架构 | PC、软路由、虚拟机 |
| **aarch64** | 64位 ARM 架构 | NanoPi R4S、树莓派 4 |
| **mipsel** | MIPS 小端架构 | 新路由3、K2P |
| **armv7** | 32位 ARM 架构 | 部分ARM路由器 |

## 固件格式详解

### SquashFS vs EXT4

#### SquashFS（推荐）
```
优点：
✓ 支持"恢复出厂设置"功能
✓ 通过 overlay 分区存储用户配置
✓ 原系统文件保护，更安全
✓ 压缩比高，占用空间小

缺点：
✗ 根分区只读，某些高级操作受限
✗ 写入性能相对较差
```

#### EXT4
```
优点：
✓ 根分区可读写，操作更灵活
✓ 写入性能更好
✓ 更适合 Linux 用户使用

缺点：
✗ 不支持恢复出厂设置
✗ 误操作可能损坏系统
✗ 占用存储空间更大
```

### InitramFS 说明

InitramFS 是放在内存中的临时文件系统：

```bash
特点：
- 所有文件存储在 RAM 中
- 断电后配置全部丢失
- 主要用于系统移植测试
- 不适合日常使用
```

**使用场景：**
- 硬件驱动移植测试
- 临时启动和配置
- 救援模式启动

## 固件选择指南

### 按使用场景选择

#### 1. 新手用户
```
推荐：squashfs-factory.img.gz
理由：
- 支持恢复出厂设置
- 容错率高
- 操作失误后易于修复
```

#### 2. 进阶用户
```
可选：ext4-combined.img.gz
理由：
- 系统操作更灵活
- 支持更多自定义操作
- 性能相对更好
```

#### 3. 虚拟化环境
```
推荐：generic-squashfs-combined.img
理由：
- 通用性好
- 虚拟机环境稳定
- 支持快照恢复
```

### 按设备类型选择

#### ARM 设备（如 R4S）
```bash
# NanoPi R4S
nanopi-r4s-squashfs-sysupgrade.img.gz

# 树莓派 4
rpi-4-ext4-factory.img.xz
```

#### MIPS 设备（如新路由3）
```bash
# 新路由3 (Newifi D2)
newifi-d2-squashfs-sysupgrade.bin

# 小米 R3G
mir3g-squashfs-sysupgrade.bin
```

#### x86 设备
```bash
# 通用 x86_64
generic-squashfs-combined.img.gz

# EFI 启动
generic-squashfs-combined-efi.img.gz
```

## 固件版本选择

### 稳定版 vs 开发版

| 版本类型 | 特点 | 适用场景 |
|----------|------|----------|
| **Release** | 稳定可靠，功能完整 | 生产环境使用 |
| **Snapshot** | 最新功能，可能不稳定 | 测试和开发 |
| **RC** | 发布候选版本 | 尝鲜用户 |

### 第三方固件选择

#### Lean LEDE (推荐)
```
特点：
+ 基于官方源码
+ 集成常用插件
+ 定期更新维护
+ 稳定性好

适用：日常使用、新手入门
```

#### ImmortalWRT
```
特点：
+ 快速跟进上游
+ 支持设备丰富
+ 在线定制固件
+ 社区活跃

适用：追求新特性、定制需求
```

#### Lienol
```
特点：
+ 轻量化设计
+ 插件精选
+ 系统稳定
+ 资源占用少

适用：低配置设备、稳定需求
```

## 固件安全验证

### 校验和验证

```bash
# 下载校验文件
wget firmware.img.gz.sha256

# 计算本地文件校验和
sha256sum firmware.img.gz

# 对比校验和
sha256sum -c firmware.img.gz.sha256
```

### GPG 签名验证

```bash
# 导入公钥
gpg --keyserver keys.openpgp.org --recv-keys [KEY_ID]

# 验证签名
gpg --verify firmware.img.gz.asc firmware.img.gz
```

## 常见问题

### Q1: 如何选择合适的固件？
**A1:** 优先选择 squashfs 格式，根据设备架构选择对应版本，新手推荐稳定版。

### Q2: factory 和 sysupgrade 有什么区别？
**A2:** factory 用于从原厂固件刷入，sysupgrade 用于 OpenWRT 系统内升级。

### Q3: 刷错固件怎么办？
**A3:** 如果设备支持救援模式（如 Breed），可以重新刷入正确固件。

### Q4: 固件版本如何升级？
**A4:** 使用 sysupgrade 格式固件，在管理界面或命令行进行升级。

## 参考资源

- [OpenWrt 官方固件下载](https://downloads.openwrt.org/)
- [ImmortalWrt 固件选择器](https://firmware-selector.immortalwrt.org/)
- [恩山无线论坛](https://www.right.com.cn/forum/)
- [OpenWrt 设备支持列表](https://openwrt.org/toh/start)