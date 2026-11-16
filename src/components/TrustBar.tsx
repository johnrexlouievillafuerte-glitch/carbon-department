import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Wrench,
  Camera
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const items = [
    {
      icon: <MapPin size={14} className="text-[#00F0FF]" />,
      label: '009 Felix Ave',
      sub: 'Vista Verde, Cainta Rizal',
    },
    {
      icon: <Clock size={14} className="text-emerald-400" />,
      label: 'Mon – Sat 8AM – 6PM',
      sub: 'Walk-ins & Intake Welcome',
    },
    {
      icon: <Wrench size={14} className="text-[#00F0FF]" />,
      label: '5 Service Capabilities',
      sub: 'Mechanical, Body, Carbon & More',
    },
    {
      icon: <Camera size={14} className="text-cyan-400" />,
      label: 'Digital Intake Audit',
      sub: 'Pre-existing condition logged',
    },
    {
      icon: <ShieldCheck size={14} className="text-amber-400" />,
      label: 'Certified Workshop',
      sub: 'Quality Assurance & Sign-off',
    },
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
      <div className="bg-[#0D0F15] rounded-xl border border-white/10 p-4 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 ${idx > 0 ? 'sm:pl-4 pt-3 sm:pt-0' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
