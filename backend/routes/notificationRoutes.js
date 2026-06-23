const express = require("express");
const router = express.Router();
const { subscribePush } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/subscribe", protect, subscribePush);

module.exports = router;
