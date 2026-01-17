const { addToQueue, removeFromQueue } = require('../utils/matchMaker');
const echoHandlers = require('./echoHandlers');
const conflictHandlers = require('./conflictHandlers');
const { v4: uuidv4 } = require('uuid');

// Store socket to userId mapping
const socketToUser = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Store userId when socket authenticates
        socket.on('authenticate', ({ userId }) => {
            socketToUser.set(socket.id, userId);
            socket.userId = userId;
            console.log(`Socket ${socket.id} authenticated as user ${userId}`);
        });

        // Global Matchmaking
        socket.on('find_match', ({ userId, mode, topic }) => {
            console.log(`Matchmaking request: userId=${userId}, mode=${mode}, topic=${topic}`);
            const result = addToQueue(socket.id, userId, mode, topic);
            
            if (result.matched) {
                const roomId = mode === 'echo' ? `echo-${uuidv4()}` : `conflict-${uuidv4()}`;
                const peer = result.peer;

                // Join both sockets to the new room
                socket.join(roomId);
                const peerSocket = io.sockets.sockets.get(peer.socketId);
                if (peerSocket) {
                    peerSocket.join(roomId);
                }

                // Determine which user's topic to use (use the first one that matched)
                const finalTopic = topic || peer.topic;

                // Notify both users
                io.to(roomId).emit('match_found', { 
                    roomId, 
                    mode,
                    topic: finalTopic 
                });
                
                console.log(`Match created: Room ${roomId} for mode ${mode}`);
            } else {
                console.log(`User ${userId} added to ${mode} queue`);
            }
        });

        socket.on('cancel_match', ({ mode }) => {
            removeFromQueue(socket.id);
            console.log(`User ${socket.userId} cancelled ${mode} matchmaking`);
        });

        socket.on('join_room', ({ roomId }) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        echoHandlers(io, socket);
        conflictHandlers(io, socket);

        socket.on('disconnect', () => {
            removeFromQueue(socket.id);
            socketToUser.delete(socket.id);
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
};