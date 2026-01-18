const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET /api/users/profile
// @desc    Get logged-in user's details
// @access  Private
router.get("/profile", authMiddleware, userController.getProfile);

// @route   GET /api/users/dashboard
// @desc    Get aggregated data (Thoughts, Sessions, Conflicts) for the dashboard
// @access  Private
router.get("/dashboard", authMiddleware, userController.getDashboard);

// @route   GET /api/users/:username
// @desc    Get a public profile by username
// @access  Public
router.get("/:username", userController.getPublicProfile);


router.get('/stats', auth, userController.getProfileStats);

module.exports = router;