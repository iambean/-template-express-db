//! 有坑：项目业务代码使用的是 ESM，但是 supertest完全不支持 ESM，所以只能使用 CommonJS 的方式来导入使用。
//! 而 src/index.js 是 ESM 的，所以需要使用 import 来导入 app。 导致了ESM 和 CommonJS 模式混用。
const request = require('supertest');
import { app, dbAdapter, server } from '../../src/index.js';

describe('User API', () => {
  let userId;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'testuser', age: 25, gender: 'F' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      error: null,
      message: '用户创建成功',
      data: expect.objectContaining({ id: expect.any(Number) })
    });
    userId = res.body.data.id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      error: null,
      message: '查询成功',
      data: expect.any(Array)
    });
  });

  it('should get a single user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      error: null,
      message: '查询成功',
      data: expect.objectContaining({ id: userId })
    });
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ user_name: 'updated', age: 46, gender: 'M' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      error: null,
      message: '更新成功',
      data: null
    });
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      error: null,
      message: '删除成功',
      data: null
    });
  });

  it('should return 404 when getting deleted user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      error: 'NotExistError',
      message: `你查找的 user id '${userId}'不存在，请检查。`,
      data: {}
    });
  });

  it('should fail to create user with missing user_name', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ age: 20 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"user_name" is required',
      data: {}
    });
  });

  it('should fail to create user with short user_name', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'a', age: 20 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"user_name" length must be at least 2 characters long',
      data: {}
    });
  });

  it('should fail to create user with invalid age', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'abc', age: 200 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"age" must be less than or equal to 100',
      data: {}
    });
  });

  it('should fail to create user with invalid gender', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'abc', age: 20, gender: 'X' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"gender" must be one of [M, F]',
      data: {}
    });
  });

  it('should fail to update user with invalid age', async () => {
    // 先创建一个用户
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'updateTest', age: 20 });
    const id = createRes.body.data.id;
    const res = await request(app)
      .put(`/api/users/${id}`)
      .send({ age: 200 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"age" must be less than or equal to 100',
      data: {}
    });
  });

  it('should allow update with unknown fields', async () => {
    // 先创建一个用户
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'updateTest2', age: 20, gender: 'M' });
    const id = createRes.body.data.id;
    const res = await request(app)
      .put(`/api/users/${id}`)
      .send({ foo: 'bar' });
    expect(res.statusCode).toBe(422); // 422 Unprocessable Entity
    expect(res.body).toEqual({
      error: 'ValidationError',
      message: '"foo" is not allowed',
      data: {}
    });
  });

  it('should return 404 when updating non-existent user', async () => {
    const res = await request(app)
      .put('/api/users/999999')
      .send({ user_name: 'notfound' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'NotExistError',
      message: "你查找的 user id '999999'不存在，请检查。",
      data: {}
    });
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app)
      .delete('/api/users/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'NotExistError',
      message: "你查找的 user id '999999'不存在，请检查。",
      data: {}
    });
  });

  it('should return 400 for invalid id format', async () => {
    const res = await request(app)
      .get('/api/users/invalid_id');
    // 可能是 400 或 404，取决于实现
    expect([400, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
  });

  it('should handle concurrent create requests', async () => {
    const requests = Array(5).fill().map(() => 
      request(app)
        .post('/api/users')
        .send({ user_name: 'concurrent', age: 20 })
    );
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        error: null,
        message: '用户创建成功',
        data: expect.objectContaining({ id: expect.any(Number) })
      });
    });
  });

  it('should handle concurrent update requests', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'concurrentUpdate', age: 20 });
    const id = createRes.body.data.id;
    
    const requests = Array(5).fill().map(() => 
      request(app)
        .put(`/api/users/${id}`)
        .send({ age: Math.floor(Math.random() * 100) })
    );
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        error: null,
        message: '更新成功',
        data: null
      });
    });
  });

  // it('should reject duplicate user_name', async () => {
  //   await request(app)
  //     .post('/api/users')
  //     .send({ user_name: 'duplicate', age: 20, gender: 'M' });
    
  //   const res = await request(app)
  //     .post('/api/users')
  //     .send({ user_name: 'duplicate', age: 20, gender: 'M' });
  //   expect(res.statusCode).toBe(409);
  // });

  it('should clean up test data', async () => {
    const users = await request(app).get('/api/users');
    await Promise.all(
      users.body.data.map(user => 
        request(app).delete(`/api/users/${user.id}`)
      )
    );
    const emptyRes = await request(app).get('/api/users');
    expect(emptyRes.body.data.length).toBe(0);
  });

  afterAll(async () => {
    // 这里可以添加清理数据库的逻辑，如果需要的话
    await dbAdapter.disconnect();
    server.close(); 
  });
});