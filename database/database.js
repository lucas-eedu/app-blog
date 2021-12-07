// Import express
const sequelize = require('sequelize');
// Connecting to the database with sequelize
const connection = new sequelize('projects_app-blog', 'root', '12345678', {
   host: 'localhost',
   dialect: 'mysql',
   timezone: '-03:00'
});

module.exports = connection;