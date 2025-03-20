// controllers/threatController.js
const Threat = require('../models/Threat');
const snort = require('../config/snort'); // Import the snort service from config folder
const logger = require('../utils/logger');

// Log a new threat
exports.logThreat = async (req, res) => {
  try {
    const { type, severity, sourceIP, description } = req.body;

    // Create a new threat
    const threat = new Threat({ type, severity, sourceIP, description });
    await threat.save();

    res.status(201).json({ message: 'Threat logged successfully', threat });
  } catch (error) {
    logger.error(`Error logging threat: ${error.message}`);
    res.status(500).json({ message: 'Error logging threat', error });
  }
};

// Get all threats
exports.getAllThreats = async (req, res) => {
  try {
    const threats = await Threat.find();
    res.status(200).json(threats);
  } catch (error) {
    logger.error(`Error fetching threats: ${error.message}`);
    res.status(500).json({ message: 'Error fetching threats', error });
  }
};

// Run SNORT and detect threats
exports.detectThreats = async (req, res) => {
  try {
    const { configPath } = req.body;

    // Run SNORT
    snort.runSnort(configPath, (error, threats) => {
      if (error) {
        logger.error(`Error detecting threats: ${error.message}`);
        return res.status(500).json({ message: 'Error detecting threats', error });
      }

      // Log the detected threats
      logger.info(`Detected ${threats.length} threats`);
      res.status(200).json({ message: 'Threats detected successfully', threats });
    });
  } catch (error) {
    logger.error(`Error detecting threats: ${error.message}`);
    res.status(500).json({ message: 'Error detecting threats', error });
  }
};