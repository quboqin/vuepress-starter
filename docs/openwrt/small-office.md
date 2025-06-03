# build a flexible network for a small business
## soft route
### openwrt
#### history
- 2002年：OpenWRT的起源
*事件：LinkSys WRT 54G 发布*
    * 描述：OpenWRT项目的历史可以追溯到2002年发布的LinkSys WRT 54G路由器。
    * 影响：这款标志性的路由器为OpenWRT的诞生和发展奠定了基础。

- 早期OpenWRT的衍生版本 (2016年前)
*DDWRT (商业版本)*
    * 描述：这是OpenWRT的一个早期衍生固件，通常被视为一个商业化版本。
*PandoraBox*
    * 描述：PandoraBox是OpenWRT的另一个衍生项目。
    * 维护者：由OpenWRT社区的创始人之一LinTel负责维护。
    * **状态（约2017年或2018年）：PandoraBox的开发工作已停止。**

- 2016年：LEDE的分裂
*事件：LEDE (Linux Embedded Development Environment) 项目独立*
    * 描述：由于社区发展等原因，OpenWRT项目在2016年发生分裂，其中一个主要分支独立为LEDE（Linux嵌入式开发环境）项目。

- 2018年：OpenWRT的统一与现代发展
*事件：LEDE项目与原OpenWRT项目重新合并*
    * 描述：到了2018年，LEDE项目与原OpenWRT项目决定重新合并，并统一继续使用OpenWRT的名称。
    * 影响：这次合并标志着现代OpenWRT的形成，并继承了LEDE的许多改进。

- 现代OpenWRT (2018年后) 的主要衍生版本**
    *KoolShare (软件中心)*
        * 描述：作为新OpenWRT的一个流行分支，KoolShare版本以其集成了便捷的“软件中心”功能而闻名，方便用户安装和管理各种插件。
    *LEAN LEDE*
        * 描述：这是新OpenWRT的另一个非常知名的分支，由Lean维护。
        * 主要特点：
            * 相对更接近OpenWRT原生状态，没有进行过多的深度定制。
            * 系统较为稳定。
            * 通常会集成丰富的实用系统插件。
            * 能够满足大多数用户的日常使用需求。
    *Lienol*
        * 描述：Lienol是新OpenWRT的又一个分支版本。
        * 主要区别与特点：Lienol编译的固件与其他版本的一个显著区别在于其包含的插件组合。例如，文中提到Lienol版本会包含 "passwall" 插件和 "ssr-plus" 插件，这反映了其在特定功能插件集成上的侧重。
![alt text](openwrt-history.drawio.png)     

#### version
OpenWrt 演进过程中主要版本及其差异可以梳理如下：

|    | 版本名称                 | 发布时间      | 主要特点与技术变化                                                                                                                               |
|----|--------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| 0  | White Russian            | 2007年        | OpenWrt 早期版本，开始采用模块化构建，基于 Linux 2.4 内核，奠定项目基础。                                                                                      |
| 1  | Kamikaze                 | 2007-2008年   | 版本号约为 7.06 到 8.90，改进了构建系统和包管理，支持更多设备。                                                                                              |
| 2  | Backfire                 | 2010-2011年   | 版本号约 10.03，内核升级，增强硬件支持和网络功能。                                                                                                       |
| 3  | Attitude Adjustment (AA) | 2013年        | 版本号 12.09，内核升级到 3.x，提升系统稳定性和性能。                                                                                                     |
| 4  | Barrier Breaker (BB)     | 2014年        | 版本号 14.07，改进无线驱动支持，增强安全特性。                                                                                                         |
| 5  | Chaos Calmer (CC)        | 2015-2016年   | 版本号 15.05，成为 MTK、高通等硬件厂商 SDK 的基础，广泛应用于商业产品。                                                                                             |
| 6  | LEDE 17.01               | 2017-2018年   | OpenWrt 分裂出的分支，注重代码质量和社区协作，后与 OpenWrt 合并。                                                                                               |
| 7  | OpenWrt 18.06            | 2018-2020年   | 版本号 18.06.x，合并 LEDE 代码，内核升级到 4.9/4.14，改进系统稳定性和硬件支持。                                                                                         |
| 8  | OpenWrt 19.07            | 2020年        | 版本号 19.07.x，增加 WPA3 支持，支持流量卸载（Flow Offloading）等新特性。                                                                                             |
| 9  | OpenWrt 21.02            | 2021年        | 版本号 21.02.x，内核升级到 5.4，默认支持 WPA3、TLS 和 HTTPS，首次引入 Distributed Switch Architecture (DSA)，支持容器技术（LXC、ujail）。                                          |
| 10 | OpenWrt 22.03            | 2022年        | 版本号 22.03.x，基于 nftables 的 Firewall4，更多设备支持，LuCI 界面新增暗黑模式，解决 2038 年问题。                                                                               |
| 11 | OpenWrt 24.10            | 2025年        | 最新稳定版，内核升级至 6.6，支持 Wi-Fi 6 和初步 Wi-Fi 7，默认启用 TLS 1.3，支持 Multipath TCP，激活 POSIX 访问控制列表。                                                                 |


