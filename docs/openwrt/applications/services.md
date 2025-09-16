# 系统服务与应用配置

## 概述

OpenWRT 路由器不仅是网络设备，还可以运行多种服务和应用，构建功能丰富的家庭/办公网络中心。本指南介绍常用系统服务的配置方法，包括文件共享、下载服务、媒体服务等。

## 文件共享服务

### Samba (SMB/CIFS) 文件共享

#### 安装 Samba

```bash
# 安装 Samba 服务
opkg update
opkg install samba4-server samba4-client
opkg install luci-app-samba4 luci-i18n-samba4-zh-cn

# 启用服务
/etc/init.d/samba4 enable
/etc/init.d/samba4 start
```

#### 基本配置

```bash
# 通过 LuCI 界面配置
路径：服务 → 网络共享

基本设置：
- 工作组: WORKGROUP
- 描述: OpenWrt Samba Server
- 启用 WINS 服务器: ✓
```

#### 创建共享目录

```bash
# 准备存储设备
# 1. 格式化U盘或硬盘
mkfs.ext4 /dev/sda1

# 2. 创建挂载点
mkdir -p /mnt/shared

# 3. 挂载设备
mount /dev/sda1 /mnt/shared

# 4. 设置自动挂载
echo '/dev/sda1 /mnt/shared ext4 defaults 0 0' >> /etc/fstab
```

#### 用户管理

```bash
# 安装用户管理工具
opkg install shadow-useradd

# 创建系统用户
useradd -m -s /bin/bash smbuser

# 设置 Samba 密码
smbpasswd -a smbuser
# 输入两次密码

# 设置目录权限
chown smbuser:smbuser /mnt/shared
chmod 755 /mnt/shared
```

#### 共享配置

```bash
# LuCI 界面配置路径
路径：服务 → 网络共享 → 共享目录

共享设置：
- 名称: shared
- 路径: /mnt/shared
- 允许用户: smbuser
- 只读: 否
- 允许访客: 否
- 继承权限: 是
- 强制用户: smbuser
```

#### 高级配置

编辑 `/etc/samba/smb.conf.template`：

```ini
[global]
    netbios name = OpenWrt
    workgroup = WORKGROUP
    server string = OpenWrt Samba Server
    security = user
    map to guest = Bad User
    encrypt passwords = yes
    guest account = nobody
    local master = yes
    os level = 20

    # 性能优化
    socket options = TCP_NODELAY SO_RCVBUF=65536 SO_SNDBUF=65536
    read raw = yes
    write raw = yes
    max xmit = 65535

[shared]
    path = /mnt/shared
    valid users = smbuser
    read only = no
    guest ok = no
    create mask = 0644
    directory mask = 0755
    force user = smbuser
    force group = smbuser
```

### WebDAV 服务

#### 安装 WebDAV

```bash
# 安装 nginx 和 WebDAV 模块
opkg install nginx nginx-mod-http-dav-ext
opkg install luci-app-nginx

# 启用服务
/etc/init.d/nginx enable
```

#### 配置 WebDAV

编辑 `/etc/nginx/nginx.conf`：

```nginx
server {
    listen 8080;
    server_name _;

    location /webdav/ {
        alias /mnt/shared/;

        # WebDAV 配置
        dav_methods PUT DELETE MKCOL COPY MOVE;
        dav_ext_methods PROPFIND PROPPATCH LOCK UNLOCK;
        dav_access user:rw group:r all:r;

        # 认证配置
        auth_basic "WebDAV Access";
        auth_basic_user_file /etc/nginx/webdav.passwd;

        # 自动索引
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

#### 创建 WebDAV 用户

```bash
# 安装 htpasswd 工具
opkg install apache-utils

# 创建密码文件
htpasswd -c /etc/nginx/webdav.passwd webdavuser

# 重启 nginx
/etc/init.d/nginx restart
```

### FTP 服务

#### 安装 vsftpd

```bash
opkg install vsftpd luci-app-vsftpd

