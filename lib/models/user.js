'use strict';

const DataTypes = require('sequelize'); 
const sequelize = require('./connection');
const bcryptjs = require('bcryptjs'); 

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'username',
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password',
  },
  user_group: {
    type: DataTypes.ENUM('super_admin','admin', 'normal'),
    allowNull: false,
    defaultValue: 'normal',
    field: 'user_group',
  },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      const saltRounds = 10;
      user.password = bcryptjs.hashSync(user.password, saltRounds);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = 10;
        user.password = bcryptjs.hashSync(user.password, saltRounds);
      }
    },
  },
});

module.exports = User;