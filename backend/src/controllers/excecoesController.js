const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. CRIAR uma nova exceção
exports.createExcecao = async (req, res) => {
  try {
    const { id_profissional, data_inicio, data_fim, motivo, hora_inicio, hora_fim } = req.body;

    if (!id_profissional || !data_inicio || !data_fim) {
      return res.status(400).json({ error: 'id_profissional, data_inicio e data_fim são obrigatórios.' });
    }

    const novaExcecao = await prisma.excecoes_disponibilidade.create({
      data: {
        id_profissional: parseInt(id_profissional),
        data_inicio: new Date(data_inicio),
        data_fim: new Date(data_fim),
        motivo: motivo,
        // Campos de hora são opcionais, só adicionamos se forem enviados
        hora_inicio: hora_inicio ? new Date(hora_inicio) : null,
        hora_fim: hora_fim ? new Date(hora_fim) : null,
      },
    });

    res.status(201).json(novaExcecao);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(404).json({ error: `O profissional com id ${req.body.id_profissional} não foi encontrado.` });
    }
    res.status(500).json({ error: 'Não foi possível criar a exceção de disponibilidade.', details: error.message });
  }
};

// 2. LER todas as exceções de um profissional
exports.getExcecoesPorProfissional = async (req, res) => {
  try {
    const { id_profissional } = req.params;
    const excecoes = await prisma.excecoes_disponibilidade.findMany({
      where: {
        id_profissional: parseInt(id_profissional),
      },
      orderBy: {
        data_inicio: 'asc',
      },
    });

    res.status(200).json(excecoes);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as exceções.', details: error.message });
  }
};

// 3. ATUALIZAR uma exceção
exports.updateExcecao = async (req, res) => {
  try {
    const { id } = req.params; // id da exceção
    const { data_inicio, data_fim, motivo, hora_inicio, hora_fim } = req.body;

    const dadosParaAtualizar = {};
    if (data_inicio) dadosParaAtualizar.data_inicio = new Date(data_inicio);
    if (data_fim) dadosParaAtualizar.data_fim = new Date(data_fim);
    if (motivo) dadosParaAtualizar.motivo = motivo;
    if (hora_inicio) dadosParaAtualizar.hora_inicio = new Date(hora_inicio);
    if (hora_fim) dadosParaAtualizar.hora_fim = new Date(hora_fim);

    const excecaoAtualizada = await prisma.excecoes_disponibilidade.update({
      where: { id_excecao: parseInt(id) },
      data: dadosParaAtualizar,
    });

    res.status(200).json(excecaoAtualizada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exceção não encontrada para atualização.' });
    }
    res.status(500).json({ error: 'Não foi possível atualizar a exceção.', details: error.message });
  }
};

// 4. DELETAR uma exceção
exports.deleteExcecao = async (req, res) => {
  try {
    const { id } = req.params; // id da exceção

    await prisma.excecoes_disponibilidade.delete({
      where: { id_excecao: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exceção não encontrada para exclusão.' });
    }
    res.status(500).json({ error: 'Não foi possível deletar a exceção.', details: error.message });
  }
};