import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, Award, Globe, Users, Clock, Gem } from "lucide-react";

const stats = [
  { value: "50K+", label: "Happy Customers", icon: Users },
  { value: "200+", label: "Products", icon: Gem },
  { value: "15+", label: "Cities Served", icon: Globe },
  { value: "4.9", label: "Avg Rating", icon: Award },
];

const timeline = [
  { year: "2022", title: "The Spark", desc: "LUXORA was born from a vision to make premium streetwear accessible to everyone who dares to stand out." },
  { year: "2023", title: "First Collection", desc: "Launched our debut collection — 'Urban Genesis' — which sold out in 72 hours." },
  { year: "2024", title: "Community Growth", desc: "Reached 25K+ customers. Introduced AI-powered styling recommendations and expanded to 10 cities." },
  { year: "2025", title: "The Movement", desc: "50K+ strong community. Multiple collections, premium quality standards, and a brand that people wear with pride." },
];

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const duration = 2000;
          const steps = 60;
          const increment = num / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current * 10) / 10);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = target.includes("K") ? `${count >= 1000 ? Math.floor(count / 1000) + "K" : Math.floor(count) + (count >= 50 ? "K" : "")}` : count % 1 === 0 ? Math.floor(count) : count.toFixed(1);

  return <span ref={ref}>{count === 0 ? "0" : target.includes("K") ? Math.floor(count) + "K" : count % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}</span>;
};

const About = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-20">
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
              <Heart size={14} /> OUR STORY
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6">
              Wear the{" "}
              <span className="gradient-text">Extraordinary</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              LUXORA was founded with a simple belief — that fashion should empower you to express who you truly are. We create premium, limited-edition pieces for those who refuse to blend in.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 group">
              <Icon size={22} className="text-brand-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-3xl font-display font-bold gradient-text mb-1">
                <AnimatedCounter target={value} suffix={value.includes("+") ? "+" : ""} />
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Philosophy */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-500/5 to-accent-400/5 border border-brand-500/10">
            <Sparkles size={24} className="text-brand-500 mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To democratize premium fashion by creating high-quality, limited-edition streetwear that empowers individual expression. We believe everyone deserves to wear something extraordinary — without the extraordinary price tag.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-accent-400/5 to-pink-500/5 border border-accent-400/10">
            <Gem size={24} className="text-accent-400 mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4">Our Philosophy</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Quality over quantity. Every piece in our collection is meticulously crafted from premium fabrics, designed to last and make a statement. We release limited drops to ensure exclusivity and reduce waste.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500 via-accent-400 to-pink-500 hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 inline-block max-w-md">
                      <span className="text-brand-500 font-bold text-sm">{item.year}</span>
                      <h3 className="font-display font-bold text-lg mt-1 mb-2">{item.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 border-4 border-white dark:border-zinc-950 shadow-lg z-10 flex-shrink-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Craftsmanship */}
        <div className="mb-20 p-10 rounded-3xl bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <Award size={28} className="text-brand-400 mb-4" />
            <h2 className="font-display text-3xl font-bold mb-4">Craftsmanship</h2>
            <p className="text-zinc-400 leading-relaxed max-w-2xl mb-8">
              Every LUXORA piece undergoes a 12-step quality assurance process. From hand-selected fabrics to precision stitching, we obsess over every detail so you don't have to.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: "Premium Fabrics", desc: "Sourced from the finest mills. 100% premium cotton and blends." },
                { title: "Precision Stitching", desc: "Double-stitched seams for durability that lasts wash after wash." },
                { title: "Limited Runs", desc: "Each design is produced in limited quantities for exclusivity." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder Note */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <blockquote className="text-xl font-display font-bold mb-4 italic">
            "Fashion isn't about fitting in. It's about standing out, fearlessly."
          </blockquote>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">— The LUXORA Team</p>
        </div>
      </div>
    </main>
  );
};

export default About;
