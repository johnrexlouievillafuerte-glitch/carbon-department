import type { Customer, JobOrder, Vehicle } from '../lib/types';
import { SHOP } from '../lib/data';
import { fmtDate, fmtDateTime, fmtTime, jobTotals, money } from '../lib/utils';
import { BrandMark, InspectionPhoto } from './graphics';

/* ---------------------------------------------------------------
   Official job order / quotation
   --------------------------------------------------------------- */
export function JobOrderSheet({ job, vehicle, customer }: { job: JobOrder; vehicle: Vehicle; customer?: Customer }) {
  const totals = jobTotals(job);
  return (
    <div className="print-sheet print-film">
      <div className="ps-watermark">CARBON DEPARTMENT</div>
      <div className="ps-head">
        <div className="ps-logo">
          <BrandMark size={46} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="ps-co">{SHOP.name}</div>
          <div className="ps-co-sub">
            {SHOP.address} · {SHOP.phone}
          </div>
          <div className="ps-co-sub">
            {SHOP.email} · Est. {SHOP.established} · TIN {SHOP.tin}
          </div>
        </div>
        <div className="ps-meta">
          JOB ORDER
          <br />
          <b style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{job.code}</b>
          <br />
          {fmtDate(job.receivedAt)}
        </div>
      </div>

      <div className="ps-doc-title">Job Order &amp; Repair Authorization</div>
      <div className="ps-doc-code">
        {job.code} · Received {fmtDate(job.receivedAt)} {fmtTime(job.receivedAt)}
        {job.promisedAt ? ` · Target release ${fmtDate(job.promisedAt)}` : ''}
      </div>

      <div className="ps-grid2">
        <div className="ps-box">
          <h4>Customer</h4>
          <div className="ps-line">
            <span>Name</span>
            <b>{customer?.name ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Contact</span>
            <b>{customer?.phone ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Email</span>
            <b>{customer?.email ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Address</span>
            <b>{customer?.address ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Type</span>
            <b>{customer?.kind ?? 'Individual'}</b>
          </div>
        </div>
        <div className="ps-box">
          <h4>Vehicle</h4>
          <div className="ps-line">
            <span>Plate no.</span>
            <b style={{ fontFamily: 'var(--font-mono)' }}>{vehicle.plate}</b>
          </div>
          <div className="ps-line">
            <span>Make / model</span>
            <b>
              {vehicle.make} {vehicle.model}
            </b>
          </div>
          <div className="ps-line">
            <span>Year / color</span>
            <b>
              {vehicle.year} · {vehicle.color}
            </b>
          </div>
          <div className="ps-line">
            <span>VIN</span>
            <b style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{vehicle.vin || '—'}</b>
          </div>
          <div className="ps-line">
            <span>Chassis</span>
            <b style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{vehicle.chassis || '—'}</b>
          </div>
          <div className="ps-line">
            <span>Odometer</span>
            <b>{job.odometer.toLocaleString()} km</b>
          </div>
        </div>
      </div>

      <div className="ps-box" style={{ marginBottom: 12 }}>
        <h4>Reported concern &amp; service</h4>
        <div style={{ fontSize: 10, lineHeight: 1.55, marginBottom: 6 }}>{job.concern}</div>
        <div className="ps-line">
          <span>Service line</span>
          <b>{job.serviceTypes.join(' · ')}</b>
        </div>
        <div className="ps-line">
          <span>Assigned technician</span>
          <b>{job.technician}</b>
        </div>
        <div className="ps-line">
          <span>Pre-inspection evidence</span>
          <b>
            {job.photos.length} photo{job.photos.length === 1 ? '' : 's'} captured · {job.damages.length} noted item
            {job.damages.length === 1 ? '' : 's'}
          </b>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ width: 30 }}>Qty</th>
            <th>Description</th>
            <th style={{ width: 62 }}>Type</th>
            <th className="num" style={{ width: 72 }}>Unit price</th>
            <th className="num" style={{ width: 78 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {job.items.map((it) => (
            <tr key={it.id}>
              <td>{it.qty}</td>
              <td>{it.desc}</td>
              <td>{it.kind}</td>
              <td className="num">{money(it.unit)}</td>
              <td className="num">{money(it.unit * it.qty)}</td>
            </tr>
          ))}
          {job.items.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: '#6d7780' }}>
                No line items recorded yet — pending inspection / approval.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="ps-total">
        <table>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="num" style={{ textAlign: 'right' }}>
                {money(totals.subtotal)}
              </td>
            </tr>
            <tr>
              <td>Discount</td>
              <td className="num" style={{ textAlign: 'right' }}>
                −{money(totals.discount)}
              </td>
            </tr>
            <tr className="ps-grand">
              <td>Total</td>
              <td style={{ textAlign: 'right' }}>{money(totals.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ps-note">
        <b>Repair notes.</b> {job.notes || 'No additional notes recorded.'}
        <br />
        <b>Warranty.</b> {job.warranty || 'Per shop standard.'}
        <br />
        <b>Pre-existing condition.</b> The customer acknowledges that the vehicle was photographed and inspected before
        service began, and that the damage items listed above were present on arrival and are not attributable to the shop.
        This job order is an authorization to perform the work described; it is not an official BIR receipt. Final cost may
        change only with the customer&apos;s approval after inspection.
      </div>

      <div className="ps-signs">
        <div className="ps-sign">
          <b />
          <span>Customer / Received by</span>
        </div>
        <div className="ps-sign">
          <b />
          <span>{job.technician} · Mechanic</span>
        </div>
        <div className="ps-sign">
          <b />
          <span>Owner / Authorized representative</span>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: '#7b858c', borderTop: '1px solid #e2e4dd', paddingTop: 5 }}>
        <span>Generated by CARBONTrack — carbon department carshop · record {job.id}</span>
        <span>{fmtDateTime(new Date().toISOString())}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Pre-inspection report — liability evidence
   --------------------------------------------------------------- */
export function InspectionSheet({ job, vehicle, customer }: { job: JobOrder; vehicle: Vehicle; customer?: Customer }) {
  return (
    <div className="print-sheet">
      <div className="ps-head">
        <div className="ps-logo">
          <BrandMark size={46} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="ps-co">{SHOP.name}</div>
          <div className="ps-co-sub">
            {SHOP.address} · {SHOP.phone}
          </div>
          <div className="ps-co-sub">Pre-service condition documentation</div>
        </div>
        <div className="ps-meta">
          PRE-INSPECTION
          <br />
          <b style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{job.code}</b>
          <br />
          {fmtDate(job.receivedAt)}
        </div>
      </div>

      <div className="ps-doc-title">Pre-Inspection Condition Report</div>
      <div className="ps-doc-code">
        Captured before service began · {job.photos.length} photos · technician {job.technician}
      </div>

      <div className="ps-grid2">
        <div className="ps-box">
          <h4>Vehicle</h4>
          <div className="ps-line">
            <span>Plate</span>
            <b style={{ fontFamily: 'var(--font-mono)' }}>{vehicle.plate}</b>
          </div>
          <div className="ps-line">
            <span>Unit</span>
            <b>
              {vehicle.make} {vehicle.model} · {vehicle.year}
            </b>
          </div>
          <div className="ps-line">
            <span>Color</span>
            <b>{vehicle.color}</b>
          </div>
          <div className="ps-line">
            <span>Odometer</span>
            <b>{job.odometer.toLocaleString()} km</b>
          </div>
        </div>
        <div className="ps-box">
          <h4>Owner</h4>
          <div className="ps-line">
            <span>Name</span>
            <b>{customer?.name ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Contact</span>
            <b>{customer?.phone ?? '—'}</b>
          </div>
          <div className="ps-line">
            <span>Received</span>
            <b>{fmtDateTime(job.receivedAt)}</b>
          </div>
          <div className="ps-line">
            <span>Job order</span>
            <b>{job.code}</b>
          </div>
        </div>
      </div>

      <h4 style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6d7780', margin: '4px 0 6px' }}>
        Photo evidence
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {job.photos.slice(0, 6).map((p, i) => (
          <InspectionPhoto
            key={p.id}
            plate={vehicle.plate}
            zone={p.zone}
            takenAt={p.takenAt}
            tone={p.tone}
            body={vehicle.bodyType}
            label={p.label}
            hasDamage={p.hasDamage}
            spot={p.spot}
            compact
            index={i}
          />
        ))}
      </div>
      {job.photos.length === 0 && (
        <div className="ps-box" style={{ textAlign: 'center', color: '#6d7780', fontSize: 10 }}>
          No inspection photos have been captured for this job order.
        </div>
      )}

      <table style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Area</th>
            <th style={{ width: 70 }}>Severity</th>
            <th>Observation</th>
            <th style={{ width: 78 }}>Acknowledged</th>
          </tr>
        </thead>
        <tbody>
          {job.damages.map((d) => (
            <tr key={d.id}>
              <td>{d.area}</td>
              <td>{d.severity}</td>
              <td>{d.note}</td>
              <td>{d.acknowledged ? 'Yes — customer' : 'Pending'}</td>
            </tr>
          ))}
          {job.damages.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#6d7780' }}>
                No pre-existing damage recorded on arrival.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="ps-note">
        This report records the visible condition of the vehicle at the time it was received by {SHOP.short}. Photographs
        are timestamped and stored permanently against the vehicle record. Any subsequent damage claim is assessed against
        this baseline. The customer is asked to review and sign before work begins.
      </div>

      <div className="ps-signs" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="ps-sign">
          <b />
          <span>Customer acknowledgment</span>
        </div>
        <div className="ps-sign">
          <b />
          <span>{job.technician} · Inspecting technician</span>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 7.5, color: '#7b858c', borderTop: '1px solid #e2e4dd', paddingTop: 5 }}>
        Generated by CARBONTrack · record {job.id} · {fmtDateTime(new Date().toISOString())}
      </div>
    </div>
  );
}
