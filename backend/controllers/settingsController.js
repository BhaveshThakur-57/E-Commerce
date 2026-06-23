const SiteSetting = require("../models/SiteSetting");

// Helper: Get or create the singleton settings doc
const getSettings = async () => {
  let settings = await SiteSetting.findOne();
  if (!settings) {
    settings = await SiteSetting.create({});
  }
  return settings;
};

// ============ PUBLIC ROUTES ============

// @desc    Get announcement bar (public)
// @route   GET /api/settings/announcement
const getAnnouncement = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings.announcementBar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active banners (public)
// @route   GET /api/settings/banners
const getBanners = async (req, res) => {
  try {
    const settings = await getSettings();
    const activeBanners = settings.banners
      .filter((b) => b.enabled)
      .sort((a, b) => a.order - b.order);
    res.json(activeBanners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dynamic page content (public)
// @route   GET /api/settings/pages/:page
const getPageContent = async (req, res) => {
  try {
    const { page } = req.params;
    if (!["about", "contact", "faq"].includes(page)) {
      return res.status(400).json({ message: "Invalid page name" });
    }
    const settings = await getSettings();
    res.json({ content: settings.pages[page] || "" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ ADMIN ROUTES ============

// @desc    Get all settings (admin)
// @route   GET /api/admin/settings
const getAllSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update announcement bar (admin)
// @route   PUT /api/admin/settings/announcement
const updateAnnouncement = async (req, res) => {
  try {
    const settings = await getSettings();
    const { text, enabled, bgColor, textColor } = req.body;
    if (text !== undefined) settings.announcementBar.text = text;
    if (enabled !== undefined) settings.announcementBar.enabled = enabled;
    if (bgColor !== undefined) settings.announcementBar.bgColor = bgColor;
    if (textColor !== undefined) settings.announcementBar.textColor = textColor;
    await settings.save();
    res.json(settings.announcementBar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update banners (admin)
// @route   PUT /api/admin/settings/banners
const updateBanners = async (req, res) => {
  try {
    const settings = await getSettings();
    settings.banners = req.body.banners;
    await settings.save();
    res.json(settings.banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update dynamic page content (admin)
// @route   PUT /api/admin/settings/pages/:page
const updatePageContent = async (req, res) => {
  try {
    const { page } = req.params;
    if (!["about", "contact", "faq"].includes(page)) {
      return res.status(400).json({ message: "Invalid page name" });
    }
    const settings = await getSettings();
    settings.pages[page] = req.body.content;
    settings.markModified("pages");
    await settings.save();
    res.json({ content: settings.pages[page] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnnouncement,
  getBanners,
  getPageContent,
  getAllSettings,
  updateAnnouncement,
  updateBanners,
  updatePageContent,
};
