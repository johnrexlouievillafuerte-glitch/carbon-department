import React, { useState } from 'react';
import { 
  Layers, 
  Wrench, 
  ShieldCheck, 
  Flame, 
  Eye, 
  Cpu, 
  Sparkles 
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'carbon' | 'mechanical'>('carbon');

  const carbonSteps = [
    {
      step: '01',
      title: 'Pre-Inspection',
      badge: 'Step 1: Fitment Audit',
      icon: <Eye size={18} className="text-[#FFB020]" />,
      description:
        'Every project begins with a mandatory multi-point inspection to ensure perfect fitment and alignment for custom body panels.',
      detail: 'Chassis laser alignment check & edge clearance mapping before any fabrication begins.',
    },
    {
      step: '02',
      title: 'Mold & Design',
      badge: 'Step 2: 1-of-1 Tooling',
      icon: <Cpu size={18} className="text-[#7B93BE]" />,
      description:
        'We prepare precision molds for specialized parts including hoods, wings, and trunks.',
      detail: 'High-density tooling block preparation ensuring symmetrical airflow contours and exact gap tolerances.',
    },
    {
      step: '03',
      title: 'Precision Layup',
      badge: 'Step 3: Hand Craftsmanship',
      icon: <Layers size={18} className="text-[#EEF1F6]" />,
      description:
        'Hand-layering premium carbon fiber or FRP to achieve the ideal strength-to-weight ratio and a consistent weave pattern.',
      detail: 'Toray 3K 2x2 twill carbon fiber hand-placed with uniform fiber orientation and zero vacuum bridging.',
    },
    {
      step: '04',
      title: 'Curing & Strengthening',
      badge: 'Step 4: Thermal Polymerization',
      icon: <Flame size={18} className="text-[#FFB020]" />,
      description:
        'Controlled curing ensures the resin bonds perfectly for maximum impact resistance.',
      detail: 'Vacuum infusion consolidation under temperature-monitored cycle preventing micro-voids and resin brittleness.',
    },
    {
      step: '05',
      title: 'Premium Finishing',
      badge: 'Step 5: Show-Quality Clear',
      icon: <Sparkles size={18} className="text-[#10B981]" />,
      description:
        'Parts are trimmed, sanded, and treated with UV-resistant clear coats for a deep, show-quality gloss.',
      detail: 'Axalta multi-coat clearcoat with UV absorbers, wet-sanded to 3000-grit and polished for mirror depth.',
    },
  ];

  const mechanicalSteps = [
    {
      step: '01',
      title: 'System Diagnostics',
      badge: 'Step 1: Health Diagnostic',
      icon: <Eye size={18} className="text-[#FFB020]" />,
      description:
        'We utilize a pre-inspection checklist to identify engine, drivetrain, or electrical issues before work starts.',
      detail: 'Full OBD2 computerized scan, sensor datalogging, and physical walkaround to pinpoint root causes.',
    },
    {
      step: '02',
      title: 'Maintenance & Repair',
      badge: 'Step 2: Technical Execution',
      icon: <Wrench size={18} className="text-[#7B93BE]" />,
      description:
        'Handling everything from routine servicing to complex mechanical repairs and system troubleshooting.',
      detail: 'Strict adherence to torque specs, OEM or performance-grade replacement parts, and Motul lubricants.',
    },
    {
      step: '03',
      title: 'Vehicle Restoration',
      badge: 'Step 3: Platform Renewal',
      icon: <Cpu size={18} className="text-[#EEF1F6]" />,
      description:
        'Specialized mechanical overhauls for restoration projects, bringing older platforms back to modern performance standards.',
      detail: 'Cylinder head refreshes, suspension bushing press-in, and electrical wire harness reconditioning.',
    },
    {
      step: '04',
      title: 'Performance Tuning',
      badge: 'Step 4: Calibration',
      icon: <Flame size={18} className="text-[#FFB020]" />,
      description:
        'Calibrating mechanical systems to complement aerodynamic and weight-saving upgrades.',
      detail: 'Cooling system optimization, high-temp fluid upgrade, and suspension damping alignment for track or street.',
    },
    {
      step: '05',
      title: 'Service Assessment',
      badge: 'Step 5: Road Test & Sign-off',
      icon: <ShieldCheck size={18} className="text-[#10B981]" />,
      description:
        'Every job concludes with a final assessment to verify all mechanical systems are secure and functioning at their best.',
      detail: 'Rigorous road test under operating temperatures, fluid leak re-check, and Service Lead sign-off.',
    },
  ];

  const currentSteps = activeWorkflow === 'carbon' ? carbonSteps : mechanicalSteps;

  return (
    <section id="how-we-work" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <span>Standard Operating Procedures</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              How We Work: <br />
              <span className="text-[#7B93BE]">Two Disciplined Workflows.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              Whether fabricating ultra-lightweight composite aero or overhauling a daily driver's drivetrain, our process follows a rigorous 5-stage protocol to eliminate disputes and guarantee durability.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#11141C] border border-[#7B93BE]/25 shadow-inner">
            <button
              onClick={() => setActiveWorkflow('carbon')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeWorkflow === 'carbon'
                  ? 'neu-control-active text-white bg-[#172B57] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={14} className="text-[#FFB020]" />
              <span>Carbon Fiber Department</span>
            </button>
            <button
              onClick={() => setActiveWorkflow('mechanical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeWorkflow === 'mechanical'
                  ? 'neu-control-active text-white bg-[#172B57] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench size={14} className="text-[#7B93BE]" />
              <span>Mechanical Department</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {currentSteps.map((step) => (
            <div
              key={step.step}
              className="relative glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 clip-brand flex flex-col justify-between space-y-4 hover:border-[#7B93BE]/50 transition-all group"
            >
              <div className="brand-corner-tr" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-mono-code font-extrabold text-2xl text-[#7B93BE]/40 group-hover:text-[#FFB020] transition-colors">
                    {step.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#172B57] text-[#FFB020] font-semibold border border-[#7B93BE]/20 inline-block">
                    {step.badge}
                  </span>
                  <h4 className="text-sm font-heading font-bold text-white pt-1">
                    {step.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 font-body leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 font-body leading-normal">
                <span className="text-[#7B93BE] font-semibold block text-[10px] font-mono-code mb-0.5">
                  SHOP STANDARD:
                </span>
                {step.detail}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
