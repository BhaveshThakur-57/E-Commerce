const Inquiry = require("../models/Inquiry");
const sendEmail = require("../utils/sendEmail");

// ============ PUBLIC ============

// @desc    Submit contact inquiry (public)
// @route   POST /api/inquiries
const submitInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const inquiry = await Inquiry.create({ name, email, subject, message });
    res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ ADMIN ============

// @desc    Get all inquiries (admin)
// @route   GET /api/admin/inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single inquiry (admin)
// @route   GET /api/admin/inquiries/:id
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    // Mark as read
    if (inquiry.status === "new") {
      inquiry.status = "read";
      await inquiry.save();
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to inquiry (admin)
// @route   PUT /api/admin/inquiries/:id/reply
const replyToInquiry = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Reply is required" });

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.adminReply = reply;
    inquiry.status = "replied";
    inquiry.repliedAt = new Date();
    await inquiry.save();

    // Send reply email to customer
    try {
      await sendEmail({
        to: inquiry.email,
        subject: `Re: ${inquiry.subject} — LUXORA Support`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 28px; font-weight: 700; color: #18181b; margin: 0;">LUXORA</h1>
              <p style="color: #71717a; font-size: 12px; margin: 4px 0 0;">Wear the Extraordinary</p>
            </div>
            <div style="background: #f4f4f5; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
              <p style="color: #71717a; font-size: 13px; margin: 0 0 4px;">Your message:</p>
              <p style="color: #3f3f46; font-size: 14px; margin: 0; font-style: italic;">"${inquiry.message}"</p>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
              <p style="color: #166534; font-size: 13px; margin: 0 0 4px; font-weight: 600;">Our Reply:</p>
              <p style="color: #15803d; font-size: 14px; margin: 0;">${reply}</p>
            </div>
            <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
              This is a response to your inquiry. If you have further questions, reply to this email.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Reply email failed:", emailErr.message);
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/admin/inquiries/:id/status
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (error) {
    console.error("Update inquiry status error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete inquiry (admin)
// @route   DELETE /api/admin/inquiries/:id
const deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
  getInquiryById,
  replyToInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
