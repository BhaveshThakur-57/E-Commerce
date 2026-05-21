import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler, Info } from "lucide-react";

const topsSizes = [
  { size: "XS", chest: "34-36", length: "25", shoulder: "15" },
  { size: "S", chest: "36-38", length: "26", shoulder: "16" },
  { size: "M", chest: "38-40", length: "27", shoulder: "17" },
  { size: "L", chest: "40-42", length: "28", shoulder: "18" },
  { size: "XL", chest: "42-44", length: "29", shoulder: "19" },
  { size: "XXL", chest: "44-46", length: "30", shoulder: "20" },
];

const bottomsSizes = [
  { size: "XS", waist: "26-28", hip: "34-36", length: "38" },
  { size: "S", waist: "28-30", hip: "36-38", length: "39" },
  { size: "M", waist: "30-32", hip: "38-40", length: "40" },
  { size: "L", waist: "32-34", hip: "40-42", length: "41" },
  { size: "XL", waist: "34-36", hip: "42-44", length: "42" },
  { size: "XXL", waist: "36-38", hip: "44-46", length: "43" },
];

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState("tops");
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  const currentSizes = activeTab === "tops" ? topsSizes : bottomsSizes;
  const headers = activeTab === "tops"
    ? ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"]
    : ["Size", "Waist (in)", "Hip (in)", "Length (in)"];

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-accent-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-brand-500/20">
              <Ruler size={14} /> FIND YOUR PERFECT FIT
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Size <span className="gradient-text">Guide</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Use our detailed measurements to find the perfect fit for every LUXORA piece.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* How to Measure */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10">
          <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <Info size={18} className="text-brand-500" /> How to Measure
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Chest / Bust", desc: "Measure around the fullest part of your chest, keeping the tape level." },
              { title: "Waist", desc: "Measure around your natural waistline, keeping the tape comfortably loose." },
              { title: "Hip", desc: "Stand with feet together and measure around the fullest part of your hips." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                  <Ruler size={18} className="text-brand-500" />
                </div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {[
            { id: "tops", label: "Tops & T-Shirts" },
            { id: "bottoms", label: "Bottoms & Pants" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-brand-500 to-accent-400 text-white shadow-lg shadow-brand-500/30"
                  : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className="text-left py-4 px-6 bg-zinc-50 dark:bg-zinc-800/50 text-sm font-semibold text-zinc-700 dark:text-zinc-300 first:rounded-tl-xl last:rounded-tr-xl border-b border-zinc-200 dark:border-zinc-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSizes.map((row, i) => (
                <tr key={row.size} className="hover:bg-brand-500/5 transition-colors duration-200 group">
                  <td className="py-4 px-6 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="font-bold text-brand-500 text-sm group-hover:scale-110 inline-block transition-transform duration-200">{row.size}</span>
                  </td>
                  {Object.values(row).slice(1).map((val, j) => (
                    <td key={j} className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                      {val}"
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Guide */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { title: "Regular Fit", desc: "Classic comfortable fit. Not too tight, not too loose. Perfect for everyday wear.", tag: "Most popular" },
            { title: "Oversized Fit", desc: "Intentionally roomy. 1-2 sizes larger for a relaxed, streetwear-inspired look. Size down if you prefer less drape.", tag: "Trending" },
            { title: "Slim Fit", desc: "Close to the body without being tight. Tailored silhouette that moves with you.", tag: "Sharp look" },
          ].map((fit) => (
            <div key={fit.title} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-2 py-1 rounded-full">{fit.tag}</span>
              <h3 className="font-display font-bold mt-3 mb-2">{fit.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{fit.desc}</p>
            </div>
          ))}
        </div>

        {/* Help CTA */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <p className="text-2xl font-display font-bold mb-3">Still unsure about your size?</p>
          <p className="text-zinc-500 text-sm mb-6">Our support team can help you find the perfect fit.</p>
          <Link to="/contact" className="btn-primary text-sm inline-flex">Contact Us</Link>
        </div>
      </div>
    </main>
  );
};

export default SizeGuide;
