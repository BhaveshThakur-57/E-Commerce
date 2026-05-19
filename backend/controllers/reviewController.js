const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/reviews/:productId
const addReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  try {
    // Validation
    if (!rating || !title || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Check if verified purchase
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "items.product": productId,
      paymentStatus: "paid",
    });

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: !!hasPurchased,
    });

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review (own review)
// @route   DELETE /api/reviews/:reviewId
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate rating
    const allReviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);

    if (product) {
      product.rating =
        allReviews.length > 0
          ? Math.round(
              (allReviews.reduce((sum, r) => sum + r.rating, 0) /
                allReviews.length) *
                10
            ) / 10
          : 0;
      product.numReviews = allReviews.length;
      await product.save();
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, addReview, deleteReview };