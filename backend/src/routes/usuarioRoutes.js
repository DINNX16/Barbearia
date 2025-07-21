// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router(); // Cria uma instância de Router do Express
const usuarioController = require('../controllers/usuarioController'); // Importa o controlador de usuários

// Este módulo exporta uma função que recebe 'models' como argumento.
// Isso permite que você passe seus modelos Sequelize para as rotas,
// e então os controllers possam acessá-los via req.app.get('models').
module.exports = (models) => {
  // Middleware para anexar os 'models' ao objeto 'req.app' (global da aplicação Express)
  // Isso torna os modelos acessíveis em todos os controladores que usam este router.
  router.use((req, res, next) => {
    req.app.set('models', models); // Armazena os modelos no objeto app do Express
    next(); // Continua para a próxima middleware/rota
  });

  // Definir as rotas para o recurso 'usuários'

  // Rota para obter todos os usuários
  // Método: GET
  // URL esperada: /api/usuarios
  router.get('/', usuarioController.getAllUsers);

  // Rota para obter um usuário específico por ID
  // Método: GET
  // URL esperada: /api/usuarios/:id
  router.get('/:id', usuarioController.getUserById);

  // Rota para criar um novo usuário
  // Método: POST
  // URL esperada: /api/usuarios
  router.post('/', usuarioController.createUser);

  // Rota para atualizar um usuário existente por ID
  // Método: PUT
  // URL esperada: /api/usuarios/:id
  router.put('/:id', usuarioController.updateUser);

  // Rota para deletar um usuário por ID
  // Método: DELETE
  // URL esperada: /api/usuarios/:id
  router.delete('/:id', usuarioController.deleteUser);

  return router; // Retorna o router configurado
};
