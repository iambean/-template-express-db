 import UserService from '../../src/services/user.service.js';

describe('UserService', () => {
  let dbAdapter;
  let userService;

  beforeEach(() => {
    dbAdapter = {
      getModel: jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue('created'),
        findAll: jest.fn().mockResolvedValue(['user1']),
        update: jest.fn().mockResolvedValue(['updated']),
        destroy: jest.fn().mockResolvedValue('deleted'),
      })
    };
    userService = new UserService(dbAdapter);
  });

  it('should create a user', async () => {
    const result = await userService.create({ name: 'a' });
    expect(result).toBe('created');
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should read users', async () => {
    const result = await userService.read({});
    expect(result).toEqual(['user1']);
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should update a user', async () => {
    const result = await userService.update(1, { name: 'b' });
    expect(result).toEqual(['updated']);
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should delete a user', async () => {
    const result = await userService.delete(1);
    expect(result).toBe('deleted');
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });
});
