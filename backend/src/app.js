// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Altere para 3000 ou 5000, conforme sua preferência

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso via Prisma.');
    console.log('Modelos gerenciados pelo Prisma Schema. Nenhuma sincronização automática necessária aqui.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados via Prisma:', err);
    process.exit(1);
  });

// Middlewares globais de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Middleware para anexar a instância 'prisma' ao objeto 'req.app' ---
// Isso garante que todos os controladores possam acessar o Prisma via req.app.get('prisma')
app.use((req, res, next) => {
  console.log('DEBUG: Middleware app.use(req.app.set(prisma)) executado.'); // Log para verificar execução do middleware
  req.app.set('prisma', prisma);
  next();
});

// --- Importar Middlewares de Autenticação ---
const { verifyToken, authorize } = require('./middlewares/authMiddleware');

// --- Importar Rotas ---
const authRoutes = require('./routes/authRoutes'); // authRoutes agora também espera acessar prisma via req.app.get('prisma')
const usuarioRoutes = require('./routes/usuarioRoutes'); // Não passa 'prisma' diretamente, pois ele já está em req.app
const servicoRoutes = require('./routes/servicoRoutes'); // Assumindo que servicoRoutes também usará req.app.get('prisma')

// --- Definição das Rotas da API ---

// 1. Rotas PÚBLICAS (que NÃO precisam de autenticação)
// Essas rotas devem vir ANTES do middleware verifyToken
app.use('/api/auth', authRoutes); // Rota de login
// Acessa o manipulador da rota POST /api/usuarios diretamente do router de usuarioRoutes
// Isso é necessário porque usuarioRoutes agora exporta o router diretamente, não uma função de fábrica
app.post('/api/usuarios', usuarioRoutes.stack.find(s => s.route && s.route.path === '/' && s.route.methods.post).handle); 

// 2. Middleware de Verificação de Token (para rotas PROTEGIDAS)
// Este middleware será aplicado a TODAS as rotas que passarem por ele
// APÓS as rotas públicas definidas acima.
console.log('DEBUG: Aplicando verifyToken para rotas protegidas.');
app.use('/api', verifyToken); // <<<< APLICAÇÃO DO MIDDLEWARE verifyToken PARA ROTAS PROTEGIDAS

// 3. Rotas PROTEGIDAS (que precisam de autenticação)
// Essas rotas devem vir DEPOIS do middleware verifyToken
app.use('/api/usuarios', usuarioRoutes); // Todas as rotas de usuário (exceto POST) serão protegidas
app.use('/api/servicos', servicoRoutes); // Rotas de serviço serão protegidas

// ... (futuras rotas protegidas como /api/produtos, /api/agendamentos, etc.)


// --- Fim das Rotas da API ---


// Rota de teste simples para verificar se o servidor está online
app.get('/status', (req, res) => {
  res.send('Backend da Barbearia funcionando! Acesse /api/usuarios ou /api/auth para testar a API.');
});


// Tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
