export default (err, req, res, next) => {
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
}