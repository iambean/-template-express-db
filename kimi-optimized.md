# 请基于 ExpressJS 创建项目，严格遵守以下要求：

## 1. 项目初始化
- 初始化 Git 项目，创建一个名为 `master` 的主分支。
- 创建 `.gitignore` 文件，包含以下内容：
  - `node_modules`
  - `.DS_Store`
  - 所有敏感文件（如配置文件等）

## 2. 技术栈
- Node.js 版本：16+
- 主框架：ExpressJS 最新稳定版
- 语法：ES6，使用 ESM 管理模块

## 3. 配置
### 3.1 环境变量
- 使用 `dotenv` 管理环境变量。
- 支持三种环境：开发环境（`development`）、测试环境（`test`）、生产环境（`product`）。
- 每种环境的配置文件格式一致，但值可能不同。
- 配置文件为敏感信息，加入 `.gitignore`，并创建一个 `.env.example` 文件作为示例。

### 3.2 运行脚本
- 提供本地运行指定环境的脚本，例如：
  - `npm run start:dev`（开发环境）
  - `npm run start:test`（测试环境）
  - `npm run start:prod`（生产环境）

## 4. 中间件
- 数据验证：使用 `Joi` 处理 HTTP 数据验证。
- 错误处理：根据错误类型分配 HTTP 状态码：
  - `ValidationError` -> 400
  - `AuthenticationError` -> 401
  - `NotExistError` -> 404
- 日志系统：使用 `Morgan`。
- 跨域处理：使用 `Cors`。
- 安全性增强：使用 `helmet`。
- 速率限制：防止暴力攻击。
- 响应压缩：减少响应体积。
- 路由组件：
  - 接口路由格式：`/api/v{version}/` + 具体模块。
  - 静态路由：
    - 根路由 `/`：展示项目功能和使用方法，提供一个美化后的 `index.html` 页面。
    - Demo 路由 `/demo/`：关联 Demo 前端页面。

## 5. 数据存储
### 5.1 数据库
- 支持 SQLite 和 MySQL，使用 `sequelize` 作为 ORM 工具。
- 保留扩展到其他数据库（如 MongoDB）的灵活性。
- 开发和测试环境默认使用 SQLite，生产环境默认使用 MySQL。
- 提供两种数据库的环境变量配置。

### 5.2 数据库适配器
- 创建 `DBAdapter` 抽象接口（使用空方法抛出异常的方式代替抽象方法）。
- 提供 `connect`、`disconnect` 和 CRUD 操作方法（包括批量操作）。
- 实现 `MySQLAdapter` 和 `SQLiteAdapter` 类。

### 5.3 数据库表设计
- 提供严谨的表字段描述，尽量统一关系型数据库和非关系型数据库的格式。

## 6. 容器化部署
- 支持使用 Docker/Podman 制作镜像，提供容器化部署的脚本。

## 7. 测试
- 使用 `supertest` 和 `jest` 进行单元测试和集成测试。

## 8. 开发工具
- 支持 SourceMap。
- 接入 ESLint。

## 9. DEMO
- 核心功能：使用 DB，以 `users` 表为例：
  - 字段：
    - `id`（自增）
    - `user_id`（外部用户 ID）
    - `user_name`（用户名，3-20 个字符）
    - `age`（年龄，0-100）
    - `gender`（性别，M/F）
    - 其他必要字段
  - 创建前端页面，使用轻量级工具库（避免使用 Vue/React 等复杂框架）。
  - 支持用户增删查改功能。

## 10. 启动逻辑
- 在 HTTP 服务启动前：
  - 连接数据库。
  - 如果 Demo 数据库表不存在，则创建表并插入 10 条假数据作为热启动数据。

如果有任何疑问或需要进一步确认的地方，请随时告知。
