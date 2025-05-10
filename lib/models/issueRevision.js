'use strict';

const DataTypes = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');

const IssueRevision = sequelize.define('IssueRevision', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  },
  issueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'issue_id',
    references: {
      model: 'issues',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  userId: { // Track who made the change
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  currentState: { // The full state of the issue after the change
    type: DataTypes.JSON,
    allowNull: false,
    field: 'current_state',
  },
  changes: { // The specific fields that were changed and their new values
    type: DataTypes.JSON,
    allowNull: true,
    field: 'changes',
  },
  updatedAt: { // Timestamp of the revision
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at',
  },
}, {
  tableName: 'issue_revisions',
  underscored: true,
  timestamps: false,
});

const Issue = require('./issue');

IssueRevision.belongsTo(Issue, { foreignKey: 'issueId', as: 'issue' });
IssueRevision.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = IssueRevision;
