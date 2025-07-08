const { DataTypes } = require('sequelize');
const sequelize = require('../database/index');
const Board = require('./boardmodel');

const Column = sequelize.define('Column', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Board.hasMany(Column, { foreignKey: 'board_id', onDelete: 'CASCADE' });
Column.belongsTo(Board, { foreignKey: 'board_id' });

module.exports = Column;
