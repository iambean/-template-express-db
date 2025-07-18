import express from 'express';
import Joi from 'joi';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';

export default (app) => {
  // 请求ID中间件
  app.use((req, res, next) => {
    req.requestId = uuidv4();
    console.log('requestId:', req.requestId);
    next();
  });

  // 日志中间件
  app.use(morgan('dev'));
  
  // 跨域处理
  app.use(cors());
  
  // 安全增强
  app.use(helmet());
  
  // 速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100 // 每个IP限制100个请求
    })
  );
  
  // 响应压缩
  app.use(compression());
  
  // JSON解析
  app.use(express.json());
  
  // URL编码解析
  app.use(express.urlencoded({ extended: true }));
  
  // FIXME:错误处理中间件，暂时移动到主入口 src/index.js
  // app.use((err, req, res, next) => {
  //   let statusCode = 500;
  //   console.log('集中错误处理中间件', err.constructor.name, err.isJoi);
  //   if (err.isJoi || err instanceof Joi.ValidationError) {
  //     statusCode = 400;
  //   } else if (err.name === 'AuthenticationError') {
  //     statusCode = 401;
  //   } else if (err.name === 'NotExistError') {
  //     statusCode = 404;
  //   }
    
  //   res.status(statusCode).json({
  //     error: {
  //       message: err.message,
  //       ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  //     }
  //   });
  // });
};