import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Camera,
  Check,
  ClipboardList,
  Eye,
  FileText,
  FolderOpen,
  Gauge,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Printer,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { DocType, InspectionPhoto, JobOrder, ShopDoc, Stage, Zone } from '../lib/types';
import { DOC_TYPES, STAGES, STAGE_META } from '../lib/types';
import {
  canDelete,
  fmtDate,
  fmtDateTime,
  jobTotals,
  money,
} from '../lib/utils';
import { CarArt, DocThumb, InspectionPhoto as PhotoFrame } from '../components/graphics';
import { EmptyState, Field, Plate, ServiceTag, StagePill, StageTrack } from '../components/ui';
import { Modal } from '../components/Modal';
import { InspectionSheet, JobOrderSheet } from '../components/PrintSheets';

const ZONES: Zone[] = ['Front', 'Front-Left', 'Left', 'Rear', 'Right', 'Engine Bay', 'Interior', 'Odometer'];
type Tab = 'overview' | 'inspection' | 'job' | 'documents' | 'timeline';

const SEV_COLOR: Record<string, string> = { Minor: '#2fe3b0', Moderate: '#ffb020', Major: '#ff5c5c' };

export function VehicleRecord({ id, params }: { id: string; params: URLSearchParams }) {
  const { state, session, toast, updateJob, deleteJob, deleteVehicle, setStage, addLineItem, removeLineItem, addDocument, deleteDocument, addInspectionPhotos, addDamage, toggleDamage } = useStore();

  const initialTab = (params.get('tab') as Tab) || 'overview';
  const [tab, setTab] = useState<Tab>(['overview', 'inspection', 'job', 'documents', 'timeline'].includes(initialTab) ? initialTab : 'overview');
  const [selectedJobId, setSelectedJobId] = useState('');

  const [printView, setPrintView] = useState<'job' | 'inspection' | null>(null);
  const [stageOpen, setStageOpen] = useState(false);
  const [stageDraft, setStageDraft] = useState<Stage>('Checked-in');
  const [stageNote, setStageNote] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editPromised, setEditPromised] = useState('');
  const [itemOpen, setItemOpen] = useState(false);
  const [itemDraft, setItemDraft] = useState({ kind: 'Labor', desc: '', qty: '1', unit: '' });
  const [photoOpen, setPhotoOpen] = useState(false);
  const [zones, setZones] = useState<Zone[]>(['Front', 'Left', 'Rear', 'Odometer']);
  const [docOpen, setDocOpen] = useState(false);
  const [docType, setDocType] = useState<DocType>('Job Order');
  const [docName, setDocName] = useState('');
  const [photoView, setPhotoView] = useState<InspectionPhoto | null>(null);
  const [docView, setDocView] = useState<ShopDoc | null>(null);
  const [damageOpen, setDamageOpen] = useState(false);
  const [damageDraft, setDamageDraft] = useState({ area: '', severity: 'Moderate', note: '' });
  const [confirm, setConfirm] = useState<'vehicle' | 'job' | null>(null);

  const vehicle = state.vehicles.find((v) => v.id === id);
  const customer = state.customers.find((c) => c.id === vehicle?.customerId);
  const jobs = state.jobs
    .filter((j) => j.vehicleId === id)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const job: JobOrder | undefined = jobs.find((j) => j.id === selectedJobId) ?? jobs.find((j) => j.stage !== 'Released') ?? jobs[0];
  const editable = canDelete(session?.role);

  if (!vehicle) {
    return (
      <EmptyState
        icon={<CarArtPlaceholder />}
        title="Vehicle record not found"
        text="This record may have been deleted, or the link is out of date."
        action={<button className="btn btn-outline" onClick={() => navigate('/vehicles')}>Back to vehicle records</button>}
      />
    );
  }

  const totals = job ? jobTotals(job) : { subtotal: 0, discount: 0, total: 0, labor: 0, parts: 0 };
  const photoCount = job?.photos.length ?? 0;
  const damageCount = job?.damages.length ?? 0;
  const docCount = job?.docs.length ?? 0;
  const openJobs = jobs.filter((j) => j.stage !== 'Released').length;
  const spent = jobs.reduce((s, j) => s + (j.stage === 'Released' ? jobTotals(j).total : 0), 0);

  const openStage = () => {
    if (!job) return;
    setStageDraft(job.stage);
    setStageNote('');
    setStageOpen(true);
  };
  const openEdit = () => {
    if (!job) return;
    setEditNotes(job.notes);
    setEditWarranty(job.warranty);
    setEditPromised(job.promisedAt ? job.promisedAt.slice(0, 10) : '');
    setEditOpen(true);
  };
  const saveStage = () => {
    if (!job) return;
    if (stageDraft === job.stage && !stageNote.trim()) {
      toast('Choose a new stage or add a note', undefined, 'warn');
      return;
    }
    setStage(job.id, stageDraft, stageNote);
    toast('Repair progress updated', `${job.code} moved to ${stageDraft}`, 'ok');
    setStageOpen(false);
  };
  const saveEdit = () => {
    if (!job) return;
    updateJob(job.id, {
      notes: editNotes,
      warranty: editWarranty,
      promisedAt: editPromised ? new Date(`${editPromised}T17:00:00`).toISOString() : null,
    });
    toast('Job order details saved', job.code);
    setEditOpen(false);
  };
  const addItem = () => {
    if (!job) return;
    if (!itemDraft.desc.trim() || !Number(itemDraft.unit)) {
      toast('Enter a description and unit price', undefined, 'warn');
      return;
    }
    addLineItem(job.id, {
      kind: itemDraft.kind as 'Labor' | 'Part' | 'Materials',
      desc: itemDraft.desc.trim(),
      qty: Number(itemDraft.qty) || 1,
      unit: Number(itemDraft.unit) || 0,
    });
    toast('Line item added', itemDraft.desc.trim());
    setItemDraft({ kind: 'Labor', desc: '', qty: '1', unit: '' });
    setItemOpen(false);
  };
  const capture = () => {
    if (!job) return;
    if (zones.length === 0) {
      toast('Select at least one photo angle', undefined, 'warn');
      return;
    }
    addInspectionPhotos(job.id, zones);
    toast(`${zones.length} pre-inspection photos linked`, 'Timestamped and stored against this record.');
    setPhotoOpen(false);
    setTab('inspection');
  };
  const attachDoc = () => {
    if (!job) return;
    addDocument(job.id, docType, docName || undefined);
    toast('Document attached', `${docType} · ${job.code}`);
    setDocName('');
    setDocOpen(false);
  };
  const saveDamage = () => {
    if (!job) return;
    if (!damageDraft.area.trim() || !damageDraft.note.trim()) {
      toast('Describe the area and observation', undefined, 'warn');
      return;
    }
    addDamage(job.id, { area: damageDraft.area.trim(), severity: damageDraft.severity as 'Minor' | 'Moderate' | 'Major', note: damageDraft.note.trim() });
    toast('Damage item recorded', damageDraft.area.trim());
    setDamageDraft({ area: '', severity: 'Moderate', note: '' });
    setDamageOpen(false);
  };

  const tabs: Array<{ key: Tab; label: string; icon: typeof Camera; count?: number }> = [
    { key: 'overview', label: 'Overview', icon: FileText },
    { key: 'inspection', label: 'Pre-Inspection', icon: Camera, count: photoCount },
    { key: 'job', label: 'Job Order', icon: ClipboardList, count: job?.items.length ?? 0 },
    { key: 'documents', label: 'Documents', icon: FolderOpen, count: docCount },
    { key: 'timeline', label: 'Progress', icon: Wrench, count: job?.progress.length ?? 0 },
  ];

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vehicles')}>
          <ArrowLeft size={14} /> Vehicle records
        </button>
        <span className="dim t-xs">/</span>
        <span className="t-xs dim mono">{vehicle.plate}</span>
        <span className="spacer" />
        {jobs.length > 1 && job && (
          <label className="row" style={{ gap: 6 }}>
            <span className="t-xs dim">Job order</span>
            <select className="select" style={{ width: 220, height: 32 }} value={job.id} onChange={(e) => setSelectedJobId(e.target.value)}>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.code} · {j.stage}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="detail-hero">
        <div className="dh-row">
          <div style={{ width: 100, height: 66, flex: '0 0 100px', borderRadius: 10, overflow: 'hidden', border: '1px solid #2b3339', background: 'linear-gradient(150deg,#1a2024,#0d1012)' }}>
            <CarArt body={vehicle.bodyType} variant={vehicle.year % 5} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="row wrap" style={{ gap: 8 }}>
              <Plate value={vehicle.plate} size="lg" />
              {job ? <StagePill stage={job.stage} /> : <span className="pill pill-gray">No job order</span>}
              {openJobs > 1 && <span className="pill pill-amber">{openJobs} open jobs</span>}
            </div>
            <div className="dh-title" style={{ marginTop: 8 }}>
              {vehicle.make} {vehicle.model}
            </div>
            <div className="dh-sub">
              <span>{vehicle.year}</span>
              <span>·</span>
              <span>{vehicle.color}</span>
              <span>·</span>
              <span>{vehicle.bodyType}</span>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <UserRound size={11} /> {customer?.name ?? '—'}
              </span>
            </div>
          </div>
          <div className="dh-actions">
            {job ? (
              <>
                <button className="btn btn-outline btn-sm" onClick={() => setPrintView('job')}>
                  <Printer size={13} /> Job order
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setPrintView('inspection')}>
                  <Camera size={13} /> Inspection sheet
                </button>
                <button className="btn btn-primary btn-sm" onClick={openStage}>
                  <Wrench size={13} /> Update progress
                </button>
                {editable && (
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm('vehicle')} title="Delete vehicle record" aria-label="Delete vehicle record">
                    <Trash2 size={13} />
                  </button>
                )}
              </>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/job-orders?new=1&vehicle=${vehicle.id}`)}>
                <Plus size={13} /> Open job order
              </button>
            )}
          </div>
        </div>

        <div className="dh-stats">
          <div className="dh-stat">
            <span>Received</span>
            <b>{job ? fmtDate(job.receivedAt) : fmtDate(vehicle.createdAt)}</b>
          </div>
          <div className="dh-stat">
            <span>Target release</span>
            <b>{job?.promisedAt ? fmtDate(job.promisedAt) : '—'}</b>
          </div>
          <div className="dh-stat">
            <span>Technician</span>
            <b>{job?.technician ?? 'Unassigned'}</b>
          </div>
          <div className="dh-stat">
            <span>Odometer</span>
            <b className="mono">{vehicle.mileage.toLocaleString()} km</b>
          </div>
          <div className="dh-stat">
            <span>Open job value</span>
            <b className="mono">{job ? money(totals.total) : '—'}</b>
          </div>
          <div className="dh-stat">
            <span>Service history</span>
            <b>
              {jobs.length} job{jobs.length === 1 ? '' : 's'} · {money(spent)} released
            </b>
          </div>
          <div className="dh-stat">
            <span>Pre-inspection</span>
            <b style={{ color: photoCount > 0 ? 'var(--teal)' : 'var(--amber)' }}>
              {photoCount > 0 ? `${photoCount} photos · ${damageCount} noted` : 'Not captured'}
            </b>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="tabs" style={{ padding: '0 8px' }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
                <Icon size={13} />
                {t.label}
                {typeof t.count === 'number' && <span className="count">{t.count}</span>}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && (
          <div className="panel-body">
            <div className="split-main">
              <div className="stack loose">
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Reported concern</div>
                  <div className="t-sm" style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)' }}>
                    {job?.concern ?? 'No job order has been opened for this vehicle yet.'}
                  </div>
                  {job && (
                    <div className="row wrap" style={{ marginTop: 10 }}>
                      {job.serviceTypes.map((s) => (
                        <ServiceTag key={s} service={s} />
                      ))}
                      {job.claimNo && <span className="pill pill-purple">Claim {job.claimNo}</span>}
                    </div>
                  )}
                </div>

                {job && (
                  <div className="panel" style={{ background: '#0d1012' }}>
                    <div className="panel-head" style={{ minHeight: 44 }}>
                      <span className="panel-title">
                        <ClipboardList size={12} /> Repair notes
                      </span>
                      <span className="spacer" />
                      <button className="btn-link" onClick={openEdit}>
                        <Pencil size={11} /> Edit
                      </button>
                    </div>
                    <div className="panel-body" style={{ padding: 14 }}>
                      <p className="t-sm muted" style={{ lineHeight: 1.65 }}>{job.notes || 'No notes recorded yet.'}</p>
                      <div className="between" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1a1f23' }}>
                        <span className="t-xs dim">Warranty</span>
                        <span className="t-xs" style={{ color: 'var(--text-2)' }}>{job.warranty || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="between" style={{ marginBottom: 8 }}>
                    <div className="eyebrow">Service history</div>
                    <span className="t-xs dim">{jobs.length} job orders</span>
                  </div>
                  {jobs.length === 0 && <span className="t-sm dim">No visits recorded.</span>}
                  <div className="stack tight">
                    {jobs.map((j) => (
                      <button
                        key={j.id}
                        className="quick-result"
                        onClick={() => { setSelectedJobId(j.id); setTab('job'); }}
                        style={{ opacity: j.id === job?.id ? 1 : 0.88 }}
                      >
                        <ClipboardList size={14} style={{ color: STAGE_META[j.stage].color }} />
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <b className="t-sm mono">{j.code}</b>
                          <span className="t-xs dim" style={{ display: 'block' }}>
                            {fmtDate(j.receivedAt)} · {j.serviceTypes.join(', ')}
                          </span>
                        </span>
                        <span className="mono t-xs muted">{money(jobTotals(j).total)}</span>
                        <StagePill stage={j.stage} short />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stack loose">
                <div className="panel" style={{ background: '#0d1012' }}>
                  <div className="panel-head" style={{ minHeight: 44 }}>
                    <span className="panel-title">
                      <UserRound size={12} /> Customer
                    </span>
                    <span className="spacer" />
                    <span className="pill pill-gray">{customer?.kind ?? 'Individual'}</span>
                  </div>
                  <div className="panel-body" style={{ padding: '6px 14px 10px' }}>
                    <div className="t-sm" style={{ fontWeight: 600 }}>{customer?.name}</div>
                    {customer?.company && <div className="t-xs dim" style={{ marginTop: 2 }}>{customer.company}</div>}
                    <div className="info-row" style={{ marginTop: 8 }}>
                      <span className="ir-ico"><Phone size={12} /></span>
                      <div className="ir-main">
                        <span>Mobile</span>
                        <b>{customer?.phone || '—'}</b>
                      </div>
                    </div>
                    <div className="info-row">
                      <span className="ir-ico"><Mail size={12} /></span>
                      <div className="ir-main">
                        <span>Email</span>
                        <b>{customer?.email || '—'}</b>
                      </div>
                    </div>
                    <div className="info-row">
                      <span className="ir-ico"><MapPin size={12} /></span>
                      <div className="ir-main">
                        <span>Address</span>
                        <b>{customer?.address || '—'}</b>
                      </div>
                    </div>
                    {customer?.notes && <p className="t-xs dim" style={{ marginTop: 8, lineHeight: 1.6 }}>{customer.notes}</p>}
                  </div>
                </div>

                <div className="panel" style={{ background: '#0d1012' }}>
                  <div className="panel-head" style={{ minHeight: 44 }}>
                    <span className="panel-title">
                      <Gauge size={12} /> Identification
                    </span>
                  </div>
                  <div className="panel-body" style={{ padding: '10px 14px' }}>
                    <dl className="kv">
                      <dt>Plate</dt>
                      <dd className="mono">{vehicle.plate}</dd>
                      <dt>VIN</dt>
                      <dd className="mono">{vehicle.vin || '—'}</dd>
                      <dt>Chassis</dt>
                      <dd className="mono">{vehicle.chassis || '—'}</dd>
                      <dt>Engine</dt>
                      <dd>{vehicle.engine}</dd>
                      <dt>Fuel</dt>
                      <dd>{vehicle.fuel}</dd>
                      <dt>Mileage</dt>
                      <dd className="mono">{vehicle.mileage.toLocaleString()} km</dd>
                      <dt>On file since</dt>
                      <dd>{fmtDate(vehicle.createdAt)}</dd>
                    </dl>
                  </div>
                </div>

                {job && (
                  <div className="panel" style={{ background: '#0d1012' }}>
                    <div className="panel-head" style={{ minHeight: 44 }}>
                      <span className="panel-title">
                        <ShieldCheck size={12} /> Evidence & documents
                      </span>
                    </div>
                    <div className="panel-body" style={{ padding: '12px 14px' }}>
                      <div className="between" style={{ marginBottom: 7 }}>
                        <span className="t-xs dim">Pre-inspection coverage</span>
                        <span className="mono t-xs">{photoCount > 0 ? 'Captured' : 'Missing'}</span>
                      </div>
                      <div className="stage-track teal">
                        <i style={{ width: photoCount > 0 ? '100%' : '0%' }} />
                      </div>
                      <div className="retention-grid" style={{ marginTop: 12 }}>
                        <div className="retention-cell">
                          <b>{photoCount}</b>
                          <span>Photos</span>
                        </div>
                        <div className="retention-cell">
                          <b>{docCount}</b>
                          <span>Documents</span>
                        </div>
                      </div>
                      {photoCount === 0 && (
                        <div className="notice amber" style={{ marginTop: 10, padding: '8px 10px' }}>
                          <AlertTriangle size={12} />
                          <span className="t-xs">Capture photos before work begins to protect against damage disputes.</span>
                        </div>
                      )}
                      <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => setTab('inspection')}>
                        <Camera size={13} /> Open photo evidence
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'inspection' && (
          <div className="panel-body">
            {!job ? (
              <EmptyState title="No job order yet" text="Open a job order first — inspection photos are linked to it." />
            ) : (
              <>
                <div className="between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div className="eyebrow">Evidence captured before service</div>
                    <div className="t-sm muted" style={{ marginTop: 4 }}>
                      {photoCount} photos · damage register with {damageCount} item{damageCount === 1 ? '' : 's'} · stored with {job.code}
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn btn-outline btn-sm" onClick={() => setPrintView('inspection')}>
                      <Printer size={13} /> Print report
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setPhotoOpen(true)}>
                      <Camera size={13} /> Capture photos
                    </button>
                  </div>
                </div>

                <div className="notice amber" style={{ marginBottom: 14 }}>
                  <ShieldCheck size={14} />
                  <span>
                    <b>Liability baseline.</b> These images are timestamped against {job.code} and cannot be altered after capture.
                    Walk the vehicle with the customer before work starts.
                  </span>
                </div>

                {photoCount === 0 ? (
                  <EmptyState
                    icon={<Camera size={20} />}
                    title="No inspection photos yet"
                    text="Capture the front, sides, rear and odometer before the unit enters the bay."
                    action={<button className="btn btn-primary btn-sm" onClick={() => setPhotoOpen(true)}>Capture evidence</button>}
                  />
                ) : (
                  <div className="photo-grid">
                    {job.photos.map((p, i) => {
                      return (
                        <PhotoFrame
                          key={p.id}
                          plate={vehicle.plate}
                          zone={p.zone}
                          takenAt={p.takenAt}
                          tone={p.tone}
                          body={vehicle.bodyType}
                          label={p.label}
                          hasDamage={p.hasDamage}
                          spot={p.spot}
                          index={i}
                          onClick={() => setPhotoView(p)}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="split-main" style={{ marginTop: 18 }}>
                  <div>
                    <div className="between" style={{ marginBottom: 8 }}>
                      <div className="eyebrow">Damage register</div>
                      <button className="btn-link" onClick={() => setDamageOpen(true)}>
                        <Plus size={12} /> Note damage
                      </button>
                    </div>
                    {job.damages.length === 0 && (
                      <div className="notice teal">
                        <Check size={14} />
                        <span>No pre-existing damage recorded for this unit.</span>
                      </div>
                    )}
                    {job.damages.map((d) => (
                      <div className="damage-item" key={d.id}>
                        <span className="sev" style={{ background: SEV_COLOR[d.severity] }} />
                        <div style={{ flex: 1 }}>
                          <div className="between">
                            <b className="t-sm">{d.area}</b>
                            <span className="pill" style={{ background: `${SEV_COLOR[d.severity]}1f`, color: SEV_COLOR[d.severity], borderColor: `${SEV_COLOR[d.severity]}55` }}>
                              {d.severity}
                            </span>
                          </div>
                          <p className="t-xs muted" style={{ marginTop: 3, lineHeight: 1.55 }}>{d.note}</p>
                        </div>
                        <button
                          className={`check${d.acknowledged ? '' : ''}`}
                          onClick={() => toggleDamage(job.id, d.id)}
                          style={{ alignSelf: 'center', gap: 5, fontSize: 10.5, color: d.acknowledged ? 'var(--teal)' : 'var(--dim)' }}
                          title="Toggle customer acknowledgment"
                        >
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              border: `1px solid ${d.acknowledged ? 'var(--teal)' : '#3a4349'}`,
                              background: d.acknowledged ? 'rgba(47,227,176,.15)' : 'transparent',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {d.acknowledged && <Check size={10} />}
                          </span>
                          {d.acknowledged ? 'Acknowledged' : 'Pending'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="panel" style={{ background: '#0d1012' }}>
                    <div className="panel-head" style={{ minHeight: 42 }}>
                      <span className="panel-title">Capture details</span>
                    </div>
                    <div className="panel-body" style={{ padding: 12 }}>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Technician</span>
                        <span className="t-xs">{job.technician}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Captured</span>
                        <span className="t-xs">{fmtDateTime(job.photos[0]?.takenAt ?? job.receivedAt)}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0', borderTop: '1px solid #1a1f23', marginTop: 4, paddingTop: 9 }}>
                        <span className="t-xs dim">Job order</span>
                        <span className="t-xs mono">{job.code}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Acknowledged</span>
                        <span className="t-xs" style={{ color: 'var(--teal)' }}>
                          {job.damages.filter((d) => d.acknowledged).length}/{job.damages.length} items
                        </span>
                      </div>
                      <div className="t-xs dim" style={{ marginTop: 8, lineHeight: 1.6 }}>
                        Photos are tied to the plate and job order. Printing the report produces a signed condition sheet the
                        customer can acknowledge on arrival.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'job' && (
          <div className="panel-body">
            {!job ? (
              <EmptyState
                icon={<ClipboardList size={20} />}
                title="No job order for this vehicle"
                text="Create a digital job order to record the concern, pricing and repair progress."
                action={
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/job-orders?new=1&vehicle=${vehicle.id}`)}>
                    <Plus size={13} /> Create job order
                  </button>
                }
              />
            ) : (
              <>
                <div className="between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="display" style={{ fontSize: 22 }}>{job.code}</span>
                      <StagePill stage={job.stage} />
                    </div>
                    <div className="t-xs dim" style={{ marginTop: 3 }}>
                      Opened {fmtDateTime(job.receivedAt)} · {job.technician}
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn btn-outline btn-sm" onClick={openEdit}>
                      <Pencil size={12} /> Edit details
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => setPrintView('job')}>
                      <Printer size={13} /> Print / PDF
                    </button>
                    {editable && (
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm('job')} aria-label="Delete job order">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="row wrap" style={{ gap: 18, marginBottom: 14 }}>
                  <div>
                    <div className="eyebrow">Concern</div>
                    <div className="t-sm muted" style={{ marginTop: 3, maxWidth: 640, lineHeight: 1.6 }}>{job.concern}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <div className="eyebrow">Stage progress</div>
                    <div style={{ width: 200, marginTop: 7 }}>
                      <StageTrack stage={job.stage} />
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ background: '#0b0e10', marginBottom: 12 }}>
                  <div className="panel-head" style={{ minHeight: 46 }}>
                    <span className="panel-title">
                      <ClipboardList size={12} /> Line items
                    </span>
                    <span className="spacer" />
                    {editable && (
                      <button className="btn btn-outline btn-sm" onClick={() => setItemOpen(true)}>
                        <Plus size={12} /> Add item
                      </button>
                    )}
                  </div>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th style={{ width: 100 }}>Type</th>
                          <th className="right" style={{ width: 60 }}>Qty</th>
                          <th className="right" style={{ width: 110 }}>Unit</th>
                          <th className="right" style={{ width: 110 }}>Amount</th>
                          {editable && <th style={{ width: 40 }} />}
                        </tr>
                      </thead>
                      <tbody>
                        {job.items.map((it) => (
                          <tr key={it.id} style={{ cursor: 'default' }}>
                            <td className="cell-title">{it.desc}</td>
                            <td><span className="t-xs dim">{it.kind}</span></td>
                            <td className="right mono t-sm">{it.qty}</td>
                            <td className="right mono t-sm">{money(it.unit)}</td>
                            <td className="right mono t-sm">{money(it.unit * it.qty)}</td>
                            {editable && (
                              <td className="right">
                                <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => removeLineItem(job.id, it.id)} aria-label="Remove line item">
                                  <X size={12} />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                        {job.items.length === 0 && (
                          <tr>
                            <td colSpan={editable ? 6 : 5} style={{ textAlign: 'center', color: 'var(--dim)', padding: 24 }}>
                              No line items yet — add labor, parts or materials.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="panel-foot" style={{ justifyContent: 'flex-end', gap: 22 }}>
                    <span className="t-xs dim">Subtotal <b className="mono" style={{ color: 'var(--text-2)', marginLeft: 6 }}>{money(totals.subtotal)}</b></span>
                    <span className="t-xs dim">
                      Discount
                      <input
                        type="number"
                        value={job.discount}
                        onChange={(e) => updateJob(job.id, { discount: Number(e.target.value) || 0 })}
                        className="input mono"
                        style={{ width: 84, height: 26, marginLeft: 7, padding: '0 6px', fontSize: 11 }}
                        aria-label="Discount"
                      />
                    </span>
                    <span className="t-sm">
                      Total <b className="display" style={{ fontSize: 21, marginLeft: 6 }}>{money(totals.total)}</b>
                    </span>
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="panel" style={{ background: '#0b0e10' }}>
                    <div className="panel-head" style={{ minHeight: 42 }}>
                      <span className="panel-title"><FileText size={12} /> Notes & warranty</span>
                    </div>
                    <div className="panel-body" style={{ padding: 14 }}>
                      <p className="t-sm muted" style={{ lineHeight: 1.65 }}>{job.notes || 'No notes recorded.'}</p>
                      <div className="notice teal" style={{ marginTop: 10, padding: '8px 10px' }}>
                        <ShieldCheck size={12} />
                        <span className="t-xs">{job.warranty || 'Per shop standard.'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="panel" style={{ background: '#0b0e10' }}>
                    <div className="panel-head" style={{ minHeight: 42 }}>
                      <span className="panel-title"><CalendarClock size={12} /> Schedule & assignment</span>
                    </div>
                    <div className="panel-body" style={{ padding: 14 }}>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Received</span>
                        <span className="t-xs">{fmtDateTime(job.receivedAt)}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Promised</span>
                        <span className="t-xs">{job.promisedAt ? fmtDate(job.promisedAt) : '—'}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Technician</span>
                        <span className="t-xs">{job.technician}</span>
                      </div>
                      <div className="between" style={{ padding: '5px 0' }}>
                        <span className="t-xs dim">Odometer in</span>
                        <span className="t-xs mono">{job.odometer.toLocaleString()} km</span>
                      </div>
                      {job.releasedAt && (
                        <div className="between" style={{ padding: '5px 0', color: 'var(--teal)' }}>
                          <span className="t-xs dim">Released</span>
                          <span className="t-xs">{fmtDateTime(job.releasedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'documents' && (
          <div className="panel-body">
            <div className="between" style={{ marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Digital document storage</div>
                <div className="t-sm muted" style={{ marginTop: 3 }}>
                  {docCount} file{docCount === 1 ? '' : 's'} attached to this record
                </div>
              </div>
              {job && (
                <button className="btn btn-primary btn-sm" onClick={() => setDocOpen(true)}>
                  <Upload size={13} /> Attach document
                </button>
              )}
            </div>

            {!job || docCount === 0 ? (
              <EmptyState
                icon={<FolderOpen size={20} />}
                title="No documents yet"
                text="Attach the signed job order, invoice, OR/CR or insurance paperwork — the record keeps it permanently."
                action={job ? <button className="btn btn-outline btn-sm" onClick={() => setDocOpen(true)}>Attach the first file</button> : undefined}
              />
            ) : (
              <div className="doc-grid">
                {job.docs.map((d) => (
                  <div key={d.id} className="doc-card" onClick={() => setDocView(d)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setDocView(d); }}>
                    <DocThumb type={d.type} pages={d.pages} />
                    <div className="doc-main">
                      <b title={d.name}>{d.name}</b>
                      <span>{d.pages} page{d.pages > 1 ? 's' : ''} · {(d.kb / 1024).toFixed(1)} MB</span>
                      <div className="doc-tag"><span className="pill pill-gray" style={{ height: 18, fontSize: 9 }}>{d.type}</span></div>
                    </div>
                    <div className="doc-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => setDocView(d)} aria-label="Preview document">
                        <Eye size={13} />
                      </button>
                      {editable && (
                        <button
                          className="icon-btn"
                          style={{ width: 26, height: 26 }}
                          onClick={() => {
                            deleteDocument(job.id, d.id);
                            toast('Document deleted', d.name, 'warn');
                          }}
                          aria-label="Delete document"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="notice teal" style={{ marginTop: 16 }}>
              <ShieldCheck size={14} />
              <span>
                <b>Permanent retention.</b> Unlike the old paper files that were discarded after three months, these scans
                stay linked to {vehicle.plate} for the life of the record. Search the plate and every document surfaces.
              </span>
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="panel-body">
            {!job ? (
              <EmptyState title="No progress yet" text="Progress tracking starts when a job order is opened." />
            ) : (
              <div className="split-main">
                <div>
                  <div className="between" style={{ marginBottom: 14 }}>
                    <div>
                      <div className="eyebrow">Repair progress</div>
                      <div className="t-sm muted" style={{ marginTop: 3 }}>
                        {STAGE_META[job.stage].hint}
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={openStage}>
                      <Wrench size={13} /> Add update
                    </button>
                  </div>

                  <div className="panel" style={{ background: '#0b0e10', marginBottom: 16 }}>
                    <div className="panel-body" style={{ padding: '13px 16px' }}>
                      <div className="between" style={{ marginBottom: 8 }}>
                        <span className="t-xs dim">Stage {STAGES.indexOf(job.stage) + 1} of {STAGES.length}</span>
                        <StagePill stage={job.stage} />
                      </div>
                      <StageTrack stage={job.stage} />
                      <div className="row" style={{ justifyContent: 'space-between', marginTop: 7 }}>
                        {STAGES.map((s) => (
                          <span
                            key={s}
                            title={s}
                            style={{
                              fontSize: 8,
                              letterSpacing: '0.03em',
                              color: STAGES.indexOf(s) <= STAGES.indexOf(job.stage) ? 'var(--muted)' : '#4b555c',
                              textTransform: 'uppercase',
                            }}
                          >
                            {s.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="timeline">
                    {[...job.progress].reverse().map((p, i) => (
                      <div key={p.id} className={`tl-item ${i === 0 ? 'current' : 'done'}`}>
                        <span className="tl-dot"><i /></span>
                        <div className="tl-title">
                          <StagePill stage={p.stage} short />
                          <span className="t-xs dim">{fmtDateTime(p.at)}</span>
                        </div>
                        <div className="tl-note">{p.note}</div>
                        <div className="tl-time">Logged by {p.by}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stack">
                  <div className="panel" style={{ background: '#0d1012' }}>
                    <div className="panel-head" style={{ minHeight: 42 }}>
                      <span className="panel-title">Stage guide</span>
                    </div>
                    <div className="panel-body" style={{ padding: '8px 14px' }}>
                      {STAGES.map((s, i) => {
                        const done = i < STAGES.indexOf(job.stage);
                        const current = s === job.stage;
                        return (
                          <div key={s} className="row" style={{ padding: '6px 0', opacity: done || current ? 1 : 0.5 }}>
                            <span
                              style={{
                                width: 17,
                                height: 17,
                                borderRadius: 99,
                                display: 'grid',
                                placeItems: 'center',
                                background: current ? 'var(--amber-soft)' : done ? 'var(--teal-soft)' : '#151a1d',
                                border: `1px solid ${current ? 'var(--amber)' : done ? 'rgba(47,227,176,.4)' : '#2a3237'}`,
                                flex: '0 0 17px',
                              }}
                            >
                              {done ? <Check size={9} color="var(--teal)" /> : <span style={{ width: 4, height: 4, borderRadius: 99, background: current ? 'var(--amber)' : '#59636a' }} />}
                            </span>
                            <span className="t-xs" style={{ color: current ? '#fff' : 'var(--muted)' }}>{s}</span>
                            {current && <span className="pill pill-amber" style={{ marginLeft: 'auto', height: 18, fontSize: 8.5 }}>Current</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="notice">
                    <ShieldCheck size={13} />
                    <span className="t-xs">
                      Each stage update is timestamped and logged with the user who recorded it. Customers can be shown this
                      timeline without exposing pricing or documents.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------- modals -------------------- */}
      <Modal
        open={stageOpen}
        onClose={() => setStageOpen(false)}
        title="Update repair progress"
        subtitle={job ? `${job.code} · ${vehicle.plate}` : ''}
        icon={<Wrench size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setStageOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveStage}><Check size={14} /> Save update</button>
          </>
        }
      >
        <div className="stack" style={{ gap: 14 }}>
          <Field label="Repair stage">
            <select className="select" value={stageDraft} onChange={(e) => setStageDraft(e.target.value as Stage)}>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Update note" hint="Visible on the record timeline and the shop progress board.">
            <textarea
              className="textarea"
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
              placeholder="e.g. Bumper painted and curing in Bay 3. Sensor calibration next."
            />
          </Field>
          <div className="notice amber">
            <AlertTriangle size={13} />
            <span className="t-xs">Moving a unit to <b>Released</b> closes the job and timestamps the turnover.</span>
          </div>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit job order details"
        subtitle={job?.code}
        icon={<Pencil size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit}><Check size={14} /> Save changes</button>
          </>
        }
      >
        <div className="form-grid">
          <Field label="Target release date" className="span-2">
            <input className="input" type="date" value={editPromised} onChange={(e) => setEditPromised(e.target.value)} />
          </Field>
          <Field label="Repair notes" className="span-2">
            <textarea className="textarea" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} style={{ minHeight: 96 }} />
          </Field>
          <Field label="Warranty" className="span-2">
            <input className="input" value={editWarranty} onChange={(e) => setEditWarranty(e.target.value)} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        title="Add line item"
        subtitle="Labor, parts or materials — included in the printed job order."
        icon={<Plus size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setItemOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={addItem}><Plus size={14} /> Add to job order</button>
          </>
        }
      >
        <div className="form-grid">
          <Field label="Type">
            <select className="select" value={itemDraft.kind} onChange={(e) => setItemDraft({ ...itemDraft, kind: e.target.value })}>
              <option>Labor</option>
              <option>Part</option>
              <option>Materials</option>
            </select>
          </Field>
          <Field label="Quantity">
            <input className="input" type="number" min={1} value={itemDraft.qty} onChange={(e) => setItemDraft({ ...itemDraft, qty: e.target.value })} />
          </Field>
          <Field label="Description" required className="span-2">
            <input className="input" value={itemDraft.desc} onChange={(e) => setItemDraft({ ...itemDraft, desc: e.target.value })} placeholder="Front bumper assembly (OEM)" />
          </Field>
          <Field label="Unit price (₱)" required>
            <input className="input mono" type="number" value={itemDraft.unit} onChange={(e) => setItemDraft({ ...itemDraft, unit: e.target.value })} placeholder="28500" />
          </Field>
          <div className="field">
            <span className="label">Amount</span>
            <div className="input mono" style={{ display: 'flex', alignItems: 'center', color: 'var(--amber)' }}>
              {money((Number(itemDraft.qty) || 0) * (Number(itemDraft.unit) || 0))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        title="Capture pre-inspection photos"
        subtitle="Select the angles documented with the customer present."
        icon={<Camera size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setPhotoOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={capture}><Camera size={14} /> Capture {zones.length || ''} photos</button>
          </>
        }
      >
        <div className="row wrap" style={{ gap: 7 }}>
          {ZONES.map((z) => {
            const on = zones.includes(z);
            return (
              <button
                key={z}
                className={`chip${on ? ' active' : ''}`}
                onClick={() => setZones((prev) => (prev.includes(z) ? prev.filter((x) => x !== z) : [...prev, z]))}
              >
                {on && <Check size={11} />} {z}
              </button>
            );
          })}
        </div>
        <div className="notice amber" style={{ marginTop: 14 }}>
          <AlertTriangle size={13} />
          <span className="t-xs">
            Capture before the unit enters the bay. Each photo is timestamped and stored against the plate and job order — a
            baseline if a customer disputes existing damage.
          </span>
        </div>
      </Modal>

      <Modal
        open={docOpen}
        onClose={() => setDocOpen(false)}
        title="Attach a document scan"
        subtitle="Invoices, receipts, signed job orders, OR/CR, insurance papers."
        icon={<Upload size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDocOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={attachDoc}><Upload size={14} /> Attach to record</button>
          </>
        }
      >
        <div className="stack" style={{ gap: 14 }}>
          <Field label="Document type">
            <select className="select" value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
              {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="File name" hint="Leave blank to auto-name it from the job order and type.">
            <input className="input" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder={`JO-${job?.code.slice(-4) ?? '0000'}.pdf`} />
          </Field>
          <div
            style={{
              border: '1px dashed #333c42',
              borderRadius: 10,
              padding: '22px 16px',
              textAlign: 'center',
              background: '#0b0e10',
            }}
          >
            <Upload size={20} style={{ margin: '0 auto 6px', color: 'var(--dim)' }} />
            <div className="t-sm" style={{ color: 'var(--text-2)' }}>Drop a scan here</div>
            <div className="t-xs dim" style={{ marginTop: 3 }}>Prototype: attaching creates a sample archived file.</div>
          </div>
        </div>
      </Modal>

      <Modal
        open={damageOpen}
        onClose={() => setDamageOpen(false)}
        title="Record pre-existing damage"
        subtitle="Note anything found before the unit is worked on."
        icon={<AlertTriangle size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDamageOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveDamage}><Plus size={14} /> Add to register</button>
          </>
        }
      >
        <div className="form-grid">
          <Field label="Area" required>
            <input className="input" value={damageDraft.area} onChange={(e) => setDamageDraft({ ...damageDraft, area: e.target.value })} placeholder="Left fender" />
          </Field>
          <Field label="Severity">
            <select className="select" value={damageDraft.severity} onChange={(e) => setDamageDraft({ ...damageDraft, severity: e.target.value })}>
              <option>Minor</option>
              <option>Moderate</option>
              <option>Major</option>
            </select>
          </Field>
          <Field label="Observation" required className="span-2">
            <textarea className="textarea" value={damageDraft.note} onChange={(e) => setDamageDraft({ ...damageDraft, note: e.target.value })} placeholder="Pre-existing dent and paint scuff near the wheel arch." />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!photoView}
        onClose={() => setPhotoView(null)}
        title="Inspection evidence"
        subtitle={photoView ? `${photoView.zone} · ${fmtDateTime(photoView.takenAt)}` : ''}
        size="wide"
        icon={<Camera size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setPhotoView(null)}>Close</button>
            <button className="btn btn-outline" onClick={() => { setPhotoView(null); setPrintView('inspection'); }}><Printer size={13} /> Print inspection report</button>
          </>
        }
      >
        {photoView && (
          <div className="split-main" style={{ gap: 18 }}>
            <PhotoFrame
              plate={vehicle.plate}
              zone={photoView.zone}
              takenAt={photoView.takenAt}
              tone={photoView.tone}
              body={vehicle.bodyType}
              label={photoView.label}
              hasDamage={photoView.hasDamage}
              spot={photoView.spot}
            />
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Capture metadata</div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Zone</span><span className="t-xs">{photoView.zone}</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Taken</span><span className="t-xs">{fmtDateTime(photoView.takenAt)}</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">By</span><span className="t-xs">{photoView.takenBy}</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Job order</span><span className="t-xs mono">{job?.code}</span>
              </div>
              <div className="between" style={{ padding: '6px 0' }}>
                <span className="t-xs dim">Damage marker</span>
                <span className="t-xs" style={{ color: photoView.hasDamage ? 'var(--amber)' : 'var(--teal)' }}>
                  {photoView.hasDamage ? 'Tagged' : 'Clear'}
                </span>
              </div>
              {job?.damages.filter((d) => d.photoId === photoView.id).map((d) => (
                <div key={d.id} className="notice amber" style={{ marginTop: 10, padding: '8px 10px' }}>
                  <AlertTriangle size={12} />
                  <span className="t-xs"><b>{d.area}</b> · {d.note}</span>
                </div>
              ))}
              <p className="t-xs dim" style={{ marginTop: 12, lineHeight: 1.6 }}>
                Stored against {vehicle.plate}. The capture time cannot be edited, preserving the evidence chain.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!docView}
        onClose={() => setDocView(null)}
        title={docView?.name ?? 'Document'}
        subtitle={docView ? `${docView.type} · added ${fmtDate(docView.addedAt)} by ${docView.addedBy}` : ''}
        icon={<FolderOpen size={16} />}
        footer={<button className="btn btn-outline" onClick={() => setDocView(null)}>Close preview</button>}
      >
        {docView && (
          <div className="split-main" style={{ gap: 18 }}>
            <div style={{ display: 'grid', placeItems: 'center', background: '#0b0e10', border: '1px solid #242b30', borderRadius: 10, padding: 26 }}>
              <div style={{ transform: 'scale(2.1)', transformOrigin: 'center' }}>
                <DocThumb type={docView.type} pages={docView.pages} />
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Archived file</div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Type</span><span className="t-xs">{docView.type}</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Pages</span><span className="t-xs">{docView.pages}</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Size</span><span className="t-xs">{(docView.kb / 1024).toFixed(2)} MB</span>
              </div>
              <div className="between" style={{ padding: '6px 0', borderBottom: '1px solid #1a1f23' }}>
                <span className="t-xs dim">Added by</span><span className="t-xs">{docView.addedBy}</span>
              </div>
              <div className="between" style={{ padding: '6px 0' }}>
                <span className="t-xs dim">Linked to</span><span className="t-xs mono">{job?.code}</span>
              </div>
              <div className="notice teal" style={{ marginTop: 12 }}>
                <ShieldCheck size={12} />
                <span className="t-xs">Prototype preview — in deployment the original scanned PDF is served from private storage.</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!printView}
        onClose={() => setPrintView(null)}
        title={printView === 'inspection' ? 'Pre-inspection report' : 'Job order'}
        subtitle="A4 print preview · use your browser's print dialog to save as PDF."
        size="xwide"
        icon={<Printer size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setPrintView(null)}>Close</button>
            <button className="btn btn-primary" onClick={() => window.print()}><Printer size={14} /> Print</button>
          </>
        }
      >
        {job && printView === 'job' && <JobOrderSheet job={job} vehicle={vehicle} customer={customer} />}
        {job && printView === 'inspection' && <InspectionSheet job={job} vehicle={vehicle} customer={customer} />}
      </Modal>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'job' ? 'Delete this job order?' : 'Delete this vehicle record?'}
        subtitle={confirm === 'job' ? job?.code : vehicle.plate}
        icon={<Trash2 size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Keep record</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm === 'job' && job) {
                  deleteJob(job.id);
                  toast('Job order deleted', job.code, 'warn');
                  setConfirm(null);
                  setTab('overview');
                } else if (confirm === 'vehicle') {
                  deleteVehicle(vehicle.id);
                  toast('Vehicle record deleted', vehicle.plate, 'warn');
                  navigate('/vehicles');
                }
              }}
            >
              <Trash2 size={14} /> Delete permanently
            </button>
          </>
        }
      >
        <p className="confirm-note">
          {confirm === 'job'
            ? 'This removes the job order, its line items, photo evidence and attached documents. Customer and vehicle details stay on file.'
            : `This removes the vehicle record for ${vehicle.plate}, its job orders, photos and documents. This cannot be undone — the shop no longer keeps paper backups.`}
        </p>
        <div className="notice amber" style={{ marginTop: 12 }}>
          <AlertTriangle size={14} />
          <span>Deletion is restricted to owner and admin roles. Mechanics can update progress but never remove records.</span>
        </div>
      </Modal>
    </>
  );
}

function CarArtPlaceholder() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 17h14M3 17v-4l2-5h14l2 5v4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="16.5" cy="17.5" r="1.6" />
    </svg>
  );
}
