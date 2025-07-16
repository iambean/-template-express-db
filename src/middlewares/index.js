import express from 'express';
import Joi from 'joi';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

export default (app) => {
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
  
  // 错误处理中间件
  app.use((err, req, res, next) => {
    let statusCode = 500;
    
    if (err instanceof Joi.ValidationError) {
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
};