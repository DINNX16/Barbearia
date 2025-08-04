// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// A rota POST /api/feedbacks/ vai chamar a função para criar um novo feedback
router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;