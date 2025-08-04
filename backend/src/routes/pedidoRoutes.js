// src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Define a rota para buscar os pedidos do usuário logado.
router.get('/meus-pedidos', pedidoController.getMeusPedidos);

module.exports = router;