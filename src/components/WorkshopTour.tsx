import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Maximize2,
  X
} from 'lucide-react';
import { WORKSHOP_AREAS } from '../data/carbonStore';

export const WorkshopTour: React.FC = () => {
  const [activeArea, setActiveArea] = useState<typeof WORKSHOP_AREAS[0]>(WORKSHOP_AREAS[0]);
  const [modalArea, setModalArea] = useState<typeof WORKSHOP_AREAS[0] | null>(null);

  return (
    <section id="workshop-tour" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <span>Facility Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Workshop Tour: <br />
              <span className="text-[#7B93BE]">5 Dedicated Production &amp; Service Zones.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              Explore our physical workspace in Cainta, Rizal. Purpose-built infrastructure ensuring composite curing is isolated from mechanical fluid bays and painting is done in a dust-free chamber.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
            <MapPin size={14} className="text-[#FFB020]" />
            <span>009 Felix Ave., Vista Verde, Cainta</span>
          </div>
        </div>

        {/* Interactive Tour Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): List of 5 Workshop Areas */}
          <div className="lg:col-span-5 space-y-3">
            {WORKSHOP_AREAS.map((area, index) => {
              const isSelected = activeArea.id === area.id;
              return (
                <div
                  key={area.id}
                  onClick={() => setActiveArea(area)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer clip-brand flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#172B57]/90 border-[#7B93BE] shadow-lg shadow-black/50'
                      : 'glass-navy border-[#7B93BE]/20 hover:border-[#7B93BE]/50 hover:bg-[#151922]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono-code text-xs font-bold border ${
                        isSelected
                          ? 'bg-[#FFB020] text-slate-950 border-white/40'
                          : 'bg-[#0B0D12] text-[#7B93BE] border-[#7B93BE]/30'
                      }`}
                    >
                      0{index + 1}
                    </div>

                    <div>
                      <h4 className="text-sm font-heading font-bold text-white">
                        {area.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-body line-clamp-1">
                        {area.caption}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-code text-[#7B93BE] hidden sm:inline-block">
                    {isSelected ? 'Active View' : 'Inspect'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 Cols): Large Image Preview & Specs */}
          <div className="lg:col-span-7">
            <div className="relative glass-navy rounded-2xl border border-[#7B93BE]/35 clip-brand-lg overflow-hidden shadow-2xl space-y-4">
              <div className="brand-corner-tr" />
              
              {/* Photo */}
              <div className="relative h-72 sm:h-96 w-full bg-black overflow-hidden group">
                <img
                  src={activeArea.photo}
                  alt={activeArea.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-black/20" />

                {/* Inspect Fullscreen Button */}
                <button
                  onClick={() => setModalArea(activeArea)}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172B57]/90 hover:bg-[#172B57] text-white text-xs font-heading font-semibold border border-[#7B93BE]/50 backdrop-blur-md cursor-pointer transition-colors shadow-lg"
                >
                  <Maximize2 size={13} className="text-[#FFB020]" />
                  <span>Enlarge Photo</span>
                </button>
              </div>

              {/* Area Info Footer */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-white">
                    {activeArea.title}
                  </h3>
                  <span className="text-xs font-mono-code text-[#FFB020] px-2.5 py-0.5 rounded bg-[#172B57] border border-[#7B93BE]/30">
                    Verified Cainta Bay
                  </span>
                </div>

                <p className="text-sm text-slate-300 font-body leading-relaxed">
                  {activeArea.caption}
                </p>

                <div className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/25 flex items-center gap-2 text-xs font-mono-code text-[#7B93BE]">
                  <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />
                  <span>
                    <strong className="text-white">Specs:</strong> {activeArea.specs}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Modal Lightbox for Workshop Area */}
      {modalArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#11141C] border border-[#7B93BE]/40 rounded-2xl overflow-hidden clip-brand-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="brand-corner-tr" />

            <div className="p-4 bg-[#172B57] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-heading font-bold text-white text-base">
                {modalArea.title} — Shop Floor Inspection
              </h3>
              <button
                onClick={() => setModalArea(null)}
                className="w-8 h-8 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative h-80 sm:h-[450px] rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30">
                <img
                  src={modalArea.photo}
                  alt={modalArea.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-slate-200 font-body">
                {modalArea.caption}
              </p>
              <div className="text-xs font-mono-code text-[#7B93BE]">
                Equipment &amp; Specs: {modalArea.specs}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
