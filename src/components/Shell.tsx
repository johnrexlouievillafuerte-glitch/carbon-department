import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  Car,
  ClipboardList,
  Clock3,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { navigate } from '../lib/router';
import { fmtDate, initials, isoDay, timeAgo } from '../lib/utils';
import { BrandMark } from './graphics';
import { SearchPalette } from './SearchPalette';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, group: 'Workshop' },
  { to: '/vehicles', label: 'Vehicle Records', icon: Car, group: 'Workshop' },
  { to: '/job-orders', label: 'Job Orders', icon: ClipboardList, group: 'Workshop' },
  { to: '/progress', label: 'Repair Progress', icon: Activity, group: 'Workshop' },
  { to: '/bookings', label: 'Bookings', icon: CalendarDays, group: 'Operations' },
  { to: '/documents', label: 'Documents', icon: FolderOpen, group: 'Operations' },
  { to: '/reports', label: 'Reports', icon: BarChart3, group: 'Operations' },
];

export function Shell({ children, path }: { children: ReactNode; path: string }) {
  const { state, session, logout } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openJobs = state.jobs.filter((j) => j.stage !== 'Released').length;
  const today = isoDay(new Date());
  const todayBookings = state.bookings.filter((b) => b.date === today && b.status !== 'Cancelled').length;
  const activeBays = state.jobs.filter((j) => j.stage === 'In Progress' || j.stage === 'Finishing & QC').length;
  const capacity = 6;
  const loadPct = Math.min(100, Math.round((activeBays / capacity) * 100));
  const isActive = (to: string) => (to === '/' ? path === '/' || path.startsWith('/?') : path.startsWith(to));

  return (
    <div className="app">
      <aside className="sidebar">
        <button className="sidebar-brand" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', textAlign: 'left' }} aria-label="CARBONTrack home">
          <BrandMark />
          <span className="brand-text">
            <b>
              CARBON<span>TRACK</span>
            </b>
            <small>Carbon Department</small>
          </span>
        </button>

        <nav className="nav" aria-label="Main navigation">
          {['Workshop', 'Operations'].map((group) => (
            <div key={group}>
              <div className="nav-group-label">{group}</div>
              {NAV.filter((n) => n.group === group).map((item) => {
                const Icon = item.icon;
                const badge =
                  item.to === '/job-orders' ? openJobs : item.to === '/bookings' ? todayBookings : 0;
                return (
                  <button
                    key={item.to}
                    className={`nav-item${isActive(item.to) ? ' active' : ''}`}
                    onClick={() => navigate(item.to)}
                    aria-current={isActive(item.to) ? 'page' : undefined}
                  >
                    <Icon size={17} className="nav-icon" strokeWidth={1.9} />
                    <span className="nav-label">{item.label}</span>
                    {badge > 0 && <span className="nav-badge">{badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="shop-card">
            <div className="shop-card-title">
              <span className="pulse-dot" /> Shop status · open
            </div>
            <div className="shop-load">
              <i style={{ width: `${loadPct}%` }} />
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="t-xs muted">{activeBays} of {capacity} bays active</span>
              <span className="t-xs mono dim">{loadPct}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button className="user-chip" onClick={() => navigate('/reports')} title="Account & access" style={{ flex: 1 }}>
              <span className="avatar">{initials(session?.name ?? 'CD')}</span>
              <span className="user-meta">
                <b>{session?.name}</b>
                <span>{session?.role === 'owner' ? 'Owner / Admin' : session?.role === 'admin' ? 'Service Advisor' : 'Head Mechanic'}</span>
              </span>
            </button>
            <button className="icon-btn" onClick={logout} title="Sign out" aria-label="Sign out" style={{ alignSelf: 'center', borderColor: 'var(--line-soft)' }}>
              <LogOut size={15} />
            </button>
          </div>
          <div className="dim" style={{ padding: '2px 4px 0', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, whiteSpace: 'nowrap' }}>
            <ShieldCheck size={11} /> Private workspace · sample data
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search records">
            <Search size={15} />
            <span>Search plate, customer, or job order…</span>
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </button>

          <div className="topbar-actions">
            {session?.role !== 'mechanic' && (
              <button
                className="btn btn-primary btn-sm hide-sm"
                onClick={() => navigate('/job-orders?new=1')}
                style={{ marginRight: 4, width: 34, padding: 0 }}
                title="New job order"
                aria-label="New job order"
              >
                <Plus size={16} />
              </button>
            )}

            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => setBellOpen((v) => !v)} aria-label="Recent activity" aria-expanded={bellOpen}>
                <Bell size={16} />
                <span className="dot-badge" />
              </button>
              {bellOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 35 }} onClick={() => setBellOpen(false)} />
                  <div
                    className="panel"
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 336, zIndex: 36, overflow: 'hidden' }}
                  >
                    <div className="panel-head" style={{ minHeight: 44, padding: '10px 14px' }}>
                      <span className="panel-title">Recent activity</span>
                      <span className="spacer" />
                      <span className="t-xs dim mono">last 24h</span>
                    </div>
                    <div style={{ maxHeight: 330, overflowY: 'auto', padding: '4px 14px 8px' }}>
                      {state.activity.slice(0, 6).map((a) => (
                        <div key={a.id} className="activity-item">
                          <span className="act-ico">
                            <Clock3 size={12} />
                          </span>
                          <div className="act-body">
                            <div className="act-text">{a.text}</div>
                            <div className="act-time">{timeAgo(a.at)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="panel-foot" style={{ padding: '9px 14px' }}>
                      <button className="btn-link" onClick={() => { setBellOpen(false); navigate('/reports'); }}>
                        View full activity log
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="topbar-divider" />
            <div className="clock">
              <b>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</b>
              <span>{fmtDate(now.toISOString())}</span>
            </div>
            <button
              className="avatar"
              style={{ cursor: 'pointer', marginLeft: 4 }}
              title={`${session?.name} · ${session?.role}`}
              onClick={() => navigate('/reports')}
              aria-label="Account"
            >
              {initials(session?.name ?? 'CD')}
            </button>
          </div>
        </header>

        <main className="content" key={path}>
          <div className="page-in">{children}</div>
        </main>
      </div>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
