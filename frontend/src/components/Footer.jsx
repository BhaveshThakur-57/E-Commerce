import { Link, useLocation } from "react-router-dom";

// Inline SVG social icons since lucide-react doesn't include brand icons
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const XTwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-8 mt-24 relative overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white block leading-none">
                  LUXORA
                </span>
                <span className="text-[11px] text-zinc-500 leading-none tracking-widest uppercase">
                  Wear the Extraordinary
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-zinc-500">
              Premium fashion crafted for those who express themselves through what they wear. Limited drops. Unlimited style.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-pink-500/30 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 hover:border-transparent hover:shadow-lg hover:shadow-white/20 hover:scale-110 transition-all duration-300"
                aria-label="X / Twitter"
              >
                <XTwitterIcon />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: "New Arrivals", to: "/shop" },
                { label: "Best Sellers", to: "/shop" },
                { label: "Collections", to: "/shop?category=Featured" },
                { label: "Sale", to: "/shop" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-brand-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-3">
              {[
                { label: "FAQ", to: "/faq" },
                { label: "Shipping", to: "/shipping" },
                { label: "Returns & Exchanges", to: "/returns" },
                { label: "Size Guide", to: "/size-guide" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-brand-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-wider">Visit Us</h4>
            <ul className="space-y-3">
              {[
                { label: "Our Store", to: "/store-locator" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Careers", to: "/careers" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-brand-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <p className="text-xs text-zinc-600 mb-1">Store Hours</p>
              <p className="text-sm text-zinc-400">Mon – Sat: 10 AM – 9 PM</p>
              <p className="text-sm text-zinc-400">Sunday: 11 AM – 7 PM</p>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© 2025 LUXORA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-zinc-300 transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-zinc-300 transition-colors duration-200">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;