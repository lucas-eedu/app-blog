// Import express
const sequelize = require('sequelize');
// Import dotenv
require('dotenv').config();

// Connecting to the database with sequelize
const connection = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
   host: process.env.DB_HOST,
   dialect: process.env.DB_DIALECT,
   dialectModule: mysql2,
   timezone: process.env.DB_TIMEZONE
});

module.exports = connection;