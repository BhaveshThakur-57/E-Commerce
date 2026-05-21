import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Scale } from "lucide-react";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", content: "By accessing or using the LUXORA website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our platform. These terms apply to all users, including visitors, registered users, and purchasers." },
  { id: "accounts", title: "User Accounts", content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. You must be at least 18 years old or have parental consent to create an account. LUXORA reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity." },
  { id: "products", title: "Products & Pricing", content: "All product descriptions, images, and specifications are provided as accurately as possible. Colors may vary slightly due to monitor settings. Prices are listed in Indian Rupees (₹) and include applicable GST. We reserve the right to modify prices at any time without prior notice. Sale prices are valid only during the promotional period. In case of pricing errors, we reserve the right to cancel orders placed at incorrect prices." },
  { id: "orders", title: "Orders & Payment", content: "Placing an order constitutes an offer to purchase, which we may accept or decline. Payment must be completed through our supported payment methods (Razorpay). An order is confirmed only after successful payment verification. We reserve the right to limit order quantities. Orders may be cancelled if products are out of stock or if we detect fraudulent activity." },
  { id: "shipping", title: "Shipping & Delivery", content: "Delivery timelines are estimates and may vary based on location and availability. Risk of loss transfers to you upon delivery. We are not responsible for delays caused by shipping carriers, weather, or force majeure events. Please refer to our Shipping Policy page for detailed information on delivery timelines and methods." },
  { id: "returns", title: "Returns & Refunds", content: "Returns are accepted within 30 days of delivery, subject to our Returns Policy. Items must be in original, unworn condition with tags attached. Refunds are processed to the original payment method within 5-7 business days. Shipping charges may be non-refundable for non-defective returns. Please refer to our Returns & Exchanges page for complete details." },
  { id: "ip", title: "Intellectual Property", content: "All content on LUXORA — including logos, text, images, designs, and software — is our intellectual property or licensed to us. You may not reproduce, distribute, or create derivative works from our content without written permission. The LUXORA name, logo, and 'Wear the Extraordinary' tagline are trademarks of LUXORA." },
  { id: "conduct", title: "User Conduct", content: "You agree not to use our platform for any unlawful purpose, post false or misleading reviews, attempt to access other users' accounts, interfere with the platform's functionality, use automated tools to scrape data, or engage in any activity that could harm LUXORA or its users. Violation of these rules may result in immediate account termination." },
  { id: "liability", title: "Limitation of Liability", content: "LUXORA shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability shall not exceed the amount you paid for the specific product or service in question. We are not responsible for third-party content, services, or links accessible through our platform." },
  { id: "changes", title: "Changes to Terms", content: "We reserve the right to modify these Terms & Conditions at any time. Changes will be effective upon posting to our website. Continued use of LUXORA after changes constitutes acceptance of the updated terms. We will notify users of significant changes via email." },
  { id: "governing", title: "Governing Law", content: "These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms shall be resolved through the courts of Mumbai, Maharashtra. If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force." },
];

const Terms = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("acceptance");
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <FileText size={14} /> LEGAL
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Please read these terms carefully before using LUXORA.
            </p>
            <p className="text-xs text-zinc-400 mt-4">Last updated: May 2025</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Sections</p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-brand-500/10 text-brand-500 font-semibold"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10 flex items-start gap-4">
              <Scale size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">Legal Agreement</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  These Terms & Conditions constitute a legally binding agreement between you and LUXORA. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>

            {sections.map((section, i) => (
              <div
                key={section.id}
                id={section.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 scroll-mt-28"
              >
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-brand-500 text-sm font-bold">{String(i + 1).padStart(2, "0")}.</span>
                  {section.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Terms;
