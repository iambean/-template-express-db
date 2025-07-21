import registerModels from '../../src/models/index.js';
import { Sequelize } from 'sequelize';

describe('registerModels', () => {
  it('should register User model', () => {
    const sequelize = new Sequelize('sqlite::memory:');
    const models = registerModels(sequelize);
    expect(models.User).toBeDefined();
    expect(typeof models.User.create).toBe('function');
  });
}); 