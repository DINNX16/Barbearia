// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

// Mude para uma função de fábrica que recebe 'prisma'
module.exports = (prisma) => {
  const router = express.Router(); // Cria o router DENTRO da função

  // Middleware para anexar a instância 'prisma' ao objeto 'req.app'
  // Este middleware é importante para que o authController.login possa acessar o prisma.
  router.use((req, res, next) => {
    req.app.set('prisma', prisma);
    next();
  });

  // Rota para o login do usuário
  router.post('/login', authController.login);

  return router; // Retorna a instância do router
};