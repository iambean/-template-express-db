import DBAdapter from './DBAdapter.js';
import { Sequelize } from 'sequelize';

export default class MySQLAdapter extends DBAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.sequelize = null;
  }

  async connect() {
    this.sequelize = new Sequelize(
      this.config.DB_NAME,
      this.config.DB_USER,
      this.config.DB_PASSWORD,
      {
        host: this.config.DB_HOST,
        port: this.config.DB_PORT,
        dialect: 'mysql',
        logging: console.log,
      }
    );
    
    try {
      await this.sequelize.authenticate();
      console.log('MySQL连接成功');
    } catch (error) {
      console.error('MySQL连接失败:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.sequelize) {
      await this.sequelize.close();
      this.sequelize = null;
    }
  }

  async create(table, data) {
    const model = this.sequelize.models[table];
    return await model.create(data);
  }

  async read(table, query) {
    const model = this.sequelize.models[table];
    return await model.findAll({ where: query });
  }

  async update(table, id, data) {
    const model = this.sequelize.models[table];
    return await model.update(data, { where: { id } });
  }

  async delete(table, id) {
    const model = this.sequelize.models[table];
    return await model.destroy({ where: { id } });
  }

  async batchCreate(table, items) {
    const model = this.sequelize.models[table];
    return await model.bulkCreate(items);
  }

  async batchUpdate(table, items) {
    const model = this.sequelize.models[table];
    return await Promise.all(
      items.map(item => model.update(item.data, { where: { id: item.id } }))
    );
  }

  async batchDelete(table, ids) {
    const model = this.sequelize.models[table];
    return await model.destroy({ where: { id: ids } });
  }
}