import React, { useState } from 'react';
import { 
  Check, 
  Layers,
  Wrench,
  Cpu,
  Paintbrush,
  Sparkles,
  ShieldCheck,
  Info,
  X
} from 'lucide-react';
import type { ServiceItem } from '../data/services';

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  onSelect: (serviceId: string) => void;
  isSelected?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index,
  onSelect, 
  isSelected = false 
}) => {
  const [showModal, setShowModal] = useState(false);

  const getIcon = () => {
    switch (service.category) {
      case 'carbon-fiber':
        return <Layers size={18} className="text-[#00F0FF]" />;
      case 'mechanical':
        return <Wrench size={18} className="text-[#00F0FF]" />;
      case 'electrical':
        return <Cpu size={18} className="text-[#00F0FF]" />;
      case 'body-repair':
        return <Paintbrush size={18} className="text-[#00F0FF]" />;
      case 'detailing':
        return <Sparkles size={18} className="text-[#00F0FF]" />;
      default:
        return <ShieldCheck size={18} className="text-[#00F0FF]" />;
    }
  };

  return (
    <>
      <div 
        className={`rounded-xl p-5 bg-[#0D0F15] border transition-all duration-200 flex flex-col justify-between ${
          isSelected 
            ? 'border-[#00F0FF] bg-[#10131C]' 
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="space-y-3">
          {/* Top row: Icon, Category & Pillar Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                {getIcon()}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {service.category.replace('-', ' ')}
              </span>
            </div>
            <span className="text-[11px] mono-spec text-slate-500 font-medium">
              0{index + 1}
            </span>
          </div>

          {/* Title & Short Tagline */}
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {service.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {service.tagline}
            </p>
          </div>

          {/* Minimal key features pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.specs.slice(0, 2).map((sp) => (
              <span 
                key={sp.label}
                className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-slate-400"
              >
                {sp.label}: <strong className="text-slate-300 font-medium">{sp.value}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row: Pricing & Direct Toggle */}
        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-medium">Est. Turnaround</span>
            <span className="text-xs font-semibold text-slate-300">{service.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
              title="View Scope & Details"
            >
              <Info size={14} />
            </button>

            <button
              type="button"
              onClick={() => onSelect(service.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00F0FF] text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Minimalist Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl bg-[#0D0F15] border border-white/10 p-6 space-y-4 text-slate-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X size={15} />
            </button>

            <div>
              <div className="text-[10px] text-[#00F0FF] font-semibold uppercase tracking-wider mb-1">
                Capability Details
              </div>
              <h3 className="text-lg font-bold text-white">
                {service.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {service.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Scope &amp; Included Work
              </div>
              <div className="space-y-1.5">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check size={13} className="text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing note */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Pricing Policy</span>
                <span className="text-slate-300 font-semibold">{service.startingPrice}</span>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  onSelect(service.id);
                }}
                className="btn-cyan px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {isSelected ? 'Keep Selected' : 'Select Service'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
