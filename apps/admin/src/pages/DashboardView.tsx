import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  Wrench,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { StageBadge, ProgressRing, PlateBadge, JobTag, Button, EmptyState } from '@carbon/ui';
import { api } from '../api';
import type { DashboardStats, AttentionItem, JobOrder, Vehicle, Customer } from '@carbon/ui';

interface DashboardViewProps {
  onNavigateToTab: (tab: any) => void;
  onOpenNewJob: () => void;
  onSelectJob: (job: JobOrder) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  onOpenNewJob,
  onSelectJob,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attention, setAttention] = useState<AttentionItem[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [s, att, jobs, veh, cust] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAttention().catch(() => ({ items: [] })),
        api.getJobOrders().catch(() => []),
        api.getVehicles().catch(() => []),
        api.getCustomers().catch(() => []),
      ]);
      setStats(s);
      setAttention(att.items || []);
      setJobOrders(jobs);
      setVehicles(veh);
      setCustomers(cust);
    } finally {
      setLoading(false);
    }
  };

  const activeQueue = jobOrders.filter((j) => j.stage !== 'Released' && !j.is_archived);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* 1. 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Jobs */}
        <div
          onClick={() => onNavigateToTab('job-orders')}
          className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-2 cursor-pointer hover:border-white/[0.2] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
            <span className="font-mono uppercase tracking-wider">Active Jobs</span>
            <ClipboardList size={16} className="text-[#00B8F0]" />
          </div>
          <div className="font-mono text-3xl font-semibold text-[#F2F2F0]">
            {stats ? stats.active : 0}
          </div>
          <p className="text-xs text-[#9A9A9A] truncate">
            {stats && stats.active > 0 ? `${stats.active} units in facility bays` : 'No active jobs on floor'}
          </p>
        </div>

        {/* KPI 2: In Repair / Paint */}
        <div
          onClick={() => onNavigateToTab('progress')}
          className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-2 cursor-pointer hover:border-white/[0.2] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
            <span className="font-mono uppercase tracking-wider">In Repair</span>
            <Wrench size={16} className="text-[#00B8F0]" />
          </div>
          <div className="font-mono text-3xl font-semibold text-[#F2F2F0]">
            {stats ? stats.in_repair : 0}
          </div>
          <p className="text-xs text-[#9A9A9A] truncate">
            {stats && stats.in_repair > 0 ? 'Active hoists & paint spray booth' : 'Bays currently open'}
          </p>
        </div>

        {/* KPI 3: Ready for Release */}
        <div
          onClick={() => onNavigateToTab('job-orders')}
          className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-2 cursor-pointer hover:border-white/[0.2] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
            <span className="font-mono uppercase tracking-wider">Ready for Release</span>
            <CheckCircle2 size={16} className="text-[#2DD4A0]" />
          </div>
          <div className="font-mono text-3xl font-semibold text-[#2DD4A0]">
            {stats ? stats.ready : 0}
          </div>
          <p className="text-xs text-[#9A9A9A] truncate">
            {stats && stats.ready > 0 ? 'Passed final inspection' : 'No vehicles awaiting pickup'}
          </p>
        </div>

        {/* KPI 4: Pending Bookings */}
        <div
          onClick={() => onNavigateToTab('bookings')}
          className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-2 cursor-pointer hover:border-white/[0.2] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
            <span className="font-mono uppercase tracking-wider">Bookings Today</span>
            <Calendar size={16} className="text-[#FF9F5A]" />
          </div>
          <div className="font-mono text-3xl font-semibold text-[#F2F2F0]">
            {stats ? stats.bookings_pending : 0}
          </div>
          <p className="text-xs text-[#9A9A9A] truncate">
            {stats && stats.bookings_pending > 0 ? 'Slot requests awaiting confirmation' : 'Zero unreviewed requests'}
          </p>
        </div>
      </div>

      {/* 2. "Needs Attention" List */}
      <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-sm font-heading font-semibold text-[#F2F2F0]">
            <AlertTriangle size={16} className="text-[#FF9F5A]" />
            <span>Needs Attention</span>
          </div>
          <span className="text-xs text-[#9A9A9A] font-mono">
            {attention.length} {attention.length === 1 ? 'Action' : 'Actions'} Pending
          </span>
        </div>

        {attention.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <p className="text-sm font-medium text-[#2DD4A0]">All clear</p>
            <p className="text-xs text-[#9A9A9A]">
              No missing intake condition photos, overdue customer approvals, or unlinked documents.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {attention.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF9F5A]" />
                  <span className="text-[#F2F2F0] font-medium">{item.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (item.type === 'pending_booking') onNavigateToTab('bookings');
                    else if (item.type === 'missing_photos') onNavigateToTab('intake-photos');
                    else onNavigateToTab('job-orders');
                  }}
                  className="text-[#00B8F0] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  Review <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Active Queue Table */}
      <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="space-y-0.5">
            <h3 className="text-base font-heading font-semibold text-[#F2F2F0]">
              Active Repair Queue
            </h3>
            <p className="text-xs text-[#9A9A9A]">
              Vehicles actively admitted to workshop bays.
            </p>
          </div>

          <Button variant="secondary" size="sm" className="text-center justify-center" onClick={() => onNavigateToTab('job-orders')}>
            View All Jobs
          </Button>
        </div>

        {activeQueue.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No job orders yet. Create an intake job order to start tracking repairs."
            action="Create Job Order"
            onAction={onOpenNewJob}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#9A9A9A] font-mono">
                  <th className="pb-3 font-medium">Job No.</th>
                  <th className="pb-3 font-medium">Plate</th>
                  <th className="pb-3 font-medium">Vehicle / Customer</th>
                  <th className="pb-3 font-medium">Stage</th>
                  <th className="pb-3 font-medium text-center">Progress</th>
                  <th className="pb-3 font-medium">Target ETA</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {activeQueue.map((job) => {
                  const veh = vehicles.find((v) => v.id === job.vehicle_id);
                  const cust = customers.find((c) => c.id === job.customer_id);

                  const stageProgressMap: Record<string, number> = {
                    Received: 12,
                    'Pre-Inspection': 25,
                    'Estimate/Approval': 40,
                    'In Repair': 65,
                    'Finishing/Paint': 82,
                    'Final Assessment': 94,
                    'Ready for Release': 100,
                  };

                  return (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 font-mono">
                        <JobTag code={job.job_no} />
                      </td>
                      <td className="py-3.5">
                        {veh ? <PlateBadge plate={veh.plate_number} /> : '—'}
                      </td>
                      <td className="py-3.5">
                        <span className="font-medium text-[#F2F2F0] block">
                          {veh ? `${veh.year} ${veh.make} ${veh.model}` : 'Vehicle'}
                        </span>
                        <span className="text-[11px] text-[#9A9A9A] block">
                          {cust ? cust.name : 'Client'}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <StageBadge stage={job.stage} />
                      </td>
                      <td className="py-3.5 text-center">
                        <ProgressRing
                          percent={stageProgressMap[job.stage] || 0}
                          size={36}
                          stroke={3}
                        />
                      </td>
                      <td className="py-3.5 font-mono text-[#9A9A9A]">
                        {job.estimated_release || '—'}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-xs text-[#00B8F0] font-medium">
                          Details &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
