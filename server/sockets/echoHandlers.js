const pool = require('../config/db');

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
        const { dbId, roomId, perspectiveText, isSuccessful } = data;

        if (isSuccessful) {
            // Update the DB to mark as completed or update transcript
            await pool.query(
                "UPDATE swap_sessions SET status = 'completed', transcript = jsonb_set(COALESCE(transcript, '{}'), '{result}', '\"success\"') WHERE id = $1",
                [dbId]
            );
            
            io.in(roomId).emit('echo_success', { 
                msg: "Perspective Aligned. Chat Unlocked." 
            });
        }
    });
};