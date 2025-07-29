const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função auxiliar para validar se uma string é uma data válida
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Função auxiliar para validar se hora_inicio é anterior a hora_fim
const isValidTimeRange = (hora_inicio, hora_fim) => {
  const inicio = new Date(hora_inicio);
  const fim = new Date(hora_fim);
  return inicio < fim;
};

// 1. CRIAR uma nova disponibilidade (POST /api/disponibilidades)
exports.createDisponibilidade = async (req, res) => {
  try {
    const { id_profissional, dia_semana, hora_inicio, hora_fim } = req.body;

    // Validação dos dados de entrada
    if (id_profissional === undefined || dia_semana === undefined || !hora_inicio || !hora_fim) {
      return res.status(400).json({ error: 'id_profissional, dia_semana, hora_inicio e hora_fim são obrigatórios.' });
    }

    // Validação do dia da semana (assumindo 0-6, onde 0 = domingo)
    const diaSemanaNum = parseInt(dia_semana);
    if (isNaN(diaSemanaNum) || diaSemanaNum < 0 || diaSemanaNum > 6) {
      return res.status(400).json({ error: 'dia_semana deve ser um número entre 0 e 6.' });
    }

    // Validação das datas
    if (!isValidDate(hora_inicio) || !isValidDate(hora_fim)) {
      return res.status(400).json({ error: 'hora_inicio e hora_fim devem ser datas válidas no formato ISO 8601.' });
    }

    // Validação do intervalo de tempo
    if (!isValidTimeRange(hora_inicio, hora_fim)) {
      return res.status(400).json({ error: 'hora_inicio deve ser anterior a hora_fim.' });
    }

    const novaDisponibilidade = await prisma.disponibilidade_profissional.create({
      data: {
        id_profissional: parseInt(id_profissional),
        dia_semana: diaSemanaNum,
        // O Prisma espera um objeto Date completo, mesmo para campos Time.
        // Enviamos a data no formato ISO 8601 para garantir a compatibilidade.
        hora_inicio: new Date(hora_inicio),
        hora_fim: new Date(hora_fim),
      },
    });

    res.status(201).json(novaDisponibilidade);
  } catch (error) {
    // Verifica se o erro é por uma chave estrangeira inválida (profissional não existe)
    if (error.code === 'P2003') {
        return res.status(404).json({ error: `O profissional com id ${req.body.id_profissional} não foi encontrado.` });
    }
    res.status(500).json({ error: 'Não foi possível criar a disponibilidade.', details: error.message });
  }
};

// 2. LER todas as disponibilidades de um profissional (GET /api/disponibilidades/profissional/:id_profissional)
exports.getDisponibilidadesPorProfissional = async (req, res) => {
  try {
    const { id_profissional } = req.params;

    // Validação do parâmetro
    const idProfissional = parseInt(id_profissional);
    if (isNaN(idProfissional)) {
      return res.status(400).json({ error: 'id_profissional deve ser um número válido.' });
    }

    const disponibilidades = await prisma.disponibilidade_profissional.findMany({
      where: {
        id_profissional: idProfissional,
      },
      orderBy: {
        dia_semana: 'asc', // Ordena pelo dia da semana
      },
    });

    if (disponibilidades.length === 0) {
      return res.status(404).json({ message: 'Nenhuma disponibilidade encontrada para este profissional.' });
    }

    res.status(200).json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as disponibilidades.', details: error.message });
  }
};

// 3. ATUALIZAR uma disponibilidade (PUT /api/disponibilidades/:id)
exports.updateDisponibilidade = async (req, res) => {
  try {
    const { id } = req.params; // id da disponibilidade
    const { dia_semana, hora_inicio, hora_fim } = req.body;

    // Validação do ID
    const idDisponibilidade = parseInt(id);
    if (isNaN(idDisponibilidade)) {
      return res.status(400).json({ error: 'ID da disponibilidade deve ser um número válido.' });
    }

    // Constrói o objeto de dados apenas com os campos fornecidos
    const dadosParaAtualizar = {};
    
    if (dia_semana !== undefined) {
      const diaSemanaNum = parseInt(dia_semana);
      if (isNaN(diaSemanaNum) || diaSemanaNum < 0 || diaSemanaNum > 6) {
        return res.status(400).json({ error: 'dia_semana deve ser um número entre 0 e 6.' });
      }
      dadosParaAtualizar.dia_semana = diaSemanaNum;
    }
    
    if (hora_inicio) {
      if (!isValidDate(hora_inicio)) {
        return res.status(400).json({ error: 'hora_inicio deve ser uma data válida no formato ISO 8601.' });
      }
      dadosParaAtualizar.hora_inicio = new Date(hora_inicio);
    }
    
    if (hora_fim) {
      if (!isValidDate(hora_fim)) {
        return res.status(400).json({ error: 'hora_fim deve ser uma data válida no formato ISO 8601.' });
      }
      dadosParaAtualizar.hora_fim = new Date(hora_fim);
    }

    // Validação do intervalo de tempo se ambos os horários estão sendo atualizados
    if (hora_inicio && hora_fim && !isValidTimeRange(hora_inicio, hora_fim)) {
      return res.status(400).json({ error: 'hora_inicio deve ser anterior a hora_fim.' });
    }

    const disponibilidadeAtualizada = await prisma.disponibilidade_profissional.update({
      where: { id_disponibilidade: idDisponibilidade },
      data: dadosParaAtualizar,
    });

    res.status(200).json(disponibilidadeAtualizada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Disponibilidade não encontrada para atualização.' });
    }
    res.status(500).json({ error: 'Não foi possível atualizar a disponibilidade.', details: error.message });
  }
};

// 4. DELETAR uma disponibilidade (DELETE /api/disponibilidades/:id)
exports.deleteDisponibilidade = async (req, res) => {
  try {
    const { id } = req.params; // id da disponibilidade

    // Validação do ID
    const idDisponibilidade = parseInt(id);
    if (isNaN(idDisponibilidade)) {
      return res.status(400).json({ error: 'ID da disponibilidade deve ser um número válido.' });
    }

    await prisma.disponibilidade_profissional.delete({
      where: { id_disponibilidade: idDisponibilidade },
    });

    res.status(204).send(); // Sucesso, sem conteúdo
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Disponibilidade não encontrada para exclusão.' });
    }
    res.status(500).json({ error: 'Não foi possível deletar a disponibilidade.', details: error.message });
  }
};