import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Wrench, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';
import { ProgressGauge, PlateBadge, JobOrderTag, StageBadge } from './common/BrandComponents';
import type { JobStage, JobOrder } from '../data/carbonStore';

interface TrackRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
  initialJobNo?: string;
}

export const TrackRepairModal: React.FC<TrackRepairModalProps> = ({
  isOpen,
  onClose,
  initialPlate = '',
  initialJobNo = '',
}) => {
  const { jobOrders, vehicles, findJobByNumberAndPlate, findVehicleByPlate } = useCarbon();

  const [inputJobNo, setInputJobNo] = useState(initialJobNo);
  const [inputPlate, setInputPlate] = useState(initialPlate);
  const [activeJob, setActiveJob] = useState<JobOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<any | null>(null);

  const handleSearch = (jobNoToSearch: string, plateToSearch: string) => {
    setHasSearched(true);
    const job = findJobByNumberAndPlate(jobNoToSearch, plateToSearch);
    if (job) {
      setActiveJob(job);
      return;
    }

    if (plateToSearch.trim()) {
      const res = findVehicleByPlate(plateToSearch);
      if (res.jobOrders.length > 0) {
        setActiveJob(res.jobOrders[0]);
        setInputJobNo(res.jobOrders[0].jobNo);
        return;
      }
    }

    if (jobNoToSearch.trim()) {
      const j = jobOrders.find(
        (o) => o.jobNo.toUpperCase().replace(/\s+/g, '') === jobNoToSearch.toUpperCase().replace(/\s+/g, '')
      );
      if (j) {
        setActiveJob(j);
        const v = vehicles.find((veh) => veh.id === j.vehicleId);
        if (v) setInputPlate(v.plateNumber);
        return;
      }
    }

    setActiveJob(null);
  };

  useEffect(() => {
    if (initialJobNo || initialPlate) {
      setInputJobNo(initialJobNo);
      setInputPlate(initialPlate);
      handleSearch(initialJobNo, initialPlate);
    } else {
      if (jobOrders.length > 0 && !activeJob) {
        const defaultJob = jobOrders[0];
        const v = vehicles.find((veh) => veh.id === defaultJob.vehicleId);
        setInputJobNo(defaultJob.jobNo);
        setInputPlate(v?.plateNumber || '');
        setActiveJob(defaultJob);
      }
    }
  }, [initialJobNo, initialPlate, isOpen]);

  if (!isOpen) return null;

  const currentVehicle = activeJob ? vehicles.find((v) => v.id === activeJob.vehicleId) : null;

  const TRACKER_STAGES: JobStage[] = [
    'Received',
    'Pre-Inspection',
    'Estimate/Approval',
    'In Repair',
    'Finishing/Paint',
    'Final Assessment',
    'Ready for Release',
  ];

  const currentStageIndex = activeJob
    ? TRACKER_STAGES.indexOf(activeJob.stage === 'Released' ? 'Ready for Release' : activeJob.stage)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0E121B] border border-[#7B93BE]/35 rounded-3xl overflow-hidden clip-brand-lg shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="brand-corner-tr" />
        <div className="brand-corner-bl" />

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-[#172B57]/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/40 flex items-center justify-center text-[#FFB020] shadow-md clip-brand">
              <Search size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
                Live Repair &amp; Fabrication Progress Tracker
              </h2>
              <span className="text-xs text-[#7B93BE] font-mono-code">
                Carbon Department · Secure Shop-Floor Connection
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#0B0D12] hover:bg-[#151922] text-slate-400 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
            aria-label="Close tracking window"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Search Strip */}
        <div className="p-4 bg-[#11141C] border-b border-[#7B93BE]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(inputJobNo, inputPlate);
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="w-full sm:flex-1 relative">
              <input
                type="text"
                value={inputJobNo}
                onChange={(e) => setInputJobNo(e.target.value)}
                placeholder="Job Order No. (e.g. CD-2026-0147)"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
              />
            </div>

            <div className="w-full sm:flex-1 relative">
              <input
                type="text"
                value={inputPlate}
                onChange={(e) => setInputPlate(e.target.value)}
                placeholder="Plate No. (e.g. NBC 4821)"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020] uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-lg btn-amber text-xs uppercase tracking-wider font-semibold cursor-pointer shrink-0 shadow-md"
            >
              Search Status
            </button>
          </form>

          {/* Quick Demo Plates */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5">
            <span className="text-[10px] font-mono-code text-slate-400">Quick test:</span>
            {[
              { plate: 'NBC 4821', job: 'CD-2026-0147', label: 'STi Widebody' },
              { plate: 'NDL 9102', job: 'CD-2026-0139', label: '370Z Hood' },
              { plate: 'EV-BOC-04', job: 'CD-2026-0112', label: 'Boracay EV' },
              { plate: 'NDB 4410', job: 'CD-2026-0155', label: 'Fortuner PMS' },
              { plate: 'CAR 8800', job: 'CD-2026-0160', label: 'R35 Splitter' },
            ].map((d) => (
              <button
                key={d.job}
                type="button"
                onClick={() => {
                  setInputJobNo(d.job);
                  setInputPlate(d.plate);
                  handleSearch(d.job, d.plate);
                }}
                className={`text-[10px] font-mono-code px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                  activeJob?.jobNo === d.job
                    ? 'bg-[#FFB020] text-slate-950 font-bold border-[#FFB020]'
                    : 'bg-[#172B57]/50 text-slate-300 border-[#7B93BE]/30 hover:bg-[#172B57]'
                }`}
              >
                {d.plate} ({d.label})
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeJob && currentVehicle ? (
            <div className="space-y-6">
              
              <div className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-3 text-center md:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <PlateBadge plate={currentVehicle.plateNumber} size="md" />
                    <JobOrderTag code={activeJob.jobNo} />
                    <StageBadge stage={activeJob.stage} />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                      {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                    </h3>
                    <p className="text-xs text-slate-300 font-body mt-0.5">
                      Color: <strong className="text-white">{currentVehicle.color}</strong> · Division: <strong className="text-[#FFB020]">{activeJob.division}</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#11141C]/80 border border-[#7B93BE]/20 max-w-xl text-xs text-slate-300 font-body">
                    <span className="text-[#7B93BE] font-mono-code font-semibold block text-[10px] uppercase mb-0.5">
                      Scope of Work:
                    </span>
                    {activeJob.services.join(' • ')}
                  </div>
                </div>

                <div className="shrink-0 p-3 rounded-2xl bg-[#0B0D12]/80 border border-[#7B93BE]/30 flex flex-col items-center">
                  <ProgressGauge
                    percent={activeJob.progressPercent}
                    size={120}
                    strokeWidth={10}
                    stageName={activeJob.stage}
                  />
                  <span className="text-[10px] font-mono-code text-[#7B93BE] mt-1">
                    Est. Release: <strong className="text-white">{activeJob.estimatedRelease}</strong>
                  </span>
                </div>
              </div>

              {/* 7-Stage Status Timeline */}
              <div className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#FFB020] font-semibold">
                    7-Stage Standard Operating Status Timeline
                  </h4>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    Step {currentStageIndex + 1} of {TRACKER_STAGES.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {TRACKER_STAGES.map((stageName, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div
                        key={stageName}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-[#172B57] border-[#FFB020] shadow-md shadow-[#FFB020]/20'
                            : isCompleted
                            ? 'bg-[#11141C] border-[#10B981]/50 text-slate-300'
                            : 'bg-[#0B0D12]/50 border-white/5 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1.5">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center">
                              <CheckCircle2 size={14} />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-6 h-6 rounded-full bg-[#FFB020] text-slate-950 flex items-center justify-center font-bold text-xs animate-pulse">
                              {index + 1}
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#172B57]/50 text-slate-500 flex items-center justify-center text-xs font-mono-code">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <span
                          className={`text-xs font-heading font-semibold block leading-tight ${
                            isCurrent
                              ? 'text-white'
                              : isCompleted
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {stageName}
                        </span>

                        <span className="text-[9px] font-mono-code text-slate-400 mt-1 block">
                          {isCurrent ? 'IN PROGRESS' : isCompleted ? 'DONE' : 'PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Intake Photos & Technician Log */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Camera size={15} className="text-[#FFB020]" />
                      <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Intake Condition Photos ({activeJob.intakePhotos.length})
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono-code text-[#7B93BE]">
                      360° Walkaround Log
                    </span>
                  </div>

                  {activeJob.intakePhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {activeJob.intakePhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedPhotoModal(photo)}
                          className="relative h-36 rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30 group cursor-pointer"
                        >
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                          
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#172B57]/90 text-white text-[9px] font-mono-code uppercase font-semibold border border-[#7B93BE]/40">
                            {photo.angle.replace('_', ' ')}
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 text-[10px] text-slate-200 font-body line-clamp-1">
                            {photo.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 font-body text-xs">
                      No pre-repair photos attached yet.
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 text-[11px] text-slate-300 font-body">
                    <strong className="text-white block font-heading mb-0.5">Intake Walkaround Note:</strong>
                    {activeJob.intakeNotes}
                  </div>
                </div>

                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Wrench size={15} className="text-[#7B93BE]" />
                      <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Technician Execution Log ({activeJob.progressLogs.length})
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-400">
                      Live Shop Updates
                    </span>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {activeJob.progressLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono-code">
                          <span className="text-[#FFB020] font-semibold">{log.stage}</span>
                          <span className="text-slate-500">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-body leading-relaxed">
                          {log.note}
                        </p>
                        <div className="text-[10px] text-slate-400 font-body">
                          Logged by: <strong className="text-[#7B93BE]">{log.technician}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-body">
                      Questions on this job?
                    </span>
                    <a
                      href="tel:09482432421"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white text-xs font-semibold cursor-pointer border border-[#7B93BE]/40"
                    >
                      <PhoneCall size={12} className="text-[#FFB020]" />
                      <span>Call 0948-243-2421</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>
          ) : hasSearched ? (
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-[#FFB020] flex items-center justify-center mx-auto border border-[#FFB020]/30">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-bold text-white">
                  No Job Order Found
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  No active repair record matches <strong className="text-white">{inputJobNo || inputPlate}</strong>. Please verify your job order code or plate number with our Cainta office.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setInputJobNo('CD-2026-0147');
                    setInputPlate('NBC 4821');
                    handleSearch('CD-2026-0147', 'NBC 4821');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#172B57] text-white text-xs font-semibold border border-[#7B93BE]/40 cursor-pointer"
                >
                  Load Sample Job (CD-2026-0147)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-body text-xs">
              Enter your Job Order Number and Plate Number to view live repair progress.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0B0D12] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-body">
            <ShieldCheck size={14} className="text-[#10B981]" />
            <span>Encrypted Shop-to-Customer Transmission · RA 10173 Compliant</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white font-semibold cursor-pointer border border-[#7B93BE]/40"
          >
            Close Tracker
          </button>
        </div>

      </div>

      {selectedPhotoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#11141C] border border-[#7B93BE]/40 rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code uppercase text-[#FFB020] font-bold">
                {selectedPhotoModal.label} [{selectedPhotoModal.angle}]
              </span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="w-7 h-7 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <div className="h-80 rounded-xl overflow-hidden bg-black">
              <img
                src={selectedPhotoModal.url}
                alt={selectedPhotoModal.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-300 font-body">
              {selectedPhotoModal.caption}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
