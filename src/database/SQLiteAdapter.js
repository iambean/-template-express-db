import DBAdapter from './DBAdapter.js';
import { Sequelize } from 'sequelize';
// import UserModelDef from '../models/User.js'; // 导入User模型定义
import registerModels from '../models/index.js';

export default class SQLiteAdapter extends DBAdapter {
  constructor(config) {
    super();
    this.config = config;
    this.sequelize = null;
    this.models = {};
  }

  async connect() {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this.config.DB_NAME,
      logging: console.log,
    });
    console.log('正在连接SQLite数据库:', this.config.DB_NAME);

    this.models = registerModels(this.sequelize);

    try {
      await this.sequelize.authenticate();
      // 确保模型同步到数据库，创建表
      await this.sequelize.sync();
      console.log('SQLite连接成功');
    } catch (error) {
      console.error('SQLite连接失败:', error);
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
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    console.log('xxx:', model.constructor.name);
    console.log('UserModel.create 用的 model:', model, model.options.hooks);
    return await model.create(data);
  }

  async read(table, query) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await model.findAll({ where: query });
  }

  async update(table, id, data) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await model.update(data, { where: { id } });
  }

  async delete(table, id) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await model.destroy({ where: { id } });
  }

  async batchCreate(table, items) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await model.bulkCreate(items);
  }

  async batchUpdate(table, items) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await Promise.all(
      items.map(item => model.update(item.data, { where: { id: item.id } }))
    );
  }

  async batchDelete(table, ids) {
    // const model = this.sequelize.models[table];
    const model = this.models[table];
    return await model.destroy({ where: { id: ids } });
  }

  getModel(name) {
    const model = this.models[name];
    if (model) {
      // console.log(`获取模型: ${name}`, model);
      console.log('getModel:', name, model, model?.options?.hooks);
      return model;
    }else{
      throw new Error(`Model ${name} does not exist`);
    }
    // if (this.sequelize && this.sequelize.models[name]) {
    //   console.log(`获取模型: ${name}`, this.sequelize.models[name]);
    //   return this.sequelize.models[name];
    // }
    // throw new Error(`Model ${name} does not exist`);
  }
}