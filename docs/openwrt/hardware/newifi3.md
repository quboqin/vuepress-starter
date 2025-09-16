# Newifi 3(新路由3) OpenWRT 安装与配置

## 概述

Newifi 3（新路由3）是一款性价比较高的家用路由器，支持刷入 OpenWRT 固件。由于内置 Breed 不死引导，刷机风险相对较低，适合新手练手。

## 硬件规格

- **CPU**: MT7621AT 双核 880MHz
- **内存**: 512MB DDR3
- **闪存**: 32MB SPI NOR Flash
- **网络**: 5个千兆以太网口
- **无线**: 2.4GHz + 5GHz 双频

## 固件下载

### 推荐固件源

- [恩山论坛 - 新路由3/小娱 Lean源码](https://www.right.com.cn/forum/thread-4047888-1-1.html)

### 固件信息

- **管理地址**: 192.168.1.1
- **默认账号**: root
- **默认密码**: password
- **内置插件**:
  - SSR Plus
  - 阿里云盘 WebDAV
  - Aria2 下载器
  - DDNS
  - iperf3 测速

## 固件安装

### 进入 Breed 模式

1. **断电重置**
   - 按住 Reset 按钮不放
   - 接通电源，等待 10 秒
   - 松开 Reset 按钮

2. **连接设备**
   - 电脑通过网线连接路由器 LAN 口
   - 无线网络仍可正常使用
   - 有线网口无需设置静态 IP

3. **访问 Breed 界面**
   - 浏览器访问 http://192.168.1.1
   - 进入 Breed Web 界面

### 刷入固件

![Breed 界面示例](../images/breed-interface.png)

1. **选择固件文件**
   - 点击"固件更新"
   - 选择下载的 OpenWRT 固件文件
   - 确认固件类型正确

2. **开始刷写**
   - 点击"上传"开始刷写
   - **切勿断电**，等待进度完成
   - 整个过程约 3-5 分钟

3. **等待重启**
   - 刷写完成后路由器自动重启
   - 重启时间较长，请耐心等待
   - 观察指示灯状态确认启动完成

## 初始配置

### 作为副路由配置（推荐）

适用于已有主路由的环境，OpenWRT 作为旁路由使用。

#### 网络接口配置

1. **访问管理界面**
   - 浏览器访问 http://192.168.1.1（固件默认IP）
   - 使用默认账号密码登录

2. **修改 LAN 接口**
   - 进入"网络 → 接口 → LAN"
   - **IP 地址**: 设为静态地址（如 192.168.123.6）
   - **网关**: 指向现有路由器（如 192.168.123.4）
   - **DNS**: 指向现有路由器
   - **关闭 DHCP**
   - **关闭 IPv6**

![LAN 接口配置](../images/newifi-lan-config.png)

3. **应用配置**
   - 点击"保存"（**不要点击"保存及应用"**）
   - 断开电源，将网线插入现有路由器
   - 重新接通电源

#### WAN口拨号配置

如果要作为主路由使用：

1. **配置 PPPoE**
   - 进入"网络 → 接口 → WAN"
   - 设置 PPPoE 拨号账号和密码

![WAN 配置](../images/newifi-wan-config.png)

2. **DNS 设置**
   - 关闭"使用对端通告的 DNS 服务器"
   - 添加自定义 DNS 服务器

![DNS 配置](../images/newifi-dns-config.png)

### 物理设置检查

确认 LAN 接口的物理设置和防火墙设置正确：

- **物理设置**: 包含所有 LAN 口
- **防火墙设置**: 分配到 lan 区域

## 高级配置

### 防火墙自定义规则

在"网络 → 防火墙 → 自定义规则"中添加：

```bash
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
[ -n "$(command -v ip6tables)" ] && ip6tables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 53
```

### Turbo ACC 设置

1. **关闭 DNS 缓存**
   - 进入"网络 → Turbo ACC"
   - 关闭 DNS 缓存选项

![Turbo ACC 配置](../images/turbo-acc-config.png)

### 科学上网配置

1. **Passwall 设置**
   - 配置代理节点
   - 设置分流规则
   - 启用 DNS 分流

2. **SSR Plus 设置**
   - 添加订阅链接
   - 配置访问控制
   - 设置更新规则

### 端口转发

为不同类型服务配置端口转发：

- **NAS 服务** (24xx 端口段)
- **其他路由器** (20xx-25xx 端口段)
- **下载服务**
  - Aria2: 16800, 6800
  - Web界面: 10000

```bash
# 导入端口映射表示例
scp root@192.168.123.6:/etc/config/firewall ~/Desktop/firewall
# 编辑后导入
scp ~/Desktop/firewall root@192.168.123.6:/etc/config/firewall
```

## 系统维护

### 定期维护任务

1. **系统更新**
   - 定期检查固件更新
   - 更新插件和规则列表

2. **配置备份**
   - 定期备份系统配置
   - 导出重要设置文件

3. **性能监控**
   - 监控系统资源使用
   - 检查网络连接状态

### 故障排除

1. **无法访问管理界面**
   - 重置网络适配器
   - 检查 IP 地址配置
   - 尝试恢复出厂设置

2. **网络连接问题**
   - 检查防火墙规则
   - 重启网络服务
   - 查看系统日志

## 相关资源

- [恩山无线论坛](https://www.right.com.cn/forum/)
- [OpenWRT 官方文档](https://openwrt.org/docs/start)
- [Breed 不死引导说明](https://breed.hackpascal.net/)