---
sidebar: auto
---

# 手机和PC端翻墙客户端设置

## 概述

本章详细介绍各平台（Windows、macOS、Linux、Android、iOS）的科学上网客户端选择、安装和配置方法，帮助您快速实现全设备翻墙。

## Windows客户端

### 客户端对比

| 客户端 | 特点 | 推荐版本 | 协议支持 | 下载地址 |
|--------|------|----------|----------|----------|
| **v2rayN** | 功能全面，支持多协议 | v7.17.0+ | VMess/VLESS/Trojan/SS/SSR | [GitHub](https://github.com/2dust/v2rayN/releases) |
| **Clash Verge Rev** | 界面美观，基于Mihomo核心 | v2.4.5+ | Clash配置 | [GitHub](https://github.com/clash-verge-rev/clash-verge-rev/releases) |
| **Clash Nyanpasu** | 新UI，体验好 | 最新版 | Clash配置 | [GitHub](https://github.com/keiko233/clash-nyanpasu/releases) |
| **Nekoray** | 跨平台，支持sing-box | 最新版 | 多协议 | [GitHub](https://github.com/MatsuriDayo/nekoray/releases) |

**注意：** Clash Verge 已停止更新，推荐使用 Clash Verge Rev。

### v2rayN 详细配置

#### 安装步骤

1. **下载客户端**
   - 访问 [v2rayN Releases](https://github.com/2dust/v2rayN/releases)
   - 下载 `v2rayN-windows-64-SelfContained.zip`
   - 解压到任意目录（避免中文路径）

2. **首次运行**
   ```
   双击 v2rayN.exe
   程序会最小化到系统托盘
   ```

#### 添加节点

**方法一：订阅导入（推荐）**
```
1. 右键托盘图标 → 订阅分组设置
2. 点击"添加"按钮
3. 输入订阅地址（从机场获取）
4. 备注名称（如：我的机场）
5. 点击"确定"保存
6. 右键托盘图标 → 更新订阅
```

**方法二：手动添加**
```
1. 主界面 → 服务器 → 添加[VMess]服务器
2. 填写节点信息：
   - 别名: 自定义名称
   - 地址: 服务器IP或域名
   - 端口: 服务端口
   - 用户ID: UUID
   - 额外ID: 通常为0
   - 传输协议: tcp/ws/h2等
   - 伪装类型: none/http
3. 保存并测试连接
```

#### 系统代理设置

**代理模式选择：**
- **自动配置系统代理**：推荐日常使用
- **清除系统代理**：关闭代理
- **不改变系统代理**：手动配置

**路由规则：**
```
1. 设置 → 路由设置
2. 选择预设规则：
   - 绕过大陆：国内直连，国外代理（推荐）
   - 全局：所有流量走代理
   - 绕过局域网：仅代理非局域网流量
```

#### 高级功能

**Mux多路复用：**
```
设置 → 参数设置 → Core设置
启用Mux：✓
并发连接数：8（默认）
```

**规则订阅：**
```
设置 → 路由设置 → 规则订阅
添加规则订阅地址：
https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/geosite.dat
https://raw.githubusercontent.com/Loyalsoldier/v2ray-rules-dat/release/geoip.dat
```

### Clash Verge Rev 详细配置

#### 安装步骤

1. **下载安装**
   - 访问 [Clash Verge Rev Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases)
   - 下载 `Clash.Verge_x.x.x_x64_en-US.msi`
   - 运行安装程序

2. **导入订阅**
   ```
   1. 打开 Clash Verge Rev
   2. 订阅 → 新建 → 输入订阅URL
   3. 等待订阅更新完成
   4. 选择代理组和节点
   5. 启用系统代理
   ```

#### 规则模式

**三种模式对比：**
- **全局模式**：所有流量走代理
- **规则模式**：按规则分流（推荐）
- **直连模式**：不使用代理

#### 自定义规则

编辑配置文件添加规则：
```yaml
rules:
  # 局域网直连
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  
  # 特定网站走代理
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,youtube.com,PROXY
  
  # 中国IP直连
  - GEOIP,CN,DIRECT
  
  # 其他走代理
  - MATCH,PROXY
```

## macOS客户端

### 客户端推荐

| 客户端 | 价格 | 特点 | 协议支持 |
|--------|------|------|----------|
| **Clash Verge Rev** | 免费 | 功能强大，推荐 | Clash配置 |
| **V2rayU** | 免费 | 开源，支持订阅 | V2Ray全协议 |
| **Qv2ray** | 免费 | 跨平台，插件系统 | 多协议 |

### Clash Verge Rev for macOS

**安装配置：**
```
1. 下载 Clash.Verge_x.x.x_aarch64.dmg（Apple Silicon）
   或 Clash.Verge_x.x.x_x64.dmg（Intel）
2. 拖拽到Applications文件夹
3. 首次运行需要在"安全性与隐私"中允许
4. 导入订阅 → 启用系统代理
```

**增强模式（TUN模式）：**
```bash
# 允许Clash使用TUN模式
sudo chown root:admin /Applications/Clash\ Verge.app/Contents/MacOS/clash-verge-service
sudo chmod +sx /Applications/Clash\ Verge.app/Contents/MacOS/clash-verge-service
```

## Linux客户端

### 命令行客户端

#### V2Ray/Xray 原生客户端

**安装：**
```bash
# 使用官方脚本安装Xray
bash <(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)

# 或使用包管理器
# Ubuntu/Debian
apt install xray

# Arch Linux
yay -S xray
```

**配置文件示例：**
```json
{
  "inbounds": [{
    "port": 1080,
    "protocol": "socks",
    "settings": {
      "udp": true
    }
  }],
  "outbounds": [{
    "protocol": "vless",
    "settings": {
      "vnext": [{
        "address": "your-server.com",
        "port": 443,
        "users": [{
          "id": "your-uuid",
          "flow": "xtls-rprx-vision",
          "encryption": "none"
        }]
      }]
    },
    "streamSettings": {
      "network": "tcp",
      "security": "reality",
      "realitySettings": {
        "serverName": "www.microsoft.com",
        "publicKey": "your-public-key",
        "shortId": ""
      }
    }
  }]
}
```

**启动服务：**
```bash
# 使用systemd管理
systemctl start xray
systemctl enable xray

# 或直接运行
xray run -c /etc/xray/config.json
```

#### Clash for Linux

**安装Clash Premium：**
```bash
# 下载Clash Premium
wget https://github.com/Dreamacro/clash/releases/download/premium/clash-linux-amd64-v3-2023.08.17.gz
gunzip clash-linux-amd64-v3-2023.08.17.gz
mv clash-linux-amd64-v3-2023.08.17 /usr/local/bin/clash
chmod +x /usr/local/bin/clash

# 创建配置目录
mkdir -p ~/.config/clash

# 下载配置文件
wget -O ~/.config/clash/config.yaml "your-subscription-url"

# 运行Clash
clash -d ~/.config/clash
```

**创建systemd服务：**
```ini
# /etc/systemd/system/clash.service
[Unit]
Description=Clash daemon
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/clash -d /root/.config/clash
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**启用服务：**
```bash
systemctl daemon-reload
systemctl start clash
systemctl enable clash
```

### 图形化客户端

**Clash Verge for Linux：**
```bash
# 下载AppImage
wget https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v2.x.x/clash-verge_2.x.x_amd64.AppImage

# 添加执行权限
chmod +x clash-verge_2.x.x_amd64.AppImage

# 运行
./clash-verge_2.x.x_amd64.AppImage
```

## Android客户端

### 客户端推荐

| 客户端 | 特点 | 下载来源 | 协议支持 |
|--------|------|----------|----------|
| **v2rayNG** | 官方客户端，稳定 | GitHub / Google Play | V2Ray全协议 |
| **Clash Meta for Android** | 规则强大 | GitHub | Clash配置 |
| **FlClash** | 新兴客户端，体验好 | GitHub | Clash配置 |
| **Surfboard** | 兼容Surge配置 | Google Play | Surge/Clash |

### v2rayNG 配置指南

#### 安装步骤

1. **下载APK**
   - GitHub: [v2rayNG Releases](https://github.com/2dust/v2rayNG/releases)
   - 下载 `v2rayNG_x.x.x_arm64-v8a.apk`

2. **安装APK**
   ```
   设置 → 安全 → 允许安装未知来源应用
   打开下载的APK → 安装
   ```

#### 添加节点

**方法一：订阅导入**
```
1. 点击右上角"+"
2. 选择"从订阅URL导入"
3. 粘贴订阅链接
4. 点击"确定"
5. 下拉刷新订阅
```

**方法二：扫码导入**
```
1. 点击右上角扫码图标
2. 扫描节点二维码
3. 自动添加节点
```

#### 连接设置

**路由规则：**
```
设置 → 路由设置
选择路由模式：
- 绕过局域网及大陆：推荐
- 全局：所有流量代理
- 绕过局域网：仅国外代理
```

**分应用代理：**
```
设置 → 分应用代理
选择需要代理的应用
其他应用直连
```

### Clash Meta for Android

#### 配置步骤

1. **安装客户端**
   - 下载 [Clash Meta APK](https://github.com/MetaCubeX/ClashMetaForAndroid/releases)

2. **导入配置**
   ```
   配置 → 新配置 → URL
   输入订阅链接 → 保存
   选择配置 → 启动服务
   ```

3. **规则设置**
   ```
   代理 → 选择节点
   模式 → 规则（推荐）
   ```

## iOS客户端

### 客户端推荐

| 客户端 | 价格 | 特点 | App Store区域 |
|--------|------|------|---------------|
| **Shadowrocket** | $2.99 | 功能全面，推荐⭐ | 美区/港区 |
| **Quantumult X** | $7.99 | 规则强大，高级用户 | 美区/港区 |
| **Stash** | $3.99 | Clash兼容 | 美区 |
| **Surge** | $49.99 | 专业级网络工具 | 美区 |
| **Loon** | $5.99 | 轻量级，性能好 | 美区 |

### Shadowrocket（小火箭）配置

#### 购买和下载

**获取美区Apple ID：**
1. 注册美区Apple ID
2. 购买美区App Store礼品卡
3. 充值并购买Shadowrocket

**或使用共享账号（不推荐）：**
- 风险：账号随时可能失效
- 建议：自行购买永久使用

#### 基本配置

**添加订阅：**
```
1. 打开Shadowrocket
2. 点击右上角"+"
3. 选择"Subscribe"
4. 粘贴订阅链接
5. 备注名称
6. 点击"完成"
7. 下拉刷新订阅
```

**选择节点：**
```
1. 在服务器列表选择节点
2. 点击右上角开关启动
3. 首次使用需要添加VPN配置
4. 输入密码/FaceID确认
```

#### 高级功能

**规则配置：**
```
配置 → 添加配置
使用远程规则：
https://raw.githubusercontent.com/Loyalsoldier/surge-rules/release/ruleset/proxy.txt
```

**分应用代理：**
```
设置 → 按需连接
添加需要代理的应用域名
```

### Quantumult X（圈X）配置

#### 导入订阅

```
1. 风车图标 → 节点资源
2. 点击右上角"+"
3. 粘贴订阅链接
4. 资源标签：机场名称
5. 服务器：订阅URL
6. 点击"确定"
7. 返回首页 → 下拉更新
```

#### 规则分流

**添加分流规则：**
```
风车图标 → 分流规则
引用示例：
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/Netflix/Netflix.list
```

## 客户端通用配置建议

### 全局配置要点

**代理规则设置：**
```yaml
# 推荐规则顺序
rules:
  # 1. 局域网直连
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  
  # 2. 广告拦截
  - DOMAIN-KEYWORD,ads,REJECT
  - DOMAIN-KEYWORD,analytics,REJECT
  
  # 3. 流媒体分流
  - DOMAIN-SUFFIX,netflix.com,🎬 Netflix
  - DOMAIN-SUFFIX,youtube.com,📹 YouTube
  
  # 4. 国内直连
  - GEOIP,CN,DIRECT
  
  # 5. 默认代理
  - MATCH,PROXY
```

### 节点选择策略

**自动选择配置：**
```yaml
proxy-groups:
  - name: "自动选择"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
      - "节点1"
      - "节点2"
      - "节点3"
```

**负载均衡：**
```yaml
  - name: "负载均衡"
    type: load-balance
    url: http://www.gstatic.com/generate_204
    interval: 300
    strategy: round-robin
    proxies:
      - "节点1"
      - "节点2"
```

### 常见问题

#### 连接失败
**排查步骤：**
1. 检查节点是否过期
2. 更新订阅
3. 尝试其他节点
4. 检查本地网络
5. 查看客户端日志

#### DNS泄露
**防护措施：**
- 启用DNS over HTTPS
- 使用Fake-IP模式
- 配置DNS分流

#### 速度慢
**优化方法：**
- 选择低延迟节点
- 启用Mux多路复用
- 使用专线节点
- 检查本地网络质量

---

**更新时间：** 2026年2月
**下一章：** [内网穿透方案](./intranet.md)
**返回目录：** [科学上网完全指南](./README.md)
