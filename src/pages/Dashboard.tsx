import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Car,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderOpen,
  Search,
  ShieldCheck,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import { SERVICES } from '../lib/types';
import { SERVICE_META } from '../lib/types';
import { fmtDate, fmtDateShort, isoDay, normalizePlate, stageIndex, timeAgo } from '../lib/utils';
import { CarArt } from '../components/graphics';
import { AnimatedNumber, EmptyState, Plate, ServiceTag, StagePill, StageTrack } from '../components/ui';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { state, session } = useStore();
  const [plateQ, setPlateQ] = useState('');

  const today = isoDay(new Date());
  const active = state.jobs.filter((j) => j.stage !== 'Released');
  const ready = state.jobs.filter((j) => j.stage === 'Ready for Release');
  const waiting = state.jobs.filter((j) => j.stage === 'For Approval');
  const inBay = state.jobs.filter((j) => j.stage === 'In Progress' || j.stage === 'Finishing & QC');
  const docs = state.jobs.reduce((s, j) => s + j.docs.length, 0);
  const docMb = (state.jobs.flatMap((j) => j.docs).reduce((s, d) => s + d.kb, 0) / 1024).toFixed(1);
  const fleetUnits = state.vehicles.filter((v) => state.customers.find((c) => c.id === v.customerId)?.kind === 'Fleet').length;

  const turnarounds = state.jobs
    .filter((j) => j.releasedAt)
    .map((j) => (new Date(j.releasedAt as string).getTime() - new Date(j.receivedAt).getTime()) / 86_400_000);
  const avgTurn = turnarounds.length ? Math.round(turnarounds.reduce((a, b) => a + b, 0) / turnarounds.length) : 0;
  const coverage = active.length ? Math.round((active.filter((j) => j.photos.length > 0).length / active.length) * 100) : 100;

  const bayList = useMemo(
    () => [...active].sort((a, b) => stageIndex(b.stage) - stageIndex(a.stage)).slice(0, 6),
    [active],
  );

  const serviceMix = SERVICES.map((s) => ({
    service: s,
    count: active.filter((j) => j.serviceTypes.includes(s)).length,
  })).filter((x) => x.count > 0);
  const mixTotal = serviceMix.reduce((s, x) => s + x.count, 0) || 1;

  const upcoming = [...state.bookings]
    .filter((b) => b.date >= today && b.status !== 'Cancelled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 4);

  const query = plateQ.trim();
  const norm = normalizePlate(query);
  const plateMatches =
    query.length > 0
      ? state.vehicles
          .filter(
            (v) =>
              normalizePlate(v.plate).includes(norm) ||
              `${v.make} ${v.model}`.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 3)
      : [];

  const customerOf = (id: string) => state.customers.find((c) => c.id === id);
  const lastPhoto = [...state.jobs.flatMap((j) => j.photos)].sort((a, b) => b.takenAt.localeCompare(a.takenAt))[0];

  const iconFor = (kind: string) => {
    switch (kind) {
      case 'doc':
        return <FileText size={12} />;
      case 'vehicle':
        return <Car size={12} />;
      case 'booking':
        return <CalendarDays size={12} />;
      case 'photo':
      case 'inspect':
        return <Camera size={12} />;
      case 'delete':
        return <Trash2 size={12} />;
      default:
        return <Activity size={12} />;
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">
            {greeting()}, {session?.name.split(' ')[0] ?? 'team'} · {fmtDate(new Date().toISOString())}
          </div>
          <h1 className="page-title">
            Workshop <span className="accent">overview</span>
          </h1>
          <p className="page-sub">
            Live workload, records, and evidence for Carbon Department Carshop — every unit accounted for.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => navigate('/progress')}>
            <Activity size={14} /> Progress board
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/job-orders?new=1')}>
            <ClipboardList size={14} /> New job order
          </button>
        </div>
      </div>

      <section className="hero-panel reveal" style={{ ['--i' as string]: 0 }}>
        <div className="hero-copy">
          <div className="eyebrow" style={{ color: 'var(--amber)', marginBottom: 8 }}>
            Shop floor · live
          </div>
          <h2 className="hero-title">
            Paper loses jobs. <span>Records don&apos;t.</span>
          </h2>
          <p className="hero-sub">
            {inBay.length} units are being worked on right now. {ready.length} ready for release, {waiting.length} waiting on
            customer approval — all linked to their plate, job order and pre-inspection photo set.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <b>
                <AnimatedNumber value={active.length} />
              </b>
              <span>Open job orders</span>
            </div>
            <div className="hero-stat">
              <b>
                <AnimatedNumber value={avgTurn} />
                <small style={{ fontSize: 14, color: 'var(--dim)', marginLeft: 3 }}>days</small>
              </b>
              <span>Avg turnaround</span>
            </div>
            <div className="hero-stat">
              <b>
                <AnimatedNumber value={coverage} suffix="%" />
              </b>
              <span>Photo coverage</span>
            </div>
          </div>
        </div>
        <div className="hero-car" aria-hidden>
          <span className="scan-ring" />
          <span className="hero-badge b1">
            <ShieldCheck size={10} /> EVIDENCE LOCKED
          </span>
          <span className="hero-badge b2">
            <span className="pulse-dot" /> {inBay.length} BAYS ACTIVE
          </span>
          <CarArt body="SUV" variant={2} />
        </div>
      </section>

      <div className="grid grid-4" style={{ marginTop: 14 }}>
        <div className="kpi reveal" style={{ ['--i' as string]: 1 }}>
          <div className="kpi-top">
            <span className="kpi-label">Active job orders</span>
            <span className="kpi-icon" style={{ ['--kpi-color' as string]: 'var(--amber)', ['--kpi-tint' as string]: 'var(--amber-soft)' }}>
              <ClipboardList size={14} />
            </span>
          </div>
          <div className="kpi-value">
            <AnimatedNumber value={active.length} />
          </div>
          <div className="kpi-foot">
            <span style={{ color: 'var(--amber-2)' }}>{waiting.length} awaiting approval</span>
            <span className="dim">·</span>
            <span>{inBay.length} in the bays</span>
          </div>
        </div>

        <div className="kpi reveal" style={{ ['--i' as string]: 2, ['--kpi-color' as string]: 'var(--blue)', ['--kpi-tint' as string]: 'var(--blue-soft)' }}>
          <div className="kpi-top">
            <span className="kpi-label">Vehicles on file</span>
            <span className="kpi-icon" style={{ ['--kpi-color' as string]: 'var(--blue)', ['--kpi-tint' as string]: 'var(--blue-soft)' }}>
              <Car size={14} />
            </span>
          </div>
          <div className="kpi-value">
            <AnimatedNumber value={state.vehicles.length} />
          </div>
          <div className="kpi-foot">
            <span>{state.customers.length} customers</span>
            <span className="dim">·</span>
            <span>{fleetUnits} fleet units</span>
          </div>
        </div>

        <div className="kpi reveal" style={{ ['--i' as string]: 3 }}>
          <div className="kpi-top">
            <span className="kpi-label">Ready for release</span>
            <span className="kpi-icon" style={{ ['--kpi-color' as string]: 'var(--teal)', ['--kpi-tint' as string]: 'var(--teal-soft)' }}>
              <CheckCircle2 size={14} />
            </span>
          </div>
          <div className="kpi-value">
            <AnimatedNumber value={ready.length} />
          </div>
          <div className="kpi-foot">
            <span style={{ color: 'var(--teal)' }}>Awaiting customer pickup</span>
          </div>
        </div>

        <div className="kpi reveal" style={{ ['--i' as string]: 4 }}>
          <div className="kpi-top">
            <span className="kpi-label">Documents archived</span>
            <span className="kpi-icon" style={{ ['--kpi-color' as string]: 'var(--purple)', ['--kpi-tint' as string]: 'var(--purple-soft)' }}>
              <FolderOpen size={14} />
            </span>
          </div>
          <div className="kpi-value">
            <AnimatedNumber value={docs} />
          </div>
          <div className="kpi-foot">
            <span>{docMb} MB</span>
            <span className="dim">·</span>
            <span style={{ color: 'var(--teal)' }}>no 3-month purge</span>
          </div>
        </div>
      </div>

      <div className="split-main" style={{ marginTop: 16 }}>
        <div className="stack loose">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <Wrench size={13} /> Bay board · active units
              </span>
              <span className="spacer" />
              <button className="btn-link" onClick={() => navigate('/progress')}>
                Full board <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="panel-body tight" style={{ padding: '4px 16px 8px' }}>
              {bayList.map((job, i) => {
                const v = state.vehicles.find((x) => x.id === job.vehicleId);
                const c = customerOf(job.customerId);
                if (!v) return null;
                return (
                  <button
                    key={job.id}
                    className="job-mini"
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #161a1d', textAlign: 'left', padding: '12px 0', cursor: 'pointer' }}
                  >
                    <span className="veh-ico">
                      <CarArt body={v.bodyType} variant={i} />
                    </span>
                    <div className="jm-main">
                      <div className="jm-title">
                        <Plate value={v.plate} size="sm" />
                        <span className="truncate">
                          {v.make} {v.model}
                        </span>
                      </div>
                      <div className="jm-sub">
                        {c?.name} · {job.code} · {job.technician}
                      </div>
                      <div style={{ marginTop: 7, maxWidth: 320 }}>
                        <StageTrack stage={job.stage} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <StagePill stage={job.stage} short />
                      <span className="t-xs dim">
                        {job.promisedAt ? `Due ${fmtDateShort(job.promisedAt)}` : 'No promise date'}
                      </span>
                    </div>
                    <ArrowRight size={13} style={{ color: '#4b555c', marginLeft: 4 }} />
                  </button>
                );
              })}
              {bayList.length === 0 && <EmptyState title="No active units" text="Every job is released. New walk-ins will appear here." />}
            </div>
            <div className="panel-foot">
              <span className="t-xs">
                <span className="pulse-dot" style={{ display: 'inline-block', marginRight: 5 }} />
                Live view — updates as technicians move a unit
              </span>
              <span className="spacer" />
              <span className="mono t-xs dim">{active.length} open</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <Activity size={13} /> Recent activity
              </span>
              <span className="spacer" />
              <button className="btn-link" onClick={() => navigate('/reports')}>
                Audit log <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="panel-body" style={{ padding: '6px 18px 10px' }}>
              <div className="split-main" style={{ gap: 28 }}>
                <div>
                  {state.activity.slice(0, 5).map((a) => (
                    <div className="activity-item" key={a.id}>
                      <span className="act-ico">{iconFor(a.kind)}</span>
                      <div className="act-body">
                        <div className="act-text">{a.text}</div>
                        <div className="act-time">{timeAgo(a.at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderLeft: '1px solid #1a1f23', paddingLeft: 22 }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>
                    Plate lookup
                  </div>
                  <div className="plate-search" style={{ height: 40 }}>
                    <Search size={15} />
                    <input
                      value={plateQ}
                      onChange={(e) => setPlateQ(e.target.value)}
                      placeholder="NCR 4821"
                      aria-label="Find a vehicle by plate"
                      style={{ fontSize: 13 }}
                    />
                    {plateQ && (
                      <button className="icon-btn" style={{ position: 'absolute', right: 4, width: 28, height: 28 }} onClick={() => setPlateQ('')} aria-label="Clear">
                        <X size={13} />
                      </button>
                    )}
                    <span className="scan" />
                  </div>
                  {query === '' && (
                    <div className="stack tight" style={{ marginTop: 10 }}>
                      <span className="t-xs dim">Try a plate already on file:</span>
                      <div className="row wrap">
                        {state.vehicles.slice(0, 3).map((v) => (
                          <button key={v.id} className="chip" style={{ height: 25 }} onClick={() => setPlateQ(v.plate)}>
                            {v.plate}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {query !== '' && plateMatches.length === 0 && (
                    <div className="t-xs dim" style={{ marginTop: 10, lineHeight: 1.6 }}>
                      No record for “{query}”.
                      <button className="btn-link" style={{ marginLeft: 6 }} onClick={() => navigate('/vehicles?new=1')}>
                        Add a vehicle
                      </button>
                    </div>
                  )}
                  <div className="stack tight" style={{ marginTop: 8 }}>
                    {plateMatches.map((v) => {
                      const job = state.jobs.find((j) => j.vehicleId === v.id);
                      return (
                        <button key={v.id} className="quick-result" onClick={() => navigate(`/vehicles/${v.id}`)}>
                          <Plate value={v.plate} size="sm" />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <b className="t-sm" style={{ display: 'block' }}>
                              {v.make} {v.model}
                            </b>
                            <span className="t-xs dim">{job ? job.code : 'No job order yet'}</span>
                          </span>
                          {job && <StagePill stage={job.stage} short />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stack loose">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <Wrench size={13} /> Service mix · open jobs
              </span>
              <span className="spacer" />
              <span className="t-xs dim mono">{mixTotal} lines</span>
            </div>
            <div className="panel-body">
              <div className="donut-wrap">
                <div className="donut">
                  <svg width="132" height="132" viewBox="0 0 132 132">
                    <circle cx="66" cy="66" r="54" fill="none" stroke="#161b1f" strokeWidth="11" />
                    {(() => {
                      let acc = 0;
                      const C = 2 * Math.PI * 54;
                      return serviceMix.map((s) => {
                        const share = s.count / mixTotal;
                        const dash = Math.max(share * C - 4, 2);
                        const offset = -acc * C;
                        acc += share;
                        return (
                          <circle
                            key={s.service}
                            cx="66"
                            cy="66"
                            r="54"
                            fill="none"
                            stroke={SERVICE_META[s.service].color}
                            strokeWidth="11"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${C}`}
                            strokeDashoffset={offset}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="donut-center">
                    <div>
                      <b>{active.length}</b>
                      <span>open jobs</span>
                    </div>
                  </div>
                </div>
                <div className="legend">
                  {serviceMix.map((s) => (
                    <div className="legend-row" key={s.service}>
                      <span className="swatch" style={{ background: SERVICE_META[s.service].color }} />
                      {s.service}
                      <b>{s.count}</b>
                    </div>
                  ))}
                  {serviceMix.length === 0 && <span className="t-xs dim">No open jobs.</span>}
                </div>
              </div>
              <div className="mini-bars" style={{ marginTop: 16 }}>
                {serviceMix.map((s) => (
                  <div className="mini-bar-row" key={s.service}>
                    <span className="t-xs muted">{s.service}</span>
                    <span className="track">
                      <i style={{ width: `${(s.count / mixTotal) * 100}%`, background: SERVICE_META[s.service].color }} />
                    </span>
                    <span className="val">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <CalendarDays size={13} /> Upcoming bookings
              </span>
              <span className="spacer" />
              <button className="btn-link" onClick={() => navigate('/bookings')}>
                Schedule <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="panel-body" style={{ padding: '6px 18px 8px' }}>
              {upcoming.length === 0 && <EmptyState title="No bookings yet" text="Walk-ins still get logged as job orders." />}
              {upcoming.map((b) => (
                <div className="booking-row" key={b.id}>
                  <div style={{ width: 42, flex: '0 0 42px', textAlign: 'center' }}>
                    <div className="eyebrow" style={{ fontSize: 8.5 }}>
                      {new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.1 }}>
                      {new Date(b.date + 'T00:00:00').getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-sm" style={{ fontWeight: 600 }}>
                      {b.name}
                    </div>
                    <div className="t-xs dim">
                      {b.plate} · {b.time}
                    </div>
                  </div>
                  <ServiceTag service={b.service} />
                </div>
              ))}
            </div>
            <div className="panel-foot">
              <span className="t-xs dim">Booking is supporting — walk-ins remain first-class.</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                <ShieldCheck size={13} /> Record integrity
              </span>
              <span className="spacer" />
              <span className="pill pill-teal">
                <span className="dot" /> Protected
              </span>
            </div>
            <div className="panel-body">
              <div className="between" style={{ marginBottom: 6 }}>
                <span className="t-sm muted">Pre-inspection photo coverage</span>
                <span className="mono t-sm">{coverage}%</span>
              </div>
              <div className="stage-track teal">
                <i style={{ width: `${coverage}%` }} />
              </div>
              <div className="retention-grid" style={{ marginTop: 14 }}>
                <div className="retention-cell">
                  <b>{docs}</b>
                  <span>Documents archived</span>
                </div>
                <div className="retention-cell">
                  <b style={{ color: 'var(--teal)' }}>0</b>
                  <span>Files at risk</span>
                </div>
                <div className="retention-cell">
                  <b>{docMb} MB</b>
                  <span>Digital storage</span>
                </div>
                <div className="retention-cell">
                  <b>∞</b>
                  <span>Retention period</span>
                </div>
              </div>
              <div className="notice teal" style={{ marginTop: 12 }}>
                <FileText size={13} />
                <span>
                  Paper job orders were discarded after ~3 months. Here every job order, invoice and receipt stays attached to
                  the plate — retrievable in seconds, not a filing cabinet.
                </span>
              </div>
              <div className="t-xs dim" style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                <Camera size={11} /> Last inspection captured {lastPhoto ? timeAgo(lastPhoto.takenAt) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow">Plates on file</div>
          <div className="t-sm muted" style={{ marginTop: 6 }}>
            Search any plate, VIN, or customer from the top bar with <kbd>⌘</kbd> <kbd>K</kbd>.
          </div>
          <div className="row wrap" style={{ marginTop: 10 }}>
            {state.vehicles.slice(0, 4).map((v) => (
              <button key={v.id} className="chip" onClick={() => navigate(`/vehicles/${v.id}`)}>
                {v.plate}
              </button>
            ))}
          </div>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow">Today</div>
          <div className="row" style={{ gap: 14, marginTop: 8, alignItems: 'flex-end' }}>
            <div>
              <b className="display" style={{ fontSize: 26 }}>
                {state.bookings.filter((b) => b.date === today).length}
              </b>
              <div className="t-xs dim">scheduled</div>
            </div>
            <div>
              <b className="display" style={{ fontSize: 26 }}>
                {state.jobs.filter((j) => j.receivedAt.slice(0, 10) === today).length}
              </b>
              <div className="t-xs dim">units received</div>
            </div>
            <div>
              <b className="display" style={{ fontSize: 26 }}>
                {waiting.length}
              </b>
              <div className="t-xs dim">approvals</div>
            </div>
          </div>
          <button className="btn-link" style={{ marginTop: 10 }} onClick={() => navigate('/bookings')}>
            Open schedule <ArrowRight size={12} />
          </button>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div className="eyebrow">Fast actions</div>
          <div className="stack tight" style={{ marginTop: 8 }}>
            <button className="quick-result" onClick={() => navigate('/vehicles?new=1')}>
              <Car size={14} style={{ color: 'var(--amber)' }} /> Add a customer & vehicle
            </button>
            <button className="quick-result" onClick={() => navigate('/documents')}>
              <FolderOpen size={14} style={{ color: 'var(--blue)' }} /> Browse scanned documents
            </button>
            <button className="quick-result" onClick={() => navigate('/reports')}>
              <ClipboardList size={14} style={{ color: 'var(--purple)' }} /> Print a service history
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
