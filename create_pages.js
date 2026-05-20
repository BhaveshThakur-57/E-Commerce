const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'FAQ', title: 'Frequently Asked Questions', desc: 'Find answers to common questions about our brand and products.' },
  { name: 'Shipping', title: 'Shipping Policy', desc: 'Everything you need to know about delivery times and methods.' },
  { name: 'Returns', title: 'Returns & Exchanges', desc: 'Our hassle-free return policy.' },
  { name: 'SizeGuide', title: 'Size Guide', desc: 'Find your perfect fit with our detailed sizing information.' },
  { name: 'About', title: 'About LUXORA', desc: 'The story behind the brand.' },
  { name: 'Careers', title: 'Careers', desc: 'Join the team building the future of fashion.' },
  { name: 'Press', title: 'Press & Media', desc: 'Latest news and press releases.' },
  { name: 'Contact', title: 'Contact Us', desc: 'Get in touch with our team.' },
  { name: 'Privacy', title: 'Privacy Policy', desc: 'How we handle and protect your data.' },
  { name: 'Terms', title: 'Terms & Conditions', desc: 'Our terms of service and usage.' },
];

pages.forEach(p => {
  const content = `import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ${p.name} = () => {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-brand-500/5 animate-fade-up">
          <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-3">LUXORA Information</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">${p.title}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">${p.desc}</p>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300">
            <p>Welcome to the ${p.title} page for LUXORA. We are committed to providing you with the best experience.</p>
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

export default ${p.name};
`;
  fs.writeFileSync(path.join('d:/Projects/E_Commerce/frontend/src/pages', p.name + '.jsx'), content);
});
console.log("Pages generated successfully.");
