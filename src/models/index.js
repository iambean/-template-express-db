import UserModelDef from './user.model.define.js';
// import ProductModelDef from './Product.js';
// import OrderModelDef from './Order.js';

export default function registerModels(sequelize) {
  const models = {};
  models.User = UserModelDef(sequelize);
  console.log('注册User模型:', models.User, models.User.options.hooks);
  // models.Product = ProductModelDef(sequelize);
  // models.Order = OrderModelDef(sequelize);
  return models;
}