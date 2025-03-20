// app.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const threatRoutes = require('./routes/threatRoutes');
const logRoutes = require('./routes/logRoutes'); // Import logRoutes
const logger = require('./utils/logger'); // Import the logger
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/logs', logRoutes); // Mount logRoutes

// Base route
app.get('/', (req, res) => {
  res.send('IMDS Backend is running!');
});

// Log all mounted routes for debugging
app.use((req, res, next) => {
  logger.info('Mounted Routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      logger.info(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Routes registered on a router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          logger.info(`${handler.route.stack[0].method.toUpperCase()} /api${middleware.regexp.source.replace('\\/', '').replace('(?=\\/|$)', '')}${handler.route.path}`);
        }
      });
    }
  });
  next();
});

// Handle 404 errors
app.use((req, res) => {
  logger.warn(`404: Route not found - ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Export the app
module.exports = app;