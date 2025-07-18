import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Joi from 'joi';

import applyMiddlewares from './middlewares/index.js';

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

// 中间件集中处理
applyMiddlewares(app);

// 传递 dbAdapter 给各个路由模块，方便未来扩展
app.use('/api/users', userRoutes(dbAdapter));
// app.use('/api/products', productRoutes(dbAdapter));
// app.use('/api/orders', orderRoutes(dbAdapter));

// FIXME: 为什么在applyMiddlewares里面不行，非要放到这里才可以？
app.use((err, req, res, next) => {
  console.log('错误处理自定义中间件：', err, err?.isJoi);
  let statusCode = 500;
  if (err.isJoi || err instanceof Joi.ValidationError) {
    statusCode = 400;
  } else if (err.name === 'AuthenticationError') {
    statusCode = 401;
  } else if (err.name === 'NotExistError') {
    statusCode = 404;
  }
  
  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});