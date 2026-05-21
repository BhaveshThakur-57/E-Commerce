const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
  const prods = await Product.find({
    $or: [
      { name: { $regex: "aura", $options: "i" } },
      { description: { $regex: "aura", $options: "i" } },
    ],
  }).select("name description");

  console.log("Products with 'Aura' in name or description:");
  prods.forEach((p) => {
    console.log(`  - ${p.name} (${p._id})`);
    console.log(`    Desc: ${p.description?.substring(0, 100)}`);
  });

  if (prods.length === 0) {
    console.log("  No products found with 'Aura' references.");
  } else {
    // Fix them
    for (const p of prods) {
      const updates = {};
      if (p.name && /aura/i.test(p.name)) {
        updates.name = p.name.replace(/AURAWEAR/g, "LUXORA").replace(/Aurawear/g, "Luxora").replace(/AuraWear/g, "LUXORA").replace(/Aura/g, "LUXORA");
      }
      if (p.description && /aura/i.test(p.description)) {
        updates.description = p.description.replace(/AURAWEAR/g, "LUXORA").replace(/Aurawear/g, "Luxora").replace(/AuraWear/g, "LUXORA").replace(/Aura/g, "LUXORA");
      }
      if (Object.keys(updates).length > 0) {
        await Product.updateOne({ _id: p._id }, { $set: updates });
        console.log(`  ✅ Fixed: ${p.name} -> ${updates.name || p.name}`);
      }
    }
  }

  process.exit(0);
});
