<p align="center">
  <img src="https://img.shields.io/badge/LUXORA-Wear_the_Extraordinary-7c3aed?style=for-the-badge&labelColor=0f0f0f" alt="LUXORA" />
</p>

<h1 align="center">🛍️ LUXORA — Premium E-Commerce Platform</h1>

<p align="center">
  <strong>A full-stack, AI-powered e-commerce platform for premium streetwear, built with the MERN stack.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=flat-square&logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [AI Features](#-ai-features)
- [Admin Panel](#-admin-panel)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**LUXORA** is a production-ready, full-stack e-commerce platform designed for premium Indian streetwear. It combines a modern, responsive storefront with a powerful admin dashboard and AI-powered features — all built from scratch using the MERN stack.

The platform handles the complete shopping lifecycle: product browsing, AI-powered search and recommendations, cart management, coupon validation, Razorpay payment integration, order tracking, PDF invoice generation, and email notifications.

---

## ✨ Key Features

### 🛒 Customer Experience
| Feature | Description |
|---|---|
| **Product Catalog** | Filterable shop with categories, collections, color variants, and size options (XS–XXL) |
| **AI Smart Search** | Natural language product search powered by Google Gemini AI |
| **AI Recommendations** | Personalized "You May Also Like" suggestions on product pages |
| **AI Size Predictor** | Enter height, weight, and fit preference — get an AI-recommended size |
| **Shopping Cart** | Slide-out cart sidebar with quantity controls and real-time price updates |
| **Wishlist** | Save favorite products for later, synced to your account |
| **Coupon System** | Apply percentage or flat discount codes at checkout with validation |
| **Razorpay Payments** | Secure Indian payment gateway with signature verification |
| **Order Tracking** | Real-time order status tracking with history timeline |
| **PDF Invoices** | Auto-generated, branded PDF invoices downloadable per order |
| **Email Notifications** | Order confirmation, payment failure, and low stock alert emails |
| **Product Reviews** | Star ratings with verified purchase badges, one review per user per product |
| **Google OAuth** | One-click sign in with Google alongside traditional email/password auth |
| **Dark Mode** | System-aware theme toggle with smooth transitions |
| **AI Chatbot** | Floating Gemini-powered shopping assistant for sizing, styling, and FAQs |

### 🔧 Admin Panel
| Feature | Description |
|---|---|
| **Analytics Dashboard** | Revenue charts, top-selling products, order status distribution (via Recharts) |
| **Product Management** | Full CRUD with multi-image upload, variant management (color + size + stock) |
| **AI Description Generator** | Auto-generate product descriptions using Gemini AI |
| **Order Management** | View, filter, and update order statuses (processing → shipped → delivered) |
| **Coupon Management** | Create, edit, toggle, and delete discount codes |
| **Inquiry Management** | View and respond to customer contact form submissions |
| **Bulk Operations** | Bulk edit stock/price inline, CSV import products, Excel export orders & products |
| **Low Stock Alerts** | Dashboard warnings + automated email alerts when stock drops below threshold |
| **Site Settings** | Manage announcement bar text, colors, and homepage banners |

### 🎨 Design & UX
| Feature | Description |
|---|---|
| **Responsive Design** | Mobile-first layout that adapts seamlessly to all screen sizes |
| **Glassmorphism UI** | Backdrop-blur navigation bar with smooth scroll effects |
| **Micro-animations** | Hover effects, scale transitions, and animated elements throughout |
| **Gradient Accents** | Curated brand palette with vibrant gradient CTAs and badges |
| **Skeleton Loaders** | Smooth loading states for better perceived performance |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library with hooks and context API |
| **Vite 8** | Lightning-fast build tool and dev server |
| **React Router 7** | Client-side routing and navigation |
| **TailwindCSS 3.4** | Utility-first CSS framework |
| **Recharts** | Charts and analytics visualizations |
| **Lucide React** | Modern, consistent icon system |
| **Axios** | HTTP client for API communication |
| **PapaParse** | CSV file parsing for bulk imports |
| **XLSX (SheetJS)** | Excel file generation for data exports |
| **@react-oauth/google** | Google Sign-In integration |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | RESTful API server |
| **MongoDB + Mongoose** | NoSQL database with schema validation |
| **JWT** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **Razorpay SDK** | Payment order creation and signature verification |
| **Google Generative AI** | Gemini API for AI features (search, chat, recommendations, descriptions) |
| **Nodemailer** | Transactional email delivery |
| **PDFKit** | Server-side PDF invoice generation |
| **Multer** | File upload handling for product images |
| **google-auth-library** | Google OAuth token verification |

### DevOps & Tooling
| Tool | Purpose |
|---|---|
| **Vercel** | Frontend deployment with SPA rewrites |
| **Render / Railway** | Backend API hosting |
| **MongoDB Atlas** | Cloud database cluster |
| **Nodemon** | Hot-reload during development |
| **ESLint** | Code quality and linting |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     LUXORA ARCHITECTURE                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐          ┌─────────────────────┐       │
│   │   React 19  │  Axios   │   Express.js API    │       │
│   │   + Vite    │ ◄──────► │   + JWT Auth        │       │
│   │   Frontend  │  REST    │   + Middleware       │       │
│   └─────────────┘          └──────────┬──────────┘       │
│         │                             │                  │
│    ┌────┴────┐              ┌─────────┴─────────┐        │
│    │ Vercel  │              │   MongoDB Atlas    │        │
│    │ (CDN)   │              │   (Cloud DB)       │        │
│    └─────────┘              └───────────────────┘        │
│                                       │                  │
│                             ┌─────────┴─────────┐        │
│                             │  External Services │        │
│                             ├───────────────────┤        │
│                             │ • Razorpay (Pay)  │        │
│                             │ • Gemini AI (LLM) │        │
│                             │ • Google OAuth    │        │
│                             │ • Nodemailer (SMTP)│        │
│                             └───────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

> _Add screenshots of your live application here. Suggested screens:_
> - 🏠 **Home Page** — Hero section, categories, trending products, testimonials
> - 🛍️ **Shop Page** — Product grid with filters and search
> - 📦 **Product Detail** — Image gallery, size selection, reviews, AI recommendations
> - 🛒 **Cart & Checkout** — Slide-out cart, address form, coupon input
> - 💳 **Payment** — Razorpay integration flow
> - 📊 **Admin Dashboard** — Revenue analytics, order status, low stock alerts
> - 📝 **Admin Products** — Product CRUD with AI description generator
> - 🤖 **AI Chatbot** — Floating assistant conversation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Razorpay Account** — [Sign up](https://razorpay.com/) for API keys
- **Google Cloud Console** — For OAuth Client ID and Gemini API key
- **Git** — [Download](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/luxora-ecommerce.git
cd luxora-ecommerce
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Configure environment variables**

Create `.env` files in both `backend/` and `frontend/` directories. See [Environment Variables](#-environment-variables) below.

**5. Start the development servers**

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

**6. Open in browser**

```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxora

# Authentication
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/google` | Google OAuth login | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products` | Get all products | ❌ |
| `GET` | `/api/products/:id` | Get single product | ❌ |
| `POST` | `/api/products` | Create product | 🔒 Admin |
| `PUT` | `/api/products/:id` | Update product | 🔒 Admin |
| `DELETE` | `/api/products/:id` | Delete product | 🔒 Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/cart` | Get user's cart | ✅ |
| `POST` | `/api/cart` | Add item to cart | ✅ |
| `PUT` | `/api/cart` | Update cart item qty | ✅ |
| `DELETE` | `/api/cart/:id` | Remove item from cart | ✅ |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/orders` | Create new order | ✅ |
| `GET` | `/api/orders` | Get user's orders | ✅ |
| `GET` | `/api/orders/:id` | Get order by ID | ✅ |

### Payments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/payment/create-order` | Create Razorpay order | ✅ |
| `POST` | `/api/payment/verify` | Verify payment signature | ✅ |
| `POST` | `/api/payment/failed` | Handle failed payment | ✅ |
| `POST` | `/api/payment/send-success-email` | Trigger confirmation email | ✅ |

### AI Features
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/ai/search?q=` | AI-powered smart search | ❌ |
| `GET` | `/api/ai/recommendations/:productId` | Get AI recommendations | ❌ |
| `POST` | `/api/ai/generate-description` | Generate product description | 🔒 Admin |
| `POST` | `/api/ai/predict-size` | AI size prediction | ❌ |

### Other Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/coupons/validate` | Validate coupon code | ✅ |
| `GET/POST` | `/api/wishlist` | Get/Toggle wishlist | ✅ |
| `GET/POST` | `/api/reviews/:productId` | Get/Create reviews | ✅ |
| `POST` | `/api/chat` | AI chatbot message | ❌ |
| `GET` | `/api/invoice/:orderId` | Download PDF invoice | ✅ |
| `POST` | `/api/inquiries` | Submit contact inquiry | ❌ |
| `GET/PUT` | `/api/settings` | Site settings (admin) | 🔒 Admin |
| `POST` | `/api/upload` | Upload product images | 🔒 Admin |

### Admin Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/stats` | Dashboard statistics | 🔒 Admin |
| `GET` | `/api/admin/orders` | All orders | 🔒 Admin |
| `PUT` | `/api/admin/orders/:id` | Update order status | 🔒 Admin |
| `GET` | `/api/admin/users` | All users | 🔒 Admin |
| `POST` | `/api/admin/bulk-stock` | Bulk update stock | 🔒 Admin |
| `POST` | `/api/admin/bulk-upload` | Bulk upload products (CSV) | 🔒 Admin |
| `GET/POST/PUT/DELETE` | `/api/coupons` | Coupon CRUD | 🔒 Admin |
| `GET/PUT` | `/api/admin/inquiries` | Manage inquiries | 🔒 Admin |

> **Legend:** ❌ = Public, ✅ = User Auth Required, 🔒 = Admin Only

---

## 🤖 AI Features

LUXORA integrates **Google Gemini AI** across multiple touchpoints with a robust fallback chain (`gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.5-pro`) and exponential backoff retry logic:

### Smart Search
Users can type natural language queries like _"show me black oversized t-shirts under ₹1500"_ and the AI matches intent to products in the catalog. Falls back to regex-based search if AI is unavailable.

### Product Recommendations
On each product detail page, the AI analyzes the current product and suggests 4 complementary or similar items. Falls back to same-category products.

### Size Predictor
Users input their height (cm), weight (kg), and fit preference (regular/oversized) — the AI returns a recommended size with explanation, tailored to Indian sizing standards.

### AI Description Generator (Admin)
When adding products, admins can auto-generate compelling product descriptions by providing just the product name, category, and price.

### AI Chatbot
A floating chat assistant helps customers with sizing advice, styling suggestions, fabric details, and general FAQs — all in LUXORA's modern, stylish brand voice.

---

## 🖥️ Admin Panel

Access the admin dashboard at `/admin` (requires admin role).

| Module | Route | Capabilities |
|--------|-------|-------------|
| **Dashboard** | `/admin` | Revenue/order analytics, charts, recent orders, low stock alerts |
| **Products** | `/admin/products` | CRUD, multi-image, variants (color/size/stock), AI descriptions |
| **Orders** | `/admin/orders` | View all orders, update status, filter by status |
| **Coupons** | `/admin/coupons` | Create/edit/toggle/delete promo codes |
| **Bulk Ops** | `/admin/bulk` | Inline stock/price editing, CSV import, Excel export |
| **Inquiries** | `/admin/inquiries` | View and manage customer contact submissions |

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variables (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_RAZORPAY_KEY_ID`)
5. Deploy — Vercel auto-detects Vite and configures build settings
6. The included `vercel.json` handles SPA route rewrites

### Backend (Render / Railway)

1. Create a new Web Service
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all backend environment variables
6. Set the `FRONTEND_URL` to your Vercel deployment URL

---

## 📁 Project Structure

```
E_Commerce/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js       # Dashboard stats, bulk operations
│   │   ├── aiController.js          # Smart search, recommendations, size predictor
│   │   ├── authController.js        # Register, login, Google OAuth, profile
│   │   ├── cartController.js        # Cart CRUD operations
│   │   ├── chatController.js        # AI chatbot conversations
│   │   ├── couponController.js      # Coupon validation and CRUD
│   │   ├── inquiryController.js     # Contact form inquiries
│   │   ├── invoiceController.js     # PDF invoice download
│   │   ├── orderController.js       # Order creation and management
│   │   ├── paymentController.js     # Razorpay integration
│   │   ├── productController.js     # Product CRUD
│   │   ├── reviewController.js      # Product reviews and ratings
│   │   ├── settingsController.js    # Site settings management
│   │   └── wishlistController.js    # Wishlist toggle
│   ├── middleware/
│   │   ├── adminMiddleware.js       # Admin role guard
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── errorMiddleware.js       # Global error handler
│   │   └── uploadMiddleware.js      # Multer file upload config
│   ├── models/
│   │   ├── Cart.js                  # Cart schema
│   │   ├── Coupon.js                # Coupon schema (% or flat, limits, expiry)
│   │   ├── Inquiry.js               # Contact inquiry schema
│   │   ├── Order.js                 # Order with tracking history
│   │   ├── Product.js               # Product with variants & collections
│   │   ├── Review.js                # Reviews (1 per user per product)
│   │   ├── SiteSetting.js           # Announcement bar, banners, pages
│   │   └── User.js                  # User with wishlist & roles
│   ├── routes/                      # Express route definitions (15 route files)
│   ├── utils/
│   │   ├── emailTemplates.js        # HTML email templates
│   │   ├── generateInvoice.js       # PDFKit invoice generator
│   │   ├── generateOrderId.js       # Unique order ID generator
│   │   ├── generateToken.js         # JWT token helper
│   │   └── sendEmail.js             # Nodemailer wrapper
│   ├── uploads/                     # Product image storage
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx       # Admin-only route guard
│   │   │   ├── AdminSidebar.jsx     # Admin navigation sidebar
│   │   │   ├── AnnouncementBar.jsx  # Dynamic top banner
│   │   │   ├── CartSidebar.jsx      # Slide-out shopping cart
│   │   │   ├── ChatBot.jsx          # Floating AI chat assistant
│   │   │   ├── Footer.jsx           # Site footer with links
│   │   │   ├── HeroSection.jsx      # Homepage hero banner
│   │   │   ├── Loader.jsx           # Loading spinner component
│   │   │   ├── Navbar.jsx           # Responsive navigation bar
│   │   │   ├── OrderCard.jsx        # Order display component
│   │   │   ├── ProductCard.jsx      # Product grid card
│   │   │   ├── ProtectedRoute.jsx   # Auth-required route guard
│   │   │   ├── ScrollToTop.jsx      # Scroll reset on navigation
│   │   │   ├── StarRating.jsx       # Star rating display
│   │   │   ├── ThemeToggle.jsx      # Dark/light mode switch
│   │   │   └── Toast.jsx            # Toast notification
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── CartContext.jsx      # Cart state management
│   │   │   ├── ThemeContext.jsx     # Dark mode state
│   │   │   └── WishlistContext.jsx  # Wishlist state
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   ├── useCart.js           # Cart hook
│   │   │   └── useToast.js         # Toast hook
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminBulkOperations.jsx
│   │   │   │   ├── AdminCoupons.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminInquiries.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   └── AdminProducts.jsx
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Shop.jsx             # Product catalog
│   │   │   ├── Collections.jsx      # Curated collections
│   │   │   ├── ProductDetail.jsx    # Single product view
│   │   │   ├── Cart.jsx             # Full cart page
│   │   │   ├── Checkout.jsx         # Checkout flow
│   │   │   ├── OrderSuccess.jsx     # Order confirmation
│   │   │   ├── OrderHistory.jsx     # Past orders
│   │   │   ├── Wishlist.jsx         # Saved products
│   │   │   ├── Profile.jsx          # User profile settings
│   │   │   ├── Login.jsx            # Auth page (login/register)
│   │   │   ├── Contact.jsx          # Contact form
│   │   │   ├── About.jsx            # Brand story
│   │   │   ├── FAQ.jsx              # Frequently asked questions
│   │   │   ├── Shipping.jsx         # Shipping information
│   │   │   ├── Returns.jsx          # Return policy
│   │   │   ├── Privacy.jsx          # Privacy policy
│   │   │   ├── Terms.jsx            # Terms of service
│   │   │   ├── SizeGuide.jsx        # Sizing reference
│   │   │   ├── StoreLocator.jsx     # Store locations
│   │   │   ├── Careers.jsx          # Careers page
│   │   │   └── Press.jsx            # Press/media page
│   │   ├── services/                # API service layer (13 service files)
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Tailwind directives & custom CSS
│   │   └── main.jsx                 # React entry point
│   ├── vercel.json                  # Vercel SPA rewrite rules
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind customizations
│   └── package.json
│
├── .gitignore                       # Comprehensive ignore rules
└── README.md                        # You are here!
```

---

## 🧰 Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start with nodemon (hot reload)
```

### Frontend

```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/your-username">Bhavesh Thakur</a></strong>
</p>

<p align="center">
  <sub>⭐ Star this repo if you found it helpful!</sub>
</p>
