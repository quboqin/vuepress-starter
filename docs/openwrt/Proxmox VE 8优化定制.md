好的，针对 Proxmox VE 8.4 版本，这里为您整理了一份最新的、经过验证的安装后优化操作指南，涵盖了您提到的更换软件源、开启硬件直通、UI定制化以及更新内核等常见操作。

**重要提示**：在执行任何系统修改操作前，请务y必备份您的重要数据和相关配置文件。所有命令默认以`root`用户权限在PVE节点的Shell中执行。

---

### 1. 更换软件源 (换成无订阅版源/国内镜像源)

PVE默认使用需要付费订阅的企业版软件源，这会导致更新时出现错误提示。更换为无订阅源或速度更快的国内镜像源是安装后的首要步骤。

**1.1 备份原始源文件**

```bash
cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

**1.2 修改Debian基础源**

PVE 8.x基于Debian 12 "Bookworm"。建议使用国内镜像源以提高速度。

编辑 `/etc/apt/sources.list` 文件：
```bash
nano /etc/apt/sources.list
```

将其中的内容**全部删除**或**用`#`号注释掉**，然后替换为以下内容（以清华大学TUNA源为例）：
```text
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
deb https://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
```
按 `Ctrl+X`，然后按 `Y` 保存并退出。

**1.3 修改PVE源**

PVE 8版本将企业源单独放在了 `/etc/apt/sources.list.d/pve-enterprise.list` 文件中。

首先，**注释掉企业源**：
```bash
# 备份
cp /etc/apt/sources.list.d/pve-enterprise.list /etc/apt/sources.list.d/pve-enterprise.list.bak

# 注释
sed -i 's/^deb/#deb/g' /etc/apt/sources.list.d/pve-enterprise.list
```

然后，**添加无订阅版源**（同样可以使用国内镜像）：
```bash
# 创建新的源文件
nano /etc/apt/sources.list.d/pve-no-subscription.list
```
在文件中添加以下行：
```text
deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription
```
保存并退出。

**1.4 (可选) 修改Ceph源**
如果您计划使用Ceph存储，也建议更换其源。
```bash
# 创建新的Ceph源文件
nano /etc/apt/sources.list.d/ceph.list
```
添加以下行：
```text
deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/ceph-reef bookworm no-subscription
```
保存并退出。

**1.5 执行更新**
完成以上步骤后，刷新软件列表并更新系统：
```bash
apt update && apt dist-upgrade -y
```

---

### 2. 开启硬件直通 (IOMMU Passthrough)

硬件直通允许虚拟机直接访问物理硬件（如GPU、网卡、HBA卡等），对NAS、软路由、AI计算等场景至关重要。

**2.1 检查硬件支持**
* **Intel CPU**: `dmesg | grep -e DMAR -e IOMMU`
* **AMD CPU**: `dmesg | grep -e IOMMU`

执行命令后，请仔细检查输出。
*   **对于Intel CPU (VT-d):** 如果您看到包含 `DMAR: IOMMU enabled` 的行，或者有多行以 `DMAR` 开头（表示检测到了DMA重映射硬件单元），并且没有明显的错误信息（如 `DMAR: No DMAR devices found`），这通常表明VT-d已在BIOS/UEFI中正确开启。
*   **对于AMD CPU (AMD-Vi):** 如果您看到包含 `AMD-Vi: IOMMUv2 loaded`、`AMD-Vi: Enabled.` 或类似 `IOMMU enabled` 的信息，并且有 `AMD-Vi` 或 `IVRS` (I/O Virtualization Reporting Structure) 相关的条目，这通常表明AMD-Vi已在BIOS/UEFI中正确开启。

如果输出为空，或者只包含错误信息（例如 `DMAR: No DMAR devices found` 或 `AMD-Vi: Disabled`），则说明VT-d或AMD-Vi很可能未在BIOS/UEFI中开启，或者未被操作系统正确识别。这种情况下，请先进入BIOS/UEFI设置检查并确保相关虚拟化技术（如 Intel VT-d, AMD-Vi, IOMMU）已启用。

