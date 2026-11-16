import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LockKeyhole, 
  Mail, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Wrench,
  UserCheck
} from 'lucide-react';

export interface UserSession {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'mechanic';
  roleTitle: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) => {
  const [role, setRole] = useState<'owner' | 'admin' | 'mechanic'>('admin');
  const [email, setEmail] = useState('admin@carbondepartment.ph');
  const [password, setPassword] = useState('carbon2026');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'admin' as const,
      name: 'Workshop Administrator',
      title: 'Admin (System Manager)',
      badge: 'Full Records Access',
      email: 'admin@carbondepartment.ph',
      icon: <UserCheck size={16} className="text-[#00F0FF]" />,
    },
    {
      id: 'owner' as const,
      name: 'Shop Owner',
      title: 'Shop Owner (Lead Fabricator)',
      badge: 'Executive Sign-Off',
      email: 'owner@carbondepartment.ph',
      icon: <ShieldCheck size={16} className="text-cyan-400" />,
    },
    {
      id: 'mechanic' as const,
      name: 'Lead Mechanical Technician',
      title: 'Senior Technician',
      badge: 'Bay Execution',
      email: 'service@carbondepartment.ph',
      icon: <Wrench size={16} className="text-cyan-400" />,
    },
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    setRole(r.id);
    setEmail(r.email);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const currentRole = roles.find((r) => r.id === role)!;
    const session: UserSession = {
      name: currentRole.name,
      email,
      role,
      roleTitle: currentRole.title,
    };

    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-[#101118] border border-cyan-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08080A] border border-cyan-500/30 text-xs text-[#00F0FF] font-semibold">
            <LockKeyhole size={12} />
            <span>CARBONTRACK AUTHENTICATION</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight font-sans">
            Staff &amp; Admin Login
          </h3>
          <p className="text-xs text-slate-400">
            Access private vehicle records, digital job orders, and pre-inspection photos.
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="space-y-2">
          <label className="text-[11px] text-slate-400 uppercase font-medium">Select Role Profile</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-[#08080A] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    {r.icon}
                    {active && <CheckCircle2 size={12} className="text-[#00F0FF]" />}
                  </div>
                  <div className="text-xs font-bold text-white truncate">{r.name}</div>
                  <div className="text-[9px] text-cyan-400 truncate">{r.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Email Identifier</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#08080A] border border-white/10 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Password / Access Key</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#08080A] border border-white/10 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <LockKeyhole size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            {error && <p className="text-[11px] text-rose-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn-primary-cyan w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Authorize &amp; Open CARBONTrack</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 text-center">
          Authorized Workshop Administration &amp; Record Access Only
        </div>

      </div>
    </div>
  );
};
