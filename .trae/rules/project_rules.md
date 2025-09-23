# MoqAdmin 项目说明文档

## 项目概述
MoqAdmin是一个完整的Web应用解决方案，包含三个主要组件：
- **admin**：基于Vue 3 + TypeScript + Vite的后台管理系统
- **nuxtjs**：基于Vue 3 + Nuxt 3的前台用户界面
- **server**：基于Python（Python 3.10） + FastAPI + Tortoise ORM的后端服务
## 目录结构
```
├── admin/           # Vue3后台管理项目
├── nuxtjs/          # Vue3+Nuxt3前台项目
├── server/          # Python后端项目
├── .gitignore
├── LICENSE
├── nginx.conf       # Nginx配置文件
├── README.md
└── project_readme.md # 项目详细说明文档
```

## 各项目详细介绍

### 1. admin - 后台管理系统
基于Vue 3 + TypeScript + Vite构建的现代化后台管理系统，提供完整的管理功能界面。

**技术栈：**
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- ECharts
- WangEditor

**主要功能模块：**
- 用户管理
- 权限控制
- 数据可视化
- 内容管理
- 系统配置

**核心文件结构：**
- `src/App.vue` - 应用入口组件
- `src/main.ts` - 应用初始化
- `src/router/` - 路由配置
- `src/stores/` - Pinia状态管理
- `src/views/` - 页面组件
- `src/components/` - 通用组件
- `src/api/` - API请求封装

**开发与构建：**
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 2. nuxtjs - 前台用户系统
基于Vue 3 + Nuxt 3构建的前台用户界面，提供面向用户的交互功能。

**技术栈：**
- Vue 3
- Nuxt 3
- TypeScript
- Tailwind CSS
- Element Plus
- Pinia
- Font Awesome

**主要功能模块：**
- 用户注册/登录
- 文章浏览
- 支付系统
- 用户中心
- 响应式设计

**核心文件结构：**
- `app.vue` - 应用入口组件
- `pages/` - 页面组件（基于文件系统的路由）
- `components/` - 可复用组件
- `layouts/` - 布局组件
- `api/` - API请求
- `stores/` - Pinia状态管理
- `assets/` - 静态资源

**开发与构建：**
```bash
# 安装依赖
npm install
# 或
pnpm install
# 或
yarn install

# 开发模式
npm run dev

# 构建SSR版本
npm run build:ssr

# 构建生成静态文件
npm run build:gen

# 预览
npm run preview
```

### 3. server - 后端服务
基于Python + FastAPI构建的高性能后端服务，提供前后端分离架构中的API接口。

**技术栈：**
- Python
- FastAPI
- Tortoise ORM
- AsyncPG/aiomysql (异步数据库)
- Redis (缓存)
- APScheduler (定时任务)

**主要功能模块：**
- 用户认证与授权
- 内容管理
- 支付集成
- 通知服务（邮件/短信）
- 文件存储服务
- 微信/支付宝集成

**核心文件结构：**
```
├─📂 apps                 // 应用目录
│  ├─📂 admin             // 后台应用
│  ├─📂 api               // 前台应用
├─📂 common              // 公共目录
├─📂 kernels             // 核心逻辑
├─📂 plugins             // 插件目录
├─📂 public              // 公开目录
├─📂 sql                 // 安装SQL
├─📄 manager.py          // 启动文件
├─📄 config.py           // 全局配置
└─📄 requirement.txt     // 依赖包
```

**主要依赖：**
- fastapi - 高性能Web框架
- tortoise-orm - 异步ORM框架
- aiosmtplib, aiofiles - 异步文件和邮件处理
- asyncpg, aiomysql, aioredis - 异步数据库客户端
- oss2, qiniu, cos-python-sdk-v5 - 云存储SDK
- alipay-sdk, wechatpayv3 - 支付SDK
- APScheduler - 定时任务调度

**开发与运行：**
```bash
# 安装依赖
pip install -r requirement.txt

# 复制环境配置
cp .example.env .env

# 启动服务
python manager.py
```

## 项目部署
项目包含nginx.conf配置文件，可以用于部署时的Nginx配置参考。

### 部署架构建议
1. 使用Nginx作为反向代理服务器
2. admin和nuxtjs项目构建后作为静态文件部署
3. server项目使用Gunicorn或Uvicorn运行FastAPI应用
4. 配置SSL证书实现HTTPS访问

## 环境变量配置
各项目均支持通过.env文件配置环境变量：
- admin/.env - 后台管理系统环境配置
- nuxtjs/.env - 前台系统环境配置（可参考.env.template）
- server/.env - 后端服务环境配置（可参考.example.env）

## 数据库配置
后端服务支持多种数据库，配置位于server/.env文件中。默认支持：
- PostgreSQL (通过asyncpg)
- MySQL (通过aiomysql)
- Redis (缓存，通过aioredis)

## 开发注意事项
1. **代码风格**：各项目均配置了ESLint和StyleLint，确保代码质量和一致性
2. **类型安全**：admin和nuxtjs项目使用TypeScript保证类型安全
3. **API文档**：FastAPI自动生成Swagger UI接口文档，可通过http://服务器地址/docs访问
4. **版本控制**：遵循Git工作流，合理使用.gitignore文件

---

## 后端页面开发文件说明模板

请根据以下结构，详细说明一个后端功能模块的实现文件及各文件职责：

### 服务器端文件
1. 数据模型定义 - `server/common/models/[模块名].py`
   - 定义数据库表结构及字段属性
   - 实现表之间的关联关系（如外键,但是不要使用关系，会影响其他表的结构）
   - 包含必要的模型方法（如数据验证、格式化等）

2. 数据验证与序列化 - `server/common/schemas/[模块名]_schema.py`
   - 定义请求参数与响应数据的结构规范
   - 实现数据校验规则（如类型、长度、格式验证）
   - 提供数据序列化/反序列化方法

3. 业务逻辑处理 - `server/common/services/[模块名]_service.py`
   - 实现核心业务逻辑（列表查询、详情获取、新增、编辑、删除等）
   - 处理数据校验、事务控制及异常捕获
   - 封装与数据模型的交互细节

4. 接口路由配置 - `server/common/routers/[模块名]_router.py`
   - 定义所有API接口的路由地址、请求方法
   - 绑定接口与对应的业务逻辑处理函数
   - 配置接口权限、请求参数解析及响应格式化

### 前端管理系统文件
1. API交互封装 - `src/api/[模块名].ts`
   - 封装与后端接口对应的调用方法
   - 处理请求参数格式化、响应数据转换
   - 统一管理请求头、错误处理及状态提示

2. 列表页面 - `src/views/[模块名]/index.vue`
   - 实现数据列表展示（表格/卡片形式）
   - 提供搜索、筛选、排序等数据过滤功能
   - 包含新增、编辑、删除等操作入口及交互逻辑

3. 编辑页面 - `src/views/[模块名]/editor.vue`
   - 实现新增/编辑表单的展示与验证
   - 处理表单提交、数据回显及操作结果反馈
   - 包含取消、保存等操作按钮及对应的逻辑处理