const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100), // paise mein
      currency: "INR",
      receipt: order.orderId,
    });

    // Save razorpay order id
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment & confirm order
// @route   POST /api/payment/verify
const verifyPayment = async (req, res) => {
  const {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  try {
    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    // Reduce stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payment/failed
const paymentFailed = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = "failed";
      await order.save();
    }
    res.json({ message: "Payment marked as failed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  paymentFailed,
};