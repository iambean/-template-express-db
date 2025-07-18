import MySQLAdapter from '../../src/database/MySQLAdapter.js';

describe('MySQLAdapter', () => {
  let adapter, mockSequelize;

  beforeEach(() => {
    mockSequelize = {
      models: {
        User: {
          create: jest.fn().mockResolvedValue('created'),
          findAll: jest.fn().mockResolvedValue(['user1']),
          update: jest.fn().mockResolvedValue(['updated']),
          destroy: jest.fn().mockResolvedValue('deleted'),
        }
      }
    };
    adapter = new MySQLAdapter({ DB_NAME: 'test', DB_USER: 'root', DB_PASSWORD: '', DB_HOST: 'localhost', DB_PORT: 3306 });
    adapter.sequelize = mockSequelize;
  });

  it('create: should call model.create', async () => {
    const result = await adapter.create('User', { name: 'a' });
    expect(result).toBe('created');
    expect(mockSequelize.models.User.create).toHaveBeenCalledWith({ name: 'a' });
  });

  it('read: should call model.findAll', async () => {
    const result = await adapter.read('User', { id: 1 });
    expect(result).toEqual(['user1']);
    expect(mockSequelize.models.User.findAll).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('update: should call model.update', async () => {
    const result = await adapter.update('User', 1, { name: 'b' });
    expect(result).toEqual(['updated']);
    expect(mockSequelize.models.User.update).toHaveBeenCalledWith({ name: 'b' }, { where: { id: 1 } });
  });

  it('delete: should call model.destroy', async () => {
    const result = await adapter.delete('User', 1);
    expect(result).toBe('deleted');
    expect(mockSequelize.models.User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
