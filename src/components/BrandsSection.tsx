'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRANDS, getBrandImages, getSiteContent, SiteContent } from '@/lib/data';
import { ArrowRight, Battery } from 'lucide-react';

export default function BrandsSection() {
  const router = useRouter();
  const [brandImages, setBrandImages] = useState<Record<string, string>>({});
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    setBrandImages(getBrandImages());
    setContent(getSiteContent());

    // Re-read when admin saves content (storage event from another tab)
    const onStorage = () => {
      setBrandImages(getBrandImages());
      setContent(getSiteContent());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!content) return null;

  return (
    <section id="brands" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">
          {content.brandsSectionLabel}
        </span>
        <h2
          className="text-5xl md:text-7xl text-white mt-2 mb-4"
          style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.03em' }}
        >
          {content.brandsSectionTitle}
        </h2>
        <div className="section-divider max-w-xs mx-auto mb-4" />
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          {content.brandsSectionDesc}
        </p>
      </div>

      {/* Brand grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {BRANDS.map((brand, idx) => {
          const img = brandImages[brand.id];
          return (
            <button
              key={brand.id}
              onClick={() => router.push(`/category/${brand.id}`)}
              className="brand-card border rounded-2xl p-6 text-left group cursor-pointer relative overflow-hidden"
              style={{
                animationDelay: `${idx * 0.08}s`,
                background: `linear-gradient(135deg, ${brand.color}18 0%, ${brand.color}08 100%)`,
                borderColor: `${brand.color}44`,
              }}
            >\
              {/* Subtle glow background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${brand.color}20, transparent 70%)` }}
              />

              {/* Icon / image */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 overflow-hidden relative z-10"
                style={{ background: `${brand.color}22`, border: `1px solid ${brand.color}66` }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={brand.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = 'none';
                      const span = document.createElement('span');
                      span.className = 'text-xs font-bold text-white/60 text-center px-1';
                      span.textContent = brand.name;
                      t.parentElement?.appendChild(span);
                    }}
                  />
                )}
              </div>

              {/* Name */}
              <h3
                className="text-2xl text-white mb-1 transition-colors relative z-10"
                style={{
                  fontFamily: 'Bebas Neue, serif',
                  letterSpacing: '0.05em',
                  color: 'white',
                }}
              >
                {brand.name}
              </h3>

              <p className="text-gray-400 text-xs tracking-wide leading-snug mb-4 relative z-10">
                {brand.tagline}
              </p>

              {/* CTA — always visible, brightens on hover */}
              <div
                className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase relative z-10 transition-all duration-200"
                style={{ color: brand.color }}
              >
                <span>View Stock</span>
                <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Color accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${brand.color}, transparent)` }}
              />
            </button>
          );
        })}
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
