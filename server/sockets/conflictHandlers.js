const pool = require('../config/db');

module.exports = (io, socket) => {
    // Track initialized conflict sessions
    const initializedSessions = new Set();
    const roomDistances = new Map(); // Store distances for both users

    // Start a Conflict Session
    socket.on('conflict_start_session', async ({ roomId, topic, userId }) => {
        try {
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
            
            for (const sid of socketIds) {
                const s = io.sockets.sockets.get(sid);
                if (s && s.userId) {
                    userIds.push(s.userId);
                }
            }

            if (userIds.length >= 2 && !initializedSessions.has(roomId)) {
                // Create a record in conflict_rooms table
                const result = await pool.query(
                    "INSERT INTO conflict_rooms (user_a_id, user_b_id, initial_topic, current_distance, status) VALUES ($1, $2, $3, 100, 'negotiating') RETURNING id",
                    [userIds[0], userIds[1], topic]
                );
                
                initializedSessions.add(roomId);
                roomDistances.set(roomId, { [userIds[0]]: 100, [userIds[1]]: 100 });
                
                // Tell all users in the room the session is initialized
                io.to(roomId).emit('conflict_session_initialized', { 
                    roomId, 
                    dbId: result.rows[0].id, 
                    topic 
                });
                
                console.log(`Conflict session initialized: Room ${roomId}, DB ID: ${result.rows[0].id}`);
            } else if (userIds.length >= 1) {
                // Notify that we're waiting for opponent
                socket.emit('conflict_session_initialized', { roomId, topic });
            }
        } catch (err) {
            console.error('Error initializing conflict session:', err);
        }
    });

    // Handle slider movement in Middle Ground
    socket.on('conflict_update_position', (data) => {
        const { roomId, newDistance, userId } = data;
        
        if (!roomDistances.has(roomId)) {
            roomDistances.set(roomId, {});
        }
        
        const distances = roomDistances.get(roomId);
        distances[userId] = newDistance;
        roomDistances.set(roomId, distances);
        
        // Broadcast the move to the opponent so their UI updates
        socket.to(roomId).emit('conflict_opponent_moved', {
            distance: newDistance
        });

        // Calculate average distance and check for convergence
        const distanceValues = Object.values(distances);
        const avgDistance = distanceValues.length > 0 
            ? distanceValues.reduce((a, b) => a + b, 0) / distanceValues.length 
            : newDistance;

        // Update database
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room) {
            const socketIds = Array.from(room);
            const s = io.sockets.sockets.get(socketIds[0]);
            if (s && s.userId) {
                // Update conflict room distance
                pool.query(
                    "UPDATE conflict_rooms SET current_distance = $1 WHERE (user_a_id = $2 OR user_b_id = $2) AND status = 'negotiating' ORDER BY id DESC LIMIT 1",
                    [Math.round(avgDistance), s.userId]
                ).catch(err => console.error('Error updating conflict distance:', err));
            }
        }

        // Check for convergence
        if (avgDistance < 15) {
            io.in(roomId).emit('conflict_convergence_reached', {
                message: "You are close enough to negotiate!"
            });
        }
    });

    // Handle messages in negotiation chat
    socket.on('conflict_send_message', (data) => {
        const { roomId, text, userId, username } = data;
        
        // Broadcast message to all users in room
        io.to(roomId).emit('conflict_message', {
            text,
            userId,
            username
        });
    });
};