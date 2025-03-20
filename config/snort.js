const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec); // Promisify exec for async/await
const Threat = require('../models/Threat');
const logger = require('../utils/logger');

// Function to parse SNORT output
const parseSnortOutput = (output) => {
  const threats = [];
  const lines = output.split('\n');

  lines.forEach((line, index) => {
    if (line.includes('[**]')) {
      const threatTypeMatch = line.match(/\[(.*?)\]/g);
      const threatType = threatTypeMatch && threatTypeMatch[1]
        ? threatTypeMatch[1].replace(/\[|\]/g, '').trim()
        : 'Unknown';

      const sourceIPMatch = line.match(/\d+\.\d+\.\d+\.\d+/g);
      const sourceIP = sourceIPMatch ? sourceIPMatch[0] : 'Unknown';

      const description = lines[index + 1] || 'No description';

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
exports.runSnort = async (configPath, io, callback) => {
  const networkInterface = process.env.NETWORK_INTERFACE || 'eth0';
  const command = `snort -A console -q -c ${configPath} -i ${networkInterface}`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      logger.error(`SNORT stderr: ${stderr}`);
      return callback(new Error(stderr));
    }

    // Parse the SNORT output
    const threats = parseSnortOutput(stdout);

    // Log detected threats to the database
    await Threat.insertMany(threats);
    logger.info(`Logged ${threats.length} threats to the database`);

    // Emit real-time alerts for each detected threat
    threats.forEach((threat) => {
      io.emit('threatDetected', threat); // Emit to all connected clients
    });

    callback(null, threats);
  } catch (error) {
    logger.error(`Error running SNORT: ${error.message}`);
    callback(error);
  }
};