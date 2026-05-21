import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle, Clock, Package, AlertTriangle, ArrowRight, HelpCircle, Truck } from "lucide-react";

const returnSteps = [
  { step: 1, title: "Request Return", desc: "Go to My Orders and click 'Request Return' on the eligible item", icon: RotateCcw, color: "bg-brand-500" },
  { step: 2, title: "Schedule Pickup", desc: "Our logistics partner will contact you to schedule a pickup within 48 hours", icon: Truck, color: "bg-blue-500" },
  { step: 3, title: "Quality Check", desc: "We inspect the returned item within 24 hours of receiving it", icon: CheckCircle, color: "bg-purple-500" },
  { step: 4, title: "Refund Processed", desc: "Refund credited to your original payment method within 5-7 business days", icon: Clock, color: "bg-green-500" },
];

const Returns = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

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
              <RotateCcw size={14} /> 30-DAY RETURNS
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Returns & <span className="gradient-text">Exchanges</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Hassle-free returns within 30 days. We want you to love every purchase.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Return Process Stepper */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-10 text-center">How Returns Work</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 text-center h-full">
                    <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-brand-500 mb-1 block">STEP {step.step}</span>
                    <h3 className="font-display font-bold mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < returnSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-zinc-300 dark:text-zinc-600">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" /> Eligible for Return
            </h3>
            <ul className="space-y-3">
              {[
                "Items in original condition with tags attached",
                "Unworn, unwashed, and unaltered items",
                "Items returned within 30 days of delivery",
                "Products in original packaging",
                "Items purchased at full price or during sales",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" /> Not Eligible
            </h3>
            <ul className="space-y-3">
              {[
                "Items worn, washed, or altered in any way",
                "Items without original tags or packaging",
                "Intimate wear and accessories (for hygiene reasons)",
                "Items returned after 30 days of delivery",
                "Gift cards and digital products",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <AlertTriangle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Refund Timeline</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Pickup Scheduled", time: "Within 48 hours", desc: "After you initiate the return request" },
              { title: "Quality Inspection", time: "Within 24 hours", desc: "After the returned item reaches our warehouse" },
              { title: "Refund Credited", time: "5-7 business days", desc: "To your original payment method" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <p className="text-2xl font-display font-bold gradient-text mb-1">{item.time}</p>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Damaged Products */}
        <div className="mb-16 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Package size={22} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold mb-2">Received a Damaged Product?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                If your order arrives damaged or defective, we'll replace it immediately at no additional cost. Please report the issue within 48 hours of delivery with photos of the damage.
              </p>
              <Link to="/contact" className="btn-primary text-sm inline-flex items-center gap-2">
                Report Damage <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <HelpCircle size={32} className="text-brand-500 mx-auto mb-3" />
          <p className="text-2xl font-display font-bold mb-3">Still need help?</p>
          <p className="text-zinc-500 text-sm mb-6">Check our FAQ or contact support for personalized assistance.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/faq" className="btn-outline text-sm">View FAQ</Link>
            <Link to="/contact" className="btn-primary text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Returns;
