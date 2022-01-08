// Import sequelize
const sequelize = require('sequelize');
// Import connection
const connection = require('../../../../database/database');

// Create user table
const User = connection.define('users', {
   name: {
      type: sequelize.STRING,
      allowNull: false,
   },
   email: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
   },
   password: {
      type: sequelize.STRING,
      allowNull: false,
   }
});

// Creating the table, but home it already exists, I do nothing.
User.sync({force: false});

module.exports = User;