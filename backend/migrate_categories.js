const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    
    for (let product of products) {
      let newCategory = "T-Shirts"; // Default
      let newCollections = ["New Arrivals", "Streetwear"];
      
      const oldCat = product.category;
      
      if (oldCat === "Streetwear" || oldCat === "Urban Classics") {
        newCategory = "T-Shirts";
      } else if (oldCat === "Essentials" || oldCat === "Premium Cotton") {
        newCategory = "T-Shirts";
        newCollections.push("Casual Fits");
      } else if (oldCat === "Oversized Fits") {
        newCategory = "Oversized";
        newCollections.push("Oversized Fits");
      } else if (oldCat === "Summer Drop") {
        newCategory = "T-Shirts";
        newCollections.push("Summer Wear");
      } else if (oldCat === "Winter Layers") {
        newCategory = "Jackets";
        newCollections.push("Winter Layers");
      } else if (oldCat === "Limited Edition") {
        newCategory = "Shirts";
        newCollections.push("Limited Drop");
      }

      const uniqueCollections = [...new Set(newCollections)];

      await Product.updateOne(
        { _id: product._id },
        { 
          $set: { 
            category: newCategory,
            collections: uniqueCollections
          } 
        },
        { runValidators: false }
      );
    }
    
    console.log(`Migrated ${products.length} products to new categories and collections format.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateProducts();
