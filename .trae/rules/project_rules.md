# MoqAdmin 项目说明文档

## 项目概述

MoqAdmin 是一个完整的 Web 应用解决方案，包含以下三个主要组件：

-   **admin**：基于 Vue 3 + TypeScript + Vite 的后台管理系统
-   **nuxtjs**：基于 Vue 3 + Nuxt 3 的前台用户界面
-   **server**：基于 Python 3.10 + FastAPI + Tortoise ORM 的后端服务

## 目录结构

```
├── admin/                  # Vue 3 后台管理项目
├── nuxtjs/                 # Vue 3 + Nuxt 3 前台项目
├── server/                 # Python 后端项目
├── .gitignore              # Git 忽略文件
├── LICENSE                 # 许可证文件
├── nginx.conf              # Nginx 配置文件
├── README.md               # 项目简介
└── project_readme.md       # 项目详细说明文档
```

## 各项目详细介绍

### 1. admin - 后台管理系统

基于 Vue 3 + TypeScript + Vite 构建的现代化后台管理系统，提供完整的管理功能界面。

#### 技术架构

-   **后台端**：Vue 3 + TypeScript + Pinia + Element Plus
-   **前台端**：Nuxt 3 + TypeScript + Pinia + Element Plus
-   **接口端**：FastAPI + Pydantic + Tortoise ORM

#### 环境要求

| 运行环境 | 要求版本   | 推荐版本    |
| -------- | ---------- | ----------- |
| Python   | >= 3.10.\* | 3.10.\*     |
| MySQL    | >= 5.7     | 5.7         |
| Nginx    | 无限制     | 最新 LTS 版 |
| Node     | >= 20.\*   | 20.14.0     |

#### 主要功能模块

-   用户管理
-   权限控制
-   数据可视化
-   内容管理
-   系统配置

#### 主要特性

-   路由根据目录自动注册
-   采用 MVC 结构，易于上手
-   内置基于 RBAC 的权限管理功能
-   开箱即用，包含常用工具和组件

#### 核心文件结构

```
├── node_modules/                   # Node 依赖
├── public/                         # 公共目录
├── scripts/                        # JS 脚本
├── src/                            # 源代码
│   ├── api/                        # 接口目录
│   ├── assets/                     # 静态资源
│   ├── components/                 # 全局组件
│   ├── config/                     # 配置相关
│   ├── enums/                      # 全局枚举
│   ├── hooks/                      # 全局 Hook
│   ├── install/                    # 插件安装
│   ├── layout/                     # 布局组件
│   ├── router/                     # 路由
│   ├── stores/                     # 全局状态管理
│   ├── styles/                     # 全局样式
│   ├── utils/                      # 全局公用方法
│   ├── views/                      # 所有页面
│   ├── App.vue                     # 入口页面
│   ├── main.ts                     # 入口文件
│   └── permission.ts               # 路由拦截
├── typings/                        # TypeScript 声明文件
├── .env.xxx                        # 环境变量配置
├── .eslintrc.cjs                   # ESLint 配置
├── .stylelintrc.cjs                # StyleLint 配置
├── package.json                    # 项目依赖
├── postcss.config.js               # PostCSS 配置
├── tailwind.config.js              # Tailwind CSS 配置
├── tsconfig.json                   # TypeScript 配置
└── vite.config.ts                  # Vite 配置
```

#### 开发与构建

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

基于 Vue 3 + Nuxt 3 构建的前台用户界面，提供面向用户的交互功能。

#### 技术栈

-   Vue 3
-   Nuxt 3
-   TypeScript
-   Tailwind CSS
-   Element Plus
-   Pinia
-   Font Awesome

#### 主要功能模块

-   用户注册/登录
-   文章浏览
-   支付系统
-   用户中心
-   响应式设计

#### 核心文件结构

```
├── app.vue                # 应用入口组件
├── pages/                 # 页面组件（基于文件系统路由）
├── components/            # 可复用组件
├── layouts/               # 布局组件
├── api/                   # API 请求
├── stores/                # Pinia 状态管理
├── assets/                # 静态资源
```

#### 开发与构建

