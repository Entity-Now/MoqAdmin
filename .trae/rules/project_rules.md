# MoqAdmin 项目技术架构文档

## 1. 项目整体架构

MoqAdmin 是一个完整的 Web 应用解决方案，采用前后端分离架构，包含三个主要组件：

- **admin**：基于 Vue 3 + TypeScript + Vite 的后台管理系统
- **nuxtjs**：基于 Vue 3 + Nuxt 3 的前台用户界面
- **server**：基于 Python 3.10 + FastAPI + Tortoise ORM 的后端服务

### 技术栈与依赖环境

| 技术/环境     | 版本要求    | 用途                     | 项目位置                 |
|--------------|------------|--------------------------|-------------------------|
| Python       | >= 3.10    | 后端开发语言              | server/                 |
| Node.js      | >= 20.\*   | 前端开发环境              | admin/, nuxtjs/         |
| Vue 3        | -          | 前端框架                  | admin/, nuxtjs/         |
| TypeScript   | -          | 类型安全语言              | admin/, nuxtjs/         |
| FastAPI      | -          | 高性能后端Web框架         | server/                 |
| Tortoise ORM | -          | 异步ORM框架              | server/                 |
| Pinia        | -          | 状态管理                 | admin/, nuxtjs/         |
| Element Plus | -          | UI组件库                 | admin/, nuxtjs/         |
| Vite         | -          | 前端构建工具              | admin/                  |
| Nuxt 3       | -          | 服务端渲染框架            | nuxtjs/                 |
| Tailwind CSS | -          | CSS框架                  | admin/, nuxtjs/         |
| MySQL        | >= 5.7     | 数据库                   | -                       |
| Redis        | -          | 缓存服务                 | -                       |

### 目录结构

```
├── admin/                  # Vue 3 后台管理项目
├── nuxtjs/                 # Vue 3 + Nuxt 3 前台项目
├── server/                 # Python 后端项目
├── .gitignore              # Git 忽略文件
├── LICENSE                 # 许可证文件
├── nginx.conf              # Nginx 配置文件
├── README.md               # 项目简介
└── TECHNICAL_ARCHITECTURE.md  # 技术架构文档
```

## 2. Server (Python项目)

Server 项目是基于 FastAPI 的高性能后端服务，提供完整的 RESTful API 接口，采用 MVC 架构设计。

### 核心模块结构

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
│   │   │   └── ...
│   ├── common/                 # 公共目录
│   │   ├── enums/              # 枚举目录
│   │   ├── models/             # 模型目录
│   │   ├── utils/              # 工具目录
│   │   └── ...
│   ├── kernels/                # 核心逻辑
│   ├── plugins/                # 插件目录
│   ├── public/                 # 公开目录
│   ├── sql/                    # 安装 SQL
│   ├── config.py               # 全局配置
│   ├── events.py               # 事件管理
│   ├── exception.py            # 异常管理
│   ├── hypertext.py            # HTTP 管理
│   ├── manager.py              # 启动文件
│   ├── middleware.py           # 全局中间件
│   └── requirement.txt         # 依赖包
```

### 主要模块说明

#### 2.1 路由系统 (Routers)

Server 项目采用 FastAPI 的 APIRouter 进行路由管理，支持模块化路由注册。每个业务模块（如友情链接、软件、商品分类等）都有独立的 router.py 文件，提供标准的 CRUD 接口。

路由定义示例：
```python
router = APIRouter(prefix="路由前缀", tags=["描述标签"])

@router.get("/list", summary="获取列表")
async def get_list(params: RequestParams):
    # 实现获取列表的逻辑
    pass

@router.post("/create", summary="创建数据")
async def create_data(data: CreateSchema):
    # 实现创建数据的逻辑
    pass
