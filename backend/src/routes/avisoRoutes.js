// src/routes/avisoRoutes.js
const express = require('express');
const router = express.Router();
const avisoController = require('../controllers/avisoController');
const { authorize } = require('../middlewares/authMiddleware');

module.exports = (prisma) => {
    router.use((req, res, next) => {
        req.app.set('prisma', prisma);
        next();
    });

    // Rotas de Avisos
    
    // Obter todos os avisos (acesso para todos os usuários logados)
    router.get('/', authorize(['proprietario', 'profissional', 'cliente']), avisoController.getAllAvisos);

    // Obter um aviso por ID (acesso para todos os usuários logados)
    router.get('/:id', authorize(['proprietario', 'profissional', 'cliente']), avisoController.getAvisoById);

    // Criar um novo aviso (apenas Proprietário)
    router.post('/', authorize(['proprietario']), avisoController.createAviso);

    // Atualizar um aviso (apenas Proprietário)
    router.put('/:id', authorize(['proprietario']), avisoController.updateAviso);

    // Deletar um aviso (apenas Proprietário)
    router.delete('/:id', authorize(['proprietario']), avisoController.deleteAviso);

    return router;
};
