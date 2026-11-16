import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Users, 
  AlertCircle, 
  FileSpreadsheet
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';

interface AdminLoginPageProps {
  onReturnToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onReturnToPublic }) => {
  const { login } = useCarbon();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('carbon2026');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Staff'>('Admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide valid login credentials.');
      return;
    }

    if (password !== 'carbon2026' && password !== 'admin' && password !== 'staff') {
      setError('Invalid password. Demo password is: carbon2026');
      return;
    }

    const userName = selectedRole === 'Admin' ? 'Ramjay Anor' : 'Arman Boadilla';
    login(selectedRole, userName);
  };

  const handleQuickLogin = (role: 'Admin' | 'Staff', name: string) => {
    login(role, name);
  };

  return (
    <div className="min-h-screen bg-carbon-twill text-slate-100 flex flex-col justify-between font-body selection:bg-[#7B93BE]/30">
      
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-[#7B93BE]/20 bg-[#0B0D12]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center clip-brand">
            <span className="font-heading font-extrabold text-sm text-white">CD</span>
          </div>
          <div>
            <span className="text-sm font-heading font-extrabold text-white tracking-tight uppercase">
              CARBON <span className="text-[#7B93BE] font-normal">DEPARTMENT</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-mono-code -mt-0.5">
              Automotive Repair Management System
            </span>
          </div>
        </div>

        <button
          onClick={onReturnToPublic}
          className="text-xs font-heading font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151922] border border-[#7B93BE]/30 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} className="text-[#FFB020]" />
          <span>Return to Public Site</span>
        </button>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg glass-navy p-6 sm:p-8 rounded-3xl border border-[#7B93BE]/35 clip-brand-lg shadow-2xl space-y-6 relative">
          <div className="brand-corner-tr" />
          <div className="brand-corner-bl" />

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center mx-auto text-[#FFB020] shadow-md clip-brand">
              <Lock size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
              Workshop Management Portal
            </h1>
            <p className="text-xs text-slate-300 font-body max-w-md mx-auto">
              Automotive Repair Management System for job orders, intake condition photos, repair progress tracking, and permanent digital archiving.
            </p>
          </div>

          {/* Critical Privacy & SAD Scope Notice */}
          <div className="p-3.5 rounded-xl bg-[#11141C] border-l-4 border-[#FFB020] border-y border-r border-[#7B93BE]/25 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-white">
              <ShieldCheck size={14} className="text-[#10B981]" />
              <span>Confidentiality &amp; Scope Notice</span>
            </div>
            <p className="text-[11px] text-slate-300 font-body leading-relaxed">
              Records are private, client-confidential, and encrypted in compliance with <strong className="text-white">RA 10173 (Data Privacy Act)</strong>. Archived vehicle records are never discarded.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono-code text-[#7B93BE]">
              <FileSpreadsheet size={12} className="text-[#10B981]" />
              <span>Scope Note: Accounting, payroll &amp; parts purchases remain in Excel.</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs font-body flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Access Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('Admin');
                    setUsername('admin');
                  }}
                  className={`py-2 rounded-lg text-xs font-heading font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRole === 'Admin'
                      ? 'bg-[#172B57] border-[#FFB020] text-white shadow-md'
                      : 'bg-[#11141C] border-[#7B93BE]/30 text-slate-400'
                  }`}
                >
                  <ShieldCheck size={13} className={selectedRole === 'Admin' ? 'text-[#FFB020]' : ''} />
                  <span>Admin (Management)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('Staff');
                    setUsername('staff');
                  }}
                  className={`py-2 rounded-lg text-xs font-heading font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRole === 'Staff'
                      ? 'bg-[#172B57] border-[#FFB020] text-white shadow-md'
                      : 'bg-[#11141C] border-[#7B93BE]/30 text-slate-400'
                  }`}
                >
                  <Users size={13} className={selectedRole === 'Staff' ? 'text-[#FFB020]' : ''} />
                  <span>Staff (Shop Floor)</span>
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Username / Identifier
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                placeholder="admin or staff"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Encrypted Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg btn-amber text-xs uppercase tracking-wider font-semibold cursor-pointer clip-tr shadow-lg shadow-[#FFB020]/25 mt-2"
            >
              Authenticate &amp; Enter System
            </button>
          </form>

          {/* Quick Demo Evaluation Buttons */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 block text-center">
              Quick Evaluator Demo Logins (1-Click Access)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Admin', 'Ramjay Anor')}
                className="p-2 rounded-lg bg-[#172B57]/60 hover:bg-[#172B57] border border-[#7B93BE]/40 text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-heading font-bold text-white block">
                  Ramjay Anor
                </span>
                <span className="text-[10px] font-mono-code text-[#FFB020]">
                  Admin · Co-Owner / Lead
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Staff', 'Arman Boadilla')}
                className="p-2 rounded-lg bg-[#172B57]/60 hover:bg-[#172B57] border border-[#7B93BE]/40 text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-heading font-bold text-white block">
                  Arman Boadilla
                </span>
                <span className="text-[10px] font-mono-code text-[#7B93BE]">
                  Staff · Technical Lead
                </span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="p-4 text-center text-xs text-slate-500 font-mono-code border-t border-[#7B93BE]/15">
        Carbon Department Auto Body &amp; Repair Services Co. · 009 Felix Ave., Cainta, Rizal
      </footer>

    </div>
  );
};
