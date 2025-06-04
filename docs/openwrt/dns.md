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

## R4S的配置
### 通过 Github 的 Action 编译
[NanoPi-R4S-2021 每天自动更新插件和内核版本](https://github.com/quboqin/NanoPi-R4S)
### 下载并通过 balenaEtcher 写入 TF 卡
### 配置
1. 修改网络参数
![3.网络-接口-WAN-基本设置](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures3.%E7%BD%91%E7%BB%9C-%E6%8E%A5%E5%8F%A3-WAN-%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE.png)

![4.网络-接口-WAN-高级设置](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures4.%E7%BD%91%E7%BB%9C-%E6%8E%A5%E5%8F%A3-WAN-%E9%AB%98%E7%BA%A7%E8%AE%BE%E7%BD%AE.png)
- 关闭 ‘使用对端通告的 DNS 服务器’
- 添加 ‘使用自定义的 DNS 服务器’

![5.网络-接口-LAN-基本设置](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures5.%E7%BD%91%E7%BB%9C-%E6%8E%A5%E5%8F%A3-LAN-%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE.png)

![6.网络-接口-IPv6设置](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures6.%E7%BD%91%E7%BB%9C-%E6%8E%A5%E5%8F%A3-IPv6%E8%AE%BE%E7%BD%AE.png)

![7.网络-DHCP:DNS-静态地址分配](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures7.%E7%BD%91%E7%BB%9C-DHCP%3ADNS-%E9%9D%99%E6%80%81%E5%9C%B0%E5%9D%80%E5%88%86%E9%85%8D.png)

![8.网络-防火墙-端口转发](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures8.%E7%BD%91%E7%BB%9C-%E9%98%B2%E7%81%AB%E5%A2%99-%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91.png)

![9.网络-防火墙-自定义规则](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures9.%E7%BD%91%E7%BB%9C-%E9%98%B2%E7%81%AB%E5%A2%99-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A7%84%E5%88%99.png)

![10.网络-Turbo ACC](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures10.%E7%BD%91%E7%BB%9C-Turbo%20ACC.png)

![11.网络-无线-无线概况](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures11.%E7%BD%91%E7%BB%9C-%E6%97%A0%E7%BA%BF-%E6%97%A0%E7%BA%BF%E6%A6%82%E5%86%B5.png)

2. 服务
![12.服务-动态DNS](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures12.%E6%9C%8D%E5%8A%A1-%E5%8A%A8%E6%80%81DNS.png)

![13.服务-UPnP](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures13.%E6%9C%8D%E5%8A%A1-UPnP.png)

3. Passwall
![14.服务-Passwall-DNS](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures14.%E6%9C%8D%E5%8A%A1-Passwall-DNS.png)
![15.服务-Passwall-访问控制](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures15.%E6%9C%8D%E5%8A%A1-Passwall-%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6.png)
![16.服务-Passwall-规则列表](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures16.%E6%9C%8D%E5%8A%A1-Passwall-%E8%A7%84%E5%88%99%E5%88%97%E8%A1%A8.png)

4. 系统
![1.系统-管理权-主机密码](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures1.%E7%B3%BB%E7%BB%9F-%E7%AE%A1%E7%90%86%E6%9D%83-%E4%B8%BB%E6%9C%BA%E5%AF%86%E7%A0%81.png)
![2.系统-管理权-SSH密钥](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures2.%E7%B3%BB%E7%BB%9F-%E7%AE%A1%E7%90%86%E6%9D%83-SSH%E5%AF%86%E9%92%A5.png)

## 参考文档
1. [Lean OpenWrt DNS解析流程研究](https://renyili.org/post/openwrt_dns_process/)
2. [openwrt dnsmasq dns 配置，运行机制初探](https://hellodk.cn/post/552)
3. [全方面讲解OpenWrt的DNS配置与DHCP，并介绍dnsmasq DNS缓存工具、nslookup/dig DNS测试工具](https://dongshao.blog.csdn.net/article/details/102713133?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&utm_relevant_index=2)
