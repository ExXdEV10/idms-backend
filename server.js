const app = require('./app');
const { connectDB } = require('./config/db'); // Use the refactored db connection
const http = require('http');
const initSocket = require('./utils/socket'); // Import the socket initialization function
require('dotenv').config(); // Load environment variables

// Set the port
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB first, then start the server
connectDB().then(() => {
  // Initialize Socket.IO after DB connection
  const io = initSocket(server);

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Export Socket.IO for use in other files
  module.exports = io;
}).catch((err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1); 
});
