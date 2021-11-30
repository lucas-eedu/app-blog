// Import Express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();

// Articles Routes
router.get('/articles', (req, res) => {
   res.send('Rota de artigos');
});

router.get('/admin/articles/new', (req, res) => {
   res.send('Rota para criar um novo artigo');
});

module.exports = router;