module.exports = (io, socket) => {
    // Handle slider movement in Middle Ground
    socket.on('conflict_update_position', (data) => {
        const { roomId, newDistance } = data;
        
        // Broadcast the move to the opponent so their UI updates
        socket.to(roomId).emit('conflict_opponent_moved', {
            distance: newDistance
        });

        // Check for convergence
        if (newDistance < 15) { // If gap is less than 15%
            io.in(roomId).emit('conflict_convergence_reached', {
                message: "You are close enough to negotiate!"
            });
        }
    });
};