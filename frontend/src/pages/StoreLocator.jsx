import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Phone, Navigation, ExternalLink } from "lucide-react";

// Store details — update these with your real store info
const STORE = {
  name: "LUXORA Store",
  address: "Shop No. 12, Ground Floor, Fashion Street",
  area: "Linking Road, Bandra West",
  city: "Mumbai, Maharashtra 400050",
  phone: "+91 98765 43210",
  // Google Maps coordinates for the store (Linking Road, Bandra West, Mumbai)
  lat: 19.0596,
  lng: 72.8295,
  hours: [
    { day: "Monday – Saturday", time: "10:00 AM – 9:00 PM" },
    { day: "Sunday", time: "11:00 AM – 7:00 PM" },
  ],
};

// Google Maps direction URL — works on mobile (opens Google Maps app) and desktop
const getDirectionsUrl = () => {
  return `https://www.google.com/maps/dir/?api=1&destination=${STORE.lat},${STORE.lng}&destination_place_id=`;
};

// Google Maps embed URL for iframe preview
const getMapEmbedUrl = () => {
  return `https://www.google.com/maps?q=${STORE.lat},${STORE.lng}&z=16&output=embed`;
};

const StoreLocator = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
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
              <MapPin size={14} /> OUR STORE
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold mb-6">
              Visit{" "}
              <span className="gradient-text">LUXORA</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Experience our collections in person. Try on, feel the fabric, and find your perfect fit at our store.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Store Info Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">{STORE.name}</h2>
              <p className="text-sm text-brand-500 font-medium">Flagship Store</p>
            </div>

            {/* Address */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Address</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{STORE.address}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{STORE.area}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{STORE.city}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Phone</p>
                <a href={`tel:${STORE.phone}`} className="text-sm text-brand-500 hover:underline">{STORE.phone}</a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Working Hours</p>
                {STORE.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{h.day}</span>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Get Directions Button — opens Google Maps on mobile */}
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
            >
              <Navigation size={16} /> Get Directions
              <ExternalLink size={13} className="opacity-60" />
            </a>
          </div>

          {/* Map Embed */}
          <div className="rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 min-h-[400px]">
            <iframe
              src={getMapEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LUXORA Store Location"
            />
          </div>

        </div>

        {/* What to Expect */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { emoji: "👕", title: "Try Before Buy", desc: "Feel the fabric and try on every piece" },
            { emoji: "🎨", title: "Styling Help", desc: "Our team helps you find your perfect look" },
            { emoji: "📦", title: "Exclusive Drops", desc: "Some collections are store-only exclusives" },
            { emoji: "🎁", title: "Gift Wrapping", desc: "Free premium gift wrapping on request" },
          ].map((item) => (
            <div key={item.title} className="text-center p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-3xl block mb-3">{item.emoji}</span>
              <p className="font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-3xl bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-bold mb-3">Can't Visit? Shop Online!</h2>
            <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
              Browse our full collection online and get it delivered to your doorstep. Free shipping on orders over ₹999.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-full font-semibold hover:bg-zinc-100 transition-colors text-sm">
              Shop Online <ExternalLink size={14} />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
};

export default StoreLocator;
