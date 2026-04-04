import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display text-xl font-bold text-white">NEXUS</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Modern fashion for the modern soul. Curated collections that make you stand out.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-200 text-xs font-bold">
                IN
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-200 text-xs font-bold">
                TW
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-200 text-xs font-bold">
                YT
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Sale</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Collections</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Press</a></li>
              <li><a href="#" className="text-sm hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-12 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex-1">
            <h4 className="font-display font-semibold text-white mb-1">Stay in the loop</h4>
            <p className="text-sm">Get early access to new drops and exclusive offers.</p>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-white text-sm border border-zinc-700 focus:outline-none focus:border-brand-500 w-full sm:w-auto"
            />
            <button className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
              <Mail size={14} />
              Subscribe
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>2025 NEXUS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;