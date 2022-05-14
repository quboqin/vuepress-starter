# 科学上网
## 解决的问题
1. 科学上网
2. 1000M高速访问互联网
3. 1000M高速内网互联
4. 搭建私有云盘，建立家庭多媒体和文件中心，并和公有云同步
5. 外网穿透，访问内网私有云，远程访问内网设备和PC/MAC/Linux终端
## 网络拓扑
### 外网
![openwrt-外网.drawio](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesopenwrt-%E5%A4%96%E7%BD%91.drawio.png)
### 内网
![openwrt-内网.drawio](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesopenwrt-%E5%86%85%E7%BD%91.drawio.png)
## 路由器固件
### 安装
#### Newifi 3(新路由3)
##### 固件下载
###### 资源的地址
[恩山论坛 - 【2022.5.3 更新】新路由3/小娱 Lean源码 支持一键更新固件(https://www.right.com.cn/forum/thread-4047888-1-1.html)
###### 固件基本信息
- 管理地址: 192.168.1.1
- 账号密码: root / password
- SSR Plus
- 阿里云盘 Webdav
- Aria2
- DDNS
###### 固件后缀的含义，分区类型和固件类型
在下载 openwrt 系统时，经常能看到 initramfs-kernel.bin，squashfs-factory.bin，squashfs-sysupgrade.bin 等结尾的文件，factory 适用于从原厂系统刷到 openwrt，sysupgrade 则是从 openwrt 刷到 openwrt（已经是 openwrt 系统，在 openwrt 系统中更新自己），squashfs 则是一种文件系统，适用于嵌入式设备。那么 initramfs-kernel 又是什么呢。initramfs 是放在内存 RAM 中的 rootfs 映像文件，跟 kernel 放在一起。一般来说用不到 initramfs-kernel.bin 来刷机，因为启动后，所有的配置在路由器重启后都不能保留（毕竟 ram 文件系统，所有文件放在 ram 中，断电就没了）。但也有用到 initramfs-kernel.bin 的时候，就是在移植 openwrt 系统的时候，没有设备上的 flash 闪存的驱动的时候。
- bin/img/gz
###### 固件安装
![20220514142449](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures20220514142449.png)
1. 重置 Breed
   按住 Reset 不放，将电源再次连接，等待 10s 后，松开 Reset，路由器进入 Breed 模式, 接笔记本或PC的有线网络(无线网络仍然可以上网，有线网口不需要设置为静态IP)
2. 在浏览器中访问 192.168.1.1，刷入 Openwrt 固件
3. 等待重启(时间较长)，输入新的IP地址(固件默认的IP地址)，登入OpenWrt后台
4. 进入“网络->接口->LAN”，修改IP地址为静态地址（这里是192.168.123.6），网关和DNS（这里先指向现路由器192.168.123.4），关闭DHCP和IPV6，保存后，网线接入使用中的路由器，进行下一步配置
![Screen Shot 2022-05-14 at 14.30.06](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.30.06.png)
![Screen Shot 2022-05-14 at 14.36.09](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.36.09.png)
##### 固件配置(Pre)
1. 配置网络->接口
- 检查LAN接口的“物理设置”和“防火墙设置”
- 配置WAN接口
   - 设置 PPPOE 的拨号账号
![Screen Shot 2022-05-14 at 14.50.34](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.50.34.png)
   - 关闭 ‘使用对端通告的 DNS 服务器’
   - 添加 ‘使用自定义的 DNS 服务器’
![Screen Shot 2022-05-14 at 14.47.41](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.47.41.png)
- 检查LAN接口的“物理设置”和“防火墙设置”
- 如果要访问光猫添加一个WAN0的接口，复用WAN的物理接口
![Screen Shot 2022-05-14 at 14.53.28](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.53.28.png)
2. 关闭 Turbo ACC 中的 DNS 缓存
![Screen Shot 2022-05-14 at 14.58.43](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2014.58.43.png)
3. 检查防火墙的设置
在“网络->防火墙->自定义规则”中，开启
```
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
```
4. 修改登录密码，添加 SSH Key
5. 配置梯子客户端
- passwall
- ssr plus
6. 启动 NTP 客户端
##### 固件配置(Pro)
1. 配置“网络->接口->LAN”
- 开启 DHCP
![Screen Shot 2022-05-14 at 15.07.31](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.07.31.png)
- 删除网关和 DNS
![Screen Shot 2022-05-14 at 15.07.17](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.07.17.png)
2. DHCP 中添加静态路由
![Screen Shot 2022-05-14 at 15.09.51](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.09.51.png)
3. 配置 DDNS
- 阿里云
![Screen Shot 2022-05-14 at 15.11.31](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.11.31.png)
** 要在高级设置里修正来源，如果之前在局域网里作为副路由设置过 **
![Screen Shot 2022-05-14 at 16.16.16](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2016.16.16.png)
- DDNS.to(备选)
![Screen Shot 2022-05-14 at 15.13.49](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.13.49.png)
要修改 ddnsto 站点上的域名映射配置
4. 设置阿里云盘 webdav 服务本地映射，在浏览器获取 refresh token
![Screen Shot 2022-05-14 at 15.31.22](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesScreen%20Shot%202022-05-14%20at%2015.31.22.png)
5. 导入端口映射表
```
scp root@192.168.123.6:/etc/config/firewall ~/Desktop/firewall
```
从firewall-rediect添加分几类
- nas(24xx)
   - smb
   - webdav
   - portal
   - ssh
- x86 openwrt(20xx)
   - portal
   - ssh
- arm openwrt(22xx)
   - portal
   - ssh
- mips openwrt(25xx)
   - portal
   - ssh
- aria2
   - backend(16800, 19720710)
   - aria2ng(10000, portal)
- aliyun-webdav
```
scp ~/Desktop/firewall root@192.168.123.6:/etc/config/firewall
```
6. 在梯子中添加 VPS
7. 配置 UU 游戏加速器，是否要关闭其他路由器的UU加速器，解绑并重新绑定
## 梯子
## 存储方案
## 测速