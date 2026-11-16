import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button, Input } from '@carbon/ui';
import { api } from '../api';
import type { User } from '@carbon/ui';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // First-time password change modal state
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await api.login(username.trim(), password);
      if (user.must_change_password) {
        setPendingUser(user);
      } else {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setChangeError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    setChangeError('');

    try {
      await api.changePassword(password, newPassword);
      if (pendingUser) {
        onLoginSuccess({ ...pendingUser, must_change_password: false });
      }
    } catch (err: any) {
      setChangeError(err.message || 'Failed to update password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] flex flex-col justify-between p-4 sm:p-6 text-[#F2F2F0]">
      <div />

      <main className="w-full max-w-md mx-auto my-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src="/assets/logo.png"
              alt="Carbon Department Official Logo"
              className="h-14 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-[#F2F2F0] tracking-tight">
              CarbonTrack
            </h1>
            <p className="text-xs text-[#9A9A9A] mt-1 font-body">
              Automotive Repair Management · Cainta Facility
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#161617] p-8 rounded-[8px] border border-white/[0.08] shadow-2xl space-y-6">
          {pendingUser ? (
            /* First-time password change prompt */
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-heading font-semibold text-[#F2F2F0]">
                  Set New Password
                </h2>
                <p className="text-xs text-[#9A9A9A]">
                  This account was created with temporary credentials. Please set a secure personal password.
                </p>
              </div>

              {changeError && (
                <div className="p-3 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C] flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{changeError}</span>
                </div>
              )}

              <Input
                label="New Password (min 8 characters) *"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                disabled={changingPassword}
              >
                {changingPassword ? 'Updating...' : 'Set Password & Enter'}
              </Button>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C] flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Username or Email"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-11 px-3.5 pr-10 rounded-[6px] text-sm bg-[#0F0F10] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#F2F2F0] focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-center justify-center text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#9A9A9A]/60 font-mono">
                  Forgot password? Contact the facility owner.
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Privacy Footnote */}
        <div className="text-center text-[11px] text-[#9A9A9A]/60 space-y-1">
          <p>
            Protected automotive repair record system in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).
          </p>
          <p>
            Authorized workshop personnel only. All access is logged to the security audit trail.
          </p>
        </div>
      </main>

      <div />
    </div>
  );
};
