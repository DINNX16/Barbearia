// src/routes/agendamentoRoutes.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rota para buscar os agendamentos do usuário logado
router.get('/meus-agendamentos', agendamentoController.getMeusAgendamentos);

// NOVA ROTA: Criar um novo agendamento
router.post('/', agendamentoController.createAgendamento);

module.exports = router;