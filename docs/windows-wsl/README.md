# Setup the development env under Windows WSL

## 开启Windows 10下的WSL2
[Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
### Enable the Windows Subsystem for Linux
``` PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```
### Enable Virtual Machine feature
``` PowerShell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
### 更新到WSL2
To update to WSL 2, you must be running Windows 10.
Download the Linux kernel update package[WSL2 Linux kernel update package for x64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

### Set WSL 2 as your default version
``` PowerShell
wsl --set-default-version 2
``` 
### 下载Ubuntu发行包
### 安装Windows Terminal
### 进入Ubuntu，安装zsh和oh-my-zsh
``` bash
cat /etc/shells
```
``` bash
sudo apt-get update
sudo apt-get install zsh
chsh -s /bin/zsh
```
重启WSL

``` bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### 修改.zshrc的新主题
``` zsh
vi ~/.zshrc
```
修改
```
ZSH_THEME="agnoster"
```
``` zsh
source .zshrc
```
### 在Windows环境下安装Powerline字体
#### 在Windows下安装git
#### clone Powerline fonts
```
git clone https://github.com/powerline/fonts.git --depth=1
```
打开文件夹，有一个 ps1 的 powershell 文件以管理员打开就能自动安装字体
### 修改Windows Terminal配置
#### 修改默认的Shell
#### 修改字体
#### 修改启动路径
### 在Windows下安装VSCode
### 在Ubuntu中启动VSCode，并安装WSL扩展
### 修改VSCode的设置，终端支持Powerline字体
``` json
{
    "editor.tabSize": 2,
    "terminal.integrated.cursorBlinking": true,
    "terminal.integrated.fontFamily": "Meslo LG S for Powerline",
    "terminal.integrated.fontSize": 12,
}
```