|   | 固件/分支     | 上游版本跟进 | 内核版本 | 软件源类型   | 插件生态 | 在线定制 | 付费情况   | 适合用户         |
|---|---------------|--------------|----------|--------------|----------|----------|------------|------------------|
| 0 | ImmortalWRT   | 快速         | 6.6      | 自建         | 丰富     | 支持     | 免费       | 动手能力强、定制化 |
| 1 | Lean（QWRT+） | 快速         | 6.6      | 官方/自建    | 丰富     | 不支持   | 闭源需付费 | 高性能、插件党     |
| 2 | Lienol        | 快速         | 6.6      | 官方         | 一般     | 不支持   | 免费       | 轻量、稳定       |
| 3 | iStoreOS      | 慢           | 5.15     | 自建         | 丰富     | 不支持   | 部分闭源   | 新手、NAS需求    |
| 4 | KWRT          | 一般         | 5.15     | 自建         | 丰富     | 支持     | 部分付费   | 喜欢自定义       |
### build and deploy
#### openwrt源代码的解释
#### image格式的解释
|后缀|解释|
|----|----|
|.img.gz|`.img`表示这是一个包含完整OpenWRT系统的镜像文件；`.gz`表示这是一个压缩文件，需解压后使用或被刷机工具识别（部分工具如Rufus可直接处理.gz压缩文件）|
|ext4|一种常见的文件系统格式。使用该格式的固件，对配置文件的修改会直接写入文件系统，不提供通过抹除Overlay分区来恢复出厂设置的机制|
|squashfs|一种文件系统格式。该格式的固件会将修改的配置文件写入挂载的overlay分区，允许用户通过抹除overlay分区来恢复出厂设置|
|combined|表示固件中包含了内核（kernel）和根文件系统（root file system）的组合，整个操作系统都在这一个文件中|
|efi（或ufi）|表示固件支持EFI（统一可扩展固件接口）引导类型，近些年的主板通常都支持EFI引导|
|legacy|表示固件支持传统的Legacy引导类型，若主板不支持EFI引导或不确定支持哪种引导，可选择刷入这种固件|
#### build an image from the offical website
#### build with github action
#### build on wsl
### essential network concepts
#### firewall
#### DNS
#### ip fake
#### config route
##### Settings of the bypass router
###### openclash
###### port mapping
## installation of PVE
### network diagram
### install PVE
### install openwrt vm
## airport
### buy
### setup server on cloud
## VPN
### tailscale
## application
### smb
### alist
### infuse
### torrent download

