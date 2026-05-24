'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Award } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'POWER YOUR LIFE',
    subtitle: 'Premium Battery Solutions',
    desc: 'Genuine batteries for cars, bikes, inverters & solar. Best prices, expert advice.',
    bg: 'from-red-950 via-dark to-dark',
    icon: '⚡',
    badge: 'AUTHORIZED MULTI BRAND RETAILER',
  },
  {
    id: 2,
    title: 'NEVER RUN OUT',
    subtitle: 'Inverter & UPS Batteries',
    desc: 'Keep your home powered 24/7 with top-brand inverter batteries and free installation.',
    bg: 'from-zinc-900 via-dark to-dark',
    icon: '🔋',
    badge: '48-Month Warranty Available',
  },
  {
    id: 3,
    title: 'TRUSTED QUALITY',
    subtitle: '8 Premium Brands In-Store',
    desc: 'Exide, Amaron, Luminous, Livguard, Microtek and more — all under one roof.',
    bg: 'from-red-900 via-dark to-dark',
    icon: '🏆',
    badge: '1000+ Happy Customers',
  },
];

const stats = [
  { icon: Shield, label: 'Genuine Products', value: '100%' },
  { icon: Award, label: 'Brands Available', value: '8+' },
  { icon: Zap, label: 'Years Experience', value: '10+' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,0,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,0,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Red diagonal accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div
            key={current}
            className="space-y-6"
            style={{ animation: 'slideInLeft 0.6s ease-out' }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {slide.badge}
            </span>

            {/* Title */}
            <h1
              className="text-6xl md:text-8xl font-bold leading-none text-gradient-red"
              style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.02em' }}
            >
              {slide.title}
            </h1>

            <h2 className="text-2xl md:text-3xl text-gray-300 font-bold tracking-wide">
              {slide.subtitle}
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              {slide.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#brands"
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-widest uppercase rounded-lg glow-red transition-all hover:scale-105"
              >
                View Batteries
              </a>
              <a
                href="tel:+918513908681"
                className="px-8 py-4 border border-white/20 hover:border-primary/60 text-white font-bold text-sm tracking-widest uppercase rounded-lg backdrop-blur-sm hover:bg-primary/10 transition-all"
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Right — animated icon display */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80" key={current} style={{ animation: 'fadeUp 0.6s ease-out' }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-red-900/10 border border-primary/30 flex items-center justify-center glow-red">
                  <span className="text-8xl">{slide.icon}</span>
                </div>
              </div>

              {/* Orbit dots */}
              {[0, 120, 240].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-primary rounded-full top-1/2 left-1/2"
                  style={{
                    transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
                    animation: `pulseRed ${1.5 + i * 0.3}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-xl">
          {stats.map(stat => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors">
              <div className="text-3xl font-bold text-gradient-red" style={{ fontFamily: 'Bebas Neue, serif' }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1 tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-4">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/30 border border-white/20 flex items-center justify-center transition-all hover:scale-110">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-2 bg-primary'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/30 border border-white/20 flex items-center justify-center transition-all hover:scale-110">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-gray-500 text-xs tracking-widest uppercase">
        <span>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
}
