import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.7s" }} />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Text */}
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-semibold animate-fade-up border border-brand-500/20">
          <Zap size={14} className="fill-brand-500" /> New Drop — Summer 2025
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Wear Your{" "}
          <span className="gradient-text block">Aura</span>
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Premium streetwear crafted for those who express themselves
          through what they wear. Limited drops. Unlimited style.
        </p>

        <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/shop" className="btn-primary flex items-center gap-2">
            Shop Now <ArrowRight size={16} />
          </Link>
          <Link to="/shop" className="btn-outline">
            Explore Collections
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-6 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: Truck, text: "Free Shipping" },
            { icon: Shield, text: "Secure Payment" },
            { icon: Zap, text: "24/7 Support" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Icon size={15} className="text-brand-500" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Image Grid */}
      <div className="relative hidden lg:grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        {[
          { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80", cls: "h-72" },
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", cls: "h-52 mt-8" },
          { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80", cls: "h-52" },
          { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", cls: "h-72 -mt-8" },
        ].map(({ url, cls }, i) => (
          <div key={url} className={`${cls} rounded-2xl overflow-hidden animate-fade-up`} style={{ animationDelay: `${i * 0.1}s` }}>
            <img
              src={url}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              alt=""
            />
          </div>
        ))}

        {/* Floating badge */}
        <div className="absolute bottom-8 -left-6 glass rounded-2xl p-4 shadow-xl animate-float">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Happy Customers</p>
          <p className="font-display font-bold text-xl gradient-text">50K+</p>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;