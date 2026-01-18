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

        const mood = await Gemini.analyzeSentiment(content);

        const newThought = await pool.query(
            "INSERT INTO thoughts (user_id, content) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, content, mood]
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
            `SELECT thoughts.*, users.username, 
                    COALESCE(continuation_counts.count, 0) as continuations
             FROM thoughts 
             JOIN users ON thoughts.user_id = users.id 
             LEFT JOIN (
                 SELECT thought_id, COUNT(*) as count 
                 FROM continuations 
                 GROUP BY thought_id
             ) as continuation_counts ON thoughts.id = continuation_counts.thought_id
             ORDER BY thoughts.created_at DESC`
        );
        res.json(allThoughts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
};

// Get all continuations for a thought
exports.getContinuations = async (req, res) => {
    try {
        const { thought_id } = req.params;

        const continuations = await pool.query(
            `SELECT continuations.*, users.username 
             FROM continuations 
             JOIN users ON continuations.user_id = users.id 
             WHERE continuations.thought_id = $1 
             ORDER BY continuations.id ASC`,
            [thought_id]
        );

        const response = continuations.rows.map(row => ({
            _id: row.id,
            id: row.id,
            parentId: row.thought_id,
            content: row.content,
            username: row.username,
            author: { username: row.username },
            createdAt: row.created_at || row.created_at
        }));

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
};