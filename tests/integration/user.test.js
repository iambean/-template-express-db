const request = require('supertest');
const app = require('../../src/index.js');

describe('User API', () => {
  let userId;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'test', email: 'test@example.com' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should get a single user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'updated', email: 'updated@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'updated');
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 when getting deleted user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(404);
  });

  it('should fail to create user with missing user_name', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ age: 20 });
    expect(res.statusCode).toBe(400);
  });

  it('should fail to create user with short user_name', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'a', age: 20 });
    expect(res.statusCode).toBe(400);
  });

  it('should fail to create user with invalid age', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'abc', age: 200 });
    expect(res.statusCode).toBe(400);
  });

  it('should fail to create user with invalid gender', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'abc', age: 20, gender: 'X' });
    expect(res.statusCode).toBe(400);
  });

  it('should fail to update user with invalid age', async () => {
    // 先创建一个用户
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'updateTest', age: 20 });
    const id = createRes.body.id;
    const res = await request(app)
      .put(`/api/users/${id}`)
      .send({ age: 200 });
    expect(res.statusCode).toBe(400);
  });

  it('should allow update with unknown fields', async () => {
    // 先创建一个用户
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'updateTest2', age: 20 });
    const id = createRes.body.id;
    const res = await request(app)
      .put(`/api/users/${id}`)
      .send({ foo: 'bar' });
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 when updating non-existent user', async () => {
    const res = await request(app)
      .put('/api/users/999999')
      .send({ user_name: 'notfound' });
    expect(res.statusCode).toBe(404);
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app)
      .delete('/api/users/999999');
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid id format', async () => {
    const res = await request(app)
      .get('/api/users/invalid_id');
    // 可能是 400 或 404，取决于实现
    expect([400, 404]).toContain(res.statusCode);
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
    });
  });

  it('should handle concurrent update requests', async () => {
    const createRes = await request(app)
      .post('/api/users')
      .send({ user_name: 'concurrentUpdate', age: 20 });
    const id = createRes.body.id;
    
    const requests = Array(5).fill().map(() => 
      request(app)
        .put(`/api/users/${id}`)
        .send({ age: Math.floor(Math.random() * 100) })
    );
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      expect(res.statusCode).toBe(200);
    });
  });

  it('should reject duplicate user_name', async () => {
    await request(app)
      .post('/api/users')
      .send({ user_name: 'duplicate', age: 20 });
    
    const res = await request(app)
      .post('/api/users')
      .send({ user_name: 'duplicate', age: 20 });
    expect(res.statusCode).toBe(409);
  });

  it('should clean up test data', async () => {
    const users = await request(app).get('/api/users');
    await Promise.all(
      users.body.map(user => 
        request(app).delete(`/api/users/${user.id}`)
      )
    );
    const emptyRes = await request(app).get('/api/users');
    expect(emptyRes.body.length).toBe(0);
  });
});