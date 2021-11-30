// Import Express
const express = require('express');
// Express feature that allows you to create routes without the need to use the "app" variable
const router = express.Router();

// Category Routes
router.get('/categories', (req, res) => {
   res.send('Rota de categorias');
});

router.get('/admin/categories/new', (req, res) => {
   res.send('Rota para criar uma nova categoria');
});

module.exports = router;