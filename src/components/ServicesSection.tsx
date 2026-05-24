'use client';

import { Battery, Wrench, Truck, HeartHandshake, Clock, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: Battery,
    title: 'Battery Supply',
    desc: 'Wide range of car, bike, inverter, solar and industrial batteries from premium brands.',
    color: '#CC0000',
  },
  {
    icon: Wrench,
    title: 'Battery Testing',
    desc: 'Free battery health checkup and load testing to ensure peak performance.',
    color: '#FFD700',
  },
  {
    icon: Truck,
    title: 'Home Delivery',
    desc: 'Fast doorstep delivery with professional installation service available.',
    color: '#00AA44',
  },
  {
    icon: HeartHandshake,
    title: 'Old Battery Exchange',
    desc: 'Best buyback rates on your old battery. Get cashback on exchange.',
    color: '#0066CC',
  },
  {
    icon: Clock,
    title: 'Quick Service',
    desc: 'Emergency battery replacement service — same day, any time.',
    color: '#FF6600',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Warranty',
    desc: 'All products come with manufacturer warranty cards and free servicing.',
    color: '#9900CC',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-dark-2 relative overflow-hidden">
      {/* BG texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(204,0,0,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-bold tracking-widest uppercase">What We Offer</span>
          <h2
            className="text-5xl md:text-7xl text-white mt-2 mb-4"
            style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
          >
            OUR SERVICES
          </h2>
          <div className="section-divider max-w-xs mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className="group p-6 rounded-2xl bg-dark-3 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-dark-4 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                style={{ background: `${svc.color}22`, border: `1px solid ${svc.color}44` }}
              >
                <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{svc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
