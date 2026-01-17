const pool = require("../config/db");
const Gemini = require("../utils/gemini");

// Post an unfinished thought
exports.createThought = async (req, res) => {
    try {
        const { content } = req.body;
        
        const isUnfinished = await Gemini.checkIncompleteness(content);
        if (!isUnfinished) {
            return res.status(400).json({ 
                error: "Too Conclusive. This app is for unfinished thoughts only. Try removing the period or adding uncertainty." 
            });
        }

        const newThought = await pool.query(
            "INSERT INTO thoughts (user_id, content) VALUES ($1, $2) RETURNING *",
            [req.user.id, content]
        );

        const responsePayload = {
            ...newThought.rows[0],
            username: req.user.username || "You" // Fallback if middleware doesn't have username
        };

        res.json(responsePayload);

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
};

// Get feed of unfinished thoughts
exports.getFeed = async (req, res) => {
    try {
        const allThoughts = await pool.query(
            `SELECT thoughts.*, users.username 
             FROM thoughts 
             JOIN users ON thoughts.user_id = users.id 
             ORDER BY thoughts.created_at DESC`
        );
        res.json(allThoughts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
};