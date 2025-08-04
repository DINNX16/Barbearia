// src/controllers/pedidoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pedidoController = {};

// Função para buscar todos os pedidos do usuário logado
pedidoController.getMeusPedidos = async (req, res) => {
    try {
        const userId = req.user.id_usuario;

        const pedidos = await prisma.pedido.findMany({
            where: {
                id_cliente: userId,
            },
            include: {
                item_pedido: {
                    include: {
                        produto: {
                            select: {
                                nome: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                data_hora_pedido: 'desc',
            },
        });

        // Formatamos os dados para o frontend
        const pedidosFormatados = pedidos.map(p => {
            const nomesProdutos = p.item_pedido.map(item => item.produto.nome).join(', ');
            return {
                id: p.id_pedido,
                produto: nomesProdutos,
                data: p.data_hora_pedido,
                preco: p.valor_total,
                status: p.status,
            }
        });
        
        res.status(200).json(pedidosFormatados);

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ message: 'Erro ao buscar histórico de compras.', error: error.message });
    }
};

module.exports = pedidoController;