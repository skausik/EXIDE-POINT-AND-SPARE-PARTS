"use client";

import Link from "next/link";
import { Zap, Phone, MapPin, Clock, Facebook, Mail } from "lucide-react";
import { BRANDS, getSiteContent } from "@/lib/data";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/data";

export default function Footer() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    setContent(getSiteContent());
    const onStorage = () => setContent(getSiteContent());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!content) return null;

  return (
    <footer className="footer-bg pt-16 pb-8" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-red">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <div
                  className="text-xl text-white font-bold"
                  style={{
                    fontFamily: "Bebas Neue, serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {content.navbarTitle}
                </div>
                <div className="text-[10px] text-primary tracking-widest uppercase">
                  {content.navbarSubtitle}
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {content.footerDesc}
            </p>
            <a
              href={content.footerFacebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Follow on Facebook
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Brands", "Services", "About", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={l === "Home" ? "/" : `#${l.toLowerCase()}`}
                    className="text-gray-500 hover:text-primary text-sm transition-colors font-medium flex items-center gap-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary shrink-0"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>{" "}
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-4 border-b border-white/10 pb-2">
              Brands We Carry
            </h4>
            <ul className="space-y-2">
              {BRANDS.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/category/${b.id}`}
                    className="text-gray-500 hover:text-primary text-sm transition-colors font-medium flex items-center gap-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-primary shrink-0"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-4 border-b border-white/10 pb-2">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">
                    Address
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {content.footerAddress}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">Phone</div>
                  <a
                    href={`tel:${content.footerPhone1}`}
                    className="text-gray-500 hover:text-primary transition-colors text-xs"
                  >
                    {content.footerPhone1}
                  </a>
                  <span className="text-gray-500">{" / "}</span>
                  <a
                    href={`tel:${content.footerPhone2}`}
                    className="text-gray-500 hover:text-primary transition-colors text-xs"
                  >
                    {content.footerPhone2}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">
                    Working Hours
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {content.footerHours}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-semibold">Email</div>
                  <div className="text-gray-500 text-xs">
                    <a
                      href={`mailto:${content.footerEmail}`}
                      className="text-gray-500 hover:text-primary transition-colors text-xs"
                    >
                      {content.footerEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div>
            © {new Date().getFullYear()} {content.navbarTitle}{" "}
            {content.navbarSubtitle}. All rights reserved.
          </div>

          <div className="footer-social flex items-center gap-2">
            <span className="footer-copy text-gray-600">
              Website created by
            </span>
            <a
              href={content.footerCreatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-link"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 4 }}
              >
                <path
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"
                  stroke="#E1306C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
                  stroke="#E1306C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 6.5h.01"
                  stroke="#E1306C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {content.footerCreatorName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
