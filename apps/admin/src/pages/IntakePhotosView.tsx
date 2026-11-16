import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { Button, EmptyState, PlateBadge, JobTag } from '@carbon/ui';
import type { IntakePhoto, JobOrder, Vehicle, Customer } from '@carbon/ui';

interface IntakePhotosViewProps {
  photos: IntakePhoto[];
  jobOrders: JobOrder[];
  vehicles: Vehicle[];
  customers: Customer[];
  onOpenUpload: () => void;
}

export const IntakePhotosView: React.FC<IntakePhotosViewProps> = ({
  photos,
  jobOrders,
  vehicles,
  onOpenUpload,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<IntakePhoto | null>(null);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Vehicle Condition Intake Photographs
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Pre-repair walkaround photos securely stored in private storage with EXIF/GPS stripped.
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={onOpenUpload}>
          <Plus size={15} /> <span>Upload Intake Photo</span>
        </Button>
      </div>

      {/* Grid or Empty State */}
      {photos.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={Camera}
            title="No pre-repair photos uploaded yet. Document vehicle condition at bay intake."
            action="Upload Intake Photo"
            onAction={onOpenUpload}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => {
            const job = jobOrders.find((j) => j.id === p.job_order_id);
            const veh = vehicles.find((v) => v.id === p.vehicle_id);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPhoto(p)}
                className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden cursor-pointer hover:border-[#00B8F0] transition-colors space-y-2 p-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-[6px] overflow-hidden bg-black/60 border border-white/[0.06]">
                    {p.url ? (
                      <img
                        src={p.url}
                        alt={p.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9A9A9A]">
                        <Camera size={20} />
                      </div>
                    )}
                    {p.has_damage ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-[4px] bg-[#FF5D6C] text-white text-[10px] font-semibold">
                        Damage Noted
                      </span>
                    ) : null}
                  </div>

                  <div className="px-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#F2F2F0] truncate">
                        {p.label || p.angle}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[#00B8F0]">
                        {p.angle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {job && <JobTag code={job.job_no} />}
                      {veh && <PlateBadge plate={veh.plate_number} />}
                    </div>

                    {p.caption && (
                      <p className="text-[11px] text-[#9A9A9A] line-clamp-1 pt-1">
                        {p.caption}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 px-1 border-t border-white/[0.04] text-[10px] text-[#9A9A9A]/60 flex justify-between items-center font-mono">
                  <span>By {p.uploaded_by}</span>
                  <span>{p.created_at?.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0F10]/80 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
          style={{ zIndex: 9999 }}
        >
          <div
            className="max-w-3xl w-full bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video max-h-[60vh] rounded-[6px] overflow-hidden bg-black flex items-center justify-center">
              {selectedPhoto.url && (
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.label}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-heading font-semibold text-[#F2F2F0]">
                {selectedPhoto.label} ({selectedPhoto.angle})
              </h4>
              <p className="text-xs text-[#9A9A9A]">{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
