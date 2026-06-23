const express = require("express");
const router = express.Router();
const {
  getAnnouncement,
  getBanners,
  getPageContent,
} = require("../controllers/settingsController");

// Public routes
router.get("/announcement", getAnnouncement);
router.get("/banners", getBanners);
router.get("/pages/:page", getPageContent);

module.exports = router;
