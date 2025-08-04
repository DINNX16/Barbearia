// src/routes/agendamentoRoutes.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Define a rota para buscar os agendamentos do usuário logado.
// A proteção de token será aplicada no arquivo app.js
router.get('/meus-agendamentos', agendamentoController.getMeusAgendamentos);

module.exports = router;