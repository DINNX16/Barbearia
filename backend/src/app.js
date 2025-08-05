// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// --- Middlewares Essenciais ---

const allowedOrigins = [
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  'http://127.0.0.1:5500'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('A política CORS não permite este acesso.'));
    }
  }
}));

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.app.set('prisma', prisma);
  next();
});

// --- Importações de Rotas e Controladores ---
const { verifyToken } = require('./middlewares/authMiddleware');
const usuarioController = require('./controllers/usuarioController');
const authRoutes = require('./routes/authRoutes')(prisma);

// =============================================================
// AQUI ESTAVA O ERRO: O nome da variável foi corrigido
// =============================================================
const usuarioRoutes = require('./routes/usuarioRoutes')(prisma); // Corrigido de 'protectedUsuarioRoutes'

const servicoRoutes = require('./routes/servicoRoutes')(prisma);
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes.js');
const excecoesRoutes = require('./routes/excecoesRoutes.js');
const agendamentoServicoRoutes = require('./routes/agendamentoServicoRoutes.js');
const pagamentoRoutes = require('./routes/pagamentosRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const galeriaRoutes = require('./routes/galeriaRoutes');
//const feedbackRoutes = require('./routes/feedbackRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// --- Definição das Rotas ---

// -- ROTAS PÚBLICAS --
app.use('/api/auth', authRoutes);
app.post('/api/usuarios', usuarioController.createUser);
app.use('/api/produtos', produtoRoutes);
app.use('/api/galeria', galeriaRoutes);
//app.use('/api/feedbacks', feedbackRoutes);
// =============================================================
// BLOCO DE TESTE DEFINITIVO PARA FEEDBACKS
// =============================================================
console.log('--- A USAR O BLOCO DE TESTE DIRETO NO APP.JS PARA FEEDBACKS ---');

// Rota GET pública (para a página de avaliações)
app.get('/api/feedbacks', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { data: 'desc' },
      include: { cliente: { include: { pessoa: { select: { nome_completo: true } } } } }
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("ERRO NO GET DE TESTE:", error);
    res.status(500).json({ message: 'Erro no GET de teste.' });
  }
});

// Rota POST protegida (para o formulário de envio)
app.post('/api/feedbacks', verifyToken, async (req, res) => {
  try {
    console.log('--- ROTA POST DE TESTE FOI ACIONADA COM SUCESSO ---');
    const prisma = req.app.get('prisma');
    const { nota, comentario } = req.body;
    const userId = req.user.id_usuario;

    if (!nota) return res.status(400).json({ message: 'Nota é obrigatória.' });

    const pessoa = await prisma.pessoa.findUnique({ where: { id_usuario: userId } });
    const cliente = await prisma.cliente.findFirst({ where: { id_pessoa: pessoa.id_pessoa } });
    if (!cliente) return res.status(403).json({ message: 'Apenas clientes podem avaliar.' });

    const novoFeedback = await prisma.feedback.create({
      data: {
        id_cliente: cliente.id_cliente,
        nota: parseInt(nota),
        comentario: comentario || null,
      }
    });
    res.status(201).json({ message: 'Feedback criado com sucesso pelo teste!', feedback: novoFeedback });
  } catch (error) {
    console.error('ERRO NO POST DE TESTE:', error);
    res.status(500).json({ message: 'Erro no POST de teste.', error: error.message });
  }
});

// -- ROTAS PROTEGIDAS --
// O middleware 'verifyToken' é aplicado individualmente a cada grupo de rotas.
app.use('/api/usuarios', verifyToken, usuarioRoutes); // Agora corresponde ao nome da importação
app.use('/api/servicos', verifyToken, servicoRoutes);
app.use('/api/disponibilidades', verifyToken, disponibilidadeRoutes);
app.use('/api/excecoes', verifyToken, excecoesRoutes);
app.use('/api/agendamento-servicos', verifyToken, agendamentoServicoRoutes);
app.use('/api/pagamentos', verifyToken, pagamentoRoutes);
app.use('/api/agendamentos', verifyToken, agendamentoRoutes);
app.use('/api/pedidos', verifyToken, pedidoRoutes);

// --- Rota de Status e Tratamento de Erros ---
app.get('/status', (req, res) => {
  res.send('Backend da Barbearia funcionando!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

// --- Inicialização do Servidor ---
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
  prisma.$connect()
    .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso via Prisma.'))
    .catch(err => console.error('Não foi possível conectar ao banco de dados via Prisma:', err));
});