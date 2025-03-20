const Log = require('../models/Log');
const Threat = require('../models/Threat');
const reportGenerator = require('../utils/reportGenerator');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('user', 'username email');

    // Log the request
    logger.info('Fetched all logs');

    res.status(200).json(logs);
  } catch (error) {
    // Log the error
    logger.error(`Error fetching logs: ${error.message}`);

    res.status(500).json({ message: 'Error fetching logs', error });
  }
};

// Generate logs report
exports.generateLogsReport = async (req, res) => {
  try {
    const logs = await Log.find().populate('user', 'username email');

    // Log the request
    logger.info('Fetched logs report');

    res.status(200).json(logs);
  } catch (error) {
    // Log the error
    logger.error(`Error fetching logs report: ${error.message}`);

    res.status(500).json({ message: 'Error fetching logs report', error });
  }
};

// Generate and download a threats report
exports.downloadThreatsReport = async (req, res) => {
  try {
    const threats = await Threat.find();

    // Ensure the reports directory exists
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, `threats-report-${Date.now()}.pdf`);

    // Generate the report
    reportGenerator.generateThreatsReport(threats, filePath);

    // Send the file as a response
    res.download(filePath, (err) => {
      if (err) {
        logger.error(`Error downloading threats report: ${err.message}`);
        res.status(500).json({ message: 'Error downloading report' });
      } else {
        // Delete the file after sending
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    // Log the error
    logger.error(`Error generating threats report: ${error.message}`);

    res.status(500).json({ message: 'Error generating report', error });
  }
};