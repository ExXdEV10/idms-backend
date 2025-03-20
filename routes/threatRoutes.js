// routes/threatRoutes.js
const express = require('express');
const threatController = require('../controllers/threatController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// Log a new threat (protected route)
router.post('/threats', authenticate, threatController.logThreat);

// Get all threats (protected route)
router.get('/threats', authenticate, threatController.getAllThreats);

// Detect threats using SNORT (protected route)
router.post('/threats/detect', authenticate, threatController.detectThreats);

module.exports = router;