import MySQLAdapter from './MySQLAdapter.js';
import SQLiteAdapter from './SQLiteAdapter.js';

export default class DBFactory {
  static createAdapter(config = {}) {
    const { env } = process;
    // config = Object.assign({}, process.env, config);
    switch (env.DB_TYPE) {
      case 'mysql':
        const mysqlConf = {
          DB_NAME: env.DB_NAME,
          DB_USER: env.DB_USER,
          DB_PASSWORD: env.DB_PASSWORD,
          DB_HOST: env.DB_HOST,
          DB_PORT: env.DB_PORT,
        };
        return new MySQLAdapter(Object.assign({}, mysqlConf, config));
      case 'sqlite':
        const sqliteConf = {
          DB_NAME: env.DB_NAME || 'database.sqlite', // 默认值为 'database.sqlite'
        };
        return new SQLiteAdapter(Object.assign({}, sqliteConf, config));
      default:
        throw new Error(`Unsupported database type: ${config.DB_TYPE}`);
    }
  }
}