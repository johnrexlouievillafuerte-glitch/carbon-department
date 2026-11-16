import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Maximize2, 
  X 
} from 'lucide-react';
import { SHOP_PERMITS } from '../data/carbonStore';

export const PermitsSection: React.FC = () => {
  const [activePermit, setActivePermit] = useState<typeof SHOP_PERMITS[0] | null>(null);

  return (
    <section id="permits" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <ShieldCheck size={13} className="text-[#10B981]" />
              <span>Legal Authority &amp; Trust Badges</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Permits &amp; Government Compliances. <br />
              <span className="text-[#7B93BE]">100% Certified Cainta Facility.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              We operate with complete regulatory transparency. Inspected and approved by the Municipality of Cainta, MENRO, Sanitary Health, and statutory employment agencies.
            </p>
          </div>

          <div className="text-xs font-mono-code text-slate-400">
            Click any permit badge to inspect verified document
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SHOP_PERMITS.map((permit) => (
            <div
              key={permit.id}
              onClick={() => setActivePermit(permit)}
              className="relative glass-navy p-4 rounded-xl border border-[#7B93BE]/30 clip-brand group cursor-pointer glass-navy-hover flex flex-col justify-between space-y-3"
            >
              <div className="brand-corner-tr" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/30 flex items-center justify-center text-[#FFB020] group-hover:scale-105 transition-transform">
                    <FileText size={15} />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Verified Active Permit" />
                </div>

                <div>
                  <h4 className="text-xs font-heading font-bold text-white group-hover:text-[#7B93BE] transition-colors line-clamp-1">
                    {permit.title}
                  </h4>
                  <p className="text-[10px] font-mono-code text-[#7B93BE] line-clamp-1">
                    {permit.number}
                  </p>
                </div>

                <p className="text-[10px] text-slate-300 font-body line-clamp-2">
                  {permit.authority}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FFB020] font-mono-code">
                <span>View Certificate</span>
                <Maximize2 size={11} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {activePermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#11141C] border border-[#7B93BE]/40 rounded-2xl overflow-hidden clip-brand-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="brand-corner-tr" />

            <div className="p-4 sm:p-5 bg-[#172B57] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[#10B981]" />
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    {activePermit.title} — Verified Preview
                  </h3>
                  <span className="text-xs font-mono-code text-[#FFB020]">
                    {activePermit.number}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActivePermit(null)}
                className="w-8 h-8 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div className="relative rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30 flex items-center justify-center p-2">
                <img
                  src={activePermit.fullImage}
                  alt={activePermit.title}
                  className="max-h-[500px] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#151922] border border-[#7B93BE]/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-white">
                    Issuing Authority: {activePermit.authority}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#10B981] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50">
                    Compliant &amp; Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-body leading-relaxed">
                  {activePermit.details}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0B0D12] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActivePermit(null)}
                className="px-4 py-1.5 rounded-lg bg-[#172B57] text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
