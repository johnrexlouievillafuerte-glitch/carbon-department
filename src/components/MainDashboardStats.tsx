import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Car, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface MainDashboardStatsProps {
  onOpenDocuments?: () => void;
  isAdmin?: boolean;
}

export const MainDashboardStats: React.FC<MainDashboardStatsProps> = ({ 
  onOpenDocuments,
  isAdmin = false 
}) => {
  const stats = [
    {
      label: 'Bay Allocation',
      val: '4 / 4',
      unit: 'Active',
      sub: 'ISO-8 Cleanroom Live',
      trend: '+100% Cap',
      icon: <Car size={18} className="text-[#00F0FF]" />,
    },
    {
      label: 'Defect Elimination',
      val: '99.4',
      unit: '%',
      sub: 'Sub-Micron Audited',
      trend: 'Optical Grade',
      icon: <Sparkles size={18} className="text-cyan-400" />,
    },
    {
      label: 'Avg Turnaround',
      val: '48',
      unit: 'Hrs',
      sub: 'IR Cured & Released',
      trend: 'On Schedule',
      icon: <Clock size={18} className="text-emerald-400" />,
    },
    {
      label: 'Verified Records',
      val: '1,240',
      unit: '+',
      sub: 'Digital Job Orders',
      trend: '10-Yr Warranty',
      icon: <ShieldCheck size={18} className="text-amber-400" />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#101118] border border-white/10 hover:border-cyan-500/40 hover:bg-[#141622] transition-all duration-300 group shadow-xl shadow-black/50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                {s.trend}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                {s.label}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-1 tracking-tight">
                <span>{s.val}</span>
                <span className="text-sm font-bold text-cyan-400">{s.unit}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {s.sub}
              </div>
            </div>

            {isAdmin && onOpenDocuments && i === 3 && (
              <button
                onClick={onOpenDocuments}
                className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#00F0FF] hover:underline cursor-pointer font-medium"
              >
                <span>View Documents &rarr;</span>
                <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
