let echoQueue = [];     // For EchoSwap
let conflictQueue = []; // For Middle Ground

module.exports = {
    addToQueue: (socketId, userId, mode, topic) => {
        const queue = mode === 'echo' ? echoQueue : conflictQueue;
        
        // Check if someone else is waiting with a similar topic
        const matchIndex = queue.findIndex(u => u.userId !== userId); // Just match next available for now

        if (matchIndex !== -1) {
            const opponent = queue.splice(matchIndex, 1)[0];
            return { matched: true, peer: opponent };
        } else {
            queue.push({ socketId, userId, topic });
            return { matched: false };
        }
    },
    removeFromQueue: (socketId) => {
        echoQueue = echoQueue.filter(u => u.socketId !== socketId);
        conflictQueue = conflictQueue.filter(u => u.socketId !== socketId);
    }
};