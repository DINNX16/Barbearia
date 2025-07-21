// src/app.js
const express = require('express');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/database'); // Importa as configurações do DB
const dotenv = require('dotenv'); // Importa dotenv para carregar variáveis de ambiente

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000; // Define a porta do servidor, usando a do .env ou 3000 como padrão

// Inicializa a instância do Sequelize
const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    logging: console.log, // Ativa o log de queries SQL no console (útil para debug)
    define: {
      timestamps: false, // Desabilita colunas createdAt e updatedAt por padrão
      freezeTableName: true // Impede o Sequelize de pluralizar os nomes das tabelas
    }
  }
);

// Carrega e associa todos os modelos
// Esta linha chama o seu src/models/index.js, que por sua vez carrega todos os modelos e suas associações
const models = require('./models')(sequelize);

// Testar conexão com o banco de dados e sincronizar modelos
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    // Sincroniza os modelos com o banco de dados.
    // force: false -> Não apaga e recria tabelas se já existirem (preserva seus dados).
    // alter: false -> Não tenta alterar tabelas existentes.
    // Esta configuração é ideal para quando você já tem o DB criado manualmente (com seu SQL dump).
    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log('Modelos sincronizados (ou carregados) com o banco de dados.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ou sincronizar o banco de dados:', err);
    // Em caso de erro crítico na conexão/sincronização, é bom encerrar a aplicação
    process.exit(1); // Encerra o processo Node.js com um código de erro
  });

// Middlewares
app.use(express.json()); // Habilita o Express para parsear o corpo das requisições como JSON
app.use(express.urlencoded({ extended: true })); // Habilita o Express para parsear URL-encoded bodies

// --- Importar e Usar as Rotas da API ---

// Importa as rotas de usuário, passando a instância 'models' para que os controladores possam acessá-la
const usuarioRoutes = require('./routes/usuarioRoutes')(models);

// Define o prefixo '/api/usuarios' para todas as rotas definidas em usuarioRoutes
app.use('/api/usuarios', usuarioRoutes);

// --- Fim das Rotas da API ---


// Rota de teste simples para verificar se o servidor está online
app.get('/', (req, res) => {
  res.send('Backend da Barbearia funcionando! Acesse /api/usuarios para testar a API.');
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