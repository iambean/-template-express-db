 /**
 * 统一响应格式工具类
 * 所有异步接口都应该使用这个工具来返回统一格式的响应
 */
export class ResponseHelper {
  /**
   * 成功响应
   * @param {any} data - 响应数据
   * @param {string} message - 响应消息
   * @param {number} statusCode - HTTP状态码，默认200
   * @returns {Object} 统一格式的成功响应
   */
  static success(data = null, message = '', statusCode = 200) {
    return {
      error: null,
      message: message,
      data: data
    };
  }

  /**
   * 错误响应
   * @param {string} errorType - 错误类型
   * @param {string} message - 错误消息
   * @param {any} data - 额外的错误数据
   * @param {number} statusCode - HTTP状态码，默认500
   * @returns {Object} 统一格式的错误响应
   */
  static error(errorType, message='', data = null, statusCode = 500) {
    return {
      error: errorType,
      message,
      data
    };
  }

  /**
   * 发送成功响应
   * @param {Object} res - Express响应对象
   * @param {any} data - 响应数据
   * @param {string} message - 响应消息
   * @param {number} statusCode - HTTP状态码，默认200
   */
  static sendSuccess(res, data = null, message = '', statusCode = 200) {
    res.status(statusCode).json(this.success(data, message, statusCode));
  }

  /**
   * 发送错误响应
   * @param {Object} res - Express响应对象
   * @param {string} errorType - 错误类型
   * @param {string} message - 错误消息
   * @param {any} data - 额外的错误数据
   * @param {number} statusCode - HTTP状态码，默认500
   */
  static sendError(res, errorType, message, data = null, statusCode = 500) {
    res.status(statusCode).json(this.error(errorType, message, data, statusCode));
  }

  /**
   * 根据错误对象生成错误响应
   * @param {Object} res - Express响应对象
   * @param {Error} error - 错误对象
   * @param {number} statusCode - HTTP状态码
   */
  static sendErrorFromException(res, error, statusCode = 500) {
    const errorType = error.name || 'InternalServerError';
    const message = error.message || '服务器内部错误';
    const data = process.env.NODE_ENV === 'development' ? { stack: error.stack } : null;
    
    this.sendError(res, errorType, message, data, statusCode);
  }
}