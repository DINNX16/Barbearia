const express = require('express');
const router = express.Router();

const excecoesController = require('../controllers/excecoesController');

// Rota para criar uma nova exceção
router.post('/', excecoesController.createExcecao);

// Rota para listar todas as exceções de um profissional específico
router.get('/profissional/:id_profissional', excecoesController.getExcecoesPorProfissional);

// Rota para atualizar uma exceção (pelo ID da exceção)
router.put('/:id', excecoesController.updateExcecao);

// Rota para deletar uma exceção (pelo ID da exceção)
router.delete('/:id', excecoesController.deleteExcecao);

module.exports = router;