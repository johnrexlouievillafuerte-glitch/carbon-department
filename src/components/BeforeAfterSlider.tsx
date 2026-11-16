import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Car, 
  CheckCircle2, 
  ClipboardCheck,
  RefreshCw,
  FileCheck
} from 'lucide-react';

interface DamageHotspot {
  id: string;
  zone: string;
  status: 'passed' | 'damage';
  notes: string;
}

export const BeforeAfterSlider: React.FC = () => {
  const [activeZoneId, setActiveZoneId] = useState<string>('front');
  
  // Interactive audit state for presentations
  const [hotspots, setHotspots] = useState<Record<string, DamageHotspot>>({
    front: {
      id: 'front',
      zone: 'Front Clip & Bumper Lip',
      status: 'damage',
      notes: 'Pre-existing 3-inch bumper scrape on lower right chin. Recorded at intake walkaround.',
    },
    fender: {
      id: 'fender',
      zone: 'Left & Right Front Fenders',
      status: 'passed',
      notes: 'Clean factory paint. Ultrasonic depth 118μm verified. Zero panel misalignment.',
    },
    under: {
      id: 'under',
      zone: 'Underchassis & Drivetrain',
      status: 'damage',
      notes: 'Light valve cover oil misting observed around cylinder head gasket area.',
    },
    rear: {
      id: 'rear',
      zone: 'Rear Bumper & Quarter Panels',
      status: 'passed',
      notes: 'OEM clearcoat intact. No structural stress marks or fender-lip rubbing.',
    },
  });

  const activeHotspot = hotspots[activeZoneId] || hotspots.front;

  const toggleZoneStatus = (id: string) => {
    setHotspots((prev) => {
      const current = prev[id];
      const newStatus = current.status === 'passed' ? 'damage' : 'passed';
      const newNotes =
        newStatus === 'damage'
          ? `Pre-existing imperfection documented at intake on ${current.zone.toLowerCase()}. Signed off by owner.`
          : `Clean condition verified on ${current.zone.toLowerCase()}. Zero defects or prior impact noted.`;
      return {
        ...prev,
        [id]: {
          ...current,
          status: newStatus,
          notes: newNotes,
        },
      };
    });
  };

  const resetAllToClean = () => {
    setHotspots((prev) => {
      const updated: Record<string, DamageHotspot> = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = {
          ...prev[key],
          status: 'passed',
          notes: `Inspected at 009 Felix Ave. 100% clean factory condition verified on ${prev[key].zone.toLowerCase()}.`,
        };
      });
      return updated;
    });
  };

  const damageCount = Object.values(hotspots).filter((h) => h.status === 'damage').length;

  return (
    <section id="inspection-protocol" className="py-16 bg-[#08090C] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider mb-1">
              <ClipboardCheck size={13} />
              <span>Intake Audit &amp; Verification Protocol</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vehicle Intake Pre-Inspection Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Every incoming vehicle undergoes a mandatory 360° walkaround inspection prior to hoist intake. Pre-existing body blemishes, scratches, or fluid misting are recorded on the Job Order to eliminate customer disputes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetAllToClean}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              title="Reset all zones to 100% clean condition"
            >
              <RefreshCw size={12} />
              <span className="text-[11px]">Reset Clean Audit</span>
            </button>
          </div>
        </div>

        {/* Console Box */}
        <div className="rounded-xl bg-[#0D0F15] border border-white/10 p-5 sm:p-6 space-y-6">
          
          {/* Active vehicle line */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Car size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Vehicle Intake Audit Protocol</span>
                  <span className="plate-font text-cyan-300 text-[11px]">[ LIVE VERIFICATION ]</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Shop: 009 Felix Ave, Cainta • Verification: Mandatory Workshop Policy
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                damageCount > 0
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {damageCount > 0 ? `${damageCount} Pre-Existing Logged` : '100% Clean Intake'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                Job Order Ready
              </span>
            </div>
          </div>

          {/* Grid: Wireframe Blueprint & Interactive Damage Toggles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left 7 Cols: Clean Vector Schematic */}
            <div className="lg:col-span-7 bg-[#08090C] rounded-xl border border-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>360° Visual Wireframe Schematic</span>
                <span className="text-[11px] text-[#00F0FF]">Click a zone to test audit</span>
              </div>

              <div className="relative py-6 flex flex-col items-center justify-center">
                <svg className="w-full max-w-sm h-32 text-slate-700" viewBox="0 0 400 160" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" stroke="#334155" d="M 40,110 L 80,110 L 110,60 L 250,60 L 290,110 L 360,110 L 360,130 L 40,130 Z" />
                  <circle cx="100" cy="130" r="16" strokeWidth="2" stroke="#00F0FF" fill="#0D0F15" />
                  <circle cx="300" cy="130" r="16" strokeWidth="2" stroke="#00F0FF" fill="#0D0F15" />
                  <path strokeWidth="1" stroke="#475569" d="M 120,65 L 180,65 L 180,110 M 180,65 L 240,65 L 270,110" />
                </svg>

                {/* Hotspot 1: Front Clip */}
                <div className="absolute top-4 left-10 sm:left-16">
                  <button
                    onClick={() => setActiveZoneId('front')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activeZoneId === 'front'
                        ? hotspots.front.status === 'damage' ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'
                        : hotspots.front.status === 'damage' ? 'bg-black/80 text-amber-300 border border-amber-500/30' : 'bg-black/80 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {hotspots.front.status === 'damage' ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                    <span>Front Clip</span>
                  </button>
                </div>

                {/* Hotspot 2: Fenders */}
                <div className="absolute top-4 right-10 sm:right-16">
                  <button
                    onClick={() => setActiveZoneId('fender')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activeZoneId === 'fender'
                        ? hotspots.fender.status === 'damage' ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'
                        : hotspots.fender.status === 'damage' ? 'bg-black/80 text-amber-300 border border-amber-500/30' : 'bg-black/80 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {hotspots.fender.status === 'damage' ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                    <span>Side Fenders</span>
                  </button>
                </div>

                {/* Hotspot 3: Underchassis */}
                <div className="absolute bottom-2">
                  <button
                    onClick={() => setActiveZoneId('under')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activeZoneId === 'under'
                        ? hotspots.under.status === 'damage' ? 'bg-amber-400 text-black' : 'bg-cyan-400 text-black'
                        : hotspots.under.status === 'damage' ? 'bg-black/80 text-amber-300 border border-amber-500/30' : 'bg-black/80 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {hotspots.under.status === 'damage' ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                    <span>Underchassis</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
                <span>Inspector: <strong className="text-slate-300">Service Advisor</strong></span>
                <span>Technician: <strong className="text-slate-300">Certified Technical Team</strong></span>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Condition Control */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Active Zone Status & Toggle */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
                activeHotspot.status === 'damage'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    {activeHotspot.zone}
                  </span>
                  <button
                    onClick={() => toggleZoneStatus(activeHotspot.id)}
                    className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  >
                    {activeHotspot.status === 'damage' ? 'Mark Clean Condition' : 'Log Pre-Existing Damage'}
                  </button>
                </div>

                <p className="text-slate-200 leading-relaxed text-xs bg-[#08090C]/80 p-3 rounded-lg border border-white/5">
                  "{activeHotspot.notes}"
                </p>

                <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                  <span>Intake Audit Entry #CD-{activeHotspot.id.toUpperCase()}</span>
                  <span className="text-[#00F0FF] font-medium">Auto-Stamped on JO</span>
                </div>
              </div>

              {/* Dispute Prevention Policy Note */}
              <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/5 space-y-1.5 text-xs">
                <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck size={13} className="text-[#00F0FF]" />
                  <span>Why Pre-Inspection Matters</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  As noted in shop operations, documenting scratches prior to hoist entry protects both the customer and the shop from false liability disputes.
                </p>
              </div>

            </div>

          </div>

          {/* Minimal 3-Step Protocol Strip */}
          <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold shrink-0">1</span>
              <span><strong>Walkaround:</strong> Scratches logged before hoist entry</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold shrink-0">2</span>
              <span><strong>Plate Index:</strong> Digital JO cataloged in CARBONTrack</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold shrink-0">3</span>
              <span><strong>Tri-Signature:</strong> Tech, Admin &amp; Owner sign-off</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
