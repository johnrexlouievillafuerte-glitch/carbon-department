import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenTracking: (plate?: string, jobNo?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenTracking }) => {
  const { jobOrders } = useCarbon();
  const [searchInput, setSearchInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenTracking(searchInput.trim());
    } else {
      onOpenTracking();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  const activeJobsCount = jobOrders.filter((j) => j.stage !== 'Released').length;

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-20 lg:pt-36 lg:pb-24 bg-carbon-twill weave-shimmer overflow-hidden border-b border-[#7B93BE]/15"
    >
      <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 border-t-[3px] border-r-[3px] border-[#7B93BE]/30 clip-tr pointer-events-none opacity-60" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#172B57]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#7B93BE]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151922]/90 border border-[#7B93BE]/35 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-pulse" />
              <span className="font-heading font-semibold text-white tracking-wide uppercase text-[11px]">
                009 Felix Ave., Vista Verde, Cainta, Rizal
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[#7B93BE] font-mono-code text-[11px]">Founded 2020</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-heading font-extrabold text-white tracking-tight leading-[1.1]">
                Carbon Department <br />
                <span className="text-[#7B93BE] text-3xl sm:text-4xl lg:text-[44px] font-bold block mt-1">
                  Auto Body and Repair Services Co.
                </span>
              </h1>

              <div className="p-4 rounded-xl bg-[#172B57]/40 border-l-4 border-[#FFB020] border-y border-r border-[#7B93BE]/20 backdrop-blur-md max-w-xl">
                <p className="font-heading font-bold text-lg sm:text-xl text-[#EEF1F6] tracking-tight">
                  “You bring it in, and we fix it.”
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-body mt-1 leading-relaxed">
                  No corporate jargon, no unnecessary fluff. Just high-precision craftsmanship across two dedicated divisions: <strong className="text-white">Body &amp; Custom Work</strong> and <strong className="text-white">Mechanical &amp; Maintenance</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onOpenBooking}
                className="btn-amber px-6 py-3.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 clip-tr shadow-lg shadow-[#FFB020]/20"
              >
                <Calendar size={15} />
                <span>Book a Visit</span>
                <ArrowRight size={14} className="ml-1" />
              </button>

              <button
                onClick={() => onOpenTracking()}
                className="btn-navy px-6 py-3.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 clip-bl shadow-md"
              >
                <Search size={15} className="text-[#FFB020]" />
                <span>Track My Repair</span>
              </button>
            </div>

            <div className="pt-2 max-w-lg">
              <div className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Instant Vehicle Repair Tracker</span>
                <span className="text-[#7B93BE]">Enter Plate or Job #</span>
              </div>
              <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Search size={15} className="text-[#7B93BE]" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. NBC 4821 or CD-2026-0147"
                  className="w-full pl-10 pr-28 py-3 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white placeholder-slate-500 font-mono-code text-xs focus:outline-none focus:border-[#FFB020] focus:ring-1 focus:ring-[#FFB020] transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 rounded-md bg-[#172B57] hover:bg-[#223d77] text-white text-xs font-semibold cursor-pointer border border-[#7B93BE]/40 transition-colors"
                >
                  Track Now
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[10px] text-slate-400 font-body">Quick test plates:</span>
                <button
                  type="button"
                  onClick={() => onOpenTracking('NBC 4821', 'CD-2026-0147')}
                  className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#172B57]/50 hover:bg-[#172B57] text-[#EEF1F6] border border-[#7B93BE]/30 cursor-pointer"
                >
                  NBC 4821 (STi Widebody)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTracking('NDL 9102', 'CD-2026-0139')}
                  className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#172B57]/50 hover:bg-[#172B57] text-[#EEF1F6] border border-[#7B93BE]/30 cursor-pointer"
                >
                  NDL 9102 (370Z Hood)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTracking('EV-BOC-04', 'CD-2026-0112')}
                  className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#172B57]/50 hover:bg-[#172B57] text-[#EEF1F6] border border-[#7B93BE]/30 cursor-pointer"
                >
                  EV-BOC-04 (Boracay EV)
                </button>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="relative glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand-lg shadow-2xl space-y-5">
              <div className="brand-corner-tr" />
              <div className="brand-corner-bl" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FFB020] block font-semibold">
                    Live Workshop Bay Status
                  </span>
                  <h3 className="text-base font-heading font-bold text-white">
                    009 Felix Ave. Facility
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Bays Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#11141C]/80 border border-[#7B93BE]/20 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-heading">Active Jobs</span>
                    <Wrench size={13} className="text-[#FFB020]" />
                  </div>
                  <div className="font-mono-code text-2xl font-bold text-white">
                    {activeJobsCount}
                    <span className="text-xs text-slate-400 font-normal"> / 6 bays</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-body">
                    <CheckCircle2 size={10} /> 1 intake slot open today
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#11141C]/80 border border-[#7B93BE]/20 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-heading">Paint Booth</span>
                    <Layers size={13} className="text-[#7B93BE]" />
                  </div>
                  <div className="font-mono-code text-lg font-bold text-white mt-1">
                    Downdraft Oven
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono-code">
                    Baking · 60°C Cycle
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400 block">
                  Core Divisions
                </span>

                <div className="p-3 rounded-xl bg-[#172B57]/60 border border-[#7B93BE]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/40 flex items-center justify-center text-[#FFB020]">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-heading font-bold text-white">
                        Body &amp; Custom Work
                      </h4>
                      <p className="text-[11px] text-slate-300 font-body">
                        Carbon fiber layup, custom metalwork &amp; down-draft collision paint
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#172B57]/60 border border-[#7B93BE]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/40 flex items-center justify-center text-[#7B93BE]">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-heading font-bold text-white">
                        Mechanical &amp; Maintenance
                      </h4>
                      <p className="text-[11px] text-slate-300 font-body">
                        PMS oil changes, engine overhaul, transmission &amp; suspension
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-body">
                  <ShieldCheck size={13} className="text-[#10B981]" />
                  <span>Licensed Shop No. 2026-06150</span>
                </span>
                <span className="font-mono-code text-[10px] text-[#7B93BE]">
                  Cainta, Rizal
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
