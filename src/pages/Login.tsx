import { useState } from 'react';
import { ArrowRight, ClipboardList, Eye, EyeOff, LockKeyhole, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { CarArt, BrandMark } from '../components/graphics';
import { ROLE_ACCOUNTS, SHOP } from '../lib/data';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import type { Role } from '../lib/types';

const ROLES: Array<{ key: Role; icon: typeof ShieldCheck; label: string; desc: string }> = [
  { key: 'owner', icon: ShieldCheck, label: 'Owner / Administrator', desc: 'Full access — records, finances, reports, all roles' },
  { key: 'admin', icon: ClipboardList, label: 'Service Advisor', desc: 'Front desk — records, job orders, bookings, documents' },
  { key: 'mechanic', icon: Wrench, label: 'Mechanic', desc: 'Bay access — progress updates and inspection photos' },
];

export function Login() {
  const { login, state } = useStore();
  const [role, setRole] = useState<Role>('owner');
  const [password, setPassword] = useState('carbontrack');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const activeUnits = state.jobs.filter((j) => j.stage !== 'Released').length;
  const docCount = state.jobs.reduce((s, j) => s + j.docs.length, 0);

  const submit = () => {
    if (password.trim().length < 4) {
      setError('Enter at least 4 characters. Demo access is prefilled — just press Enter.');
      return;
    }
    login(role);
    navigate('/');
  };

  return (
    <div className="login">
      <section className="login-stage">
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative', zIndex: 2 }}
        >
          <BrandMark size={42} />
          <span className="brand-text">
            <b style={{ fontSize: 24 }}>
              CARBON<span>TRACK</span>
            </b>
            <small>Vehicle records · Carbon Department</small>
          </span>
        </div>

        <div className="login-hero">
          <span className="login-kicker">
            <span className="pulse-dot" /> Private workshop system · Cainta, Rizal
          </span>
          <h1 className="login-title">
            Every unit.
            <br />
            Every job.
            <em>Every proof.</em>
          </h1>
          <p className="login-lead">
            The shop&apos;s records, job orders and pre-inspection evidence in one private system — searchable by plate in
            seconds. Built for Carbon Department Auto-Body and Repair Services, not another Messenger booking page.
          </p>
          <div className="login-features">
            {['Plate-first retrieval', 'Digital job orders', 'Pre-inspection photos', 'Live repair progress'].map((f) => (
              <span className="chip" key={f}>
                <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--amber)' }} />
                {f}
              </span>
            ))}
          </div>
          <div className="login-mini-stats">
            <div>
              <b>{activeUnits}</b>
              <span>Units in shop</span>
            </div>
            <div>
              <b>{state.vehicles.length}</b>
              <span>Vehicles on file</span>
            </div>
            <div>
              <b>{docCount}</b>
              <span>Digital documents</span>
            </div>
            <div>
              <b>0</b>
              <span>Records at risk</span>
            </div>
          </div>
        </div>

        <div className="login-car" style={{ animation: 'float 8s ease-in-out infinite' }}>
          <div className="glow-orb" />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: '-14% -6%',
                background: 'radial-gradient(ellipse at 50% 60%, rgba(255,107,18,.18), transparent 62%)',
                pointerEvents: 'none',
              }}
            />
            <CarArt body="Coupe" variant={1} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <span className="plate plate-sm">
              <span className="strip" />
              <span className="val">NCR 4821</span>
            </span>
            <span className="t-xs dim">Bay 2 · body repair in progress</span>
          </div>
        </div>

        <div className="login-stage-foot">
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={12} /> {SHOP.address}
          </span>
          <span className="spacer" />
          <span>Est. {SHOP.established}</span>
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-card">
          <div className="eyebrow" style={{ marginBottom: 7 }}>
            {SHOP.short} · Private access
          </div>
          <h2 className="display-title">Sign in to the workspace</h2>
          <p className="muted t-sm" style={{ marginTop: 6, lineHeight: 1.55 }}>
            Records are private. Choose a role to preview the permission set assigned to that user.
          </p>

          <div className="role-list" style={{ marginTop: 18 }}>
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.key}
                  type="button"
                  className={`role-btn${role === r.key ? ' active' : ''}`}
                  onClick={() => setRole(r.key)}
                >
                  <span className="r-icon">
                    <Icon size={16} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <b>{r.label}</b>
                    <small>{r.desc}</small>
                  </span>
                  {role === r.key && <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--amber)' }} />}
                </button>
              );
            })}
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <span className="label">
              Password <i className="req">*</i>
            </span>
            <div className="input-group" style={{ position: 'relative' }}>
              <LockKeyhole size={14} style={{ position: 'absolute', left: 11, top: 12, color: 'var(--dim)' }} />
              <input
                className="input"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
                style={{ paddingLeft: 33, paddingRight: 38 }}
                aria-label="Password"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShow((v) => !v)}
                style={{ position: 'absolute', right: 3, top: 2, width: 30, height: 30 }}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 14 }} onClick={submit}>
            Enter workspace <ArrowRight size={16} />
          </button>

          {error && (
            <div className="notice amber" style={{ marginTop: 10, padding: '8px 10px' }}>
              <span className="t-xs">{error}</span>
            </div>
          )}

          <div className="role-hint">
            <LockKeyhole size={11} />
            Signed in as <b style={{ color: 'var(--text-2)' }}>{ROLE_ACCOUNTS[role].name}</b>
            <span className="dim">·</span>
            <span className="dim">{ROLE_ACCOUNTS[role].title}</span>
          </div>

          <div className="notice" style={{ marginTop: 20 }}>
            <ShieldCheck size={14} />
            <span>
              <b>UI prototype.</b> Authentication is simulated and records are seeded samples. Role rules are enforced in the
              interface — for example, mechanics cannot delete records or documents.
            </span>
          </div>

          <div className="t-xs dim" style={{ marginTop: 18, lineHeight: 1.6 }}>
            IT 3 — System Analysis and Design · 1st Semester 2026–2027
            <br />
            University of Rizal System, Cainta Campus
          </div>
        </div>
      </section>
    </div>
  );
}
