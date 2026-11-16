import React, { useState } from 'react';
import { Shield, User as UserIcon, Plus } from 'lucide-react';
import { Button, Input, Select, Modal } from '@carbon/ui';
import { api } from '../api';
import type { User } from '@carbon/ui';

interface UsersViewProps {
  users: User[];
  onRefresh: () => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onRefresh }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Staff'>('Staff');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim() || !password) {
      setError('Username, display name, and initial password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createUser({
        username: username.trim(),
        display_name: displayName.trim(),
        email: email.trim(),
        role,
        password,
      });
      setUsername('');
      setDisplayName('');
      setEmail('');
      setPassword('');
      setOpenAdd(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create user account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Users &amp; Role-Based Access Control
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Manage workshop personnel credentials and system authorizations (Admin / Staff).
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={() => setOpenAdd(true)}>
          <Plus size={15} /> <span>Add Operator Account</span>
        </Button>
      </div>

      <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0F0F10] text-[#9A9A9A] font-mono">
                <th className="p-4 font-medium">Display Name</th>
                <th className="p-4 font-medium">Username</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium text-right">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[4px] bg-[#0F0F10] border border-white/[0.08] flex items-center justify-center text-[#00B8F0]">
                        {u.role === 'Admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                      </div>
                      <span className="font-medium text-[#F2F2F0]">{u.display_name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#00B8F0]">{u.username}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-[4px] text-[11px] font-mono font-medium ${
                        u.role === 'Admin'
                          ? 'bg-[#00B8F0]/15 text-[#00B8F0] border border-[#00B8F0]/30'
                          : 'bg-[#0F0F10] text-[#9A9A9A] border border-white/[0.08]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#9A9A9A]">{u.email || '—'}</td>
                  <td className="p-4 text-right">
                    {u.must_change_password ? (
                      <span className="text-[#FF9F5A] text-[11px] font-mono">
                        Must Change Password
                      </span>
                    ) : (
                      <span className="text-[#2DD4A0] text-[11px] font-mono">
                        Active &amp; Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Create Workshop Operator Account">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Username *"
              placeholder="e.g. ramjay"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Display Name *"
              placeholder="e.g. Ramjay Anor"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Role Authorization *"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              options={[
                { value: 'Staff', label: 'Staff — Workshop Floor Access' },
                { value: 'Admin', label: 'Admin — Full System & Security Access' },
              ]}
            />
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="staff@domain.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            label="Initial Password (min 8 characters) *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-[11px] text-[#9A9A9A]">
            Staff roles have access to operations and vehicle records, but cannot access user management or immutable audit logs.
          </p>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
            <Button type="button" variant="secondary" size="md" className="text-center justify-center" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
