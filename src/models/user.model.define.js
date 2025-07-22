import { DataTypes } from 'sequelize';
import { generateRandomId } from '../utils/index.js';


const UserModelDefine = (sequelize) => {
  const UserModel = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      //! 必须设置默认值，否则当allowNull: false且未传值时，Sequelize会在校验阶段直接报错且不会执行hooks。
      //! 详见README.md中的"Sequelize注意事项"部分。
      defaultValue: '', 
      unique: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100
      }
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      // 当前置的字段校验失败时，beforeCreate的hooks不会被执行
      beforeCreate: async (user, options) => {
        // 自动生成唯一 user_id
        let unique = false;
        while (!unique) {
          const newId = generateRandomId();
          const existing = await UserModel.findOne({ where: { user_id: newId } });
          if (!existing) {
            user.user_id = newId;
            unique = true;
          }
        }
      },
      beforeUpdate: async (user) => {
        console.log('before Update user ::::::', user)
        // delete user.id;
      },
    }
  });
  console.log('User model defined:', UserModel);
  return UserModel;
};

export default UserModelDefine;