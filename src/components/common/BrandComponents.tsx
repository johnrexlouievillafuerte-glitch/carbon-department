import React from 'react';
import type { JobStage } from '../../data/carbonStore';

// Circular SVG Progress Gauge Ring
export const ProgressGauge: React.FC<{
  percent: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  stageName?: string;
  className?: string;
}> = ({
  percent,
  size = 110,
  strokeWidth = 9,
  showLabel = true,
  stageName,
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  const strokeColor = clampedPercent >= 100 ? '#10B981' : clampedPercent > 60 ? '#7B93BE' : '#FFB020';

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-700/30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono-code font-bold text-lg leading-none tracking-tight text-white dark:text-white light:text-slate-900">
            {clampedPercent}%
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
            Progress
          </span>
        </div>
      </div>

      {showLabel && stageName && (
        <span className="mt-2 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 tracking-tight text-center">
          {stageName}
        </span>
      )}
    </div>
  );
};

// Philippine LTO License Plate Tag
export const PlateBadge: React.FC<{
  plate: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ plate, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 border-[1.5px] rounded',
    md: 'text-xs px-2.5 py-1 border-2 rounded-md',
    lg: 'text-sm px-3.5 py-1.5 border-2 rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono-code font-bold bg-[#0F131D] text-white border-[#7B93BE] shadow-sm select-all tracking-wider ${sizeClasses[size]} ${className}`}
      title="Philippine Motor Vehicle License Plate"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400/80 inline-block shadow-inner" />
      <span>{plate.toUpperCase()}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400/80 inline-block shadow-inner" />
    </span>
  );
};

// Job Order Code Tag
export const JobOrderTag: React.FC<{
  code: string;
  className?: string;
}> = ({ code, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono-code font-bold text-xs px-2.5 py-1 rounded bg-[#172B57]/80 text-[#EEF1F6] border border-[#7B93BE]/40 tracking-wider shadow-sm ${className}`}
    >
      <span className="text-[#FFB020] text-[10px]">#</span>
      <span>{code}</span>
    </span>
  );
};

// Stage Status Badge with refined colors
export const StageBadge: React.FC<{
  stage: JobStage;
  className?: string;
}> = ({ stage, className = '' }) => {
  const config: Record<JobStage, { bg: string; text: string; border: string; dot: string }> = {
    'Received': {
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      dot: 'bg-slate-400',
    },
    'Pre-Inspection': {
      bg: 'bg-blue-950/60',
      text: 'text-blue-300',
      border: 'border-blue-700/40',
      dot: 'bg-blue-400',
    },
    'Estimate/Approval': {
      bg: 'bg-amber-950/50',
      text: 'text-amber-300',
      border: 'border-amber-600/40',
      dot: 'bg-amber-400',
    },
    'In Repair': {
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-300',
      border: 'border-indigo-600/40',
      dot: 'bg-indigo-400',
    },
    'Finishing/Paint': {
      bg: 'bg-cyan-950/60',
      text: 'text-cyan-300',
      border: 'border-cyan-600/40',
      dot: 'bg-cyan-400',
    },
    'Final Assessment': {
      bg: 'bg-teal-950/60',
      text: 'text-teal-300',
      border: 'border-teal-600/40',
      dot: 'bg-teal-400',
    },
    'Ready for Release': {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-600/50',
      dot: 'bg-emerald-400',
    },
    'Released': {
      bg: 'bg-zinc-800/60',
      text: 'text-zinc-400',
      border: 'border-zinc-700/40',
      dot: 'bg-zinc-500',
    },
  };

  const current = config[stage] || config['Received'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      <span>{stage}</span>
    </span>
  );
};
