# 编译OpenWRT

## OpenWRT历史
![The History of OpenWRT](./openwrt.png)

## OpenWRT目录结构

## menuconfig的配置

## OpenWRT在本地Linux下编译

### 编译Lienol源

### 编译Lean源
``` bash
sudo apt-get update
sudo apt-get -y install build-essential asciidoc binutils bzip2 gawk gettext git libncurses5-dev libz-dev patch python3 python2.7 unzip zlib1g-dev lib32gcc1 libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev autoconf automake libtool autopoint device-tree-compiler g++-multilib antlr3 gperf wget curl swig rsync
```

git clone https://github.com/coolsnowwolf/lede.git lean

编辑feeds.conf.default
```
#src-git helloworld https://github.com/fw876/helloworld
src-git lienol https://github.com/kenzok8/openwrt-packages
src-git small https://github.com/kenzok8/small.git
```

```
./scripts/feeds update -a
./scripts/feeds install -a
make menuconfig
```

```
make -j8 download V=s
find dl -size -1024c -exec ls -l {} \;
make -j1 V=s
```

## 使用Github Action编译OpenWRT

## 