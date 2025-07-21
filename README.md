# ExpressJS Template with Database

一个基于 Express.js 的现代化 Node.js 项目模板，支持 MySQL 和 SQLite 数据库，包含完整的单元测试和集成测试。
注意事项：
+ 代码中的 User entity 是一个示例，`/static/demo` 的前端 demo 部分也是配合演示，实际项目中都需要删掉；
+ DB 当前支持 SQLite 和 MySQL，但是留有其他类型 db 的 adapter，可以继续扩展；
+ 如果是单机部署，db可以选择 SQLite，如果分布式部署，目前只能使用 MySQL；

## 🚀 特性

- **ESM 模块系统** - 全局 ES6+ 语法和ESM模块管理
- **多数据库支持** - 支持 MySQL 和 SQLite，通过适配器模式实现
- **Sequelize ORM** - 完整的数据库模型定义和关系管理
- **Joi 数据验证** - 请求数据验证和错误处理
- **完整的测试覆盖** - 单元测试和集成测试
- **统一响应格式** - 标准化的 API 响应结构
- **中间件架构** - 模块化的中间件系统
- **错误处理** - 全局错误处理和自定义错误类型

## 📁 项目结构

```
├── src/
│   ├── controllers/          # 控制器层
│   │   └── UserController.js
│   ├── database/            # 数据库适配器
│   │   ├── DBAdapter.js     # 抽象基类
│   │   ├── DBFactory.js     # 工厂类
│   │   ├── MySQLAdapter.js  # MySQL 适配器
│   │   └── SQLiteAdapter.js # SQLite 适配器
│   ├── middlewares/         # 中间件
│   │   ├── normal.js        # 通用中间件
│   │   └── errorHandle.js   # 错误处理中间件
│   ├── models/              # 数据模型
│   │   ├── User.js          # Sequelize 模型定义
│   │   ├── UserModel.js     # 业务模型层
│   │   └── index.js         # 模型注册
│   ├── routes/              # 路由定义
│   │   ├── userRoutes.js    # 用户路由
│   │   └── staticRoutes.js  # 静态路由
│   ├── utils/               # 工具类
│   │   ├── index.js         # 通用工具函数
│   │   └── responseHelper.js # 响应格式工具
│   ├── consts.js            # 常量定义
│   └── index.js             # 应用入口
├── tests/
│   ├── unit/                # 单元测试
│   │   ├── controllers.UserController.test.js
│   │   ├── database.DBAdapter.test.js
│   │   ├── database.MySQLAdapter.test.js
│   │   ├── database.SQLiteAdapter.test.js
│   │   ├── models.User.test.js
│   │   ├── models.UserModel.test.js
│   │   ├── models.index.test.js
│   │   └── utils.ResponseHelper.test.js
│   └── integration/         # 集成测试
│       └── user.test.js     # 用户 API 测试
├── package.json
├── jest.config.js
└── README.md
```

## 🛠️ 安装和运行

### 环境要求

- Node.js 18+
- MySQL 或 SQLite

### 安装依赖

```bash
npm install
```

### 环境配置

创建环境配置文件 `.env/.env.{environment}`：

```bash
# 数据库配置
DB_TYPE=mysql  # 或 sqlite
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# 服务器配置
SERVER_PORT=3000
NODE_ENV=development
```

### 启动应用

```bash
# 开发环境
npm run start:dev

# 测试环境
npm run start:test

# 生产环境
npm run start:prod
```

## 🧪 测试

### 运行所有测试

```bash
npm test
```

### 运行单元测试

```bash
npm run test:unit
```

### 运行集成测试

```bash
npm run test:integration
```

## 📊 测试覆盖说明

### 单元测试 (Unit Tests)

所有核心模块均已覆盖单元测试，测试文件位于 `tests/unit/` 目录。

| 测试文件 | 覆盖模块 | 主要测试点 |
|----------|----------|------------|
| utils.ResponseHelper.test.js | utils/responseHelper.js | 成功/错误响应格式、状态码设置 |
| controllers.UserController.test.js | controllers/UserController.js | createUser/getUser/updateUser/deleteUser/listUsers，mock userModel |
| models.User.test.js | models/User.js | 字段校验、beforeCreate 钩子、Sequelize 校验 |
| models.UserModel.test.js | models/UserModel.js | create/read/update/delete 方法，mock dbAdapter |
| database.DBAdapter.test.js | database/DBAdapter.js | 抽象方法抛出异常 |
| database.SQLiteAdapter.test.js | database/SQLiteAdapter.js | getModel、create、read、update、delete，mock models |
| database.MySQLAdapter.test.js | database/MySQLAdapter.js | create/read/update/delete，mock sequelize.models |

### 集成测试 (Integration Tests)

集成测试文件位于 `tests/integration/user.test.js`，使用 supertest 对 HTTP API 进行全流程测试。

| 测试文件 | 覆盖接口 | 主要测试点 |
|----------|----------|------------|
| user.test.js | /api/users | 创建、查询、更新、删除用户，异常分支，404 场景 |

## 🔧 API 接口

### 用户管理 API

#### 创建用户
```http
POST /api/users
Content-Type: application/json

{
  "user_name": "张三",
  "age": 25,
  "gender": "M"
}
```

#### 获取用户列表
```http
GET /api/users
```

#### 获取单个用户
```http
GET /api/users/:id
```

#### 更新用户
```http
PUT /api/users/:id
Content-Type: application/json

{
  "user_name": "李四",
  "age": 30,
  "gender": "F"
}
```

#### 删除用户
```http
DELETE /api/users/:id
```

## ⚠️ 重要注意事项

### Sequelize 使用注意事项

1. **NOT NULL 字段默认值**：当字段设置为 `allowNull: false` 但没有 `defaultValue` 时：
   - 如果 `create` 时未传值，Sequelize 会在校验阶段直接报错
   - 这种情况下不会执行 `hooks` (如 `beforeCreate`)
   - 解决方案：为 `NOT NULL` 字段设置默认值或确保 `create` 时总是传值

2. **Joi 验证与 Sequelize 钩子**：因为 Joi 规则校验在 Controller 层，而 Sequelize 的 ModelDefine 在 Model 层，因此当 Joi 校验不通过时，会直接抛错，不会执行 hooks。

### Supertest 与 ESM 兼容性

项目使用 ESM 模块系统，但 supertest 目前只支持 CommonJS。在集成测试中采用了混合模式：

- 业务代码使用 ESM (`import/export`)
- 集成测试中使用 `require('supertest')` 导入 supertest
- 同时使用 `import { app } from '../../src/index.js'` 导入应用实例

这种混合模式虽然不够优雅，但在当前技术限制下是最佳实践。

## 🎯 响应格式

所有 API 接口都使用统一的响应格式：

### 成功响应
```json
{
  "error": null,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应
```json
{
  "error": "ErrorType",
  "message": "错误描述",
  "data": null
}
```

## 📝 开发指南

### 添加新的数据模型

1. 在 `src/models/` 目录下创建 Sequelize 模型定义
2. 在 `src/models/index.js` 中注册新模型
3. 创建对应的 Model 类处理业务逻辑
4. 添加相应的 Controller 和路由
5. 编写单元测试和集成测试

### 添加新的数据库适配器

1. 继承 `DBAdapter` 抽象类
2. 实现所有抽象方法
3. 在 `DBFactory` 中添加新的适配器类型
4. 编写相应的单元测试

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
