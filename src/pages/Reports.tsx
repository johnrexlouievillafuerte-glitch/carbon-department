import { useState } from 'react';
import { BarChart3, Check, FileText, FolderOpen, Printer, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { SHOP } from '../lib/data';
import type { JobOrder } from '../lib/types';
import { fmtDate, fmtDateTime, jobTotals, money } from '../lib/utils';
import { BrandMark } from '../components/graphics';
import { EmptyState, Field, Plate } from '../components/ui';
import { navigate } from '../lib/router';
import { Modal } from '../components/Modal';
import { RotateCcw } from 'lucide-react';

type ReportKey = 'history' | 'open' | 'documents';

const REPORTS: Array<{ key: ReportKey; label: string; desc: string; icon: typeof FileText }> = [
  { key: 'history', label: 'Vehicle service history', desc: 'Every visit, document and job order for one plate', icon: FileText },
  { key: 'open', label: 'Open job orders', desc: 'What is in the shop, who owns it, and its value', icon: BarChart3 },
  { key: 'documents', label: 'Document register', desc: 'A complete index of archived shop documents', icon: FolderOpen },
];

export function Reports() {
  const { state, session, resetDemo } = useStore();
  const [report, setReport] = useState<ReportKey>('history');
  const [vehicleId, setVehicleId] = useState(state.vehicles[0]?.id ?? '');
  const [resetOpen, setResetOpen] = useState(false);

  const vehicle = state.vehicles.find((v) => v.id === vehicleId) ?? state.vehicles[0];
  const customer = state.customers.find((c) => c.id === vehicle?.customerId);
  const vehicleJobs = state.jobs
    .filter((j) => j.vehicleId === vehicle?.id)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const lifetime = vehicleJobs.reduce((s, j) => s + jobTotals(j).total, 0);
  const openJobs = state.jobs.filter((j) => j.stage !== 'Released').sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  const allDocs = state.jobs
    .flatMap((j) => {
      const v = state.vehicles.find((x) => x.id === j.vehicleId);
      return j.docs.map((d) => ({ ...d, job: j, plate: v?.plate ?? '—', unit: v ? `${v.make} ${v.model}` : '—' }));
    })
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  const print = () => window.print();

  return (
    <>
      <div className="page-head no-print">
        <div>
          <h1 className="page-title">
            Reports &amp; <span className="accent">access</span>
          </h1>
          <p className="page-sub">
            Printable records for the shop and the panel — service history by plate, open jobs, and the permission model
            behind the private workspace.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => navigate('/documents')}>
            <FolderOpen size={14} /> Document library
          </button>
          {session?.role === 'owner' && (
            <button className="btn btn-outline" onClick={() => setResetOpen(true)}>
              <RotateCcw size={14} /> Reset demo
            </button>
          )}
          <button className="btn btn-primary" onClick={print}>
            <Printer size={14} /> Print report
          </button>
        </div>
      </div>

      <div className="panel no-print" style={{ marginBottom: 14 }}>
        <div className="panel-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', padding: 14 }}>
          <div className="row wrap" style={{ gap: 7, flex: '1 1 520px' }}>
            {REPORTS.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.key}
                  className={`chip${report === r.key ? ' active' : ''}`}
                  style={{ height: 36 }}
                  onClick={() => setReport(r.key)}
                  title={r.desc}
                >
                  <Icon size={13} /> {r.label}
                </button>
              );
            })}
          </div>
          {report === 'history' && (
            <div style={{ minWidth: 260 }}>
              <Field label="Vehicle plate">
                <select className="select" value={vehicle?.id ?? ''} onChange={(e) => setVehicleId(e.target.value)}>
                  {state.vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} · {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>
      </div>

      <div className="panel print-area">
        <div className="panel-head no-print">
          <span className="panel-title"><Printer size={13} /> Print preview</span>
          <span className="spacer" />
          <span className="t-xs dim">A4 · white sheet · use Print to save as PDF</span>
          <button className="btn btn-outline btn-sm" onClick={print}><Printer size={12} /> Print</button>
        </div>
        <div className="panel-body" style={{ background: '#0a0d0e', padding: 18 }}>
          {report === 'history' && (
            vehicle ? (
              <div className="print-sheet">
                <SheetHead title="Vehicle Service History" code={`HIST-${vehicle.plate.replace(/\s/g, '')}`} />
                <div className="ps-grid2">
                  <div className="ps-box">
                    <h4>Vehicle</h4>
                    <div className="ps-line"><span>Plate</span><b style={{ fontFamily: 'var(--font-mono)' }}>{vehicle.plate}</b></div>
                    <div className="ps-line"><span>Unit</span><b>{vehicle.make} {vehicle.model} · {vehicle.year}</b></div>
                    <div className="ps-line"><span>Color</span><b>{vehicle.color}</b></div>
                    <div className="ps-line"><span>VIN</span><b style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{vehicle.vin || '—'}</b></div>
                    <div className="ps-line"><span>Chassis</span><b style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{vehicle.chassis || '—'}</b></div>
                    <div className="ps-line"><span>Mileage</span><b>{vehicle.mileage.toLocaleString()} km</b></div>
                  </div>
                  <div className="ps-box">
                    <h4>Customer</h4>
                    <div className="ps-line"><span>Name</span><b>{customer?.name ?? '—'}</b></div>
                    <div className="ps-line"><span>Type</span><b>{customer?.kind ?? 'Individual'}</b></div>
                    <div className="ps-line"><span>Contact</span><b>{customer?.phone ?? '—'}</b></div>
                    <div className="ps-line"><span>Email</span><b>{customer?.email ?? '—'}</b></div>
                    <div className="ps-line"><span>Address</span><b>{customer?.address ?? '—'}</b></div>
                    <div className="ps-line"><span>On file since</span><b>{fmtDate(vehicle.createdAt)}</b></div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 78 }}>Date</th>
                      <th style={{ width: 90 }}>Job order</th>
                      <th>Concern / work performed</th>
                      <th style={{ width: 90 }}>Service</th>
                      <th style={{ width: 70 }}>Status</th>
                      <th className="num" style={{ width: 74 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleJobs.map((j) => (
                      <tr key={j.id}>
                        <td>{fmtDate(j.receivedAt)}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{j.code}</td>
                        <td>{j.concern}</td>
                        <td>{j.serviceTypes.join(', ')}</td>
                        <td>{j.stage}</td>
                        <td className="num">{money(jobTotals(j).total)}</td>
                      </tr>
                    ))}
                    {vehicleJobs.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6d7780' }}>No service history recorded for this plate.</td></tr>
                    )}
                  </tbody>
                </table>

                <div className="ps-grid2">
                  <div className="ps-box">
                    <h4>Summary</h4>
                    <div className="ps-line"><span>Total visits</span><b>{vehicleJobs.length}</b></div>
                    <div className="ps-line"><span>Released jobs</span><b>{vehicleJobs.filter((j) => j.stage === 'Released').length}</b></div>
                    <div className="ps-line"><span>Open jobs</span><b>{vehicleJobs.filter((j) => j.stage !== 'Released').length}</b></div>
                    <div className="ps-line"><span>Lifetime value</span><b>{money(lifetime)}</b></div>
                  </div>
                  <div className="ps-box">
                    <h4>Attached records</h4>
                    <div className="ps-line"><span>Documents archived</span><b>{vehicleJobs.reduce((s, j) => s + j.docs.length, 0)}</b></div>
                    <div className="ps-line"><span>Inspection photos</span><b>{vehicleJobs.reduce((s, j) => s + j.photos.length, 0)}</b></div>
                    <div className="ps-line"><span>Damage notes</span><b>{vehicleJobs.reduce((s, j) => s + j.damages.length, 0)}</b></div>
                    <div className="ps-line"><span>Retention</span><b>Permanent</b></div>
                  </div>
                </div>

                <div className="ps-note">
                  Service history generated from CARBONTrack. Job orders, invoices, receipts and pre-inspection evidence are
                  retained against the plate permanently. This report is for customer and internal reference, not an official
                  BIR receipt.
                </div>
                <div className="ps-signs" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="ps-sign"><b /><span>Prepared by · {session?.name}</span></div>
                  <div className="ps-sign"><b /><span>Owner / Authorized representative</span></div>
                </div>
                <SheetFoot />
              </div>
            ) : (
              <EmptyState title="No vehicles on file" text="Add a vehicle record first." />
            )
          )}

          {report === 'open' && (
            <div className="print-sheet">
              <SheetHead title="Open Job Orders" code={`OPEN-${new Date().toISOString().slice(0, 10)}`} />
              <div className="ps-box" style={{ marginBottom: 12 }}>
                <h4>Shop snapshot</h4>
                <div className="ps-line"><span>Open units</span><b>{openJobs.length}</b></div>
                <div className="ps-line"><span>Awaiting approval</span><b>{openJobs.filter((j) => j.stage === 'For Approval').length}</b></div>
                <div className="ps-line"><span>In progress / finishing</span><b>{openJobs.filter((j) => j.stage === 'In Progress' || j.stage === 'Finishing & QC').length}</b></div>
                <div className="ps-line"><span>Potential value</span><b>{money(openJobs.reduce((s, j) => s + jobTotals(j).total, 0))}</b></div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Job order</th>
                    <th>Plate</th>
                    <th>Unit</th>
                    <th>Concern</th>
                    <th>Stage</th>
                    <th>Technician</th>
                    <th style={{ width: 66 }}>Promised</th>
                    <th className="num" style={{ width: 72 }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {openJobs.map((j: JobOrder) => {
                    const v = state.vehicles.find((x) => x.id === j.vehicleId);
                    return (
                      <tr key={j.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5 }}>{j.code}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{v?.plate ?? '—'}</td>
                        <td>{v ? `${v.make} ${v.model}` : '—'}</td>
                        <td>{j.concern.length > 62 ? `${j.concern.slice(0, 62)}…` : j.concern}</td>
                        <td>{j.stage}</td>
                        <td>{j.technician}</td>
                        <td>{j.promisedAt ? fmtDate(j.promisedAt) : '—'}</td>
                        <td className="num">{money(jobTotals(j).total)}</td>
                      </tr>
                    );
                  })}
                  {openJobs.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: '#6d7780' }}>No open job orders.</td></tr>
                  )}
                </tbody>
              </table>
              <div className="ps-note">
                Generated from live job order data. Values exclude released jobs and are subject to final approval after
                inspection, consistent with the shop&apos;s consultation-before-pricing policy.
              </div>
              <SheetFoot />
            </div>
          )}

          {report === 'documents' && (
            <div className="print-sheet">
              <SheetHead title="Document Register" code={`DOCREG-${new Date().toISOString().slice(0, 10)}`} />
              <div className="ps-box" style={{ marginBottom: 12 }}>
                <h4>Archive summary</h4>
                <div className="ps-line"><span>Total files</span><b>{allDocs.length}</b></div>
                <div className="ps-line"><span>Digital size</span><b>{(allDocs.reduce((s, d) => s + d.kb, 0) / 1024).toFixed(1)} MB</b></div>
                <div className="ps-line"><span>Job orders referenced</span><b>{new Set(allDocs.map((d) => d.job.id)).size}</b></div>
                <div className="ps-line"><span>Retention</span><b>Permanent — no three-month purge</b></div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 64 }}>Added</th>
                    <th style={{ width: 74 }}>Type</th>
                    <th>File</th>
                    <th style={{ width: 90 }}>Job order</th>
                    <th style={{ width: 70 }}>Plate</th>
                    <th style={{ width: 36 }}>Pages</th>
                    <th className="num" style={{ width: 46 }}>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {allDocs.map((d) => (
                    <tr key={d.id}>
                      <td>{fmtDate(d.addedAt)}</td>
                      <td>{d.type}</td>
                      <td>{d.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5 }}>{d.job.code}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{d.plate}</td>
                      <td>{d.pages}</td>
                      <td className="num">{(d.kb / 1024).toFixed(1)} MB</td>
                    </tr>
                  ))}
                  {allDocs.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6d7780' }}>No documents archived.</td></tr>
                  )}
                </tbody>
              </table>
              <div className="ps-note">
                Private document index. Files are linked to job orders and vehicles; unauthorised deletion is restricted to
                owner and admin roles.
              </div>
              <SheetFoot />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-2 no-print" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title"><ShieldCheck size={13} /> Role permissions</span>
            <span className="spacer" />
            <span className="pill pill-teal"><span className="dot" /> enforced in UI</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className="right">Owner</th>
                  <th className="right">Advisor</th>
                  <th className="right">Mechanic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Browse and search records', true, true, true],
                  ['Add customer / vehicle records', true, true, false],
                  ['Create job orders', true, true, false],
                  ['Update repair stage & notes', true, true, true],
                  ['Capture inspection photos', true, true, true],
                  ['Attach documents', true, true, true],
                  ['Delete records or documents', true, true, false],
                  ['Print job orders / reports', true, true, true],
                  ['Manage bookings', true, true, true],
                ].map(([label, owner, admin, mechanic]) => (
                  <tr key={label as string} style={{ cursor: 'default' }}>
                    <td className="t-sm">{label}</td>
                    {[owner, admin, mechanic].map((ok, i) => (
                      <td className="right" key={i}>
                        {ok ? <Check size={13} style={{ color: 'var(--teal)', marginLeft: 'auto' }} /> : <X size={13} style={{ color: '#5a646b', marginLeft: 'auto' }} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-foot">
            <span className="t-xs dim">Role rules are applied to the interface — switch roles at sign-in to demonstrate.</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title"><BarChart3 size={13} /> Requirement coverage</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Client requirement</th>
                  <th>Priority</th>
                  <th>Where it lives</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Customer & vehicle database', 'Core', 'Vehicle Records'],
                  ['Fast retrieval by plate number', 'Core', 'Global search · ⌘K'],
                  ['Digital job orders', 'Core', 'Job Orders + print'],
                  ['Document storage', 'Core', 'Document Library'],
                  ['Pre-inspection evidence', 'Core', 'Inspection tab + report'],
                  ['Repair progress tracking', 'Core', 'Progress board + timeline'],
                  ['Add / update / delete / print', 'Core', 'Record actions'],
                  ['Booking / appointment', 'Supporting', 'Weekly calendar'],
                  ['Privacy and login', 'Core', 'Roles + private access'],
                ].map(([req, priority, where]) => (
                  <tr key={req} style={{ cursor: 'default' }}>
                    <td className="t-sm">{req}</td>
                    <td>
                      <span className={`pill ${priority === 'Core' ? 'pill-amber' : 'pill-gray'}`} style={{ height: 18, fontSize: 8.5 }}>
                        {priority}
                      </span>
                    </td>
                    <td className="t-xs muted">{where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-foot">
            <span className="t-xs dim">Out of scope for this prototype: payroll, sales/purchases, and automated insurance claims.</span>
          </div>
        </div>
      </div>

      <div className="panel no-print" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <span className="panel-title"><FileText size={13} /> Activity audit log</span>
          <span className="spacer" />
          <span className="t-xs dim">Newest first · {state.activity.length} entries</span>
        </div>
        <div className="panel-body" style={{ padding: '4px 18px 12px' }}>
          <div className="grid grid-2" style={{ gap: '0 26px' }}>
            {state.activity.slice(0, 12).map((a) => (
              <div className="activity-item" key={a.id} style={{ borderBottom: '1px solid #161a1d' }}>
                <span className="act-ico"><FileText size={11} /></span>
                <div className="act-body">
                  <div className="act-text">{a.text}</div>
                  {a.detail && <div className="t-xs dim">{a.detail}</div>}
                  <div className="act-time">{fmtDateTime(a.at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset the prototype data?"
        subtitle="Restores the seeded Carbon Department records."
        icon={<RotateCcw size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setResetOpen(false)}>Keep my changes</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                resetDemo();
                setResetOpen(false);
                navigate('/');
              }}
            >
              <RotateCcw size={14} /> Reset to sample data
            </button>
          </>
        }
      >
        <p className="confirm-note">
          Any vehicles, job orders, photos, documents or bookings you added in this browser will be replaced by the original
          sample set. The demo is stored locally on this device — no shop data is sent anywhere.
        </p>
      </Modal>

      <div className="t-xs dim no-print" style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <ShieldCheck size={12} />
        {SHOP.name} · {SHOP.address} · Prototype sample data
        <span className="dim">·</span>
        <span>Prepared for IT 3 System Analysis &amp; Design</span>
        {vehicle && report === 'history' && (
          <>
            <span className="dim">·</span>
            <Plate value={vehicle.plate} size="sm" />
          </>
        )}
      </div>
    </>
  );
}

function SheetHead({ title, code }: { title: string; code: string }) {
  return (
    <>
      <div className="ps-head">
        <div className="ps-logo"><BrandMark size={46} /></div>
        <div style={{ flex: 1 }}>
          <div className="ps-co">{SHOP.name}</div>
          <div className="ps-co-sub">{SHOP.address} · {SHOP.phone}</div>
          <div className="ps-co-sub">{SHOP.email} · Private workshop records</div>
        </div>
        <div className="ps-meta">
          CARBONTRACK REPORT
          <br />
          <b style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{code}</b>
          <br />
          {fmtDate(new Date().toISOString())}
        </div>
      </div>
      <div className="ps-doc-title">{title}</div>
      <div className="ps-doc-code">Generated {fmtDateTime(new Date().toISOString())}</div>
    </>
  );
}

function SheetFoot() {
  return (
    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: '#7b858c', borderTop: '1px solid #e2e4dd', paddingTop: 5 }}>
      <span>CARBONTrack · Carbon Department Auto-Body and Repair Services Co. · {SHOP.address}</span>
      <span>Page 1 of 1</span>
    </div>
  );
}
