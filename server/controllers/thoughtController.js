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
            "INSERT INTO thoughts (user_id, content, mood) VALUES ($1, $2, $3) RETURNING *",
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
        const {mood} = req.query;
        const params = [];

        let query = `
            SELECT t.*, u.username, 
                   COALESCE(c_counts.count, 0) as continuations 
            FROM thoughts t 
            JOIN users u ON t.user_id = u.id 
            LEFT JOIN (
                SELECT thought_id, COUNT(*) as count 
                FROM continuations 
                GROUP BY thought_id
            ) as c_counts ON t.id = c_counts.thought_id
        `;

        if (mood && mood !== 'All') {
            query += ` WHERE t.mood = $1`;
            params.push(mood);
        }

        query += ` ORDER BY t.created_at DESC`;
        const allThoughts = await pool.query(query, params);
        res.json(allThoughts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
};

exports.getSparks = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.length < 5) {
            return res.status(400).json({ error: "Type a bit more first..." });
        }

        const suggestions = await Gemini.generateSparks(content);
        res.json({ suggestions: suggestions });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
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