import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { useCarbon } from '../../context/CarbonContext';
import { PlateBadge, JobOrderTag, StageBadge } from '../common/BrandComponents';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectJob: (jobId: string) => void;
  onSelectVehicle: (plate: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectJob,
  onSelectVehicle,
}) => {
  const { jobOrders, vehicles, customers } = useCarbon();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search results
  const matchedJobs = query
    ? jobOrders.filter(
        (j) =>
          j.jobNo.toLowerCase().includes(cleanQuery) ||
          j.services.some((s) => s.toLowerCase().includes(cleanQuery)) ||
          j.customerConcern.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedVehicles = query
    ? vehicles.filter(
        (v) =>
          v.plateNumber.toLowerCase().replace(/\s+/g, '').includes(cleanQuery.replace(/\s+/g, '')) ||
          v.make.toLowerCase().includes(cleanQuery) ||
          v.model.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedCustomers = query
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.phone.includes(cleanQuery) ||
          c.email.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0E121B] border border-[#7B93BE]/40 rounded-2xl overflow-hidden clip-brand shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-150">
        <div className="brand-corner-tr" />

        {/* Input Bar */}
        <div className="p-4 bg-[#172B57]/90 border-b border-white/10 flex items-center gap-3">
          <Search size={18} className="text-[#FFB020] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search license plate, job order #, customer name, or phone..."
            className="w-full bg-transparent text-white font-mono-code text-sm placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            <X size={14} />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {!query ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono-code space-y-2">
              <p>Type to search the entire Automotive Repair Management System database.</p>
              <div className="flex justify-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#172B57] text-[#EEF1F6]">NBC 4821</span>
                <span className="px-2 py-0.5 rounded bg-[#172B57] text-[#EEF1F6]">CD-2026-0147</span>
                <span className="px-2 py-0.5 rounded bg-[#172B57] text-[#EEF1F6]">Atty. Arceo</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              
              {/* Job Orders Match */}
              {matchedJobs.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono-code uppercase text-[#FFB020] font-bold block">
                    Job Orders ({matchedJobs.length})
                  </span>
                  {matchedJobs.map((j) => {
                    const veh = vehicles.find((v) => v.id === j.vehicleId);
                    return (
                      <div
                        key={j.id}
                        onClick={() => {
                          onSelectJob(j.id);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#11141C] hover:bg-[#172B57] border border-[#7B93BE]/25 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <JobOrderTag code={j.jobNo} />
                            {veh && <PlateBadge plate={veh.plateNumber} size="sm" />}
                            <StageBadge stage={j.stage} />
                          </div>
                          <p className="text-slate-300 font-body">
                            {j.services.join(' • ')}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-[#FFB020]" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vehicles Match */}
              {matchedVehicles.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-bold block">
                    Vehicles ({matchedVehicles.length})
                  </span>
                  {matchedVehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        onSelectVehicle(v.plateNumber);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-[#11141C] hover:bg-[#172B57] border border-[#7B93BE]/25 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlateBadge plate={v.plateNumber} size="sm" />
                        <span className="font-heading font-bold text-white">
                          {v.year} {v.make} {v.model} ({v.color})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-code text-[#FFB020]">View Record</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customers Match */}
              {matchedCustomers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono-code uppercase text-emerald-400 font-bold block">
                    Customers ({matchedCustomers.length})
                  </span>
                  {matchedCustomers.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/25 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-heading font-bold text-white block">
                          {c.name}
                        </span>
                        <span className="text-[11px] font-mono-code text-slate-400">
                          {c.phone} · {c.email}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-body">{c.address}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedJobs.length === 0 && matchedVehicles.length === 0 && matchedCustomers.length === 0 && (
                <div className="text-center py-6 text-slate-400 font-body">
                  No records matching "{query}".
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0B0D12] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
          <span>Global Search (Esc to close)</span>
          <span className="text-[#FFB020]">Shortcut: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