```

路由配置项位于 `server/config.py` 文件，主要包括：
- `ROUTER_ALIAS`: 模块别名配置
- `ROUTER_REMARK`: 模块描述配置
- `ROUTER_STYLES`: 路由风格配置
- `ROUTER_PREFIX`: 是否自动补全目录前缀

#### 2.2 数据模型 (Models)

使用 Tortoise ORM 定义数据模型，实现与数据库的交互。模型文件位于 `server/common/models/` 目录下，每个业务模块对应一个模型文件。

#### 2.3 数据验证 (Schemas)

使用 Pydantic 进行数据验证和序列化，定义请求和响应数据的结构。Schema 文件位于 `apps/*/schemas/` 目录下，实现数据校验规则和数据转换。

#### 2.4 业务逻辑 (Services)

服务层实现核心业务逻辑，包括数据查询、分页处理、事务控制等。服务文件位于 `apps/*/service/` 目录下，每个业务模块对应一个服务文件。

### 常用工具类/函数

Server 项目提供了丰富的工具类和函数，位于 `server/common/utils/` 目录下：

#### 2.5 ToolsUtil 工具类

`server/common/utils/tools.py` 定义了 `ToolsUtil` 类，提供以下核心功能：

- UUID 生成：生成唯一标识符
- Token 创建：创建访问令牌
- UA 解析：解析用户代理字符串
- 数据加密/解密：提供加密解密功能
- 日期时间处理：日期时间格式化和计算
- 文件处理：文件上传、下载、处理

#### 2.6 URL 工具函数

`server/common/utils/urls.py` 提供 URL 转换工具方法，处理相对 URL 和绝对 URL 之间的转换逻辑。

#### 2.7 代码生成器

项目包含代码生成器 `RouterGenerator.py`，用于根据模板自动生成路由代码，提高开发效率。生成的文件默认输出到 `../server/apps/admin/routers` 目录。

### 开发与运行

```bash
# 安装依赖
pip install -r requirement.txt

# 复制环境配置
cp .example.env .env

