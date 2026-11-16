/* ---------------------------------------------------------------
   CARBONTrack — domain types
   Derived from the Carbon Department Carshop client interview:
   core = customer + vehicle records, job orders, digital documents,
   pre-inspection photos, repair progress; supporting = booking.
   --------------------------------------------------------------- */

export type Role = 'owner' | 'admin' | 'mechanic';

export const SERVICES = ['Mechanical', 'Electrical', 'Body Repair', 'Carbon Fiber', 'Detailing'] as const;
export type ServiceType = (typeof SERVICES)[number];

export const STAGES = [
  'Checked-in',
  'Pre-Inspection',
  'Diagnosis',
  'For Approval',
  'In Progress',
  'Finishing & QC',
  'Ready for Release',
  'Released',
] as const;
export type Stage = (typeof STAGES)[number];

export type JobStatus = 'Open' | 'Waiting' | 'In Progress' | 'Ready' | 'Released';

export type Severity = 'Minor' | 'Moderate' | 'Major';

export type CustomerKind = 'Individual' | 'Fleet' | 'Insurance';

export const DOC_TYPES = [
  'Job Order',
  'Invoice',
  'Receipt',
  'Inspection Sheet',
  'OR / CR',
  'Insurance',
  'Photo Sheet',
] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const DOC_PREFIX: Record<DocType, string> = {
  'Job Order': 'JO',
  Invoice: 'INV',
  Receipt: 'REC',
  'Inspection Sheet': 'INSP',
  'OR / CR': 'ORCR',
  Insurance: 'INS',
  'Photo Sheet': 'PHOTO',
};

export type BodyType = 'Sedan' | 'SUV' | 'Pickup' | 'Van' | 'Hatchback' | 'MPV' | 'Coupe';

export type Zone =
  | 'Front'
  | 'Front-Left'
  | 'Left'
  | 'Rear'
  | 'Right'
  | 'Engine Bay'
  | 'Interior'
  | 'Odometer';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  kind: CustomerKind;
  company?: string;
  since: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  chassis: string;
  engine: string;
  fuel: string;
  bodyType: BodyType;
  mileage: number;
  createdAt: string;
}

export interface LineItem {
  id: string;
  kind: 'Labor' | 'Part' | 'Materials';
  desc: string;
  qty: number;
  unit: number;
}

export interface InspectionPhoto {
  id: string;
  zone: Zone;
  label: string;
  takenAt: string;
  takenBy: string;
  tone: number;
  hasDamage?: boolean;
  spot?: { x: number; y: number };
}

export interface DamageTag {
  id: string;
  area: string;
  severity: Severity;
  note: string;
  photoId?: string;
  acknowledged: boolean;
}

export interface ShopDoc {
  id: string;
  name: string;
  type: DocType;
  addedAt: string;
  addedBy: string;
  pages: number;
  kb: number;
}

export interface ProgressEntry {
  id: string;
  stage: Stage;
  at: string;
  note: string;
  by: string;
}

export interface JobOrder {
  id: string;
  code: string;
  vehicleId: string;
  customerId: string;
  serviceTypes: ServiceType[];
  concern: string;
  stage: Stage;
  receivedAt: string;
  promisedAt: string | null;
  releasedAt: string | null;
  technician: string;
  odometer: number;
  items: LineItem[];
  discount: number;
  notes: string;
  warranty: string;
  photos: InspectionPhoto[];
  damages: DamageTag[];
  docs: ShopDoc[];
  progress: ProgressEntry[];
  claimNo?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId?: string;
  name: string;
  phone: string;
  plate: string;
  vehicle: string;
  service: ServiceType;
  concern: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: BookingStatus;
  walkIn: boolean;
  note?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  kind: 'stage' | 'doc' | 'vehicle' | 'booking' | 'photo' | 'inspect' | 'delete';
  text: string;
  detail?: string;
  at: string;
  ref?: string;
}

export interface Session {
  role: Role;
  name: string;
  since: string;
}

export interface AppState {
  customers: Customer[];
  vehicles: Vehicle[];
  jobs: JobOrder[];
  bookings: Booking[];
  activity: Activity[];
  session: Session | null;
  seq: number;
}

export const STAGE_META: Record<Stage, { color: string; hint: string }> = {
  'Checked-in': { color: '#58a6ff', hint: 'Unit received, awaiting bay assignment' },
  'Pre-Inspection': { color: '#7c9eff', hint: 'Condition captured before service begins' },
  Diagnosis: { color: '#ffb020', hint: 'Technician is isolating the cause' },
  'For Approval': { color: '#ff8a4c', hint: 'Waiting for customer go-ahead' },
  'In Progress': { color: '#ff6b12', hint: 'Work is being performed' },
  'Finishing & QC': { color: '#b07cff', hint: 'Refinishing and final quality check' },
  'Ready for Release': { color: '#2fe3b0', hint: 'Complete — ready for pickup' },
  Released: { color: '#7c8a94', hint: 'Turned over to the customer' },
};

export const SERVICE_META: Record<ServiceType, { color: string; tint: string }> = {
  Mechanical: { color: '#ff8a4c', tint: 'rgba(255,138,76,.12)' },
  Electrical: { color: '#ffd166', tint: 'rgba(255,209,102,.12)' },
  'Body Repair': { color: '#58a6ff', tint: 'rgba(88,166,255,.12)' },
  'Carbon Fiber': { color: '#b07cff', tint: 'rgba(176,124,255,.12)' },
  Detailing: { color: '#2fe3b0', tint: 'rgba(47,227,176,.12)' },
};
