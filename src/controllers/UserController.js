import Joi from 'joi';
import UserModel from '../models/UserModel.js';

export default class UserController {
  constructor(dbAdapter) {
    this.userModel = new UserModel(dbAdapter);
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
        const user = await this.userModel.create(req.body);
        res.status(201).json(user);
      }
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await this.userModel.read({ id: req.params.id });
      if (!user || user.length === 0) {
        const error = new Error('用户不存在');
        error.name = 'NotExistError';
        return next(error);
      } else{
        res.status(200).json(user[0]);
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
      }).unknown(true);// 允许未知字段
      const { error } = schema.validate(req.body);
      if (error) {
        return next(error);
      } 

      const result = await this.userModel.update(req.params.id, req.body);
      if (result[0] === 0) {
        const error = new Error('用户不存在');
        error.name = 'NotExistError';
        if (error) {
          return next(error);
        } 
      }
      res.status(200).json({ message: '更新成功' });
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await this.userModel.delete(req.params.id);
      if (result === 0) {
        const error = new Error('用户不存在');
        error.name = 'NotExistError';
        return next(error);
      } else {
        res.status(200).json({ message: '删除成功' });
      }
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await this.userModel.read({});
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}