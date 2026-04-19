const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  paymentFailed,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.post("/failed", protect, paymentFailed);

module.exports = router;