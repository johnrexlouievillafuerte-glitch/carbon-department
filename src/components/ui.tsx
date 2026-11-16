import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { DocType, JobStatus, Role, ServiceType, Stage } from '../lib/types';
import { SERVICE_META, STAGE_META } from '../lib/types';
import { fmtDate, fmtTime, stageIndex, STAGES_ORDER } from '../lib/utils';

/* --------------------------------------------------------------- */
export function Plate({ value, size = 'md', dark = false }: { value: string; size?: 'sm' | 'md' | 'lg'; dark?: boolean }) {
  return (
    <span className={`plate${size === 'sm' ? ' plate-sm' : size === 'lg' ? ' plate-lg' : ''}${dark ? ' dark' : ''}`}>
      <span className="strip" />
      <span className="val">{value}</span>
    </span>
  );
}

export function StagePill({ stage, short = false }: { stage: Stage; short?: boolean }) {
  const m = STAGE_META[stage];
  return (
    <span className="pill" style={{ background: `${m.color}1f`, color: m.color, borderColor: `${m.color}55` }}>
      <span className="dot" />
      {short ? stage.replace(' for Release', '').replace(' & QC', '') : stage}
    </span>
  );
}

const STATUS_STYLE: Record<JobStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: 'rgba(88,166,255,.12)', color: '#7cb9ff', border: 'rgba(88,166,255,.3)' },
  Waiting: { bg: 'rgba(255,176,32,.12)', color: '#ffc266', border: 'rgba(255,176,32,.3)' },
  'In Progress': { bg: 'rgba(255,107,18,.13)', color: '#ffa25b', border: 'rgba(255,107,18,.32)' },
  Ready: { bg: 'rgba(47,227,176,.12)', color: '#4fe9c0', border: 'rgba(47,227,176,.3)' },
  Released: { bg: 'rgba(255,255,255,.06)', color: '#a9b3ba', border: '#2f383e' },
};

export function StatusPill({ status }: { status: JobStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className="pill" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      <span className="dot" />
      {status}
    </span>
  );
}

export function ServiceTag({ service }: { service: ServiceType }) {
  const m = SERVICE_META[service];
  return (
    <span className="pill" style={{ background: m.tint, color: m.color, borderColor: `${m.color}40` }}>
      {service}
    </span>
  );
}

export function RoleTag({ role }: { role: Role }) {
  const label = role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : 'Mechanic';
  return (
    <span className="pill" style={{ background: 'rgba(255,107,18,.13)', color: '#ffa25b', borderColor: 'rgba(255,107,18,.3)' }}>
      {label}
    </span>
  );
}

export function DocTag({ type }: { type: DocType }) {
  return <span className="pill pill-gray" style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>{type}</span>;
}

/* --------------------------------------------------------------- */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / 750);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={className}>
      {prefix}
      {n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* --------------------------------------------------------------- */
export function SectionHead({ icon, title, action }: { icon?: ReactNode; title: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-head">
      <h3 className="section-title">
        {icon}
        {title}
      </h3>
      <span className="spacer" />
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon && <div className="e-ico">{icon}</div>}
      <b>{title}</b>
      {text && <p>{text}</p>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`field ${className ?? ''}`}>
      <span className="label">
        {label}
        {required && <i className="req">*</i>}
      </span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

/* --------------------------------------------------------------- */
export function StageTrack({ stage, teal = false }: { stage: Stage; teal?: boolean }) {
  const pct = Math.round((stageIndex(stage) / (STAGES_ORDER.length - 1)) * 100);
  const grey = stage === 'Released';
  return (
    <div className={`stage-track${teal ? ' teal' : ''}${grey ? ' gray' : ''}`}>
      <i style={{ width: `${Math.max(6, pct)}%` }} />
    </div>
  );
}

export function MiniTimeline({ stage }: { stage: Stage }) {
  const idx = stageIndex(stage);
  return (
    <div className="row" style={{ gap: 3 }} aria-label={`Stage ${idx + 1} of ${STAGES_ORDER.length}`}>
      {STAGES_ORDER.map((s, i) => (
        <span
          key={s}
          title={s}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 99,
            background: i <= idx ? (i === idx ? '#ffb020' : '#ff6b12') : '#232a2f',
            opacity: i <= idx ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- */
export function ConfirmRow({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="between" style={{ padding: '7px 0', borderBottom: '1px solid #171c1f' }}>
      <span className="t-sm dim">{label}</span>
      <span className={`t-sm ${mono ? 'mono' : ''}`} style={{ color: 'var(--text-2)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export function DateTime({ iso }: { iso: string | null }) {
  if (!iso) return <span className="dim">—</span>;
  return (
    <span className="t-sm">
      {fmtDate(iso)} <span className="dim">·</span> <span className="mono t-xs">{fmtTime(iso)}</span>
    </span>
  );
}
