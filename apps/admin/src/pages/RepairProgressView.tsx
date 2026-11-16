import React from 'react';
import { PlateBadge, JobTag } from '@carbon/ui';
import type { JobOrder, Vehicle, Customer } from '@carbon/ui';

interface RepairProgressViewProps {
  jobOrders: JobOrder[];
  vehicles: Vehicle[];
  customers: Customer[];
  onRefresh: () => void;
  onSelectJob: (job: JobOrder) => void;
}

export const RepairProgressView: React.FC<RepairProgressViewProps> = ({
  jobOrders,
  vehicles,
  onSelectJob,
}) => {
  const stagesList = [
    'Received',
    'Pre-Inspection',
    'Estimate/Approval',
    'In Repair',
    'Finishing/Paint',
    'Final Assessment',
    'Ready for Release',
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
          Shop-Floor Repair Progress &amp; Customer Sync
        </h2>
        <p className="text-xs text-[#9A9A9A]">
          Any milestone status update logged here immediately reflects on the customer's repair tracking page.
        </p>
      </div>

      {/* 7-Stage Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {stagesList.map((stg) => {
          const jobsInStage = jobOrders.filter((j) => j.stage === stg && !j.is_archived);

          return (
            <div
              key={stg}
              className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-3.5 space-y-3 min-w-[160px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] text-xs">
                <span className="font-heading font-semibold text-[#F2F2F0] truncate">{stg}</span>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded-[4px] ${
                    jobsInStage.length > 0
                      ? 'bg-[#00B8F0]/15 text-[#00B8F0] font-semibold'
                      : 'bg-[#0F0F10] text-[#9A9A9A] border border-white/[0.08]'
                  }`}
                >
                  {jobsInStage.length}
                </span>
              </div>

              {/* Cards in Stage */}
              <div className="space-y-2">
                {jobsInStage.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#9A9A9A]/60 italic font-mono">
                    Empty
                  </div>
                ) : (
                  jobsInStage.map((job) => {
                    const veh = vehicles.find((v) => v.id === job.vehicle_id);

                    return (
                      <div
                        key={job.id}
                        onClick={() => onSelectJob(job)}
                        className="p-3 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] hover:border-[#00B8F0] cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <JobTag code={job.job_no} />
                          {veh && <PlateBadge plate={veh.plate_number} />}
                        </div>
                        <span className="text-xs font-medium text-[#F2F2F0] block truncate">
                          {veh ? `${veh.make} ${veh.model}` : 'Vehicle'}
                        </span>
                        <p className="text-[11px] text-[#9A9A9A] truncate">
                          {job.services.join(', ')}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
