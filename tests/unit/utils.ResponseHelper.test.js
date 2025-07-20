import { ResponseHelper } from '../../src/utils/responseHelper.js';

describe('ResponseHelper', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('success', () => {
    it('should create success response with default values', () => {
      const result = ResponseHelper.success();
      expect(result).toEqual({
        error: null,
        message: '',
        data: null
      });
    });

    it('should create success response with custom values', () => {
      const data = { id: 1, name: 'test' };
      const message = '操作成功';
      const result = ResponseHelper.success(data, message, 201);
      expect(result).toEqual({
        error: null,
        message: '操作成功',
        data: { id: 1, name: 'test' }
      });
    });
  });

  describe('error', () => {
    it('should create error response with default values', () => {
      const result = ResponseHelper.error('TestError');
      expect(result).toEqual({
        error: 'TestError',
        message: '',
        data: null
      });
    });

    it('should create error response with custom values', () => {
      const result = ResponseHelper.error('ValidationError', '验证失败', { field: 'name' }, 400);
      expect(result).toEqual({
        error: 'ValidationError',
        message: '验证失败',
        data: { field: 'name' }
      });
    });
  });

  describe('sendSuccess', () => {
    it('should send success response with default values', () => {
      ResponseHelper.sendSuccess(mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: null,
        message: '',
        data: null
      });
    });

    it('should send success response with custom values', () => {
      const data = { id: 1, name: 'test' };
      const message = '创建成功';
      ResponseHelper.sendSuccess(mockRes, data, message, 201);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: null,
        message: '创建成功',
        data: { id: 1, name: 'test' }
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with default values', () => {
      ResponseHelper.sendError(mockRes, 'TestError');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'TestError',
        message: '',
        data: null
      });
    });

    it('should send error response with custom values', () => {
      ResponseHelper.sendError(mockRes, 'ValidationError', '验证失败', { field: 'name' }, 400);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'ValidationError',
        message: '验证失败',
        data: { field: 'name' }
      });
    });
  });

  describe('sendErrorFromException', () => {
    it('should send error response from exception in production', () => {
      const _OLD_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const error = new Error('测试错误');
      error.name = 'TestError';
      
      ResponseHelper.sendErrorFromException(mockRes, error, 400);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'TestError',
        message: '测试错误',
        data: null
      });
      process.env.NODE_ENV = _OLD_ENV; // 恢复环境变量
    });

    it('should send error response from exception in development', () => {
      const _OLD_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const error = new Error('测试错误');
      error.name = 'TestError';
      
      ResponseHelper.sendErrorFromException(mockRes, error, 400);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'TestError',
        message: '测试错误',
        data: { stack: error.stack }
      });
      process.env.NODE_ENV = _OLD_ENV; // 恢复环境变量
    });

    it('should handle error without name property', () => {
      const error = new Error('测试错误');
      
      ResponseHelper.sendErrorFromException(mockRes, error, 500);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        // error: 'InternalServerError',
        error: 'Error',
        message: '测试错误',
        data: null
      });
    });
  });
});