import Joi from 'joi';
import { ERROR_TYPES } from '../consts.js';
import { ResponseHelper } from '../utils/responseHelper.js';

export default (err, req, res, next) => {
  console.log('错误处理自定义中间件：', err, err?.isJoi);
  let statusCode = 500;
  let errorType = 'InternalServerError';
  let message = err.message || '服务器内部错误';

  // 专门处理 Joi 验证错误
  if (err.isJoi || err instanceof Joi.ValidationError) {
    errorType = ERROR_TYPES.VALIDATION_ERROR;
    // 针对未知字段错误返回 422
    if (err.details && err.details.some(detail => detail.type === 'object.unknown')) {
      statusCode = 422;
    } else {
      statusCode = 400;
    }
  } else if (err.name === ERROR_TYPES.AUTHENTICATION_ERROR) {
    errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
    statusCode = 401;
  } else if (err.name === ERROR_TYPES.NOT_EXIST_ERROR) {
    errorType = ERROR_TYPES.NOT_EXIST_ERROR;
    statusCode = 404;
  } else if (err.name === ERROR_TYPES.CONFLICT_ERROR) {
    errorType = ERROR_TYPES.CONFLICT_ERROR;
    statusCode = 409;
  } else if (err.name) {
    errorType = err.name;
  }

  // 使用统一的响应格式
  // ResponseHelper.sendError(res, errorType, message, null, statusCode);
  ResponseHelper.sendError(res, errorType, message, {}, statusCode);
}