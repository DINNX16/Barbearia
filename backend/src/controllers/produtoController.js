// controllers/produtoController.js

/**
 * Função para buscar TODOS os produtos.
 */
const getAllProdutos = async (req, res) => {
  const prisma = req.app.get('prisma');
  try {
    const produtos = await prisma.produto.findMany({
      where: { 
        ativo: true // Busca apenas produtos ativos
      },
      select: { // Seleciona apenas os campos que o frontend precisa
        id_produto: true,
        nome: true,
        descricao: true,
        preco_venda: true,
        categoria: true,
        marca: true // <-- Adicionado o campo 'marca' que existe no seu schema
      },
      orderBy: { 
        nome: 'asc' // Ordena pelo campo 'nome'
      }
    });
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
};

/**
 * Função para buscar UM produto pelo seu ID.
 */
const getProdutoById = async (req, res) => {
  const prisma = req.app.get('prisma');
  const { id } = req.params;

  try {
    const produto = await prisma.produto.findUnique({
      where: { id_produto: parseInt(id) },
      select: {
        id_produto: true,
        nome: true,
        descricao: true,
        preco_venda: true,
        categoria: true,
        marca: true, // <-- Adicionado o campo 'marca' aqui também
        quantidade_estoque: true
      }
    });

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ error: "Produto não encontrado." });
    }
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
};

// Exporta as funções para que as rotas possam usá-las
module.exports = {
  getAllProdutos,
  getProdutoById
};  