import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Activity,
  AppState,
  Booking,
  Customer,
  DocType,
  JobOrder,
  LineItem,
  Role,
  ServiceType,
  Session,
  ShopDoc,
  Stage,
  Vehicle,
  Zone,
} from './types';
import { ROLE_ACCOUNTS, seedState, TIME_SLOTS } from './data';
import { DOC_PREFIX } from './types';
import { jsonClone } from './utils';

const STORAGE_KEY = 'carbontrack.demo.v2';

export type ToastKind = 'ok' | 'info' | 'warn';
export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  detail?: string;
}

interface StoreValue {
  state: AppState;
  session: Session | null;
  toasts: ToastItem[];
  toast: (title: string, detail?: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
  login: (role: Role) => void;
  logout: () => void;
  resetDemo: () => void;
  addCustomer: (input: Omit<Customer, 'id' | 'since'>) => Customer;
  addVehicle: (input: Omit<Vehicle, 'id' | 'createdAt' | 'customerId'> & { customerId: string }) => Vehicle;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addJob: (input: {
    vehicleId: string;
    serviceTypes: ServiceType[];
    concern: string;
    technician: string;
    odometer: number;
    promisedAt: string | null;
    notes?: string;
  }) => JobOrder;
  updateJob: (id: string, patch: Partial<JobOrder>) => void;
  deleteJob: (id: string) => void;
  setStage: (id: string, stage: Stage, note?: string) => void;
  addLineItem: (jobId: string, item: Omit<LineItem, 'id'>) => void;
  removeLineItem: (jobId: string, itemId: string) => void;
  addDocument: (jobId: string, type: DocType, name?: string) => void;
  deleteDocument: (jobId: string, docId: string) => void;
  addInspectionPhotos: (jobId: string, zones: Zone[]) => void;
  addDamage: (jobId: string, input: { area: string; severity: 'Minor' | 'Moderate' | 'Major'; note: string }) => void;
  toggleDamage: (jobId: string, damageId: string) => void;
  addBooking: (input: Omit<Booking, 'id' | 'createdAt' | 'status'> & { status?: Booking['status'] }) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.vehicles) && Array.isArray(parsed.jobs)) return parsed;
    }
  } catch {
    /* corrupted payload — fall back to the seed */
  }
  return jsonClone(seedState());
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastSeq = useRef(1);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or disabled — prototype keeps working in memory */
    }
  }, [state]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((title: string, detail?: string, kind: ToastKind = 'ok') => {
    const id = toastSeq.current++;
    setToasts((t) => [...t.slice(-3), { id, kind, title, detail }]);
    const handle = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4600);
    timers.current.push(handle);
  }, []);

  const log = useCallback((entry: Omit<Activity, 'id' | 'at'>) => {
    const item: Activity = { ...entry, id: uid('act'), at: new Date().toISOString() };
    setState((s) => ({ ...s, activity: [item, ...s.activity].slice(0, 60) }));
  }, []);

  const login = useCallback((role: Role) => {
    const account = ROLE_ACCOUNTS[role];
    setState((s) => ({ ...s, session: { role, name: account.name, since: new Date().toISOString() } }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: null }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(jsonClone(seedState()));
    toast('Demo data restored', 'All records were reset to the seeded sample set.', 'info');
  }, [toast]);

  const addCustomer = useCallback((input: Omit<Customer, 'id' | 'since'>): Customer => {
    const customer: Customer = { ...input, id: uid('c'), since: new Date().toISOString() };
    setState((s) => ({ ...s, customers: [...s.customers, customer] }));
    return customer;
  }, []);

  const addVehicle = useCallback((input: Omit<Vehicle, 'id' | 'createdAt' | 'customerId'> & { customerId: string }): Vehicle => {
    const vehicle: Vehicle = { ...input, id: uid('v'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, vehicles: [...s.vehicles, vehicle] }));
    log({ kind: 'vehicle', text: `New vehicle record added — ${vehicle.plate}`, detail: `${vehicle.make} ${vehicle.model} · ${vehicle.year}`, ref: vehicle.id });
    return vehicle;
  }, [log]);

  const updateVehicle = useCallback((id: string, patch: Partial<Vehicle>) => {
    setState((s) => ({ ...s, vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setState((s) => {
      const vehicle = s.vehicles.find((v) => v.id === id);
      const jobs = s.jobs.filter((j) => j.vehicleId !== id);
      const customerStillUsed = s.vehicles.some((v) => v.customerId === vehicle?.customerId && v.id !== id);
      const customerId = vehicle?.customerId;
      return {
        ...s,
        vehicles: s.vehicles.filter((v) => v.id !== id),
        jobs,
        customers: customerStillUsed || !customerId ? s.customers : s.customers.filter((c) => c.id !== customerId),
        activity: [
          {
            id: uid('act'),
            kind: 'delete',
            text: `Vehicle record deleted — ${vehicle?.plate ?? id}`,
            detail: 'Related job orders were removed from the active list',
            at: new Date().toISOString(),
          },
          ...s.activity,
        ],
        session: s.session,
      };
    });
  }, []);

  const addJob = useCallback((input: {
    vehicleId: string;
    serviceTypes: ServiceType[];
    concern: string;
    technician: string;
    odometer: number;
    promisedAt: string | null;
    notes?: string;
  }): JobOrder => {
    const vehicle = state.vehicles.find((v) => v.id === input.vehicleId);
    const next = state.seq;
    const now = new Date().toISOString();
    const job: JobOrder = {
      id: uid('jo'),
      code: `CD-${new Date().getFullYear()}-${String(next).padStart(4, '0')}`,
      vehicleId: input.vehicleId,
      customerId: vehicle?.customerId ?? '',
      serviceTypes: input.serviceTypes,
      concern: input.concern,
      stage: 'Checked-in',
      receivedAt: now,
      promisedAt: input.promisedAt,
      releasedAt: null,
      technician: input.technician,
      odometer: input.odometer,
      items: [],
      discount: 0,
      notes: input.notes ?? '',
      warranty: '6 months workmanship warranty (shop standard).',
      photos: [],
      damages: [],
      docs: [],
      progress: [
        { id: uid('pe'), stage: 'Checked-in', at: now, note: 'Unit received and logged at the service desk.', by: state.session?.name ?? 'Service Desk' },
      ],
      createdAt: now,
    };
    setState((s) => ({
      ...s,
      jobs: [job, ...s.jobs],
      seq: s.seq + 1,
      activity: [
        {
          id: uid('act'),
          kind: 'stage',
          text: `New job order ${job.code} opened for ${vehicle?.plate ?? 'unit'}`,
          detail: `${input.serviceTypes.join(' · ')} · ${input.technician}`,
          at: now,
          ref: job.id,
        },
        ...s.activity,
      ],
    }));
    return job;
  }, [state.vehicles, state.seq, state.session]);

  const updateJob = useCallback((id: string, patch: Partial<JobOrder>) => {
    setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === id);
      return {
        ...s,
        jobs: s.jobs.filter((j) => j.id !== id),
        activity: [
          {
            id: uid('act'),
            kind: 'delete',
            text: `Job order deleted — ${job?.code ?? id}`,
            detail: 'Digital documents and photos were removed with the record',
            at: new Date().toISOString(),
          },
          ...s.activity,
        ],
      };
    });
  }, []);

  const setStage = useCallback((id: string, stage: Stage, note?: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === id);
      if (!job) return s;
      const now = new Date().toISOString();
      const entry = {
        id: uid('pe'),
        stage,
        at: now,
        note: note?.trim() || 'Status updated from the progress board.',
        by: s.session?.name ?? 'Service Desk',
      };
      const vehicle = s.vehicles.find((v) => v.id === job.vehicleId);
      return {
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === id
            ? {
                ...j,
                stage,
                releasedAt: stage === 'Released' ? now : null,
                progress: [...j.progress, entry],
              }
            : j,
        ),
        activity: [
          {
            id: uid('act'),
            kind: 'stage',
            text: `${s.session?.name ?? 'Service Desk'} moved ${vehicle?.plate ?? job.code} to ${stage}`,
            detail: note?.trim() || undefined,
            at: now,
            ref: job.id,
          },
          ...s.activity,
        ],
      };
    });
  }, []);

  const addLineItem = useCallback((jobId: string, item: Omit<LineItem, 'id'>) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, items: [...j.items, { ...item, id: uid('li') }] } : j)),
    }));
  }, []);

  const removeLineItem = useCallback((jobId: string, itemId: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, items: j.items.filter((i) => i.id !== itemId) } : j)),
    }));
  }, []);

  const addDocument = useCallback((jobId: string, type: DocType, name?: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === jobId);
      if (!job) return s;
      const suffix = job.code.slice(-4);
      const doc: ShopDoc = {
        id: uid('doc'),
        name: name?.trim() || `${DOC_PREFIX[type]}-${suffix}.pdf`,
        type,
        addedAt: new Date().toISOString(),
        addedBy: s.session?.name ?? 'Service Desk',
        pages: 1 + Math.floor(Math.random() * 3),
        kb: 180 + Math.floor(Math.random() * 1800),
      };
      return {
        ...s,
        jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, docs: [doc, ...j.docs] } : j)),
        activity: [
          {
            id: uid('act'),
            kind: 'doc',
            text: `${type} added to ${job.code}`,
            detail: doc.name,
            at: doc.addedAt,
            ref: job.id,
          },
          ...s.activity,
        ],
      };
    });
  }, []);

  const deleteDocument = useCallback((jobId: string, docId: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, docs: j.docs.filter((d) => d.id !== docId) } : j)),
    }));
  }, []);

  const addInspectionPhotos = useCallback((jobId: string, zones: Zone[]) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === jobId);
      if (!job) return s;
      const tone = job.photos.length;
      const now = Date.now();
      const photos = zones.map((zone, i) => ({
        id: uid('ph'),
        zone,
        label: zone === 'Odometer' ? 'Odometer reading' : zone === 'Engine Bay' ? 'Engine bay' : `${zone} view`,
        takenAt: new Date(now + i * 1000).toISOString(),
        takenBy: s.session?.name ?? 'Service Desk',
        tone: (tone + i) % 5,
        hasDamage: false,
      }));
      return {
        ...s,
        jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, photos: [...j.photos, ...photos] } : j)),
        activity: [
          {
            id: uid('act'),
            kind: 'photo',
            text: `${photos.length} pre-inspection photo${photos.length === 1 ? '' : 's'} captured`,
            detail: `${s.vehicles.find((v) => v.id === job.vehicleId)?.plate ?? job.code} · evidence linked to the record`,
            at: new Date().toISOString(),
            ref: job.id,
          },
          ...s.activity,
        ],
      };
    });
  }, []);

  const addDamage = useCallback((jobId: string, input: { area: string; severity: 'Minor' | 'Moderate' | 'Major'; note: string }) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? { ...j, damages: [...j.damages, { ...input, id: uid('dm'), acknowledged: false }] }
          : j,
      ),
    }));
  }, []);

  const toggleDamage = useCallback((jobId: string, damageId: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? { ...j, damages: j.damages.map((d) => (d.id === damageId ? { ...d, acknowledged: !d.acknowledged } : d)) }
          : j,
      ),
    }));
  }, []);

  const addBooking = useCallback((input: Omit<Booking, 'id' | 'createdAt' | 'status'> & { status?: Booking['status'] }): Booking => {
    const booking: Booking = {
      ...input,
      id: uid('b'),
      status: input.status ?? 'Pending',
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      bookings: [...s.bookings, booking],
      activity: [
        {
          id: uid('act'),
          kind: 'booking',
          text: `New booking — ${booking.name} · ${booking.plate}`,
          detail: `${new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })} ${booking.time} · ${booking.service}`,
          at: booking.createdAt,
        },
        ...s.activity,
      ],
    }));
    return booking;
  }, []);

  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setState((s) => ({ ...s, bookings: s.bookings.filter((b) => b.id !== id) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      session: state.session,
      toasts,
      toast,
      dismissToast,
      login,
      logout,
      resetDemo,
      addCustomer,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addJob,
      updateJob,
      deleteJob,
      setStage,
      addLineItem,
      removeLineItem,
      addDocument,
      deleteDocument,
      addInspectionPhotos,
      addDamage,
      toggleDamage,
      addBooking,
      updateBooking,
      deleteBooking,
    }),
    [state, toasts, toast, dismissToast, login, logout, resetDemo, addCustomer, addVehicle, updateVehicle, deleteVehicle, addJob, updateJob, deleteJob, setStage, addLineItem, removeLineItem, addDocument, deleteDocument, addInspectionPhotos, addDamage, toggleDamage, addBooking, updateBooking, deleteBooking],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

/* ---------------------------------------------------------------
   Booking helpers shared by the calendar and the booking form
   --------------------------------------------------------------- */
export function bookingConflict(bookings: Booking[], date: string, time: string, excludeId?: string): Booking | undefined {
  return bookings.find((b) => b.id !== excludeId && b.date === date && b.time === time && b.status !== 'Cancelled');
}

export const SLOT_LABELS: Record<string, string> = Object.fromEntries(
  TIME_SLOTS.map((t) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return [t, `${hh}:${String(m).padStart(2, '0')} ${suffix}`];
  }),
);
