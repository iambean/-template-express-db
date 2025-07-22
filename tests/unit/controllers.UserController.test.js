import UserController from '../../src/controllers/user.controller.js';

describe('UserController', () => {
  let req, res, next, userService, controller;

  beforeEach(() => {
    userService = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      read: jest.fn().mockResolvedValue([{ id: 1, user_name: 'test' }]),
      update: jest.fn().mockResolvedValue([1]),
      delete: jest.fn().mockResolvedValue(1),
    };
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    controller = new UserController({ getModel: () => userService });
    controller.userService = userService;
  });

  it('createUser: should create user and return 201', async () => {
    req.body = { user_name: 'abc', age: 20, gender: 'M' };
    await controller.createUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: '用户创建成功',
      data: { id: 1 }
    });
  });

  it('getUser: should return user if exists', async () => {
    req.params.id = 1;
    await controller.getUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: '查询成功',
      data: { id: 1, user_name: 'test' }
    });
  });

  it('getUser: should call next with error if not found', async () => {
    userService.read.mockResolvedValue([]);
    req.params.id = 2;
    await controller.getUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'NotExistError',
      message: "你查找的 user id '2'不存在，请检查。"
    }));
  });

  it('updateUser: should update user and return 200', async () => {
    req.params.id = 1;
    req.body = { user_name: 'updated' };
    await controller.updateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: '更新成功',
      data: null
    });
  });

  it('updateUser: should call next with error if not found', async () => {
    userService.update.mockResolvedValue([0]);
    req.params.id = 2;
    await controller.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'NotExistError',
      message: "你查找的 user id '2'不存在，请检查。"
    }));
  });

  it('deleteUser: should delete user and return 200', async () => {
    req.params.id = 1;
    await controller.deleteUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: '删除成功',
      data: null
    });
  });

  it('deleteUser: should call next with error if not found', async () => {
    userService.delete.mockResolvedValue(0);
    req.params.id = 2;
    await controller.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'NotExistError',
      message: "你查找的 user id '2'不存在，请检查。"
    }));
  });

  it('listUsers: should return users', async () => {
    await controller.listUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: null,
      message: '查询成功',
      data: [{ id: 1, user_name: 'test' }]
    });
  });
});
