// Import sequelize
const sequelize = require('sequelize');
// Import connection
const connection = require('../database/database');

// Create category table
const Category = connection.define('categories', {
   title: {
      type: sequelize.STRING,
      allowNull: false,
   },
   slug: {
      type: sequelize.STRING,
      allowNull: false,   
   }
});

// Creating the table, but home it already exists, I do nothing.
Category.sync({force: false});

module.exports = Category;