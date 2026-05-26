import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Collections", to: "/collections" },
    { label: "About", to: "/about" },
  ];

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-black/5 py-3" : "bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/40">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold gradient-text block leading-none">LUXORA</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-none">Admin Panel</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Hi, {user.name?.split(" ")[0]}</span>
                <button onClick={logout} className="btn-outline text-sm !py-2 !px-5">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-zinc-200/50 dark:border-zinc-800/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <span className="font-display text-xl font-bold gradient-text block leading-none">
              LUXORA
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-none">
              Wear the Extraordinary
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));
            return (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`text-sm font-medium relative group transition-colors duration-200 ${
                    isActive
                      ? "text-brand-500"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-400 rounded-full transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden md:flex p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-brand-500 relative"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-brand-500"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              
              <Link
                to="/orders"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-brand-500 transition-colors"
              >
                My Orders
              </Link>

              {/* FIX: Hi, Name — ab profile pe jaata hai */}
              <Link
                to="/profile"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-brand-500 transition-colors"
              >
                Hi, {user.name?.split(" ")[0]}
              </Link>

              <button onClick={logout} className="btn-outline text-sm !py-2 !px-5">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block btn-primary text-sm !py-2 !px-5">
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass animate-fade-in border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-zinc-700 dark:text-zinc-300 font-medium hover:text-brand-500 transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/wishlist"
              className="text-zinc-700 dark:text-zinc-300 font-medium hover:text-brand-500 transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800"
            >
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-zinc-700 dark:text-zinc-300 font-medium hover:text-brand-500 transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800"
                >
                  Hi, {user.name?.split(" ")[0]} — Profile
                </Link>
                <Link
                  to="/orders"
                  className="text-zinc-700 dark:text-zinc-300 font-medium hover:text-brand-500 transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800"
                >
                  My Orders
                </Link>
                <button onClick={logout} className="btn-outline text-center mt-2">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-center mt-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;