const pool = require("../config/db");

// 1. Get Current User Profile (Protected)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const user = await pool.query(
            "SELECT id, username, email, reputation_score, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json("User not found");
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 2. Get User Dashboard Data (Aggregates Activity)
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // A. Fetch their unfinished thoughts
        const thoughts = await pool.query(
            "SELECT * FROM thoughts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5",
            [userId]
        );

        // B. Fetch active EchoSwap sessions
        const echoSessions = await pool.query(
            `SELECT * FROM swap_sessions 
             WHERE (user_a_id = $1 OR user_b_id = $1) 
             AND status = 'active'`,
            [userId]
        );

        // C. Fetch active Conflict Rooms
        const conflicts = await pool.query(
            `SELECT * FROM conflict_rooms 
             WHERE (user_a_id = $1 OR user_b_id = $1) 
             AND status = 'negotiating'`,
            [userId]
        );

        res.json({
            myThoughts: thoughts.rows,
            activeEchoSessions: echoSessions.rows,
            activeConflicts: conflicts.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 3. Get Public Profile (By Username) - For viewing others
exports.getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        
        const user = await pool.query(
            "SELECT id, username, reputation_score, created_at FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(404).json("User not found");
        }

        // Get their top stats (e.g., number of helpful continuations)
        const stats = await pool.query(
            "SELECT COUNT(*) as helpful_count FROM continuations WHERE user_id = $1 AND is_chosen_best = TRUE",
            [user.rows[0].id]
        );

        res.json({
            ...user.rows[0],
            helpful_contributions: stats.rows[0].helpful_count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};