/etc/init.d/vsftpd enable
/etc/init.d/vsftpd start
```

#### FTP 配置

```bash
# 编辑 /etc/vsftpd.conf
listen=YES
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
connect_from_port_20=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd
user_sub_token=$USER
local_root=/mnt/shared/$USER
chroot_local_user=YES
allow_writeable_chroot=YES

# 用户配置
userlist_enable=YES
userlist_file=/etc/vsftpd.users
userlist_deny=NO

# 被动模式配置
pasv_enable=YES
pasv_min_port=60000
pasv_max_port=60100
```

## 下载服务

### Aria2 下载器

#### 安装 Aria2

```bash
# 安装 Aria2 及 Web 界面
opkg install aria2 luci-app-aria2

# 安装 AriaNg Web 界面
wget -O /tmp/ariang.zip https://github.com/mayswind/AriaNg/releases/download/1.3.6/AriaNg-1.3.6.zip
unzip /tmp/ariang.zip -d /www/ariang/

/etc/init.d/aria2 enable
/etc/init.d/aria2 start
```

#### Aria2 配置

```bash
# 编辑 /etc/aria2/aria2.conf
# 基本设置
dir=/mnt/shared/downloads
file-allocation=falloc
continue=true
always-resume=true
resume-retry-count=0

# 下载设置
max-concurrent-downloads=5
max-connection-per-server=16
min-split-size=1M
split=16

# RPC 设置
enable-rpc=true
rpc-listen-all=true
rpc-listen-port=6800
rpc-secret=your_secret_token

# BT 设置
enable-dht=true
enable-peer-exchange=true
bt-enable-lpd=true
bt-max-peers=50
bt-seed-unverified=true
bt-save-metadata=true
bt-tracker-timeout=10
bt-tracker-connect-timeout=10

# 进度保存
input-file=/etc/aria2/aria2.session
save-session=/etc/aria2/aria2.session
save-session-interval=60
```

#### Web 管理界面

访问 `http://路由器IP/ariang` 进入 AriaNg 界面：

```javascript
// AriaNg 连接设置
RPC 地址: http://路由器IP:6800/jsonrpc
密钥: your_secret_token
```

### qBittorrent 下载器

#### Docker 部署方式

```bash
# 拉取镜像
docker pull linuxserver/qbittorrent

# 运行容器
docker run -d \
  --name=qbittorrent \
  --restart=unless-stopped \
  -p 8080:8080 \
  -p 6881:6881 \
  -p 6881:6881/udp \
  -v /mnt/shared/qbittorrent/config:/config \
  -v /mnt/shared/downloads:/downloads \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Asia/Shanghai \
  -e WEBUI_PORT=8080 \
  linuxserver/qbittorrent
```

## 媒体服务

### DLNA 媒体服务器

#### 安装 miniDLNA

```bash
opkg install minidlna luci-app-minidlna

/etc/init.d/minidlna enable
```

#### miniDLNA 配置

```bash
# 通过 LuCI 界面配置
路径：服务 → miniDLNA

基本设置：
- 媒体目录: /mnt/shared/media
- 数据库目录: /var/cache/minidlna
- 日志目录: /var/log
- 端口: 8200
- 友好名称: OpenWrt DLNA Server
- 严格遵守DLNA标准: ✓
- 启用inotify: ✓

媒体类型：
V,/mnt/shared/videos    # 视频文件
A,/mnt/shared/music     # 音频文件
P,/mnt/shared/photos    # 图片文件
```

### Jellyfin 媒体服务器

#### Docker 部署

```bash
# 创建配置目录
mkdir -p /mnt/shared/jellyfin/config
mkdir -p /mnt/shared/jellyfin/cache

# 部署 Jellyfin
docker run -d \
  --name jellyfin \
  --restart=unless-stopped \
  -p 8096:8096 \
  -v /mnt/shared/jellyfin/config:/config \
  -v /mnt/shared/jellyfin/cache:/cache \
  -v /mnt/shared/media:/media:ro \
  jellyfin/jellyfin
```

#### 访问配置

