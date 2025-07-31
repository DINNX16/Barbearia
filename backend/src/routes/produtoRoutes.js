const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  // Rota GET para buscar todos os produtos (versão corrigida e otimizada)
  router.get('/', async (req, res) => {
    try {
      const produtos = await prisma.produto.findMany({
        where: {
          ativo: true // Boa prática: buscar apenas produtos marcados como ativos no banco
        },
        // Otimização: seleciona apenas os campos que o frontend precisa
        select: { 
          id_produto: true,
          nome: true,
          descricao: true,
          preco_venda: true,
          categoria: true
          // Não enviamos dados sensíveis do backend, como 'preco_compra'
        },
        orderBy: {
          nome: 'asc', // CORREÇÃO: ordenando pelo campo 'nome' que existe no seu schema
        },
      });
      res.status(200).json(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({ error: 'Não foi possível buscar os produtos.' });
    }
  });

  return router;
};