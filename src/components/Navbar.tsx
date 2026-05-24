'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#brands', label: 'Brands' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-red group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-2xl text-white tracking-wider"
                style={{ fontFamily: 'Bebas Neue, serif' }}
              >
                EXIDE POINT
              </span>
              <span className="text-[10px] text-primary-light tracking-widest uppercase font-semibold">
                & Spare Parts
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white font-semibold tracking-wide transition-colors relative group text-sm uppercase"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-200 hover:scale-105 glow-red"
            >
              Call Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="navbar-glass border-t border-red-900/30 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-white font-semibold tracking-widest uppercase text-sm py-2 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+919876543210"
            className="px-5 py-2.5 bg-primary text-white font-bold text-sm tracking-widest uppercase rounded-lg text-center mt-2"
          >
            Call Now
          </a>
        </div>
      </div>
    </nav>
  );
}
