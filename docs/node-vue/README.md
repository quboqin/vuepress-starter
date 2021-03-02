# 安装Node.js和Vue开发环境
### 安装NVM和Node.js
install or update nvm
``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
install long term support version
``` bash
nvm install --lts
```
### 安装Vue-cli
``` bash
npm install -g @vue/cli
```
### 设置git和ssh
### 创建一个Vue3的程序
``` bash
vue create hello-world
```
![new-project](./cli-new-project.png)
### 在VSCode下安装lint，Vetur等扩展
在项目的根目录下添加`.vscode\settings.json`文件
``` json
{ 
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```
在项目的根目录下添加`.prettierrc.js`文件
``` javascript
module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}
```