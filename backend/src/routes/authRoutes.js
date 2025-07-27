// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Este módulo exporta uma função que recebe 'prisma' como argumento.
// Isso permite que você passe a instância do PrismaClient para as rotas,
// e então os controllers possam acessá-la via req.app.get('prisma').
module.exports = (prisma) => { // <<<< MUDANÇA AQUI: recebe 'prisma'
  // Middleware para anexar a instância 'prisma' ao objeto 'req.app'
  router.use((req, res, next) => {
    req.app.set('prisma', prisma); // <<<< MUDANÇA AQUI: setando 'prisma'
    next();
  });

  // Rota para o login do usuário
  router.post('/login', authController.login);

  return router;
};
