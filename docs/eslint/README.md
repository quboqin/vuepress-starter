## ESLint的原理和配置
### ESLint的核心结构和逻辑
#### 一个规则的定义
除了官方定义的规则, 我们还可以通过`plugins`来定义新的规则, 通过以下这个`plugin`可以清楚看到引入一个`rule`只是这个规则的**定义**
```javascript
module.exports = {
  meta: {
    docs: {
      description: "disable console", // 规则描述
      category: "Possible Errors",    // 规则类别
      recommended: false
    },
    schema: [ // 接受一个参数
      {
        type: 'array', // 接受参数类型为数组
        items: {
          type: 'string' // 数组的每一项为一个字符串
        }
      }
    ]
  },

  create: function(context) {
    const logs = [ // console 的所有方法
        "debug", "error", "info", "log", "warn", 
        "dir", "dirxml", "table", "trace", 
        "group", "groupCollapsed", "groupEnd", 
        "clear", "count", "countReset", "assert", 
        "profile", "profileEnd", 
        "time", "timeLog", "timeEnd", "timeStamp", 
        "context", "memory"
    ]
    return {
      CallExpression(node) {
         // 接受的参数
        const allowLogs = context.options[0]
        const disableLogs = Array.isArray(allowLogs)
          // 过滤掉允许调用的方法
          ? logs.filter(log => !allowLogs.includes(log))
          : logs
        const callObj = node.callee.object
        const callProp = node.callee.property
        if (!callObj || !callProp) {
          return
        }
        if (callObj.name !== 'console') {
          return
        }
        // 检测掉不允许调用的 console 方法
        if (disableLogs.includes(callProp.name)) {
          context.report({
            node,
            message: 'error: should remove console'
          })
        }
      },
    }
  }
}
```
`plugin`只是在遍历`AST语法树`的过程中, 根据触发条件, 通过`context.report`, 告诉`ESLint`这是一段有问题的代码，具体要怎么处理，就要看`ESLint`配置(`config`)中，该条规则是 [off, warn, error] 中的哪一个了, 下面就是这条规则的`配置`
```javascript
// eslintrc.js
module.exports = {
  plugins: [ 'demo' ],
  rules: {
    'demo/disable-console': [
      'error', [ 'info' ]
    ],
  }
}
```

#### 插件
虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。

这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 eslint-plugin- 开头，使用的时候也可以省略这个头。

```shell
npm install --save-dev eslint-plugin-vue eslint-plugin-react
```

```json
{
  "plugins": [
    "react", // eslint-plugin-react
    "vue",   // eslint-plugin-vue
  ]
}
```
通过`plugins`只是加载了`规则的定义`, 还是需要在`rules`通过配置来打开这条规则(规则默认是关闭的)

> **prettier也是eslint的一个插件**
```json
{
  "extends": ["eslint:recommended", "prettier"],
  "env": {
    "es6": true,
    "node": true
  },
  "rules": {
    "prettier/prettier": "error"
  },
  "plugins": [
    "prettier"
  ]
}

作者：江米小枣tonylua
链接：https://juejin.cn/post/6971783776221265927
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

#### 带配置的插件
大部分插件也提供了推荐的配置
```json
{
  "extends": [
    "plugin:react/recommended",
  ]
}
```
通过扩展的方式加载插件的规则如下：
```javascript
extPlugin = `plugin:${pluginName}/${configName}`
```

#### 自定义的配置
如果我们加载了官方或主流的`plugin`, 我们也可以定义自己的配置
以`eslint-config-`开头，使用时可以省略这个头，下面案例中`eslint-config-standard`可以直接简写成`standard`

#### 扩展
扩展就是把`官方`, `插件`, `配置`一期加载的地方
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard",
  ]
}
```

### 几个关键的设置
#### vscode的设置
1. 安装VSCode的插件(Extensions)
- `ESLint`
- `Prettier`
- `Volar` for Vue
VSCode的Extension, 我的理解只是提供监听编辑器的事件, 提供配置信息, 最后还是调用安装在项目中的`eslint`和`prettier`命令, 所以后面还要通过`npm`安装

2. 配置vscode的workspace
```json
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },  
```

#### 工程文件中的设置
1. 通过`npm`安装`eslint`和`prettier`
```shell
npm install eslint prettier -D
```

2. 安装插件和配置

3. 提供配置文件
- .eslintrc.cjs from vue project
```javascript
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
```

- .eslintrc.cjs from nuxt project
```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'prettier/prettier': 'error'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
```

- .eslintrc.js from nocodb project
```javascript
const baseRules = {
  'vue/no-setup-props-destructure': 0,
  'no-console': 0,
  'antfu/if-newline': 0,
  'no-unused-vars': 0,
  '@typescript-eslint/no-this-alias': 0,
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
  ],
  'prettier/prettier': ['error', {}, { usePrettierrc: true }],
}

module.exports = {
  extends: ['@antfu', 'plugin:prettier/recommended'],
  rules: baseRules,
  ignorePatterns: ['!*.d.ts', 'components.d.ts'],
}
```

- .prettierrc.json
```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none"
}
```

### How to debug
在搭建新的工程安装插件和配置中, 往往不会work, 我们如何来debug安装和配置的问题呢? 我们可以通过命令行来定位问题
```json
"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
```
### Lint的历史
> 在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。 -- by wikipedia

![Javascript Lint的历史](https://raw.githubusercontent.com/quboqin/images/main/blogs/pictures20230903151156.png)
### 参考
[深入理解 ESLint](https://zhuanlan.zhihu.com/p/75531199)
