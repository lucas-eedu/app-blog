// Import express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();
// Import category model
const Category = require('../Models/Category');
// Import slugify
const slugify = require('slugify');
// Import Authenticate Middleware
const authenticateMiddleware = require('../../../Middleware/Authenticate');

// Category Routes
router.get('/admin/categories', authenticateMiddleware, (req, res) => {
   Category.findAll().then(categories => {
      res.render('admin/categories/index', {categories: categories});
   });
});

router.get('/admin/categories/new', authenticateMiddleware, (req, res) => {
   res.render('admin/categories/new');
});

router.post('/categories/save', authenticateMiddleware, (req, res) => {
   const title = req.body.title;
   
   if (title != undefined) {    
      Category.create({
         title: title,
         slug: slugify(title).toLowerCase()
      }).then(() =>{
         res.redirect('/admin/categories/');
      });
   } else {
      res.redirect('/admin/categories/new');
   }
});

router.get('/admin/categories/:id/edit', authenticateMiddleware, (req, res) => {
   const id = req.params.id;

   if(isNaN(id)) {
      res.redirect('/admin/categories');
   }

   Category.findByPk(id).then(category => {
      if (category != undefined) {
         res.render('admin/categories/edit', {category: category});
      } else {
         res.redirect('/admin/categories/new');
      }
   });
});

router.post('/categories/update', authenticateMiddleware, (req, res) => {
   const id = req.body.id;
   const title = req.body.title;

   Category.update({title: title, slug: slugify(title).toLowerCase()}, {
      where: {
         id: id
      }
   }).then(() => {
      res.redirect('/admin/categories');
   });
});

router.post('/categories/delete', authenticateMiddleware, (req, res) => {
   const id = req.body.id;
   if (id != undefined) {
      if(!isNaN(id)) {
         Category.destroy({
            where: {
               id: id
            }
         }).then(() => {
            res.redirect('/admin/categories');
         });
      } else {
         res.redirect('/admin/categories');
      }
   } else {
      res.redirect('/admin/categories');
   }
});

module.exports = router;