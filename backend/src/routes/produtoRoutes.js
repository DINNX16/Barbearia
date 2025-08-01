// routes/produtoRoutes.js

const express = require('express');
const router = express.Router();

// Importa o controller
const produtoController = require('../controllers/produtoController');

// Define que a URL principal (GET /) buscará todos os produtos.
router.get('/', produtoController.getAllProdutos);

// Adicione aqui outras rotas no futuro, como:
// router.get('/:id', produtoController.getProdutoById);

module.exports = router;