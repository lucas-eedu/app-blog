// Import express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();
// Import user model
const User = require('../Models/User');
// Import bcryptjs
const bcrypt = require('bcryptjs');
// Import Authenticate Middleware
const authenticateMiddleware = require('../../../Middleware/Authenticate');

// User Routes
router.get('/admin/users', authenticateMiddleware, (req, res) => {
   User.findAll().then(users => {
      res.render('admin/users/index', {users: users});
   });
});

router.get('/admin/users/create', authenticateMiddleware, (req, res) => {
   res.render('admin/users/create');
});

router.post('/admin/users/save', authenticateMiddleware, (req, res) => {
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;

   // Checking if the email already exists in our database.
   User.findOne({where: {email: email}}).then((user) => {
      if (user == undefined) {
         // Generating a dynamic configuration for bcrypt to use in the hash
         const salt = bcrypt.genSaltSync(10);
         // Creating the password hash based on the salt setting created in the previous line
         const hash = bcrypt.hashSync(password, salt);
         
         User.create({
            name: name,
            email: email,
            password: hash,
         }).then(() =>{
            res.redirect('/admin/users');
         }).catch((err) => {
            res.redirect('/');
         });
      } else {
         res.redirect('/admin/users/create');
      }
   });
});

router.get('/admin/users/:id/edit', authenticateMiddleware, (req, res) => {
   const id = req.params.id;

   if(isNaN(id)) {
      res.redirect('/admin/users');
   }

   User.findByPk(id).then(user => {
      if (user != undefined) {
         res.render('admin/users/edit', {user: user});
      } else {
         res.redirect('/admin/users/create');
      }
   });
});

router.post('/admin/users/update', authenticateMiddleware, (req, res) => {
   const id = req.body.id;
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;

   // Checking if the email already exists in our database.
   User.findOne({where: {email: email}}).then((user) => {
      // res.json({id, name, password, user});
      
      // Generating a dynamic configuration for bcrypt to use in the hash
      const salt = bcrypt.genSaltSync(10);
      // Creating the password hash based on the salt setting created in the previous line
      const hash = bcrypt.hashSync(password, salt);
      
      User.update({name: name, email: email, password: hash}, {
         where: {
            id: id
         }
      }).then(() =>{
         res.redirect('/admin/users');
      }).catch((err) => {
         res.redirect('/');
      });
      
   });
});

router.post('/admin/users/delete', authenticateMiddleware, (req, res) => {
   const id = req.body.id;
   if (id != undefined) {
      if(!isNaN(id)) {
         User.destroy({
            where: {
               id: id
            }
         }).then(() => {
            res.redirect('/admin/users');
         });
      } else {
         res.redirect('/admin/users');
      }
   } else {
      res.redirect('/admin/users');
   }
});

router.get('/login', (req, res) => {
   res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   User.findOne({where: {email: email}}).then(user => {
      if(user != undefined) {
         // Validating if the entered password is the same as the encrypted password in the database
         const passValidation = bcrypt.compareSync(password, user.password);
         if(passValidation) {
            // Creating a session
            req.session.user = {
               id: user.id,
               email: user.email
            }
            res.redirect('/admin/articles');
         } else {
            res.redirect('/login');   
         }
      } else {
         res.redirect('/login');
      }
   });
});

module.exports = router;