// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
// Certifique-se de que o caminho para o controlador está correto e que ele exporta um objeto
// <<<< MUDANÇA AQUI: Importação direta das funções do controlador
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/usuarioController');

// Este módulo exporta uma função que recebe 'prisma' como argumento.
// Isso permite que você passe a instância do PrismaClient para as rotas,
// e então os controllers possam acessá-la via req.app.get('prisma').
module.exports = (prisma) => {
  // Middleware para anexar a instância 'prisma' ao objeto 'req.app'
  router.use((req, res, next) => {
    req.app.set('prisma', prisma);
    next();
  });

  // Definir as rotas para o recurso 'usuários'
  // <<<< MUDANÇA AQUI: Usando as funções importadas diretamente
  router.get('/', getAllUsers);
  router.get('/:id', getUserById);
  router.post('/', createUser);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  return router;
};
