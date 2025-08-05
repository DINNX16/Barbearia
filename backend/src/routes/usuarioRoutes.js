// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

module.exports = (prisma) => {
  router.use((req, res, next) => {
    req.app.set('prisma', prisma);
    next();
  });

  // =============================================================
  // NOVA ROTA PARA LISTAR OS PROFISSIONAIS
  // =============================================================
  // Esta rota ficará disponível em GET /api/usuarios/profissionais
  router.get('/profissionais', usuarioController.getAllProfessionals);

  // --- Rotas de Upload ---
  router.put('/me/foto-perfil', upload.single('profilePic'), usuarioController.updateProfilePhoto);
  router.put('/me/foto-capa', upload.single('coverPic'), usuarioController.updateCoverPhoto);

  // --- Rotas CRUD Genéricas ---
  router.get('/', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getAllUsers);
  router.get('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getUserById);
  router.put('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.updateUser);
  router.delete('/:id', authorize(['proprietario']), usuarioController.deleteUser);

  return router;
};