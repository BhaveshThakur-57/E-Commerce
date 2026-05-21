import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Sun, Briefcase, Layers, Flame, Dumbbell } from "lucide-react";

const collectionsData = [
  {
    id: "New Arrivals",
    title: "New Arrivals",
    subtitle: "Fresh Drops This Week",
    description: "Be the first to wear our latest designs. Limited stock available.",
    icon: Sparkles,
    gradient: "from-blue-500 to-cyan-400",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Streetwear",
    title: "Streetwear",
    subtitle: "Urban Edge",
    description: "Bold graphics, relaxed fits, and unapologetic style for the streets.",
    icon: Flame,
    gradient: "from-brand-500 to-accent-400",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Oversized Fits",
    title: "Oversized Fits",
    subtitle: "Maximum Comfort",
    description: "The perfect drop shoulder. Designed for a loose, comfortable fit.",
    icon: Layers,
    gradient: "from-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Casual Fits",
    title: "Casual Fits",
    subtitle: "Everyday Essentials",
    description: "Your go-to pieces for a relaxed, effortless look.",
    icon: TrendingUp,
    gradient: "from-green-400 to-emerald-600",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Gym Essentials",
    title: "Gym Essentials",
    subtitle: "Performance & Style",
    description: "Breathable fabrics and athletic cuts to power your workouts.",
    icon: Dumbbell,
    gradient: "from-red-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Summer Wear",
    title: "Summer Wear",
    subtitle: "Beat the Heat",
    description: "Lightweight, breathable, and vibrant styles for the sun.",
    icon: Sun,
    gradient: "from-yellow-400 to-orange-500",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Winter Layers",
    title: "Winter Layers",
    subtitle: "Stay Warm, Stay Sharp",
    description: "Premium hoodies, jackets, and knits for the colder months.",
    icon: Layers,
    gradient: "from-slate-400 to-zinc-600",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Office Wear",
    title: "Office Wear",
    subtitle: "Modern Professional",
    description: "Clean, sophisticated styles that transition perfectly from desk to dinner.",
    icon: Briefcase,
    gradient: "from-zinc-800 to-zinc-950",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "Limited Drop",
    title: "Limited Drop",
    subtitle: "Exclusive Releases",
    description: "Rare designs. Once they're gone, they're gone forever.",
    icon: Sparkles,
    gradient: "from-rose-500 to-red-600",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
  }
];

const Collections = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleCollectionClick = (id) => {
    navigate(`/shop?collection=${encodeURIComponent(id)}`);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6">
            Curated <span className="gradient-text">Collections</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Explore our thoughtfully assembled collections, designed for every occasion, mood, and aesthetic. Find your signature look.
          </p>
        </div>

        {/* Featured Top Collection */}
        <div className="mb-12 rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => handleCollectionClick(collectionsData[0].id)}>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
          <img 
            src={collectionsData[0].image} 
            alt={collectionsData[0].title} 
            className="w-full h-[60vh] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 p-8 sm:p-12 z-20 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase rounded-full mb-4 border border-white/30">
                {collectionsData[0].subtitle}
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-bold text-white mb-4">
                {collectionsData[0].title}
              </h2>
              <p className="text-white/80 text-lg sm:text-xl">
                {collectionsData[0].description}
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl flex-shrink-0">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsData.slice(1).map((collection, index) => {
            const Icon = collection.icon;
            return (
              <div 
                key={collection.id} 
                onClick={() => handleCollectionClick(collection.id)}
                className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-500 flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={collection.image} 
                    alt={collection.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    <Icon size={18} />
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${collection.gradient} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity rounded-full -mr-10 -mt-10`} />
                  
                  <span className={`text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${collection.gradient} mb-2`}>
                    {collection.subtitle}
                  </span>
                  <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-brand-500 transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex-1">
                    {collection.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-brand-500 transition-colors mt-auto">
                    Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
};

export default Collections;
