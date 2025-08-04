// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
dotenv.config();

// ADICIONE AS 3 LINHAS ABAIXO PARA DEPURAR
console.log('--- DEBUG DENTRO DO app.js ---');
console.log('A chave do Stripe é:', process.env.STRIPE_SECRET_KEY);
console.log('---------------------------------');

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Conexão com o banco
prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso via Prisma.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados via Prisma:', err);
    process.exit(1);
  });

// --- MIDDLEWARES GERAIS ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INÍCIO DO BLOCO DE CÓDIGO DO CORS (Aceitando sua versão)
const allowedOrigins = [
  'http://127.0.0.1:5501', 
  'http://localhost:5501'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política CORS para este site não permite acesso da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// FIM DO BLOCO DE CÓDIGO DO CORS

app.use((req, res, next) => {
  req.app.set('prisma', prisma);
  next();
});

// --- IMPORTAÇÃO DOS CONTROLLERS E MIDDLEWARES DE AUTH ---
const authMiddleware = require('./middlewares/authMiddleware');
const verifyToken = authMiddleware.verifyToken;
const usuarioController = require('./controllers/usuarioController');

// --- IMPORTAÇÃO DAS ROTAS (TODAS JUNTAS AQUI) ---
const authRoutes = require('./routes/authRoutes')(prisma);
const protectedUsuarioRoutes = require('./routes/usuarioRoutes')(prisma);
const servicoRoutes = require('./routes/servicoRoutes')(prisma);
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes.js');
const excecoesRoutes = require('./routes/excecoesRoutes.js');
const agendamentoServicoRoutes = require('./routes/agendamentoServicoRoutes.js');
const pagamentoRoutes = require('./routes/pagamentosRoutes');
const produtoRoutes = require('./routes/produtoRoutes'); // <-- NOVA ROTA DE PRODUTOS
const galeriaRoutes = require('./routes/galeriaRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
// --- USO DAS ROTAS ---

// -- ROTAS PÚBLICAS (não precisam de token) --
app.use('/api/auth', authRoutes);
app.post('/api/usuarios', usuarioController.createUser);
app.use('/api/produtos', produtoRoutes); // <-- NOVA ROTA DE PRODUTOS SENDO USADA AQUI

// -- BARREIRA DE AUTENTICAÇÃO --
// Tudo abaixo desta linha será protegido e exigirá um token
app.use('/api', verifyToken);

// -- ROTAS PROTEGIDAS (precisam de token) --
app.use('/api/usuarios', protectedUsuarioRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/disponibilidades', disponibilidadeRoutes);
app.use('/api/excecoes', excecoesRoutes);
app.use('/api/agendamento-servicos', agendamentoServicoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/galeria', galeriaRoutes);
app.use('/api/feedbacks', feedbackRoutes);
// Rota de status para verificar se o servidor está no ar
app.get('/status', (req, res) => {
  res.send('Backend da Barbearia funcionando! Acesse /api/usuarios ou /api/auth para testar a API.');
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

// --- INICIALIZAÇÃO DO SERVIDOR (SEMPRE NO FINAL) ---
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});

// Desconexão do Prisma ao fechar o processo
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
