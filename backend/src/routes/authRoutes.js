// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware para anexar a instância 'prisma' ao objeto 'req.app'
// Este middleware é redundante se já houver um global no app.js, mas não causa erro.
// Pode ser removido se o middleware global em app.js for suficiente.
router.use((req, res, next) => {
  req.app.set('prisma', req.app.get('prisma')); // Garante que a instância já setada seja usada
  next();
});
// Rota para o login do usuário
router.post('/login', authController.login);
module.exports = router;
