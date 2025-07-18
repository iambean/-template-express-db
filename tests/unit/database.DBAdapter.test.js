import DBAdapter from '../../src/database/DBAdapter.js';

describe('DBAdapter', () => {
  let adapter;
  beforeEach(() => {
    adapter = new DBAdapter();
  });
  it('connect should throw', async () => {
    await expect(adapter.connect()).rejects.toThrow('Method not implemented');
  });
  it('disconnect should throw', async () => {
    await expect(adapter.disconnect()).rejects.toThrow('Method not implemented');
  });
  it('getModel should throw', () => {
    expect(() => adapter.getModel('User')).toThrow('must be implemented by subclass');
  });
  it('create should throw', async () => {
    await expect(adapter.create('User', {})).rejects.toThrow('Method not implemented');
  });
  it('read should throw', async () => {
    await expect(adapter.read('User', {})).rejects.toThrow('Method not implemented');
  });
  it('update should throw', async () => {
    await expect(adapter.update('User', 1, {})).rejects.toThrow('Method not implemented');
  });
  it('delete should throw', async () => {
    await expect(adapter.delete('User', 1)).rejects.toThrow('Method not implemented');
  });
  it('batchCreate should throw', async () => {
    await expect(adapter.batchCreate('User', [{}])).rejects.toThrow('Method not implemented');
  });
  it('batchUpdate should throw', async () => {
    await expect(adapter.batchUpdate('User', [{}])).rejects.toThrow('Method not implemented');
  });
  it('batchDelete should throw', async () => {
    await expect(adapter.batchDelete('User', [1])).rejects.toThrow('Method not implemented');
  });
}); 