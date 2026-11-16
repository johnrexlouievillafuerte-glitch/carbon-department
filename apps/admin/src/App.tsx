import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout, type AdminTab } from './components/AdminLayout';
import { DashboardView } from './pages/DashboardView';
import { JobOrdersView } from './pages/JobOrdersView';
import { RepairProgressView } from './pages/RepairProgressView';
import { BookingsView } from './pages/BookingsView';
import { CustomersView } from './pages/CustomersView';
import { VehiclesView } from './pages/VehiclesView';
import { IntakePhotosView } from './pages/IntakePhotosView';
import { DocumentVaultView } from './pages/DocumentVaultView';
import { AuditTrailView } from './pages/AuditTrailView';
import { UsersView } from './pages/UsersView';

import { CreateJobModal } from './components/CreateJobModal';
import { UploadPhotoModal } from './components/UploadPhotoModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { api } from './api';
import type {
  User,
  Customer,
  Vehicle,
  JobOrder,
  IntakePhoto,
  Booking,
  DocumentRecord,
  AuditEntry,
} from '@carbon/ui';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Tab State
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');

  // Modals
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [uploadPhotoOpen, setUploadPhotoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Master Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [photos, setPhotos] = useState<IntakePhoto[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    checkCurrentUser();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('carbon:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('carbon:unauthorized', handleUnauthorized);
  }, []);

  const checkCurrentUser = async () => {
    try {
      const u = await api.me();
      setUser(u);
      loadAllData(u);
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const loadAllData = async (activeUser?: User | null) => {
    const role = (activeUser || user)?.role;
    try {
      const [cust, veh, jobs, ph, bks, docs] = await Promise.all([
        api.getCustomers().catch(() => []),
        api.getVehicles().catch(() => []),
        api.getJobOrders().catch(() => []),
        api.getIntakePhotos().catch(() => []),
        api.getBookings().catch(() => []),
        api.getDocuments().catch(() => []),
      ]);

      setCustomers(cust);
      setVehicles(veh);
      setJobOrders(jobs);
      setPhotos(ph);
      setBookings(bks);
      setDocuments(docs);

      if (role === 'Admin') {
        const [logs, uList] = await Promise.all([
          api.getAuditLog().catch(() => []),
          api.getUsers().catch(() => []),
        ]);
        setAuditLogs(logs);
        setUsers(uList);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  const handleJobCreated = () => {
    loadAllData();
  };

  const handleConvertBooking = (booking: Booking) => {
    setCreateJobOpen(true);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center text-xs text-[#A3B1C8] font-mono">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          loadAllData(loggedUser);
        }}
      />
    );
  }

  return (
    <>
      <AdminLayout
        user={user}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewJob={() => setCreateJobOpen(true)}
        onOpenUploadPhoto={() => setUploadPhotoOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onLogout={handleLogout}
      >
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigateToTab={setCurrentTab}
            onOpenNewJob={() => setCreateJobOpen(true)}
            onSelectJob={() => setCurrentTab('job-orders')}
          />
        )}

        {currentTab === 'job-orders' && (
          <JobOrdersView
            jobOrders={jobOrders}
            vehicles={vehicles}
            customers={customers}
            onOpenNewJob={() => setCreateJobOpen(true)}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'progress' && (
          <RepairProgressView
            jobOrders={jobOrders}
            vehicles={vehicles}
            customers={customers}
            onRefresh={loadAllData}
            onSelectJob={() => setCurrentTab('job-orders')}
          />
        )}

        {currentTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            onRefresh={loadAllData}
            onConvertBooking={handleConvertBooking}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersView
            customers={customers}
            vehicles={vehicles}
            jobOrders={jobOrders}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'vehicles' && (
          <VehiclesView
            vehicles={vehicles}
            customers={customers}
            jobOrders={jobOrders}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'intake-photos' && (
          <IntakePhotosView
            photos={photos}
            jobOrders={jobOrders}
            vehicles={vehicles}
            customers={customers}
            onOpenUpload={() => setUploadPhotoOpen(true)}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentVaultView documents={documents} onRefresh={loadAllData} />
        )}

        {currentTab === 'audit-log' && user.role === 'Admin' && (
          <AuditTrailView logs={auditLogs} />
        )}

        {currentTab === 'users' && user.role === 'Admin' && (
          <UsersView users={users} onRefresh={loadAllData} />
        )}
      </AdminLayout>

      {/* Global Modals */}
      <CreateJobModal
        open={createJobOpen}
        onClose={() => setCreateJobOpen(false)}
        customers={customers}
        vehicles={vehicles}
        onJobCreated={handleJobCreated}
      />

      <UploadPhotoModal
        open={uploadPhotoOpen}
        onClose={() => setUploadPhotoOpen(false)}
        jobOrders={jobOrders}
        vehicles={vehicles}
        onPhotoUploaded={loadAllData}
      />

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        jobOrders={jobOrders}
        vehicles={vehicles}
        customers={customers}
        onSelectJob={() => setCurrentTab('job-orders')}
        onNavigateToTab={setCurrentTab}
      />
    </>
  );
};
