// ./routes/pagamentoRoutes.js

const express = require('express');
const router = express.Router();

// Inicializa o Stripe com a chave secreta do arquivo .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Este módulo já exporta o router configurado
router.post('/create-checkout-session', async (req, res) => {
  // Para este exemplo, o preço virá do corpo da requisição.
  // IMPORTANTE: Em um app real, para segurança, você buscaria o preço do serviço
  // no seu banco de dados usando o Prisma para evitar que o usuário manipule o valor.
  const { amount } = req.body; // Espera um valor em centavos (ex: 5000 para R$ 50,00)

  if (!amount) {
    return res.status(400).send({ error: 'O valor (amount) é obrigatório.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Agendamento de Serviço',
            description: 'Pagamento de serviço na Barbearia do Projeto',
          },
          unit_amount: amount, // Usa o valor enviado pelo front-end
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/sucesso.html`, // URL de sucesso
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,   // URL de cancelamento
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout do Stripe:", error);
    res.status(500).json({ error: 'Falha ao iniciar o pagamento.' });
  }
});

module.exports = router; // Exporta o router diretamente