import React, { useState } from 'react';
import { 
  Users, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  X
} from 'lucide-react';
import { SHOP_TEAM } from '../data/carbonStore';

export const AboutTeam: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<typeof SHOP_TEAM[0] | null>(null);

  return (
    <section id="about-team" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Company Story Section (Asymmetrical Two-Column Card) */}
        <div className="relative glass-navy p-8 sm:p-10 rounded-3xl border border-[#7B93BE]/30 clip-brand-lg space-y-6 shadow-2xl">
          <div className="brand-corner-tr" />
          <div className="brand-corner-bl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57] border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
                <Compass size={13} />
                <span>Our Origin &amp; Vision</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                Where Structural Artistry <br />
                <span className="text-[#7B93BE]">Meets Mechanical Reliability.</span>
              </h2>

              <p className="text-sm text-slate-300 font-body leading-relaxed">
                Founded in 2020, Carbon Department Auto Body and Repair Services began as a specialized boutique shop focused on the high-precision world of carbon fiber fabrication and expert body repair. What started as a passion for lightweight composites and aesthetic restoration quickly evolved as we recognized the growing needs of the local automotive community.
              </p>

              <p className="text-sm text-slate-300 font-body leading-relaxed">
                Driven by a commitment to quality, we transitioned from a specialized fabrication hub into a full-service automotive center at 009 Felix Ave., Vista Verde, Cainta. By expanding our physical workspace, we successfully integrated Mechanical, Electrical, and Detailing divisions into our core operations.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B0D12]/90 border border-[#7B93BE]/25 space-y-1 text-center">
                <span className="font-heading font-extrabold text-3xl text-[#FFB020] block">
                  2020
                </span>
                <span className="text-xs font-heading font-semibold text-white block">
                  Founded in Cainta
                </span>
                <span className="text-[10px] text-slate-400 font-body">
                  009 Felix Ave. Facility
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D12]/90 border border-[#7B93BE]/25 space-y-1 text-center">
                <span className="font-heading font-extrabold text-3xl text-white block">
                  100%
                </span>
                <span className="text-xs font-heading font-semibold text-white block">
                  In-House Layup
                </span>
                <span className="text-[10px] text-slate-400 font-body">
                  Vacuum autoclave curing
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D12]/90 border border-[#7B93BE]/25 space-y-1 text-center">
                <span className="font-heading font-extrabold text-3xl text-[#7B93BE] block">
                  6 Bays
                </span>
                <span className="text-xs font-heading font-semibold text-white block">
                  Dedicated Workspaces
                </span>
                <span className="text-[10px] text-slate-400 font-body">
                  Hoist, paint &amp; molds
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D12]/90 border border-[#7B93BE]/25 space-y-1 text-center">
                <span className="font-heading font-extrabold text-3xl text-[#10B981] block">
                  5 Leads
                </span>
                <span className="text-xs font-heading font-semibold text-white block">
                  Certified Craftsmen
                </span>
                <span className="text-[10px] text-slate-400 font-body">
                  Airline &amp; dealer veterans
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Compact Team Grid (5 Real Members from PDF) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#7B93BE]/20 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
                <Users size={14} />
                <span>Leadership &amp; Technical Leads</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                Meet the Craftsmen Behind Every Build
              </h3>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              Click any profile for full certifications
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {SHOP_TEAM.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="relative glass-navy rounded-2xl border border-[#7B93BE]/25 clip-brand overflow-hidden group cursor-pointer glass-navy-hover flex flex-col justify-between"
              >
                <div className="brand-corner-tr" />

                {/* Portrait */}
                <div className="relative h-60 overflow-hidden bg-[#0B0D12]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-transparent" />
                </div>

                {/* Info Card */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#172B57] text-[#FFB020] font-semibold block w-fit mb-1">
                      {member.division}
                    </span>
                    <h4 className="text-sm font-heading font-bold text-white group-hover:text-[#7B93BE] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#7B93BE] font-mono-code">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-300 font-body line-clamp-3">
                    {member.bio}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#FFB020] font-mono-code">
                    <span>View Credentials</span>
                    <ChevronRight size={12} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#11141C] border border-[#7B93BE]/40 rounded-2xl overflow-hidden clip-brand-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="brand-corner-tr" />

            <div className="p-4 sm:p-5 bg-[#172B57] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {selectedMember.name}
                </h3>
                <span className="text-xs text-[#FFB020] font-mono-code">
                  {selectedMember.role} · {selectedMember.division}
                </span>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="w-20 h-20 rounded-xl object-cover object-top border-2 border-[#7B93BE]/40"
                />
                <div>
                  <span className="text-xs font-mono-code text-slate-400 block">
                    Background Experience
                  </span>
                  <span className="text-sm font-heading font-bold text-white">
                    {selectedMember.experience}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono-code uppercase text-[#FFB020] font-semibold">
                  Professional Biography
                </span>
                <p className="text-xs text-slate-300 font-body leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-mono-code uppercase text-[#7B93BE] font-semibold block">
                  Verified Certifications &amp; Prior Experience
                </span>
                <div className="space-y-1">
                  {selectedMember.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-body">
                      <CheckCircle2 size={13} className="text-[#10B981] shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B0D12] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-1.5 rounded-lg bg-[#172B57] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
