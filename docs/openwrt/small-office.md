# build a flexible network for a small business
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