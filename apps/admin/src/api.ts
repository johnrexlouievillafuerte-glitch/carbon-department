import type {
  User,
  Customer,
  Vehicle,
  JobOrder,
  IntakePhoto,
  ProgressLog,
  Booking,
  DocumentRecord,
  AuditEntry,
  DashboardStats,
  AttentionItem,
} from '@carbon/ui';

async function req<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('carbon:unauthorized'));
    throw new Error('Session expired. Please log in.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    req<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => req<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => req<User>('/api/auth/me'),
  changePassword: (current_password: string, new_password: string) =>
    req<{ ok: boolean }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    }),

  // Stats & Attention
  getStats: () => req<DashboardStats>('/api/admin/stats'),
  getAttention: () => req<{ items: AttentionItem[] }>('/api/admin/attention'),

  // Customers
  getCustomers: () => req<Customer[]>('/api/admin/customers'),
  createCustomer: (data: Partial<Customer>) =>
    req<Customer>('/api/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Vehicles
  getVehicles: () => req<Vehicle[]>('/api/admin/vehicles'),
  createVehicle: (data: Partial<Vehicle>) =>
    req<Vehicle>('/api/admin/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Job Orders
  getJobOrders: () => req<JobOrder[]>('/api/admin/job-orders'),
  getJobOrder: (id: string) => req<JobOrder>(`/api/admin/job-orders/${id}`),
  createJobOrder: (data: any) =>
    req<{ id: string; job_no: string }>('/api/admin/job-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStage: (id: string, stage: string, note?: string) =>
    req<{ ok: boolean }>(`/api/admin/job-orders/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, note }),
    }),
  getProgressLogs: (jobId: string) =>
    req<ProgressLog[]>(`/api/admin/job-orders/${jobId}/progress`),
  addProgressLog: (jobId: string, note: string, stage?: string) =>
    req<{ id: string }>(`/api/admin/job-orders/${jobId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ note, stage }),
    }),

  // Intake Photos
  getIntakePhotos: () => req<IntakePhoto[]>('/api/admin/intake-photos'),
  getIntakePhotosForJob: (jobId: string) =>
    req<IntakePhoto[]>(`/api/admin/intake-photos/job/${jobId}`),
  uploadIntakePhoto: (formData: FormData) =>
    req<{ id: string; url: string }>('/api/admin/intake-photos', {
      method: 'POST',
      body: formData,
    }),

  // Bookings
  getBookings: () => req<Booking[]>('/api/admin/bookings'),
  updateBookingStatus: (id: string, status: string) =>
    req<{ ok: boolean }>(`/api/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Documents
  getDocuments: () => req<DocumentRecord[]>('/api/admin/documents'),
  uploadDocument: (formData: FormData) =>
    req<{ id: string }>('/api/admin/documents', {
      method: 'POST',
      body: formData,
    }),

  // Audit Log & Users
  getAuditLog: () => req<AuditEntry[]>('/api/admin/audit-log'),
  getUsers: () => req<User[]>('/api/admin/users'),
  createUser: (data: any) =>
    req<User>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
