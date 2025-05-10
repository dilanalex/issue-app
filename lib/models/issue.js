'use strict';

//const Sequelize = require('sequelize');
const sequelize = require('./connection');
const DataTypes = require('sequelize');
const User = require('./user'); // Assuming you have a User model

const Issue = sequelize.define('issue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  userId: { // Foreign key to the User model who created the issue
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL', 
  },
  created_by: {
    type: DataTypes.STRING,
    defaultValue: 'unknown'
  },
  updated_by: {
    type: DataTypes.STRING,
    defaultValue: 'unknown'
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'issues',
  underscored: true 
});

Issue.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Issue;