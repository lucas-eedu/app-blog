// Import express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();
// Import category model
const Category = require('./Category');
// Import slugify
const slugify = require('slugify');

// Category Routes
router.get('/admin/categories', (req, res) => {
   Category.findAll().then(categories => {
      res.render('admin/categories/index', {categories: categories});
   });
});

router.get('/admin/categories/new', (req, res) => {
   res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {
   const title = req.body.title;
   
   if (title != undefined) {    
      Category.create({
         title: title,
         slug: slugify(title)
      }).then(() =>{
         res.redirect('/');
      });
   } else {
      res.redirect('/admin/categories/new');
   }
});

router.post('/admin/categories/delete', (req, res) => {
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