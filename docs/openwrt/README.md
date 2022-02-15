# Greate Wall

## OpenWrt

### OpenWRT 历史

![The History of OpenWRT](./openwrt.png)

1. 基于 Linux 的开源项目
2. 丰富的插件可以扩展
3. 主流的路由器厂商也都是基于 OpennWRT 开发的路由器固件

### OpenWRT 目录结构及重要文件

1. feeds.conf.default 中制定扩展的软件包, 例如 lean 的版本中没有 Passwall, 可以在这个文件中添加

```
#src-git helloworld https://github.com/fw876/helloworld
src-git lienol https://github.com/kenzok8/openwrt-packages
src-git small https://github.com/kenzok8/small.git
```

然后更新和安装添加的软件包

```bash
./scripts/feeds update -a
./scripts/feeds install -a
```

2. .config 是由 make menuconfig 生成的
3. bin/targets/x86/64 包含了最后生成的固件
   在下载 openwrt 系统时，经常能看到 initramfs-kernel.bin，squashfs-factory.bin，squashfs-sysupgrade.bin 等结尾的文件，factory 适用于从原厂系统刷到 openwrt，sysupgrade 则是从 openwrt 刷到 openwrt（已经是 openwrt 系统，在 openwrt 系统中更新自己），squashfs 则是一种文件系统，适用于嵌入式设备。那么 initramfs-kernel 又是什么呢。initramfs 是放在内存 RAM 中的 rootfs 映像文件，跟 kernel 放在一起。一般来说用不到 initramfs-kernel.bin 来刷机，因为启动后，所有的配置在路由器重启后都不能保留（毕竟 ram 文件系统，所有文件放在 ram 中，断电就没了）。但也有用到 initramfs-kernel.bin 的时候，就是在移植 openwrt 系统的时候，没有设备上的 flash 闪存的驱动的时候。

4. 默认配置

```
package/lean/default-settings/files/zzz-default-settings #默认设置
package/lean/default-settings/files/bin/config_generate  #网络配置？在我的目录下没有
feeds/luci/modules/luci-base/root/etc/config/luci        #修改默认语言和主题
```

5. 保留配置的步骤：
   1. 提取路由固件下的\etc\config\network
   2. 在编译机 OpenWrt 根目录下创建 files 目录
   3. 拷贝到 files/etc/config/network 这样编译完，network 就是你自己配置好的 network，注意提取的文件路径和权限要一致

```
# 运行环境下的一些常见的配置文件路径：
/etc/config         #各个LUCI配置
/etc/gfwlist        #gfwlist目录
/etc/shadow         #登录密码
/etc/firewall.user  #自定义防火墙规则
/usr/share/adbyby   #adbyby里的相关规则和设置
/usr/lib/lua/luci/view/admin_status/index.htm #主页样式文件，温度显示等等
```

### menuconfig 的配置，配置 Newifi D2 和 X64

