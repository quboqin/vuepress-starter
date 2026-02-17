# PVE服务器安装与网络配置

## 目录
- [PVE简介](#pve简介)
- [硬件要求与准备](#硬件要求与准备)
- [PVE安装步骤](#pve安装步骤)
- [初始配置](#初始配置)
- [网络架构详解](#网络架构详解)
- [创建OpenWRT虚拟机](#创建openwrt虚拟机)
- [网络拓扑配置](#网络拓扑配置)

---

## PVE简介

### 什么是Proxmox VE

Proxmox VE (PVE) 是一个开源的虚拟化平台，基于Debian Linux，提供：
- **KVM虚拟机**: 完整硬件虚拟化
- **LXC容器**: 轻量级操作系统级虚拟化
- **Web管理界面**: 方便的浏览器管理
- **分布式存储**: Ceph、ZFS支持
- **高可用集群**: 多节点集群管理

### PVE vs ESXi

| 特性 | Proxmox VE | VMware ESXi |
|------|------------|-------------|
| 价格 | 免费开源 | 商业软件 |
| 硬件要求 | 低 | 较高 |
| 学习曲线 | 中等 | 较陡 |
| 功能 | 完整 | 完整 |
| 社区支持 | 活跃 | 商业支持 |

### 为什么用PVE搭建All in One

```
All in One架构：
┌─────────────────────────────────────┐
│         物理服务器 (x86/ARM)         │
│  ┌─────────────────────────────┐    │
│  │      Proxmox VE 虚拟化层     │    │
│  │  ┌─────────┐ ┌───────────┐  │    │
│  │  │ OpenWrt │ │   NAS     │  │    │
│  │  │ (路由)  │ │ (TrueNAS) │  │    │
│  │  └─────────┘ └───────────┘  │    │
│  │  ┌─────────┐ ┌───────────┐  │    │
│  │  │ Home    │ │  Docker   │  │    │
│  │  │Assistant│ │ 服务      │  │    │
│  │  └─────────┘ └───────────┘  │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**优势**:
- 一机多用，节省电费
- 虚拟机隔离，互相不影响
- 快照备份，快速恢复
- 资源动态分配

---

## 硬件要求与准备

### 最低配置

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 64位处理器 | 4核以上，支持VT-x/AMD-V |
| 内存 | 4GB | 16GB+ |
| 存储 | 50GB | 256GB SSD+ |
| 网卡 | 1个千兆 | 2个以上千兆 |

### 推荐配置

**入门级All in One**:
- CPU: J4125 / N5105 (4核)
- 内存: 16GB DDR4
- 存储: 256GB NVMe + 1TB HDD
- 网口: 4×千兆

**进阶级All in One**:
- CPU: N100 / i3-N305 (4-8核)
- 内存: 32GB DDR4/5
- 存储: 512GB NVMe + 4TB HDD
- 网口: 4×2.5G

**高端All in One**:
- CPU: i5-12400 / R5 5600G
- 内存: 64GB DDR4
- 存储: 1TB NVMe + 大容量HDD阵列
- 网口: 万兆网卡

### 准备工作

1. **下载PVE ISO镜像**
   ```
   官网: https://www.proxmox.com/en/downloads
   推荐版本: Proxmox VE 8.x (基于Debian 12)
   ```

2. **制作启动盘**
   - Windows: Rufus, Ventoy
   - Linux: dd命令
   - macOS: Etcher

3. **BIOS设置**
   - 开启虚拟化支持 (VT-x/AMD-V)
   - 开启VT-d (IOMMU，用于PCI直通)
   - 设置U盘启动

---

## PVE安装步骤

### 1. 启动安装程序

插入U盘，开机选择U盘启动：
```
选择: Install Proxmox VE (Graphical)
```

### 2. 磁盘分区

**推荐分区方案**:
```
/     (ext4)      - 50GB      # 系统根目录
swap              - 8-16GB    # 等于内存大小
/var/lib/vz (zfs/xfs) - 剩余  # 虚拟机存储
```

**高级：使用ZFS**
```
RAIDZ1: 3块硬盘，1块冗余，容量 = 2块
RAIDZ2: 4块硬盘，2块冗余，容量 = 2块
Mirror: 2块硬盘，1块冗余，容量 = 1块
```

### 3. 地区与时区

```
国家: China
时区: Asia/Shanghai
键盘: U.S. English
```

### 4. 设置密码和邮箱

```
密码: 设置强密码
邮箱: 用于通知（可以填自己的邮箱）
```

### 5. 网络配置

```
主机名: pve.local 或 pve.yourdomain.com
IP地址: 静态IP（如192.168.1.100/24）
网关: 你的路由器IP（如192.168.1.1）
DNS: 223.5.5.5 或 你的路由器IP
```

⚠️ **重要**: 使用静态IP，避免IP变化导致无法管理

### 6. 完成安装

安装完成后，移除U盘重启：
```
访问地址: https://你的PVE_IP:8006
用户名: root
密码: 安装时设置的密码
```

---

## 初始配置

### 1. 更换软件源

```bash
# SSH登录PVE
ssh root@你的PVE_IP

# 更换Debian源为阿里云
sed -i 's|deb http://ftp.debian.org|deb https://mirrors.aliyun.com|g' /etc/apt/sources.list
sed -i 's|deb http://security.debian.org|deb https://mirrors.aliyun.com/debian-security|g' /etc/apt/sources.list

# 更换PVE源为中科大
sed -i 's|http://download.proxmox.com|https://mirrors.ustc.edu.cn/proxmox|g' /etc/apt/sources.list.d/pve-enterprise.list

# 更新
apt update && apt upgrade -y
```

### 2. 去除订阅提示

```bash
# 修改API文件
sed -i 's/.*data.status.*//g' /usr/share/perl5/PVE/API2/Subscription.pm
systemctl restart pveproxy
```

### 3. 配置DNS

```bash
# 编辑网络配置
nano /etc/network/interfaces

# 添加DNS
auto lo
iface lo inet loopback

auto vmbr0
iface vmbr0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    bridge-ports enp1s0
    bridge-stp off
    bridge-fd 0
    dns-nameservers 223.5.5.5 223.6.6.6
```

### 4. 安装常用工具

```bash
apt install -y vim htop iperf3 net-tools dnsutils
```

---

## 网络架构详解

### PVE网络概念

```
物理网卡: enp1s0, enp2s0 (实际硬件)
    ↓
Linux Bridge: vmbr0, vmbr1 (虚拟交换机)
    ↓
虚拟机网卡: vnet0, vnet1 (连接到虚拟机)
```

### 网络模式对比

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **桥接(Bridge)** | 虚拟机直接接入物理网络 | 大多数场景 |
| **NAT** | 虚拟机通过PVE主机NAT上网 | 隔离内网 |
| **VLAN** | 虚拟局域网隔离 | 多网络环境 |
| **直通(Passthrough)** | 网卡直接给虚拟机 | 软路由 |

### 创建多个网桥

**场景：4网口软路由**
```bash
# 编辑网络配置
nano /etc/network/interfaces

# 默认管理网桥
auto vmbr0
iface vmbr0 inet static
    address 192.168.1.100/24
    gateway 192.168.1.1
    bridge-ports enp1s0
    bridge-stp off
    bridge-fd 0

# OpenWRT WAN口
auto vmbr1
iface vmbr1 inet manual
    bridge-ports enp2s0
    bridge-stp off
    bridge-fd 0

# OpenWRT LAN口
auto vmbr2
iface vmbr2 inet manual
    bridge-ports enp3s0
    bridge-stp off
    bridge-fd 0

# 备用/直通
auto vmbr3
iface vmbr3 inet manual
    bridge-ports enp4s0
    bridge-stp off
    bridge-fd 0
```

重启网络：
```bash
/etc/init.d/networking restart
# 或
ifup -a
```

---

## 创建OpenWRT虚拟机

### 1. 下载OpenWrt镜像

```bash
# 下载x86镜像
wget https://downloads.openwrt.org/releases/23.05.3/targets/x86/64/openwrt-23.05.3-x86-64-generic-ext4-combined-efi.img.gz

# 解压
gunzip openwrt-*.img.gz

# 上传到PVE（或者使用SCP）
scp openwrt-*.img root@PVE_IP:/var/lib/vz/template/iso/
```

### 2. 创建虚拟机

**Web界面操作**：

1. **创建CT/VM** -> **创建虚拟机**

2. **一般**:
   ```
   节点: pve
   VM ID: 100 (建议固定，如OpenWrt用100)
   名称: OpenWrt
   启动自启动: 勾选
   ```

3. **操作系统**:
   ```
   使用CD/DVD光盘镜像文件: 不使用任何介质
   ```

4. **系统**:
   ```
   BIOS: OVMF (UEFI) - 推荐
   EFI存储: local-lvm
   ```

5. **磁盘**:
   ```
   删除默认磁盘
   ```

6. **CPU**:
   ```
   插槽: 1
   核心: 2 (或4)
   类别: host (性能更好)
   ```

7. **内存**:
   ```
   内存: 1024 (1GB)
   最小内存: 512
   ```

8. **网络**:
   ```
   桥接: vmbr0 (先创建一个，后面再添加)
   模型: VirtIO (半虚拟化)
   ```

### 3. 导入磁盘镜像

**通过SSH执行**：
```bash
# 进入PVE shell
ssh root@PVE_IP

# 导入磁盘到虚拟机
gzcat /var/lib/vz/template/iso/openwrt-*.img.gz | \
  qemu-img convert -f raw -O qcow2 - \
  /var/lib/vz/images/100/vm-100-disk-1.qcow2

# 或者使用qm命令
qm importdisk 100 /var/lib/vz/template/iso/openwrt-*.img local-lvm

# 注意：100是VM ID，根据实际情况修改
```

### 4. 添加磁盘到虚拟机

**Web界面**：
```
OpenWrt虚拟机 -> 硬件 -> 添加 -> 硬盘
├── 存储: local-lvm
├── 磁盘大小: 导入的大小
└── 总线/设备: SCSI
```

**调整启动顺序**：
```
选项 -> 引导顺序 -> 启用磁盘
```

### 5. 添加多个网卡

**OpenWrt旁路由**：
```
硬件 -> 添加 -> 网络设备
├── 桥接: vmbr0 (LAN)
└── 模型: VirtIO
```

**OpenWrt主路由（多网口）**：
```
硬件 -> 添加 -> 网络设备 (添加多次)
├── net0: vmbr0 (管理/LAN)
├── net1: vmbr1 (WAN)
└── net2: vmbr2 (LAN)
```

---

## 网络拓扑配置

### 方案一：旁路由模式（推荐）

**网络拓扑**：
```
                    ┌─────────────────────┐
                    │      光猫/路由器     │
                    │   192.168.1.1       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │   电脑    │    │   手机    │    │ PVE主机   │
        │          │    │          │    │ 192.168.1.100│
        └──────────┘    └──────────┘    └─────┬─────┘
                                              │
                                        ┌─────┴─────┐
                                        │  OpenWrt  │
                                        │192.168.1.2│
                                        │  旁路由    │
                                        └─────┬─────┘
                                              │
                                    需要翻墙的设备
                                   网关指向192.168.1.2
```

**OpenWrt旁路由配置**：

1. **修改LAN口IP**：
   ```bash
   uci set network.lan.ipaddr='192.168.1.2'
   uci set network.lan.netmask='255.255.255.0'
   uci set network.lan.gateway='192.168.1.1'
   uci set network.lan.dns='223.5.5.5'
   uci commit network
   ```

2. **关闭DHCP**：
   ```bash
   uci set dhcp.lan.ignore='1'
   uci commit dhcp
   /etc/init.d/dnsmasq restart
   ```

3. **关闭IPv6**（可选）：
   ```bash
   uci set dhcp.lan.ra='disabled'
   uci set dhcp.lan.dhcpv6='disabled'
   uci commit dhcp
   ```

4. **设置防火墙**：
   ```bash
   uci set firewall.@zone[0].input='ACCEPT'
   uci commit firewall
   /etc/init.d/firewall restart
   ```

**主路由器配置**：
```
DHCP服务器设置：
├── 网关: 192.168.1.2 (可选，让部分设备走旁路由)
└── DNS: 192.168.1.2 (可选)

或保持默认，需要翻墙的设备手动设置网关
```

### 方案二：主路由模式

**网络拓扑**：
```
┌─────────────────────────────────────────────────────────┐
│                      光猫桥接                            │
│                    192.168.1.1                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PVE虚拟化主机                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              OpenWrt 主路由 VM                     │  │
│  │  ┌─────────┐      ┌─────────┐      ┌─────────┐   │  │
│  │  │  eth0   │      │  eth1   │      │  eth2   │   │  │
│  │  │  WAN    │      │  LAN1   │      │  LAN2   │   │  │
│  │  └────┬────┘      └────┬────┘      └────┬────┘   │  │
│  │       │                │                │         │  │
│  │    vmbr1             vmbr2           vmbr3       │  │
│  └───────┼────────────────┼────────────────┼─────────┘  │
│          │                │                │            │
└──────────┼────────────────┼────────────────┼────────────┘
           │                │                │
           ▼                ▼                ▼
        光猫桥接         交换机/AP        其他设备
```

**配置步骤**：

1. **光猫设置桥接模式**
2. **OpenWrt WAN口拨号**：
   ```bash
   uci set network.wan.proto='pppoe'
   uci set network.wan.username='宽带账号'
   uci set network.wan.password='宽带密码'
   uci commit network
   /etc/init.d/network restart
   ```

### 方案三：单臂路由（One-Arm Router）

**适用场景**：只有单网口的设备

**网络拓扑**：
```
┌────────────────────────────────────────┐
│              主路由器                   │
│           192.168.1.1                  │
│  ┌───────────────────────────────────┐ │
│  │        VLAN 10 (WAN)               │ │
│  │        VLAN 20 (LAN)               │ │
│  └─────────────────┬─────────────────┘ │
└────────────────────┼────────────────────┘
                     │ 单网线
                     ▼
            ┌──────────────────┐
            │    PVE主机        │
            │  ┌──────────────┐ │
            │  │   OpenWrt    │ │
            │  │ 单臂路由模式  │ │
            │  └──────────────┘ │
            └──────────────────┘
```

**配置要点**：
```bash
# OpenWrt中配置VLAN
# 交换机需要支持802.1Q VLAN
```

---

## 性能优化

### CPU优化

```bash
# 设置CPU性能模式
echo performance > /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

### 内存优化

```bash
# ZFS内存限制（如果使用ZFS）
echo "options zfs zfs_arc_max=8589934592" >> /etc/modprobe.d/zfs.conf
# 限制ARC缓存为8GB
```

### 磁盘优化

```bash
# 启用SSD TRIM
systemctl enable fstrim.timer
systemctl start fstrim.timer
```

### 网络优化

```bash
# 开启网卡多队列
ethtool -L eth0 combined 4

# 调整ring buffer
ethtool -G eth0 rx 4096 tx 4096
```

---

## 备份与恢复

### 虚拟机备份

**Web界面**：
```
虚拟机 -> 备份 -> 立即备份
```

**命令行**：
```bash
# 备份VM 100到local存储
vzdump 100 --storage local --compress zstd

# 自动备份脚本
cat > /etc/cron.daily/backup-vms << 'EOF'
#!/bin/bash
vzdump 100 101 102 --storage backup --mode snapshot --compress zstd --quiet 1
EOF
chmod +x /etc/cron.daily/backup-vms
```

### 恢复虚拟机

```bash
# 从备份恢复
qmrestore /var/lib/vz/dump/vzdump-qemu-100-*.vma.zst 100
```

---

## 常见问题

### Q: PVE无法启动虚拟机

```bash
# 检查KVM支持
egrep -c '(vmx|svm)' /proc/cpuinfo

# 检查虚拟化是否开启
dmesg | grep -i kvm
```

### Q: 网络不通

```bash
# 检查网桥配置
cat /etc/network/interfaces

# 检查网桥状态
brctl show

# 重启网络
/etc/init.d/networking restart
```

### Q: 存储空间不足

```bash
# 查看存储使用
pvesm status

# 清理日志
journalctl --vacuum-time=7d
```

---

**最后更新**: 2026年2月
