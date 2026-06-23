const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: "paid" });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).limit(5);

    // Chart Data: Monthly Revenue (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = revenueByMonth.map(item => ({
      name: `${monthNames[item._id.month - 1]}`,
      revenue: item.total
    }));

    // Fill missing months with 0 if necessary
    const currentMonth = new Date().getMonth();
    const formattedRevenueData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const mName = monthNames[d.getMonth()];
      const existing = revenueData.find(r => r.name === mName);
      formattedRevenueData.push({
        name: mName,
        revenue: existing ? existing.revenue : 0
      });
    }

    // Chart Data: Top Selling Products
    const topProductsAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          sold: { $sum: "$items.qty" }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    const topProductsData = topProductsAgg.map(item => ({
      name: item._id,
      sold: item.sold
    }));

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      paidOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      revenueData: formattedRevenueData,
      topProductsData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers };