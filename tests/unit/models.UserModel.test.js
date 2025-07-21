import UserModel from '../../src/models/UserModel.js';

describe('UserModel', () => {
  let dbAdapter;
  let userModel;

  beforeEach(() => {
    dbAdapter = {
      getModel: jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue('created'),
        findAll: jest.fn().mockResolvedValue(['user1']),
        update: jest.fn().mockResolvedValue(['updated']),
        destroy: jest.fn().mockResolvedValue('deleted'),
      })
    };
    userModel = new UserModel(dbAdapter);
  });

  it('should create a user', async () => {
    const result = await userModel.create({ name: 'a' });
    expect(result).toBe('created');
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should read users', async () => {
    const result = await userModel.read({});
    expect(result).toEqual(['user1']);
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should update a user', async () => {
    const result = await userModel.update(1, { name: 'b' });
    expect(result).toEqual(['updated']);
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });

  it('should delete a user', async () => {
    const result = await userModel.delete(1);
    expect(result).toBe('deleted');
    expect(dbAdapter.getModel).toHaveBeenCalledWith('User');
  });
});
