// routes/galeriaRoutes.js
const express = require('express');
const router = express.Router();
const galeriaController = require('../controllers/galeriaController');

// Mapeia cada URL para uma função do controller
router.get('/', galeriaController.getAllFotos);
router.post('/', galeriaController.createFoto);
router.put('/:id', galeriaController.updateFoto);
router.delete('/:id', galeriaController.deleteFoto);

module.exports = router;