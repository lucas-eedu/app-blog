// Import Express
const express = require('express');
// Initializing express
const app = express();
// Import bodyParser
const bodyParser = require('body-parser');
// Import connection with mysql
const connection = require('./database/database');

// Import Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

// Import Models
const Article = require('./articles/Article');
const Category = require('./categories/Category');

// Initializing view engine - EJS
app.set('view engine', 'ejs');

// Initializing static files on public page
app.use(express.static('public'));

// Initializing bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
   .authenticate()
   .then(() => {
      console.log('Conexão feita com sucesso!');
   })
   .catch((error) => {
      console.error(error);
   })

// Informing the application that I want to use the routes from the Controller file
// Note that before calling routes I define a prefix (My route access prefix)
app.use('/', categoriesController);
app.use('/', articlesController);

// Routes
app.get('/', (req, res) => {
   Article.findAll({
      // Sorting articles from newest to oldest
      order: [['id', 'DESC']]
   }).then(articles => {
      Category.findAll().then(categories => {
         res.render('index', {
            articles: articles,
            categories: categories
         });
      });
   });
});

app.get('/about', (req, res) => {
   Category.findAll().then(categories => {
      res.render('about', {
         categories: categories
      });
   });
});

app.get('/:slug', (req, res) => {
   const slug = req.params.slug;
   Article.findOne({ 
      where: {
         slug: slug
      }
   }).then(article => {
      if(article !== undefined) {
         Category.findAll().then(categories => {
            res.render('article', {
               article: article,
               categories: categories
            });
         });
      } else {
         res.redirect('/');
      }
   }).catch(err => {
      res.redirect('/');
   });
});

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
            res.render('category', {articles: category.articles, categories: categories, category});
         });
      } else {
         res.redirect('/');
      }
   }).catch(err => {
      res.redirect('/');
   });
});

// Building Server
app.listen(8000, () => {
   console.log('O servidor está rodando!');
});