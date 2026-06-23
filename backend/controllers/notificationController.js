const User = require("../models/User");

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
const subscribePush = async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ message: "Subscription object is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pushSubscription = subscription;
    await user.save();

    res.json({ message: "Successfully subscribed to push notifications" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { subscribePush };
