import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import DBFactory from './database/DBFactory.js';
import staticRoutes from './routes/staticRoutes.js';
import userRoutes from './routes/userRoutes.js';
// 未来可以继续导入其他路由模块，如 productRoutes、orderRoutes 等

import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(__dirname, `../.env.${process.env.NODE_ENV}`);
// Load environment variables from .env file based on the environment
dotenv.config({ path: envFile });

// 初始化数据库适配器
const dbAdapter = DBFactory.createAdapter();
console.log(`${process.env.DB_TYPE} 数据库适配器已创建.`);

const app = express();

// 使用静态路由
app.use('/', staticRoutes);

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 传递 dbAdapter 给各个路由模块，方便未来扩展
app.use('/api/users', userRoutes(dbAdapter));
// app.use('/api/products', productRoutes(dbAdapter));
// app.use('/api/orders', orderRoutes(dbAdapter));

const { SERVER_PORT = 3000 } = process.env;

(async ()=>{
  await dbAdapter.connect();
  // console.log('数据库连接已建立，应用程序即将启动。',dbAdapter);
  app.listen(SERVER_PORT, async () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
    if(process.env.NODE_ENV === "development"){
      console.log(`demo url: http://localhost:${SERVER_PORT}/demo`);
    }
  });
})();