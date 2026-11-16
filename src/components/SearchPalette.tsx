import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, CalendarDays, ClipboardList, CornerDownLeft, Search, Car, UserRound, Command } from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import { fmtDate, normalizePlate, searchScore, stageIndex } from '../lib/utils';
import { CarChip } from './graphics';
import { Plate, StagePill } from './ui';
import type { BodyType, Stage } from '../lib/types';

interface Result {
  key: string;
  kind: 'vehicle' | 'job' | 'customer' | 'action';
  title: string;
  sub: string;
  plate?: string;
  body?: BodyType;
  stage?: Stage;
  to: string;
  icon?: React.ReactNode;
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) setActive(0);
  }, [q, open]);

  const results = useMemo<Result[]>(() => {
    const term = q.trim();
    const norm = normalizePlate(term);
    if (!term) {
      const recent = [...state.vehicles]
        .map((v) => {
          const job = state.jobs.find((j) => j.vehicleId === v.id);
          return { v, job };
        })
        .filter((x) => x.job)
        .sort((a, b) => stageIndex(a.job!.stage) - stageIndex(b.job!.stage))
        .slice(0, 4);
      return [
        ...recent.map<Result>(({ v, job }) => ({
          key: `v-${v.id}`,
          kind: 'vehicle',
          title: `${v.make} ${v.model}`,
          sub: `${v.year} · ${v.color}${job ? ` · ${job.stage}` : ''}`,
          plate: v.plate,
          body: v.bodyType,
          stage: job?.stage,
          to: `/vehicles/${v.id}`,
        })),
        { key: 'a1', kind: 'action', title: 'Open vehicle records', sub: 'Browse and search every plate on file', to: '/vehicles', icon: <Car size={15} /> },
        { key: 'a2', kind: 'action', title: 'Open a new job order', sub: 'Log a walk-in or booked unit', to: '/job-orders?new=1', icon: <ClipboardList size={15} /> },
        { key: 'a3', kind: 'action', title: 'View bookings for this week', sub: 'Plan the shop schedule', to: '/bookings', icon: <CalendarDays size={15} /> },
      ];
    }

    const vehicles: Result[] = [];
    for (const v of state.vehicles) {
      const customer = state.customers.find((c) => c.id === v.customerId);
      const plateScore = norm ? searchScore(normalizePlate(v.plate), norm) : 0;
      const nameScore = customer ? searchScore(customer.name, term) : 0;
      const modelScore = Math.max(searchScore(`${v.make} ${v.model}`, term), searchScore(v.vin, term), searchScore(v.chassis, term));
      const plateBonus = plateScore > 0 ? plateScore + 25 : 0;
      const score = Math.max(plateBonus, nameScore, modelScore);
      if (score <= 0) continue;
      const job = state.jobs.find((j) => j.vehicleId === v.id && j.stage !== 'Released') ?? state.jobs.find((j) => j.vehicleId === v.id);
      vehicles.push({
        key: `v-${v.id}`,
        kind: 'vehicle',
        title: `${v.make} ${v.model}`,
        sub: `${customer?.name ?? 'Unknown customer'}${job ? ` · ${job.code}` : ''}`,
        plate: v.plate,
        body: v.bodyType,
        stage: job?.stage,
        to: `/vehicles/${v.id}`,
        icon: undefined,
      });
    }
    vehicles.sort((a, b) => (normalizePlate(a.plate ?? '') === norm ? -1 : normalizePlate(b.plate ?? '') === norm ? 1 : 0));

    const jobs: Result[] = state.jobs
      .filter((j) => {
        const v = state.vehicles.find((x) => x.id === j.vehicleId);
        return (
          j.code.toLowerCase().includes(term.toLowerCase()) ||
          j.concern.toLowerCase().includes(term.toLowerCase()) ||
          j.technician.toLowerCase().includes(term.toLowerCase()) ||
          normalizePlate(v?.plate ?? '').includes(norm)
        );
      })
      .slice(0, 4)
      .map((j) => {
        const v = state.vehicles.find((x) => x.id === j.vehicleId);
        return {
          key: `j-${j.id}`,
          kind: 'job',
          title: j.code,
          sub: `${j.concern.slice(0, 66)}${j.concern.length > 66 ? '…' : ''}`,
          plate: v?.plate,
          body: v?.bodyType,
          stage: j.stage,
          to: `/vehicles/${j.vehicleId}?tab=job`,
        };
      });

    const customers: Result[] = state.customers
      .filter((c) => searchScore(c.name, term) > 0 || c.phone.includes(term) || searchScore(c.company ?? '', term) > 0)
      .slice(0, 3)
      .map((c) => ({
        key: `c-${c.id}`,
        kind: 'customer',
        title: c.name,
        sub: `${c.kind} · ${c.phone}`,
        to: `/vehicles?q=${encodeURIComponent(c.name)}`,
        icon: <UserRound size={15} />,
      }));

    return [...vehicles.slice(0, 6), ...jobs, ...customers].slice(0, 10);
  }, [q, state]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const choose = (r: Result) => {
    navigate(r.to);
    onClose();
  };

  const groups = ['vehicle', 'job', 'customer', 'action'] as const;
  const labels: Record<string, string> = {
    vehicle: q ? 'Vehicle records' : 'Active units',
    job: 'Job orders',
    customer: 'Customers',
    action: 'Quick actions',
  };
  const flat = groups.flatMap((g) => results.filter((r) => r.kind === g));

  return createPortal(
    <div className="palette-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search records">
        <div className="palette-bar">
          <Search size={18} style={{ color: 'var(--amber)', flex: '0 0 auto' }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(flat.length - 1, a + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === 'Enter' && flat[active]) {
                e.preventDefault();
                choose(flat[active]);
              }
            }}
            placeholder="Search plate number, customer, VIN, or job order…"
            aria-label="Search records"
          />
          <kbd style={{ flex: '0 0 auto' }}>ESC</kbd>
        </div>
        <div className="palette-hint">
          <Command size={11} /> Plate number is the fastest lookup — try “4821” or “NCR”
        </div>

        <div className="palette-list">
          {flat.length === 0 && (
            <div className="palette-empty">
              <Search size={22} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              No record matched “{q}”.
              <br />
              <span style={{ fontSize: 11 }}>Try a plate number, customer surname, or job order code.</span>
            </div>
          )}
          {groups.map((g) => {
            const items = results.filter((r) => r.kind === g);
            if (items.length === 0) return null;
            return (
              <div key={g}>
                <div className="palette-group">{labels[g]}</div>
                {items.map((r) => {
                  const idx = flat.findIndex((x) => x.key === r.key);
                  return (
                    <button
                      type="button"
                      key={r.key}
                      className="palette-item"
                      data-active={idx === active}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => choose(r)}
                    >
                      {r.kind === 'vehicle' && r.body ? (
                        <CarChip body={r.body} />
                      ) : r.kind === 'job' ? (
                        <span className="act-ico" style={{ width: 30, height: 30, flex: '0 0 30px' }}>
                          <ClipboardList size={14} />
                        </span>
                      ) : (
                        <span className="act-ico" style={{ width: 30, height: 30, flex: '0 0 30px' }}>
                          {r.icon ?? <Car size={14} />}
                        </span>
                      )}
                      <div className="p-main">
                        <div className="p-title">
                          {r.plate && <Plate value={r.plate} size="sm" />}
                          <span className="truncate">{r.kind === 'vehicle' ? r.title : r.kind === 'job' ? r.title : r.title}</span>
                          {r.stage && <StagePill stage={r.stage} short />}
                        </div>
                        <div className="p-sub">
                          {r.sub}
                          {r.kind === 'job' && <span className="dim"> · {fmtDate(state.jobs.find((j) => j.code === r.title)?.receivedAt ?? new Date().toISOString())}</span>}
                        </div>
                      </div>
                      <ArrowRight size={14} style={{ color: idx === active ? 'var(--amber)' : '#4c565d', flex: '0 0 auto' }} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>
              <CornerDownLeft size={9} />
            </kbd>{' '}
            open record
          </span>
          <span style={{ marginLeft: 'auto' }}>CARBONTrack · plate-first retrieval</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
