import Joi from 'joi';

import { ERROR_TYPES } from '../consts.js'; // 假设你有一个 errorTypes.js 文件来定义错误类型
export default (err, req, res, next) => {
  console.log('错误处理自定义中间件：', err, err?.isJoi);
  let statusCode = 500;
  if (err.isJoi || err instanceof Joi.ValidationError) {
    // statusCode = 400;
    // 针对未知字段错误返回 422
    if (err.details && err.details.some(detail => detail.type === 'object.unknown')) {
      statusCode = 422;
    } else {
      statusCode = 400;
    }
  } else if (err.name === ERROR_TYPES.AUTHENTICATION_ERROR) {
    statusCode = 401;
  } else if (err.name === ERROR_TYPES.NOT_EXIST_ERROR) {
    statusCode = 404;
  } else if (err.name === ERROR_TYPES.CONFLICT_ERROR) {
    statusCode = 409;
  }
  
  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}