// src/routes/usuarioRoutes.js
console.log('DEBUG: Arquivo usuarioRoutes.js carregado.');
const express = require('express');
const router = express.Router();
// Importa as funções do controlador de usuários
const usuarioController = require('../controllers/usuarioController'); 
const { authorize } = require('../middlewares/authMiddleware');

// Rotas de Usuários
// A rota de cadastro (POST /) não precisa de autenticação, mas será acessada via /api/usuarios
router.post('/', usuarioController.createUser); 

// Rotas protegidas por autorização (verifyToken já é global no app.js)
router.get('/', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getAllUsers);
router.get('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.getUserById);
router.put('/:id', authorize(['proprietario', 'profissional', 'cliente']), usuarioController.updateUser);
router.delete('/:id', authorize(['proprietario']), usuarioController.deleteUser);

module.exports = router; // Exporta o router diretamente
