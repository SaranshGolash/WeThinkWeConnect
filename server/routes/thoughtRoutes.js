const router = require("express").Router();
const thoughtController = require("../controllers/thoughtController");
const authMiddleware = require("../middleware/authMiddleware");
const aiModerator = require("../middleware/aiModerator");

// Apply middleware chain: Auth -> AI Check -> Controller
router.post("/", authMiddleware, aiModerator, thoughtController.createThought);
router.get("/", thoughtController.getFeed);

// Get continuations for a thought (public endpoint)
router.get("/:thought_id/continuations", thoughtController.getContinuations);

module.exports = router;