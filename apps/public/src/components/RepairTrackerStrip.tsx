import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface RepairTrackerStripProps {
  onOpenTrackerWithValues: (plate: string, jobNo: string, pin: string) => void;
}

export const RepairTrackerStrip: React.FC<RepairTrackerStripProps> = ({
  onOpenTrackerWithValues,
}) => {
  const [plate, setPlate] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [pin, setPin] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim() || jobNo.trim() || pin.trim()) {
      onOpenTrackerWithValues(plate.trim(), jobNo.trim(), pin.trim());
    }
  };

  return (
    <section className="w-full bg-[#161617] border-y border-white/[0.08] py-8 sm:py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header Label */}
          <div className="space-y-1 lg:max-w-xs shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00B8F0] uppercase tracking-wider">
              <Search size={14} />
              <span>CarbonTrack Online</span>
            </div>
            <h2 className="text-base sm:text-lg font-heading font-semibold text-[#F2F2F0]">
              Track Vehicle Repair
            </h2>
            <p className="text-xs text-[#9A9A9A] font-body leading-relaxed">
              Enter your vehicle credentials to inspect real-time bay status, stage milestones, and completion targets.
            </p>
          </div>

          {/* Labeled Inputs Form */}
          <form
            onSubmit={handleTrackSubmit}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-3.5"
          >
            {/* Plate Number */}
            <div className="space-y-1.5">
              <label
                htmlFor="strip-plate"
                className="block text-xs font-medium text-[#9A9A9A] uppercase tracking-wider"
              >
                Plate Number
              </label>
              <input
                id="strip-plate"
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="e.g. NBC 4821"
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-sm font-mono uppercase text-[#F2F2F0] placeholder-[#9A9A9A]/50 focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] transition-colors"
              />
            </div>

            {/* Job No */}
            <div className="space-y-1.5">
              <label
                htmlFor="strip-job"
                className="block text-xs font-medium text-[#9A9A9A] uppercase tracking-wider"
              >
                Job Order No.
              </label>
              <input
                id="strip-job"
                type="text"
                value={jobNo}
                onChange={(e) => setJobNo(e.target.value)}
                placeholder="e.g. CD-2026-0001"
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-sm font-mono uppercase text-[#F2F2F0] placeholder-[#9A9A9A]/50 focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] transition-colors"
              />
            </div>

            {/* PIN */}
            <div className="space-y-1.5">
              <label
                htmlFor="strip-pin"
                className="block text-xs font-medium text-[#9A9A9A] uppercase tracking-wider"
              >
                6-Digit SMS PIN
              </label>
              <input
                id="strip-pin"
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full h-11 px-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-sm font-mono text-[#F2F2F0] placeholder-[#9A9A9A]/50 focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] transition-colors"
              />
            </div>

            {/* Track Button */}
            <div>
              <button
                type="submit"
                className="w-full h-11 px-5 rounded-[6px] bg-[#00B8F0] hover:bg-[#38C5F5] active:bg-[#009fd0] text-[#0F0F10] font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Status</span>
                <span className="font-mono text-xs">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
