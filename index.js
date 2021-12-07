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
   Article.findAll().then(articles => {
      res.render('index', {articles: articles});
   });
});

// Building Server
app.listen(8000, () => {
   console.log('O servidor está rodando!');
});