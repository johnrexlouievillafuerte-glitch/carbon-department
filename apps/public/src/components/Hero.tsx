import React, { useMemo } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  // Dynamically calculate workshop operating status (Mon-Sat 8:00 AM - 6:00 PM, closed Sundays)
  const workshopStatus = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    const isOpen = day !== 0 && currentTime >= 8 && currentTime < 18;

    if (isOpen) {
      return {
        isOpen: true,
        text: 'Open now · closes 6:00 PM',
      };
    }

    if (day === 0) {
      return {
        isOpen: false,
        text: 'Closed · opens Monday 8:00 AM',
      };
    }

    if (day === 6 && currentTime >= 18) {
      return {
        isOpen: false,
        text: 'Closed · opens Monday 8:00 AM',
      };
    }

    if (currentTime >= 18) {
      return {
        isOpen: false,
        text: 'Closed · opens tomorrow 8:00 AM',
      };
    }

    return {
      isOpen: false,
      text: 'Closed · opens today 8:00 AM',
    };
  }, []);

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 bg-[#0F0F10] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Real-Time Facility Status */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono text-[#9A9A9A] uppercase tracking-wider">
                009 Felix Ave., Vista Verde, Cainta
              </span>
              <span className="text-white/20">/</span>
              <div className="flex items-center gap-2 font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    workshopStatus.isOpen ? 'bg-[#2DD4A0]' : 'bg-[#9A9A9A]'
                  }`}
                  aria-hidden="true"
                />
                <span className={workshopStatus.isOpen ? 'text-[#2DD4A0]' : 'text-[#9A9A9A]'}>
                  {workshopStatus.text}
                </span>
              </div>
            </div>

            {/* Direct Headline: Solid color, no gradient */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-heading font-semibold text-[#F2F2F0] tracking-tight leading-[1.12]">
              Body repair, custom carbon fiber, and mechanical service. One shop in Cainta.
            </h1>

            {/* Short Paragraph */}
            <p className="text-base sm:text-lg text-[#9A9A9A] font-body max-w-xl leading-relaxed">
              We handle end-to-end automotive craft under one roof: from bespoke vacuum-infused composite aero to factory-aligned collision repair and routine diagnostics.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-[6px] text-sm font-semibold bg-[#00B8F0] hover:bg-[#38C5F5] active:bg-[#009fd0] text-[#0F0F10] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Book a Visit</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="#services"
                className="px-5 py-3 rounded-[6px] text-sm font-medium text-[#F2F2F0] border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-colors flex items-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowDown size={15} />
              </a>
            </div>

            {/* Key Service Signage Tags */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#9A9A9A]">
              <span>[01] CARBON FABRICATION</span>
              <span>[02] COLLISION &amp; PAINT</span>
              <span>[03] MECHANICAL PMS</span>
            </div>

          </div>

          {/* Right Column (5 cols): Real Workshop Photography */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-[8px] overflow-hidden border border-white/[0.08] bg-[#161617]">
              <img
                src="/assets/project-nissan-370z-hood.jpg"
                alt="Bespoke vented carbon fiber hood crafted by Carbon Department"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F0F10] via-[#0F0F10]/70 to-transparent">
                <span className="text-[11px] font-mono text-[#00B8F0] uppercase tracking-wider block">
                  Verified In-House Build
                </span>
                <span className="text-xs font-medium text-[#F2F2F0] block mt-0.5">
                  Nissan 370Z · 2x2 Twill Vacuum-Infused Hood
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