访问 `http://路由器IP:8096` 进行初始配置：

1. 创建管理员用户
2. 添加媒体库路径
3. 配置元数据下载器
4. 设置硬件转码（如支持）

## 网络服务

### DDNS 动态域名

#### 阿里云 DDNS

```bash
# 安装 DDNS
opkg install ddns-scripts luci-app-ddns

# 阿里云配置
路径：服务 → 动态 DNS

基本设置：
✓ 启用
服务提供商: aliyun.com
主机名: home.your-domain.com
用户名: AccessKey ID
密码: AccessKey Secret
IP地址来源: 网络接口 (选择 WAN)
```

#### Cloudflare DDNS

```bash
# Cloudflare 配置
服务提供商: cloudflare.com-v4
域名: your-domain.com
用户名: Zone ID
密码: API Token
主机名: home
```

### UPnP 服务

#### 配置 UPnP

```bash
opkg install miniupnpd luci-app-upnp

# LuCI 配置
路径：服务 → UPnP

基本设置：
✓ 启用 UPnP
✓ 启用 NAT-PMP
✓ 安全模式
上行速率: 50000 (Kbit/s)
下行速率: 1000000 (Kbit/s)
```

### Wake-on-LAN

#### 安装配置

```bash
opkg install etherwake luci-app-wol

# 添加设备
路径：服务 → Wake on LAN

设备配置：
- 主机名: MyPC
- MAC地址: 00:11:22:33:44:55
- 网络接口: br-lan
```

## 系统监控服务

### Netdata 监控

#### Docker 部署

```bash
docker run -d \
  --name=netdata \
  --restart=unless-stopped \
  -p 19999:19999 \
  -v netdataconfig:/etc/netdata \
  -v netdatalib:/var/lib/netdata \
  -v netdatacache:/var/cache/netdata \
  -v /etc/passwd:/host/etc/passwd:ro \
  -v /etc/group:/host/etc/group:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /etc/os-release:/host/etc/os-release:ro \
  --cap-add SYS_PTRACE \
  --security-opt apparmor=unconfined \
  netdata/netdata
```

### collectd 数据收集

```bash
# 安装 collectd
opkg install collectd collectd-mod-cpu collectd-mod-memory \
collectd-mod-load collectd-mod-network collectd-mod-disk

# 配置 collectd
cat > /etc/collectd.conf << 'EOF'
FQDNLookup false
BaseDir "/var/lib/collectd"
PluginDir "/usr/lib/collectd"
TypesDB "/usr/share/collectd/types.db"

Interval 60
ReadThreads 2

LoadPlugin syslog
LoadPlugin cpu
LoadPlugin memory
LoadPlugin load
LoadPlugin disk
LoadPlugin interface

<Plugin "interface">
    Interface "br-lan"
    Interface "eth0"
    IgnoreSelected false
</Plugin>

<Plugin "disk">
    Disk "/dev/sda"
    IgnoreSelected false
</Plugin>
EOF

/etc/init.d/collectd enable
/etc/init.d/collectd start
```

## 安全服务

### Fail2ban 防护

#### 安装配置

```bash
# 安装 Fail2ban
opkg install fail2ban

# 创建配置文件
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# 封禁时间（秒）
bantime = 3600
# 查找时间范围（秒）
findtime = 600
# 最大尝试次数
maxretry = 5
# 白名单IP
ignoreip = 127.0.0.1/8 192.168.1.0/24

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 6
EOF

/etc/init.d/fail2ban enable
/etc/init.d/fail2ban start
```

## 自动化脚本

### 系统维护脚本

#### 自动清理脚本

