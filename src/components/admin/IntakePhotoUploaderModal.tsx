import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  Image as ImageIcon 
} from 'lucide-react';
import { useCarbon } from '../../context/CarbonContext';
import { PlateBadge, JobOrderTag } from '../common/BrandComponents';

interface IntakePhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetJobId?: string;
}

export const IntakePhotoUploaderModal: React.FC<IntakePhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  targetJobId,
}) => {
  const { jobOrders, vehicles, addIntakePhoto } = useCarbon();

  const [selectedJobId, setSelectedJobId] = useState<string>(
    targetJobId || jobOrders[0]?.id || ''
  );
  const [angle, setAngle] = useState<'front' | 'rear' | 'left' | 'right' | 'damage_closeup' | 'odometer'>('front');
  const [label, setLabel] = useState('Front Clip & Bumper Alignment');
  const [caption, setCaption] = useState('Intake 360° walkaround inspection. Pre-existing stone chips documented.');
  const [hasDamage, setHasDamage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/assets/workshop-body-repair.jpg');

  if (!isOpen) return null;

  const currentJob = jobOrders.find((j) => j.id === selectedJobId) || jobOrders[0];
  const currentVehicle = currentJob ? vehicles.find((v) => v.id === currentJob.vehicleId) : null;

  const anglePresets: Record<string, { label: string; sample: string }> = {
    front: { label: 'Front Clip & Headlight Fitment', sample: '/assets/project-subaru-sti-widebody.jpg' },
    rear: { label: 'Rear Bumper & Trunk Seams', sample: '/assets/workshop-body-repair.jpg' },
    left: { label: 'Left Side Profile & Door Gaps', sample: '/assets/workshop-paint-room.jpg' },
    right: { label: 'Right Side Fender & Quarter Panel', sample: '/assets/project-nissan-370z-hood.jpg' },
    damage_closeup: { label: 'Damage Close-up / Pre-existing Scrape', sample: '/assets/workshop-mechanical-area.jpg' },
    odometer: { label: 'Dashboard Odometer & Fuel Reading', sample: '/assets/workshop-open-parking.jpg' },
  };

  const handleAngleChange = (newAngle: any) => {
    setAngle(newAngle);
    setLabel(anglePresets[newAngle]?.label || 'Intake Inspection');
    setPreviewUrl(anglePresets[newAngle]?.sample || '/assets/workshop-body-repair.jpg');
    if (newAngle === 'damage_closeup') setHasDamage(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob) return;

    addIntakePhoto(currentJob.id, {
      angle,
      label,
      url: previewUrl,
      caption: caption || `Intake condition documented at Cainta bay (${angle.toUpperCase()}).`,
      hasDamage,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E121B] border border-[#7B93BE]/40 rounded-3xl overflow-hidden clip-brand-lg shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="brand-corner-tr" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#172B57] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/40 flex items-center justify-center text-[#FFB020] shadow-md clip-brand">
              <Camera size={18} />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-white tracking-tight">
                Upload Pre-Repair Intake Photo
              </h2>
              <span className="text-xs text-[#7B93BE] font-mono-code">
                Linked Immutably to Vehicle &amp; Customer Record
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#0B0D12] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-body">
          
          {/* Target Job Selection */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
              Select Active Job Order
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
            >
              {jobOrders.map((job) => {
                const v = vehicles.find((v) => v.id === job.vehicleId);
                return (
                  <option key={job.id} value={job.id} className="bg-[#11141C]">
                    {job.jobNo} — {v?.plateNumber} ({v?.make} {v?.model}) · Stage: {job.stage}
                  </option>
                );
              })}
            </select>
          </div>

          {currentVehicle && (
            <div className="p-3 rounded-xl bg-[#172B57]/40 border border-[#7B93BE]/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlateBadge plate={currentVehicle.plateNumber} size="sm" />
                <span className="text-xs font-heading font-bold text-white">
                  {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                </span>
              </div>
              <JobOrderTag code={currentJob.jobNo} />
            </div>
          )}

          {/* Angle Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
              Select Verified Angle Label
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'front', label: 'Front' },
                { id: 'rear', label: 'Rear' },
                { id: 'left', label: 'Left Side' },
                { id: 'right', label: 'Right Side' },
                { id: 'damage_closeup', label: 'Damage' },
                { id: 'odometer', label: 'Odometer' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAngleChange(item.id)}
                  className={`p-2 rounded-lg text-center font-mono-code text-xs font-semibold border transition-all cursor-pointer ${
                    angle === item.id
                      ? 'bg-[#172B57] text-[#FFB020] border-[#FFB020] shadow-md'
                      : 'bg-[#11141C] text-slate-400 border-[#7B93BE]/30 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview & File Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6 relative h-40 rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Intake Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-500 space-y-1">
                  <ImageIcon size={24} className="mx-auto" />
                  <span>No photo selected</span>
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#172B57]/90 text-white text-[9px] font-mono-code uppercase font-semibold">
                {angle}
              </div>
            </div>

            <div className="sm:col-span-6 space-y-3">
              <label className="block p-4 rounded-xl border-2 border-dashed border-[#7B93BE]/40 hover:border-[#FFB020] bg-[#11141C] cursor-pointer text-center transition-colors">
                <Upload size={20} className="mx-auto text-[#FFB020] mb-1" />
                <span className="text-xs font-heading font-semibold text-white block">
                  Click to select photo file
                </span>
                <span className="text-[10px] text-slate-400 font-mono-code block mt-0.5">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasDamage}
                  onChange={(e) => setHasDamage(e.target.checked)}
                  className="rounded border-slate-600 text-[#FFB020] focus:ring-0"
                />
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} /> Highlights pre-existing damage
                </span>
              </label>
            </div>
          </div>

          {/* Label & Caption */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Photo Angle Label
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Technician Inspection Notes / Condition Remarks
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-code">
              <ShieldCheck size={13} className="text-[#10B981]" />
              <span>Visible on Customer Tracking Portal</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#11141C] text-slate-300 text-xs font-semibold border border-[#7B93BE]/30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-amber px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer clip-tr shadow-md"
              >
                Attach Intake Photo
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
