import Joi from 'joi';
import { userBaseSchema, userCreateSchema, userUpdateSchema } from '../../src/validators/user.js';

describe('userBaseSchema', () => {
  it('should validate valid user', () => {
    const data = { user_name: 'abc', age: 20, gender: 'M' };
    const { error } = Joi.object(userBaseSchema).validate(data);
    expect(error).toBeUndefined();
  });

  it('should fail for short user_name', () => {
    const data = { user_name: 'a', age: 20, gender: 'M' };
    const { error } = Joi.object(userBaseSchema).validate(data);
    expect(error).toBeDefined();
  });

  it('should fail for invalid age', () => {
    const data = { user_name: 'abc', age: 200, gender: 'M' };
    const { error } = Joi.object(userBaseSchema).validate(data);
    expect(error).toBeDefined();
  });

  it('should fail for invalid gender', () => {
    const data = { user_name: 'abc', age: 20, gender: 'X' };
    const { error } = Joi.object(userBaseSchema).validate(data);
    expect(error).toBeDefined();
  });
});

describe('userCreateSchema', () => {
  it('should require user_name', () => {
    const data = { age: 20, gender: 'M' };
    const { error } = userCreateSchema.validate(data);
    expect(error).toBeDefined();
  });
  it('should pass with valid user_name', () => {
    const data = { user_name: 'abc', age: 20, gender: 'F' };
    const { error } = userCreateSchema.validate(data);
    expect(error).toBeUndefined();
  });
});

describe('userUpdateSchema', () => {
  it('should allow unknown fields', () => {
    const data = { user_name: 'abc', foo: 'bar' };
    const { error } = userUpdateSchema.validate(data);
    expect(error).toBeUndefined();
  });
});
