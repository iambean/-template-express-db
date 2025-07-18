import Joi from 'joi';

export const userBaseSchema = {
  user_name: Joi.string().min(2).max(20),
  age: Joi.number().integer().min(0).max(100),
  gender: Joi.string().valid('M', 'F')
};

export const userCreateSchema = Joi.object({
  ...userBaseSchema,
  user_name: userBaseSchema.user_name.required()
});

export const userUpdateSchema = Joi.object(userBaseSchema).unknown(true); 