一个 excel 维护的配置清单[OpenWRT 编译 make menuconfig 配置及 LUCI 插件说明.xlsx](https://www.wil.ink/links/799)

1. 设置目标平台
   ![target](./target-subtarget-targetprofile.png)

2. 指定 image 类型，确认选中 squashfs
   ![image](./target-images.png)

3. 基本配置
   Newifi D2 确认旋转 blockd, X64 不知道要不要选？
   ![blockd](./basesystem-blockd.png)
   ![dnsmasq-full](./basesystem-dnsmasq-full.png)
   ![admin-htop](./admin-htop.png)

4. USB 和无线网络驱动
   ![USB](./usbsupport-kmodusb2.png)
   在 Newifi D2 下添加无线网卡  
   ![Wireless](./wirelessdrivers-kmodmt7603-mt76x2.png)
   **kmod-mt7603 与 kmod-mt7603e 冲突
   kmod-mt76x2 与 kmod-mt76x2e 冲突**
5. 常用 Luci 模块，根据需要选择

```
luci-app-accesscontrol 上网时间控制
luci-app-adbyby-plus 广告屏蔽大师Plus +
luci-app-amule         电驴下载
luci-app-aria2         Aria2下载
luci-app-arpbind IP/MAC绑定
luci-app-ddns         动态域名解析
luci-app-flowoffload Turbo ACC  FLOW转发加速
luci-app-frpc         内网穿透 Frp
luci-app-hd-idle 硬盘休眠
luci-app-ipsec-vpnd  IPSec服务端
luci-app-mwan3         MWAN负载均衡
luci-app-nlbwmon 网络带宽监视器
luci-app-openvpn OpenVPN客户端
uci-app-openvpn-server OpenVPN服务端
luci-app-pptp-server  PPTP服务端
luci-app-ramfree 释放内存
luci-app-samba         网络共享(samba)
luci-app-sfe         Turbo ACC网络加速(开启Fast Path转发加速)
luci-app-sqm         流量智能队列管理(QOS)
luci-app-ssr-plus SSR Plus，翻墙3合一工具
luci-app-transmission BT下载
luci-app-upnp         通用即插即用UPnP(端口自动转发)
luci-app-usb-printer USB 打印服务器
luci-app-vlmcsd         KMS服务器（WIN VLK 激活工具）
luci-app-vsftpd         FTP服务器
luci-app-webadmin Web管理
luci-app-wireguard VPN服务器 WireGuard状态
luci-app-wol         网络唤醒
luci-app-wrtbwmon 实时流量监测
```

6. 其他
   ![ddns](./ipaddress-and-names-ddns-scripts-no-ip.png)
   ![download](./bittorrent-transmissionweb.png)

   transmission-web 与 transmission-web-control 冲突

### OpenWRT 在本地 Linux 下编译

#### 编译 Lienol 源

#### 编译 Lean 源

1. 更新操作系统和编译器依赖

```bash
sudo apt-get update
sudo apt-get -y install build-essential asciidoc binutils bzip2 gawk gettext git libncurses5-dev libz-dev patch python3 python2.7 unzip zlib1g-dev lib32gcc1 libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev autoconf automake libtool autopoint device-tree-compiler g++-multilib antlr3 gperf wget curl swig rsync
```

2. 下载源代码
   git clone https://github.com/coolsnowwolf/lede.git lean

3. 添加富强模块
   编辑 feeds.conf.default

```
#src-git helloworld https://github.com/fw876/helloworld
src-git lienol https://github.com/kenzok8/openwrt-packages
src-git small https://github.com/kenzok8/small.git
```

4. 更新添加的模块

```
./scripts/feeds update -a
./scripts/feeds install -a
make defconfig            #测试编译环境
make menuconfig           #配置编译
```

5. 编译

```
make -j8 download V=s     #预下载
find dl -size -1024c -exec ls -l {} \;  #检查文件完整性
make -j1 V=s
```

#### 再次编译

```
make clean             #清除旧的编译产物（可选）
#在源码有大规模更新或者内核更新后执行，以保证编译质量。此操作会删除/bin和/build_dir目录中的文件。

make dirclean             #清除旧的编译产物、交叉编译工具及工具链等目录（可选）
#更换架构编译前必须执行。此操作会删除/bin和/build_dir目录的中的文件(make clean)以及/staging_dir、/toolchain、/tmp和/logs中的文件。

make distclean            #清除 Open­Wrt 源码以外的文件（可选）
#除非是做开发，并打算 push 到 GitHub 这样的远程仓库，否则几乎用不到。此操作相当于make dirclean外加删除/dl、/feeds目录和.config文件。

git clean -xdf            #还原 Open­Wrt 源码到初始状态（可选）
#如果把源码改坏了，或者长时间没有进行编译时使用。

rm -rf tmp                #清除编译缓存
#此操作据说可防止make menuconfig加载错误，暂时没遇到过，如有错误欢迎大佬指正。

rm -f .config             #删除配置文件（可选）
#可以理解为恢复默认配置，建议切换架构编译前执行。
```

#### 使用 Github Action 编译 OpenWRT

可以从本地的编译环境提取.config 配置文件，放在[build-openwrt](git@github.com:quboqin/build-openwrt.git)
或者需要 SSH 连接则把 SSH connection to Actions 的值改为 true
点击 Actions

##### R4S
quboqin/NanoPi-R4S
forked from DHDAXCW/NanoPi-R4S
[NanoPi-R4S-2021 每天自动更新插件和内核版本](git@github.com:quboqin/NanoPi-R4S.git)

##### X86
quboqin/FusionWRT_x86_x64
forked from DHDAXCW/FusionWRT_x86_x64
[x86-x64 每天自动更新插件和内核版本](git@github.com:quboqin/FusionWRT_x86_x64.git)

##### 创建多个 workflow，同时编译两个平台

### 刷入固件的方法

1. DiskImage 直接刷写
   制作一个 PE 盘，把 DiskImage 和 LEDE 固件拷贝到 PE 盘，插到路由上，启动 PE，然后和方法一差不多，打开 DiskImage，选择软路由上的那块硬盘，选择 OpenWrt.img，点开始，等进度条结束，然后关机，拔掉 U 盘，再开机就可以了
2. 用 physdiskwrite 刷写
   刷写方法：制作一个 PE 盘，把 physdiskwrite 和 LEDE 固件拷贝到 PE 盘（同一个目录下，建议放在根目录，就是打开 U 盘就能看到的那个目录），插到路由上，启动 PE，然后查看下存放固件的盘符（这里举例为 U:盘），打开 cmd（不懂的就按 Win 建+r 键，输入 cmd 回车，Win 键就是键盘左下方是 Windows 图标的那个按键）
   　　输入 U: （回车确定，切换到 U 盘的目录）
   　　输入 physdiskwrite -u OpenWrt.img（回车确定）
   　　然后会显示目前检测到的硬盘，输入 0 或者 1 选择要刷写到哪个盘（看容量，选择硬盘的那个编号），按 Y 确定，之后等待刷写结束就可以了，然后关机，拔掉 U 盘，再开机就可以了.
3. 修改 ip 地址

```
vi /etc/config/network
```

### 刷机新路由 D2

1. 重置 Breed
   按住 Reset 不放，将电源再次连接，等待 10s 后，松开 Reset，路由器进入 Breed 模式
   在浏览器中访问 192.168.1.1

2. 刷入 Openwrt 固件

### 配置 OpenWRT

#### 作为主路由的设置

##### Newifi D2 作为主路由, AX3600 有线中继

1. Newifi D2 作为主路由 设置
   1. 状态
      ![newifi-status](./newifi-status.png)
   2. 修改密码，开启 SSH
      ![newifi-ssh](./newifi-ssh.png)
   3. LAN 接口设置，开启 DHCP
      ![newifi-dhcp](./newifi-dhcp.png)
   4. WAN 拨号设置
      ![newifi-wan](./newifi-wan.png)
   5. DNS 设置，开启 Turbo ACC 网络加速
      ![newifi-dns-1](./newifi-dns-1.png)
      ![newifi-dns-2](./newifi-dns-2.png)
   6. 端口转发
      ![newifi-port](./newifi-port.png)

#### 作为旁路由的设置

0. 主路由设置

   1. 基本信息
      ![ax3600-brief](./ax3600-brief.png)
   2. 连接设备
      ![ax3600-mesh](./ax3600-mesh.png)
   3. 宽带拨号和工作模式
      ![ax3600-dialup](./ax3600-dialup.png)
   4. 局域网设置和 DHCP 服务
      ![ax3600-dhcp](./ax3600-dhcp.png)
   5. DDNS 设置
      ![ax3600-ddns-1](./ax3600-ddns-1.png)
      ![ax3600-ddns-2](./ax3600-ddns-2.png)

   6. 端口映射
      ![ax3600-port](./ax3600-port.png)

1. 单臂路由，配置 LAN 口
   1. 不要删除 wan/wan6 接口
   2. 协议设置为“静态地址”，设置静态地址，子网掩码，网关和广播地址
   3. 设置自定义的 DNS 服务器, 指向主路由

```
192.168.123.2
```

![接口设置](./general-setting.png)

4.  关闭桥接，需要重新选择接口
    ![关闭桥接](./close-bridge.png)
    **以上操作不要按’保存及应用‘，只要保存**

5.  配置防火墙, 添加“自定义规则”

```
# This file is interpreted as shell script.
# Put your custom iptables rules here, they will
# be executed with each firewall (re-)start.

# Internal uci firewall chains are flushed and recreated on reload, so
# put custom rules into the root chains e.g. INPUT or FORWARD or into the
# special user chains, e.g. input_wan_rule or postrouting_lan_rule.
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -I POSTROUTING -j MASQUERADE
```

重启防火墙，并’保存及应用‘

6.  设置 DHCP 服务器，单臂路由强制使用此网络上的 DHCP，关闭主路由 DHCP
    AX3600 作为主路由，新的固件版本可以设置 DHCP 的 DNS 和 Gateway，主路由可以作为 DHCP 服务器，网关和 DNS 设置为旁路由，旁路有的网关指向主路由

#### 开启 Turbo ACC 网络加速

1. 开启 DNS 加速(可选)
   会改变 DHCP/DNS 设置中的“DNS 转发”

2. 检查 DHCP/DNS 设置

详见[Lean OpenWrt DNS 解析流程研究](https://renyili.org/post/openwrt_dns_process/)
![DNS](./dns.png)

#### 启动 UPnP

#### 设置 Passwall

1. 设置 DNS
   有 ChinaDNS-NG，可以开启 ChinaDNS-NG，但是这样就不需要 Turbo ACC 网络加速中的 DNS 加速了
   配置 ChinaDNS-NG 的解析本地和白名单的(UDP) 116.228.111.118

2. 配置 pdnsd

3. 将 NAS 的 IP 地址添加到 Passwall 的发访控制中
   ![NAS访问控制](./access-control.png)

#### NAS 的设置

1. 端口转发，将 NAS 的 SSH, WEB 端口(5000)和 SMB 端口(137/138/139/445)，转发到 NAS 服务器
   ![ax3600-port](./ax3600-port-forward.png)
   ![nas-port](./nas-port-forward.png)

2. 设置 NAS 的 DNS
   ![NAS DNS](./nas-dns.png)

3. 设置 NAS 的网卡
   ![NAS Interface](./nas-interface.png)

4. 添加主路由到 NAS Allow List
   ![allow-list](./nas-allow-list.png)

#### 排除 DNS 问题

1. clean DNS
   @Macos
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   @Windows10
   ipconfig /flushdns

2. 安装 dig

```shell
opkg update && opkg install bind-dig bind-libs
```

3. 查看端口

```shell
netstat -tunlp
lsof -i:53
```

4. 使用 dig

```
dig www.google.com
dig @8.8.8.8 www.google.com
dig @127.0.0.1 -p 53 www.google.com
dig www.google.com +trace
```

5. 使用 nslookup

## 安装 VPS

### 在 namecheap 上申请域名

### 注册 cloudflare 账号，并将 namecheap 的域名托管给 cloudflare

### 创建 VPS

0. 创建 VPS，cloudflare 上二级指向该 VPS 的 IP 地址

1. 安装 7 合 1 脚本
   [快速部署 Xray V2ray SS Trojan Trojan-go 七合一共存一键脚本+伪装博客](https://wxf2088.xyz/2321.html)
   要填写域名，申请证书

1. BBR 加速脚本集合。包含 BBR Plus/BBR 原版/BBR 魔改版，开启自带 BBR 加速，BBR 四合一脚本等。
   [BBR 加速脚本集合](https://www.v2rayssr.com/bbr.html)

1. 高级模式
   1. 选择 IP
   2. 在 cloudflare 上配置 worker

### 客户端安装和配置

1. windows 环境下安装 Winxray，关闭 Mcafee 报警
2. Macos 下安装 Clash for Windows
3. iOS 下用美国账号安装 Shadowrocket
4. Android 下的客户端

### DDNS 的申请和配置, 花生壳和 Windows 远程服务
