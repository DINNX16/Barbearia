// src/routes/feedbackRoutes.js

// =============================================================
// NOSSO TESTE: Esta mensagem TEM que aparecer no terminal do backend
// =============================================================
console.log('--- O ARQUIVO feedbackRoutes.js FOI CARREGADO CORRETAMENTE ---');

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rota PÚBLICA para buscar todos os feedbacks (aceita GET)
router.get('/', feedbackController.getAllFeedbacks);

// Rota PROTEGIDA para criar um novo feedback (aceita POST)
router.post('/', verifyToken, feedbackController.createFeedback);

module.exports = router;