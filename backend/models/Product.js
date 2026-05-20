const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorCode: { type: String, required: true },
  sizes: [
    {
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true,
      },
      stock: { type: Number, default: 0, min: 0 },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      default: "https://picsum.photos/seed/default/400/500",
    },
    // Phase 10: Multiple images
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Streetwear", "Essentials", "Oversized Fits", "Urban Classics", "Summer Drop", "Winter Layers", "Premium Cotton", "Limited Edition"],
    },
    variants: [variantSchema],
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual("totalStock").get(function () {
  if (!this.variants || this.variants.length === 0) return this.stock;
  return this.variants.reduce((total, variant) => {
    return total + variant.sizes.reduce((sum, s) => sum + s.stock, 0);
  }, 0);
});

module.exports = mongoose.model("Product", productSchema);