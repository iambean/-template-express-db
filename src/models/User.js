import { DataTypes } from 'sequelize';
import { generateRandomId } from '../utils/index.js';


export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      //! 一定要设置一个默认值，这是Sequelize的坑，详见mark.md。
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
      beforeCreate: async (user, options) => {
        // 自动生成唯一 user_id
        let unique = false;
        while (!unique) {
          const newId = generateRandomId();
          const existing = await User.findOne({ where: { user_id: newId } });
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
  console.log('User model defined:', User);
  return User;
};