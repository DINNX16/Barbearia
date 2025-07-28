// src/routes/servicoRoutes.js
const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController'); // Importa o controlador de serviços
const { authorize } = require('../middlewares/authMiddleware'); // Importa o middleware de autorização

module.exports = (prisma) => {
  // Middleware para anexar a instância 'prisma' ao objeto 'req.app'
  router.use((req, res, next) => {
    req.app.set('prisma', prisma);
    next();
  });

  // --- Rotas de Serviços ---

  // Obter todos os serviços (Pode ser acessado por todos os tipos de usuário autenticados)
  // GET /api/servicos
  router.get('/', authorize(['proprietario', 'profissional', 'cliente']), servicoController.getAllServicos);

  // Obter um serviço por ID (Pode ser acessado por todos os tipos de usuário autenticados)
  // GET /api/servicos/:id
  router.get('/:id', authorize(['proprietario', 'profissional', 'cliente']), servicoController.getServicoById);

  // Criar um novo serviço (Apenas Proprietário)
  // POST /api/servicos
  router.post('/', authorize(['proprietario']), servicoController.createServico);

  // Atualizar um serviço (Apenas Proprietário)
  // PUT /api/servicos/:id
  router.put('/:id', authorize(['proprietario']), servicoController.updateServico);

  // Deletar um serviço (Apenas Proprietário)
  // DELETE /api/servicos/:id
  router.delete('/:id', authorize(['proprietario']), servicoController.deleteServico);

  return router;
};
