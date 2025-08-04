// src/controllers/pagamentosController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inicializa o Stripe com a chave secreta do arquivo .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const pagamentosController = {};

// A lógica de negócio agora vive dentro desta função no controller
pagamentosController.createCheckoutSession = async (req, res) => {
    // 1. RECEBE A LISTA DE ITENS DO FRONTEND
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'A lista de itens não pode estar vazia.' });
    }

    try {
        // 2. BUSCA OS PREÇOS REAIS NO BANCO DE DADOS
        const productIds = items.map(item => parseInt(item.id));
        const produtosDoBanco = await prisma.produto.findMany({
            where: {
                id_produto: { in: productIds }
            }
        });

        // 3. MONTA OS ITENS PARA O STRIPE COM OS PREÇOS SEGUROS
        const line_items = items.map(itemCarrinho => {
            const produtoCorrespondente = produtosDoBanco.find(p => p.id_produto === parseInt(itemCarrinho.id));
            if (!produtoCorrespondente) {
                throw new Error(`Produto com ID ${itemCarrinho.id} não encontrado.`);
            }

            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: produtoCorrespondente.nome,
                    },
                    unit_amount: Math.round(parseFloat(produtoCorrespondente.preco_venda) * 100),
                },
                quantity: itemCarrinho.quantity,
            };
        });
        
        // 4. CRIA A SESSÃO DE CHECKOUT
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'boleto'],
            mode: 'payment',
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL || 'http://127.0.0.1:5501'}/sucesso.html`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://127.0.0.1:5501'}/carrinho.html`,
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error("Erro ao criar sessão de checkout do Stripe:", error);
        res.status(500).json({ error: 'Falha ao iniciar o pagamento.', details: error.message });
    }
};

module.exports = pagamentosController;