// testModels.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Threat = require('./models/Threat');
const Log = require('./models/Log');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample Ghanaian names
const ghanaianNames = [
  { username: 'KwameMensah', email: 'kwame.mensah@example.com' },
  { username: 'AmaAsante', email: 'ama.asante@example.com' },
  { username: 'YawBoateng', email: 'yaw.boateng@example.com' },
  { username: 'EsiAgyemang', email: 'esi.agyemang@example.com' },
  { username: 'KofiOwusu', email: 'kofi.owusu@example.com' },
];

// Sample threats
const sampleThreats = [
  { type: 'Phishing', severity: 'high', sourceIP: '192.168.1.1', description: 'Suspicious email detected' },
  { type: 'Malware', severity: 'medium', sourceIP: '192.168.1.2', description: 'Malicious file download detected' },
  { type: 'DDoS', severity: 'high', sourceIP: '192.168.1.3', description: 'DDoS attack detected' },
];

// Sample logs
const sampleLogs = [
  { level: 'info', message: 'System started successfully' },
  { level: 'warn', message: 'Unusual network activity detected' },
  { level: 'error', message: 'Failed to process request' },
];

// Function to insert sample data
const insertSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Threat.deleteMany({});
    await Log.deleteMany({});

    // Insert sample users
    const users = await User.insertMany(
      ghanaianNames.map((name) => ({
        ...name,
        password: 'password123', // For testing purposes only
        role: 'user',
      }))
    );

    // Insert sample threats
    const threats = await Threat.insertMany(sampleThreats);

    // Insert sample logs
    const logs = await Log.insertMany(
      sampleLogs.map((log) => ({
        ...log,
        user: users[Math.floor(Math.random() * users.length)]._id, // Assign a random user to each log
      }))
    );

    console.log('Sample data inserted successfully!');
    console.log('Users:', users);
    console.log('Threats:', threats);
    console.log('Logs:', logs);
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};

// Run the script
insertSampleData();