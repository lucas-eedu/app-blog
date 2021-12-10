// Import express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();
// Import category model
const Category = require('../../categories/Models/Category');
// Import article model
const Article = require('../Models/Article');
// Import slugify
const slugify = require('slugify');

// Articles Routes
router.get('/admin/articles', (req, res) => {
   Article.findAll({
      // Sorting articles from newest to oldest
      order: [['id', 'DESC']],
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

router.get('/admin/articles/:id/edit', (req, res) => {
   const id = req.params.id;

   if(isNaN(id)) {
      res.redirect('/admin/articles');
   }

   Article.findByPk(id).then(article => {
      if(article != undefined) {
         Category.findAll().then(categories => {
            res.render('admin/articles/edit', {
               article: article, 
               categories: categories
            });
         });
      } else {
         res.redirect('/admin/articles');
      }
   }).catch(err => {
      res.redirect('/admin/articles');
   });
});

router.post('/admin/articles/update', (req, res) => {
   const id = req.body.id;
   const title = req.body.title;
   const body = req.body.body;
   const category = req.body.category;

   Article.update({title: title, body: body, slug: slugify(title), categoryId: category}, {
      where: {
         id: id
      }
   }).then(() => {
      res.redirect('/admin/articles');
   }).catch(err => {
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