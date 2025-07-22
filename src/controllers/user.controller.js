import Joi from 'joi';
import UserService from '../services/user.service.js';
import { ERROR_TYPES } from '../consts.js';
import { ResponseHelper } from '../utils/responseHelper.js';

export default class UserController {
  constructor(dbAdapter) {
    this.userService = new UserService(dbAdapter);
  }

  async createUser(req, res, next) {
    try {
      const schema = Joi.object({
        user_name: Joi.string().min(2).max(20).required(),
        age: Joi.number().integer().min(0).max(100),
        gender: Joi.string().valid('M', 'F')
      }).unknown(true);// 允许未知字段
      const { error } = schema.validate(req.body);
      if (error) {
        return next(error);
      } else{
        const user = await this.userService.create(req.body);
        ResponseHelper.sendSuccess(res, user, '用户创建成功', 201);
      }
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await this.userService.read({ id: req.params.id });
      if (!user || user.length === 0) {
        const error = new Error(`你查找的 user id '${req.params.id}'不存在，请检查。`);
        error.name = ERROR_TYPES.NOT_EXIST_ERROR;
        next(error);
      } else{
        ResponseHelper.sendSuccess(res, user[0], '查询成功');
      }
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const schema = Joi.object({
        user_name: Joi.string().min(2).max(20),
        age: Joi.number().integer().min(0).max(100),
        gender: Joi.string().valid('M', 'F')
      })//.unknown(true);// 允许未知字段
      const { error } = schema.validate(req.body);
      if (error) {
        return next(error);
      } else{
        const updatedCount = await this.userService.update(req.params.id, req.body);
        if (updatedCount[0] === 0) {
          const error = new Error(`你查找的 user id '${req.params.id}'不存在，请检查。`);
          error.name = ERROR_TYPES.NOT_EXIST_ERROR;
          return next(error);
        } else{
          ResponseHelper.sendSuccess(res, null, '更新成功');
        }
      }
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await this.userService.delete(req.params.id);
      if (result === 0) {
        const error = new Error(`你查找的 user id '${req.params.id}'不存在，请检查。`);
        error.name = ERROR_TYPES.NOT_EXIST_ERROR;
        return next(error);
      } else {
        ResponseHelper.sendSuccess(res, null, '删除成功');
      }
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await this.userService.read({});
      ResponseHelper.sendSuccess(res, users, '查询成功');
    } catch (err) {
      next(err);
    }
  }
}