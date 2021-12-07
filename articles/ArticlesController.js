// Import express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();
// Import category model
const Category = require('../categories/Category');
// Import article model
const Article = require('./Article');
// Import slugify
const slugify = require('slugify');

// Articles Routes
router.get('/admin/articles', (req, res) => {
   Article.findAll({
      // Including Category-type data (Making a Join with Sequelize)
      include: [{model: Category}]
   }).then(articles => {
      res.render('admin/articles/index', {articles: articles});
   });
});

router.get('/admin/articles/new', (req, res) => {
   Category.findAll().then(categories => {
      res.render('admin/articles/new', {categories: categories});
   });
});

router.post('/articles/save', (req, res) => {
   const title = req.body.title;
   const body = req.body.body;
   const category = req.body.category;

   Article.create({
      title: title,
      slug: slugify(title),
      body: body, 
      category: category,
      categoryId: category
   }).then(() => {
      res.redirect('/admin/articles');
   });
});

router.post('/articles/delete', (req, res) => {
   const id = req.body.id;
   if (id != undefined) {
      if(!isNaN(id)) {
         Article.destroy({
            where: {
               id: id
            }
         }).then(() => {
            res.redirect('/admin/articles');
         });
      } else {
         res.redirect('/admin/articles');
      }
   } else {
      res.redirect('/admin/articles');
   }
});

module.exports = router;