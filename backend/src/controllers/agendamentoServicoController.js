const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. ADICIONAR um serviço a um agendamento
exports.adicionarServicoEmAgendamento = async (req, res) => {
  try {
    const { id_agendamento, id_servico } = req.body;

    if (!id_agendamento || !id_servico) {
      return res.status(400).json({ error: 'id_agendamento e id_servico são obrigatórios.' });
    }

    const novaAssociacao = await prisma.agendamento_servico.create({
      data: {
        id_agendamento: parseInt(id_agendamento),
        id_servico: parseInt(id_servico),
      },
    });

    res.status(201).json(novaAssociacao);
  } catch (error) {
    // Erro comum: A combinação de agendamento e serviço já existe
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Este serviço já está associado a este agendamento.' });
    }
    // Erro comum: O agendamento ou o serviço não existem
    if (error.code === 'P2003') {
        return res.status(404).json({ error: 'O agendamento ou o serviço especificado não foi encontrado.' });
    }
    res.status(500).json({ error: 'Não foi possível adicionar o serviço ao agendamento.', details: error.message });
  }
};

// 2. LISTAR todos os serviços de um agendamento
exports.getServicosPorAgendamento = async (req, res) => {
  try {
    const { id_agendamento } = req.params;

    const servicosDoAgendamento = await prisma.agendamento_servico.findMany({
      where: {
        id_agendamento: parseInt(id_agendamento),
      },
      // Usamos 'include' para trazer os detalhes do serviço junto
      include: {
        servico: true,
      },
    });

    res.status(200).json(servicosDoAgendamento);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os serviços do agendamento.', details: error.message });
  }
};

// 3. REMOVER um serviço de um agendamento
exports.removerServicoDeAgendamento = async (req, res) => {
  try {
    // Para remover, precisamos saber o ID da associação (agendamento_servico)
    const { id } = req.params;

    await prisma.agendamento_servico.delete({
      where: {
        id_agendamento_servico: parseInt(id),
      },
    });

    res.status(204).send(); // Sucesso, sem conteúdo
  } catch (error) {
    // Erro comum: A associação a ser deletada não existe
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'A associação entre agendamento e serviço não foi encontrada.' });
    }
    res.status(500).json({ error: 'Não foi possível remover o serviço do agendamento.', details: error.message });
  }
};