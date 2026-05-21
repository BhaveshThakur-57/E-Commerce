import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock } from "lucide-react";

const sections = [
  { id: "collection", title: "Information We Collect", content: "We collect information you provide directly, such as your name, email address, shipping address, phone number, and payment information when you create an account, make a purchase, or contact our support team. We also automatically collect certain data through cookies and similar technologies, including your IP address, browser type, device information, pages visited, and interaction patterns on our platform." },
  { id: "usage", title: "How We Use Your Information", content: "Your information is used to process orders and deliver products, provide customer support and respond to inquiries, personalize your shopping experience using AI-powered recommendations, send order updates and delivery notifications, improve our platform's performance and features, prevent fraud and maintain security, and comply with legal obligations. We use Google's Gemini AI to enhance search and product recommendations — your search queries may be processed through these AI services in anonymized form." },
  { id: "sharing", title: "Information Sharing", content: "We do not sell your personal information to third parties. We share data only with: payment processors (Razorpay) to complete transactions, shipping partners to deliver your orders, analytics services to improve our platform, and law enforcement when required by law. All third-party partners are bound by strict data protection agreements." },
  { id: "cookies", title: "Cookies & Tracking", content: "We use essential cookies to maintain your session and shopping cart, functional cookies to remember your preferences (like dark mode), and analytics cookies to understand how you use our platform. You can manage cookie preferences through your browser settings. Disabling essential cookies may affect site functionality." },
  { id: "security", title: "Data Security", content: "We implement industry-standard security measures including 256-bit SSL encryption for all data transmission, PCI DSS compliant payment processing through Razorpay, secure password hashing using bcrypt, regular security audits and vulnerability assessments, and restricted access to personal data on a need-to-know basis." },
  { id: "rights", title: "Your Rights", content: "You have the right to access your personal data, request correction of inaccurate information, request deletion of your account and associated data, opt out of marketing communications, export your data in a portable format, and withdraw consent at any time. To exercise these rights, contact us at privacy@luxorawear.com or through the Contact page." },
  { id: "retention", title: "Data Retention", content: "We retain your personal information for as long as your account is active or as needed to provide services. Order data is retained for 5 years for tax and legal compliance. You may request deletion at any time, subject to legal retention requirements." },
  { id: "updates", title: "Policy Updates", content: "We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or a prominent notice on our platform. Continued use of LUXORA after changes constitutes acceptance of the updated policy." },
];

const Privacy = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("collection");
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <Shield size={14} /> YOUR DATA MATTERS
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              How we collect, use, and protect your personal information.
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
              <Lock size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">Your Privacy is Our Priority</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  At LUXORA, we're committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights regarding your information.
                </p>
              </div>
            </div>

            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 scroll-mt-28"
              >
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  {section.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
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

export default Privacy;
