const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');
const Column = require('./columnmodel');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  column_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Column.hasMany(Task, { foreignKey: 'column_id', onDelete: 'CASCADE' });
Task.belongsTo(Column, { foreignKey: 'column_id' });

module.exports = Task;
