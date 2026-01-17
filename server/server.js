const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');

// Socket Logic
const socketManager = require('./sockets/socketManager');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/users', userRoutes);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow React Frontend
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Manager
socketManager(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Continuum Server running on port ${PORT}`);
});