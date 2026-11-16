import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  X, 
  MapPin 
} from 'lucide-react';

interface FloatingContactProps {
  onOpenBooking: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Quick Action Popover */}
      {isOpen && (
        <div className="mb-2 w-72 rounded-xl bg-[#0D0F15] border border-white/10 shadow-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white">
              Shop Contact &amp; Intake
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <a
              href="tel:09178821923"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
            >
              <Phone size={13} className="text-[#00F0FF]" />
              <div className="truncate">
                <span className="block text-white font-medium">+63 917 882 1923</span>
                <span className="text-[10px] text-slate-400">Intake Desk &amp; Customer Support</span>
              </div>
            </a>

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 text-slate-200">
              <MapPin size={13} className="text-[#00F0FF] shrink-0" />
              <div className="text-[11px] text-slate-300">
                009 Felix Ave, Vista Verde, Cainta
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="w-full btn-cyan py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar size={13} />
            <span>Reserve Bay Intake</span>
          </button>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#0D0F15] border border-cyan-500/40 hover:border-cyan-400 text-[#00F0FF] shadow-lg flex items-center justify-center transition-all cursor-pointer"
        title="Contact Shop"
      >
        <MessageSquare size={16} />
      </button>

    </div>
  );
};
