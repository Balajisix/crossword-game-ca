const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();
connectDB();

const app = express();

// Setup CORS for your client application
app.use(
  cors({
    origin: "https://crossword-game-sicasa.vercel.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.use(express.json());

// Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// ---- Start of Socket.IO integration ----

// Create an HTTP server from your Express app
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.IO on top of your HTTP server. Adjust CORS as needed.
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "https://crossword-game-sicasa.vercel.app", // or "*" if you prefer open access during development
    // origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

// Make the Socket.IO instance accessible in your routes/controllers
app.set('io', io);

// Handle Socket.IO client connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // (Optional) Emit the socket id to the client
  // socket.emit('socket-id', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ---- End of Socket.IO integration ----

// Export the app if you need it elsewhere; otherwise, start the server here.
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
