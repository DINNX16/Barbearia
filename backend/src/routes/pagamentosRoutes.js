// src/routes/pagamentosRoutes.js
const express = require('express');
const router = express.Router();

// 1. Importa o nosso novo controller
const pagamentosController = require('../controllers/pagamentosController');

// 2. A rota agora apenas aponta para a função no controller.
// Fica muito mais limpo e legível!
router.post('/create-checkout-session', pagamentosController.createCheckoutSession);

module.exports = router;