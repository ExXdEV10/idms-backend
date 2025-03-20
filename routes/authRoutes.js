// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware'); // Import the authentication middleware
const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Fetch user details (protected route)
router.get('/user', authenticate, authController.getUserDetails);

// Change password (protected route)
router.post('/change-password', authenticate, authController.changePassword);

// Logout (protected route)
router.post('/logout', authenticate, authController.logout);

module.exports = router;