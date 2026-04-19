const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const generateOrderId = require("../utils/generateOrderId");

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    // Validate shipping address
    const { fullName, phone, address, city, state, pincode } = shippingAddress;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields required" });
    }

    // Get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Only ${product.stock} units available for ${product.name}`,
        });
      }
    }

    // Calculate prices
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const tax = Math.round(subtotal * 0.18);
    const shippingCharge = subtotal > 999 ? 0 : 99;
    const totalPrice = subtotal + tax + shippingCharge;

    // Create order
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
      totalPrice,
      paymentStatus: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};