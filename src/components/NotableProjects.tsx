import React, { useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  X, 
  ArrowRight, 
  SlidersHorizontal 
} from 'lucide-react';
import { PlateBadge, JobOrderTag } from './common/BrandComponents';
import { NOTABLE_PROJECTS } from '../data/carbonStore';

export const NotableProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof NOTABLE_PROJECTS[0] | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [sliderActiveProject, setSliderActiveProject] = useState<typeof NOTABLE_PROJECTS[0]>(NOTABLE_PROJECTS[0]);

  return (
    <section id="notable-projects" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <span>Hallmark Builds</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Notable Projects Gallery. <br />
              <span className="text-[#7B93BE]">Craftsmanship on the Road &amp; Island.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              From the Philippines' only wide-body Subaru STi conversion to autoclave-grade carbon hoods and commercial electric vehicle fleets for Boracay.
            </p>
          </div>

          <div className="text-xs font-mono-code text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFB020] inline-block" />
            <span>Click any project to inspect high-res specs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {NOTABLE_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="relative glass-navy rounded-2xl border border-[#7B93BE]/30 clip-brand overflow-hidden group cursor-pointer glass-navy-hover flex flex-col justify-between"
            >
              <div className="brand-corner-tr" />

              <div className="relative h-64 overflow-hidden bg-[#0B0D12]">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-black/20" />
                
                <div className="absolute top-3 right-3 z-10">
                  <PlateBadge plate={proj.plate} size="sm" />
                </div>

                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#172B57]/90 border border-[#7B93BE]/40 text-white text-[11px] font-heading font-semibold backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} className="text-[#FFB020]" />
                  <span>Inspect Build</span>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                    <span className="text-[#FFB020]">{proj.category}</span>
                    <JobOrderTag code={proj.jobNo} />
                  </div>

                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#7B93BE] transition-colors leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-[#7B93BE] font-mono-code font-semibold">
                    {proj.tagline}
                  </p>

                  <p className="text-xs text-slate-300 font-body leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-body text-slate-300">
                    Lead: <strong className="text-white">{proj.technicians.split(',')[0]}</strong>
                  </span>
                  <span className="text-[#FFB020] flex items-center gap-1 font-heading font-semibold">
                    <span>Full Specs</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="glass-navy p-6 sm:p-8 rounded-3xl border border-[#7B93BE]/30 clip-brand-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
                <SlidersHorizontal size={14} />
                <span>Interactive Verification Slider</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white">
                Before Intake vs. Final Handover
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-[#11141C] p-1 rounded-xl border border-[#7B93BE]/30">
              {NOTABLE_PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSliderActiveProject(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                    sliderActiveProject.id === p.id
                      ? 'bg-[#172B57] text-[#FFB020] border border-[#7B93BE]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.vehicle.split(' ')[0]} {p.vehicle.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden select-none border border-[#7B93BE]/30 bg-[#0B0D12]">
            <img
              src={sliderActiveProject.image}
              alt={`${sliderActiveProject.title} After`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#10B981]/80 backdrop-blur-md text-white text-xs font-heading font-bold border border-white/20">
              AFTER · Completed &amp; Clearcoated
            </div>

            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={sliderActiveProject.beforeImage}
                alt={`${sliderActiveProject.title} Before`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100%', maxWidth: 'none' }}
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#172B57]/80 backdrop-blur-md text-white text-xs font-heading font-bold border border-white/20">
                BEFORE · Workshop Bay Intake &amp; Prep
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,176,32,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FFB020] text-slate-950 flex items-center justify-center font-bold shadow-xl border-2 border-white">
                <SlidersHorizontal size={14} />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Drag before and after divider"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0B0D12]/85 backdrop-blur-md border border-[#7B93BE]/30 text-slate-200 text-xs font-mono-code z-10">
              Drag left / right to compare transformation · <span className="text-[#FFB020]">{sliderActiveProject.title}</span>
            </div>

          </div>

        </div>

      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#11141C] border border-[#7B93BE]/40 rounded-2xl overflow-hidden clip-brand-lg shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-200">
            <div className="brand-corner-tr" />

            <div className="p-4 sm:p-5 bg-[#172B57]/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B0D12] flex items-center justify-center text-[#FFB020]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    {selectedProject.title}
                  </h3>
                  <span className="text-xs text-[#7B93BE] font-mono-code">
                    {selectedProject.vehicle} · {selectedProject.jobNo}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-lg bg-[#0B0D12] hover:bg-[#151922] text-slate-400 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <PlateBadge plate={selectedProject.plate} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#151922] border border-[#7B93BE]/20 space-y-1.5">
                  <span className="text-[10px] font-mono-code uppercase text-[#FFB020] font-semibold">
                    Scope of Craftsmanship
                  </span>
                  <p className="text-xs text-slate-300 font-body leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#151922] border border-[#7B93BE]/20 space-y-2">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-semibold block">
                      Materials &amp; Curing Process
                    </span>
                    <span className="text-xs text-slate-200 font-body">
                      {selectedProject.materials}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-semibold block">
                      Technician &amp; Mold Leads
                    </span>
                    <span className="text-xs text-slate-200 font-body">
                      {selectedProject.technicians}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B0D12] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-body">
                Official Portfolio Record · Carbon Department Cainta
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white font-semibold cursor-pointer border border-[#7B93BE]/40"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
