// services/threatService.js
const { exec } = require('child_process');
const Threat = require('../models/Threat');
const logger = require('../utils/logger');

// Function to parse SNORT output
const parseSnortOutput = (output) => {
  const threats = [];
  const lines = output.split('\n');

  lines.forEach((line) => {
    if (line.includes('[**]')) {
      const threatType = line.match(/\[(.*?)\]/g)[1].replace(/\[|\]/g, '').trim();
      const sourceIP = line.match(/\d+\.\d+\.\d+\.\d+/g)[0];
      const description = line.split('\n')[1] || 'No description';

      threats.push({
        type: threatType,
        severity: 'medium', // Default severity
        sourceIP,
        description,
      });
    }
  });

  return threats;
};

// Function to run SNORT and detect threats
exports.runSnort = (configPath, callback) => {
  const command = `snort -c ${configPath}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error running SNORT: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      logger.error(`SNORT stderr: ${stderr}`);
      return callback(new Error(stderr));
    }

    // Parse the SNORT output
    const threats = parseSnortOutput(stdout);

    // Log detected threats to the database
    try {
      await Threat.insertMany(threats);
      logger.info(`Logged ${threats.length} threats to the database`);
      callback(null, threats);
    } catch (err) {
      logger.error(`Error logging threats to the database: ${err.message}`);
      callback(err);
    }
  });
};