// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 4032, // or custom port
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true
    }
  },
  logging: false
});


module.exports = sequelize;