I got the result below
```
[    0.011894] ACPI: DMAR 0x000000007310C000 000088 (v02 INTEL  EDK2     00000002      01000013)
[    0.011931] ACPI: Reserving DMAR table memory at [mem 0x7310c000-0x7310c087]
[    0.090216] DMAR: Host address width 39
[    0.090217] DMAR: DRHD base: 0x000000fed90000 flags: 0x0
[    0.090225] DMAR: dmar0: reg_base_addr fed90000 ver 4:0 cap 1c0000c40660462 ecap 29a00f0505e
[    0.090228] DMAR: DRHD base: 0x000000fed91000 flags: 0x1
[    0.090232] DMAR: dmar1: reg_base_addr fed91000 ver 5:0 cap d2008c40660462 ecap f050da
[    0.090233] DMAR: RMRR base: 0x0000007c000000 end: 0x000000803fffff
[    0.090236] DMAR-IR: IOAPIC id 2 under DRHD base  0xfed91000 IOMMU 1
[    0.090237] DMAR-IR: HPET id 0 under DRHD base 0xfed91000
[    0.090238] DMAR-IR: Queued invalidation will be enabled to support x2apic and Intr-remapping.
[    0.091882] DMAR-IR: Enabled IRQ remapping in x2apic mode
[    0.331190] pci 0000:00:02.0: DMAR: Skip IOMMU disabling for graphics
[    0.424038] DMAR: No ATSR found
[    0.424039] DMAR: No SATC found
[    0.424040] DMAR: IOMMU feature fl1gp_support inconsistent
[    0.424041] DMAR: IOMMU feature pgsel_inv inconsistent
[    0.424042] DMAR: IOMMU feature nwfs inconsistent
[    0.424042] DMAR: IOMMU feature dit inconsistent
[    0.424043] DMAR: IOMMU feature sc_support inconsistent
[    0.424044] DMAR: IOMMU feature dev_iotlb_support inconsistent
[    0.424045] DMAR: dmar0: Using Queued invalidation
[    0.424048] DMAR: dmar1: Using Queued invalidation
[    0.425974] DMAR: Intel(R) Virtualization Technology for Directed I/O
```

**解读以上示例输出：**
是的，根据上述 `dmesg` 输出，可以判断主板BIOS/UEFI中已正确开启VT-d。关键信息包括：
*   存在 `ACPI: DMAR` 表。
*   检测到多个 `DMAR: DRHD base` (DMA Remapping Hardware Definition) 条目，表明IOMMU硬件单元被识别。
*   `DMAR-IR: Enabled IRQ remapping` 表示中断重映射已启用。
*   最明确的一行是 `DMAR: Intel(R) Virtualization Technology for Directed I/O`，这直接确认了内核已识别并初始化VT-d。
尽管有一些关于 `IOMMU feature ... inconsistent` 的消息，这些通常是关于特定高级功能的不一致性，一般不影响基础的IOMMU直通功能。

**2.2 修改GRUB引导参数**
这是启用IOMMU的核心步骤。

编辑GRUB配置文件：
```bash
nano /etc/default/grub
```

找到 `GRUB_CMDLINE_LINUX_DEFAULT="quiet"` 这一行，根据您的CPU类型进行修改：
* **Intel CPU**:
    ```text
    GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
    ```
* **AMD CPU**:
    ```text
    GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
    ```
    * `iommu=pt` (Passthrough Mode) 能提高性能，并避免一些直通问题，推荐添加。

修改后，更新GRUB并使之生效：
```bash
update-grub
```

**2.3 加载VFIO内核模块**
编辑 `/etc/modules` 文件，让系统在启动时加载必要的VFIO模块：
```bash
nano /etc/modules
```
在文件末尾添加以下几行：
```text
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd
```

**2.4 (可选但推荐) 屏蔽驱动**
为了让硬件能被虚拟机独占，需要阻止PVE宿主机使用它。

