import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ArrowRight, Heart, Users, Sparkles, ShoppingBag } from "lucide-react";

const openings = [
  {
    title: "Sales Associate",
    type: "Full-time",
    location: "In-Store",
    desc: "Help customers find their perfect style. Assist with product selection, sizing, and provide a premium shopping experience at our store.",
  },
  {
    title: "Store Helper",
    type: "Full-time",
    location: "In-Store",
    desc: "Manage inventory, organize product displays, handle stock receiving, and keep the store looking fresh and well-maintained.",
  },
  {
    title: "Cashier",
    type: "Full-time / Part-time",
    location: "In-Store",
    desc: "Handle billing, process payments, manage returns, and ensure every customer leaves with a smile.",
  },
  {
    title: "Visual Merchandiser",
    type: "Full-time",
    location: "In-Store",
    desc: "Design eye-catching window displays and in-store layouts. Make our products look irresistible and keep the store visually premium.",
  },
];

const benefits = [
  { icon: Heart, title: "Staff Discounts", desc: "Flat 40% off on all LUXORA products for team members" },
  { icon: Users, title: "Friendly Team", desc: "Work with passionate people who love fashion" },
  { icon: Sparkles, title: "Growth", desc: "Learn retail, styling & customer service — grow with us" },
  { icon: ShoppingBag, title: "Flexible Hours", desc: "Choose shifts that work around your schedule" },
];

const Careers = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <ShoppingBag size={14} /> JOIN OUR TEAM
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6">
              Work at{" "}
              <span className="gradient-text">LUXORA</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Love fashion? Join our store team and help customers discover their style.
              No corporate experience needed — just passion, energy, and a love for great clothing.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:-translate-y-1 transition-all duration-300">
              <Icon size={22} className="text-brand-500 mx-auto mb-3" />
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <h2 className="font-display text-3xl font-bold text-center mb-10">Open Positions</h2>
        <div className="space-y-4 mb-16">
          {openings.map((job) => (
            <div
              key={job.title}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg group-hover:text-brand-500 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">{job.desc}</p>
                </div>
                <Link
                  to="/contact"
                  className="flex-shrink-0 text-sm font-semibold text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Apply <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* How to Apply */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10">
          <h2 className="font-display text-2xl font-bold mb-3">How to Apply?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            Walk into our store with your resume, or send us a message through our contact page. We'd love to meet you!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/store-locator" className="btn-primary text-sm flex items-center gap-2">
              <MapPin size={16} /> Visit Our Store
            </Link>
            <Link to="/contact" className="btn-outline text-sm flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Careers;
