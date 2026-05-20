const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const generateOrderId = require("../utils/generateOrderId");
const sendEmail = require("../utils/sendEmail");
const { orderConfirmationEmail, orderCancelledEmail } = require("../utils/emailTemplates");
const User = require("../models/User");

const createOrder = async (req, res) => {
  const { shippingAddress, couponCode, discountAmount } = req.body;

  try {
    const { fullName, phone, address, city, state, pincode } = shippingAddress;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found` });
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Only ${product.stock} units available for ${product.name}` });
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.18);
    const shippingCharge = subtotal > 999 ? 0 : 99;
    const validDiscount = discountAmount || 0;
    const totalPrice = subtotal + tax + shippingCharge - validDiscount;

    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
    }

    const order = await Order.create({
      user: req.user._id,
      orderId: generateOrderId(),
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      shippingAddress,
      subtotal,
      tax,
      shippingCharge,
      couponCode: couponCode || null,
      discountAmount: validDiscount,
      totalPrice,
      paymentStatus: "pending",
      trackingHistory: [{
        status: "processing",
        message: "Order placed successfully. We are processing your order.",
        timestamp: new Date(),
      }],
    });

    // Email send karo
    try {
      const user = await User.findById(req.user._id);
      await sendEmail({
        to: user.email,
        subject: `Order Confirmed — ${order.orderId} | LUXORA`,
        html: orderConfirmationEmail(order, user.name),
      });
    } catch (emailErr) {
      console.error("Order email failed:", emailErr.message);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const statusMessages = {
    processing: "Order is being processed.",
    shipped: "Your order has been shipped and is on its way!",
    delivered: "Order delivered successfully. Enjoy your purchase!",
    cancelled: "Your order has been cancelled.",
  };

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;
    order.trackingHistory.push({
      status: orderStatus,
      message: statusMessages[orderStatus] || `Status updated to ${orderStatus}`,
      timestamp: new Date(),
    });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.orderStatus === "delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.orderStatus = "cancelled";

    if (order.paymentStatus === "paid") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
      }
    }

    await order.save();

    // Cancel email send karo
    try {
      const user = await User.findById(req.user._id);
      await sendEmail({
        to: user.email,
        subject: `Order Cancelled — ${order.orderId} | LUXORA`,
        html: orderCancelledEmail(order, user.name),
      });
    } catch (emailErr) {
      console.error("Cancel email failed:", emailErr.message);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };