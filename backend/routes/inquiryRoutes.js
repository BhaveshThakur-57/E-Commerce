const express = require("express");
const router = express.Router();
const { submitInquiry } = require("../controllers/inquiryController");

// Public route - anyone can submit
router.post("/", submitInquiry);

module.exports = router;
