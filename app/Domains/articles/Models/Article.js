// Import sequelize
const sequelize = require('sequelize');
// Import connection
const connection = require('../../../../database/database');
// Import category model
const Category = require('../../categories/Models/Category');

// Create article table
const Article = connection.define('articles', {
   title: {
      type: sequelize.STRING,
      allowNull: false,
   },
   slug: {
      type: sequelize.STRING,
      allowNull: false,   
   }, 
   body: {
      type: sequelize.TEXT,
      allowNull: false,
   },
});

// One category has many articles (1 - N)
Category.hasMany(Article);

// An article belongs to a category (1 - 1)
Article.belongsTo(Category);

// Creating the table, but home it already exists, I do nothing.
Article.sync({force: false});

module.exports = Article;