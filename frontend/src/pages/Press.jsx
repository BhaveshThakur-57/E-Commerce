import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Newspaper, ExternalLink, Award, Calendar, ArrowRight, Download } from "lucide-react";

const pressReleases = [
  { date: "May 2025", title: "LUXORA Reaches 50K+ Customers Milestone", desc: "The premium streetwear brand celebrates a growing community of fashion-forward individuals across India.", category: "Milestone" },
  { date: "March 2025", title: "AI-Powered Shopping Experience Launched", desc: "LUXORA integrates Gemini AI for personalized search, styling recommendations, and an intelligent chatbot.", category: "Technology" },
  { date: "January 2025", title: "Summer 2025 Collection 'Solstice' Announced", desc: "A new collection inspired by the intersection of urban architecture and natural landscapes.", category: "Collection" },
  { date: "November 2024", title: "LUXORA Expands to 15 Cities", desc: "Express delivery now available in Tier 1 cities with same-day dispatch for metro areas.", category: "Expansion" },
];

const mediaFeatures = [
  { publication: "Vogue India", title: "The New Age of Indian Streetwear", quote: "LUXORA represents a fresh wave of premium streetwear that doesn't compromise on quality." },
  { publication: "GQ India", title: "Brands to Watch in 2025", quote: "With their limited drops and AI-powered experience, LUXORA is redefining fashion e-commerce." },
  { publication: "Economic Times", title: "D2C Brands Disrupting Fashion", quote: "LUXORA's direct-to-consumer approach has resonated strongly with Gen Z and millennials." },
  { publication: "Fashion United", title: "Sustainability in Streetwear", quote: "By producing limited quantities, LUXORA minimizes waste while maintaining exclusivity." },
];

const Press = () => {
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
              <Newspaper size={14} /> IN THE NEWS
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Press & <span className="gradient-text">Media</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Latest news, press releases, and media coverage about LUXORA.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Featured Mentions */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Featured In</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {mediaFeatures.map((item) => (
              <div key={item.publication} className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={16} className="text-brand-500" />
                  <span className="text-brand-500 font-bold text-sm">{item.publication}</span>
                </div>
                <h3 className="font-display font-bold mb-2 group-hover:text-brand-500 transition-colors">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((item) => (
              <div key={item.title} className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex items-center gap-1 text-xs text-zinc-400"><Calendar size={12} /> {item.date}</span>
                      <span className="text-xs font-medium bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full">{item.category}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg mb-1 group-hover:text-brand-500 transition-colors">{item.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                  <button className="flex items-center gap-1 text-brand-500 text-sm font-semibold whitespace-nowrap hover:gap-2 transition-all self-start">
                    Read <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-zinc-950 to-zinc-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <Download size={24} className="text-brand-400 mb-3" />
              <h3 className="font-display text-xl font-bold mb-2">Media Kit & Brand Assets</h3>
              <p className="text-zinc-400 text-sm">Download our logo, brand guidelines, product images, and press materials.</p>
            </div>
            <button className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
              <Download size={14} /> Download Kit
            </button>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
          <p className="text-2xl font-display font-bold mb-3">Press Inquiries?</p>
          <p className="text-zinc-500 text-sm mb-6">For media inquiries, interviews, or collaboration opportunities.</p>
          <a href="mailto:press@luxorawear.com" className="btn-primary text-sm inline-flex items-center gap-2">
            Contact Press Team <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </main>
  );
};

export default Press;
