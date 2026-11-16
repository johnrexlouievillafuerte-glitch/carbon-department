import { useMemo, useState } from 'react';
import { Car, ChevronRight, Filter, Plus, Search, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { BodyType, CustomerKind, JobOrder, ServiceType } from '../lib/types';
import { SERVICES } from '../lib/types';
import { fmtDate, normalizePlate, statusOf } from '../lib/utils';
import { CarArt } from '../components/graphics';
import { EmptyState, Field, Plate, ServiceTag, StagePill } from '../components/ui';
import { Modal } from '../components/Modal';

const BODY_TYPES: BodyType[] = ['Sedan', 'SUV', 'Pickup', 'Van', 'Hatchback', 'MPV', 'Coupe'];
const FUELS = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];

const KIND_STYLE: Record<CustomerKind, { background: string; color: string; borderColor: string }> = {
  Individual: { background: 'rgba(255,255,255,.05)', color: '#a4aeb5', borderColor: '#2b3237' },
  Fleet: { background: 'rgba(88,166,255,.1)', color: '#7cb9ff', borderColor: 'rgba(88,166,255,.28)' },
  Insurance: { background: 'rgba(176,124,255,.1)', color: '#c9a6ff', borderColor: 'rgba(176,124,255,.28)' },
};

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  kind: 'Individual' as CustomerKind,
  company: '',
  plate: '',
  make: '',
  model: '',
  year: String(new Date().getFullYear()),
  color: '',
  vin: '',
  chassis: '',
  engine: '',
  fuel: 'Gasoline',
  bodyType: 'Sedan' as BodyType,
  mileage: '',
};

