import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Truck, Clock, Globe, Package, MapPin, Shield, CheckCircle, Zap } from "lucide-react";

const shippingTimelines = [
  { region: "Metro Cities", time: "2-3 days", desc: "Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune", icon: Zap, color: "from-brand-500 to-blue-500" },
  { region: "Tier 1 Cities", time: "3-5 days", desc: "Ahmedabad, Jaipur, Lucknow, Chandigarh, Indore & more", icon: Truck, color: "from-blue-500 to-purple-500" },
  { region: "Tier 2 & 3 Cities", time: "5-7 days", desc: "All other serviceable pin codes across India", icon: MapPin, color: "from-purple-500 to-accent-400" },
  { region: "Remote Areas", time: "7-10 days", desc: "Remote locations, hill stations, and island territories", icon: Globe, color: "from-accent-400 to-pink-500" },
];

const processSteps = [
  { step: 1, title: "Order Placed", desc: "Your order is confirmed and queued for processing", icon: CheckCircle },
  { step: 2, title: "Processing", desc: "Items are being carefully picked and quality checked", icon: Package },
  { step: 3, title: "Shipped", desc: "Package handed to our logistics partner with tracking", icon: Truck },
  { step: 4, title: "Delivered", desc: "Package arrives at your doorstep — enjoy!", icon: Shield },
];

const Shipping = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <Truck size={14} /> FREE SHIPPING OVER ₹999
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Shipping <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Fast, reliable delivery across India with real-time tracking and premium packaging.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Delivery Timeline Cards */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Delivery Timelines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {shippingTimelines.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.region}
                  className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-lg">{item.region}</h3>
                    <span className="text-brand-500 font-bold text-sm bg-brand-500/10 px-3 py-1 rounded-full">{item.time}</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-400 to-pink-500 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center group">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border-2 border-brand-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20 group-hover:scale-110 group-hover:shadow-brand-500/40 transition-all duration-300">
                      <Icon size={24} className="text-brand-500" />
                    </div>
                    <p className="text-xs text-brand-500 font-bold mb-1">STEP {step.step}</p>
                    <h3 className="font-display font-bold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Package, title: "Premium Packaging", desc: "Every order is wrapped in our signature matte black packaging with tissue paper and a thank-you card." },
            { icon: Shield, title: "Insured Shipment", desc: "All orders are fully insured during transit. Any damage during shipping is our responsibility." },
            { icon: Clock, title: "Order Cutoff", desc: "Orders placed before 2:00 PM IST on business days are dispatched the same day." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 transition-all duration-300">
              <Icon size={20} className="text-brand-500 mb-3" />
              <h3 className="font-display font-bold text-sm mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <p className="text-2xl font-display font-bold mb-3">Have more questions?</p>
          <p className="text-zinc-500 text-sm mb-6">Check our FAQ or get in touch with our support team.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/faq" className="btn-outline text-sm">View FAQ</Link>
            <Link to="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shipping;
