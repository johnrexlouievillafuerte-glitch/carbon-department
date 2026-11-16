import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowLeftRight, Check, ChevronRight, Clock3, Plus, Wrench } from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { JobOrder, Stage } from '../lib/types';
import { STAGES, STAGE_META } from '../lib/types';
import { TECHNICIANS } from '../lib/data';
import { elapsedLabel, fmtDateShort, stageIndex } from '../lib/utils';
import { EmptyState, Field, Plate, StagePill } from '../components/ui';
import { Modal } from '../components/Modal';

export function Progress() {
  const { state, setStage, toast } = useStore();
  const [tech, setTech] = useState('All');
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [draftStage, setDraftStage] = useState<Stage>('In Progress');
  const [draftNote, setDraftNote] = useState('');
  const [onlyLate, setOnlyLate] = useState(false);

  const isLate = (j: JobOrder) => !!j.promisedAt && new Date(j.promisedAt).getTime() < Date.now() && j.stage !== 'Released';

  const jobs = useMemo(
    () =>
      state.jobs.filter(
        (j) => (tech === 'All' || j.technician === tech) && (!onlyLate || isLate(j)),
      ),
    [state.jobs, tech, onlyLate],
  );

  const target = state.jobs.find((j) => j.id === updateId);
  const active = state.jobs.filter((j) => j.stage !== 'Released');
  const awaiting = state.jobs.filter((j) => j.stage === 'For Approval');
  const late = state.jobs.filter((j) => isLate(j));

  const advance = (job: JobOrder) => {
    const idx = stageIndex(job.stage);
    if (idx >= STAGES.length - 1) return;
    const next = STAGES[idx + 1];
    setStage(job.id, next, `Moved to ${next} from the repair progress board.`);
    toast('Unit advanced', `${job.code} → ${next}`);
  };

  const openUpdate = (job: JobOrder) => {
    setUpdateId(job.id);
    setDraftStage(job.stage);
    setDraftNote('');
  };

  const saveUpdate = () => {
    if (!target) return;
    setStage(target.id, draftStage, draftNote);
    toast('Progress updated', `${target.code} → ${draftStage}`);
    setUpdateId(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Repair <span className="accent">progress</span>
          </h1>
          <p className="page-sub">
            Every unit, every stage. The board is the shop&apos;s shared source of truth — staff can show a customer the
            timeline without exposing internal documents.
          </p>
        </div>
        <div className="page-actions">
          <select className="select" style={{ width: 190 }} value={tech} onChange={(e) => setTech(e.target.value)} aria-label="Filter technician">
            <option value="All">All technicians</option>
            {TECHNICIANS.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
          <button className={`chip${onlyLate ? ' active' : ''}`} onClick={() => setOnlyLate((v) => !v)} style={{ height: 36 }}>
            <AlertTriangle size={13} /> Overdue only
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/job-orders?new=1')}>
            <Plus size={14} /> New job order
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Units in shop</span><Activity size={14} style={{ color: 'var(--amber)' }} /></div>
          <div className="kpi-value">{active.length}</div>
          <div className="kpi-foot">Across {new Set(active.map((j) => j.technician)).size} technicians</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Awaiting approval</span><Clock3 size={14} style={{ color: 'var(--amber-2)' }} /></div>
          <div className="kpi-value">{awaiting.length}</div>
          <div className="kpi-foot">Work paused until the customer confirms</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Ready for release</span><Check size={14} style={{ color: 'var(--teal)' }} /></div>
          <div className="kpi-value">{state.jobs.filter((j) => j.stage === 'Ready for Release').length}</div>
          <div className="kpi-foot">Waiting on pickup</div>
        </div>
        <div className="kpi">
          <div className="kpi-top"><span className="kpi-label">Past promise date</span><AlertTriangle size={14} style={{ color: 'var(--red)' }} /></div>
          <div className="kpi-value" style={{ color: late.length ? 'var(--red)' : undefined }}>{late.length}</div>
          <div className="kpi-foot">{late.length ? 'Needs a customer update today' : 'Schedule is on track'}</div>
        </div>
      </div>

      {awaiting.length > 0 && (
        <div className="notice amber" style={{ marginBottom: 14 }}>
          <AlertTriangle size={14} />
          <span>
            <b>{awaiting.length} unit{awaiting.length === 1 ? '' : 's'} waiting for customer approval.</b> Parts cannot be
            ordered until the customer confirms the quotation — use the record&apos;s print preview to send a copy.
          </span>
        </div>
      )}

      <div className="row" style={{ marginBottom: 8 }}>
        <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeftRight size={11} /> Shop floor · scroll sideways for later stages
        </span>
        <span className="spacer" />
        <span className="t-xs dim">{jobs.length} cards</span>
      </div>

      <div className="kanban">
        {STAGES.map((stage) => {
          const col = jobs.filter((j) => j.stage === stage);
          const meta = STAGE_META[stage];
          return (
            <div className="kan-col" key={stage}>
              <div className="kan-head">
                <span className="k-dot" style={{ background: meta.color, boxShadow: `0 0 7px ${meta.color}` }} />
                <b>{stage}</b>
                <span className="k-count">{col.length}</span>
              </div>
              <div className="kan-body">
                {col.map((j) => {
                  const v = state.vehicles.find((x) => x.id === j.vehicleId);
                  const c = state.customers.find((x) => x.id === j.customerId);
                  const late = isLate(j);
                  const idx = stageIndex(j.stage);
                  if (!v) return null;
                  return (
                    <div className="kan-card" key={j.id} onClick={() => navigate(`/vehicles/${v.id}?tab=timeline`)}>
                      <div className="kc-top">
                        <Plate value={v.plate} size="sm" />
                        <span className="t-xs dim mono">{j.code.slice(-4)}</span>
                      </div>
                      <div className="kc-title">
                        {v.make} {v.model}
                      </div>
                      <div className="kc-sub">{c?.name}</div>
                      <div className="row" style={{ gap: 5, marginTop: 6 }}>
                        <span className="t-xs dim" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Wrench size={10} /> {j.technician.split(' ')[0]}
                        </span>
                        {j.photos.length === 0 && (
                          <span className="pill pill-amber" style={{ height: 17, fontSize: 8 }}>no photos</span>
                        )}
                      </div>
                      <div className="kc-foot">
                        <span className="t-xs dim">{j.promisedAt ? `Due ${fmtDateShort(j.promisedAt)}` : `${elapsedLabel(j.receivedAt, null)} in`}</span>
                        {late && <span className="pill pill-red" style={{ height: 17, fontSize: 8 }}>late</span>}
                        <span className="spacer" />
                        <button
                          className="icon-btn"
                          style={{ width: 24, height: 24 }}
                          title="Add an update"
                          aria-label="Add progress update"
                          onClick={(e) => { e.stopPropagation(); openUpdate(j); }}
                        >
                          <Wrench size={12} />
                        </button>
                        {idx < STAGES.length - 1 && (
                          <button
                            className="icon-btn"
                            style={{ width: 24, height: 24, color: 'var(--amber)' }}
                            title={`Advance to ${STAGES[idx + 1]}`}
                            aria-label={`Advance to ${STAGES[idx + 1]}`}
                            onClick={(e) => { e.stopPropagation(); advance(j); }}
                          >
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {col.length === 0 && <div className="kan-empty">No units at this stage</div>}
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <EmptyState
          icon={<Wrench size={20} />}
          title="Nothing on the board"
          text="No job orders match this technician or overdue filter."
          action={<button className="btn btn-outline btn-sm" onClick={() => { setTech('All'); setOnlyLate(false); }}>Reset filters</button>}
        />
      )}

      <div className="panel" style={{ marginTop: 6 }}>
        <div className="panel-head">
          <span className="panel-title"><Activity size={13} /> How the board works</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <div className="t-sm muted" style={{ flex: '1 1 320px', lineHeight: 1.6 }}>
            Each card is a job order. The arrow advances one stage and writes a timestamped entry to the record timeline.
            The wrench opens a note so the next technician knows exactly where the unit was left.
          </div>
          <div className="row wrap" style={{ gap: 7 }}>
            {STAGES.map((s) => <StagePill key={s} stage={s} short />)}
          </div>
        </div>
      </div>

      <Modal
        open={!!updateId}
        onClose={() => setUpdateId(null)}
        title="Log a progress update"
        subtitle={target ? `${target.code} · ${state.vehicles.find((v) => v.id === target.vehicleId)?.plate ?? ''}` : ''}
        icon={<Wrench size={16} />}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setUpdateId(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveUpdate}><Check size={14} /> Save update</button>
          </>
        }
      >
        {target && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="row" style={{ gap: 8 }}>
              <StagePill stage={target.stage} />
              <span className="t-xs dim">currently</span>
            </div>
            <Field label="New stage">
              <select className="select" value={draftStage} onChange={(e) => setDraftStage(e.target.value as Stage)}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Note for the team" hint="Written to the record timeline and visible to the shop.">
              <textarea
                className="textarea"
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="e.g. Paint cured. Reassembly and sensor calibration next."
              />
            </Field>
          </div>
        )}
      </Modal>
    </>
  );
}
