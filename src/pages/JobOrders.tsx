import { useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, Car, Check, ClipboardList, Plus, Search, Wrench, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { ServiceType } from '../lib/types';
import { SERVICES, STAGES } from '../lib/types';
import { TECHNICIANS } from '../lib/data';
import { fmtDate, jobTotals, money, statusOf } from '../lib/utils';
import { CarArt } from '../components/graphics';
import { EmptyState, Field, Plate, ServiceTag, StagePill } from '../components/ui';
import { Modal } from '../components/Modal';

export function JobOrders({ params }: { params: URLSearchParams }) {
  const { state, session, addJob, toast } = useStore();
  const [open, setOpen] = useState(params.get('new') === '1');
  const [q, setQ] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [service, setService] = useState('All');
  const [form, setForm] = useState({
    vehicleId: params.get('vehicle') ?? '',
    services: [] as ServiceType[],
    concern: '',
    technician: TECHNICIANS[0].name,
    odo: '',
    promised: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const vehicleOf = (id: string) => state.vehicles.find((v) => v.id === id);
  const customerOf = (id: string) => state.customers.find((c) => c.id === id);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return state.jobs
      .filter((j) => {
        const v = vehicleOf(j.vehicleId);
        const c = customerOf(j.customerId);
        const match =
          !term ||
          j.code.toLowerCase().includes(term) ||
          (v?.plate ?? '').toLowerCase().includes(term) ||
          `${v?.make ?? ''} ${v?.model ?? ''}`.toLowerCase().includes(term) ||
          (c?.name ?? '').toLowerCase().includes(term) ||
          j.concern.toLowerCase().includes(term);
        const stageOk = stageFilter === 'All' || j.stage === stageFilter || (stageFilter === 'Active' && j.stage !== 'Released');
        const serviceOk = service === 'All' || j.serviceTypes.includes(service as ServiceType);
        return match && stageOk && serviceOk;
      })
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }, [state.jobs, state.vehicles, state.customers, q, stageFilter, service]);

  const openCount = state.jobs.filter((j) => j.stage !== 'Released').length;
  const approvalCount = state.jobs.filter((j) => j.stage === 'For Approval').length;

  const submit = () => {
    if (!form.vehicleId) {
      setError('Select the vehicle this job order belongs to.');
      return;
    }
    if (form.services.length === 0) {
      setError('Choose at least one service line.');
      return;
    }
    if (!form.concern.trim()) {
      setError('Describe the reported concern — this is what the panel will read.');
      return;
    }
    const job = addJob({
      vehicleId: form.vehicleId,
      serviceTypes: form.services,
      concern: form.concern.trim(),
      technician: form.technician,
      odometer: Number(form.odo) || vehicleOf(form.vehicleId)?.mileage || 0,
      promisedAt: form.promised ? new Date(`${form.promised}T17:00:00`).toISOString() : null,
      notes: form.notes.trim(),
    });
    toast('Job order opened', `${job.code} · ${vehicleOf(form.vehicleId)?.plate ?? ''}`);
    setOpen(false);
    setForm({ vehicleId: '', services: [], concern: '', technician: TECHNICIANS[0].name, odo: '', promised: '', notes: '' });
    setError('');
    navigate(`/vehicles/${job.vehicleId}?tab=job`);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Job <span className="accent">orders</span>
          </h1>
          <p className="page-sub">
            Every repair is authorized on a digital job order — priced, assigned, printable and tied to the plate.
          </p>
        </div>
        <div className="page-actions">
          <div className="pill pill-amber" style={{ height: 28 }}>
            <span className="dot" /> {approvalCount} awaiting approval
          </div>
          {session?.role !== 'mechanic' && (
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Plus size={14} /> New job order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="kpi">
          <div className="kpi-top"> <span className="kpi-label">Open job orders</span> <ClipboardList size={14} style={{ color: 'var(--amber)' }} /></div>
          <div className="kpi-value">{openCount}</div>
          <div className="kpi-foot">Across {state.vehicles.length} vehicle records</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"> <span className="kpi-label">Awaiting approval</span> <CalendarClock size={14} style={{ color: 'var(--amber-2)' }} /></div>
          <div className="kpi-value">{approvalCount}</div>
          <div className="kpi-foot">Customer must confirm before parts are ordered</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"> <span className="kpi-label">In the bays</span> <Wrench size={14} style={{ color: 'var(--teal)' }} /></div>
          <div className="kpi-value">{state.jobs.filter((j) => j.stage === 'In Progress' || j.stage === 'Finishing & QC').length}</div>
          <div className="kpi-foot">Being worked on right now</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"> <span className="kpi-label">Released</span> <Check size={14} style={{ color: 'var(--purple)' }} /></div>
          <div className="kpi-value">{state.jobs.filter((j) => j.stage === 'Released').length}</div>
          <div className="kpi-foot">Archived with documents and photos</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="search-input-wrap" style={{ flex: '1 1 280px' }}>
            <Search size={14} />
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search job order code, plate, customer or concern…"
              aria-label="Search job orders"
            />
          </div>
          <select className="select" style={{ width: 170 }} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} aria-label="Filter stage">
            <option value="All">All stages</option>
            <option value="Active">Active only</option>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="t-xs dim mono">{rows.length} jobs</span>
        </div>
        <div className="panel-body" style={{ padding: '9px 16px', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className={`chip${service === 'All' ? ' active' : ''}`} onClick={() => setService('All')}>All services</button>
          {SERVICES.map((s) => (
            <button key={s} className={`chip${service === s ? ' active' : ''}`} onClick={() => setService(s)}>{s}</button>
          ))}
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 148 }}>Job order</th>
                <th>Vehicle</th>
                <th>Concern</th>
                <th>Service</th>
                <th>Stage</th>
                <th>Technician</th>
                <th className="right">Value</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => {
                const v = vehicleOf(j.vehicleId);
                const c = customerOf(j.customerId);
                if (!v) return null;
                return (
                  <tr key={j.id} onClick={() => navigate(`/vehicles/${j.vehicleId}?tab=job`)}>
                    <td>
                      <div className="cell-title mono" style={{ fontSize: 12 }}>{j.code}</div>
                      <div className="cell-sub">{fmtDate(j.receivedAt)}</div>
                    </td>
                    <td>
                      <div className="cell-main">
                        <span className="veh-thumb sm">
                          <CarArt body={v.bodyType} variant={j.code.charCodeAt(j.code.length - 1) % 5} />
                        </span>
                        <div>
                          <Plate value={v.plate} size="sm" />
                          <div className="cell-sub" style={{ marginTop: 3 }}>{v.make} {v.model}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: 250 }}>
                        <div className="cell-title" style={{ fontSize: 12, fontWeight: 500 }}>{j.concern.slice(0, 74)}{j.concern.length > 74 ? '…' : ''}</div>
                        <div className="cell-sub">{c?.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="row wrap" style={{ gap: 4 }}>
                        {j.serviceTypes.map((s) => <ServiceTag key={s} service={s} />)}
                      </div>
                    </td>
                    <td>
                      <div className="stack tight">
                        <StagePill stage={j.stage} short />
                        <span className="t-xs dim">{statusOf(j.stage)}</span>
                      </div>
                    </td>
                    <td className="t-sm muted nowrap">{j.technician}</td>
                    <td className="right mono t-sm">{money(jobTotals(j).total)}</td>
                    <td className="right"><ArrowRight size={14} style={{ color: '#5d686f' }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <EmptyState
            icon={<ClipboardList size={20} />}
            title="No job orders match"
            text="Try another plate, or clear the stage and service filters."
            action={<button className="btn btn-outline btn-sm" onClick={() => { setQ(''); setStageFilter('All'); setService('All'); }}>Clear filters</button>}
          />
        )}
        <div className="panel-foot">
          <span className="t-xs dim">Job orders generate the printable authorization with mechanic and owner signatures.</span>
          <span className="spacer" />
          <span className="mono t-xs">{rows.length} shown</span>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Open a job order"
        subtitle="Walk-in or booked — the job order is the shop's authorization to work."
        size="wide"
        icon={<ClipboardList size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}><Check size={14} /> Open job order</button>
          </>
        }
      >
        <div className="form-grid">
          <Field label="Vehicle / plate" required className="span-2">
            <select
              className="select"
              value={form.vehicleId}
              onChange={(e) => {
                const v = vehicleOf(e.target.value);
                setForm({ ...form, vehicleId: e.target.value, odo: v ? String(v.mileage) : form.odo });
                setError('');
              }}
            >
              <option value="">— Select a vehicle on file —</option>
              {state.vehicles.map((v) => {
                const c = customerOf(v.customerId);
                return (
                  <option key={v.id} value={v.id}>
                    {v.plate} · {v.make} {v.model} · {c?.name}
                  </option>
                );
              })}
            </select>
          </Field>

          <div className="span-2">
            <span className="label">Service line <i className="req">*</i></span>
            <div className="row wrap" style={{ gap: 7, marginTop: 2 }}>
              {SERVICES.map((s) => {
                const on = form.services.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className={`chip${on ? ' active' : ''}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        services: on ? form.services.filter((x) => x !== s) : [...form.services, s],
                      })
                    }
                  >
                    {on && <Check size={11} />} {s}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Reported concern" required className="span-2" hint="Record the customer's own description. Do not promise a fixed price before inspection.">
            <textarea
              className="textarea"
              value={form.concern}
              onChange={(e) => { setForm({ ...form, concern: e.target.value }); setError(''); }}
              placeholder="e.g. Front-left collision, bumper cracked; paint mismatch on the hood."
            />
          </Field>

          <Field label="Assigned technician">
            <select className="select" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })}>
              {TECHNICIANS.map((t) => <option key={t.name} value={t.name}>{t.name} — {t.role}</option>)}
            </select>
          </Field>
          <Field label="Target release date">
            <input className="input" type="date" value={form.promised} onChange={(e) => setForm({ ...form, promised: e.target.value })} />
          </Field>
          <Field label="Odometer in (km)">
            <input className="input mono" type="number" value={form.odo} onChange={(e) => setForm({ ...form, odo: e.target.value })} placeholder="48210" />
          </Field>
          <Field label="Initial notes">
            <input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Customer approval / parts notes" />
          </Field>

          <div className="span-2 notice">
            <Car size={13} />
            <span className="t-xs">
              Pre-inspection photos should be captured before the unit enters the bay. You can add them from the vehicle
              record immediately after opening the job order.
            </span>
          </div>

          {error && (
            <div className="span-2 notice amber" role="alert">
              <X size={13} />
              <span className="t-xs">{error}</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
