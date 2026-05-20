import { useState } from "react";
import { Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (location.pathname.startsWith("/admin")) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Simulate API call
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/40">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white block leading-none">
                  LUXORA
                </span>
                <span className="text-xs text-zinc-500 leading-none">
                  Wear the Extraordinary
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 mt-3">
              Premium clothing that speaks your vibe. Engineered for those who wear the extraordinary.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-200 text-xs font-bold">
                IN
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-200 text-xs font-bold">
                TW
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm hover:text-brand-400 transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-sm hover:text-brand-400 transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="text-sm hover:text-brand-400 transition-colors">Sale</Link></li>
              <li><Link to="/shop" className="text-sm hover:text-brand-400 transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm hover:text-brand-400 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-sm hover:text-brand-400 transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-sm hover:text-brand-400 transition-colors">Returns</Link></li>
              <li><Link to="/size-guide" className="text-sm hover:text-brand-400 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-sm hover:text-brand-400 transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-sm hover:text-brand-400 transition-colors">Press</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-brand-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-12 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex-1">
            <h4 className="font-display font-semibold text-white mb-1">Stay in the loop</h4>
            <p className="text-sm">Get early access to new drops and exclusive offers.</p>
          </div>
          <div className="flex gap-2 relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-white text-sm border border-zinc-700 focus:outline-none focus:border-brand-500 w-full sm:w-64"
            />
            <button type="submit" className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
              <Mail size={14} />
              Subscribe
            </button>
            {subscribed && (
              <span className="absolute -bottom-6 left-0 text-xs text-green-400 font-medium">Successfully subscribed!</span>
            )}
          </div>
        </form>

        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>2025 LUXORA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;