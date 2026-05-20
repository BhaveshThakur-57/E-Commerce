import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-brand-500/5 animate-fade-up">
          <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-3">LUXORA Information</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">About LUXORA</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">The story behind the brand.</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300">
            <p>Welcome to the About LUXORA page for LUXORA. We are committed to providing you with the best experience.</p>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h3 className="font-display text-xl font-bold mb-3 text-zinc-900 dark:text-white">Premium Quality Guaranteed</h3>
              <p className="text-sm leading-relaxed">Our collections are crafted from the finest materials. Whether you're shopping for oversized fits or summer essentials, we ensure every piece meets our strict quality standards.</p>
            </div>
            <p>For any specific inquiries related to this page, please feel free to reach out to our dedicated support team via the Contact page or our intelligent chatbot.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
