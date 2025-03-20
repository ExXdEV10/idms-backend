// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Import the logger

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    logger.warn('Access denied: No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object

    // Log the successful token verification
    logger.info(`Token verified for user ID: ${decoded.userId}`);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Log the error
    logger.error(`Invalid token: ${error.message}`);

    res.status(400).json({ message: 'Invalid token' });
  }
};