const pool = require('../config/db');

module.exports = (io, socket) => {
    // Handle creating a thread reply (continuation)
    socket.on('create_thread_reply', async (data) => {
        try {
            const { parentId, content } = data;
            const userId = socket.userId;

            if (!userId) {
                console.error('No userId found for socket', socket.id);
                socket.emit('thread_reply_error', { message: 'User not authenticated' });
                return;
            }

            if (!parentId || !content) {
                socket.emit('thread_reply_error', { message: 'Missing parentId or content' });
                return;
            }

            // Verify thought exists
            const thoughtCheck = await pool.query(
                "SELECT id FROM thoughts WHERE id = $1",
                [parentId]
            );

            if (thoughtCheck.rows.length === 0) {
                socket.emit('thread_reply_error', { message: 'Thought not found' });
                return;
            }

            // Insert continuation into database
            const result = await pool.query(
                "INSERT INTO continuations (thought_id, user_id, content, type) VALUES ($1, $2, $3, 'extend') RETURNING *",
                [parentId, userId, content]
            );

            // Get user info for response
            const userInfo = await pool.query(
                "SELECT username FROM users WHERE id = $1",
                [userId]
            );

            const replyData = {
                _id: result.rows[0].id,
                id: result.rows[0].id,
                parentId: parentId,
                content: result.rows[0].content,
                username: userInfo.rows[0]?.username || "Unknown",
                author: { username: userInfo.rows[0]?.username || "Unknown" },
                createdAt: result.rows[0].created_at || new Date().toISOString()
            };

            // Broadcast to all connected clients so everyone sees the new reply
            io.emit('new_thread_reply', replyData);

            console.log(`Thread reply created for thought ${parentId} by user ${userId}`);
        } catch (err) {
            console.error('Error creating thread reply:', err);
            socket.emit('thread_reply_error', { message: 'Failed to create reply' });
        }
    });
};

