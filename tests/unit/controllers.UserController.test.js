import UserController from '../../src/controllers/UserController.js';

describe('UserController', () => {
  let req, res, next, userModel, controller;

  beforeEach(() => {
    userModel = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      read: jest.fn().mockResolvedValue([{ id: 1, user_name: 'test' }]),
      update: jest.fn().mockResolvedValue([1]),
      delete: jest.fn().mockResolvedValue(1),
    };
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    controller = new UserController({ getModel: () => userModel });
    controller.userModel = userModel; // 直接注入 mock
  });

  it('createUser: should create user and return 201', async () => {
    req.body = { user_name: 'abc', age: 20, gender: 'M' };
    await controller.createUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('getUser: should return user if exists', async () => {
    req.params.id = 1;
    await controller.getUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, user_name: 'test' });
  });

  it('getUser: should call next with error if not found', async () => {
    userModel.read.mockResolvedValue([]);
    req.params.id = 2;
    await controller.getUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('updateUser: should update user and return 200', async () => {
    req.params.id = 1;
    req.body = { user_name: 'updated' };
    await controller.updateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: '更新成功' });
  });

  it('updateUser: should call next with error if not found', async () => {
    userModel.update.mockResolvedValue([0]);
    req.params.id = 2;
    await controller.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('deleteUser: should delete user and return 200', async () => {
    req.params.id = 1;
    await controller.deleteUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: '删除成功' });
  });

  it('deleteUser: should call next with error if not found', async () => {
    userModel.delete.mockResolvedValue(0);
    req.params.id = 2;
    await controller.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('listUsers: should return users', async () => {
    await controller.listUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, user_name: 'test' }]);
  });
}); 