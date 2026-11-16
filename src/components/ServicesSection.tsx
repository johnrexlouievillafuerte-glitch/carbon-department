import React, { useState } from 'react';
import { 
  Layers, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Wind,
  Gauge
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'body' | 'mechanical'>('all');

  const bodyServices = [
    {
      id: 'body-carbon',
      title: 'Carbon Fiber & Fiberglass',
      subtitle: 'Parts and repair',
      division: 'Body & Custom Work',
      icon: <Layers size={20} className="text-[#FFB020]" />,
      summary:
        'High-performance carbon fiber and fiberglass (FRP) components balancing lightweight aerodynamic design with structural impact durability.',
      specs: [
        'Custom 1-of-1 precision mold design (hoods, wings, trunks)',
        'Vacuum resin infusion & hand-laid 2x2 twill weave',
        'Structural crack repair, reinforcement, and remounting',
        'UV-resistant show-quality deep gloss clearcoat',
      ],
      badge: 'Shop Specialty',
    },
    {
      id: 'body-metal',
      title: 'Custom Metalwork',
      subtitle: 'Aluminum shrouds and fabrication',
      division: 'Body & Custom Work',
      icon: <Wrench size={20} className="text-[#7B93BE]" />,
      summary:
        'Custom-welded aluminum ducting, cooling shrouds, and structural mounting points tailored to your engine bay and chassis clearances.',
      specs: [
        'Custom aluminum radiator and intercooler cooling shrouds',
        'TIG/MIG welded lightweight bracketry and undertrays',
        'Bespoke piping, intake plenums, and catch can mounts',
        'Anti-vibration rubber isolation and corrosion priming',
      ],
      badge: 'Precision Fab',
    },
    {
      id: 'body-paint',
      title: 'Body & Paint',
      subtitle: 'Collision repair and painting',
      division: 'Body & Custom Work',
      icon: <Sparkles size={20} className="text-[#EEF1F6]" />,
      summary:
        'Comprehensive accident restoration and showroom painting utilizing our dedicated climate-controlled downdraft spray and bake booth.',
      specs: [
        'Computerized Axalta/Cromax color and tint matching',
        'Chassis jig alignment and seamless panel beating',
        'Down-draft heated booth curing for zero-dust finishes',
        'Multi-stage wet sanding and mirror clearcoat polish',
      ],
      badge: 'Dealership Grade',
    },
  ];

  const mechanicalServices = [
    {
      id: 'mech-pms',
      title: 'Basic Service',
      subtitle: 'Oil change and PMS',
      division: 'Mechanical & Maintenance',
      icon: <Gauge size={20} className="text-[#FFB020]" />,
      summary:
        'Essential preventive maintenance service engineered to keep your daily driver or high-performance vehicle running at peak efficiency.',
      specs: [
        'Motul synthetic engine oil drain, flush, and filter swap',
        '50-point bumper-to-bumper vehicle safety inspection',
        'Transmission, differential, and coolant level diagnostic',
        'Tire pressure check and brake pad thickness audit',
      ],
      badge: 'Quick Turnaround',
    },
    {
      id: 'mech-engine',
      title: 'Engine Work',
      subtitle: 'General repairs and engine swaps',
      division: 'Mechanical & Maintenance',
      icon: <Flame size={20} className="text-[#7B93BE]" />,
      summary:
        'Specialized mechanical overhauls and technical powertrain repairs led by seasoned dealership and race-team mechanics.',
      specs: [
        'Complete cylinder head overhaul and valve clearance calibration',
        'Timing belt, chain, tensioner, and water pump service',
        'Drivetrain diagnosis, clutch replacement, and gearbox rebuild',
        'Custom engine conversions and wiring harness integration',
      ],
      badge: 'Heavy Technical',
    },
    {
      id: 'mech-aircon',
      title: 'Aircon & Underchassis',
      subtitle: 'AC repair and suspension work',
      division: 'Mechanical & Maintenance',
      icon: <Wind size={20} className="text-[#EEF1F6]" />,
      summary:
        'Complete climate system restoration and suspension refresh to tackle Metro Manila heat and rough road conditions.',
      specs: [
        'Evaporator coil electronic leak testing and cabin sanitize',
        'Compressor rebuild, expansion valve, and R134a/R1234yf recharge',
        'Control arm bushings, ball joints, and tie rod replacement',
        'Coilover height adjustment, damping tune, and road test',
      ],
      badge: 'Full Comfort & Handling',
    },
  ];

  return (
    <section id="services" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <span>Automotive Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Two Specialized Divisions. <br />
              <span className="text-[#7B93BE]">One High-Precision Facility.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              We grew from a boutique composite fabrication studio into a comprehensive automotive center in Cainta. Transparent estimates, authentic materials, and zero guesswork.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#11141C] border border-[#7B93BE]/25 shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'neu-control-active text-[#FFB020] bg-[#172B57]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab('body')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'body'
                  ? 'neu-control-active text-white bg-[#172B57]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Body &amp; Custom Work
            </button>
            <button
              onClick={() => setActiveTab('mechanical')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'mechanical'
                  ? 'neu-control-active text-white bg-[#172B57]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mechanical &amp; Maintenance
            </button>
          </div>
        </div>

        {(activeTab === 'all' || activeTab === 'body') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#7B93BE]/25 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#172B57] flex items-center justify-center text-[#FFB020] clip-tr">
                  <Layers size={14} />
                </div>
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-tight">
                  Division 01: Body &amp; Custom Work
                </h3>
              </div>
              <span className="text-xs font-mono-code text-[#7B93BE]">
                Fabrication Atelier &amp; Paint Booth
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bodyServices.map((service) => (
                <div
                  key={service.id}
                  className="relative glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand glass-navy-hover flex flex-col justify-between space-y-5"
                >
                  <div className="brand-corner-tr" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center shadow-md">
                        {service.icon}
                      </div>
                      <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#172B57] text-[#FFB020] font-semibold border border-[#7B93BE]/30">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-heading font-bold text-white">
                        {service.title}
                      </h4>
                      <p className="text-xs font-mono-code text-[#7B93BE]">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 font-body leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      {service.specs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 font-body">
                          <CheckCircle2 size={12} className="text-[#FFB020] shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full mt-4 py-2 rounded-lg bg-[#11141C] hover:bg-[#172B57] text-white border border-[#7B93BE]/40 text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Book This Service</span>
                    <ArrowRight size={12} className="text-[#FFB020]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'mechanical') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-[#7B93BE]/25 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#172B57] flex items-center justify-center text-[#7B93BE] clip-tr">
                  <Wrench size={14} />
                </div>
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-tight">
                  Division 02: Mechanical &amp; Maintenance
                </h3>
              </div>
              <span className="text-xs font-mono-code text-[#7B93BE]">
                Hoist Bays &amp; Diagnostic Bay
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mechanicalServices.map((service) => (
                <div
                  key={service.id}
                  className="relative glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand glass-navy-hover flex flex-col justify-between space-y-5"
                >
                  <div className="brand-corner-tr" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center shadow-md">
                        {service.icon}
                      </div>
                      <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#172B57] text-[#7B93BE] font-semibold border border-[#7B93BE]/30">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-heading font-bold text-white">
                        {service.title}
                      </h4>
                      <p className="text-xs font-mono-code text-[#7B93BE]">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 font-body leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      {service.specs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300 font-body">
                          <CheckCircle2 size={12} className="text-[#10B981] shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full mt-4 py-2 rounded-lg bg-[#11141C] hover:bg-[#172B57] text-white border border-[#7B93BE]/40 text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Book This Service</span>
                    <ArrowRight size={12} className="text-[#FFB020]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