## build and config an openwrt image
### build the image from openwrt offical website
[download the offical image](https://firmware-selector.immortalwrt.org/) 

** 好像一天里不能Build多次 **
![alt text](<failed to fetch.png>)
清空浏览器缓存和更换节点IP后又可以

添加软件包要检查对应版本的列表中是否包含
[luci package](https://mirror.nju.edu.cn/immortalwrt/releases/24.10.1/packages/aarch64_generic/luci/)

这是我添加的基本的软件包
```
luci-app-argon-config luci-i18n-argon-config-zh-cn luci-i18n-ttyd-zh-cn luci-i18n-passwall-zh-cn luci-app-openclash luci-i18n-homeproxy-zh-cn openssh-sftp-server luci-i18n-ddns-zh-cn luci-i18n-diskman-zh-cn luci-i18n-autoreboot-zh-cn luci-i18n-upnp-zh-cn luci-i18n-package-manager-zh-cn luci-i18n-firewall-zh-cn luci-i18n-samba4-zh-cn bind-dig
```
首次启动时运行的脚本（uci-defaults）
``` bash
# Beware! This script will be in /rom/etc/uci-defaults/ as part of the image.
# Uncomment lines to apply:
#
# wlan_name="ImmortalWrt"
# wlan_password="12345678"
#
root_password="abcd1234"
lan_ip_address="192.168.123.99"
#
# pppoe_username=""
# pppoe_password=""

# log potential errors
exec >/tmp/setup.log 2>&1

if [ -n "$root_password" ]; then
    (echo "$root_password"; sleep 1; echo "$root_password") | passwd > /dev/null
fi

# 我这里修改了LAN的配置, 启动后可以连上, 并可以访问外网
# Configure LAN
# More options: https://openwrt.org/docs/guide-user/base-system/basic-networking
if [ -n "$lan_ip_address" ]; then
    uci set dhcp.lan.ignore='1'
    uci set network.lan.ipaddr="$lan_ip_address"
    uci set network.lan.gateway='192.168.123.8'
    uci set network.lan.dns='192.168.123.8'
    uci commit network
  fi

# Configure WLAN
# More options: https://openwrt.org/docs/guide-user/network/wifi/basic#wi-fi_interfaces
if [ -n "$wlan_name" -a -n "$wlan_password" -a ${#wlan_password} -ge 8 ]; then
    uci set wireless.@wifi-device[0].disabled='0'
    uci set wireless.@wifi-iface[0].disabled='0'
    uci set wireless.@wifi-iface[0].encryption='psk2'
    uci set wireless.@wifi-iface[0].ssid="$wlan_name"
    uci set wireless.@wifi-iface[0].key="$wlan_password"
    uci commit wireless
fi

# Configure PPPoE
# More options: https://openwrt.org/docs/guide-user/network/wan/wan_interface_protocols#protocol_pppoe_ppp_over_ethernet
if [ -n "$pppoe_username" -a "$pppoe_password" ]; then
    uci set network.wan.proto=pppoe
    uci set network.wan.username="$pppoe_username"
    uci set network.wan.password="$pppoe_password"
    uci commit network
fi

echo "All done!"
```

生成的IMAGE有两种格式
- EXT4 不可以恢复出厂设置
- Sysupgrade 支持Overlay分区, 可以恢复出厂设置

### image的扩容
参考[openwrt基础配置 | openwrt固件选择、扩容、docker安装扩容、网络共享samba4安装配置](https://www.qichiyu.com/183.html)

1.确认是否具备所需依赖, 并上传镜像文件
```
which gzip
which dd
which parted
```

2. 按顺序执行以下命令
``` Bash
# 切换到根目录
cd /
# 解压缩镜像文件
gzip -kd immortalwrt.img.gz
# 解压成功后删除压缩包，方便后面选择文件
# 扩展镜像文件的大小 (count=500 表示增加 500MB 的空间)
dd if=/dev/zero bs=1M count=500 >> immortalwrt.img
# 使用分区工具操作镜像
parted immortalwrt.img
# 查看分区情况
print
# 调整分区大小 (将第 2 个分区扩展至镜像文件的 100%)
resizepart 2 100%
# 查看是否扩展成功
print
# 退出分区工具
quit
```

3. 烧录image到SD卡上
![alt text](balena.png)

## 磁盘要在安装Docker前配置好
安装 `luci-app-diskman`
创建分区并挂载 /opt/docker 下

## 安装和配置Docker
build的时候选会失败, 可能时image的size太小, 所以之前要扩容
![alt text](<install docker.png>)

安装这个package `luci-i18n-dockerman-zh-cn`
docker run hello-world


## 安装Tailscale
在package中就可以安装
1. 设置开机启动，验证开机启动
```
/etc/init.d/tailscale enable
ls /etc/rc.d/S*tailscale*
```
2. 启动tailscale
```
/etc/init.d/tailscale start
```
3. 获取登录链接并配置路由
```
tailscale up
```

## install dig
```
opkg update
opkg install bind-dig
```

## 设置samba4
[安装samba](https://doc.embedfire.com/openwrt/user_manal/zh/latest/User_Manual/openwrt/samba.html)
1. 安装shadow-useradd
```
opkg update
opkg install shadow-useradd
```

2. 添加用户
```
useradd quboqin
```

3. 设置该用户的samba password
```
smbpasswd -a quboqin
```

4. 修改分享的目录owner
```
chown -R quboqin:quboqin /mnt/nas
```
![alt text](nas.png)

## build on Github Action
https://github.com/quboqin/AutoBuildImmortalWrt
