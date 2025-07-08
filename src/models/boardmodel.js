    const { DataTypes } = require('sequelize');
    const sequelize = require('../database/index');

    const Board = sequelize.define('Board', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    });

    module.exports = Board;
