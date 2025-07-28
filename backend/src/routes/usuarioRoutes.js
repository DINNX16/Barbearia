// src/routes/usuarioRoutes.js
console.log('DEBUG: Arquivo usuarioRoutes.js carregado.');
const express = require('express');
const router = express.Router();
// Importa as funções do controlador de usuários
const usuarioController = require('../controllers/usuarioController'); 
const { authorize } = require('../middlewares/authMiddleware');

module.exports = (prisma) => {
  router.use((req, res, next) => {
    req.app.set('prisma', prisma);
    next();
  });

  // Rotas de Usuários PROTEGIDAS (POST /api/usuarios foi movido para app.js como rota pública)
  router.get('/', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getAllUsers);
  router.get('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getUserById);
  router.put('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.updateUser);
  router.delete('/:id', authorize(['proprietario']), usuarioController.deleteUser);

  return router;
};
