import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Lightbulb, 
  Thermometer, 
  Layers 
} from 'lucide-react';

export const StudioSpecs: React.FC = () => {
  const specs = [
    {
      icon: <Layers size={22} className="text-[#00F0FF]" />,
      title: 'ISO-8 Cleanroom Enclosures',
      badge: 'Dust Filtration: 0.5 µm',
      desc: 'Positive air-pressure cleanroom bays with HEPA filtration ensure zero air-borne dust nibs settle underneath your XPEL PPF installation.',
    },
    {
      icon: <Lightbulb size={22} className="text-[#00F0FF]" />,
      title: '5500K High-CRI Light Tunnel',
      badge: 'CRI 98+ Optical Inspection',
      desc: 'Color-corrected daylight frequency lighting arrays reveal microscopic swirls, sanding scratches, and holograms invisible under standard showroom lamps.',
    },
    {
      icon: <Cpu size={22} className="text-[#00F0FF]" />,
      title: 'XPEL DAP Plotter CNC Precision',
      badge: 'Zero Razor Blades on Paint',
      desc: 'Computer-modeled body templates cut with optical laser plotters ensure custom-rolled edges without ever putting a razor blade near your factory clear coat.',
    },
    {
      icon: <Gauge size={22} className="text-[#00F0FF]" />,
      title: 'DynoJet 424xLC2 In-Ground AWD',
      badge: '2000+ HP Capacity',
      desc: 'Synchronized dual eddy-current dynamometer with wideband lambda telemetry for safe, verified torque curves and precision ECU calibrations.',
    },
    {
      icon: <Thermometer size={22} className="text-[#00F0FF]" />,
      title: 'Infrared Quartz Curing Bay',
      badge: '180°F Cross-Linking Cycle',
      desc: 'Short-wave infrared lamps accelerate the molecular bonding of 9H ceramic & graphene coatings, locking in maximum scratch resistance before vehicle handover.',
    },
    {
      icon: <ShieldCheck size={22} className="text-[#00F0FF]" />,
      title: 'Ultrasonic Paint Depth Scanning',
      badge: 'Sub-Micron Thickness Audit',
      desc: 'We map clear-coat thickness across 36 digital inspection points, preserving precious factory paint microns while executing surgical scratch removal.',
    },
  ];

  return (
    <section id="studio-specs" className="py-24 relative bg-[#0D0E15] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12131C] border border-cyan-500/30 text-xs font-semibold text-[#00F0FF] mb-3">
            <Cpu size={13} />
            <span>FACILITY METROLOGY &amp; EQUIPMENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Engineered to Aerospace <span className="text-gradient-cyan">Studio Standards</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Supercars require more than garage lighting and consumer polishers. Discover our laboratory equipment and environmental control standards.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12131C] border border-white/5 hover:border-cyan-500/40 hover:bg-[#161825] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:scale-105 transition-all">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold text-[#00F0FF] bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
