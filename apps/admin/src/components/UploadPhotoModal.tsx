import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea } from '@carbon/ui';
import { api } from '../api';
import type { JobOrder, Vehicle } from '@carbon/ui';

interface UploadPhotoModalProps {
  open: boolean;
  onClose: () => void;
  jobOrders: JobOrder[];
  vehicles: Vehicle[];
  onPhotoUploaded: () => void;
  targetJobId?: string;
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  open,
  onClose,
  jobOrders,
  vehicles,
  onPhotoUploaded,
  targetJobId,
}) => {
  const [selectedJobId, setSelectedJobId] = useState(targetJobId || jobOrders[0]?.id || '');
  const [angle, setAngle] = useState('front');
  const [label, setLabel] = useState('Front Clip & Bumper Seam');
  const [caption, setCaption] = useState('Pre-repair condition documented at bay check-in.');
  const [hasDamage, setHasDamage] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const angleOptions = [
    { value: 'front', label: 'Front Clip & Bumper Seam' },
    { value: 'rear', label: 'Rear Bumper & Trunk Gap' },
    { value: 'left', label: 'Left Side Profile & Fenders' },
    { value: 'right', label: 'Right Side Profile & Doors' },
    { value: 'interior', label: 'Interior Odometer & Dashboard' },
    { value: 'damage_closeup', label: 'Pre-existing Damage / Stone Chips' },
  ];

  const handleAngleChange = (val: string) => {
    setAngle(val);
    const matched = angleOptions.find((a) => a.value === val);
    if (matched) setLabel(matched.label);
    if (val === 'damage_closeup') setHasDamage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setError('Please select an active job order.');
      return;
    }
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('job_order_id', selectedJobId);
      fd.append('angle', angle);
      fd.append('label', label);
      fd.append('caption', caption);
      fd.append('has_damage', hasDamage ? 'true' : 'false');

      await api.uploadIntakePhoto(fd);
      onPhotoUploaded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload Pre-Repair Intake Photograph"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button type="button" variant="secondary" size="md" className="text-center justify-center" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="upload-photo-form" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
            {loading ? 'Uploading...' : 'Save Intake Photo'}
          </Button>
        </div>
      }
    >
      <form id="upload-photo-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
            {error}
          </div>
        )}

        <Select
          label="Active Job Order *"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          options={[
            { value: '', label: '-- Choose Job Order --' },
            ...jobOrders.map((j) => {
              const v = vehicles.find((veh) => veh.id === j.vehicle_id);
              return {
                value: j.id,
                label: `${j.job_no} — ${v?.plate_number || 'Vehicle'} (${j.stage})`,
              };
            }),
          ]}
        />

        <Select
          label="Inspection Angle *"
          value={angle}
          onChange={(e) => handleAngleChange(e.target.value)}
          options={angleOptions}
        />

        <Input
          label="Photo Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        {/* File Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Image File *</label>
          <div className="p-6 rounded-[6px] border border-dashed border-white/20 bg-[#0F0F10] text-center space-y-2">
            <Camera size={24} className="mx-auto text-[#00B8F0]" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs text-[#9A9A9A] file:mr-3 file:py-1.5 file:px-3 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#161617] file:text-[#00B8F0] cursor-pointer"
            />
            {file && (
              <p className="text-xs text-[#2DD4A0] font-mono">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        <Textarea
          label="Inspector Notes / Observation"
          rows={2}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="p-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08]">
          <label className="flex items-center gap-2 text-xs text-[#9A9A9A] cursor-pointer">
            <input
              type="checkbox"
              checked={hasDamage}
              onChange={(e) => setHasDamage(e.target.checked)}
              className="rounded-[4px] border-white/20 bg-[#161617] text-[#00B8F0] focus:ring-[#00B8F0]"
            />
            <span className="text-[#F2F2F0]">Pre-existing scratch, dent, or scrape noted at intake</span>
          </label>
        </div>
      </form>
    </Modal>
  );
};
