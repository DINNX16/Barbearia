// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
dotenv.config();

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

// Disponibiliza o prisma para os controllers
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

// Rota de status para verificar se o servidor está no ar
app.get('/status', (req, res) => {
  res.send('Backend da Barbearia funcionando!');
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