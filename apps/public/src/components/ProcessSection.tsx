import React, { useState } from 'react';

export const ProcessSection: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'carbon' | 'mech'>('carbon');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const carbonSteps = [
    {
      num: '01',
      title: 'Pre-Inspection',
      desc: 'Digital measurement of existing panels, clearance checks, and customer objective alignment.',
    },
    {
      num: '02',
      title: 'Mold & Design',
      desc: 'Creation of bespoke positive or negative molds ensuring exact fitment with body lines.',
    },
    {
      num: '03',
      title: 'Precision Layup',
      desc: 'Careful weave alignment, vacuum resin infusion, and air-bubble elimination.',
    },
    {
      num: '04',
      title: 'Curing',
      desc: 'Thermal cycle curing to achieve optimum structural rigidity and tensile strength.',
    },
    {
      num: '05',
      title: 'Premium Finishing',
      desc: 'Multi-stage UV clearcoat, progressive sanding, and mirror-buffing to seal the weave.',
    },
  ];

  const mechSteps = [
    {
      num: '01',
      title: 'Diagnostics',
      desc: 'Electronic fault scanning, fluid condition checks, and physical walkaround verification.',
    },
    {
      num: '02',
      title: 'Repair',
      desc: 'Precise component teardown, replacement with quality parts, and torque calibration.',
    },
    {
      num: '03',
      title: 'Restoration',
      desc: 'System reassembly, fluid bleeds, and contact surface degreasing.',
    },
    {
      num: '04',
      title: 'Tuning',
      desc: 'Idling and throttle adjustment, test drive simulation, and sensor calibration.',
    },
    {
      num: '05',
      title: 'Final Assessment',
      desc: 'Lead technician signoff, checklist completion, and digital status release update.',
    },
  ];

  const currentSteps = activeWorkflow === 'carbon' ? carbonSteps : mechSteps;

  return (
    <section id="process" className="section bg-[#0F0F10] border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header: Left-Aligned Editorial */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00B8F0] block">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-[#F2F2F0]">
              How We Work
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] font-body leading-relaxed">
              Standardized step-by-step procedures ensuring precision composite layups and dependable mechanical repairs.
            </p>
          </div>

          {/* Workflow Toggle Buttons with Underline */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveWorkflow('carbon')}
              className={`pb-1.5 transition-colors cursor-pointer relative ${
                activeWorkflow === 'carbon'
                  ? 'text-[#F2F2F0] font-semibold'
                  : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
              }`}
            >
              <span>Carbon Fiber &amp; Composite</span>
              {activeWorkflow === 'carbon' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflow('mech')}
              className={`pb-1.5 transition-colors cursor-pointer relative ${
                activeWorkflow === 'mech'
                  ? 'text-[#F2F2F0] font-semibold'
                  : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
              }`}
            >
              <span>Mechanical &amp; Servicing</span>
              {activeWorkflow === 'mech' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B8F0]" />
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Numbered Timeline (Vertical on Mobile) */}
        <div className="relative pt-4 sm:pt-8">
          {/* Connecting Line for Desktop */}
          <div
            className="hidden sm:block absolute top-[28px] left-[20px] right-[20px] h-[1px] bg-white/[0.12] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 sm:gap-4 relative z-10">
            {currentSteps.map((step, idx) => {
              const isHovered = hoveredStep === idx;
              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="space-y-3 group cursor-default transition-editorial"
                >
                  {/* Step Number Dot / Marker */}
                  <div className="flex items-center gap-3 sm:block">
                    <div
                      className={`w-7 h-7 rounded-[4px] border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isHovered
                          ? 'border-[#00B8F0] bg-[#00B8F0] text-[#0F0F10]'
                          : 'border-white/[0.15] bg-[#161617] text-[#00B8F0]'
                      }`}
                    >
                      {step.num}
                    </div>
                    {/* Title on mobile inline */}
                    <h3 className="sm:hidden text-sm font-semibold text-[#F2F2F0]">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Title for Desktop */}
                  <h3
                    className={`hidden sm:block text-sm font-heading font-semibold transition-colors ${
                      isHovered ? 'text-[#00B8F0]' : 'text-[#F2F2F0]'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-[#9A9A9A] font-body leading-relaxed pl-10 sm:pl-0">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
