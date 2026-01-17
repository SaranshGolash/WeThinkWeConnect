const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// --- UseCase 1: REST API for "Unfinished" ---
// Check if thought is a conclusion (Mock AI check)
const isConclusion = (text) => {
    const conclusions = ["therefore", "in conclusion", "so", "proven"];
    return conclusions.some(word => text.toLowerCase().includes(word));
};

app.post('/api/thoughts', async (req, res) => {
    const { userId, content } = req.body;
    if (isConclusion(content)) {
        return res.status(400).json({ error: "No conclusions allowed. Keep it open." });
    }
    // ... Insert into DB code ...
});


// --- MODULE 2 & 3: WebSockets for "EchoSwap" & "Middle Ground" ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join a specific room (Echo or Conflict)
    socket.on('join_room', (data) => {
        socket.join(data.roomId);
    });

    // EchoSwap: Perspective Validation
    socket.on('echo_attempt', (data) => {
        // Data contains { roomId, originalUserId, attemptText }
        // Broadcast to the other user to Valid/Invalidate
        socket.to(data.roomId).emit('verify_perspective', data);
    });

    // Middle Ground: Update Distance
    socket.on('update_position', (data) => {
        // data contains { roomId, newDistance, sliderValue }
        // If distance decreases, unlock chat
        socket.to(data.roomId).emit('opponent_moved', data);
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));