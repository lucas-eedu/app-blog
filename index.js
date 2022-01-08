// Import Express
const express = require('express');
// Initializing express
const app = express();
// Import bodyParser
const bodyParser = require('body-parser');
// Import express session
const session = require('express-session');
// Import connection with mysql
const connection = require('./database/database');
// Import path
const path = require("path");

// Import Controllers
const categoriesController = require('./app/Domains/categories/Controllers/CategoriesController');
const articlesController = require('./app/Domains/articles/Controllers/ArticlesController');
const usersController = require('./app/Domains/users/Controllers/UsersController');

// Import Models
const Article = require('./app/Domains/articles/Models/Article');
const Category = require('./app/Domains/categories/Models/Category');
const User = require('./app/Domains/users/Models/User');

app.set("views", path.join(__dirname, "views"));
// Initializing view engine - EJS
app.set('view engine', 'ejs');

// Initializing express session
app.use(session({
   // The secret is used to compute a hash against the session ID
   secret: 'RW@RY$QeDdDe',
   // Similar to session expiration, you can also expire the cookie that was sent to the browser.
   cookie: {maxAge: 28800000}
}));

// Initializing static files on public page
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));
// app.use('/tinymce', express.static(__dirname + '/public/tinymce'));
app.use('/fontawesome', express.static(__dirname + '/public/fontawesome'));

// Initializing bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
   .authenticate()
   .then(() => {
      console.log('Conexão feita com sucesso!');
      runServer();
   })
   .catch((error) => {
      console.error(error);
   })

// Informing the application that I want to use the routes from the Controller file
// Note that before calling routes I define a prefix (My route access prefix)
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

// Home Route
app.get('/', (req, res) => {
   Article.findAll({
      // Sorting articles from newest to oldest
      order: [['id', 'DESC']],
      // Returning the last 4 posts
      limit: 4
   }).then(articles => {
      Category.findAll().then(categories => {
         Article.findAll({
            // Sorting articles from newest to oldest
            order: [['id', 'DESC']],
            // Returning the last 3 posts
            limit: 3
         }).then(recentArticles => {
            res.render('index', {
               articles: articles,
               categories: categories,
               recentArticles: recentArticles
            });
         });
      });
   });
});

// Pagination Route
app.get('/page/:num', (req, res) => {
   const page = req.params.num;
   let offset = 0;

   if(isNaN(page) || page == 1) {
      offset = 0;
   } else {
      offset = (parseInt(page) - 1) * 4;
   }

   Article.findAndCountAll({
      order: [['id', 'DESC']],
      limit: 4,
      offset: offset
   }).then(articles => {
      let next;

      if(offset + 4 >= articles.count) {
         next = false;
      } else {
         next = true;
      }

      let result = {
         page: parseInt(page),
         next: next,
         articles: articles
      }

      Category.findAll().then(categories => {
         Article.findAll({
            // Sorting articles from newest to oldest
            order: [['id', 'DESC']],
            // Returning the last 3 posts
            limit: 3
         }).then(recentArticles => {
            res.render('pagination', {
               result: result,
               categories: categories,
               recentArticles: recentArticles
            });
         });
      });
   });
});

// About Route
app.get('/about', (req, res) => {
   Category.findAll().then(categories => {
      Article.findAll({
         // Sorting articles from newest to oldest
         order: [['id', 'DESC']],
         // Returning the last 3 posts
         limit: 3
      }).then(recentArticles => {
         res.render('about', {
            categories: categories,
            recentArticles: recentArticles
         });
      });
   });
});

// Single Post Route
app.get('/:slug', (req, res) => {
   const slug = req.params.slug;
   Article.findOne({ 
      where: {
         slug: slug
      }
   }).then(article => {
      if(article !== undefined) {
         Category.findAll().then(categories => {
            Article.findAll({
               // Sorting articles from newest to oldest
            order: [['id', 'DESC']],
            // Returning the last 3 posts
            limit: 3
            }).then(recentArticles => {
               res.render('article', {
                  article: article,
                  categories: categories,
                  recentArticles: recentArticles
               });
            });
         });
      } else {
         res.redirect('/');
      }
   }).catch(err => {
      res.redirect('/');
   });
});

// Category Posts Route
app.get('/category/:slug', (req, res) => {
   const slug = req.params.slug;
   Category.findOne({
      where: {
         slug: slug
      },
      include: [{model: Article}]
   }).then(category => {
      if(category !== undefined) {
         Category.findAll().then(categories => {
            Article.findAll({
               // Sorting articles from newest to oldest
               order: [['id', 'DESC']],
               // Returning the last 3 posts
               limit: 3
            }).then(recentArticles => {
               res.render('category', {
                  articles: category.articles, 
                  categories: categories, 
                  category: category,
                  recentArticles: recentArticles
               });
            });
         });
      } else {
         res.redirect('/');
      }
   }).catch(err => {
      res.redirect('/');
   });
});

// Building Server
const runServer = () => {
   app.listen(8080, () => console.log('O servidor está rodando!'));
}