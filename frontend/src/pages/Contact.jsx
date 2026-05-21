import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, Send, HelpCircle, ArrowRight } from "lucide-react";

const supportCategories = [
  { icon: MessageSquare, title: "Order Support", desc: "Track, modify, or cancel your orders", response: "< 2 hours" },
  { icon: HelpCircle, title: "Product Help", desc: "Sizing, availability, and product info", response: "< 4 hours" },
  { icon: Mail, title: "Returns & Refunds", desc: "Initiate returns or check refund status", response: "< 6 hours" },
];

const Contact = () => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => { setVisible(true); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <Mail size={14} /> GET IN TOUCH
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              We're here to help. Reach out and we'll respond as quickly as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Support Categories */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {supportCategories.map(({ icon: Icon, title, desc, response }) => (
            <div key={title} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 text-center group">
              <Icon size={24} className="text-brand-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display font-bold text-sm mb-1">{title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{desc}</p>
              <span className="text-xs font-medium bg-green-500/10 text-green-500 px-3 py-1 rounded-full">
                Response: {response}
              </span>
            </div>
          ))}
        </div>

        {/* Form + Info Grid */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Send a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 text-sm font-medium">
                  ✅ Message sent! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { name: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                  { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused("")}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-800 transition-all duration-300 focus:outline-none ${
                        focused === field.name
                          ? "border-brand-500 shadow-lg shadow-brand-500/10"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 block">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused("")}
                    placeholder="Describe your inquiry..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-zinc-50 dark:bg-zinc-800 resize-none transition-all duration-300 focus:outline-none ${
                      focused === "message"
                        ? "border-brand-500 shadow-lg shadow-brand-500/10"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, title: "Email", info: "support@luxorawear.com", sub: "We reply within 4 hours" },
              { icon: Phone, title: "Phone", info: "+91 98765 43210", sub: "Mon-Sat, 10AM - 7PM IST" },
              { icon: MapPin, title: "Office", info: "Lower Parel, Mumbai", sub: "Maharashtra, India 400013" },
              { icon: Clock, title: "Business Hours", info: "Mon - Sat: 10AM - 7PM", sub: "Sunday: Closed" },
            ].map(({ icon: Icon, title, info, sub }) => (
              <div key={title} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={18} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{info}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Links */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10">
              <p className="font-semibold text-sm mb-3">Quick Help</p>
              <div className="space-y-2">
                {[
                  { label: "FAQ", to: "/faq" },
                  { label: "Shipping Policy", to: "/shipping" },
                  { label: "Returns", to: "/returns" },
                  { label: "Size Guide", to: "/size-guide" },
                ].map((link) => (
                  <Link key={link.label} to={link.to} className="flex items-center gap-1 text-sm text-brand-500 hover:gap-2 transition-all">
                    {link.label} <ArrowRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