export function Vehicles({ params }: { params: URLSearchParams }) {
  const { state, session, addCustomer, addVehicle, toast } = useStore();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [service, setService] = useState('All');
  const [status, setStatus] = useState('All');
  const [open, setOpen] = useState(params.get('new') === '1');
  const [form, setForm] = useState(emptyForm);
  const [existingCustomer, setExistingCustomer] = useState('');
  const [error, setError] = useState('');

  const canEdit = session?.role !== 'mechanic';

  const latestJob = (vehicleId: string): JobOrder | undefined =>
    state.jobs.filter((j) => j.vehicleId === vehicleId).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];

  const rows = useMemo(() => {
    const text = q.trim();
    const norm = normalizePlate(text);
    return state.vehicles
      .map((v) => {
        const customer = state.customers.find((c) => c.id === v.customerId);
        return { v, customer, job: latestJob(v.id) };
      })
      .filter(({ v, customer, job }) => {
        const match =
          !text ||
          normalizePlate(v.plate).includes(norm) ||
          `${v.make} ${v.model}`.toLowerCase().includes(text.toLowerCase()) ||
          v.vin.toLowerCase().includes(text.toLowerCase()) ||
          v.chassis.toLowerCase().includes(text.toLowerCase()) ||
          (customer?.name ?? '').toLowerCase().includes(text.toLowerCase()) ||
          (customer?.company ?? '').toLowerCase().includes(text.toLowerCase());
        const jobStatus = job ? statusOf(job.stage) : 'No job';
        const statusOk =
          status === 'All' ||
          (status === 'No job' ? !job : job && (status === 'In shop' ? job.stage !== 'Released' : jobStatus === status));
        const serviceOk = service === 'All' || (job ? job.serviceTypes.includes(service as ServiceType) : false);
        return match && statusOk && serviceOk;
      })
      .sort((a, b) => {
        if (!a.job && b.job) return -1;
        if (a.job && !b.job) return 1;
        return (b.job?.receivedAt ?? b.v.createdAt).localeCompare(a.job?.receivedAt ?? a.v.createdAt);
      });
  }, [state.vehicles, state.customers, state.jobs, q, service, status]);

  const submit = () => {
    if (!form.plate.trim() || !form.make.trim() || !form.model.trim()) {
      setError('Plate number, make and model are required.');
      return;
    }
    if (!existingCustomer && (!form.name.trim() || !form.phone.trim())) {
      setError('Enter the customer name and mobile number, or link an existing customer.');
      return;
    }
    let customerId = existingCustomer;
    if (!customerId) {
      const c = addCustomer({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        kind: form.kind,
        company: form.kind === 'Individual' ? undefined : form.company.trim() || undefined,
        notes: '',
      });
      customerId = c.id;
    }
    const vehicle = addVehicle({
      customerId,
      plate: form.plate.trim().toUpperCase(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      color: form.color.trim() || 'Unspecified',
      vin: form.vin.trim().toUpperCase(),
      chassis: form.chassis.trim().toUpperCase(),
      engine: form.engine.trim() || '—',
      fuel: form.fuel,
      bodyType: form.bodyType,
      mileage: Number(form.mileage) || 0,
    });
    toast('Vehicle record created', `${vehicle.make} ${vehicle.model} · ${vehicle.plate}`);
    setOpen(false);
    setForm(emptyForm);
    setExistingCustomer('');
    setError('');
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Vehicle <span className="accent">records</span>
          </h1>
          <p className="page-sub">
            One record per plate: customer details, unit identifiers, service history and every attached document.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => navigate('/documents')}>
            <ShieldCheck size={14} /> Document library
          </button>
          {canEdit && (
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Plus size={14} /> Add vehicle
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div style={{ flex: '1 1 320px' }}>
            <div className="plate-search">
              <Search size={17} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search plate number, customer, VIN, or model…"
                aria-label="Search vehicle records"
              />
              {q && (
                <button className="icon-btn" style={{ position: 'absolute', right: 8, width: 28, height: 28 }} onClick={() => setQ('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
              <span className="scan" />
            </div>
          </div>
          <select className="select" style={{ width: 150 }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="All">All statuses</option>
            <option value="In shop">In shop</option>
            <option value="Waiting">Waiting approval</option>
            <option value="Ready">Ready for release</option>
            <option value="Released">Released</option>
            <option value="No job">No job order</option>
          </select>
          <span className="t-xs dim mono" style={{ paddingLeft: 4 }}>{rows.length} records</span>
        </div>

        <div className="panel-body" style={{ padding: '10px 16px', display: 'flex', gap: 7, flexWrap: 'wrap', borderBottom: '1px solid var(--line-soft)' }}>
          <span className="t-xs dim" style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 4 }}>
            <Filter size={12} /> Service
          </span>
          <button className={`chip${service === 'All' ? ' active' : ''}`} onClick={() => setService('All')}>
            All
          </button>
          {SERVICES.map((s) => (
            <button key={s} className={`chip${service === s ? ' active' : ''}`} onClick={() => setService(s)}>
              {s}
            </button>
          ))}
          {(q || service !== 'All' || status !== 'All') && (
            <button
              className="btn-link"
              style={{ marginLeft: 'auto', alignSelf: 'center' }}
              onClick={() => {
                setQ('');
                setService('All');
                setStatus('All');
              }}
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 190 }}>Plate</th>
                <th>Vehicle</th>
                <th>Customer</th>
                <th>Latest service</th>
                <th>Current stage</th>
                <th>Last visit</th>
                <th className="right" aria-label="Open" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ v, customer, job }) => (
                <tr key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)}>
                  <td>
                    <div className="cell-main">
                      <span className="veh-thumb">
                        <CarArt body={v.bodyType} variant={v.id.charCodeAt(v.id.length - 1) % 5} />
                      </span>
                      <div>
                        <Plate value={v.plate} />
                        <div className="cell-sub mono" style={{ fontSize: 10, marginTop: 4 }}>
                          {v.vin || 'No VIN recorded'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-title">
                      {v.make} {v.model}
                    </div>
                    <div className="cell-sub">
                      {v.year} · {v.color} · {v.bodyType}
                    </div>
                  </td>
                  <td>
                    <div className="cell-title" style={{ fontSize: 12.5 }}>
                      {customer?.name ?? '—'}
                    </div>
                    <div className="cell-sub">
                      <span className="pill" style={{ ...KIND_STYLE[customer?.kind ?? 'Individual'], height: 18, fontSize: 9, padding: '0 6px' }}>
                        {customer?.kind ?? 'Individual'}
                      </span>
                      <span style={{ marginLeft: 6 }}>{customer?.phone}</span>
                    </div>
                  </td>
                  <td>
                    {job ? (
                      <div className="row wrap" style={{ gap: 4 }}>
                        {job.serviceTypes.map((s) => (
                          <ServiceTag key={s} service={s} />
                        ))}
                      </div>
                    ) : (
                      <span className="t-xs dim">No job order yet</span>
                    )}
                  </td>
                  <td>{job ? <StagePill stage={job.stage} short /> : <span className="t-xs dim">—</span>}</td>
                  <td className="t-sm muted nowrap">{fmtDate(job?.receivedAt ?? v.createdAt)}</td>
                  <td className="right">
                    <ChevronRight size={15} style={{ color: '#5d686f' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <EmptyState
            icon={<Car size={20} />}
            title="No matching records"
            text="Plate-number search is exact and forgiving — try the last four digits, or clear the filters."
            action={
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setQ('');
                  setService('All');
                  setStatus('All');
                }}
              >
                Clear search
              </button>
            }
          />
        )}

        <div className="panel-foot">
          <ShieldCheck size={12} style={{ color: 'var(--teal)' }} />
          <span>Records retained permanently. Plate numbers are unique and used as the primary lookup key.</span>
          <span className="spacer" />
          <span className="mono t-xs">{state.vehicles.length} total</span>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add customer & vehicle record"
        subtitle="Plate number is the primary key. Everything else supports retrieval and liability protection."
        size="wide"
        icon={<Plus size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>
              <Plus size={14} /> Save record
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="span-2">
            <div className="eyebrow" style={{ marginBottom: 8 }}>Customer details</div>
            <Field label="Link an existing customer" hint="Leave as “new customer” to create a record with the vehicle.">
              <select className="select" value={existingCustomer} onChange={(e) => setExistingCustomer(e.target.value)}>
                <option value="">— New customer —</option>
                {state.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {!existingCustomer && (
            <>
              <Field label="Customer name" required>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan Dela Cruz" />
              </Field>
              <Field label="Mobile number" required>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0917 000 0000" />
              </Field>
              <Field label="Email">
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="customer@email.com" />
              </Field>
              <Field label="Address">
                <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, barangay, city" />
              </Field>
              <Field label="Customer type">
                <select className="select" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as CustomerKind })}>
                  <option>Individual</option>
                  <option>Fleet</option>
                  <option>Insurance</option>
                </select>
              </Field>
              {form.kind !== 'Individual' && (
                <Field label="Company / insurer">
                  <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
                </Field>
              )}
            </>
          )}

          <div className="span-2" style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 14, marginTop: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Vehicle details</div>
          </div>

          <Field label="Plate number" required hint="Stored uppercase, used for every lookup.">
            <input
              className="input mono"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
              placeholder="NCR 4821"
            />
          </Field>
          <Field label="Make" required>
            <input className="input" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="Toyota" />
          </Field>
          <Field label="Model" required>
            <input className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Fortuner 2.8 V" />
          </Field>
          <Field label="Year">
            <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} min={1950} max={2030} />
          </Field>
          <Field label="Color">
            <input className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Pearl White" />
          </Field>
          <Field label="VIN">
            <input className="input mono" value={form.vin} maxLength={17} onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })} placeholder="MR0KA3CD4M0512874" />
          </Field>
          <Field label="Chassis number">
            <input className="input mono" value={form.chassis} onChange={(e) => setForm({ ...form, chassis: e.target.value.toUpperCase() })} placeholder="KA3CD4M0512874" />
          </Field>
          <Field label="Engine / motor">
            <input className="input" value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} placeholder="2.8L 1GD-FTV Diesel" />
          </Field>
          <Field label="Fuel">
            <select className="select" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })}>
              {FUELS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Body type">
            <select className="select" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value as BodyType })}>
              {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Odometer (km)">
            <input className="input" type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} placeholder="48210" />
          </Field>

          {error && (
            <div className="span-2 notice amber" role="alert">
              <X size={13} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
