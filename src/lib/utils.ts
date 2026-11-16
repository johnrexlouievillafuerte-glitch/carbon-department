import type { JobOrder, JobStatus, LineItem, Role, Stage } from './types';

/* ---------------------------------------------------------------
   Formatting & domain helpers
   --------------------------------------------------------------- */

export function money(n: number, decimals = 0): string {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function moneyShort(n: number): string {
  if (n >= 1_000_000) return '₱' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return '₱' + Math.round(n / 1_000) + 'k';
  return '₱' + n;
}

export function normalizePlate(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDateShort(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return '—';
  return `${fmtDate(iso)} · ${fmtTime(iso)}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return fmtDate(iso);
}

export function stageIndex(stage: Stage): number {
  return STAGES_ORDER.indexOf(stage);
}
export const STAGES_ORDER: Stage[] = [
  'Checked-in',
  'Pre-Inspection',
  'Diagnosis',
  'For Approval',
  'In Progress',
  'Finishing & QC',
  'Ready for Release',
  'Released',
];

export function statusOf(stage: Stage): JobStatus {
  if (stage === 'Released') return 'Released';
  if (stage === 'Ready for Release') return 'Ready';
  if (stage === 'For Approval') return 'Waiting';
  if (stage === 'Checked-in' || stage === 'Pre-Inspection' || stage === 'Diagnosis') return 'Open';
  return 'In Progress';
}

export function progressPct(stage: Stage): number {
  return Math.round((stageIndex(stage) / (STAGES_ORDER.length - 1)) * 100);
}

export function jobTotals(job: JobOrder) {
  const subtotal = job.items.reduce((s, i) => s + i.qty * i.unit, 0);
  const discount = job.discount || 0;
  const total = Math.max(0, subtotal - discount);
  const labor = job.items.filter((i) => i.kind === 'Labor').reduce((s, i) => s + i.qty * i.unit, 0);
  const parts = subtotal - labor;
  return { subtotal, discount, total, labor, parts };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfWeek(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  const dow = c.getDay(); // 0 Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  return addDays(c, diff);
}

export function prettyDay(iso: string): string {
  return new Date(iso + 'T09:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function canDelete(role: Role | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

export function elapsedLabel(fromIso: string, toIso: string | null): string {
  const end = toIso ? new Date(toIso).getTime() : Date.now();
  const days = Math.max(0, Math.round((end - new Date(fromIso).getTime()) / 86_400_000));
  if (days === 0) return 'same day';
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function searchScore(haystack: string, needle: string): number {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (!n) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  if (h.includes(n)) return 60;
  return 0;
}

export function jsonClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function totalSpent(jobs: JobOrder[]): number {
  return jobs.filter((j) => j.stage === 'Released').reduce((s, j) => s + jobTotals(j).total, 0);
}

export function itemsSum(items: LineItem[]): number {
  return items.reduce((s, i) => s + i.qty * i.unit, 0);
}
