// models/Threat.js
const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., phishing, malware, DDoS
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  timestamp: { type: Date, default: Date.now },
  sourceIP: { type: String, required: true }, // IP address of the threat source
  description: { type: String }, // Additional details about the threat
});

module.exports = mongoose.model('Threat', threatSchema);