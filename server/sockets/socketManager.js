const { addToQueue, removeFromQueue } = require('../utils/matchMaker');
const echoHandlers = require('./echoHandlers');
const conflictHandlers = require('./conflictHandlers');
const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Global Matchmaking
        socket.on('find_match', ({ userId, mode, topic }) => {
            const result = addToQueue(socket.id, userId, mode, topic);
            
            if (result.matched) {
                const roomId = uuidv4();
                const peer = result.peer;

                // Join both sockets to the new room
                socket.join(roomId);
                io.sockets.sockets.get(peer.socketId)?.join(roomId);

                // Notify both users
                io.to(roomId).emit('match_found', { 
                    roomId, 
                    mode,
                    topic 
                });
                
                console.log(`Match created: Room ${roomId}`);
            }
        });

        socket.on('join_room', ({ roomId }) => {
            socket.join(roomId);
        });

        echoHandlers(io, socket);
        conflictHandlers(io, socket);

        socket.on('disconnect', () => {
            removeFromQueue(socket.id);
            console.log('User Disconnected');
        });
    });
};