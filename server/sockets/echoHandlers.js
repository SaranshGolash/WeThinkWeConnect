const pool = require('../config/db');
const Gemini = require("../utils/gemini");

module.exports = (io, socket) => {
    // Track initialized sessions
    const initializedSessions = new Set();

    // Start a Session (Triggered when user enters session page)
    socket.on('echo_start_session', async ({ roomId, topic }) => {
        try {
            // Prevent duplicate initialization
            if (initializedSessions.has(roomId)) {
                return;
            }

            // Get userId from socket
            const userId = socket.userId;
            if (!userId) {
                console.error('No userId found for socket', socket.id);
                return;
            }

            // Get all sockets in the room
            const room = io.sockets.adapter.rooms.get(roomId);
            if (!room) {
                console.error('Room not found:', roomId);
                return;
            }

            const socketIds = Array.from(room);
            const userIds = [];
            
            // Collect userIds from all sockets in the room
            for (const sid of socketIds) {
                const s = io.sockets.sockets.get(sid);
                if (s && s.userId) {
                    userIds.push(s.userId);
                }
            }

            if (userIds.length >= 2) {
                // Create a record in your 'swap_sessions' table
                const result = await pool.query(
                    "INSERT INTO swap_sessions (user_a_id, user_b_id, topic, status) VALUES ($1, $2, $3, 'active') RETURNING id",
                    [userIds[0], userIds[1], topic]
                );
                
                initializedSessions.add(roomId);
                
                // Tell all users in the room the session ID
                io.to(roomId).emit('session_initialized', { roomId, dbId: result.rows[0].id, topic });
                console.log(`EchoSwap session initialized: Room ${roomId}, DB ID: ${result.rows[0].id}`);
            }
        } catch (err) {
            console.error('Error initializing echo session:', err);
        }
    });

    // Validate Perspective
    socket.on('echo_validate_attempt', async (data) => {
        const { roomId, originalBelief, attemptText } = data;

        // 1. Tell UI we are processing
        io.to(roomId).emit('echo_processing');

        // 2. Ask Gemini
        const result = await Gemini.validatePerspective(originalBelief, attemptText);

        if (result.pass) {
            io.in(roomId).emit('echo_success', { 
                msg: "Perspective Aligned. Chat Unlocked." 
            });
        } else {
            socket.emit('echo_failed', { 
                msg: result.feedback 
            });
        }
    });
};