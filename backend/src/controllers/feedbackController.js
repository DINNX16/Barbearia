// controllers/feedbackController.js

const createFeedback = async (req, res) => {
  const prisma = req.app.get('prisma');
  // Pegamos o id_cliente do token JWT do usuário logado
  const id_cliente = req.user.id_cliente;
  const { nota, comentario } = req.body;

  if (!nota) {
    return res.status(400).json({ error: 'A nota é obrigatória.' });
  }

  try {
    const novoFeedback = await prisma.feedback.create({
      data: {
        id_cliente: id_cliente,
        nota: parseInt(nota),
        comentario: comentario
      }
    });
    res.status(201).json(novoFeedback);
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    res.status(500).json({ error: "Não foi possível registrar o feedback." });
  }
};

const getAllFeedbacks = async (req, res) => {
  const prisma = req.app.get('prisma');
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { data: 'desc' }, // Mais recentes primeiro
      include: { // Inclui dados do cliente e da pessoa para exibir o nome
        cliente: {
          select: {
            pessoa: {
              select: { nome_completo: true }
            }
          }
        }
      }
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);
    res.status(500).json({ error: "Erro ao buscar feedbacks." });
  }
};

// Atualize o exports para incluir a nova função
module.exports = {
  createFeedback,
  getAllFeedbacks
};