首先，找到你想要直通的硬件的ID。以GPU为例：
```bash
lspci -nn | grep -i nvidia
# 或 lspci -nn | grep -i amd
# 或 lspci -nn | grep -i "ethernet controller"
```
假设输出为 `01:00.0 VGA compatible controller [0300]: NVIDIA Corporation GP107 [GeForce GTX 1050 Ti] [10de:1c82]`，其中 `10de:1c82` 就是设备ID。如果设备有音频部分（如HDMI Audio），也要记下其ID。

创建一个新的modprobe配置文件：
```bash
nano /etc/modprobe.d/vfio-blacklist.conf
```
添加以下内容，将 `xxxx:yyyy` 替换为你自己的设备ID，多个ID用逗号隔开：
```text
# 直通NVIDIA显卡
options vfio-pci ids=10de:1c82,10de:0fb9
# 同时可以屏蔽开源/官方驱动
blacklist nouveau
blacklist nvidia
blacklist radeon
blacklist amdgpu
```

更新内核模块配置：
```bash
update-initramfs -u -k all
```

**2.5 重启并验证**
完成以上所有步骤后，**必须重启PVE服务器**。
```bash
reboot
```
重启后，通过以下命令验证IOMMU是否正常工作。执行脚本后，如果看到设备被清晰地分在不同的IOMMU Group中，则表示成功。
```bash
find /sys/kernel/iommu_groups/ -type l
```
或者使用这个更详细的脚本：
```bash
for d in /sys/kernel/iommu_groups/*/devices/*; do n=${d#*/iommu_groups/*}; n=${n%%/*}; printf 'IOMMU Group %s ' "$n"; lspci -nns "${d##*/}"; done
```

---

### 3. 定制化显示与系统调整
[Proxmox VE Helper-Scripts (Community Edition)](https://github.com/community-scripts/ProxmoxVE)

[How to monitor CPU Temps and FAN Speeds in Proxmox Virtual Environment](https://help.rackzar.com/knowledgebase/article/how-to-monitor-cpu-temps-and-fan-speeds-in-proxmox-virtual-environment)

**3.1 移除“无有效订阅”弹窗**
这个弹窗仅为提示，不影响功能。以下命令可以安全移除它（适用于PVE 8.x）。
```bash
# 适用于 PVE 8.2 ~ 8.4+ 的版本
sed -i "s/if (res === null || res === undefined || \!res || res\n\t.data.status.toLowerCase() \!== 'active') \{/if (false) \{/g" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js && systemctl restart pveproxy.service
```
如果未来版本更新导致此命令失效，可以搜索“PVE 8 remove subscription nag”查找最新的方法。

**3.2 (可选) 安装暗黑主题**
社区提供了PVE的暗黑主题，可以改善视觉体验。
```bash
# 从GitHub下载主题脚本并执行
bash <(curl -s https://raw.githubusercontent.com/Weilbyte/PVEDiscordDark/master/PVEDiscordDark.sh) install
```
执行后按照提示操作即可。

**3.3 显示CPU/主板温度**
PVE默认不显示硬件温度。你需要安装并配置 `lm-sensors`。
```bash
# 1. 安装
apt install lm-sensors -y

# 2. 探测传感器 (过程中基本都可以直接按回车默认)
sensors-detect

# 3. 查看温度
sensors
```
配置完成后，你可以通过SSH登录PVE后台，使用 `sensors` 命令随时查看硬件温度。

---

### 4. 更新内核

在第1步更换完软件源之后，更新内核就变得非常简单。

**4.1 执行更新命令**
```bash
apt update
apt dist-upgrade -y
```
这个命令会自动获取并安装当前`pve-no-subscription`源中最新的内核版本和系统组件。

**4.2 重启服务器**
**内核更新后，必须重启PVE服务器才能应用新的内核。**
```bash
reboot
```

**4.3 验证内核版本**
重启后，可以通过以下命令查看当前运行的内核版本，确认是否更新成功。
```bash
uname -r
```

完成以上所有步骤后，您的PVE 8.4服务器就已经完成了基础的优化配置，可以开始创建和管理虚拟机了。
