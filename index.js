// Import Express
const express = require('express');
// Initializing express
const app = express();
// Import bodyParser
const bodyParser = require('body-parser');
// Import connection with mysql
const connection = require('./database/database');

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

// Routes
app.get('/', (req, res) => {
   res.render('index');
});

// Building Server
app.listen(8000, () => {
   console.log('O servidor está rodando!');
});