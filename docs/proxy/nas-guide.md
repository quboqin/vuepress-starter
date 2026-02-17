# 家庭NAS方案指南

## 目录
- [NAS简介](#nas简介)
- [NAS系统对比](#nas系统对比)
- [硬件选购指南](#硬件选购指南)
- [DIY NAS组装](#diy-nas组装)
- [系统安装与配置](#系统安装与配置)
- [常用应用部署](#常用应用部署)
- [数据备份策略](#数据备份策略)

---

## NAS简介

### 什么是NAS

NAS（Network Attached Storage，网络附加存储）是专门用于数据存储和共享的设备，通过网络为多台设备提供文件服务。

### NAS vs 普通硬盘

| 特性 | 普通移动硬盘 | NAS |
|------|-------------|-----|
| 访问方式 | USB直连 | 网络访问 |
| 共享能力 | 单用户 | 多用户同时访问 |
| 数据保护 | 无 | RAID冗余 |
| 功能扩展 | 无 | 丰富的应用 |
| 远程访问 | 不能 | 可以 |

### 使用场景

```
家庭NAS应用场景：
├── 家庭相册备份（手机照片自动同步）
├── 影音中心（4K电影库）
├── 文件共享（跨设备访问）
├── 下载中心（BT/PT下载）
├── 文档同步（类似百度云）
├── 监控存储（NVR录像）
└── 开发测试（Docker/虚拟机）
```

---

## NAS系统对比

### 主流NAS系统

| 系统 | 类型 | 特点 | 适用人群 |
|------|------|------|----------|
| **Synology DSM** | 商业 | 生态最完善，易用 | 家用首选 |
| **QNAP QTS** | 商业 | 硬件强，功能多 | 进阶用户 |
| **TrueNAS CORE** | 开源 | ZFS文件系统 | 技术用户 |
| **TrueNAS SCALE** | 开源 | Debian基础，Docker | 技术用户 |
| **UnRAID** | 商业 | 灵活扩容，校验盘 | 影音爱好者 |
| **飞牛OS** | 国产 | 中文好，新兴 | 国内用户 |
| **OpenMediaVault** | 开源 | 轻量，Debian | 老设备 |

### 系统选择建议

```
选择建议：
├── 追求省心好用 → 群晖Synology
├── 追求硬件性能 → 威联通QNAP
├── 追求数据安全 → TrueNAS (ZFS)
├── 追求灵活扩展 → UnRAID
├── 追求免费开源 → TrueNAS/OpenMediaVault
└── 尝鲜体验 → 飞牛OS
```

### 文件系统对比

| 文件系统 | 特点 | 推荐场景 |
|----------|------|----------|
| **Btrfs** | 快照、校验、压缩 | 群晖默认 |
| **ZFS** | 最强数据保护 | TrueNAS |
| **EXT4** | 稳定通用 | Linux通用 |
| **XFS** | 大文件性能 | 大文件存储 |
| **ReFS** | Windows专用 | Windows Server |

---

## 硬件选购指南

### 品牌NAS推荐

#### 入门级（2盘位）

| 型号 | CPU | 内存 | 价格 | 特点 |
|------|-----|------|------|------|
| **群晖 DS224+** | J4125 | 2GB | ¥2500 | 入门首选 |
| **群晖 DS223** | RTD1619B | 2GB | ¥1800 |  ARM省电 |
| **威联通 TS-233** | ARM | 2GB | ¥1500 | 性价比高 |

#### 家用主流（4盘位）

| 型号 | CPU | 内存 | 价格 | 特点 |
|------|-----|------|------|------|
| **群晖 DS423+** | J4125 | 2GB | ¥3500 | 均衡之选 |
| **群晖 DS923+** | AMD R1600 | 4GB | ¥4200 | 可扩万兆 |
| **威联通 TS-464C2** | N5095 | 8GB | ¥2800 | 性价比 |
| **绿联 DXP4800** | N100 | 8GB | ¥2400 | 国产新锐 |
| **极空间 Z4Pro** | N97 | 8GB | ¥2800 | 易用性强 |

#### 高端机型（6-8盘位）

| 型号 | CPU | 内存 | 价格 | 特点 |
|------|-----|------|------|------|
| **群晖 DS1821+** | AMD V1500B | 4GB | ¥7000 | 8盘位扩展 |
| **威联通 TS-664** | N5105 | 4GB | ¥4500 | 6盘位 |
| **群晖 DS923+** | AMD R1600 | 4GB | ¥4200 | 可扩万兆 |

### DIY硬件配置

#### 入门级DIY（1500-2500元）

| 组件 | 推荐配置 | 价格 |
|------|----------|------|
| **CPU** | J4125 / N5105 | ¥400 |
| **主板** | 集成主板 | 含CPU |
| **内存** | 8GB DDR4 | ¥150 |
| **机箱** | 4盘位NAS机箱 | ¥400 |
| **电源** | 150W小1U | ¥200 |
| **系统盘** | 128GB SSD | ¥100 |
| **硬盘** | 4TB × 2 | ¥800 |

#### 进阶级DIY（3000-5000元）

| 组件 | 推荐配置 | 价格 |
|------|----------|------|
| **CPU** | N100 / i3-N305 | ¥600-1000 |
| **主板** | ITX主板 | ¥600 |
| **内存** | 16GB DDR4/5 | ¥300 |
| **机箱** | 6-8盘位 | ¥600 |
| **电源** | 300W金牌 | ¥300 |
| **系统盘** | 256GB NVMe | ¥200 |
| **缓存** | 256GB NVMe × 2 | ¥400 |

#### 高端DIY（5000元+）

| 组件 | 推荐配置 | 价格 |
|------|----------|------|
| **CPU** | i5-12400 / R5 5600G | ¥1000+ |
| **主板** | B660 ITX | ¥800 |
| **内存** | 32GB DDR4 | ¥600 |
| **机箱** | 8盘位+ | ¥800 |
| **电源** | 400W | ¥400 |
| **网卡** | 万兆网卡 | ¥500 |

### 硬盘推荐

#### 机械硬盘

| 用途 | 推荐型号 | 容量 | 价格(参考) |
|------|----------|------|------------|
| **家用** | 希捷酷狼 | 4TB | ¥650 |
| **家用** | 西数红盘Plus | 4TB | ¥680 |
| **专业** | 希捷酷狼Pro | 8TB | ¥1800 |
| **企业** | 西数HC320 | 8TB | ¥1200 |

#### SSD用途

| 用途 | 推荐 | 容量 |
|------|------|------|
| **系统盘** | 任意SATA SSD | 128-256GB |
| **缓存盘** | NVMe SSD | 256-512GB |
| **Metadata** | NVMe SSD | 256GB |

---

## DIY NAS组装

### 硬件组装步骤

```
组装流程：
1. 安装CPU（如果是散片）
2. 安装内存
3. 安装系统盘M.2 SSD
4. 安装主板到机箱
5. 连接电源线
6. 安装硬盘到硬盘架
7. 连接硬盘数据线和电源线
8. 检查线路，通电测试
```

### 装机注意事项

1. **散热**: 小机箱注意散热，可加风扇
2. **电源**: NAS长期运行，选择可靠电源
3. **硬盘**: 使用NAS专用硬盘，更稳定
4. **静音**: 选择静音风扇，降低噪音

---

## 系统安装与配置

### TrueNAS SCALE安装

#### 1. 制作启动盘

```bash
# 下载ISO
download.truenas.com

# 使用Rufus或balenaEtcher写入U盘
```

#### 2. 安装系统

```
步骤：
1. U盘启动
2. Install/Upgrade
3. 选择系统盘（不要选数据盘）
4. 设置密码
5. 等待安装完成
6. 重启，拔下U盘
```

#### 3. 初始配置

```
Web访问: http://NAS_IP
默认账号: admin
密码: 安装时设置的

配置步骤：
1. 设置系统名称
2. 配置网络（静态IP）
3. 创建存储池
4. 创建用户和共享
```

#### 4. 创建存储池

```
存储 → 创建池：
├── 选择硬盘
├── 选择RAID类型：
│   ├── Stripe: 无冗余，容量最大
│   ├── Mirror: 镜像，50%利用率
│   ├── RAIDZ1: 1块冗余，n-1容量
│   ├── RAIDZ2: 2块冗余，n-2容量
│   └── RAIDZ3: 3块冗余，n-3容量
└── 创建
```

### 群晖DSM配置

#### 1. 初始化

```
1. 连接网线，开机
2. 使用Synology Assistant查找NAS
3. 浏览器访问找到的IP
4. 安装DSM系统
5. 设置管理员账号
```

#### 2. 创建存储池

```
存储管理器 → 存储池 → 创建：
├── RAID类型：
│   ├── SHR: 群晖专用，推荐
│   ├── RAID1: 2盘镜像
│   ├── RAID5: 3盘+，1冗余
│   └── RAID6: 4盘+，2冗余
└── 选择硬盘创建
```

#### 3. 创建共享文件夹

```
控制面板 → 共享文件夹 → 创建：
├── 名称: Photos/Movies/Documents
├── 位置: 选择存储池
├── 配额: 可设置限制
└── 权限: 设置用户访问权限
```

---

## 常用应用部署

### 影音媒体服务器

#### Jellyfin（免费开源）

```bash
# Docker部署
docker run -d \
  --name jellyfin \
  --net=host \
  --volume /path/to/config:/config \
  --volume /path/to/media:/media \
  --restart=unless-stopped \
  jellyfin/jellyfin:latest
```

**特点**:
- 完全免费
- 硬件转码
- 多平台客户端

#### Plex

```bash
# Docker部署
docker run -d \
  --name plex \
  --net=host \
  -e PUID=1000 \
  -e PGID=1000 \
  -v /path/to/config:/config \
  -v /path/to/media:/media \
  plexinc/pms-docker
```

**特点**:
- 界面美观
- 刮削能力强
- 部分功能付费

### 文件同步

#### Syncthing

```bash
# Docker部署
docker run -d \
  --name syncthing \
  -p 8384:8384 \
  -p 22000:22000 \
  -v /path/to/config:/var/syncthing \
  -v /path/to/data:/var/syncthing/Sync \
  syncthing/syncthing
```

**用途**: 多设备文件同步，类似自建Dropbox

### 下载工具

#### qBittorrent

```bash
# Docker部署
docker run -d \
  --name qbittorrent \
  -e PUID=1000 \
  -e PGID=1000 \
  -p 8080:8080 \
  -p 6881:6881 \
  -p 6881:6881/udp \
  -v /path/to/config:/config \
  -v /path/to/downloads:/downloads \
  linuxserver/qbittorrent
```

#### Aria2 + AriaNg

```bash
# Docker Compose
version: '3'
services:
  aria2:
    image: p3terx/aria2-pro
    container_name: aria2
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - RPC_SECRET=your_secret
    volumes:
      - ./aria2-config:/config
      - ./downloads:/downloads
    ports:
      - 6800:6800
      - 6888:6888
      - 6888:6888/udp
    
  ariang:
    image: p3terx/ariang
    container_name: ariang
    restart: unless-stopped
    ports:
      - 6880:6880
```

### 相册管理

#### Immich

```bash
# Docker Compose
version: '3.8'
services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:release
    command: ['start.sh', 'immich']
    volumes:
      - ${UPLOAD_LOCATION}:/usr/src/app/upload
    env_file:
      - .env
    ports:
      - 2283:3001
    depends_on:
      - redis
      - database
    restart: always

  immich-microservices:
    container_name: immich_microservices
    image: ghcr.io/immich-app/immich-server:release
    command: ['start.sh', 'microservices']
    volumes:
      - ${UPLOAD_LOCATION}:/usr/src/app/upload
    env_file:
      - .env
    depends_on:
      - redis
      - database
    restart: always

  immich-machine-learning:
    container_name: immich_machine_learning
    image: ghcr.io/immich-app/immich-machine-learning:release
    volumes:
      - model-cache:/cache
    env_file:
      - .env
    restart: always

  redis:
    container_name: immich_redis
    image: redis:6.2-alpine
    restart: always

  database:
    container_name: immich_postgres
    image: tensorchord/pgvecto-rs:pg14-v0.2.0@sha256:90724186f0a3517cf6914295b5ab410db9ce23190a2d9d0b9dd6463e3fa298f0
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_DB: ${DB_DATABASE_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

volumes:
  pgdata:
  model-cache:
```

### 反向代理

#### Nginx Proxy Manager

```yaml
# docker-compose.yml
version: '3'
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: unless-stopped
    ports:
      - 80:80
      - 81:81
      - 443:443
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

**用途**: 管理所有服务的域名和SSL证书

---

## 数据备份策略

### 3-2-1备份原则

```
3: 3份数据副本
2: 2种不同存储介质
1: 1份异地备份

示例：
├── 主NAS（本地）- 主要存储
├── 外置硬盘（本地）- 定期备份
└── 云存储（异地）- 灾难恢复
```

### 备份方案

#### 本地备份

```
群晖Hyper Backup:
├── 备份到外置硬盘
├── 备份到另一台NAS
└── 版本控制

TrueNAS Replication:
├── 本地快照
├── 远程复制到另一台NAS
└── 云同步
```

#### 云端备份

| 服务商 | 价格 | 容量 |
|--------|------|------|
| **阿里云OSS** | ¥0.12/GB/月 | 无限制 |
| **腾讯云COS** | ¥0.118/GB/月 | 无限制 |
| **Backblaze B2** | $0.005/GB/月 | 无限制 |
| **Wasabi** | $6.99/TB/月 | 无限制 |

#### Docker备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/mnt/backup"
DATE=$(date +%Y%m%d)

# 备份配置
tar -czf $BACKUP_DIR/config-$DATE.tar.gz /path/to/configs

# 备份数据库
mysqldump -u root -p password database > $BACKUP_DIR/db-$DATE.sql

# 删除30天前的备份
find $BACKUP_DIR -type f -mtime +30 -delete

# 同步到云端
rclone sync $BACKUP_DIR remote:backup
```

### RAID不是备份

```
重要提醒：
├── RAID防止硬盘故障
├── RAID不防止误删除
├── RAID不防止勒索病毒
└── 必须有独立备份
```

---

## NAS性能优化

### 网络优化

```
1. 使用有线连接（千兆/2.5G/万兆）
2. 开启巨帧(Jumbo Frames)：MTU 9000
3. 链路聚合（多网口绑定）
4. SSD缓存加速
```

### 存储优化

```
TrueNAS ZFS优化：
├── 添加SSD作为L2ARC（读缓存）
├── 添加SSD作为ZIL/SLOG（写缓存）
└── 调整arc_max大小
```

### 节能设置

```
硬盘休眠：
├── 空闲10分钟休眠
├── 降低硬盘磨损
└── 节省电费

定时开关机：
└── 夜间不需要时关机
```

---

**最后更新**: 2026年2月
