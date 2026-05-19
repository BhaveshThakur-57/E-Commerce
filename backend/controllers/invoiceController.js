const Order = require("../models/Order");
const generateInvoice = require("../utils/generateInvoice");

// @desc    Download invoice PDF
// @route   GET /api/invoice/:orderId
const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only order owner or admin can download
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    generateInvoice(order, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadInvoice };