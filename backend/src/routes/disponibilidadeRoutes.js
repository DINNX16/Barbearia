const express = require('express');
const router = express.Router();

// Importa o controlador de disponibilidade
const disponibilidadeController = require('../controllers/disponibilidadeController');

// Rota para criar uma nova disponibilidade para um profissional
router.post('/', disponibilidadeController.createDisponibilidade);

// Rota para listar todas as disponibilidades de UM profissional específico
router.get('/profissional/:id_profissional', disponibilidadeController.getDisponibilidadesPorProfissional);

// Rota para atualizar uma disponibilidade específica (usando o ID da própria disponibilidade)
router.put('/:id', disponibilidadeController.updateDisponibilidade);

// Rota para deletar uma disponibilidade específica
router.delete('/:id', disponibilidadeController.deleteDisponibilidade);

module.exports = router;