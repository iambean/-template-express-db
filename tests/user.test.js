import request from 'supertest';
import app from '../src/index.js';

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
});