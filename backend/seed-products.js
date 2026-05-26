const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");
const connectDB = require("./config/db");

const products = [
  // ===== T-SHIRTS =====
  {
    name: "Classic Black Crew Neck Tee",
    description: "A wardrobe essential — premium 100% combed cotton crew neck tee in deep black. Soft hand-feel, pre-shrunk fabric with reinforced stitching for lasting wear.",
    price: 799,
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400&h=500&fit=crop",
    category: "T-Shirts",
    collections: ["Casual Fits", "Summer Wear"],
    stock: 50,
    rating: 4.7,
    numReviews: 124,
    variants: [
      { color: "Black", colorCode: "#111111", sizes: [{ size: "S", stock: 12 }, { size: "M", stock: 15 }, { size: "L", stock: 10 }, { size: "XL", stock: 8 }] },
      { color: "White", colorCode: "#F5F5F5", sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 12 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }] },
    ],
  },
  {
    name: "Minimal Stripe Tee",
    description: "Clean horizontal stripe pattern on premium jersey cotton. Relaxed fit with a modern silhouette. Perfect for weekend outings.",
    price: 899,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=500&fit=crop",
    category: "T-Shirts",
    collections: ["Casual Fits", "Summer Wear"],
    stock: 35,
    rating: 4.5,
    numReviews: 87,
    variants: [
      { color: "Navy Stripe", colorCode: "#1B2838", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 12 }, { size: "XL", stock: 8 }] },
    ],
  },
  {
    name: "White Essential Round Neck",
    description: "The perfect white tee. Made from 180 GSM organic cotton with a clean round neck. Pairs with everything in your closet.",
    price: 699,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=500&fit=crop",
    category: "T-Shirts",
    collections: ["Casual Fits", "New Arrivals"],
    stock: 60,
    rating: 4.8,
    numReviews: 203,
    variants: [
      { color: "White", colorCode: "#FFFFFF", sizes: [{ size: "S", stock: 15 }, { size: "M", stock: 20 }, { size: "L", stock: 15 }, { size: "XL", stock: 10 }] },
    ],
  },
  {
    name: "Graphic Print Urban Tee",
    description: "Bold street-style graphic print on soft cotton. Features a contemporary urban design with premium screen printing that won't fade.",
    price: 999,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    category: "T-Shirts",
    collections: ["Streetwear", "New Arrivals"],
    stock: 30,
    rating: 4.4,
    numReviews: 56,
    variants: [
      { color: "Black", colorCode: "#1A1A1A", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 10 }, { size: "XL", stock: 10 }] },
    ],
  },

  // ===== SHIRTS =====
  {
    name: "Oxford Button-Down Shirt",
    description: "Classic Oxford weave button-down in crisp white. Tailored slim fit with a soft collar roll. Ideal for smart-casual occasions.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    category: "Shirts",
    collections: ["Office Wear", "Casual Fits"],
    stock: 40,
    rating: 4.6,
    numReviews: 98,
    variants: [
      { color: "White", colorCode: "#FAFAFA", sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 12 }, { size: "L", stock: 10 }, { size: "XL", stock: 6 }] },
      { color: "Light Blue", colorCode: "#B0D4F1", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 10 }, { size: "XL", stock: 5 }] },
    ],
  },
  {
    name: "Linen Casual Shirt",
    description: "Breathable pure linen shirt with a relaxed fit. Perfect for hot summer days. Features mother-of-pearl buttons and a mandarin collar.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    category: "Shirts",
    collections: ["Summer Wear", "Casual Fits"],
    stock: 25,
    rating: 4.7,
    numReviews: 72,
    variants: [
      { color: "Beige", colorCode: "#D4C5A9", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 10 }, { size: "XL", stock: 7 }] },
    ],
  },
  {
    name: "Denim Chambray Shirt",
    description: "Washed denim chambray with a soft hand-feel. Snap button front closure. A rugged yet refined piece for casual layering.",
    price: 2199,
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&h=500&fit=crop",
    category: "Shirts",
    collections: ["Streetwear", "Casual Fits"],
    stock: 20,
    rating: 4.3,
    numReviews: 41,
    variants: [
      { color: "Indigo", colorCode: "#3F5277", sizes: [{ size: "M", stock: 7 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }] },
    ],
  },

  // ===== OVERSIZED =====
  {
    name: "Oversized Drop Shoulder Tee",
    description: "Statement drop-shoulder oversized tee in heavyweight 240 GSM cotton. Extra relaxed fit with extended length for that effortless streetwear look.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop",
    category: "Oversized",
    collections: ["Oversized Fits", "Streetwear"],
    stock: 45,
    rating: 4.8,
    numReviews: 167,
    variants: [
      { color: "Sage Green", colorCode: "#8B9D77", sizes: [{ size: "M", stock: 12 }, { size: "L", stock: 15 }, { size: "XL", stock: 10 }] },
      { color: "Charcoal", colorCode: "#36454F", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 12 }, { size: "XL", stock: 8 }] },
    ],
  },
  {
    name: "Washed Oversized Hoodie Tee",
    description: "Acid-washed oversized tee with a vintage aesthetic. Heavy cotton blend with raw-cut hems. A streetwear staple for layered fits.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    category: "Oversized",
    collections: ["Oversized Fits", "Streetwear", "Limited Drop"],
    stock: 20,
    rating: 4.9,
    numReviews: 89,
    variants: [
      { color: "Washed Black", colorCode: "#2C2C2C", sizes: [{ size: "L", stock: 10 }, { size: "XL", stock: 6 }, { size: "XXL", stock: 4 }] },
    ],
  },
  {
    name: "Oversized Earth Tone Tee",
    description: "Earthy muted tones on a relaxed oversized silhouette. 220 GSM ringspun cotton with ribbed collar. Minimal branding for a clean aesthetic.",
    price: 1199,
    image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=400&h=500&fit=crop",
    category: "Oversized",
    collections: ["Oversized Fits", "Casual Fits"],
    stock: 35,
    rating: 4.6,
    numReviews: 63,
    variants: [
      { color: "Sand", colorCode: "#C2B280", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 12 }, { size: "XL", stock: 8 }] },
      { color: "Olive", colorCode: "#556B2F", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 10 }, { size: "XL", stock: 5 }] },
    ],
  },

  // ===== BOTTOMWEAR =====
  {
    name: "Slim Fit Dark Wash Jeans",
    description: "Premium stretch denim in a dark indigo wash. Slim tapered fit with 5-pocket styling. YKK zipper and branded rivets.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "Bottomwear",
    collections: ["Casual Fits", "New Arrivals"],
    stock: 40,
    rating: 4.7,
    numReviews: 134,
    variants: [
      { color: "Dark Indigo", colorCode: "#1A1B3A", sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 12 }, { size: "L", stock: 10 }, { size: "XL", stock: 6 }] },
    ],
  },
  {
    name: "Cargo Jogger Pants",
    description: "Functional cargo joggers with multiple utility pockets. Elastic waistband with drawstring and tapered ankle cuffs. Made from durable ripstop cotton.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?w=400&h=500&fit=crop",
    category: "Bottomwear",
    collections: ["Streetwear", "Casual Fits"],
    stock: 30,
    rating: 4.5,
    numReviews: 78,
    variants: [
      { color: "Olive", colorCode: "#4A5D23", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 10 }, { size: "XL", stock: 5 }] },
      { color: "Black", colorCode: "#1C1C1C", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 8 }, { size: "XL", stock: 4 }] },
    ],
  },
  {
    name: "Relaxed Fit Chinos",
    description: "Versatile cotton twill chinos with a comfortable relaxed fit. Flat front design with slash pockets. From office to weekend brunch.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    category: "Bottomwear",
    collections: ["Office Wear", "Casual Fits"],
    stock: 25,
    rating: 4.4,
    numReviews: 52,
    variants: [
      { color: "Khaki", colorCode: "#C3B091", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 10 }, { size: "XL", stock: 7 }] },
    ],
  },
  {
    name: "Distressed Ripped Jeans",
    description: "Edgy distressed denim with strategic rip detailing. Medium wash with a slim-straight fit. Authentic vintage fade effect.",
    price: 2799,
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop",
    category: "Bottomwear",
    collections: ["Streetwear", "Limited Drop"],
    stock: 15,
    rating: 4.6,
    numReviews: 45,
    variants: [
      { color: "Medium Wash", colorCode: "#6B8BAE", sizes: [{ size: "M", stock: 5 }, { size: "L", stock: 5 }, { size: "XL", stock: 5 }] },
    ],
  },

  // ===== JACKETS =====
  {
    name: "Black Leather Biker Jacket",
    description: "Iconic biker-style jacket in genuine lambskin leather. Asymmetric zip closure, snap lapels, and quilted lining. The ultimate statement piece.",
    price: 5999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Jackets",
    collections: ["Winter Layers", "Limited Drop"],
    stock: 10,
    rating: 4.9,
    numReviews: 67,
    variants: [
      { color: "Black", colorCode: "#0A0A0A", sizes: [{ size: "M", stock: 3 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },
    ],
  },
  {
    name: "Puffer Down Jacket",
    description: "Lightweight yet warm puffer jacket with 600-fill duck down insulation. Water-resistant nylon shell with elastic cuffs. Packable design.",
    price: 3999,
    image: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=400&h=500&fit=crop",
    category: "Jackets",
    collections: ["Winter Layers", "New Arrivals"],
    stock: 20,
    rating: 4.7,
    numReviews: 89,
    variants: [
      { color: "Navy", colorCode: "#1B2A4A", sizes: [{ size: "M", stock: 6 }, { size: "L", stock: 8 }, { size: "XL", stock: 6 }] },
      { color: "Olive", colorCode: "#4A5D23", sizes: [{ size: "M", stock: 4 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    ],
  },
  {
    name: "Denim Trucker Jacket",
    description: "Classic trucker jacket silhouette in washed denim. Point collar, chest flap pockets, and adjustable waist tabs. A timeless layering essential.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=500&fit=crop",
    category: "Jackets",
    collections: ["Streetwear", "Casual Fits"],
    stock: 18,
    rating: 4.5,
    numReviews: 53,
    variants: [
      { color: "Classic Blue", colorCode: "#5B7DB1", sizes: [{ size: "M", stock: 6 }, { size: "L", stock: 7 }, { size: "XL", stock: 5 }] },
    ],
  },

  // ===== SPORTSWEAR =====
  {
    name: "Performance Dry-Fit Tee",
    description: "Engineered moisture-wicking fabric that keeps you dry during intense workouts. Flatlock seams to prevent chafing. Reflective logo detail.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop",
    category: "Sportswear",
    collections: ["Gym Essentials", "Summer Wear"],
    stock: 50,
    rating: 4.6,
    numReviews: 112,
    variants: [
      { color: "Black", colorCode: "#111111", sizes: [{ size: "S", stock: 12 }, { size: "M", stock: 15 }, { size: "L", stock: 12 }, { size: "XL", stock: 8 }] },
      { color: "Grey", colorCode: "#808080", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 10 }, { size: "XL", stock: 5 }] },
    ],
  },
  {
    name: "Gym Shorts Pro",
    description: "Lightweight training shorts with built-in compression liner. 7-inch inseam, zip pocket at the back. Quick-dry polyester blend.",
    price: 999,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop",
    category: "Sportswear",
    collections: ["Gym Essentials"],
    stock: 40,
    rating: 4.5,
    numReviews: 95,
    variants: [
      { color: "Black", colorCode: "#1A1A1A", sizes: [{ size: "S", stock: 10 }, { size: "M", stock: 12 }, { size: "L", stock: 10 }, { size: "XL", stock: 8 }] },
    ],
  },
  {
    name: "Track Joggers Slim Fit",
    description: "Tapered track joggers in premium French terry cotton. Ribbed ankle cuffs, zip pockets, and an elastic waist with internal drawstring.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=500&fit=crop",
    category: "Sportswear",
    collections: ["Gym Essentials", "Casual Fits"],
    stock: 35,
    rating: 4.7,
    numReviews: 78,
    variants: [
      { color: "Dark Grey", colorCode: "#3C3C3C", sizes: [{ size: "M", stock: 10 }, { size: "L", stock: 12 }, { size: "XL", stock: 8 }] },
      { color: "Navy", colorCode: "#1B2A4A", sizes: [{ size: "M", stock: 8 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }] },
    ],
  },

  // ===== FORMAL WEAR =====
  {
    name: "Tailored Slim Fit Blazer",
    description: "Impeccably tailored single-breasted blazer in Italian wool blend. Notch lapels, twin button closure, and a working cuff. Your go-to for sharp occasions.",
    price: 4999,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
    category: "Formal Wear",
    collections: ["Office Wear", "Limited Drop"],
    stock: 12,
    rating: 4.8,
    numReviews: 43,
    variants: [
      { color: "Charcoal", colorCode: "#36454F", sizes: [{ size: "M", stock: 4 }, { size: "L", stock: 4 }, { size: "XL", stock: 4 }] },
    ],
  },
  {
    name: "Formal Dress Shirt",
    description: "Premium Egyptian cotton dress shirt with a spread collar and French cuffs. Wrinkle-resistant finish for a crisp look all day.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
    category: "Formal Wear",
    collections: ["Office Wear"],
    stock: 30,
    rating: 4.6,
    numReviews: 67,
    variants: [
      { color: "White", colorCode: "#FFFFFF", sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 10 }, { size: "L", stock: 8 }, { size: "XL", stock: 6 }] },
      { color: "Sky Blue", colorCode: "#87CEEB", sizes: [{ size: "M", stock: 6 }, { size: "L", stock: 6 }, { size: "XL", stock: 4 }] },
    ],
  },
  {
    name: "Formal Trouser Slim",
    description: "Refined slim-fit formal trousers in premium worsted wool blend. Flat front with extended waistband tab. Sharp crease line for a polished look.",
    price: 2299,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
    category: "Formal Wear",
    collections: ["Office Wear"],
    stock: 22,
    rating: 4.5,
    numReviews: 38,
    variants: [
      { color: "Black", colorCode: "#0D0D0D", sizes: [{ size: "M", stock: 7 }, { size: "L", stock: 8 }, { size: "XL", stock: 7 }] },
    ],
  },

  // ===== ETHNIC WEAR =====
  {
    name: "Classic Kurta Set",
    description: "Handcrafted cotton kurta with matching churidar pajama. Intricate thread embroidery on the placket. Perfect for festive occasions and weddings.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1583391733981-8b530c48a200?w=400&h=500&fit=crop",
    category: "Ethnic Wear",
    collections: ["New Arrivals", "Limited Drop"],
    stock: 15,
    rating: 4.7,
    numReviews: 56,
    variants: [
      { color: "Off-White", colorCode: "#FAF0E6", sizes: [{ size: "M", stock: 5 }, { size: "L", stock: 5 }, { size: "XL", stock: 5 }] },
    ],
  },
  {
    name: "Nehru Jacket - Royal Blue",
    description: "Regal Nehru jacket in rich jacquard fabric. Mandarin collar with ornate buttons. Layer over a kurta for a complete ethnic ensemble.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400&h=500&fit=crop",
    category: "Ethnic Wear",
    collections: ["Limited Drop"],
    stock: 10,
    rating: 4.8,
    numReviews: 29,
    variants: [
      { color: "Royal Blue", colorCode: "#002366", sizes: [{ size: "M", stock: 3 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },
    ],
  },

  // ===== SOCKS =====
  {
    name: "Premium Ankle Socks Pack",
    description: "Pack of 3 premium ankle socks in combed cotton. Reinforced heel and toe, cushioned sole, and moisture-wicking properties. Fits shoe size 7-11.",
    price: 499,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=500&fit=crop",
    category: "Socks",
    collections: ["Gym Essentials", "Casual Fits"],
    stock: 80,
    rating: 4.4,
    numReviews: 210,
    variants: [
      { color: "Black Pack", colorCode: "#111111", sizes: [{ size: "M", stock: 40 }, { size: "L", stock: 40 }] },
      { color: "White Pack", colorCode: "#F0F0F0", sizes: [{ size: "M", stock: 30 }, { size: "L", stock: 30 }] },
    ],
  },
  {
    name: "Crew Socks Stripe Edition",
    description: "Mid-calf crew socks with retro stripe detailing. Soft ribbed cuff for a snug fit. Made from a breathable cotton-poly blend.",
    price: 399,
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=400&h=500&fit=crop",
    category: "Socks",
    collections: ["Streetwear", "Casual Fits"],
    stock: 60,
    rating: 4.3,
    numReviews: 142,
    variants: [
      { color: "Multi Stripe", colorCode: "#E8E8E8", sizes: [{ size: "M", stock: 30 }, { size: "L", stock: 30 }] },
    ],
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("\n🗑️  Deleting all existing products...");
    await Product.deleteMany({});
    console.log("✅ All old products deleted.\n");

    console.log("🌱 Seeding new products...");
    const created = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${created.length} products!\n`);

    created.forEach((p) => {
      console.log(`   📦 ${p.name} — ₹${p.price} [${p.category}]`);
    });

    console.log("\n🎉 Done! All products have realistic fashion images.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
