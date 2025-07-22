import UserModelDefine from '../../src/models/user.model.define.js';
import { Sequelize, DataTypes } from 'sequelize';

jest.mock('../../src/utils/index.js', () => ({
  generateRandomId: jest.fn(() => 'uniqueid')
}));

describe('user.model.define', () => {
  let sequelize, UserModel;

  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory:');
    UserModel = UserModelDefine(sequelize);
    await sequelize.sync(); // 确保表结构同步
  });

  it('should require user_name and set default user_id', async () => {
    const user = await UserModel.create({ user_name: 'abc', age: 20 });
    expect(user.user_id).toBe('uniqueid');
    expect(user.user_name).toBe('abc');
  });

  it('should fail if user_name is too short', async () => {
    await expect(UserModel.create({ user_name: 'a' })).rejects.toThrow();
  });

  it('should fail if age is out of range', async () => {
    await expect(UserModel.create({ user_name: 'abc', age: 200 })).rejects.toThrow();
  });

  it('should allow gender to be null', async () => {
    const user = await UserModel.create({ user_name: 'abc', age: 20 });
    expect(user.gender == null).toBe(true);
  });
}); 