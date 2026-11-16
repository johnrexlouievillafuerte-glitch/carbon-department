import { clsx } from 'clsx';

interface PlateBadgeProps {
  plate: string;
  className?: string;
}

export function PlateBadge({ plate, className }: PlateBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block px-2.5 py-1 rounded-[4px] bg-[#161617] border border-white/[0.12]',
        'font-mono text-xs font-semibold text-[#F2F2F0] tracking-wider uppercase',
        className
      )}
    >
      {plate}
    </span>
  );
}

interface JobTagProps {
  code: string;
  className?: string;
}

export function JobTag({ code, className }: JobTagProps) {
  return (
    <span
      className={clsx(
        'inline-block px-2.5 py-1 rounded-[4px] bg-[#161617] border border-white/[0.08]',
        'font-mono text-xs text-[#00B8F0] font-semibold',
        className
      )}
    >
      {code}
    </span>
  );
}
