// controllers/galeriaController.js

// GET /api/galeria - Listar todas as fotos/cards
const getAllFotos = async (req, res) => {
  const prisma = req.app.get('prisma');
  try {
    const fotos = await prisma.galeria_fotos.findMany({ orderBy: { id_foto: 'desc' } });
    res.status(200).json(fotos);
  } catch (error) {
    console.error("Erro ao buscar fotos da galeria:", error);
    res.status(500).json({ error: 'Erro ao buscar fotos.' });
  }
};

// POST /api/galeria - Criar uma nova foto/card
const createFoto = async (req, res) => {
  const prisma = req.app.get('prisma');
  // Usando os nomes das colunas que criamos no schema
  const { imagem_caminho, titulo, descricao, valor, ativo } = req.body;
  try {
    const novaFoto = await prisma.galeria_fotos.create({
      data: {
        imagem_caminho,
        titulo,
        descricao,
        valor,
        ativo,
        tipo_servico,
        id_barbearia: 1 // Assumindo o ID 1 para a barbearia, ajuste se necessário
      }
    });
    res.status(201).json(novaFoto);
  } catch (error) {
    console.error("Erro ao criar foto na galeria:", error);
    res.status(500).json({ error: 'Erro ao criar foto.' });
  }
};

// PUT /api/galeria/:id - Atualizar uma foto/card
const updateFoto = async (req, res) => {
  const prisma = req.app.get('prisma');
  const { id } = req.params;
  const { imagem_caminho, titulo, descricao, valor, ativo, tipo_servico } = req.body;
  try {
    const fotoAtualizada = await prisma.galeria_fotos.update({
      where: { id_foto: parseInt(id) },
      data: { imagem_caminho, titulo, descricao, valor, ativo }
    });
    res.status(200).json(fotoAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar foto na galeria:", error);
    res.status(500).json({ error: 'Erro ao atualizar foto.' });
  }
};

// DELETE /api/galeria/:id - Deletar uma foto/card
const deleteFoto = async (req, res) => {
  const prisma = req.app.get('prisma');
  const { id } = req.params;
  try {
    await prisma.galeria_fotos.delete({
      where: { id_foto: parseInt(id) }
    });
    res.status(204).send(); // Resposta de sucesso sem conteúdo
  } catch (error) {
    console.error("Erro ao deletar foto na galeria:", error);
    res.status(500).json({ error: 'Erro ao deletar foto.' });
  }
};

module.exports = { getAllFotos, createFoto, updateFoto, deleteFoto };