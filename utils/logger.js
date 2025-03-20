// utils/logger.js
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Log level (e.g., info, warn, error)
  format: combine(
    timestamp(), // Add timestamp to logs
    logFormat // Apply the custom log format
  ),
  transports: [
    // Log to a file (remove the console transport)
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

module.exports = logger;