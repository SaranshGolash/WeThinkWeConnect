// Heuristic-based AI Moderator for "Unfinished" thoughts
module.exports = (req, res, next) => {
    const { content } = req.body;
    
    // List of words that imply a conclusion or closed statement
    const conclusionTriggers = [
        "therefore", "in conclusion", "proven", "obvious", 
        "period.", "end of story", "simple as that"
    ];

    const isConclusion = conclusionTriggers.some(word => 
        content.toLowerCase().includes(word)
    );

    if (isConclusion) {
        return res.status(400).json({ 
            error: "Moderation Block: Thoughts must remain unfinished. Avoid conclusive language." 
        });
    }

    next();
};