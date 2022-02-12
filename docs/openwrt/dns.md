# 科学上网的Openwrt路由器DNS配置
我们的科学研究依赖 google 搜索引擎，学会搭建科学上网的环境是一项重要的技能，而使用 Openwrt 的路由器可以让办公环境或家庭环境中的所有设备都可以方便的科学上网是我们常用的手段。但是 Openwrt 中 DNS 的设置是是否可以顺利科学上网的重要环节，这个方面网上虽然有很多介绍，但是很多都是结合具体的科学上网工具的具体操作，根据这些操作，出现问题后有时候便一筹莫展，所谓*知其然不知其所以然*。本篇试图通过详尽的原理性介绍，让大家有一个更深入的理解，再遇到类似问题的时候可以举一反三。
## 路由器的软硬件环境，主要模块的版本
1. 一个双网口的 NanoPi R4S RK3399路由器，内置 4GB RAM，外置 32GB 的 TF 卡
2. Opnewrt 的固件版本是 DHDAXCW @ FusionWrt R22.1.1 (2022-01-14) / LuCI Master [git-21.335.48743-5f363d9](https://github.com/DHDAXCW/NanoPi-R4S)
3. 主要模块

| module | version |
| ------ | ----- |
| dnsmasq | 2.86-8 |
| pdnsd | 1.2.9b-par-3 |
| passwall | 4.47-1 |

## DNS解析的拓扑图和流程图
### 拓扑图
![openwrt-Page-4.drawio](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesopenwrt-Page-4.drawio.png)
1. passwall 依赖 dnsmasq 和 pdnsd 两个模块
2. dnsmasq 在 53 端口监听来自局域网的 DNS 请求，并通过分流策略选择不同的上游 DNS 服务
3. 代理的 DNS 请求走 pdnsd，pdnsd 起到缓存作用，它自身的上游 DNS 服务器是 1.1.1.1，在 passwall 选项 DNS 的‘远程DNS’中选择
![r4s-passwall-dns-2](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesr4s-passwall-dns-2.png)
4. 白名单的 DNS 请求，发送给 ‘/tmp/resolv.conf.d/resolv.conf.auto’ 文件中指定的 DNS 服务器
![r4s-network-dhcp-dns-hosts](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesr4s-network-dhcp-dns-hosts.png)
```shell
$ cat /tmp/resolv.conf.d/resolv.conf.auto
# Interface wan
nameserver 114.114.114.114
nameserver 114.114.115.115
# Interface wan_6
```
这里 DNS 的地址又是如何设置的呢？在 ‘网络->接口->WAN->高级设置’ 中 ‘使用对端通告的 DNS 服务器’，如果勾选就使用运营商的 DNS，我这里是上海电信的
```
116.228.111.118
180.168.255.18
```
而如果没有勾选，你可以指定 DNS
![r4s-network-interface-wan](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesr4s-network-interface-wan.png)

### 流程图
整个网络请求分三步
1. 获取 DNS 服务器的 IP 地址
2. 用 DNS 服务器的 IP 地址访问DNS服务器获取目标网站的 IP 地址
3. 用目标网站的 IP 地址访问目标网站
![dns-flow](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesdns-flow.png)
**图中步骤 3 和 4 在DNS解析过程中也包含了 5/6/7 这三步**
为了让 1.1.1.1不被屏蔽，也走代理，可以把 1.1.1.1加入到passwall的规则列表的的代理列表中
![passwall-rule-proxy](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturespasswall-rule-proxy.png)
## 其他相关的配置文件和对应的UI的设定
1. passwall 的 DNS 分流规则文件在 ‘/tmp/dnsmasq.d’ 下
```shell
$ ls /tmp/dnsmasq.d/passwall -al
drwxr-xr-x    2 root     root           140 Feb 12 14:32 .
drwxr-xr-x    4 root     root           120 Feb 12 14:32 ..
-rw-r--r--    1 root     root          1428 Feb 12 14:32 10-vpsiplist_host.conf
-rw-r--r--    1 root     root          1732 Feb 12 14:32 11-direct_host.conf
-rw-r--r--    1 root     root           334 Feb 12 14:32 97-proxy_host.conf
-rw-r--r--    1 root     root        466479 Feb 12 14:32 99-gfwlist.conf
-rw-r--r--    1 root     root        480471 Feb 12 14:32 ipset.conf
```
而 ‘/tmp/dnsmasq.d’ 这个路径是由 ‘/var/etc/dnsmasq.conf.cfg01411c’ 这个文件的 ‘conf-dir’ 字段指定的
```shell
# /var/etc/dnsmasq.conf.cfg01411c
# auto-generated config file from /etc/config/dhcp
...
conf-dir=/tmp/dnsmasq.d
...
```
```shell
# 99-gfwlist.conf
server=/.zoom.com/127.0.0.1#7913
server=/.zoom.com.cn/127.0.0.1#7913
server=/.zoom.us/127.0.0.1#7913
server=/.zoomingin.tv/127.0.0.1#7913
```
```shell
# 10-vpsiplist_host.conf
server=/.amd.magicefire.com/114.114.114.114
server=/.amd.magicefire.com/114.114.115.115
```
2. 在‘DHCP/DNS->基本设置->DNS转发’不需要配置
![dhcp-dns](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesdhcp-dns.png)

3. 关闭 Turbo ACC 网络加速设置的 DNS 缓存
- DNS 缓存用的也是  pdnsd 模块，在 passwall 已使用，所以没有必要再开启
- 如果开启了这里的 DNS 缓存，在 DHCP/DNS 的基本设置中 DNS 转发将指向 dnscache, 端口 5333，然后再由 dnscache 指向 pdnsd，而如果 这里 pdnsd 的上游 DNS 设成 114.114.114.114，就不是 1.1.1.1 了
![turboacc-dns](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesturboacc-dns.png)
而这时候的 DHCP/DNS 的基本设置的 DNS 转发指向
![dhcp-dns-转发](https://raw.githubusercontent.com/quboqin/images/main/blogs/picturesdhcp-dns-%E8%BD%AC%E5%8F%91.png)
## 常用的命令行检查工具
1. dnsmasq
```shell
$ dnsmasq --test
dnsmasq: syntax check OK.
```

2. netstat
```shell
$ netstat -nlpt|grep pdnsd
netstat: showing only processes with your user ID
tcp        0      0 127.0.0.1:7913          0.0.0.0:*               LISTEN      16460/pdnsd

# root @ FusionWrt in ~ [18:22:16]
$ netstat -nlpt|grep dnsmasq
tcp        0      0 127.0.0.1:53            0.0.0.0:*               LISTEN      17803/dnsmasq
tcp        0      0 192.168.123.5:53        0.0.0.0:*               LISTEN      17803/dnsmasq
tcp        0      0 218.82.184.226:53       0.0.0.0:*               LISTEN      17803/dnsmasq
tcp        0      0 172.17.0.1:53           0.0.0.0:*               LISTEN      17803/dnsmasq
tcp        0      0 240e:389:8208:7000::1:53 :::*                    LISTEN      17803/dnsmasq
tcp        0      0 240e:38f:8e17:1a7e:8234:283f:4633:f18d:53 :::*                    LISTEN      17803/dnsmasq
tcp        0      0 ::1:53                  :::*                    LISTEN      17803/dnsmasq
tcp        0      0 fe80::8234:28ff:fe33:f18d:53 :::*                    LISTEN      17803/dnsmasq
tcp        0      0 fd47:78af:200e::1:53    :::*                    LISTEN      17803/dnsmasq
tcp        0      0 fe80::8034:28ff:fe33:f18d:53 :::*                    LISTEN      17803/dnsmasq
```

3. nslookup
```shell
$ nslookup -port=7913 www.baidu.com
Server:		127.0.0.1
Address:	127.0.0.1:7913

Non-authoritative answer:
www.baidu.com	canonical name = www.a.shifen.com
www.a.shifen.com	canonical name = www.wshifen.com
Name:	www.wshifen.com
Address: 103.235.46.39

Non-authoritative answer:
www.baidu.com	canonical name = www.a.shifen.com
www.a.shifen.com	canonical name = www.wshifen.com
```

4. dig
```shell
$ dig @8.8.8.8 www.google.com

; <<>> DiG 9.17.13 <<>> @8.8.8.8 www.google.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 24743
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;www.google.com.			IN	A

;; ANSWER SECTION:
www.google.com.		209	IN	A	172.217.163.36

;; Query time: 269 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Sat Feb 12 18:26:26 CST 2022
;; MSG SIZE  rcvd: 59
```

```shell
$ dig google.com +trace
$ dig @8.8.8.8 -p 5300 google.com
```

## 参考文档
1. [Lean OpenWrt DNS解析流程研究](https://renyili.org/post/openwrt_dns_process/)
2. [openwrt dnsmasq dns 配置，运行机制初探](https://hellodk.cn/post/552)
3. [全方面讲解OpenWrt的DNS配置与DHCP，并介绍dnsmasq DNS缓存工具、nslookup/dig DNS测试工具](https://dongshao.blog.csdn.net/article/details/102713133?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&utm_relevant_index=2)
