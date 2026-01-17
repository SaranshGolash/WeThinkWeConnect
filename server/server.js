const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const userRoutes = require('./routes/userRoutes');

// Socket Logic
const socketManager = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://we-think-we-connect-client.vercel.app' || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/users', userRoutes);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Initialize Socket Manager
socketManager(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`WeThinkWeConnect Server running on port ${PORT}`);
});