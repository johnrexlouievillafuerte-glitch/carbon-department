import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Camera, 
  Users, 
  Car, 
  Activity, 
  Calendar, 
  FolderLock, 
  History, 
  Plus, 
  Search, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  ChevronRight, 
  Printer, 
  Moon, 
  Sun,
  Phone,
  Mail
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';
import { 
  ProgressGauge, 
  PlateBadge, 
  JobOrderTag, 
  StageBadge 
} from '../components/common/BrandComponents';
import type { JobStage, JobOrder } from '../data/carbonStore';
import { STAGES_LIST } from '../data/carbonStore';
import { CreateJobOrderModal } from '../components/admin/CreateJobOrderModal';
import { IntakePhotoUploaderModal } from '../components/admin/IntakePhotoUploaderModal';
import { GlobalSearchModal } from '../components/admin/GlobalSearchModal';
import { PrintJobOrderModal } from '../components/admin/PrintJobOrderModal';

interface AdminPageProps {
  onNavigatePublic: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigatePublic }) => {
  const { 
    customers, 
    vehicles, 
    jobOrders, 
    bookings, 
    documents, 
    auditLogs, 
    session, 
    logout, 
    theme, 
    toggleTheme, 
    updateJobStage, 
    addProgressUpdate,
    updateBookingStatus,
    convertBookingToJobOrder
  } = useCarbon();

  // Navigation tabs
  type AdminTab = 
    | 'dashboard' 
    | 'jobOrders' 
    | 'photos' 
    | 'customers' 
    | 'vehicles' 
    | 'progress' 
    | 'bookings' 
    | 'documents' 
    | 'audit';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Selected entities
  const [selectedJobId, setSelectedJobId] = useState<string>(jobOrders[0]?.id || '');
  const [jobFilter, setJobFilter] = useState<'all' | 'active' | 'in_repair' | 'ready' | 'released'>('active');
  const [divisionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isPhotoUploaderOpen, setIsPhotoUploaderOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [printingJob, setPrintingJob] = useState<JobOrder | null>(null);

  // Quick note modal
  const [newProgressNote, setNewProgressNote] = useState('');

  // Active Selected Job
  const activeJob = jobOrders.find((j) => j.id === selectedJobId) || jobOrders[0];
  const activeVehicle = activeJob ? vehicles.find((v) => v.id === activeJob.vehicleId) : null;

  // Filtered Job Orders
  const filteredJobs = jobOrders.filter((job) => {
    const v = vehicles.find((veh) => veh.id === job.vehicleId);
    const c = customers.find((cust) => cust.id === job.customerId);
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch = 
      !term ||
      job.jobNo.toLowerCase().includes(term) ||
      (v && v.plateNumber.toLowerCase().replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))) ||
      (c && c.name.toLowerCase().includes(term)) ||
      job.services.some((s) => s.toLowerCase().includes(term));

    const matchesDivision = divisionFilter === 'all' || job.division === divisionFilter;

    let matchesStatus = true;
    if (jobFilter === 'active') matchesStatus = job.stage !== 'Released';
    else if (jobFilter === 'in_repair') matchesStatus = job.stage === 'In Repair' || job.stage === 'Finishing/Paint';
    else if (jobFilter === 'ready') matchesStatus = job.stage === 'Ready for Release';
    else if (jobFilter === 'released') matchesStatus = job.stage === 'Released';

    return matchesSearch && matchesDivision && matchesStatus;
  });

  // Dashboard Metrics
  const activeJobsCount = jobOrders.filter((j) => j.stage !== 'Released').length;
  const inRepairCount = jobOrders.filter((j) => j.stage === 'In Repair' || j.stage === 'Finishing/Paint').length;
  const readyCount = jobOrders.filter((j) => j.stage === 'Ready for Release').length;
  const todayBookingsCount = bookings.filter((b) => b.status === 'Pending' || b.status === 'Approved').length;
  const totalPermanentDocs = documents.length;

  const handleAdvanceStage = (jobId: string, nextStage: JobStage) => {
    updateJobStage(jobId, nextStage, newProgressNote || undefined);
    setNewProgressNote('');
  };

  const handleAddProgress = (jobId: string) => {
    if (!newProgressNote.trim()) return;
    addProgressUpdate(jobId, newProgressNote);
    setNewProgressNote('');
  };

  return (
    <div className="min-h-screen bg-carbon-twill text-[#EEF1F6] flex flex-col font-body selection:bg-[#7B93BE]/30">
      
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0D12]/95 border-b border-[#7B93BE]/25 px-4 sm:px-6 py-3 backdrop-blur-md flex items-center justify-between shadow-lg">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center clip-brand shadow">
            <span className="font-heading font-extrabold text-sm text-white">CD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-white tracking-tight uppercase">
                CARBON<span className="text-[#7B93BE]">Track</span>
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#172B57] text-[#FFB020] border border-[#7B93BE]/30 font-semibold">
                SAD Management System
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Carbon Department Auto Body &amp; Repair Services Co. · Cainta, Rizal
            </span>
          </div>
        </div>

        {/* Global Search & Fast Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Rapid Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151922] hover:bg-[#172B57] border border-[#7B93BE]/30 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer shadow-inner"
          >
            <Search size={13} className="text-[#FFB020]" />
            <span className="hidden md:inline font-mono-code text-[11px]">Plate / Job Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono-code rounded bg-black/40 text-slate-400 border border-white/10">
              Ctrl+K
            </kbd>
          </button>

          {/* New Job Order Quick Button */}
          <button
            onClick={() => setIsCreateJobOpen(true)}
            className="btn-amber px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 clip-tr shadow-md"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Job Order</span>
          </button>

          {/* Intake Photo Quick Button */}
          <button
            onClick={() => setIsPhotoUploaderOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white border border-[#7B93BE]/40 text-xs font-heading font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Camera size={13} className="text-[#FFB020]" />
            <span className="hidden sm:inline">Intake Photo</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg neu-control flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={13} className="text-[#FFB020]" /> : <Moon size={13} />}
          </button>

          {/* User Profile Pill & Return */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="text-right hidden lg:block">
              <span className="text-xs font-heading font-bold text-white block">
                {session?.name || 'Ramjay Anor'}
              </span>
              <span className="text-[10px] font-mono-code text-[#FFB020] block -mt-0.5">
                {session?.role || 'Admin'} · Active
              </span>
            </div>

            <button
              onClick={onNavigatePublic}
              className="px-2.5 py-1.5 rounded-lg bg-[#151922] hover:bg-[#172B57] text-slate-300 hover:text-white text-xs font-semibold border border-[#7B93BE]/30 flex items-center gap-1 cursor-pointer"
              title="Return to Public Customer Website"
            >
              <ExternalLink size={12} className="text-[#7B93BE]" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-[#151922] hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-[#7B93BE]/30 cursor-pointer"
              title="Logout Session"
            >
              <LogOut size={14} />
            </button>
          </div>

        </div>

      </header>

      {/* Main Layout: Sub-Navigation Tabs & Views */}
      <div className="flex-1 flex flex-col">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-[#0E121B] border-b border-[#7B93BE]/20 px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-2 text-xs font-heading font-semibold">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'jobOrders', label: `Job Orders (${activeJobsCount})`, icon: ClipboardList },
            { id: 'photos', label: 'Intake Photos', icon: Camera },
            { id: 'progress', label: 'Repair Progress', icon: Activity },
            { id: 'bookings', label: `Bookings (${todayBookingsCount})`, icon: Calendar },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'vehicles', label: `Vehicles (${vehicles.length})`, icon: Car },
            { id: 'documents', label: `Document Vault (${totalPermanentDocs})`, icon: FolderLock },
            { id: 'audit', label: 'Audit Trail', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#172B57] text-[#FFB020] border border-[#7B93BE]/50 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#FFB020]' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ================================================================ */}
          {/* TAB 1: DASHBOARD OVERVIEW                                        */}
          {/* ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Banner Notice */}
              <div className="glass-navy p-4 rounded-2xl border border-[#7B93BE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#172B57] border border-[#7B93BE]/40 flex items-center justify-center text-[#10B981] clip-brand shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold text-white">
                      System Operational · Cainta Workshop Facility
                    </h3>
                    <p className="text-xs text-slate-300 font-body">
                      Solving paper record loss and unlinked intake photos. Records are permanently stored and never discarded.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsCreateJobOpen(true)}
                    className="btn-amber px-4 py-1.5 rounded-lg text-xs uppercase font-semibold cursor-pointer clip-tr shadow"
                  >
                    + New Job Order
                  </button>
                </div>
              </div>

              {/* Glass Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Active Jobs */}
                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 clip-brand space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
                    <span>ACTIVE JOBS</span>
                    <ClipboardList size={16} className="text-[#FFB020]" />
                  </div>
                  <div className="font-mono-code text-3xl font-extrabold text-white">
                    {activeJobsCount}
                    <span className="text-xs text-slate-400 font-normal"> units</span>
                  </div>
                  <div className="text-[11px] text-[#7B93BE] flex items-center gap-1 font-body">
                    <span>In progress on shop bays</span>
                  </div>
                </div>

                {/* In Repair & Paint */}
                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 clip-brand space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
                    <span>IN REPAIR / PAINT</span>
                    <Wrench size={16} className="text-cyan-400" />
                  </div>
                  <div className="font-mono-code text-3xl font-extrabold text-white">
                    {inRepairCount}
                  </div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-body">
                    <span>Active hoist &amp; paint bake</span>
                  </div>
                </div>

                {/* Ready for Release */}
                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 clip-brand space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
                    <span>READY FOR RELEASE</span>
                    <CheckCircle2 size={16} className="text-[#10B981]" />
                  </div>
                  <div className="font-mono-code text-3xl font-extrabold text-[#10B981]">
                    {readyCount}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-body">
                    <span>Inspected &amp; cleared</span>
                  </div>
                </div>

                {/* Pending Bookings */}
                <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 clip-brand space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
                    <span>TODAY'S BOOKINGS</span>
                    <Calendar size={16} className="text-[#FFB020]" />
                  </div>
                  <div className="font-mono-code text-3xl font-extrabold text-white">
                    {todayBookingsCount}
                  </div>
                  <div className="text-[11px] text-amber-300 font-body">
                    <span>Online consultation slots</span>
                  </div>
                </div>

              </div>

              {/* Status Breakdown Bar */}
              <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono-code uppercase tracking-wider text-[#FFB020] font-semibold">
                    Live Status Distribution Across Workshop
                  </h4>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    Shop Bay Capacity: {activeJobsCount} / 6
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                  {[
                    { stage: 'Received', count: jobOrders.filter(j => j.stage === 'Received').length },
                    { stage: 'Pre-Inspection', count: jobOrders.filter(j => j.stage === 'Pre-Inspection').length },
                    { stage: 'Estimate/Approval', count: jobOrders.filter(j => j.stage === 'Estimate/Approval').length },
                    { stage: 'In Repair', count: jobOrders.filter(j => j.stage === 'In Repair').length },
                    { stage: 'Finishing/Paint', count: jobOrders.filter(j => j.stage === 'Finishing/Paint').length },
                    { stage: 'Final Assessment', count: jobOrders.filter(j => j.stage === 'Final Assessment').length },
                    { stage: 'Ready for Release', count: jobOrders.filter(j => j.stage === 'Ready for Release').length },
                  ].map((s) => (
                    <div key={s.stage} className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 text-center space-y-1">
                      <span className="text-[10px] font-mono-code text-slate-400 block truncate">
                        {s.stage}
                      </span>
                      <span className="font-mono-code text-lg font-bold text-white block">
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asymmetrical Two Columns: Active Job Queue vs Pending Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Jobs Queue (8 Cols) */}
                <div className="lg:col-span-8 glass-navy p-6 rounded-2xl border border-[#7B93BE]/25 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={16} className="text-[#FFB020]" />
                      <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                        Active Shop Floor Queue
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('jobOrders')}
                      className="text-xs font-mono-code text-[#FFB020] hover:underline"
                    >
                      View All Job Orders &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {jobOrders.filter(j => j.stage !== 'Released').slice(0, 4).map((job) => {
                      const veh = vehicles.find((v) => v.id === job.vehicleId);
                      const cust = customers.find((c) => c.id === job.customerId);
                      return (
                        <div
                          key={job.id}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setActiveTab('jobOrders');
                          }}
                          className="p-4 rounded-xl bg-[#11141C] hover:bg-[#172B57] border border-[#7B93BE]/25 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {veh && <PlateBadge plate={veh.plateNumber} size="sm" />}
                              <JobOrderTag code={job.jobNo} />
                              <StageBadge stage={job.stage} />
                            </div>
                            <h5 className="text-xs font-heading font-bold text-white">
                              {veh?.year} {veh?.make} {veh?.model} · <span className="text-slate-300 font-normal">{cust?.name}</span>
                            </h5>
                            <p className="text-[11px] text-slate-400 font-body line-clamp-1">
                              {job.services.join(' • ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <span className="font-mono-code font-bold text-sm text-white block">
                                {job.progressPercent}%
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono-code">
                                Est: {job.estimatedRelease}
                              </span>
                            </div>
                            <ChevronRight size={16} className="text-[#7B93BE]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Pending Approvals & Bookings (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Pending Consultation Bookings */}
                  <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Pending Reservations ({bookings.filter(b => b.status === 'Pending').length})
                      </h4>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-[10px] font-mono-code text-[#FFB020]"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-2">
                      {bookings.filter(b => b.status === 'Pending').slice(0, 3).map((b) => (
                        <div key={b.id} className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-heading font-bold text-white">{b.customerName}</span>
                            <span className="font-mono-code text-[10px] text-[#FFB020]">{b.preferredDate}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] line-clamp-1">
                            {b.plateNumber} · {b.serviceRequested}
                          </p>
                          <div className="pt-1 flex gap-2">
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Approved')}
                              className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] cursor-pointer"
                            >
                              Approve Slot
                            </button>
                            <button
                              onClick={() => convertBookingToJobOrder(b.id)}
                              className="px-2 py-0.5 rounded bg-[#172B57] text-white border border-[#7B93BE]/40 text-[10px] cursor-pointer"
                            >
                              Convert to Job Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permanent Archive Status */}
                  <div className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/25 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-heading font-bold text-white">
                      <FolderLock size={15} className="text-[#10B981]" />
                      <span>Permanent Retention Vault</span>
                    </div>
                    <p className="text-xs text-slate-300 font-body leading-relaxed">
                      All <strong className="text-white">{documents.length} archived documents</strong> and pre-repair intake photos are permanently preserved with zero auto-delete.
                    </p>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="text-xs font-mono-code text-[#FFB020] hover:underline block pt-1"
                    >
                      Browse Document Archive &rarr;
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: JOB ORDERS MANAGEMENT                                     */}
          {/* ================================================================ */}
          {activeTab === 'jobOrders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                    Automotive Job Orders Registry
                  </h3>
                  <p className="text-xs text-slate-400 font-body">
                    Complete work orders, diagnosis checklists, technician assignments, and status transitions.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateJobOpen(true)}
                  className="btn-amber px-4 py-2 rounded-lg text-xs uppercase font-semibold cursor-pointer clip-tr flex items-center gap-1.5 shadow"
                >
                  <Plus size={14} />
                  <span>Create Job Order</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="glass-navy p-4 rounded-2xl border border-[#7B93BE]/25 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-80 relative">
                  <Search size={14} className="absolute left-3 top-3 text-[#7B93BE]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter by plate, job#, customer..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {[
                    { id: 'active', label: 'Active Jobs' },
                    { id: 'in_repair', label: 'In Repair/Paint' },
                    { id: 'ready', label: 'Ready for Release' },
                    { id: 'released', label: 'Released / Archived' },
                    { id: 'all', label: 'All Records' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setJobFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-heading font-semibold transition-all cursor-pointer ${
                        jobFilter === f.id
                          ? 'bg-[#172B57] text-[#FFB020] border border-[#7B93BE]/40'
                          : 'bg-[#11141C] text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Screen: Job Order List (Left) vs Detailed Stepper & Info (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Job Order List (5 Cols) */}
                <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => {
                      const veh = vehicles.find((v) => v.id === job.vehicleId);
                      const cust = customers.find((c) => c.id === job.customerId);
                      const isSelected = activeJob?.id === job.id;

                      return (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer clip-brand ${
                            isSelected
                              ? 'bg-[#172B57] border-[#FFB020] shadow-lg shadow-black/50'
                              : 'glass-navy border-[#7B93BE]/25 hover:border-[#7B93BE]/50 hover:bg-[#151922]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {veh && <PlateBadge plate={veh.plateNumber} size="sm" />}
                              <JobOrderTag code={job.jobNo} />
                            </div>
                            <span className="font-mono-code font-bold text-xs text-[#FFB020]">
                              {job.progressPercent}%
                            </span>
                          </div>

                          <h4 className="text-xs font-heading font-bold text-white">
                            {veh?.year} {veh?.make} {veh?.model}
                          </h4>
                          <p className="text-[11px] text-slate-300 font-body">
                            Owner: {cust?.name} ({cust?.phone})
                          </p>

                          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                            <StageBadge stage={job.stage} />
                            <span>Rec: {job.dateReceived}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 font-body text-xs glass-navy rounded-2xl">
                      No job orders match your criteria.
                    </div>
                  )}
                </div>

                {/* Right: Detailed Job View & Controls (7 Cols) */}
                <div className="lg:col-span-7">
                  {activeJob && activeVehicle ? (
                    <div className="glass-navy p-6 rounded-3xl border border-[#7B93BE]/30 clip-brand-lg space-y-6 shadow-2xl">
                      <div className="brand-corner-tr" />

                      {/* Header Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <PlateBadge plate={activeVehicle.plateNumber} size="md" />
                            <JobOrderTag code={activeJob.jobNo} />
                            <StageBadge stage={activeJob.stage} />
                          </div>
                          <h3 className="text-lg font-heading font-extrabold text-white">
                            {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.color})
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPrintingJob(activeJob)}
                            className="px-3 py-1.5 rounded-lg bg-[#11141C] hover:bg-[#172B57] text-white border border-[#7B93BE]/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={13} className="text-[#FFB020]" />
                            <span>Print Job Sheet</span>
                          </button>
                        </div>
                      </div>

                      {/* Circular Gauge Ring & Stage Controls */}
                      <div className="p-5 rounded-2xl bg-[#11141C] border border-[#7B93BE]/25 flex flex-col sm:flex-row items-center gap-6">
                        <ProgressGauge
                          percent={activeJob.progressPercent}
                          size={110}
                          stageName={activeJob.stage}
                        />

                        <div className="space-y-3 flex-1 text-center sm:text-left">
                          <div>
                            <span className="text-[10px] font-mono-code uppercase text-[#FFB020] font-bold block">
                              Advance Repair Stage:
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {STAGES_LIST.map((stg) => (
                                <button
                                  key={stg}
                                  onClick={() => handleAdvanceStage(activeJob.id, stg)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-mono-code font-semibold transition-all cursor-pointer border ${
                                    activeJob.stage === stg
                                      ? 'bg-[#FFB020] text-slate-950 font-bold border-[#FFB020]'
                                      : 'bg-[#172B57]/50 text-slate-300 border-[#7B93BE]/30 hover:bg-[#172B57]'
                                  }`}
                                >
                                  {stg}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono-code">
                            Assigned Leads: <strong className="text-white">{activeJob.assignedTechnicians.join(', ')}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Pre-Inspection Checklist Review */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                            Pre-Inspection &amp; Vehicle Condition Audit
                          </h4>
                          <span className="text-[10px] font-mono-code text-[#10B981]">
                            Verified at Intake
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-body p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20">
                          <div>✓ Body Condition: Verified clean</div>
                          <div>✓ Pre-existing damage: Recorded with owner</div>
                          <div>✓ Engine &amp; Brake fluids: Inspected</div>
                          <div>✓ Fuel Level: Quarter {activeJob.intakeChecklist?.fuelLevelQuarter || 3} of 4</div>
                        </div>

                        <p className="text-xs text-slate-300 italic bg-[#172B57]/40 p-3 rounded-xl border border-[#7B93BE]/30">
                          Walkaround Remark: {activeJob.intakeNotes}
                        </p>
                      </div>

                      {/* Intake Photos Quick Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                            Intake Photos ({activeJob.intakePhotos.length})
                          </h4>
                          <button
                            onClick={() => setIsPhotoUploaderOpen(true)}
                            className="text-xs font-mono-code text-[#FFB020] hover:underline"
                          >
                            + Attach Photo
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {activeJob.intakePhotos.map((photo) => (
                            <div key={photo.id} className="relative h-24 rounded-xl overflow-hidden bg-black border border-[#7B93BE]/30">
                              <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono-code text-white uppercase">
                                {photo.angle}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Work Note Form */}
                      <div className="p-4 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 space-y-3">
                        <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                          Log Technician Progress Note / Mid-Repair Update
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProgressNote}
                            onChange={(e) => setNewProgressNote(e.target.value)}
                            placeholder="e.g. Cleared 2nd clearcoat bake cycle; road-testing at Cainta bypass..."
                            className="flex-1 px-3 py-2 rounded-lg bg-[#0B0D12] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                          />
                          <button
                            onClick={() => handleAddProgress(activeJob.id)}
                            className="px-4 py-2 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white text-xs font-semibold cursor-pointer border border-[#7B93BE]/40 shrink-0"
                          >
                            Post Note
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="glass-navy p-12 text-center text-slate-400 font-body text-xs rounded-2xl">
                      Select a job order from the list to view full details.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: INTAKE PHOTOS MODULE                                      */}
          {/* ================================================================ */}
          {activeTab === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                    Pre-Repair Intake Condition Photos
                  </h3>
                  <p className="text-xs text-slate-400 font-body">
                    Prevents damage disputes by capturing Front, Rear, Left, Right, Damage Close-ups, and Odometer readings before work begins.
                  </p>
                </div>
                <button
                  onClick={() => setIsPhotoUploaderOpen(true)}
                  className="btn-amber px-4 py-2 rounded-lg text-xs uppercase font-semibold cursor-pointer clip-tr flex items-center gap-1.5 shadow"
                >
                  <Camera size={14} />
                  <span>Upload Intake Photo</span>
                </button>
              </div>

              {/* Gallery Grid of all intake photos across all vehicles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobOrders.flatMap((j) =>
                  j.intakePhotos.map((p) => {
                    const v = vehicles.find((veh) => veh.id === j.vehicleId);
                    return (
                      <div
                        key={p.id}
                        className="glass-navy rounded-2xl border border-[#7B93BE]/30 overflow-hidden clip-brand space-y-3 p-4 flex flex-col justify-between"
                      >
                        <div className="relative h-48 rounded-xl overflow-hidden bg-black border border-[#7B93BE]/20">
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#172B57]/90 text-white text-[10px] font-mono-code uppercase font-semibold border border-[#7B93BE]/40">
                            {p.angle.replace('_', ' ')}
                          </div>
                          {p.hasDamage && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600/90 text-white text-[9px] font-mono-code font-bold uppercase">
                              Pre-existing Scrape
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            {v && <PlateBadge plate={v.plateNumber} size="sm" />}
                            <JobOrderTag code={j.jobNo} />
                          </div>
                          <h4 className="text-xs font-heading font-bold text-white pt-1">
                            {p.label}
                          </h4>
                          <p className="text-[11px] text-slate-300 font-body">
                            {p.caption}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 text-[10px] font-mono-code text-slate-400 flex justify-between">
                          <span>Logged: {p.timestamp}</span>
                          <span className="text-[#10B981]">Permanently Linked</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: REPAIR PROGRESS TRACKING                                  */}
          {/* ================================================================ */}
          {activeTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                  Shop-Floor Repair Progress &amp; Customer Sync
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Any status advancement or technician note logged here immediately updates the customer's Track My Repair screen.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobOrders.filter(j => j.stage !== 'Released').map((job) => {
                  const veh = vehicles.find((v) => v.id === job.vehicleId);
                  const cust = customers.find((c) => c.id === job.customerId);

                  return (
                    <div
                      key={job.id}
                      className="glass-navy p-6 rounded-3xl border border-[#7B93BE]/30 clip-brand space-y-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {veh && <PlateBadge plate={veh.plateNumber} size="md" />}
                            <JobOrderTag code={job.jobNo} />
                          </div>
                          <h4 className="text-base font-heading font-bold text-white pt-1">
                            {veh?.year} {veh?.make} {veh?.model}
                          </h4>
                          <p className="text-xs text-slate-300 font-body">
                            Owner: <strong className="text-white">{cust?.name}</strong> · Division: <strong className="text-[#FFB020]">{job.division}</strong>
                          </p>
                        </div>

                        <ProgressGauge
                          percent={job.progressPercent}
                          size={90}
                          stageName={job.stage}
                        />
                      </div>

                      {/* Stage Advancement Quick Stepper */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono-code uppercase text-[#FFB020] font-bold block">
                          Current Stage: {job.stage} ({job.progressPercent}%)
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {STAGES_LIST.map((stg) => (
                            <button
                              key={stg}
                              onClick={() => updateJobStage(job.id, stg)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-colors border ${
                                job.stage === stg
                                  ? 'bg-[#FFB020] text-slate-950 font-bold border-[#FFB020]'
                                  : 'bg-[#11141C] text-slate-400 border-[#7B93BE]/30 hover:text-white'
                              }`}
                            >
                              {stg}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Latest Progress Logs */}
                      <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                        <span className="text-[10px] font-mono-code uppercase text-[#7B93BE] font-bold block">
                          Execution History
                        </span>
                        {job.progressLogs.slice(-2).map((log) => (
                          <div key={log.id} className="p-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/20 space-y-0.5">
                            <div className="flex justify-between text-[10px] font-mono-code">
                              <span className="text-[#FFB020]">{log.stage}</span>
                              <span className="text-slate-500">{log.timestamp}</span>
                            </div>
                            <p className="text-slate-200 text-xs font-body">{log.note}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: BOOKINGS & BAY SCHEDULE                                   */}
          {/* ================================================================ */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                    Visit Bookings &amp; Bay Schedule
                  </h3>
                  <p className="text-xs text-slate-400 font-body">
                    Customer appointment requests. Approve, reschedule, or convert directly into an official Job Order.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="glass-navy p-5 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <PlateBadge plate={booking.plateNumber} size="sm" />
                        <span
                          className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded font-bold ${
                            booking.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : booking.status === 'Converted'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                              : 'bg-amber-950 text-amber-300 border border-amber-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-heading font-bold text-white">
                        {booking.customerName}
                      </h4>
                      <p className="text-xs text-slate-300 font-body">
                        {booking.makeModel} ({booking.year})
                      </p>

                      <div className="p-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/20 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-[#FFB020] font-mono-code text-[11px]">
                          <Calendar size={12} />
                          <span>{booking.preferredDate} ({booking.preferredTime})</span>
                        </div>
                        <p className="text-slate-300 text-[11px] font-body">
                          {booking.serviceRequested}
                        </p>
                        {booking.notes && (
                          <p className="text-slate-400 text-[10px] italic">
                            "{booking.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      {booking.status !== 'Converted' ? (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-semibold cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => convertBookingToJobOrder(booking.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white border border-[#7B93BE]/40 text-xs font-semibold cursor-pointer"
                          >
                            Convert to Job Order &rarr;
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-mono-code text-cyan-400">
                          Converted to Active Job Order
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 6: CUSTOMERS DIRECTORY                                       */}
          {/* ================================================================ */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                  Customer Directory &amp; Vehicle Ownership
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Client profiles, verified contact numbers, address, and all linked vehicles and service history.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((cust) => {
                  const linkedVehicles = vehicles.filter((v) => v.customerId === cust.id);
                  const linkedJobs = jobOrders.filter((j) => j.customerId === cust.id);

                  return (
                    <div
                      key={cust.id}
                      className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-heading font-bold text-white">
                            {cust.name}
                          </h4>
                          <span className="text-[10px] font-mono-code text-[#7B93BE]">
                            Client since {cust.since}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-body space-y-1">
                          <p className="flex items-center gap-1.5">
                            <Phone size={12} className="text-[#FFB020]" />
                            <span>{cust.phone}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Mail size={12} className="text-[#7B93BE]" />
                            <span>{cust.email}</span>
                          </p>
                          <p className="text-slate-400 text-[11px]">{cust.address}</p>
                        </div>

                        {/* Linked Vehicles */}
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-mono-code uppercase text-[#FFB020] font-bold block">
                            Linked Vehicles ({linkedVehicles.length})
                          </span>
                          <div className="space-y-1">
                            {linkedVehicles.map((v) => (
                              <div key={v.id} className="p-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/20 flex items-center justify-between text-xs">
                                <PlateBadge plate={v.plateNumber} size="sm" />
                                <span className="text-slate-300 font-body">{v.year} {v.make} {v.model}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-mono-code text-[11px] text-[#7B93BE]">
                          {linkedJobs.length} Job Orders
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('jobOrders');
                            setSearchTerm(cust.name);
                          }}
                          className="text-[#FFB020] hover:underline font-semibold cursor-pointer"
                        >
                          View Job History &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 7: VEHICLES REGISTRY                                         */}
          {/* ================================================================ */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                  Philippine Motor Vehicle Registry
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  License plates, chassis numbers, engine codes, and historical service orders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => {
                  const owner = customers.find((c) => c.id === v.customerId);
                  const relatedJobs = jobOrders.filter((j) => j.vehicleId === v.id);

                  return (
                    <div
                      key={v.id}
                      className="glass-navy p-6 rounded-2xl border border-[#7B93BE]/30 clip-brand space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <PlateBadge plate={v.plateNumber} size="md" />
                          <span className="text-xs font-mono-code text-[#7B93BE]">
                            {v.bodyType}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-heading font-bold text-white">
                            {v.year} {v.make} {v.model}
                          </h4>
                          <p className="text-xs text-slate-300 font-body">
                            Color: <strong className="text-white">{v.color}</strong> · Fuel: {v.fuelType}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/20 font-mono-code text-[10px] space-y-1 text-slate-400">
                          <div>VIN: <span className="text-white">{v.vin}</span></div>
                          <div>Chassis: <span className="text-white">{v.chassisNumber}</span></div>
                          <div>Engine: <span className="text-white">{v.engineNumber}</span></div>
                          <div>Odometer: <span className="text-[#FFB020]">{v.currentOdometer.toLocaleString()} km</span></div>
                        </div>

                        <div className="text-xs text-slate-300 font-body">
                          Registered Owner: <strong className="text-white">{owner?.name}</strong> ({owner?.phone})
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-mono-code text-[11px] text-[#7B93BE]">
                          {relatedJobs.length} Job Orders
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('jobOrders');
                            setSearchTerm(v.plateNumber);
                          }}
                          className="text-[#FFB020] hover:underline font-semibold cursor-pointer"
                        >
                          Filter Jobs &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 8: PERMANENT DOCUMENT VAULT                                  */}
          {/* ================================================================ */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Permanent Guarantee Banner */}
              <div className="p-5 rounded-2xl bg-[#172B57]/70 border-l-4 border-[#10B981] border-y border-r border-[#7B93BE]/30 space-y-2">
                <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                  <ShieldCheck size={18} className="text-[#10B981]" />
                  <span>Archived Records Permanent Retention Guarantee</span>
                </div>
                <p className="text-xs text-slate-200 font-body leading-relaxed max-w-3xl">
                  Unlike conventional shops that discard physical job orders after 3 months, <strong className="text-white">archived records in this system are never discarded</strong>. Encrypted digital files, pre-inspection photos, and customer signed scopes are preserved permanently for warranty compliance and vehicle resale proof.
                </p>
              </div>

              {/* Documents Table */}
              <div className="glass-navy rounded-2xl border border-[#7B93BE]/30 overflow-hidden shadow-2xl">
                <div className="p-4 bg-[#11141C] border-b border-white/10 flex items-center justify-between">
                  <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                    Digital Records &amp; Scans ({documents.length} Files)
                  </h4>
                  <span className="text-[10px] font-mono-code text-[#10B981]">
                    Encrypted Storage Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-body">
                    <thead className="bg-[#0B0D12] text-slate-400 font-mono-code text-[11px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Job / Plate</th>
                        <th className="p-3">Document Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Archived On</th>
                        <th className="p-3">Archived By</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono-code">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#FFB020] font-bold">{doc.jobNo}</span>
                              <PlateBadge plate={doc.plateNumber} size="sm" />
                            </div>
                          </td>
                          <td className="p-3 font-heading font-semibold text-white">
                            {doc.documentTitle}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-[#172B57] text-[#7B93BE] font-mono-code text-[10px]">
                              {doc.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{doc.customerName}</td>
                          <td className="p-3 font-mono-code text-slate-400">{doc.dateArchived}</td>
                          <td className="p-3 text-slate-300">{doc.archivedBy}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                const targetJob = jobOrders.find((j) => j.jobNo === doc.jobNo);
                                if (targetJob) setPrintingJob(targetJob);
                              }}
                              className="px-2.5 py-1 rounded bg-[#172B57] hover:bg-[#203a74] text-white text-[11px] font-semibold cursor-pointer border border-[#7B93BE]/40"
                            >
                              Inspect Scan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 9: AUDIT TRAIL LOG                                           */}
          {/* ================================================================ */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                  Immutable Security Audit Trail
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Cryptographic log of all user logins, stage advancements, photo uploads, and document exports.
                </p>
              </div>

              <div className="glass-navy rounded-2xl border border-[#7B93BE]/30 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-code">
                    <thead className="bg-[#0B0D12] text-slate-400 text-[11px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Staff / User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Target Entity</th>
                        <th className="p-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-bold text-white">{log.user}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 rounded bg-[#172B57] text-[#FFB020] text-[10px]">
                              {log.role}
                            </span>
                          </td>
                          <td className="p-3 text-[#7B93BE] font-semibold">{log.action}</td>
                          <td className="p-3 text-white font-bold">{log.target}</td>
                          <td className="p-3 text-slate-300 font-body text-xs">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Modals */}
      <CreateJobOrderModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
      />

      <IntakePhotoUploaderModal
        isOpen={isPhotoUploaderOpen}
        onClose={() => setIsPhotoUploaderOpen(false)}
        targetJobId={selectedJobId}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectJob={(jobId) => {
          setSelectedJobId(jobId);
          setActiveTab('jobOrders');
        }}
        onSelectVehicle={(_plate) => {
          setActiveTab('vehicles');
        }}
      />

      <PrintJobOrderModal
        job={printingJob}
        customer={printingJob ? customers.find((c) => c.id === printingJob.customerId) : undefined}
        vehicle={printingJob ? vehicles.find((v) => v.id === printingJob.vehicleId) : undefined}
        onClose={() => setPrintingJob(null)}
      />

    </div>
  );
};
