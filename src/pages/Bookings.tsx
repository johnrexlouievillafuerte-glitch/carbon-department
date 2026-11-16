import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Plus,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import { bookingConflict, SLOT_LABELS } from '../lib/store';
import type { Booking, BookingStatus, ServiceType } from '../lib/types';
import { SERVICES } from '../lib/types';
import { fmtDate, fmtDateShort, isoDay, prettyDay, startOfWeek, addDays } from '../lib/utils';
import { EmptyState, Field, Plate, ServiceTag } from '../components/ui';
import { Modal } from '../components/Modal';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const STATUS_PILL: Record<BookingStatus, string> = {
  Pending: 'pill-amber',
  Confirmed: 'pill-teal',
  Completed: 'pill-gray',
  Cancelled: 'pill-red',
};

export function Bookings() {
  const { state, addBooking, updateBooking, deleteBooking, toast } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const today = isoDay(new Date());

  const weekStart = useMemo(() => startOfWeek(addDays(new Date(), weekOffset * 7)), [weekOffset]);
  const days = useMemo(() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const dayKeys = days.map((d) => isoDay(d));

  const emptyForm = {
    name: '',
    phone: '',
    plate: '',
    vehicle: '',
    service: 'Mechanical' as ServiceType,
    concern: '',
    date: today,
    time: '09:00',
    walkIn: false,
    note: '',
  };
  const [form, setForm] = useState(emptyForm);

  const weekBookings = state.bookings.filter((b) => dayKeys.includes(b.date));
  const todayBookings = state.bookings.filter((b) => b.date === today && b.status !== 'Cancelled');
  const pending = state.bookings.filter((b) => b.status === 'Pending');
  const detail = state.bookings.find((b) => b.id === detailId);

  const openNew = (date?: string, time?: string) => {
    setEditId(null);
    setForm({ ...emptyForm, date: date ?? today, time: time ?? '09:00' });
    setError('');
    setFormOpen(true);
  };

  const openEdit = (b: Booking) => {
    setDetailId(null);
    setEditId(b.id);
    setForm({
      name: b.name,
      phone: b.phone,
      plate: b.plate,
      vehicle: b.vehicle,
      service: b.service,
      concern: b.concern,
      date: b.date,
      time: b.time,
      walkIn: b.walkIn,
      note: b.note ?? '',
    });
    setError('');
    setFormOpen(true);
  };

  const chooseVehicle = (plate: string) => {
    const v = state.vehicles.find((x) => x.plate.toUpperCase() === plate.toUpperCase());
    if (!v) {
      setForm((f) => ({ ...f, plate }));
      return;
    }
    const c = state.customers.find((x) => x.id === v.customerId);
    setForm((f) => ({
      ...f,
      plate: v.plate,
      vehicle: `${v.make} ${v.model}`,
      name: c?.name ?? f.name,
      phone: c?.phone ?? f.phone,
    }));
  };

  const save = () => {
    if (!form.name.trim() || !form.plate.trim()) {
      setError('Customer name and plate number are required.');
      return;
    }
    if (!form.date || !form.time) {
      setError('Choose a date and time slot.');
      return;
    }
    const clash = bookingConflict(state.bookings, form.date, form.time, editId ?? undefined);
    if (clash) {
      setError(`That slot is already taken by ${clash.name} (${clash.plate}) at ${SLOT_LABELS[form.time]}. Choose another time.`);
      return;
    }
    const customer = state.vehicles.find((v) => v.plate === form.plate)?.customerId;
    if (editId) {
      updateBooking(editId, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        plate: form.plate.trim().toUpperCase(),
        vehicle: form.vehicle.trim(),
        service: form.service,
        concern: form.concern.trim(),
        date: form.date,
        time: form.time,
        walkIn: form.walkIn,
        note: form.note.trim(),
        customerId: customer,
      });
      toast('Booking updated', `${form.plate.toUpperCase()} · ${SLOT_LABELS[form.time]}`);
    } else {
      addBooking({
        name: form.name.trim(),
        phone: form.phone.trim(),
        plate: form.plate.trim().toUpperCase(),
        vehicle: form.vehicle.trim(),
        service: form.service,
        concern: form.concern.trim(),
        date: form.date,
        time: form.time,
        walkIn: form.walkIn,
        note: form.note.trim(),
        customerId: customer,
        status: form.walkIn ? 'Confirmed' : 'Pending',
      });
      toast('Booking logged', `${form.plate.toUpperCase()} · ${prettyDay(form.date)} ${SLOT_LABELS[form.time]}`);
    }
    setFormOpen(false);
    setError('');
  };

  const setStatus = (b: Booking, status: BookingStatus) => {
    updateBooking(b.id, { status });
    toast(`Booking ${status.toLowerCase()}`, `${b.name} · ${b.plate}`, status === 'Cancelled' ? 'warn' : 'ok');
    setDetailId(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Shop <span className="accent">bookings</span>
          </h1>
          <p className="page-sub">
            A supporting schedule for customers with time constraints — walk-ins are still accepted and logged as job
            orders.
          </p>
        </div>
        <div className="page-actions">
          <div className="row" style={{ gap: 4 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
              <ChevronLeft size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset(0)}>This week</button>
            <button className="btn btn-outline btn-sm" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
              <ChevronRight size={14} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => openNew()}>
            <Plus size={14} /> New booking
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Today's appointments</span><CalendarDays size={14} style={{ color: 'var(--amber)' }} /></div>
          <div className="kpi-value">{todayBookings.length}</div>
          <div className="kpi-foot">{todayBookings.filter((b) => b.status === 'Confirmed').length} confirmed</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">This week</span><CalendarDays size={14} style={{ color: 'var(--blue)' }} /></div>
          <div className="kpi-value">{weekBookings.filter((b) => b.status !== 'Cancelled').length}</div>
          <div className="kpi-foot">Mon–Sat shop calendar</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Pending confirmation</span><Clock3 size={14} style={{ color: 'var(--amber-2)' }} /></div>
          <div className="kpi-value">{pending.length}</div>
          <div className="kpi-foot">Call or message before the slot</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Bay capacity</span><Check size={14} style={{ color: 'var(--teal)' }} /></div>
          <div className="kpi-value">6</div>
          <div className="kpi-foot">Two shops · mechanical &amp; body</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <CalendarDays size={13} /> {fmtDateShort(weekStart.toISOString())} – {fmtDate(days[5].toISOString())}
          </span>
          <span className="spacer" />
          <span className="row" style={{ gap: 10 }}>
            {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as BookingStatus[]).map((s) => (
              <span key={s} className="row" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: s === 'Confirmed' ? 'var(--teal)' : s === 'Pending' ? 'var(--amber-2)' : s === 'Completed' ? '#7c8a94' : 'var(--red)',
                  }}
                />
                <span className="t-xs dim">{s}</span>
              </span>
            ))}
          </span>
        </div>

        <div className="cal">
          <div className="cal-head">
            <div>TIME</div>
            {days.map((d) => {
              const key = isoDay(d);
              return (
                <div key={key} className={key === today ? 'today' : ''}>
                  {d.toLocaleDateString('en-US', { weekday: 'short' })} <span className="mono" style={{ fontSize: 12, marginLeft: 3 }}>{d.getDate()}</span>
                </div>
              );
            })}
          </div>
          <div className="cal-body">
            {HOURS.map((h) => (
              <div key={h} style={{ display: 'contents' }}>
                <div className="cal-time">{SLOT_LABELS[h].replace(' ', '')}</div>
                {dayKeys.map((dk) => {
                  const items = state.bookings.filter((b) => b.date === dk && b.time === h);
                  return (
                    <div
                      key={dk + h}
                      className="cal-cell clickable"
                      onClick={() => {
                        if (items.length === 0) openNew(dk, h);
                      }}
                      title={items.length === 0 ? 'Add a booking at this slot' : undefined}
                    >
                      {items.map((b) => (
                        <button
                          key={b.id}
                          className={`slot ${b.status.toLowerCase()}`}
                          style={{ width: '100%', border: 'none', textAlign: 'left', borderLeft: '2px solid' }}
                          onClick={(e) => { e.stopPropagation(); setDetailId(b.id); }}
                          title={`${b.name} · ${b.plate} · ${b.status}`}
                        >
                          <b>{b.plate}</b> · {b.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="panel-foot">
          <Info size={12} style={{ color: 'var(--blue)' }} />
          <span className="t-xs">
            Slots are one hour. Booking is deliberately lightweight — the job order, not the appointment, remains the
            system of record.
          </span>
        </div>
      </div>

      <div className="split-main" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title"><CalendarDays size={13} /> Week schedule</span>
            <span className="spacer" />
            <span className="t-xs dim">{weekBookings.length} bookings</span>
          </div>
          <div className="panel-body" style={{ padding: '6px 16px 10px' }}>
            {weekBookings.length === 0 && <EmptyState title="No bookings this week" text="Walk-ins still get logged, but the schedule is clear." />}
            {[...weekBookings]
              .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
              .map((b) => (
                <div className="booking-row" key={b.id}>
                  <div style={{ width: 62, flex: '0 0 62px' }}>
                    <div className="t-xs" style={{ color: b.date === today ? 'var(--amber)' : 'var(--text-2)', fontWeight: 600 }}>
                      {prettyDay(b.date).split(',')[0]}
                    </div>
                    <div className="t-xs dim mono">{SLOT_LABELS[b.time]}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-sm" style={{ fontWeight: 600 }}>
                      {b.name} {b.walkIn && <span className="pill pill-gray" style={{ height: 17, fontSize: 8, marginLeft: 4 }}>walk-in</span>}
                    </div>
                    <div className="t-xs dim">{b.plate} · {b.vehicle || 'Unit not specified'}</div>
                  </div>
                  <ServiceTag service={b.service} />
                  <span className={`pill ${STATUS_PILL[b.status]}`}>{b.status}</span>
                  <button className="icon-btn" onClick={() => setDetailId(b.id)} aria-label="Open booking">
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="stack loose">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title"><Clock3 size={13} /> Pending</span>
              <span className="spacer" />
              <span className="pill pill-amber">{pending.length}</span>
            </div>
            <div className="panel-body" style={{ padding: '8px 16px' }}>
              {pending.length === 0 && <span className="t-xs dim">Nothing waiting for confirmation.</span>}
              {pending.slice(0, 4).map((b) => (
                <div className="between" key={b.id} style={{ padding: '7px 0', borderBottom: '1px solid #171c1f' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="t-sm truncate">{b.name}</div>
                    <div className="t-xs dim">{fmtDate(b.date + 'T00:00:00')} · {SLOT_LABELS[b.time]}</div>
                  </div>
                  <button className="btn btn-teal btn-sm" onClick={() => setStatus(b, 'Confirmed')}>
                    <Check size={12} /> Confirm
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="notice">
            <Info size={14} />
            <span className="t-xs">
              The client was clear: booking alone is easy to copy with Messenger or Google Sheets. Its job here is to
              organise workload around walk-ins, not replace the record system.
            </span>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title"><UserRound size={13} /> Today's arrivals</span>
            </div>
            <div className="panel-body" style={{ padding: '8px 16px' }}>
              {todayBookings.length === 0 && <span className="t-xs dim">No scheduled arrivals — walk-in traffic only.</span>}
              {todayBookings.map((b) => (
                <div className="between" key={b.id} style={{ padding: '6px 0' }}>
                  <div className="row">
                    <Plate value={b.plate} size="sm" />
                    <div>
                      <div className="t-sm">{b.name}</div>
                      <div className="t-xs dim">{SLOT_LABELS[b.time]} · {b.service}</div>
                    </div>
                  </div>
                  <span className={`pill ${STATUS_PILL[b.status]}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* form modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editId ? 'Edit booking' : 'New booking'}
        subtitle="One-hour slots, Monday to Saturday. Confirm by phone or Messenger."
        size="wide"
        icon={<CalendarDays size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}><Check size={14} /> {editId ? 'Save changes' : 'Log booking'}</button>
          </>
        }
      >
        <div className="form-grid">
          <Field label="Customer name" required>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Miguel Santos" />
          </Field>
          <Field label="Mobile number">
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0917 000 0000" />
          </Field>
          <Field label="Plate number" required hint="Pick a plate on file to auto-fill the customer.">
            <input
              className="input mono"
              list="booking-plates"
              value={form.plate}
              onChange={(e) => chooseVehicle(e.target.value.toUpperCase())}
              placeholder="NCR 4821"
            />
            <datalist id="booking-plates">
              {state.vehicles.map((v) => (
                <option key={v.id} value={v.plate}>
                  {v.make} {v.model}
                </option>
              ))}
            </datalist>
          </Field>
          <Field label="Vehicle">
            <input className="input" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} placeholder="Toyota Fortuner" />
          </Field>
          <Field label="Service">
            <select className="select" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value as ServiceType })}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Customer constraint">
            <div className="row wrap" style={{ gap: 7, marginTop: 3 }}>
              <button type="button" className={`chip${form.walkIn ? ' active' : ''}`} onClick={() => setForm({ ...form, walkIn: !form.walkIn })}>
                {form.walkIn ? 'Walk-in / same-day' : 'Scheduled'}
              </button>
              <span className="t-xs dim">Walk-ins are confirmed immediately.</span>
            </div>
          </Field>
          <Field label="Date" required>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Time slot" required>
            <select className="select" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
              {HOURS.map((h) => <option key={h} value={h}>{SLOT_LABELS[h]}</option>)}
            </select>
          </Field>
          <Field label="Concern / notes" className="span-2">
            <textarea
              className="textarea"
              value={form.concern}
              onChange={(e) => setForm({ ...form, concern: e.target.value })}
              placeholder="Aircon weak at idle; customer needs the unit back by Saturday."
            />
          </Field>
          <Field label="Internal note" className="span-2">
            <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Time-constrained — weekend trip" />
          </Field>
          {error && (
            <div className="span-2 notice amber" role="alert">
              <X size={13} />
              <span className="t-xs">{error}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetailId(null)}
        title={detail ? detail.name : 'Booking'}
        subtitle={detail ? `${prettyDay(detail.date)} · ${SLOT_LABELS[detail.time]}` : ''}
        icon={<CalendarDays size={16} />}
        footer={
          detail && (
            <div className="row wrap" style={{ width: '100%', gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setDetailId(null)}>Close</button>
              <span className="spacer" />
              <button className="btn btn-danger btn-sm" onClick={() => { deleteBooking(detail.id); setDetailId(null); toast('Booking removed', detail.name, 'warn'); }}>
                <Trash2 size={13} /> Delete
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(detail)}>Edit</button>
              {detail.status !== 'Cancelled' && detail.status !== 'Completed' && (
                <button className="btn btn-sm" onClick={() => setStatus(detail, 'Cancelled')}>Cancel slot</button>
              )}
              {detail.status === 'Pending' && (
                <button className="btn btn-teal btn-sm" onClick={() => setStatus(detail, 'Confirmed')}><Check size={13} /> Confirm</button>
              )}
              {detail.status === 'Confirmed' && (
                <button className="btn btn-primary btn-sm" onClick={() => setStatus(detail, 'Completed')}><Check size={13} /> Mark arrived</button>
              )}
            </div>
          )
        }
      >
        {detail && (
          <div>
            <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
              <Plate value={detail.plate} />
              <span className={`pill ${STATUS_PILL[detail.status]}`}>{detail.status}</span>
              {detail.walkIn && <span className="pill pill-gray">walk-in</span>}
              <ServiceTag service={detail.service} />
            </div>
            <div className="kv">
              <dt>Vehicle</dt><dd>{detail.vehicle || 'Not specified'}</dd>
              <dt>Contact</dt><dd>{detail.phone || '—'}</dd>
              <dt>Date</dt><dd>{fmtDate(detail.date + 'T00:00:00')} · {SLOT_LABELS[detail.time]}</dd>
              <dt>Concern</dt><dd>{detail.concern || '—'}</dd>
              <dt>Note</dt><dd>{detail.note || '—'}</dd>
              <dt>Logged</dt><dd>{fmtDate(detail.createdAt)}</dd>
            </div>
            <div className="notice" style={{ marginTop: 14 }}>
              <Info size={13} />
              <span className="t-xs">
                A booking reserves a slot, not a bay. Staff still open a job order when the unit arrives and complete
                pre-inspection photos before work.
              </span>
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/job-orders?new=1')}>
              <Plus size={12} /> Open job order for this unit
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
