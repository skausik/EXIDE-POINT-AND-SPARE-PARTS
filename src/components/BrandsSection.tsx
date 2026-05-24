'use client';

import { useRouter } from 'next/navigation';
import { BRANDS } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function BrandsSection() {
  const router = useRouter();

  return (
    <section id="brands" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">
          Our Collection
        </span>
        <h2
          className="text-5xl md:text-7xl text-white mt-2 mb-4"
          style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
        >
          PREMIUM BRANDS
        </h2>
        <div className="section-divider max-w-xs mx-auto mb-4" />
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          We stock only genuine, warranty-backed batteries from India's most trusted brands.
        </p>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {BRANDS.map((brand, idx) => (
          <button
            key={brand.id}
            onClick={() => router.push(`/category/${brand.id}`)}
            className="brand-card bg-dark-3 border border-white/10 rounded-2xl p-6 text-left group cursor-pointer"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Icon circle */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 duration-300"
              style={{ background: `${brand.color}22`, border: `1px solid ${brand.color}44` }}
            >
              {brand.logo}
            </div>

            {/* Name */}
            <h3
              className="text-2xl text-white mb-1 group-hover:text-primary transition-colors"
              style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.05em' }}
            >
              {brand.name}
            </h3>

            <p className="text-gray-500 text-xs tracking-wide leading-snug mb-4">
              {brand.tagline}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Stock</span>
              <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Color accent bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${brand.color}, transparent)` }}
            />
          </button>
        ))}
      </div>

      {/* Marquee brand logos */}
      <div className="mt-20 overflow-hidden py-4">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="text-2xl font-bold text-white/10 tracking-widest uppercase shrink-0"
              style={{ fontFamily: 'Bebas Neue, serif' }}
            >
              {brand.name} ·
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