# 启动服务
python manager.py
```

## 3. Admin (Vue 3后台项目)

Admin 项目是基于 Vue 3 + TypeScript + Vite 的现代化后台管理系统，提供完整的管理功能界面。

### 核心模块结构

```
├── admin/
│   ├── src/
│   │   ├── api/                 # 接口目录
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 全局组件
│   │   ├── config/              # 配置相关
│   │   ├── enums/               # 全局枚举
│   │   ├── hooks/               # 全局 Hook
│   │   ├── install/             # 插件安装
│   │   ├── layout/              # 布局组件
│   │   ├── router/              # 路由
│   │   ├── stores/              # 全局状态管理
│   │   ├── styles/              # 全局样式
│   │   ├── utils/               # 全局公用方法
│   │   ├── views/               # 所有页面
│   │   ├── App.vue              # 入口页面
│   │   ├── main.ts              # 入口文件
│   │   └── permission.ts        # 路由拦截
```

### 常用 Hooks 说明

Admin 项目提供了多个实用的 Hooks 函数，位于 `src/hooks/` 目录下：

#### 3.1 usePaging Hook

`src/hooks/usePaging.ts` 提供分页数据请求的通用钩子：

**功能**：处理分页数据的加载、刷新、重置等操作
**参数**：
- `page`: 当前页码
- `size`: 每页条数
- `params`: 查询参数
- `fetchFun`: 数据获取函数
- `firstLoading`: 是否初始加载

**返回值**：
- `pager`: 分页数据对象
- `queryLists`: 查询列表方法
- `resetParams`: 重置参数方法
- `resetPaging`: 重置分页方法

#### 3.2 useLockFn Hook

`src/hooks/useLockFn.ts` 提供函数防抖/锁定功能：

**功能**：防止函数重复调用，适用于表单提交等场景
**参数**：
- `fn`: 需要锁定的异步函数

**返回值**：
- `isLock`: 锁定状态
- `lockFn`: 包装后的锁定函数

#### 3.3 useDictOptions Hook

`src/hooks/useOption.ts` 提供字典选项数据加载功能：

**功能**：批量加载字典数据，支持数据转换
**参数**：
- `options`: 包含 API、参数、转换函数的配置对象

**返回值**：
- `optionsData`: 加载的选项数据
- `refresh`: 刷新数据方法

### Stores 状态管理

Admin 项目使用 Pinia 进行状态管理，位于 `src/stores/` 目录下：

#### 3.4 用户状态管理 (user store)

`src/stores/modules/user.ts` 管理用户相关状态：

**功能**：管理用户登录、退出、信息获取等功能
**主要状态**：
- `token`: 用户令牌
- `users`: 用户信息
- `perms`: 用户权限
- `routes`: 用户路由

**主要方法**：
- `login()`: 登录系统
- `logout()`: 退出系统
- `getUserInfo()`: 获取用户信息
- `resetState()`: 重置状态

#### 3.5 标签页管理 (tabs store)

管理后台界面的标签页状态，支持标签页的添加、删除、切换等功能。

#### 3.6 应用状态管理 (app store)

管理应用级别的状态，如全局配置、菜单伸缩状态等。

### Install 插件安装

Admin 项目通过 `src/install/` 目录管理插件和指令的安装：

#### 3.7 插件安装机制

`src/install/index.ts` 实现了自动扫描和安装插件的机制：

- 自动扫描 `./**/*` 目录下的模块
- 根据模块类型（directives/plugins）进行不同方式的安装
- 插件通过 `app.use()` 安装，指令通过 `app.directive()` 注册

#### 3.8 Element Plus 插件

`src/install/plugins/element.ts` 负责 Element Plus 组件库的安装，包括所有图标组件的注册。

#### 3.9 权限控制指令

`src/install/directives/perms.ts` 实现了基于用户权限的元素显示控制指令，根据用户权限动态控制页面元素的显示或隐藏。

### 开发与构建

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

## 4. Nuxtjs (Vue 3前台项目)

Nuxtjs 项目是基于 Vue 3 + Nuxt 3 的前台用户界面，提供面向用户的交互功能。

### 核心模块结构

```
├── nuxtjs/
│   ├── app.vue                # 应用入口组件
│   ├── pages/                 # 页面组件（基于文件系统路由）
│   ├── components/            # 可复用组件
│   ├── layouts/               # 布局组件
│   ├── api/                   # API 请求
│   ├── stores/                # Pinia 状态管理
│   ├── assets/                # 静态资源
│   ├── utils/                 # 工具函数
```

### 主要模块说明

#### 4.1 状态管理 (Stores)

Nuxtjs 项目使用 Pinia 进行状态管理，类似于 Admin 项目：

- `stores/app.ts`: 应用级状态管理，包含全局配置获取、弹窗控制等功能
- 支持模块化的状态管理结构

#### 4.2 HTTP 请求

`nuxtjs/utils/http/index.ts` 实现了 HTTP 请求拦截器：

- 处理 API 前缀设置
- 自动添加 Token 认证
- 管理加载状态显示
- 统一错误处理

#### 4.3 工具函数

`nuxtjs/utils/tools.ts` 提供常用工具函数：

- `isEmpty()`: 判断值是否为空
- `objectToQuery()`: 将对象转换为查询字符串

### 主要功能模块

- 用户注册/登录
- 文章浏览与搜索
- 商品展示与购买
- 用户中心管理
- 响应式设计适配

### 开发与构建

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

## 5. 部署架构

项目推荐的部署架构如下：

1. 使用 Nginx 作为反向代理服务器
2. `admin` 和 `nuxtjs` 项目构建后作为静态文件部署
3. `server` 项目使用 Gunicorn 或 Uvicorn 运行 FastAPI 应用
4. 配置 SSL 证书实现 HTTPS 访问

项目根目录下提供了 `nginx.conf` 配置文件，可作为部署时的 Nginx 配置参考。

## 6. 环境变量配置

各项目通过 `.env` 文件配置环境变量：

- `admin/.env`: 后台管理系统环境配置
- `nuxtjs/.env`: 前台系统环境配置（参考 `nuxtjs/.env.template`）
- `server/.env`: 后端服务环境配置（参考 `server/.example.env`）

## 7. API 文档

FastAPI 自动生成 Swagger UI 接口文档，可通过 `http://服务器地址/docs` 访问，方便前后端协作开发。

## 8. 开发注意事项

1. **代码风格**：各项目配置了 ESLint 和 StyleLint，确保代码质量和一致性
2. **类型安全**：`admin` 和 `nuxtjs` 项目使用 TypeScript 保证类型安全
3. **路由自动注册**：遵循命名约定，路由会自动注册到应用中
4. **权限控制**：基于 RBAC 模型实现细粒度的权限控制

本技术架构文档基于项目实际代码分析整理，确保内容的准确性和完整性。