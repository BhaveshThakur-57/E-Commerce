const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    adminReply: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
