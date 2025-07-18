# express-template-1

## 单元测试与集成测试说明 (Unit & Integration Test Documentation)

### 1. 单元测试 (Unit Tests)

所有核心模块均已覆盖单元测试，测试文件位于 `tests/unit/` 目录。

| 测试文件 | 覆盖模块 | 主要测试点 |
|----------|----------|------------|
| utils.test.js | utils/index.js | generateRandomId 的长度、字符范围、唯一性 |
| validators.user.test.js | validators/user.js | Joi 校验规则的通过与失败场景 |
| models.UserModel.test.js | models/UserModel.js | create/read/update/delete 方法，mock dbAdapter |
| models.User.test.js | models/User.js | 字段校验、beforeCreate 钩子、Sequelize 校验 |
| models.index.test.js | models/index.js | registerModels 注册 User 模型 |
| controllers.UserController.test.js | controllers/UserController.js | createUser/getUser/updateUser/deleteUser/listUsers，mock userModel |
| database.DBAdapter.test.js | database/DBAdapter.js | 抽象方法抛出异常 |
| database.SQLiteAdapter.test.js | database/SQLiteAdapter.js | getModel、create、read、update、delete，mock models |
| database.MySQLAdapter.test.js | database/MySQLAdapter.js | create/read/update/delete，mock sequelize.models |

#### 运行单元测试 (Run Unit Tests)
```bash
npx jest tests/unit --coverage
```

---

### 2. 集成测试 (Integration Tests)

集成测试文件位于 `tests/user.test.js`，使用 supertest 对 HTTP API 进行全流程测试。

| 测试文件 | 覆盖接口 | 主要测试点 |
|----------|----------|------------|
| user.test.js | /api/users | 创建、查询、更新、删除用户，异常分支，404 场景 |

#### 运行集成测试 (Run Integration Tests)
```bash
npx jest tests/user.test.js
```

---

### 3. 其它说明 (Other Notes)
- 所有测试均可通过 `npm test` 或 `npx jest` 统一运行。
- 单元测试 mock 了数据库和依赖，集成测试为端到端 HTTP 流程。
- 测试覆盖率可通过 `--coverage` 参数查看。

---

如需补充其它模块测试或有疑问，请联系维护者。

---

## English Summary

### Unit Tests
- All core modules are covered by unit tests in `tests/unit/`.
- See the table above for details on files and coverage.
- Run: `npx jest tests/unit --coverage`

### Integration Tests
- HTTP API integration tests in `tests/user.test.js` using supertest.
- Run: `npx jest tests/user.test.js`

### Notes
- All tests can be run with `npm test` or `npx jest`.
- Unit tests use mocks, integration tests are end-to-end.
- Use `--coverage` for coverage report. 

---

## ⚠️ supertest 与全局 ESM 环境的冲突说明（Supertest & ESM Incompatibility）

### 问题描述（Problem Description）
- supertest 是 Node.js 社区主流的 HTTP API 测试工具，支持直接传递 express app 对象进行无端口测试。
- 但 supertest 及其依赖链（如 superagent）目前**只支持 CommonJS**，不支持 ESM（import/export、import.meta.url 等）。
- 当你的项目和测试代码全局采用 ESM（即 package.json 设为 "type": "module"，源码和测试都用 import/export）时：
  - supertest 无法被 ESM 测试文件用 import 正确加载。
  - 即使用 createRequire、动态 import 等方式，Jest 的 ESM loader 也无法完全兼容 supertest 的 require 机制。
  - 你会遇到 `require is not defined`、`Cannot use 'import.meta' outside a module` 等报错。

### 具体表现（Typical Errors）
- `ReferenceError: require is not defined`
- `SyntaxError: Cannot use 'import.meta' outside a module`
- supertest 相关的 ESM/CJS 互操作失败

### 社区现状（Community Status）
- supertest 官方暂未发布 ESM 版本。
- Jest 的 ESM 支持仍有局限，尤其是与 CommonJS-only 包混用时。
- 目前 supertest + ESM + Jest 组合在 Node 18+ 下依然有大量未解决的兼容性问题。

### 推荐替代方案（Recommended Alternatives）
- **如需 ESM 测试环境，建议：**
  1. 启动实际 HTTP 服务（如 `npm run start:test`），用 `undici`、`node-fetch`、`axios` 等 ESM 兼容的 HTTP 客户端进行集成测试。
  2. 或将集成测试文件单独用 CommonJS（.cjs）语法编写，业务代码保持 ESM。
- **如需直接传 express app 对象测试，建议保持测试为 CommonJS。**

### 最佳实践（Best Practice）
- 业务代码、单元测试可用 ESM。
- 集成测试如需 supertest，建议用 .cjs 文件并用 require 语法。
- 或全部用 ESM + undici/fetch，测试已启动的 HTTP 服务。

---

## ⚠️ supertest & ESM Incompatibility (English)

- supertest is CommonJS-only, not compatible with ESM-only projects ("type": "module").
- Using import or createRequire in ESM test files with supertest will cause `require is not defined` or `Cannot use 'import.meta' outside a module` errors.
- Jest's ESM support is still limited when mixing with CommonJS-only packages.
- **Recommended:**
  - Use ESM-friendly HTTP clients (undici, node-fetch, axios) to test real HTTP endpoints.
  - Or, write integration tests in .cjs (CommonJS) and keep business code in ESM.
- See above for best practices and migration suggestions.

--- 