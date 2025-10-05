# Taro 4.x 商城小程序项目

一、项目介绍

本项目是基于 Taro 4.x 开发的跨端商城小程序，采用 React 框架和 NutUI 组件库，支持多端部署（微信小程序、H5、支付宝小程序等）。

二、技术栈

### 核心框架
- Taro ：4.1.7，开放式跨端跨框架解决方案
- React ：18.0.0，前端 JavaScript 库
- TypeScript ：5.1.0，类型安全的编程语言
- NutUI ：2.6.14，京东风格的轻量级移动端 UI 组件库
- nutui-biz: 1.0.0-beta.2 ，京东风格的轻量级移动端业务组件库

### 构建工具
- Vite ：4.2.0，现代前端构建工具
- Babel ：7.x，JavaScript 编译器
- Sass ：1.60.0，CSS 预处理器

三、项目结构

```Plaintext
miniprogram/
├── .editorconfig        # 编辑器配置
├── .eslintrc            # ESLint 配置
├── .gitignore           # Git 忽略规则
├── babel.config.js      # Babel 配置
├── config/              # Taro 配置目录
│   ├── dev.ts           # 开发环境配置
│   ├── index.ts         # 主配置文件
│   └── prod.ts          # 生产环境配置
├── package.json         # 项目依赖和脚本
├── pnpm-lock.yaml       # 依赖锁定文件
├── project.config.json  # 微信小程序项目配置
├── project.tt.json      # 字节跳动小程序项目配置
├── src/                 # 源代码目录
│   ├── app.config.ts    # 应用配置
│   ├── app.scss         # 全局样式
│   ├── app.ts           # 应用入口
│   ├── components/      # 公共组件
│   ├── index.html       # H5 入口 HTML
│   └── pages/           # 页面组件
├── tsconfig.json        # TypeScript 配置
└── types/               # 类型定义
    └── global.d.ts      # 全局类型声明
```