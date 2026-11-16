import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  ArrowUp
} from 'lucide-react';
import { SHOP_INFO } from '../data/carbonStore';

interface FooterProps {
  onNavigateAdmin: () => void;
  onOpenTracking: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateAdmin,
  onOpenTracking,
  onOpenBooking,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080A0E] text-slate-300 border-t border-[#7B93BE]/20 relative z-20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center clip-brand">
                <span className="font-heading font-extrabold text-sm text-white">CD</span>
              </div>
              <span className="font-heading font-extrabold text-sm text-white tracking-tight uppercase">
                CARBON <span className="text-[#7B93BE] font-normal">DEPARTMENT</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Founded in 2020 at Cainta, Rizal. High-precision composite engineering, vacuum carbon fiber layup, down-draft collision refinishing, and complete mechanical maintenance under one disciplined roof.
            </p>

            <div className="text-[11px] font-mono-code text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[#FFB020] shrink-0" />
                <span>{SHOP_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[#10B981] shrink-0" />
                <span>{SHOP_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#7B93BE] shrink-0" />
                <span>{SHOP_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Core Divisions Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#FFB020] font-semibold">
              Specialized Divisions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>Carbon Fiber &amp; Fiberglass</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>Custom Metalwork &amp; Shrouds</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>Down-Draft Collision Paint</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>50-Point PMS &amp; Motul Oil Flush</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>Engine Swaps &amp; Cylinder Overhaul</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#7B93BE]" />
                  <span>Aircon &amp; Underchassis Refresh</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Legal (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#7B93BE] font-semibold">
              Client &amp; Management Portals
            </h4>

            <div className="space-y-2">
              <button
                onClick={onOpenTracking}
                className="w-full text-left p-2.5 rounded-xl bg-[#11141C] hover:bg-[#172B57] border border-[#7B93BE]/25 text-xs text-white font-heading font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Track Vehicle Repair Status</span>
                <span className="text-[#FFB020] font-mono-code text-[11px]">Live 7-Stage</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="w-full text-left p-2.5 rounded-xl bg-[#11141C] hover:bg-[#172B57] border border-[#7B93BE]/25 text-xs text-white font-heading font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Reserve Bay Consultation</span>
                <span className="text-emerald-400 font-mono-code text-[11px]">Free Slot</span>
              </button>

              {/* Direct Access to Admin System */}
              <button
                onClick={onNavigateAdmin}
                className="w-full text-left p-2.5 rounded-xl bg-[#172B57]/60 hover:bg-[#172B57] border border-[#7B93BE]/40 text-xs text-slate-200 font-heading font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-[#FFB020]" />
                  <span>Automotive Repair System (Admin)</span>
                </div>
                <span className="text-xs font-mono-code text-[#7B93BE]">Staff Login</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/20 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck size={13} className="text-[#10B981]" />
                <span>Permanent Digital Records Guarantee</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Archived records are never discarded. Intake condition photos and job history remain permanently linked.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono-code">
          <div>
            &copy; {new Date().getFullYear()} Carbon Department Auto Body and Repair Services Co. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Mayor's Permit No. 2026-06150</span>
            <span>•</span>
            <span>Cainta, Rizal</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-[#11141C] hover:bg-[#172B57] text-slate-400 hover:text-white flex items-center justify-center border border-[#7B93BE]/30 transition-colors ml-2 cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
