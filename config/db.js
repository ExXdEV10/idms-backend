const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Validate the MongoDB URI
if (!mongoURI) {
  console.error('Error: MONGODB_URI is not defined in the environment variables.');
  process.exit(1); // Exit the app if no URI is provided
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit the app if the connection fails
  }
};

// Handle connection events
const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

db.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Export the connection function and db instance
module.exports = { connectDB, db };