```bash
#!/bin/sh
# 系统清理脚本

LOG_FILE="/var/log/cleanup.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# 清理临时文件
cleanup_temp() {
    log_message "Cleaning temporary files..."
    find /tmp -type f -mtime +7 -delete
    find /var/log -name "*.log.*" -mtime +30 -delete
}

# 清理下载完成的种子
cleanup_downloads() {
    log_message "Cleaning completed downloads..."
    # 删除超过30天的已完成下载
    find /mnt/shared/downloads -name "*.torrent" -mtime +30 -delete
}

# 重启服务
restart_services() {
    log_message "Restarting services..."
    /etc/init.d/dnsmasq restart
    /etc/init.d/network restart
}

# 系统状态检查
system_check() {
    log_message "System check started"

    # 检查磁盘空间
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 90 ]; then
        log_message "WARNING: Disk usage is ${DISK_USAGE}%"
        cleanup_temp
    fi

    # 检查内存使用
    MEM_USAGE=$(free | awk '/Mem:/ {printf("%.0f", $3/$2*100)}')
    if [ $MEM_USAGE -gt 90 ]; then
        log_message "WARNING: Memory usage is ${MEM_USAGE}%"
    fi

    log_message "System check completed"
}

# 执行清理任务
main() {
    log_message "Cleanup script started"
    cleanup_temp
    cleanup_downloads
    system_check
    log_message "Cleanup script completed"
}

main
```

#### 定时任务配置

```bash
# 编辑 crontab
cat >> /etc/crontabs/root << 'EOF'
# 系统维护脚本
# 每天凌晨3点执行系统清理
0 3 * * * /usr/bin/system_cleanup.sh

# 每小时检查服务状态
0 * * * * /usr/bin/service_monitor.sh

# 每周日凌晨2点重启系统
0 2 * * 0 /sbin/reboot

# 每天备份配置文件
30 2 * * * sysupgrade -b /mnt/shared/backups/config_$(date +\%Y\%m\%d).tar.gz
EOF

# 重启 cron 服务
/etc/init.d/cron restart
```

### 服务监控脚本

```bash
#!/bin/sh
# 服务监控脚本

SERVICES="dnsmasq dropbear uhttpd samba4"
LOG_FILE="/var/log/service_monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

check_service() {
    local service=$1

    if /etc/init.d/$service status > /dev/null 2>&1; then
        log_message "$service is running"
    else
        log_message "WARNING: $service is not running, restarting..."
        /etc/init.d/$service start

        # 等待服务启动
        sleep 5

        if /etc/init.d/$service status > /dev/null 2>&1; then
            log_message "$service restarted successfully"
        else
            log_message "ERROR: Failed to restart $service"
        fi
    fi
}

# 检查所有服务
for service in $SERVICES; do
    check_service $service
done

# 检查网络连通性
if ping -c 3 8.8.8.8 > /dev/null 2>&1; then
    log_message "Internet connection OK"
else
    log_message "WARNING: Internet connection failed"
    # 重启网络
    /etc/init.d/network restart
fi
```

## 性能调优

### 系统参数优化

```bash
# 编辑 /etc/sysctl.conf
cat >> /etc/sysctl.conf << 'EOF'
# 网络性能优化
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216
net.core.netdev_max_backlog = 5000

# TCP 优化
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr

# 连接跟踪优化
net.netfilter.nf_conntrack_max = 65536
net.netfilter.nf_conntrack_tcp_timeout_established = 1800

# 文件系统优化
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

# 应用设置
sysctl -p
```

### 存储优化

```bash
# SSD 优化
echo 'noop' > /sys/block/sda/queue/scheduler
echo '0' > /sys/block/sda/queue/rotational

# 定时 TRIM
echo '0 2 * * 0 /sbin/fstrim -av' >> /etc/crontabs/root
```

## 总结

通过配置各种系统服务，OpenWRT 路由器可以成为功能强大的网络中心，提供：

1. **文件共享服务**：Samba、WebDAV、FTP 等多种协议
2. **下载服务**：Aria2、qBittorrent 等专业下载工具
3. **媒体服务**：DLNA、Jellyfin 等流媒体解决方案
4. **网络服务**：DDNS、UPnP、WoL 等便民功能
5. **监控服务**：系统监控和性能分析
6. **自动化维护**：定时任务和服务监控

合理配置和维护这些服务，可以显著提升网络使用体验，构建智能化的数字生活环境。