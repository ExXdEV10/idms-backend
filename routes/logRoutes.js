// routes/logRoutes.js
const express = require('express');
const logController = require('../controllers/logController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all logs (protected route)
router.get('/logs', authenticate, logController.getAllLogs);

router.get('/logs/threats-report', authenticate, logController.downloadThreatsReport);

// Generate logs report (protected route)
router.get('/logs/report', authenticate, logController.generateLogsReport);


module.exports = router;