```bash
# 安装依赖
npm install
# 或
pnpm install
# 或
yarn install

# 开发模式
npm run dev

# 构建 SSR 版本
npm run build:ssr

# 构建生成静态文件
npm run build:gen

# 预览
npm run preview
```

### 3. server - 后端服务

基于 Python + FastAPI 构建的高性能后端服务，提供前后端分离架构中的 API 接口。

#### 技术栈

-   Python
-   FastAPI
-   Tortoise ORM
-   AsyncPG/aiomysql（异步数据库）
-   Redis（缓存）
-   APScheduler（定时任务）

#### 主要功能模块

-   用户认证与授权
-   内容管理
-   支付集成
-   通知服务（邮件/短信）
-   文件存储服务
-   微信/支付宝集成

#### 核心文件结构

```
├── server/
│   ├── apps/                   # 应用目录
│   │   ├── admin/              # 后台应用
│   │   │   ├── routers/        # 控制器
│   │   │   ├── schemas/        # 响应层
│   │   │   ├── service/        # 逻辑层
│   │   │   ├── config.py       # 配置
│   │   │   ├── interceptor.py  # 拦截器
│   │   │   └── middleware.py   # 中间件
│   │   ├── api/                # 前台应用
│   │   │   ├── routers/        # 控制器
│   │   │   ├── schemas/        # 响应层
│   │   │   ├── service/        # 逻辑层
│   │   │   ├── config.py       # 配置
│   │   │   ├── interceptor.py  # 拦截器
│   │   │   └── middleware.py   # 中间件
│   │   └── ...
│   ├── common/                 # 公共目录
│   │   ├── enums/              # 枚举目录
│   │   ├── models/             # 模型目录
│   │   ├── utils/              # 工具目录
│   │   └── ...
│   ├── kernels/                # 核心逻辑
│   │   ├── cache.py            # 缓存管理
│   │   ├── database.py         # 数据库管理
│   │   ├── events.py           # 事件管理
│   │   └── ...
│   ├── plugins/                # 插件目录
│   │   ├── mail/               # 邮件服务
│   │   ├── msg/                # 消息服务
│   │   ├── sms/                # 短信服务
│   │   ├── storage/            # 存储服务
│   │   ├── wechat/             # 微信服务
│   │   └── ...
│   ├── public/                 # 公开目录
│   │   ├── static/             # 静态文件目录
│   │   ├── storage/            # 资源存储目录
│   │   └── ...
│   ├── sql/                    # 安装 SQL
│   │   └── install.sql         # 数据库初始化脚本
│   ├── .env                    # 环境配置
│   ├── .example.env            # 配置模板
│   ├── .gitignore              # Git 配置
│   ├── config.py               # 全局配置
│   ├── events.py               # 事件管理
│   ├── exception.py            # 异常管理
│   ├── hypertext.py            # HTTP 管理
│   ├── manager.py              # 启动文件
│   ├── middleware.py           # 全局中间件
│   ├── README.md               # 后端说明文档
│   └── requirement.txt         # 依赖包
```

#### 主要依赖

-   `fastapi`：高性能 Web 框架
-   `tortoise-orm`：异步 ORM 框架
-   `aiosmtplib`, `aiofiles`：异步文件和邮件处理
-   `asyncpg`, `aiomysql`, `aioredis`：异步数据库客户端
-   `oss2`, `qiniu`, `cos-python-sdk-v5`：云存储 SDK
-   `alipay-sdk`, `wechatpayv3`：支付 SDK
-   `APScheduler`：定时任务调度

#### 开发与运行

```bash
# 安装依赖
pip install -r requirement.txt

# 复制环境配置
cp .example.env .env

# 启动服务
python manager.py
```

## 项目部署

项目包含 `nginx.conf` 配置文件，可用于部署时的 Nginx 配置参考。

### 部署架构建议

1. 使用 Nginx 作为反向代理服务器
2. `admin` 和 `nuxtjs` 项目构建后作为静态文件部署
3. `server` 项目使用 Gunicorn 或 Uvicorn 运行 FastAPI 应用
4. 配置 SSL 证书实现 HTTPS 访问

