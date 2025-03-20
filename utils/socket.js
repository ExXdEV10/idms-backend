// utils/socket.js
const socketIo = require('socket.io');

// Initialize Socket.IO
const initSocket = (server) => {
  const io = socketIo(server);

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });

    // Custom event example (optional)
    socket.on('customEvent', (data) => {
      console.log('Received custom event:', data);
      socket.emit('customResponse', { message: 'Hello from the server!' });
    });
  });

  return io;
};

module.exports = initSocket;