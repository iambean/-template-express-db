import SQLiteAdapter from '../../src/database/SQLiteAdapter.js';

describe('SQLiteAdapter', () => {
  let adapter, mockSequelize, mockModels;

  beforeEach(() => {
    mockModels = {
      User: {
        create: jest.fn().mockResolvedValue('created'),
        findAll: jest.fn().mockResolvedValue(['user1']),
        update: jest.fn().mockResolvedValue(['updated']),
        destroy: jest.fn().mockResolvedValue('deleted'),
        options: { hooks: {} }, // 修复 hooks undefined
      }
    };
    adapter = new SQLiteAdapter({ DB_NAME: ':memory:' });
    adapter.models = mockModels;
  });

  it('getModel: should return model if exists', () => {
    expect(adapter.getModel('User')).toBe(mockModels.User);
  });

  it('getModel: should throw if model does not exist', () => {
    expect(() => adapter.getModel('NotExist')).toThrow('Model NotExist does not exist');
  });

  it('create: should call model.create', async () => {
    const result = await adapter.create('User', { name: 'a' });
    expect(result).toBe('created');
    expect(mockModels.User.create).toHaveBeenCalledWith({ name: 'a' });
  });

  it('read: should call model.findAll', async () => {
    const result = await adapter.read('User', { id: 1 });
    expect(result).toEqual(['user1']);
    expect(mockModels.User.findAll).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('update: should call model.update', async () => {
    const result = await adapter.update('User', 1, { name: 'b' });
    expect(result).toEqual(['updated']);
    expect(mockModels.User.update).toHaveBeenCalledWith({ name: 'b' }, { where: { id: 1 } });
  });

  it('delete: should call model.destroy', async () => {
    const result = await adapter.delete('User', 1);
    expect(result).toBe('deleted');
    expect(mockModels.User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
