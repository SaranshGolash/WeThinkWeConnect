const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length > 0) return res.status(401).json("User already exists");

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);
        const { password_hash, ...userWithoutPassword } = newUser.rows[0];
        res.json({ token, user: userWithoutPassword });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(401).json("Password or Email is incorrect");

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json("Password or Email is incorrect");

        const token = jwtGenerator(user.rows[0].id);
        const { password_hash, ...userWithoutPassword } = user.rows[0];
        res.json({ token, user: userWithoutPassword });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get current authenticated user (for session persistence)
exports.getMe = async (req, res) => {
    try {
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