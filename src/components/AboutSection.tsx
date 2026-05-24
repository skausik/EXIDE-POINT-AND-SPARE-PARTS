'use client';

import { CheckCircle2, MapPin, Phone, Clock } from 'lucide-react';

const features = [
  'Authorized dealer for 8+ battery brands',
  'Free battery testing & health checkup',
  'Genuine products with valid warranty cards',
  'Expert installation & old battery exchange',
  'Competitive pricing & seasonal offers',
  'Emergency replacement assistance',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left visual */}
        <div className="relative">
          {/* Main card */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 bg-dark-3 p-8">
            <div
              className="text-8xl mb-6 text-center"
              style={{ filter: 'drop-shadow(0 0 20px rgba(204,0,0,0.4))' }}
            >
              ⚡
            </div>
            <h3
              className="text-4xl text-center text-white mb-2"
              style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.05em' }}
            >
              EXIDE POINT
            </h3>
            <p className="text-center text-primary font-semibold tracking-widest text-sm uppercase mb-6">
              & Spare Parts
            </p>
            <div className="section-divider mb-6" />
            {/* Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Location</div>
                  <div className="text-gray-400 text-sm">Your City, West Bengal, India</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Phone</div>
                  <div className="text-gray-400 text-sm">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">Hours</div>
                  <div className="text-gray-400 text-sm">Mon–Sat: 9 AM – 8 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 border border-primary/30 rounded-2xl -z-0" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-primary/20 rounded-2xl -z-0" />
          <div className="absolute top-1/2 -right-8 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
        </div>

        {/* Right content */}
        <div>
          <span className="text-primary text-sm font-bold tracking-widest uppercase">About Us</span>
          <h2
            className="text-5xl md:text-6xl text-white mt-2 mb-6"
            style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
          >
            YOUR TRUSTED BATTERY PARTNER
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4 text-lg">
            Exide Point & Spare Parts has been serving the community for over a decade, providing top-quality batteries for every need — from two-wheelers to industrial inverters.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            We believe in honest service, genuine products, and building long-term relationships with our customers. Every battery we sell comes with complete manufacturer warranty and our personal service guarantee.
          </p>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map(f => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-300 font-medium">{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="#brands"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest uppercase rounded-lg glow-red transition-all hover:scale-105 text-sm"
          >
            Browse Products
          </a>
        </div>
      </div>
    </section>
  );
}