## 环境变量配置

各项目通过 `.env` 文件配置环境变量：

-   `admin/.env`：后台管理系统环境配置
-   `nuxtjs/.env`：前台系统环境配置（参考 `nuxtjs/.env.template`）
-   `server/.env`：后端服务环境配置（参考 `server/.example.env`）

## 数据库配置

后端服务支持多种数据库，配置位于 `server/.env` 文件，默认支持：

-   MySQL（通过 `aiomysql`）
-   Redis（缓存，通过 `aioredis`）

## 开发注意事项

1. **代码风格**：各项目配置了 ESLint 和 StyleLint，确保代码质量和一致性
2. **类型安全**：`admin` 和 `nuxtjs` 项目使用 TypeScript 保证类型安全
3. **API 文档**：FastAPI 自动生成 Swagger UI 接口文档，可通过 `http://服务器地址/docs` 访问
4. **版本控制**：遵循 Git 工作流，合理使用 `.gitignore` 文件

## 路由配置

为减少工作量，程序实现自动注册路由功能，但需遵循约定规则书写代码。具体可参考代码并保持原有代码风格。

### 路由规则

1. **变量名限制**：路由变量名必须为 `router`，不可使用其他名称。
    ```python
    router = APIRouter(prefix="路由前缀", tags=["描述标签"])
    ```
2. **前缀拼接**：`prefix` 会自动拼接到路径上，建议根据文件命名。

### 路由配置

路由配置位于 `server/config.py` 文件中：

| 名称          | 默认值                                     | 说明                           |
| ------------- | ------------------------------------------ | ------------------------------ |
| ROUTER_ALIAS  | `{"admin": "spi", "api": "api"}`           | 模块别名                       |
| ROUTER_REMARK | `{"admin": "后台接口", "api": "前台接口"}` | 模块描述，用于接口文档         |
| ROUTER_STYLES | `line`                                     | 路由风格，可选 `line` 或 `dot` |
| ROUTER_PREFIX | `True`                                     | 是否自动补全目录前缀           |

### 路由注册

使用 `Route` 类注册路由，需在路由定义文件开头创建实例：

```python
router = APIRouter(prefix="路由前缀", tags=["描述标签"])
```

## 后端页面开发文件说明模板

以下为后端功能模块的实现文件及职责说明模板：

### 服务器端文件

1. **数据模型定义** - `server/common/models/[模块名].py`

    - 定义数据库表结构及字段属性
    - 实现表之间的关联关系（避免使用外键，以免影响其他表结构）
    - 包含必要模型方法（如数据验证、格式化）

2. **数据验证与序列化** - `server/apps/api/schemas/[模块名]_schema.py`

    - 定义请求参数与响应数据的结构规范
    - 实现数据校验规则（类型、长度、格式验证）
    - 提供数据序列化/反序列化方法

3. **业务逻辑处理** - `server/apps/api/services/[模块名]_service.py`

    - 实现核心业务逻辑（列表查询、详情获取、新增、编辑、删除）
    - 处理数据校验、事务控制及异常捕获
    - 封装与数据模型的交互细节

4. **接口路由配置** - `server/apps/api/routers/[模块名]_router.py`
    - 定义 API 接口的路由地址、请求方法
    - 绑定接口与对应的业务逻辑处理函数
    - 配置接口权限、请求参数解析及响应格式化

### 前端管理系统文件

1. **API 交互封装** - `src/api/[模块名]/[模块名].ts`

    - 封装与后端接口对应的调用方法
    - 处理请求参数格式化、响应数据转换
    - 统一管理请求头、错误处理及状态提示

2. **列表页面** - `src/views/[模块名]/index.vue`

    - 实现数据列表展示（表格/卡片形式）
    - 提供搜索、筛选、排序等数据过滤功能
    - 包含新增、编辑、删除等操作入口及交互逻辑

3. **编辑页面** - `src/views/[模块名]/editor.vue`
    - 实现新增/编辑表单的展示与验证
    - 处理表单提交、数据回显及操作结果反馈
    - 包含取消、保存等操作按钮及对应的逻辑处理
