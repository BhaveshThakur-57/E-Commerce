import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, HelpCircle, Package, CreditCard, Ruler, RotateCcw, User } from "lucide-react";

const faqData = [
  {
    category: "Ordering & Payment",
    icon: CreditCard,
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, and Razorpay wallet. All transactions are secured with 256-bit SSL encryption." },
      { q: "Can I modify my order after placing it?", a: "Orders can be modified within 1 hour of placement. After that, our fulfillment team begins processing. Contact our support team immediately if you need changes." },
      { q: "Is it safe to use my credit card on LUXORA?", a: "Absolutely. We use Razorpay as our payment gateway, which is PCI DSS compliant. We never store your card details on our servers." },
      { q: "Do you offer EMI options?", a: "Yes! We offer No-Cost EMI on orders above ₹3,000 through select bank credit cards. EMI options are displayed at checkout." },
      { q: "Will I be charged GST?", a: "Yes, all prices include 18% GST as per Indian tax regulations. The GST breakup is shown in your order summary and invoice." },
    ],
  },
  {
    category: "Delivery & Shipping",
    icon: Package,
    questions: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery (available in metro cities) takes 2-3 business days. We ship from our warehouse in Mumbai." },
      { q: "Do you ship internationally?", a: "Currently, we ship across India only. International shipping is coming soon — join our waitlist to be notified when we expand." },
      { q: "Is shipping free?", a: "Yes! We offer free standard shipping on all orders above ₹999. Orders below ₹999 have a flat shipping fee of ₹99." },
      { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS. You can also track your order from your LUXORA account under 'My Orders'." },
    ],
  },
  {
    category: "Sizing & Fit",
    icon: Ruler,
    questions: [
      { q: "How do I find my size?", a: "Use our detailed Size Guide page for measurements. We recommend measuring yourself with a tape and comparing to our charts. If between sizes, we suggest sizing up for a relaxed fit." },
      { q: "What does 'Oversized Fit' mean?", a: "Our oversized pieces are designed to be 1-2 sizes larger than your regular fit. They drape loosely for a streetwear-inspired silhouette. Check each product's fit description for details." },
      { q: "Do your sizes run true to size?", a: "Our Essentials line runs true to size. Streetwear and Oversized collections are intentionally roomy. Check product-specific sizing notes for each item." },
    ],
  },
  {
    category: "Returns & Exchanges",
    icon: RotateCcw,
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be unworn, unwashed, and in original packaging with tags attached." },
      { q: "How do I initiate a return?", a: "Go to 'My Orders' in your account, select the order, and click 'Request Return'. Our team will arrange a pickup within 48 hours." },
      { q: "How long does a refund take?", a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount is credited to your original payment method." },
      { q: "Can I exchange for a different size?", a: "Yes! Exchanges are available for different sizes of the same product, subject to availability. The exchange process takes 7-10 business days." },
    ],
  },
  {
    category: "Account & General",
    icon: User,
    questions: [
      { q: "How do I create an account?", a: "Click 'Sign In' on the top right, then choose 'Register'. You'll need your name, email, and a password. Account creation is instant." },
      { q: "Can I save items for later?", a: "Yes! Use our Wishlist feature. Click the heart icon on any product to save it. Access your wishlist anytime from your account." },
      { q: "How do I contact customer support?", a: "You can use our AI chatbot for instant help, email us at support@luxorawear.com, or visit our Contact page for all support options." },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentRef = useRef(null);

  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-400/30">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className={`font-medium text-sm transition-colors duration-200 ${isOpen ? "text-brand-500" : "text-zinc-700 dark:text-zinc-300"}`}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? "rotate-180 text-brand-500" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{ maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px" }}
      >
        <p className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <HelpCircle size={14} /> WE'RE HERE TO HELP
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Everything you need to know about LUXORA. Can't find what you're looking for? Chat with our AI assistant.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs + Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {faqData.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(i); setOpenQuestion(null); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === i
                    ? "bg-gradient-to-r from-brand-500 to-accent-400 text-white shadow-lg shadow-brand-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
                }`}
              >
                <Icon size={15} />
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {faqData[activeCategory].questions.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={openQuestion === i}
              onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center p-10 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <p className="text-2xl font-display font-bold mb-3">Still have questions?</p>
          <p className="text-zinc-500 text-sm mb-6">Our support team is available 24/7 to assist you.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
