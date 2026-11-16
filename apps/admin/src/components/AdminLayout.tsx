import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  Calendar,
  Users,
  Car,
  Camera,
  FolderLock,
  History,
  UserCheck,
  Search,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { Button } from '@carbon/ui';
import type { User } from '@carbon/ui';

export type AdminTab =
  | 'dashboard'
  | 'job-orders'
  | 'progress'
  | 'bookings'
  | 'customers'
  | 'vehicles'
  | 'intake-photos'
  | 'documents'
  | 'audit-log'
  | 'users';

interface AdminLayoutProps {
  user: User;
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenNewJob: () => void;
  onOpenUploadPhoto: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  currentTab,
  onSelectTab,
  onOpenNewJob,
  onOpenUploadPhoto,
  onOpenSearch,
  onLogout,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const navGroups = [
    {
      group: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'job-orders', label: 'Job Orders', icon: ClipboardList },
        { id: 'progress', label: 'Repair Progress', icon: Activity },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
      ],
    },
    {
      group: 'Records',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'vehicles', label: 'Vehicles', icon: Car },
        { id: 'intake-photos', label: 'Intake Photos', icon: Camera },
        { id: 'documents', label: 'Document Vault', icon: FolderLock },
      ],
    },
    ...(user.role === 'Admin'
      ? [
          {
            group: 'System',
            items: [
              { id: 'audit-log', label: 'Audit Trail', icon: History },
              { id: 'users', label: 'Users & Roles', icon: UserCheck },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#F2F2F0] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F0F10]/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-60 lg:w-64 bg-[#161617] border-r border-white/[0.08] z-50 flex flex-col justify-between transition-transform duration-200 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Carbon Department Official Logo"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="font-heading font-semibold text-sm tracking-tight text-[#F2F2F0] block">
                  CarbonTrack
                </span>
                <span className="text-[10px] text-[#9A9A9A] block font-mono">
                  Cainta Facility System
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-[#9A9A9A] hover:text-[#F2F2F0] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Groups */}
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="px-3 text-[10px] uppercase font-mono tracking-wider text-[#9A9A9A] font-medium block">
                  {group.group}
                </span>
                <nav className="space-y-1 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id as AdminTab);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#00B8F0]/10 text-[#00B8F0] font-semibold border border-[#00B8F0]/30'
                            : 'text-[#9A9A9A] hover:text-[#F2F2F0] hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon size={15} className={isActive ? 'text-[#00B8F0]' : 'text-[#9A9A9A]'} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0F0F10] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5 truncate pr-2">
              <span className="font-medium text-[#F2F2F0] block truncate">
                {user.display_name}
              </span>
              <span className="text-[10px] text-[#00B8F0] font-mono">
                {user.role} Account
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-[6px] text-[#9A9A9A] hover:text-[#FF5D6C] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#161617] border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-[6px] text-[#9A9A9A] hover:text-[#F2F2F0] cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Ctrl+K Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-xs text-[#9A9A9A] hover:text-[#F2F2F0] hover:border-[#00B8F0] transition-colors cursor-pointer w-48 sm:w-64"
            >
              <Search size={14} className="text-[#00B8F0]" />
              <span className="flex-1 text-left truncate">Search plate, job, client...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-[#161617] border border-white/[0.08] px-1.5 py-0.5 rounded text-[#9A9A9A]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Action Dropdown (+) */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                aria-label="Quick Actions"
                className="flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">Actions</span>
              </Button>

              {quickActionOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#161617] border border-white/[0.08] rounded-[6px] shadow-xl py-1 text-xs z-50"
                  onClick={() => setQuickActionOpen(false)}
                >
                  <button
                    onClick={onOpenNewJob}
                    className="w-full text-left px-4 py-2 hover:bg-white/[0.04] text-[#F2F2F0] flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList size={14} className="text-[#00B8F0]" />
                    <span>New Job Order</span>
                  </button>
                  <button
                    onClick={onOpenUploadPhoto}
                    className="w-full text-left px-4 py-2 hover:bg-white/[0.04] text-[#F2F2F0] flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={14} className="text-[#2DD4A0]" />
                    <span>Upload Intake Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Single Primary Action: New Job Order */}
            <Button
              variant="primary"
              size="sm"
              className="text-center justify-center font-medium flex items-center gap-1.5"
              onClick={onOpenNewJob}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Job Order</span>
            </Button>

            {/* One-way link to Public Site */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-[6px] text-[#9A9A9A] hover:text-[#F2F2F0] hover:bg-white/[0.04] transition-colors"
              title="Open Public Customer Site"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
