import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { PlateBadge, JobTag, StageBadge } from '@carbon/ui';
import type { JobOrder, Vehicle, Customer } from '@carbon/ui';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  jobOrders: JobOrder[];
  vehicles: Vehicle[];
  customers: Customer[];
  onSelectJob: (job: JobOrder) => void;
  onNavigateToTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  jobOrders,
  vehicles,
  customers,
  onSelectJob,
  onNavigateToTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const matchedJobs = q
    ? jobOrders.filter(
        (j) =>
          j.job_no.toLowerCase().includes(q) ||
          j.customer_concern.toLowerCase().includes(q) ||
          j.services.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const matchedVehicles = q
    ? vehicles.filter(
        (v) =>
          v.plate_number.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      )
    : [];

  const matchedCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 bg-[#0F0F10]/80 cursor-pointer" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden shadow-2xl space-y-0"
        style={{ zIndex: 10000 }}
      >
        {/* Search Input Bar */}
        <div className="p-4 bg-[#161617] border-b border-white/[0.08] flex items-center gap-3">
          <Search size={18} className="text-[#00B8F0] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plate number, job order #, client name, or phone..."
            className="w-full bg-transparent text-sm text-[#F2F2F0] placeholder-[#9A9A9A]/50 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#9A9A9A] hover:text-[#F2F2F0] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <div className="py-8 text-center text-[#9A9A9A] space-y-1">
              <p>Type to search across the entire workshop repair database.</p>
              <p className="text-[11px]">Instant lookup by plate, job order, or customer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedJobs.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#00B8F0] font-semibold block">
                    Job Orders ({matchedJobs.length})
                  </span>
                  {matchedJobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        onSelectJob(j);
                        onClose();
                      }}
                      className="p-3 rounded-[6px] bg-[#0F0F10] hover:bg-[#1F1F21] border border-white/[0.08] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <JobTag code={j.job_no} />
                          <StageBadge stage={j.stage} />
                        </div>
                        <p className="text-[#9A9A9A] truncate">{j.services.join(' • ')}</p>
                      </div>
                      <ArrowRight size={14} className="text-[#00B8F0]" />
                    </div>
                  ))}
                </div>
              )}

              {matchedVehicles.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#2DD4A0] font-semibold block">
                    Vehicles ({matchedVehicles.length})
                  </span>
                  {matchedVehicles.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        onNavigateToTab('vehicles');
                        onClose();
                      }}
                      className="p-3 rounded-[6px] bg-[#0F0F10] hover:bg-[#1F1F21] border border-white/[0.08] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlateBadge plate={v.plate_number} />
                        <span className="font-medium text-[#F2F2F0]">
                          {v.year} {v.make} {v.model} ({v.color || 'Finish'})
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-[#2DD4A0]" />
                    </div>
                  ))}
                </div>
              )}

              {matchedCustomers.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#9A9A9A] font-semibold block">
                    Customers ({matchedCustomers.length})
                  </span>
                  {matchedCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigateToTab('customers');
                        onClose();
                      }}
                      className="p-3 rounded-[6px] bg-[#0F0F10] hover:bg-[#1F1F21] border border-white/[0.08] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-medium text-[#F2F2F0] block">{c.name}</span>
                        <span className="text-[11px] text-[#9A9A9A] font-mono">{c.phone}</span>
                      </div>
                      <ArrowRight size={14} className="text-[#9A9A9A]" />
                    </div>
                  ))}
                </div>
              )}

              {matchedJobs.length === 0 && matchedVehicles.length === 0 && matchedCustomers.length === 0 && (
                <div className="py-6 text-center text-[#9A9A9A]">
                  No matching records for "{query}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0F0F10] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#9A9A9A] font-mono">
          <span>Press ESC to exit</span>
          <span>Ctrl + K shortcut</span>
        </div>
      </div>
    </div>
  );
};
