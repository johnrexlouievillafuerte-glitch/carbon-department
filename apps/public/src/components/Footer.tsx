import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-[#0F0F10] border-t border-white/[0.08] pt-16 pb-12 text-xs text-[#9A9A9A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* Column 1: Logo & Address (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Carbon Department"
                className="w-8 h-8 object-contain"
              />
              <span className="font-heading font-semibold text-sm text-[#F2F2F0] tracking-tight">
                Carbon Department
              </span>
            </div>
            <p className="text-xs text-[#9A9A9A] leading-relaxed max-w-sm">
              Independent automotive composite atelier and full-service mechanical repair facility located in Cainta, Rizal. Delivering precision body alignment, vacuum-infused aero, and factory-standard mechanical maintenance.
            </p>
            <div className="text-xs text-[#9A9A9A] space-y-1">
              <span className="font-mono text-[#F2F2F0] block">Workshop Facility:</span>
              <p>009 Felix Ave., Vista Verde Executive Village, San Isidro, Cainta, Rizal</p>
            </div>
          </div>

          {/* Column 2: Quick Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs text-[#F2F2F0] uppercase tracking-wider block">
              Workshop Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="text-[#9A9A9A] hover:text-[#00B8F0] transition-colors">
                  Services &amp; Bay Capabilities
                </a>
              </li>
              <li>
                <a href="#process" className="text-[#9A9A9A] hover:text-[#00B8F0] transition-colors">
                  How We Work (Timeline &amp; Checklists)
                </a>
              </li>
              <li>
                <a href="#projects" className="text-[#9A9A9A] hover:text-[#00B8F0] transition-colors">
                  Featured Customer Builds &amp; Repairs
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#9A9A9A] hover:text-[#00B8F0] transition-colors">
                  About the Facility &amp; Technical Team
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#9A9A9A] hover:text-[#00B8F0] transition-colors">
                  Contact &amp; Map Coordinates
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours, Phone & Booking CTA (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-mono text-xs text-[#F2F2F0] uppercase tracking-wider block">
              Hours &amp; Inquiries
            </span>
            <div className="space-y-1 text-xs">
              <p className="text-[#F2F2F0] font-medium">Monday – Saturday: 8:00 AM – 6:00 PM</p>
              <p className="text-[#9A9A9A]">Closed Sundays for facility maintenance</p>
              <p className="pt-1">
                Direct Hotline:{' '}
                <a href="tel:09482432421" className="font-mono text-[#00B8F0] hover:underline">
                  0948-243-2421
                </a>
              </p>
            </div>

            {onOpenBooking && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-5 py-2.5 rounded-[6px] text-xs font-semibold bg-[#00B8F0] hover:bg-[#38C5F5] text-[#0F0F10] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Book a Workshop Visit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Hairline Divider & Registration / Copyright */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9A9A9A]">
          <p>
            &copy; {new Date().getFullYear()} Carbon Department Auto Body &amp; Repair Services Co. All rights reserved.
          </p>
          <p className="font-mono">
            Registered Independent Automotive Facility · Cainta, Rizal · RA 10173 Compliant
          </p>
        </div>

      </div>
    </footer>
  );
};
