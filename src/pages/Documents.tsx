import { useMemo, useState } from 'react';
import { Eye, FileText, FolderOpen, Plus, Search, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { DocType, ShopDoc } from '../lib/types';
import { DOC_TYPES } from '../lib/types';
import { canDelete, fmtDate, fmtDateTime } from '../lib/utils';
import { DocThumb } from '../components/graphics';
import { EmptyState, Field, Plate } from '../components/ui';
import { Modal } from '../components/Modal';

interface DocRow {
  doc: ShopDoc;
  jobId: string;
  jobCode: string;
  plate: string;
  vehicle: string;
  customer: string;
  vehicleId: string;
}

export function Documents() {
  const { state, session, addDocument, deleteDocument, toast } = useStore();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'All' | DocType>('All');
  const [view, setView] = useState<DocRow | null>(null);
  const [open, setOpen] = useState(false);
  const [attach, setAttach] = useState({ jobId: '', type: 'Job Order' as DocType, name: '' });

  const rows = useMemo<DocRow[]>(() => {
    const term = q.trim().toLowerCase();
    return state.jobs
      .flatMap((job) => {
        const vehicle = state.vehicles.find((v) => v.id === job.vehicleId);
        const customer = state.customers.find((c) => c.id === job.customerId);
        if (!vehicle) return [];
        return job.docs.map((doc) => ({
          doc,
          jobId: job.id,
          jobCode: job.code,
          plate: vehicle.plate,
          vehicle: `${vehicle.make} ${vehicle.model}`,
          customer: customer?.name ?? '—',
          vehicleId: vehicle.id,
        }));
      })
      .filter((r) => {
        const match =
          !term ||
          r.plate.toLowerCase().includes(term) ||
          r.doc.name.toLowerCase().includes(term) ||
          r.doc.type.toLowerCase().includes(term) ||
          r.customer.toLowerCase().includes(term) ||
          r.jobCode.toLowerCase().includes(term);
        const typeOk = type === 'All' || r.doc.type === type;
        return match && typeOk;
      })
      .sort((a, b) => b.doc.addedAt.localeCompare(a.doc.addedAt));
  }, [state.jobs, state.vehicles, state.customers, q, type]);

  const totalMb = (rows.reduce((s, r) => s + r.doc.kb, 0) / 1024).toFixed(1);
  const editable = canDelete(session?.role);
  const jobsWithVehicles = state.jobs.filter((j) => state.vehicles.some((v) => v.id === j.vehicleId));

  const attachDoc = () => {
    if (!attach.jobId) {
      toast('Select the job order this document belongs to', undefined, 'warn');
      return;
    }
    addDocument(attach.jobId, attach.type, attach.name || undefined);
    toast('Document archived', `${attach.type} attached to the record`);
    setAttach({ jobId: '', type: 'Job Order', name: '' });
    setOpen(false);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Document <span className="accent">library</span>
          </h1>
          <p className="page-sub">
            Job orders, invoices, receipts, OR/CR and insurance scans — every file attached to a plate, kept permanently.
          </p>
        </div>
        <div className="page-actions">
          {editable && (
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Upload size={14} /> Attach document
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Archived files</span><FolderOpen size={14} style={{ color: 'var(--amber)' }} /></div>
          <div className="kpi-value">{state.jobs.reduce((s, j) => s + j.docs.length, 0)}</div>
          <div className="kpi-foot">Across {state.jobs.length} job orders</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Digital storage</span><FileText size={14} style={{ color: 'var(--blue)' }} /></div>
          <div className="kpi-value">{totalMb}<small>MB</small></div>
          <div className="kpi-foot">Would be terabytes of paper</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Document types</span><ShieldCheck size={14} style={{ color: 'var(--purple)' }} /></div>
          <div className="kpi-value">{new Set(rows.map((r) => r.doc.type)).size}</div>
          <div className="kpi-foot">JO · invoice · receipt · OR/CR</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Retention</span><ShieldCheck size={14} style={{ color: 'var(--teal)' }} /></div>
          <div className="kpi-value">∞</div>
          <div className="kpi-foot">No three-month purge</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="search-input-wrap" style={{ flex: '1 1 300px' }}>
            <Search size={14} />
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plate, file name, customer or job order…"
              aria-label="Search documents"
            />
            {q && (
              <button className="icon-btn" style={{ position: 'absolute', right: 5, top: 4, width: 30, height: 30 }} onClick={() => setQ('')} aria-label="Clear">
                <X size={13} />
              </button>
            )}
          </div>
          <span className="t-xs dim mono">{rows.length} files</span>
        </div>

        <div className="panel-body" style={{ padding: '9px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--line-soft)' }}>
          <button className={`chip${type === 'All' ? ' active' : ''}`} onClick={() => setType('All')}>All types</button>
          {DOC_TYPES.map((t) => {
            const n = rows.filter((r) => r.doc.type === t).length;
            return (
              <button key={t} className={`chip${type === t ? ' active' : ''}`} onClick={() => setType(t)}>
                {t} {n > 0 && <span className="count">{n}</span>}
              </button>
            );
          })}
        </div>

        <div className="panel-body">
          {rows.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={20} />}
              title="No documents found"
              text="Attach a scan to any job order — it stays linked to the plate and never gets discarded."
              action={editable ? <button className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>Attach a document</button> : undefined}
            />
          ) : (
            <div className="doc-grid">
              {rows.map((r) => (
                <div
                  key={r.doc.id}
                  className="doc-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setView(r)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setView(r); }}
                >
                  <DocThumb type={r.doc.type} pages={r.doc.pages} />
                  <div className="doc-main">
                    <b title={r.doc.name}>{r.doc.name}</b>
                    <span>{r.jobCode} · {fmtDate(r.doc.addedAt)}</span>
                    <div className="row" style={{ gap: 5, marginTop: 5 }}>
                      <Plate value={r.plate} size="sm" />
                      <span className="t-xs dim truncate">{r.vehicle}</span>
                    </div>
                  </div>
                  <div className="doc-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={() => setView(r)} aria-label="Preview">
                      <Eye size={13} />
                    </button>
                    {editable && (
                      <button
                        className="icon-btn"
                        style={{ width: 26, height: 26 }}
                        aria-label="Delete document"
                        onClick={() => {
                          deleteDocument(r.jobId, r.doc.id);
                          toast('Document deleted', r.doc.name, 'warn');
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-foot">
          <ShieldCheck size={12} style={{ color: 'var(--teal)' }} />
          <span>Private storage — documents never appear on a public page or social media account.</span>
          <span className="spacer" />
          <span className="mono t-xs">{rows.length} shown</span>
        </div>
      </div>

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.doc.name ?? 'Document'}
        subtitle={view ? `${view.doc.type} · ${fmtDateTime(view.doc.addedAt)}` : ''}
        icon={<FileText size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setView(null)}>Close</button>
            <button
              className="btn btn-outline"
              onClick={() => {
                if (view) {
                  const v = view;
                  setView(null);
                  navigate(`/vehicles/${v.vehicleId}?tab=documents`);
                }
              }}
            >
              Open vehicle record
            </button>
          </>
        }
      >
        {view && (
          <div className="split-main" style={{ gap: 20 }}>
            <div style={{ display: 'grid', placeItems: 'center', background: '#0b0e10', border: '1px solid #242b30', borderRadius: 10, padding: 26 }}>
              <div style={{ transform: 'scale(2.1)', transformOrigin: 'center' }}>
                <DocThumb type={view.doc.type} pages={view.doc.pages} />
              </div>
            </div>
            <div>
              <div className="row" style={{ gap: 7, marginBottom: 10 }}>
                <Plate value={view.plate} />
                <span className="pill pill-gray">{view.doc.type}</span>
              </div>
              <div className="kv">
                <dt>Vehicle</dt><dd>{view.vehicle}</dd>
                <dt>Customer</dt><dd>{view.customer}</dd>
                <dt>Job order</dt><dd className="mono">{view.jobCode}</dd>
                <dt>Pages</dt><dd>{view.doc.pages}</dd>
                <dt>File size</dt><dd>{(view.doc.kb / 1024).toFixed(2)} MB</dd>
                <dt>Added by</dt><dd>{view.doc.addedBy}</dd>
                <dt>Added</dt><dd>{fmtDateTime(view.doc.addedAt)}</dd>
              </div>
              <div className="notice teal" style={{ marginTop: 12 }}>
                <ShieldCheck size={13} />
                <span className="t-xs">
                  Preview of the archived file. In production this opens the scanned PDF from private storage; the original
                  scan is never held only on paper.
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Attach a document"
        subtitle="Choose the job order, then the document type."
        icon={<Upload size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={attachDoc}><Plus size={14} /> Attach to record</button>
          </>
        }
      >
        <div className="stack" style={{ gap: 14 }}>
          <Field label="Job order / vehicle" required>
            <select className="select" value={attach.jobId} onChange={(e) => setAttach({ ...attach, jobId: e.target.value })}>
              <option value="">— Select a job order —</option>
              {jobsWithVehicles.map((j) => {
                const v = state.vehicles.find((x) => x.id === j.vehicleId);
                return (
                  <option key={j.id} value={j.id}>
                    {j.code} · {v?.plate} · {v?.make} {v?.model}
                  </option>
                );
              })}
            </select>
          </Field>
          <Field label="Document type">
            <select className="select" value={attach.type} onChange={(e) => setAttach({ ...attach, type: e.target.value as DocType })}>
              {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="File name" hint="Leave blank to auto-name from the job order.">
            <input className="input" value={attach.name} onChange={(e) => setAttach({ ...attach, name: e.target.value })} placeholder="INV-4800.pdf" />
          </Field>
          <div style={{ border: '1px dashed #333c42', borderRadius: 10, padding: '20px 16px', textAlign: 'center', background: '#0b0e10' }}>
            <Upload size={20} style={{ margin: '0 auto 6px', color: 'var(--dim)' }} />
            <div className="t-sm" style={{ color: 'var(--text-2)' }}>Drop a scan or take a photo</div>
            <div className="t-xs dim" style={{ marginTop: 3 }}>Prototype: attaching creates a sample archived file.</div>
          </div>
        </div>
      </Modal>
    </>
  );
}
