const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    // Announcement Bar
    announcementBar: {
      text: { type: String, default: "Free shipping on orders over ₹1500 — Shop Now!" },
      enabled: { type: Boolean, default: true },
      bgColor: { type: String, default: "#7c3aed" },
      textColor: { type: String, default: "#ffffff" },
    },

    // Home Banners (slider)
    banners: [
      {
        image: { type: String, required: true },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        link: { type: String, default: "/" },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],

    // Dynamic Pages Content
    pages: {
      about: { type: String, default: "" },
      contact: { type: String, default: "" },
      faq: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
