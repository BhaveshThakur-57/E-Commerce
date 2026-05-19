const express = require("express");
const router = express.Router();
const { generateDescription, smartSearch, getRecommendations } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.post("/description", protect, adminOnly, generateDescription);
router.get("/search", smartSearch);
router.get("/recommendations/:productId", getRecommendations);

module.exports = router;