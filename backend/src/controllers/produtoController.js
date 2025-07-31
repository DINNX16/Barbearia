const express = require('express');
const router = express.Router();

// Importa o controller que acabamos de criar
const produtoController = require('../controllers/produtoController');

// Define que a rota GET para a raiz ('/') será gerenciada pela função getAllProdutos
router.get('/', produtoController.getAllProdutos);

// Exporta o router configurado
module.exports = router;