import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Car, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react';
import type { VehicleRecord } from '../data/documents';

interface CustomerTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
  records: VehicleRecord[];
  onOpenBooking?: () => void;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  isOpen,
  onClose,
  initialPlate = '',
  records,
  onOpenBooking
}) => {
  const [searchTerm, setSearchTerm] = useState(initialPlate);

  React.useEffect(() => {
    if (initialPlate) {
      setSearchTerm(initialPlate);
    }
  }, [initialPlate]);

  if (!isOpen) return null;

  const cleanTerm = searchTerm.toUpperCase().replace(/\s+/g, '');
  const foundRecord = records.find(
    (r) => r.plateNumber.replace(/\s+/g, '').toUpperCase() === cleanTerm
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D0F15] border border-white/10 shadow-2xl p-5 sm:p-6 space-y-5 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF]">
              <Car size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Live Vehicle Service Tracker
              </h3>
              <p className="text-[11px] text-slate-400">
                Carbon Department Workshop Telemetry • 009 Felix Ave, Cainta
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Plate Search Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Enter Plate Number
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. NDB 4821 or CAR 8800..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="w-full bg-[#07080B] border border-white/10 focus:border-[#00F0FF] rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 uppercase tracking-wider plate-font transition-colors focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {cleanTerm ? (
          foundRecord ? (
            <div className="space-y-4">
              {/* Vehicle & Status Card */}
              <div className="p-4 rounded-xl bg-[#07080B] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="plate-font text-base text-[#00F0FF] font-bold block">
                      {foundRecord.plateNumber}
                    </span>
                    <span className="text-xs text-white font-medium">
                      {foundRecord.vehicleMakeModel} ({foundRecord.vehicleYear})
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                    foundRecord.status === 'Ready for Release'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  }`}>
                    {foundRecord.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Repair Progress</span>
                    <span className="text-[#00F0FF] font-mono font-bold">{foundRecord.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#12141D] h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-[#00F0FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${foundRecord.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Service</span>
                    <span className="text-slate-200">{foundRecord.serviceCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Date Received</span>
                    <span className="text-slate-200 font-mono">{foundRecord.dateReceived}</span>
                  </div>
                </div>
              </div>

              {/* Task Milestones */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Service Milestones &amp; Checks
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {foundRecord.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#07080B] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-300">
                        {task.status === 'Completed' ? (
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Clock size={13} className="text-cyan-400 shrink-0" />
                        )}
                        <span>{task.task}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        task.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-cyan-500/10 text-cyan-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Inspection Transparency Disclosure */}
              {foundRecord.preInspectionNotes && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                  <span className="font-bold text-amber-300 block">Intake Walkaround Documentation:</span>
                  <p className="text-[11px] text-slate-300">
                    {foundRecord.preInspectionNotes}
                  </p>
                </div>
              )}

              {/* Shop Support Footer */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#00F0FF]" />
                  <span>Workshop: 009 Felix Ave, Cainta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#00F0FF]" />
                  <span>Hotline: 0917-882-1923</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-3 bg-[#07080B] rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <AlertCircle size={18} />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  No active Job Order found for &ldquo;{cleanTerm}&rdquo;
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                  If your vehicle was checked in recently, digital documentation is processed by the service desk upon hoist evaluation.
                </p>
              </div>

              {onOpenBooking && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="btn-cyan px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer mt-1"
                >
                  Book an Intake Bay
                </button>
              )}
            </div>
          )
        ) : (
          <div className="py-8 px-4 text-center space-y-2 bg-[#07080B] rounded-xl border border-white/5">
            <p className="text-xs text-slate-400">
              Type your registered plate number above to view real-time stage progress, completed tasks, and pickup readiness.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Demo search test: NDB 4821 or CAR 8800
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
