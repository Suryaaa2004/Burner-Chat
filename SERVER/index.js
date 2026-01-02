const io = require('socket.io')(3001, {
  cors: { origin: "*" } // Allows your React app to connect
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // This passes the WebRTC "handshake" between users
  socket.on('signal', ({ target, desc, candidate }) => {
    io.to(target).emit('signal', { from: socket.id, desc, candidate });
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});