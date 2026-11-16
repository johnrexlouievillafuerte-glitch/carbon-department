import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  JobOrder,
  JobStage,
  Customer,
  Vehicle,
  Booking,
  DocumentRecord,
  AuditLog,
  IntakePhoto,
  ProgressLog,
  Division,
  InspectionChecklist,
} from '../data/carbonStore';
import {
  STAGE_PROGRESS_MAP,
  INITIAL_CUSTOMERS,
  INITIAL_VEHICLES,
  INITIAL_JOB_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/carbonStore';

export interface UserSession {
  name: string;
  role: 'Admin' | 'Staff';
  email: string;
  avatar?: string;
}

interface CarbonContextType {
  customers: Customer[];
  vehicles: Vehicle[];
  jobOrders: JobOrder[];
  bookings: Booking[];
  documents: DocumentRecord[];
  auditLogs: AuditLog[];
  session: UserSession | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (role: 'Admin' | 'Staff', name?: string) => void;
  logout: () => void;
  createJobOrder: (data: {
    plateNumber: string;
    customerName: string;
    phone: string;
    email?: string;
    address?: string;
    make: string;
    model: string;
    year: string;
    color: string;
    vin?: string;
    division: Division;
    services: string[];
    customerConcern: string;
    technicians: string[];
    intakeNotes?: string;
    checklist?: Partial<InspectionChecklist>;
    intakePhotos?: IntakePhoto[];
    estimatedReleaseDays?: number;
  }) => JobOrder;
  updateJobStage: (jobId: string, stage: JobStage, note?: string, photoUrl?: string) => void;
  addIntakePhoto: (jobId: string, photo: Omit<IntakePhoto, 'id' | 'timestamp'>) => void;
  addProgressUpdate: (jobId: string, note: string, photoUrl?: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  convertBookingToJobOrder: (bookingId: string) => JobOrder | null;
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'dateArchived' | 'isPermanent'>) => DocumentRecord;
  findJobByNumberAndPlate: (jobNo: string, plate: string) => JobOrder | undefined;
  findVehicleByPlate: (plate: string) => { vehicle?: Vehicle; customer?: Customer; jobOrders: JobOrder[] };
}

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

const STORAGE_KEY = 'carbondepartment_system_state_v1';

export const CarbonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('cd_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const addAuditLog = (action: string, details: string, target?: string) => {
    const currentUser = session ? session.name : 'System';
    const currentRole = session ? session.role : 'Staff';
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      user: currentUser,
      role: currentRole,
      action,
      target: target || 'Automotive Repair System',
      details,
    };

    setAuditLogs((prev) => [log, ...prev]);
  };

  const login = (role: 'Admin' | 'Staff', name?: string) => {
    const newSession: UserSession = {
      role,
      name: name || (role === 'Admin' ? 'Ramjay Anor' : 'Arman Boadilla'),
      email: role === 'Admin' ? 'management@carbondepartment.com' : 'workshop@carbondepartment.com',
    };
    setSession(newSession);
    try {
      sessionStorage.setItem('cd_session', JSON.stringify(newSession));
    } catch {}
    addAuditLog('User Login', `Session started as ${role} (${newSession.name})`);
  };

  const logout = () => {
    if (session) {
      addAuditLog('User Logout', `Session ended for ${session.name}`);
    }
    setSession(null);
    try {
      sessionStorage.removeItem('cd_session');
    } catch {}
  };

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cust`);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_veh`);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [jobOrders, setJobOrders] = useState<JobOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
      return saved ? JSON.parse(saved) : INITIAL_JOB_ORDERS;
    } catch {
      return INITIAL_JOB_ORDERS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_book`);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_docs`);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cust`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY}_veh`, JSON.stringify(vehicles));
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobOrders));
      localStorage.setItem(`${STORAGE_KEY}_book`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY}_docs`, JSON.stringify(documents));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    } catch {}
  }, [customers, vehicles, jobOrders, bookings, documents, auditLogs]);

  const createJobOrder = (data: {
    plateNumber: string;
    customerName: string;
    phone: string;
    email?: string;
    address?: string;
    make: string;
    model: string;
    year: string;
    color: string;
    vin?: string;
    division: Division;
    services: string[];
    customerConcern: string;
    technicians: string[];
    intakeNotes?: string;
    checklist?: Partial<InspectionChecklist>;
    intakePhotos?: IntakePhoto[];
    estimatedReleaseDays?: number;
  }): JobOrder => {
    const cleanPlate = data.plateNumber.toUpperCase().trim();

    let customer = customers.find(
      (c) => c.phone === data.phone || c.name.toLowerCase() === data.customerName.toLowerCase()
    );
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        name: data.customerName,
        phone: data.phone,
        email: data.email || 'customer@client.ph',
        address: data.address || 'Cainta, Rizal',
        since: new Date().toISOString().split('T')[0],
      };
      setCustomers((prev) => [customer!, ...prev]);
    }

    let vehicle = vehicles.find((v) => v.plateNumber === cleanPlate);
    if (!vehicle) {
      vehicle = {
        id: `veh-${Date.now()}`,
        customerId: customer.id,
        plateNumber: cleanPlate,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        bodyType: 'Passenger Car',
        vin: data.vin || `VIN-${Date.now().toString().slice(-8)}`,
        chassisNumber: `CH-${Date.now().toString().slice(-6)}`,
        engineNumber: `ENG-${Date.now().toString().slice(-6)}`,
        fuelType: 'Gasoline',
        currentOdometer: 10000,
      };
      setVehicles((prev) => [vehicle!, ...prev]);
    }

    const nextSeq = 148 + jobOrders.length;
    const jobNo = `CD-2026-${String(nextSeq).padStart(4, '0')}`;

    const defaultChecklist: InspectionChecklist = {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 3,
      ...data.checklist,
    };

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (data.estimatedReleaseDays || 7));
    const estimatedRelease = targetDate.toISOString().split('T')[0];

    const newJob: JobOrder = {
      id: `jo-${Date.now()}`,
      jobNo,
      customerId: customer.id,
      vehicleId: vehicle.id,
      division: data.division,
      services: data.services.length > 0 ? data.services : ['Inspection & General Service'],
      customerConcern: data.customerConcern,
      stage: 'Received',
      progressPercent: STAGE_PROGRESS_MAP['Received'],
      assignedTechnicians: data.technicians.length > 0 ? data.technicians : ['Ramjay Anor'],
      intakeChecklist: defaultChecklist,
      intakeNotes: data.intakeNotes || 'Intake walkaround inspection complete. Customer signed off.',
      intakePhotos: data.intakePhotos || [],
      progressLogs: [
        {
          id: `log-${Date.now()}`,
          stage: 'Received',
          note: `Job order opened at Cainta shop. Concern: ${data.customerConcern}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          technician: session?.name || 'Service Advisor',
        },
      ],
      dateReceived: new Date().toISOString().split('T')[0],
      estimatedRelease,
      isArchived: false,
    };

    setJobOrders((prev) => [newJob, ...prev]);

    const archiveDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      jobNo: newJob.jobNo,
      plateNumber: cleanPlate,
      customerName: customer.name,
      documentTitle: `Official Job Order & Technical Agreement (${newJob.jobNo})`,
      category: 'Job Order',
      dateArchived: new Date().toISOString().split('T')[0],
      fileKb: 390,
      archivedBy: session?.name || 'Administration',
      isPermanent: true,
    };
    setDocuments((prev) => [archiveDoc, ...prev]);

    addAuditLog(
      'Create Job Order',
      `Issued ${jobNo} for ${cleanPlate} (${data.make} ${data.model}). Scope: ${data.services.join(', ')}`,
      jobNo
    );

    return newJob;
  };

  const updateJobStage = (jobId: string, stage: JobStage, note?: string, photoUrl?: string) => {
    setJobOrders((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;

        const newPercent = STAGE_PROGRESS_MAP[stage] || job.progressPercent;
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const stageNote =
          note || `Advanced stage to ${stage}. Inspected by ${session?.name || 'Technician'}.`;

        const newLog: ProgressLog = {
          id: `log-${Date.now()}`,
          stage,
          note: stageNote,
          timestamp: now,
          technician: session?.name || 'Assigned Lead',
          photoUrl,
        };

        const updated: JobOrder = {
          ...job,
          stage,
          progressPercent: newPercent,
          progressLogs: [...job.progressLogs, newLog],
          releasedAt: stage === 'Released' ? now.split(' ')[0] : job.releasedAt,
          isArchived: stage === 'Released' ? true : job.isArchived,
        };

        addAuditLog(
          'Stage Update',
          `Advanced Job ${job.jobNo} to '${stage}' (${newPercent}%). Note: ${stageNote}`,
          job.jobNo
        );

        return updated;
      })
    );
  };

  const addIntakePhoto = (jobId: string, photo: Omit<IntakePhoto, 'id' | 'timestamp'>) => {
    const newPhoto: IntakePhoto = {
      ...photo,
      id: `p-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setJobOrders((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const updated = {
          ...job,
          intakePhotos: [...job.intakePhotos, newPhoto],
        };

        addAuditLog(
          'Photo Upload',
          `Uploaded pre-repair intake photo [${photo.angle.toUpperCase()}]: ${photo.label}`,
          job.jobNo
        );

        return updated;
      })
    );
  };

  const addProgressUpdate = (jobId: string, note: string, photoUrl?: string) => {
    setJobOrders((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;

        const newLog: ProgressLog = {
          id: `log-${Date.now()}`,
          stage: job.stage,
          note,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          technician: session?.name || 'Technician',
          photoUrl,
        };

        addAuditLog('Progress Logged', `Technician note added: ${note}`, job.jobNo);

        return {
          ...job,
          progressLogs: [...job.progressLogs, newLog],
        };
      })
    );
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setBookings((prev) => [newBooking, ...prev]);

    addAuditLog(
      'New Booking Request',
      `Online reservation request: ${newBooking.customerName} for ${newBooking.plateNumber} on ${newBooking.preferredDate}`
    );

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        addAuditLog('Booking Status', `Updated booking for ${b.plateNumber} to ${status}`);
        return { ...b, status };
      })
    );
  };

  const convertBookingToJobOrder = (bookingId: string): JobOrder | null => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const newJob = createJobOrder({
      plateNumber: booking.plateNumber,
      customerName: booking.customerName,
      phone: booking.phone,
      email: booking.email,
      make: booking.makeModel.split(' ')[0] || 'Standard',
      model: booking.makeModel.split(' ').slice(1).join(' ') || 'Vehicle',
      year: booking.year || '2023',
      color: 'To be verified at intake',
      division: booking.division,
      services: [booking.serviceRequested],
      customerConcern: booking.notes || 'Intake from online slot reservation.',
      technicians: ['Ramjay Anor'],
    });

    updateBookingStatus(bookingId, 'Converted');
    return newJob;
  };

  const addDocument = (
    doc: Omit<DocumentRecord, 'id' | 'dateArchived' | 'isPermanent'>
  ): DocumentRecord => {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc-${Date.now()}`,
      dateArchived: new Date().toISOString().split('T')[0],
      isPermanent: true,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('Permanent Document Archived', `Stored ${doc.documentTitle} (${doc.category})`, doc.jobNo);
    return newDoc;
  };

  const findJobByNumberAndPlate = (jobNo: string, plate: string): JobOrder | undefined => {
    const cleanJob = jobNo.toUpperCase().trim();
    const cleanPlate = plate.toUpperCase().replace(/\s+/g, '').trim();

    return jobOrders.find((job) => {
      const matchJob = job.jobNo.toUpperCase().replace(/\s+/g, '') === cleanJob.replace(/\s+/g, '');
      const vehicle = vehicles.find((v) => v.id === job.vehicleId);
      const matchPlate = vehicle?.plateNumber.toUpperCase().replace(/\s+/g, '') === cleanPlate;

      return matchJob && matchPlate;
    });
  };

  const findVehicleByPlate = (
    plate: string
  ): { vehicle?: Vehicle; customer?: Customer; jobOrders: JobOrder[] } => {
    const cleanPlate = plate.toUpperCase().replace(/\s+/g, '').trim();
    const vehicle = vehicles.find((v) => v.plateNumber.toUpperCase().replace(/\s+/g, '') === cleanPlate);

    if (!vehicle) {
      return { jobOrders: [] };
    }

    const customer = customers.find((c) => c.id === vehicle.customerId);
    const relatedJobs = jobOrders.filter((j) => j.vehicleId === vehicle.id);

    return { vehicle, customer, jobOrders: relatedJobs };
  };

  return (
    <CarbonContext.Provider
      value={{
        customers,
        vehicles,
        jobOrders,
        bookings,
        documents,
        auditLogs,
        session,
        theme,
        toggleTheme,
        login,
        logout,
        createJobOrder,
        updateJobStage,
        addIntakePhoto,
        addProgressUpdate,
        createBooking,
        updateBookingStatus,
        convertBookingToJobOrder,
        addDocument,
        findJobByNumberAndPlate,
        findVehicleByPlate,
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = (): CarbonContextType => {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
};
