import React from 'react';
import { clsx } from 'clsx';

export type Stage =
  | 'Received'
  | 'Pre-Inspection'
  | 'Estimate/Approval'
  | 'In Repair'
  | 'Finishing/Paint'
  | 'Final Assessment'
  | 'Ready for Release'
  | 'Completed/Released';

interface StageBadgeProps {
  stage: Stage | string;
  className?: string;
}

const stageColors: Record<string, string> = {
  Received: 'bg-white/[0.06] text-[#9A9A9A]',
  'Pre-Inspection': 'bg-[#00B8F0]/10 text-[#00B8F0]',
  'Estimate/Approval': 'bg-[#FF9F5A]/15 text-[#FF9F5A]',
  'In Repair': 'bg-[#00B8F0]/15 text-[#00B8F0]',
  'Finishing/Paint': 'bg-[#00B8F0]/20 text-[#00B8F0]',
  'Final Assessment': 'bg-[#2DD4A0]/15 text-[#2DD4A0]',
  'Ready for Release': 'bg-[#2DD4A0]/20 text-[#2DD4A0]',
  'Completed/Released': 'bg-white/[0.06] text-[#9A9A9A]',
};

export function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-mono font-medium',
        stageColors[stage] || 'bg-white/[0.06] text-[#9A9A9A]',
        className
      )}
    >
      {stage}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Declined' | 'Rescheduled' | 'Converted' | string;
  className?: string;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-[#FF9F5A]/15 text-[#FF9F5A]',
  Approved: 'bg-[#2DD4A0]/15 text-[#2DD4A0]',
  Declined: 'bg-[#FF5D6C]/15 text-[#FF5D6C]',
  Rescheduled: 'bg-[#00B8F0]/10 text-[#00B8F0]',
  Converted: 'bg-white/[0.05] text-[#9A9A9A]',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium',
        statusColors[status] || 'bg-white/[0.05] text-[#9A9A9A]',
        className
      )}
    >
      {status}
    </span>
  );
}
