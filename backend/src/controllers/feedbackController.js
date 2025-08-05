// src/controllers/feedbackController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const feedbackController = {};

// Função para CRIAR um novo feedback
feedbackController.createFeedback = async (req, res) => {
  try {
    const { nota, comentario } = req.body;
    const userId = req.user.id_usuario; // ID do usuário logado (vem do token)

    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({ message: 'A nota (de 1 a 5) é obrigatória.' });
    }

    // Encontra o perfil de cliente associado ao usuário logado
    const pessoa = await prisma.pessoa.findUnique({ where: { id_usuario: userId } });
    if (!pessoa) {
      return res.status(404).json({ message: 'Perfil de pessoa não encontrado para este usuário.' });
    }

    const cliente = await prisma.cliente.findFirst({ where: { id_pessoa: pessoa.id_pessoa } });
    if (!cliente) {
      return res.status(404).json({ message: 'Apenas clientes podem enviar avaliações.' });
    }

    // Cria o feedback no banco de dados
    const novoFeedback = await prisma.feedback.create({
      data: {
        id_cliente: cliente.id_cliente,
        nota: parseInt(nota),
        comentario: comentario || null, // Comentário é opcional
      }
    });

    res.status(201).json({ message: 'Feedback enviado com sucesso!', feedback: novoFeedback });

  } catch (error) {
    console.error("Erro ao criar feedback:", error);
    res.status(500).json({ message: 'Erro interno ao salvar o feedback.', error: error.message });
  }
};

// Função para LISTAR todos os feedbacks
feedbackController.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        data: 'desc' // Ordena pelos mais recentes primeiro
      },
      include: {
        // Inclui os dados do cliente e da pessoa para mostrar o nome
        cliente: {
          include: {
            pessoa: {
              select: {
                nome_completo: true
              }
            }
          }
        }
      }
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);
    res.status(500).json({ message: 'Erro interno ao buscar feedbacks.', error: error.message });
  }
};

module.exports = feedbackController;