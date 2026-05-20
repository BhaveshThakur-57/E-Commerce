const fs = require('fs');
const path = require('path');

const CATEGORIES_ARRAY_STRING = `["Streetwear", "Essentials", "Oversized Fits", "Urban Classics", "Summer Drop", "Winter Layers", "Premium Cotton", "Limited Edition"]`;
const CATEGORIES_ALL_ARRAY_STRING = `["All", "Streetwear", "Essentials", "Oversized Fits", "Urban Classics", "Summer Drop", "Winter Layers", "Premium Cotton", "Limited Edition"]`;

// 1. backend/models/Product.js
let productJs = fs.readFileSync('backend/models/Product.js', 'utf8');
productJs = productJs.replace(/enum:\s*\["Tops",\s*"Bottoms",\s*"Outerwear",\s*"Footwear",\s*"Accessories"\]/, `enum: ${CATEGORIES_ARRAY_STRING}`);
fs.writeFileSync('backend/models/Product.js', productJs);

// 2. frontend/src/pages/Admin/AdminProducts.jsx
let adminProductsJsx = fs.readFileSync('frontend/src/pages/Admin/AdminProducts.jsx', 'utf8');
adminProductsJsx = adminProductsJsx.replace(/const CATEGORIES = \["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"\];/, `const CATEGORIES = ${CATEGORIES_ARRAY_STRING};`);
adminProductsJsx = adminProductsJsx.replace(/category: "Tops"/, 'category: "Streetwear"');
fs.writeFileSync('frontend/src/pages/Admin/AdminProducts.jsx', adminProductsJsx);

// 3. frontend/src/pages/Shop.jsx
let shopJsx = fs.readFileSync('frontend/src/pages/Shop.jsx', 'utf8');
shopJsx = shopJsx.replace(/const CATEGORIES = \["All", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"\];/, `const CATEGORIES = ${CATEGORIES_ALL_ARRAY_STRING};`);
fs.writeFileSync('frontend/src/pages/Shop.jsx', shopJsx);

// 4. frontend/src/pages/Home.jsx
let homeJsx = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
homeJsx = homeJsx.replace(/const CATEGORIES = \[[\s\S]*?\];/, `const CATEGORIES = [
  { name: "Streetwear", emoji: "🔥", count: 48 },
  { name: "Essentials", emoji: "✨", count: 32 },
  { name: "Oversized Fits", emoji: "👕", count: 24 },
  { name: "Urban Classics", emoji: "🏙️", count: 56 },
  { name: "Summer Drop", emoji: "☀️", count: 80 },
];`);
fs.writeFileSync('frontend/src/pages/Home.jsx', homeJsx);

// 5. frontend/src/components/Navbar.jsx
let navbarJsx = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
navbarJsx = navbarJsx.replace(/<span className="text-white font-bold text-sm">A<\/span>/, `<span className="text-white font-bold text-sm">L</span>`);
// Remove Admin link completely
navbarJsx = navbarJsx.replace(/\{user\?\.role === "admin" && \([\s\S]*?Admin\s*<\/Link>\s*\)\}/, '');
fs.writeFileSync('frontend/src/components/Navbar.jsx', navbarJsx);

console.log('Categories and Navbar updated.');
