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

prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso via Prisma.');
    console.log('Modelos gerenciados pelo Prisma Schema. Nenhuma sincronização automática necessária aqui.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados via Prisma:', err);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INÍCIO DO BLOCO DE CÓDIGO DO CORS
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

const authMiddleware = require('./middlewares/authMiddleware');
const verifyToken = authMiddleware.verifyToken;
const authorize = authMiddleware.authorize;

const usuarioController = require('./controllers/usuarioController'); 

const authRoutes = require('./routes/authRoutes')(prisma); 
const protectedUsuarioRoutes = require('./routes/usuarioRoutes')(prisma);
const servicoRoutes = require('./routes/servicoRoutes')(prisma);

app.use('/api/auth', authRoutes);
app.post('/api/usuarios', usuarioController.createUser); 

app.use('/api', verifyToken);

app.use('/api/usuarios', protectedUsuarioRoutes);
app.use('/api/servicos', servicoRoutes); 

app.get('/status', (req, res) => {
  res.send('Backend da Barbearia funcionando! Acesse /api/usuarios ou /api/auth para testar a API.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
