// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: { type: String, enum: ['info', 'warn', 'error'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Associate log with a user
});

module.exports = mongoose.model('Log', logSchema);