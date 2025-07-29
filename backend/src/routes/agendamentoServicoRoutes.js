const express = require('express');
const router = express.Router();

const agendamentoServicoController = require('../controllers/agendamentoServicoController');

// Rota para ADICIONAR um serviço a um agendamento
// O corpo da requisição (body) deve conter: { "id_agendamento": X, "id_servico": Y }
router.post('/', agendamentoServicoController.adicionarServicoEmAgendamento);

// Rota para LISTAR todos os serviços de um agendamento específico
router.get('/agendamento/:id_agendamento', agendamentoServicoController.getServicosPorAgendamento);

// Rota para REMOVER um serviço de um agendamento
// Note que o ID na URL é o 'id_agendamento_servico' da própria tabela de junção
router.delete('/:id', agendamentoServicoController.removerServicoDeAgendamento);

module.exports = router;