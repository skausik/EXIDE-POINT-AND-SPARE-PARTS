'use client';

import { useState } from 'react';
import { MessageCircle, Navigation, Phone, X, MapPin } from 'lucide-react';

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  const PHONE = '+918513908681';
  const MAPS_URL = 'https://maps.google.com/?q=Exide+Point+Spare+Parts+West+Bengal';
  const WA_URL = `https://wa.me/${PHONE}?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20batteries.`;

  return (
    <div className="fab-container">
      {/* Expandable actions */}
      <div
        className={`flex flex-col gap-3 items-end transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Get Direction */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl font-bold text-sm tracking-wide transition-all hover:scale-105"
          style={{ boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </a>

        {/* WhatsApp / Contact */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl font-bold text-sm tracking-wide transition-all hover:scale-105"
          style={{ boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp Us
        </a>

        {/* Call */}
        <a
          href={`tel:${PHONE}`}
          className="flex items-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-2xl font-bold text-sm tracking-wide transition-all hover:scale-105 glow-red"
        >
          <Phone className="w-5 h-5" />
          Call Now
        </a>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-2xl glow-red animate-pulse-red transition-all hover:scale-110"
        aria-label="Contact options"
      >
        {open ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Tooltip when closed */}
      {!open && (
        <div className="absolute right-20 bottom-4 bg-dark-3 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none opacity-80">
          Contact Us
        </div>
      )}
    </div>
  );
}
