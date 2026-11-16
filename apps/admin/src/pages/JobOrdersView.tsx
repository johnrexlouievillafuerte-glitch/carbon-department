import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  ChevronRight,
  X,
  Printer,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import { PlateBadge, JobTag, StageBadge, Button, EmptyState } from '@carbon/ui';
import { api } from '../api';
import { PrintJobDocumentsModal } from '../components/PrintJobDocumentsModal';
import type { JobOrder, Vehicle, Customer, IntakePhoto, ProgressLog } from '@carbon/ui';

interface JobOrdersViewProps {
  jobOrders: JobOrder[];
  vehicles: Vehicle[];
  customers: Customer[];
  onOpenNewJob: () => void;
  onRefresh: () => void;
}

export const JobOrdersView: React.FC<JobOrdersViewProps> = ({
  jobOrders,
  vehicles,
  customers,
  onOpenNewJob,
  onRefresh,
}) => {
  const [filterStage, setFilterStage] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobOrder | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printingJob, setPrintingJob] = useState<JobOrder | null>(null);

  // Drawer details
  const [photos, setPhotos] = useState<IntakePhoto[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [progressNote, setProgressNote] = useState('');
  const [advancing, setAdvancing] = useState(false);

  const stagesList = [
    'Received',
    'Pre-Inspection',
    'Estimate/Approval',
    'In Repair',
    'Finishing/Paint',
    'Final Assessment',
    'Ready for Release',
    'Released',
  ];

  const handleSelectJob = async (job: JobOrder) => {
    setSelectedJob(job);
    try {
      const [p, logs] = await Promise.all([
        api.getIntakePhotosForJob(job.id).catch(() => []),
        api.getProgressLogs(job.id).catch(() => []),
      ]);
      setPhotos(p);
      setProgressLogs(logs);
    } catch {
      // ignore
    }
  };

  const handleAdvanceStage = async (nextStage: string) => {
    if (!selectedJob) return;
    setAdvancing(true);
    try {
      await api.updateStage(selectedJob.id, nextStage, progressNote.trim() || undefined);
      setProgressNote('');
      const updated = await api.getJobOrder(selectedJob.id);
      setSelectedJob(updated);
      const logs = await api.getProgressLogs(selectedJob.id);
      setProgressLogs(logs);
      onRefresh();
    } finally {
      setAdvancing(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !progressNote.trim()) return;
    try {
      await api.addProgressLog(selectedJob.id, progressNote.trim());
      setProgressNote('');
      const logs = await api.getProgressLogs(selectedJob.id);
      setProgressLogs(logs);
    } catch {
      // ignore
    }
  };

  const filtered = jobOrders.filter((j) => {
    const v = vehicles.find((veh) => veh.id === j.vehicle_id);
    const c = customers.find((cust) => cust.id === j.customer_id);
    const term = search.toLowerCase().trim();

    const matchesSearch =
      !term ||
      j.job_no.toLowerCase().includes(term) ||
      (v && v.plate_number.toLowerCase().includes(term)) ||
      (c && c.name.toLowerCase().includes(term));

    const matchesStage = filterStage === 'all' || j.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const selectedVehicle = selectedJob ? vehicles.find((v) => v.id === selectedJob.vehicle_id) : null;
  const selectedCustomer = selectedJob ? customers.find((c) => c.id === selectedJob.customer_id) : null;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Automotive Job Orders
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Intake records, checklist walkaround, and active stage controls.
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={onOpenNewJob}>
          <span>+ New Job Order</span>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161617] border border-white/[0.08] p-3.5 rounded-[8px]">
        <div className="flex items-center gap-2 bg-[#0F0F10] px-3 py-1.5 rounded-[6px] border border-white/[0.08] flex-1 max-w-md">
          <Search size={14} className="text-[#9A9A9A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job number, plate, or customer..."
            className="w-full bg-transparent text-xs text-[#F2F2F0] focus:outline-none placeholder-[#9A9A9A]/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Received', 'In Repair', 'Finishing/Paint', 'Ready for Release', 'Released'].map(
            (stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => setFilterStage(stg)}
                className={`px-3 py-1 rounded-[4px] text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  filterStage === stg
                    ? 'bg-[#00B8F0] text-[#0F0F10] font-semibold'
                    : 'bg-[#0F0F10] text-[#9A9A9A] hover:text-[#F2F2F0] border border-white/[0.08]'
                }`}
              >
                {stg === 'all' ? 'All Orders' : stg}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={ClipboardList}
            title={
              jobOrders.length === 0
                ? 'No job orders yet. Create an intake job order to start tracking repairs.'
                : 'No job orders matching current filter criteria.'
            }
            action={jobOrders.length === 0 ? 'Create Job Order' : undefined}
            onAction={jobOrders.length === 0 ? onOpenNewJob : undefined}
          />
        </div>
      ) : (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0F10] text-[#9A9A9A] font-mono">
                  <th className="p-4 font-medium">Job No.</th>
                  <th className="p-4 font-medium">Plate</th>
                  <th className="p-4 font-medium">Vehicle / Client</th>
                  <th className="p-4 font-medium">Division &amp; Services</th>
                  <th className="p-4 font-medium">Stage</th>
                  <th className="p-4 font-medium">Target Date</th>
                  <th className="p-4 font-medium text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((j) => {
                  const veh = vehicles.find((v) => v.id === j.vehicle_id);
                  const cust = customers.find((c) => c.id === j.customer_id);

                  return (
                    <tr
                      key={j.id}
                      onClick={() => handleSelectJob(j)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-mono">
                        <JobTag code={j.job_no} />
                      </td>
                      <td className="p-4 font-mono">
                        {veh ? <PlateBadge plate={veh.plate_number} /> : '—'}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-[#F2F2F0] block">
                          {veh ? `${veh.year} ${veh.make} ${veh.model}` : 'Vehicle'}
                        </span>
                        <span className="text-[11px] text-[#9A9A9A] block">
                          {cust ? cust.name : 'Client'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[#00B8F0] font-medium block">{j.division}</span>
                        <span className="text-[#9A9A9A] truncate block max-w-xs">
                          {j.services.join(' • ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <StageBadge stage={j.stage} />
                      </td>
                      <td className="p-4 font-mono text-[#9A9A9A]">
                        {j.estimated_release || '—'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrintingJob(j);
                              setPrintModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-[4px] bg-[#0F0F10] hover:bg-[#00B8F0]/15 text-[#00B8F0] border border-white/[0.08] hover:border-[#00B8F0]/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Print Inspection, Warranty or Quotation"
                          >
                            <Printer size={13} />
                            <span className="hidden sm:inline">Print &amp; Warranty</span>
                          </button>
                          <span className="text-xs text-[#00B8F0] font-medium flex items-center gap-0.5">
                            Review <ChevronRight size={13} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Side Detail Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ zIndex: 9999 }}>
          <div
            className="fixed inset-0 bg-[#0F0F10]/80 cursor-pointer"
            onClick={() => setSelectedJob(null)}
          />
          <div className="relative z-10 w-full max-w-xl bg-[#161617] border-l border-white/[0.08] h-full overflow-y-auto p-6 space-y-6 shadow-2xl transition-all">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <JobTag code={selectedJob.job_no} />
                  <StageBadge stage={selectedJob.stage} />
                </div>
                <h3 className="text-lg font-heading font-semibold text-[#F2F2F0]">
                  {selectedVehicle
                    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                    : 'Job Details'}
                </h3>
                <p className="text-xs text-[#9A9A9A]">
                  Customer: {selectedCustomer ? selectedCustomer.name : 'Client'} · Plate:{' '}
                  {selectedVehicle?.plate_number}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-[4px] text-[#9A9A9A] hover:text-[#F2F2F0] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stage Advancement Stepper */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                Update Repair Milestone
              </span>
              <div className="p-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {stagesList.map((stg) => {
                    const isCurrent = selectedJob.stage === stg;
                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => handleAdvanceStage(stg)}
                        disabled={advancing || isCurrent}
                        className={`px-2.5 py-1 rounded-[4px] text-xs font-mono transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#00B8F0] text-[#0F0F10] font-semibold'
                            : 'bg-[#161617] text-[#9A9A9A] hover:text-[#F2F2F0] border border-white/[0.08]'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="Optional technician milestone note..."
                    className="flex-1 px-3 py-1.5 rounded-[4px] bg-[#161617] border border-white/[0.08] text-xs text-[#F2F2F0] placeholder-[#9A9A9A]/50 focus:outline-none focus:border-[#00B8F0]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!progressNote.trim()}
                  >
                    Log Note
                  </Button>
                </div>
              </div>
            </div>

            {/* Attached Intake Photos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                  Pre-Repair Intake Photos ({photos.length})
                </span>
              </div>

              {photos.length === 0 ? (
                <div className="p-4 rounded-[6px] bg-[#0F0F10] border border-dashed border-white/20 text-center text-xs text-[#9A9A9A]">
                  No intake photos uploaded yet for this job.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-[6px] overflow-hidden bg-[#0F0F10] border border-white/[0.08] space-y-1 p-1.5"
                    >
                      <div className="aspect-video rounded-[4px] overflow-hidden bg-black/60">
                        {p.url ? (
                          <img
                            src={p.url}
                            alt={p.label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9A9A9A]">
                            <Camera size={16} />
                          </div>
                        )}
                      </div>
                      <div className="px-1">
                        <span className="text-[11px] font-medium text-[#F2F2F0] block truncate">
                          {p.label || p.angle}
                        </span>
                        <span className="text-[10px] text-[#9A9A9A] block truncate">
                          {p.caption}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Log History */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                Audit &amp; Milestone Log
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {progressLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#9A9A9A]">
                      <span className="text-[#00B8F0] font-semibold">{log.stage}</span>
                      <span>{log.created_at}</span>
                    </div>
                    <p className="text-[#F2F2F0]">{log.note}</p>
                    <span className="text-[10px] text-[#9A9A9A] block">
                      Logged by {log.technician}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Official Job Order Sheet */}
            <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center">
              <span className="text-[11px] text-[#9A9A9A] flex items-center gap-1.5 font-mono">
                <ShieldCheck size={14} className="text-[#2DD4A0]" />
                <span>Permanent Document Archiving Active</span>
              </span>

              <Button
                variant="primary"
                size="sm"
                className="text-center justify-center font-semibold flex items-center gap-1.5"
                onClick={() => {
                  setPrintingJob(selectedJob);
                  setPrintModalOpen(true);
                }}
              >
                <Printer size={14} /> <span>Print &amp; Warranty</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Official Print & Warranty Modal */}
      <PrintJobDocumentsModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        job={printingJob}
        customer={customers.find((c) => c.id === printingJob?.customer_id)}
        vehicle={vehicles.find((v) => v.id === printingJob?.vehicle_id)}
      />
    </div>
  );
};
