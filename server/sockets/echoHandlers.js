const pool = require('../config/db');
const Gemini = require("../utils/gemini");

module.exports = (io, socket) => {
    // Start a Session (Triggered after Matchmaking)
    socket.on('echo_start_session', async ({ userA, userB, topic }) => {
        try {
            // Create a record in your 'swap_sessions' table
            const result = await pool.query(
                "INSERT INTO swap_sessions (user_a_id, user_b_id, topic, status) VALUES ($1, $2, $3, 'active') RETURNING id",
                [userA, userB, topic]
            );
            
            const roomId = `echo-${result.rows[0].id}`;
            socket.join(roomId);
            
            // Tell both users the session ID
            io.to(socket.id).emit('session_initialized', { roomId, dbId: result.rows[0].id });
        } catch (err) {
            console.error(err);
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
            // Update DB status here...
        } else {
            // Send specific feedback to the user who tried
            socket.emit('echo_failed', { 
                msg: result.feedback 
            });
        }
    });
};