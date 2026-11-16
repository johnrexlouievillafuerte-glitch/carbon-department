import React, { useState } from 'react';
import { ArrowRight, Phone, Mail, Instagram, Facebook, X, Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (division: string, service: string) => void;
}

interface ServiceCard {
  id: string;
  name: string;
  division: 'Body & Custom Work' | 'Mechanical & Maintenance';
  tag: string;
  short: string;
  detail: string;
  image: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeDivision, setActiveDivision] = useState<'all' | 'body' | 'mech'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const services: ServiceCard[] = [
    {
      id: 'carbon-fiber',
      name: 'Carbon Fiber & Fiberglass Layup',
      division: 'Body & Custom Work',
      tag: 'Aero & Layup',
      short: 'Bespoke mold casting, vacuum resin infusion, and lightweight structural composite reinforcement.',
      detail:
        'In-house negative mold fabrication, 2x2 twill carbon fiber layups, and vacuum resin infusion. Engineered for custom aerodynamic splitters, vented hoods, wide arches, and high-strength replacement panels.',
      image: '/assets/workshop-carbon-production.jpg',
    },
    {
      id: 'detailing',
      name: 'Paint Correction & Ceramic Coating',
      division: 'Body & Custom Work',
      tag: 'Correction & Coat',
      short: 'Multi-stage machine compounding, surface de-ironing, and long-term ceramic sealant protection.',
      detail:
        'Precision rotary and dual-action micro-polishing to remove paint defects, orange peel, and oxidation. Finished with high-silica ceramic protection against UV degradation, acid rain, and road contamination.',
      image: '/assets/project-subaru-sti-widebody.jpg',
    },
    {
      id: 'washover',
      name: 'Downdraft Paint & Collision Repair',
      division: 'Body & Custom Work',
      tag: 'Booth Finishing',
      short: 'Chassis realignment, dent pulling, and factory color-matched oven baking in our spray booth.',
      detail:
        'Structural chassis alignment, panel beating, anti-corrosion primer application, and computerized color matching. Cured under thermal infrared cycle in an isolated downdraft spray chamber.',
      image: '/assets/workshop-paint-room.jpg',
    },
    {
      id: 'change-oil',
      name: 'Periodic Maintenance & 50-Point PMS',
      division: 'Mechanical & Maintenance',
      tag: 'Diagnostics & PMS',
      short: 'Synthetic fluid evacuation, OEM filter replacement, and full 50-point safety walkaround.',
      detail:
        'Complete engine, transmission, brake, and coolant fluid analysis. Includes multipoint brake pad inspection, belt tension measurement, spark plug evaluation, and onboard electronic fault scanning.',
      image: '/assets/workshop-mechanical-area.jpg',
    },
    {
      id: 'aircon',
      name: 'Air Conditioning System Care',
      division: 'Mechanical & Maintenance',
      tag: 'HVAC Recharge',
      short: 'Refrigerant vacuum recharge, compressor servicing, and UV dye leak detection.',
      detail:
        'Automated AC recovery, nitrogen pressure testing, evaporator core cleaning, compressor oil replacement, and cabin air filtration to restore sub-18°C vent output.',
      image: '/assets/workshop-open-parking.jpg',
    },
    {
      id: 'under-chassis',
      name: 'Underchassis, Bushings & Suspension',
      division: 'Mechanical & Maintenance',
      tag: 'Suspension & Chassis',
      short: 'Hydraulic bushing pressing, shock replacement, and structural aluminum chassis reinforcement.',
      detail:
        'Hydraulic hoist inspection of ball joints, tie rods, sway bar links, and control arm bushings. Replacement with heavy-duty polyurethane or factory bushings to eliminate road clunks and restore tight handling.',
      image: '/assets/workshop-body-repair.jpg',
    },
  ];

  const filteredServices = services.filter((s) => {
    if (activeDivision === 'body') return s.division === 'Body & Custom Work';
    if (activeDivision === 'mech') return s.division === 'Mechanical & Maintenance';
    return true;
  });

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <section id="services" className="section bg-[#0F0F10] border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header: Left-Aligned Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00B8F0] block">
              Workshop Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-[#F2F2F0]">
              Services &amp; Bay Operations
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] font-body leading-relaxed">
              Precision composite layups, dealer-level washover painting, and comprehensive mechanical servicing under one roof in Cainta, Rizal.
            </p>
          </div>

          {/* Simple Text Tabs with Underline (No gradient pills) */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveDivision('all')}
              className={`pb-1.5 transition-colors cursor-pointer relative ${
                activeDivision === 'all'
                  ? 'text-[#F2F2F0] font-semibold'
                  : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
              }`}
            >
              <span>All ({services.length})</span>
              {activeDivision === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveDivision('body')}
              className={`pb-1.5 transition-colors cursor-pointer relative ${
                activeDivision === 'body'
                  ? 'text-[#F2F2F0] font-semibold'
                  : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
              }`}
            >
              <span>Body &amp; Custom</span>
              {activeDivision === 'body' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveDivision('mech')}
              className={`pb-1.5 transition-colors cursor-pointer relative ${
                activeDivision === 'mech'
                  ? 'text-[#F2F2F0] font-semibold'
                  : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
              }`}
            >
              <span>Mechanical</span>
              {activeDivision === 'mech' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
              )}
            </button>
          </div>
        </div>

        {/* 3x2 Editorial Grid: Photo on top full brightness, content below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <article
                key={service.id}
                className={`bg-[#161617] border rounded-[8px] overflow-hidden flex flex-col justify-between transition-editorial ${
                  isSelected
                    ? 'border-[#00B8F0]'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Photo on top at FULL brightness (NO heavy dark overlay) */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#1F1F21] relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                {/* Content Below Photo */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category Label + Tag Chip under image */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#9A9A9A]">
                      <span className="uppercase tracking-wider">
                        {service.division === 'Body & Custom Work' ? 'Body Division' : 'Mechanical'}
                      </span>
                      <span className="text-[#00B8F0] font-medium">
                        {service.tag}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-heading font-semibold text-[#F2F2F0] leading-snug">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#9A9A9A] line-clamp-2 leading-relaxed font-body">
                      {service.short}
                    </p>
                  </div>

                  {/* Select Service Action */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedServiceId(isSelected ? null : service.id)}
                      className="text-xs font-medium text-[#9A9A9A] hover:text-[#F2F2F0] cursor-pointer"
                    >
                      {isSelected ? 'Hide specs' : 'View bay specs'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectService(service.division, service.name)}
                      className="text-xs font-semibold text-[#00B8F0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Select Service</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Selected Service Detail Drawer / Accordion */}
        {selectedService && (
          <div className="p-6 sm:p-8 rounded-[8px] bg-[#161617] border border-[#00B8F0] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#00B8F0]">
                  {selectedService.division} · {selectedService.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F2F2F0] mt-1">
                  {selectedService.name} Specification
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectService(selectedService.division, selectedService.name)}
                  className="px-4 py-2 rounded-[6px] text-xs font-semibold bg-[#00B8F0] hover:bg-[#38C5F5] text-[#0F0F10] transition-colors cursor-pointer"
                >
                  Book this service &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedServiceId(null)}
                  className="p-2 rounded-[6px] text-[#9A9A9A] hover:text-[#F2F2F0] hover:bg-white/[0.06] cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-[#9A9A9A]">
              <div className="lg:col-span-2 space-y-2">
                <h4 className="font-heading font-semibold text-sm text-[#F2F2F0]">
                  Technical Bay Scope &amp; Craftsmanship
                </h4>
                <p className="text-sm leading-relaxed text-[#9A9A9A] font-body">
                  {selectedService.detail}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#F2F2F0]">
                  <Check size={14} className="text-[#2DD4A0] shrink-0" />
                  <span>Includes physical pre-inspection walkaround, condition photo logging, and official warranty.</span>
                </div>
              </div>

              <div className="p-4 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] space-y-2 font-mono">
                <span className="text-[11px] uppercase tracking-wider text-[#00B8F0] font-semibold block">
                  Bay Operations
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="text-[#F2F2F0]">Same-Day to 3-5 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span className="text-[#2DD4A0]">Written Guarantee</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bay Hours:</span>
                    <span className="text-[#F2F2F0]">Mon–Sat 8:00 AM–6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Strip: Simple row with hairline dividers, NO boxed icon tiles */}
        <div className="pt-6 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs text-[#9A9A9A]">
            <a
              href="tel:09482432421"
              className="flex items-center gap-2 text-[#F2F2F0] hover:text-[#00B8F0] transition-colors font-mono"
            >
              <Phone size={14} className="text-[#9A9A9A]" />
              <span>+63 948 243 2421</span>
            </a>

            <span className="hidden sm:inline text-white/10">|</span>

            <a
              href="mailto:carbondepartment2.0@gmail.com"
              className="flex items-center gap-2 text-[#F2F2F0] hover:text-[#00B8F0] transition-colors"
            >
              <Mail size={14} className="text-[#9A9A9A]" />
              <span>carbondepartment2.0@gmail.com</span>
            </a>

            <span className="hidden sm:inline text-white/10">|</span>

            <div className="flex items-center gap-2 text-[#9A9A9A]">
              <Instagram size={14} />
              <span className="text-[#F2F2F0]">@carbon_dept</span>
            </div>

            <span className="hidden sm:inline text-white/10">|</span>

            <div className="flex items-center gap-2 text-[#9A9A9A]">
              <Facebook size={14} />
              <span className="text-[#F2F2F0]">Carbon Department</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
