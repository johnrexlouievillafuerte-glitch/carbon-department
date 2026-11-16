/** Shared types for Carbon Department */

export type JobStage =
  | 'Received'
  | 'Pre-Inspection'
  | 'Estimate/Approval'
  | 'In Repair'
  | 'Finishing/Paint'
  | 'Final Assessment'
  | 'Ready for Release'
  | 'Released';

export const STAGES_LIST: JobStage[] = [
  'Received', 'Pre-Inspection', 'Estimate/Approval', 'In Repair',
  'Finishing/Paint', 'Final Assessment', 'Ready for Release', 'Released',
];

export const STAGE_PROGRESS: Record<JobStage, number> = {
  'Received': 12, 'Pre-Inspection': 25, 'Estimate/Approval': 40,
  'In Repair': 65, 'Finishing/Paint': 82, 'Final Assessment': 94,
  'Ready for Release': 100, 'Released': 100,
};

export type Division = 'Body & Custom Work' | 'Mechanical & Maintenance';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Staff';
  display_name: string;
  must_change_password: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  plate_number: string;
  make: string;
  model: string;
  year: string;
  color: string;
  body_type: string;
  vin: string;
  created_at: string;
}

export interface JobOrder {
  id: string;
  job_no: string;
  customer_id: string;
  vehicle_id: string;
  division: Division | string;
  services: string[];
  customer_concern: string;
  stage: JobStage;
  assigned_technicians: string[];
  intake_checklist: Record<string, unknown>;
  intake_notes: string;
  date_received: string;
  estimated_release: string;
  released_at?: string;
  is_archived: number;
  created_at: string;
  updated_at: string;
}

export interface IntakePhoto {
  id: string;
  job_order_id: string;
  vehicle_id: string;
  customer_id: string;
  angle: string;
  label: string;
  file_path: string;
  url?: string;
  caption: string;
  has_damage: number;
  uploaded_by: string;
  created_at: string;
}

export interface ProgressLog {
  id: string;
  job_order_id: string;
  stage: JobStage;
  note: string;
  technician: string;
  photo_path?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  plate_number: string;
  make_model: string;
  year: string;
  division: string;
  service_requested: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rescheduled' | 'Declined' | 'Converted';
  pin: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  job_order_id?: string;
  job_no: string;
  plate_number: string;
  customer_name: string;
  title: string;
  category: string;
  file_path: string;
  url?: string;
  file_size_kb: number;
  archived_by: string;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  user_id: string;
  username: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  in_repair: number;
  ready: number;
  bookings_pending: number;
  pipeline: Record<string, number>;
}

export interface AttentionItem {
  type: string;
  id: string;
  label: string;
  job_no?: string;
}
