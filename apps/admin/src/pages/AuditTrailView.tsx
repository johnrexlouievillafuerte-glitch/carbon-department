import React from 'react';
import { History } from 'lucide-react';
import { EmptyState } from '@carbon/ui';
import type { AuditEntry } from '@carbon/ui';

interface AuditTrailViewProps {
  logs: AuditEntry[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
          Security &amp; System Audit Trail
        </h2>
        <p className="text-xs text-[#9A9A9A]">
          Immutable server-side activity log recording every record view, stage mutation, photo upload, and user login.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={History}
            title="No audit entries yet. User activities and record mutations will be logged automatically."
          />
        </div>
      ) : (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0F10] text-[#9A9A9A] font-mono">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Operator / Role</th>
                  <th className="p-4 font-medium">Action</th>
                  <th className="p-4 font-medium">Target Record</th>
                  <th className="p-4 font-medium">Event Details</th>
                  <th className="p-4 font-medium text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-[#9A9A9A] whitespace-nowrap">
                      {log.created_at}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-medium text-[#F2F2F0] block font-sans">
                        {log.username}
                      </span>
                      <span className="text-[10px] text-[#00B8F0] block">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#0F0F10] border border-white/[0.08] text-[#F2F2F0] text-[11px] font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-[#9A9A9A] truncate max-w-xs">
                      {log.target || '—'}
                    </td>
                    <td className="p-4 text-[#F2F2F0] font-sans">
                      {log.details}
                    </td>
                    <td className="p-4 text-right text-[#9A9A9A]/60 text-[11px]">
                      {log.ip_address || 'Localhost'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
