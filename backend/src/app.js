// src/app.js
const express = require('express');
const dotenv = require('dotenv'); // Importa dotenv para carregar variáveis de ambiente
const { PrismaClient } = require('@prisma/client'); // <<<<< NOVO: Importa o PrismaClient

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, usando a do .env ou 3000 como padrão

// Inicializa o Prisma Client
// O PrismaClient se conecta ao banco de dados usando a DATABASE_URL do seu .env
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Ativa logs para ver as queries SQL geradas pelo Prisma
});

// Testar conexão com o banco de dados (usando o Prisma Client)
prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso via Prisma.');
    // Com Prisma, a sincronização do esquema (criação/alteração de tabelas)
    // é feita através de `prisma migrate` ou `prisma db push`,
    // não automaticamente ao iniciar a aplicação como com `sequelize.sync()`.
    console.log('Modelos gerenciados pelo Prisma Schema. Nenhuma sincronização automática necessária aqui.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados via Prisma:', err);
    // Em caso de erro crítico na conexão, é bom encerrar a aplicação
    process.exit(1); // Encerra o processo Node.js com um código de erro
  });

// Middlewares
app.use(express.json()); // Habilita o Express para parsear o corpo das requisições como JSON
app.use(express.urlencoded({ extended: true })); // Habilita o Express para parsear URL-encoded bodies

// --- Importar e Usar as Rotas da API ---

// Importa as rotas de usuário, passando a instância 'prisma' para que os controladores possam acessá-la
// ATENÇÃO: Os controladores e rotas (usuarioController.js, authController.js, etc.)
// precisarão ser atualizados para usar 'prisma' em vez de 'models'
const usuarioRoutes = require('./routes/usuarioRoutes')(prisma);
app.use('/api/usuarios', usuarioRoutes);

// Importa e usa as rotas de autenticação, passando a instância 'prisma'
const authRoutes = require('./routes/authRoutes')(prisma);
app.use('/api/auth', authRoutes); // Prefixo /api/auth para as rotas de autenticação

// --- Fim das Rotas da API ---


// Rota de teste simples para verificar se o servidor está online
app.get('/', (req, res) => {
  res.send('Backend da Barbearia funcionando com Prisma! Acesse /api/usuarios ou /api/auth para testar a API.');
});

// Tratamento de erros genérico (middleware de erro)
app.use((err, req, res, next) => {
  console.error(err.stack); // Loga o erro completo para debug
  res.status(500).send('Algo deu errado no servidor!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});

// Garante que o Prisma Client se desconecte quando a aplicação for encerrada
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
