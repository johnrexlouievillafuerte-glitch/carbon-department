import type {
  Activity,
  AppState,
  Booking,
  Customer,
  DamageTag,
  InspectionPhoto,
  JobOrder,
  LineItem,
  ProgressEntry,
  Role,
  ServiceType,
  ShopDoc,
  Stage,
  Vehicle,
  Zone,
} from './types';
import { DOC_PREFIX, STAGE_META } from './types';
import { stageIndex, STAGES_ORDER } from './utils';

/* ---------------------------------------------------------------
   Shop profile — from the client profile document
   --------------------------------------------------------------- */
export const SHOP = {
  name: 'Carbon Department Auto-Body and Repair Services Co.',
  short: 'Carbon Department Carshop',
  address: '009 Felix Ave., Vista Verde, Cainta, Rizal',
  email: 'info@carbondepartment.com',
  phone: '0917 882 1923',
  established: 2020,
  hours: 'Mon – Sat · 8:00 AM – 6:00 PM',
  tin: '421-890-123-000',
};

export const TECHNICIANS = [
  { name: 'Lead Mechanical Technician', role: 'Head Mechanic' },
  { name: 'Body & Paint Specialist', role: 'Body & Paint' },
  { name: 'Auto Electrical Technician', role: 'Auto Electrical' },
  { name: 'Composite Specialist', role: 'Carbon Fiber Fabricator' },
  { name: 'Detailing Specialist', role: 'Detailing' },
];

export const ROLE_ACCOUNTS: Record<Role, { name: string; title: string; email: string }> = {
  owner: { name: 'Shop Administration', title: 'Managing Director', email: 'management@carbondepartment.com' },
  admin: { name: 'Service Advisor', title: 'Service Advisor', email: 'service@carbondepartment.com' },
  mechanic: { name: 'Lead Technician', title: 'Head Mechanic', email: 'workshop@carbondepartment.com' },
};

export const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

/* ---------------------------------------------------------------
   Seed helpers (relative to the moment the prototype is opened)
   --------------------------------------------------------------- */
const NOW = new Date();
const YR = NOW.getFullYear();
const code = (n: number) => `CD-${YR}-${String(n).padStart(4, '0')}`;

function ago(days: number, h = 9, m = 0): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function ahead(days: number, h = 17, m = 0): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const SPOTS: Record<Zone, { x: number; y: number }> = {
  Front: { x: 71, y: 53 },
  'Front-Left': { x: 58, y: 57 },
  Left: { x: 37, y: 53 },
  Rear: { x: 20, y: 51 },
  Right: { x: 66, y: 58 },
  'Engine Bay': { x: 68, y: 46 },
  Interior: { x: 50, y: 55 },
  Odometer: { x: 46, y: 52 },
};

function buildPhotos(c: string, at: string, zones: Zone[], by: string, damaged: Zone[] = []): InspectionPhoto[] {
  return zones.map((zone, i) => ({
    id: `ph-${c}-${i}`,
    zone,
    label: zone === 'Odometer' ? 'Odometer reading' : zone === 'Engine Bay' ? 'Engine bay' : `${zone} view`,
    takenAt: new Date(new Date(at).getTime() + i * 3 * 60_000).toISOString(),
    takenBy: by,
    tone: i % 5,
    hasDamage: damaged.includes(zone),
    spot: SPOTS[zone],
  }));
}

function buildProgress(
  c: string,
  stage: Stage,
  receivedAt: string,
  tech: string,
  notes: Partial<Record<Stage, string>>,
  releasedAt: string | null,
): ProgressEntry[] {
  const idx = stageIndex(stage);
  const start = new Date(receivedAt).getTime();
  const end = releasedAt ? new Date(releasedAt).getTime() : Date.now() - 45 * 60_000;
  const span = Math.max(idx, 1);
  return Array.from({ length: idx + 1 }, (_, i) => {
    const s = STAGES_ORDER[i];
    const t = start + ((end - start) * i) / span;
    return {
      id: `pe-${c}-${i}`,
      stage: s,
      at: new Date(t).toISOString(),
      note: notes[s] ?? STAGE_META[s].hint,
      by: i >= 1 ? tech : 'Service Desk',
    };
  });
}

function buildDocs(c: string, receivedAt: string, stage: Stage, by: string, releasedAt: string | null, extra: ShopDoc['type'][] = []): ShopDoc[] {
  const suffix = c.slice(-4);
  const idx = stageIndex(stage);
  const base: Array<{ name: string; type: ShopDoc['type']; pages: number; kb: number; at: string }> = [
    { name: `JO-${suffix}.pdf`, type: 'Job Order', pages: 2, kb: 486, at: receivedAt },
    { name: `ORCR-${suffix}.pdf`, type: 'OR / CR', pages: 1, kb: 312, at: receivedAt },
  ];
  if (idx >= 1) {
    base.push({ name: `INSP-${suffix}.pdf`, type: 'Inspection Sheet', pages: 2, kb: 640, at: receivedAt });
    base.push({ name: `PHOTO-${suffix}.pdf`, type: 'Photo Sheet', pages: 4, kb: 2140, at: receivedAt });
  }
  if (idx >= 4) {
    base.push({ name: `INV-${suffix}.pdf`, type: 'Invoice', pages: 1, kb: 244, at: releasedAt ?? new Date().toISOString() });
  }
  if (releasedAt) {
    base.push({ name: `REC-${suffix}.pdf`, type: 'Receipt', pages: 1, kb: 198, at: releasedAt });
  }
  for (const t of extra) {
    base.push({ name: `${DOC_PREFIX[t]}-${suffix}.pdf`, type: t, pages: 2, kb: 520, at: receivedAt });
  }
  return base.map((d, i) => ({
    id: `doc-${c}-${i}`,
    name: d.name,
    type: d.type,
    addedAt: d.at,
    addedBy: by,
    pages: d.pages,
    kb: d.kb,
  }));
}

interface JobSeed {
  n: number;
  vehicleId: string;
  customerId: string;
  services: ServiceType[];
  concern: string;
  stage: Stage;
  received: string;
  promised: string | null;
  released: string | null;
  tech: string;
  odo: number;
  items: LineItem[];
  discount?: number;
  notes: string;
  warranty: string;
  zones: Zone[];
  damaged?: Zone[];
  damages?: Array<Omit<DamageTag, 'id'>>;
  progress?: Partial<Record<Stage, string>>;
  claimNo?: string;
  extraDocs?: ShopDoc['type'][];
}

function makeJob(s: JobSeed): JobOrder {
  const c = code(s.n);
  const allDamages = s.damages ?? [];
  const photos = buildPhotos(c, s.received, s.zones, s.tech, s.damaged);
  return {
    id: `jo-${s.n}`,
    code: c,
    vehicleId: s.vehicleId,
    customerId: s.customerId,
    serviceTypes: s.services,
    concern: s.concern,
    stage: s.stage,
    receivedAt: s.received,
    promisedAt: s.promised,
    releasedAt: s.released,
    technician: s.tech,
    odometer: s.odo,
    items: s.items.map((it, i) => ({ ...it, id: `li-${c}-${i}` })),
    discount: s.discount ?? 0,
    notes: s.notes,
    warranty: s.warranty,
    photos,
    damages: allDamages.map((d, i) => ({ ...d, id: `dm-${c}-${i}` })),
    docs: buildDocs(c, s.received, s.stage, 'Jasmine Ocampo', s.released, s.extraDocs),
    progress: buildProgress(c, s.stage, s.received, s.tech, s.progress ?? {}, s.released),
    claimNo: s.claimNo,
    createdAt: s.received,
  };
}

const li = (kind: LineItem['kind'], desc: string, qty: number, unit: number): LineItem => ({
  id: '',
  kind,
  desc,
  qty,
  unit,
});

/* ---------------------------------------------------------------
   Customers
   --------------------------------------------------------------- */
const customers: Customer[] = [
  { id: 'c1', name: 'Miguel Santos', phone: '0917 824 5510', email: 'miguel.santos@gmail.com', address: '12 Narra St., Vista Verde, Cainta', kind: 'Individual', since: '2021-03-14', notes: 'Prefers SMS updates. Repeat body-repair customer.' },
  { id: 'c2', name: 'Andrea Villanueva', phone: '0918 335 2214', email: 'andrea.v@gmail.com', address: 'Blk 7 Lot 12, Karangalan Village, Cainta', kind: 'Individual', since: '2022-07-02' },
  { id: 'c3', name: 'Ramon Dela Cruz', phone: '0920 118 7742', email: 'ramon.delacruz@yahoo.com', address: '88 Sumulong Hwy., Antipolo City', kind: 'Individual', since: '2020-11-19' },
  { id: 'c4', name: 'Kristine Reyes', phone: '0917 662 9031', email: 'kristine.reyes@gmail.com', address: '5 Acacia Lane, Dela Paz, Pasig City', kind: 'Individual', since: '2023-01-27', notes: 'Carbon fiber enthusiast — build project.' },
  { id: 'c5', name: 'Jeremiah Lim', phone: '0995 220 1187', email: 'jeremiah.lim@gmail.com', address: '21 Marcos Hwy., Mayamot, Antipolo City', kind: 'Individual', since: '2021-09-08' },
  { id: 'c6', name: 'Bianca Manalo', phone: '0916 448 7723', email: 'bianca.manalo@gmail.com', address: 'Unit 4B Vermont Park, Cainta', kind: 'Individual', since: '2024-02-16' },
  { id: 'c7', name: 'Dennis Ocampo', phone: '0927 551 8842', email: 'dennis.ocampo@gmail.com', address: '33 Ortigas Ext., Taytay, Rizal', kind: 'Individual', since: '2022-05-30' },
  { id: 'c8', name: 'Paolo Garcia', phone: '0917 990 4418', email: 'paolo.garcia@gmail.com', address: '7 Sampaguita St., San Isidro, Cainta', kind: 'Individual', since: '2023-08-11' },
  { id: 'c9', name: 'Joanne Aquino', phone: '0928 337 5521', email: 'joanne.aquino@gmail.com', address: '14 Mabini St., Binangonan, Rizal', kind: 'Individual', since: '2024-06-04' },
  { id: 'c10', name: 'Mark Anthony Bautista', phone: '0917 221 8890', email: 'mark.bautista@gmail.com', address: '3 Lopez Ave., Brgy. San Juan, Taytay', kind: 'Individual', since: '2021-12-01' },
  { id: 'c11', name: 'Carlos Tan', phone: '0918 776 2210', email: 'carlos.tan@gmail.com', address: '50 E. Rodriguez Ave., Pasig City', kind: 'Individual', since: '2022-10-22' },
  { id: 'c12', name: 'Vista Verde Logistics Corp.', phone: '0917 888 1200', email: 'fleet@vistavverdelogistics.ph', address: 'Warehouse 3, Felix Ave., Cainta, Rizal', kind: 'Fleet', company: 'Vista Verde Logistics Corp.', since: '2024-04-08', notes: '15-unit delivery fleet. Contact: Liza Fernandez (Purchasing). Monthly PMS schedule.' },
  { id: 'c13', name: 'AXA Philippines — Claims Desk', phone: '(02) 8845 0000', email: 'claims@axa.com.ph', address: 'AXA Philippines, Makati City', kind: 'Insurance', company: 'AXA Philippines', since: '2026-08-20', notes: 'Referral target for 2026–2027. Collision repair referral; no automated claim integration in this prototype.' },
];

/* ---------------------------------------------------------------
   Vehicles
   --------------------------------------------------------------- */
const vehicles: Vehicle[] = [
  { id: 'v1', customerId: 'c1', plate: 'NCR 4821', make: 'Toyota', model: 'Fortuner 2.8 V', year: 2021, color: 'Pearl White', vin: 'MR0KA3CD4M0512874', chassis: 'KA3CD4M0512874', engine: '2.8L 1GD-FTV Diesel', fuel: 'Diesel', bodyType: 'SUV', mileage: 48210, createdAt: '2021-03-14T09:00:00.000Z' },
  { id: 'v2', customerId: 'c2', plate: 'ABC 1234', make: 'Honda', model: 'Civic 1.8 E', year: 2019, color: 'Rallye Red', vin: 'PADFC2640K9012345', chassis: 'FC2640K9012345', engine: '1.8L R18 Gasoline', fuel: 'Gasoline', bodyType: 'Sedan', mileage: 61400, createdAt: '2022-07-02T09:00:00.000Z' },
  { id: 'v3', customerId: 'c3', plate: 'DVL 872', make: 'Mitsubishi', model: 'Montero Sport GLS', year: 2020, color: 'Quartz White', vin: 'MMBJNKB40LH012874', chassis: 'NKB40LH012874', engine: '2.4L 4N15 Diesel', fuel: 'Diesel', bodyType: 'SUV', mileage: 38720, createdAt: '2020-11-19T09:00:00.000Z' },
  { id: 'v4', customerId: 'c4', plate: 'CFB 086', make: 'Toyota', model: '86 GT', year: 2016, color: 'Raven Black', vin: 'JF1ZNAA10G9012086', chassis: 'ZNAA10G9012086', engine: '2.0L FA20 Gasoline', fuel: 'Gasoline', bodyType: 'Coupe', mileage: 54890, createdAt: '2023-01-27T09:00:00.000Z' },
  { id: 'v5', customerId: 'c5', plate: 'NGI 5521', make: 'Nissan', model: 'Navara EL 4x4', year: 2018, color: 'Fiery Red', vin: 'MNTFB2D22J0015521', chassis: 'FB2D22J0015521', engine: '2.5L YD25 Diesel', fuel: 'Diesel', bodyType: 'Pickup', mileage: 102300, createdAt: '2021-09-08T09:00:00.000Z' },
  { id: 'v6', customerId: 'c6', plate: 'BYD 8821', make: 'BYD', model: 'Atto 3 EV', year: 2023, color: 'Surf Blue', vin: 'LC0C74C43P0088211', chassis: 'C74C43P0088211', engine: '60.5 kWh Blade Battery (EV)', fuel: 'Electric', bodyType: 'SUV', mileage: 21450, createdAt: '2024-02-16T09:00:00.000Z' },
  { id: 'v7', customerId: 'c7', plate: 'TGP 4477', make: 'Ford', model: 'Ranger Raptor', year: 2022, color: 'Arctic White', vin: 'MNBBBBB0XN1447701', chassis: 'BBB0XN1447701', engine: '2.0L BiTurbo Diesel', fuel: 'Diesel', bodyType: 'Pickup', mileage: 44700, createdAt: '2022-05-30T09:00:00.000Z' },
  { id: 'v8', customerId: 'c8', plate: 'SAA 1180', make: 'Suzuki', model: 'Jimny GLX', year: 2021, color: 'Kinetic Yellow', vin: 'JS3JB43V0M4111800', chassis: 'JB43V0M4111800', engine: '1.5L K15B Gasoline', fuel: 'Gasoline', bodyType: 'SUV', mileage: 33120, createdAt: '2023-08-11T09:00:00.000Z' },
  { id: 'v9', customerId: 'c9', plate: 'CHR 9932', make: 'Chery', model: 'Tiggo 8 Pro', year: 2024, color: 'Phantom Grey', vin: 'LVTDB21BXRK099321', chassis: 'DB21BXRK099321', engine: '1.6L TGDI Gasoline', fuel: 'Gasoline', bodyType: 'SUV', mileage: 18900, createdAt: '2024-06-04T09:00:00.000Z' },
  { id: 'v10', customerId: 'c10', plate: 'MGG 3310', make: 'MG', model: 'ZS Alpha', year: 2022, color: 'Diamond Red', vin: 'LSJWC2E92NZ033100', chassis: 'WC2E92NZ033100', engine: '1.5L Gasoline', fuel: 'Gasoline', bodyType: 'SUV', mileage: 41330, createdAt: '2021-12-01T09:00:00.000Z' },
  { id: 'v11', customerId: 'c11', plate: 'LCR 0021', make: 'Toyota', model: 'Land Cruiser 300', year: 2023, color: 'Precious White', vin: 'MR0AB0CB6P0000021', chassis: 'AB0CB6P0000021', engine: '3.3L F33A-FTV Diesel', fuel: 'Diesel', bodyType: 'SUV', mileage: 12040, createdAt: '2022-10-22T09:00:00.000Z' },
  { id: 'v12', customerId: 'c12', plate: 'CBF 2210', make: 'Isuzu', model: 'D-Max LS-A', year: 2022, color: 'Sapphire Blue', vin: 'MPATFS87JN0022101', chassis: 'TFS87JN0022101', engine: '3.0L 4JJ3 Diesel', fuel: 'Diesel', bodyType: 'Pickup', mileage: 88410, createdAt: '2024-04-08T09:00:00.000Z' },
  { id: 'v13', customerId: 'c12', plate: 'CBF 2211', make: 'Isuzu', model: 'D-Max LS-A', year: 2022, color: 'Sapphire Blue', vin: 'MPATFS87JN0022111', chassis: 'TFS87JN0022111', engine: '3.0L 4JJ3 Diesel', fuel: 'Diesel', bodyType: 'Pickup', mileage: 81200, createdAt: '2024-04-08T09:05:00.000Z' },
  { id: 'v14', customerId: 'c13', plate: 'VIO 3391', make: 'Toyota', model: 'Vios 1.3 XLE', year: 2020, color: 'Super Red', vin: 'MR0FB1CD8L0333910', chassis: 'FB1CD8L0333910', engine: '1.3L 2NR Gasoline', fuel: 'Gasoline', bodyType: 'Sedan', mileage: 57890, createdAt: '2026-08-20T09:00:00.000Z' },
];

/* ---------------------------------------------------------------
   Job orders
   --------------------------------------------------------------- */
const jobs: JobOrder[] = [
  makeJob({
    n: 144, vehicleId: 'v1', customerId: 'c1', services: ['Body Repair'],
    concern: 'Front-left collision: bumper cracked, left fender dented, headlamp housing misaligned. Repaint to match Pearl White.',
    stage: 'In Progress', received: ago(6, 8, 20), promised: ahead(3), released: null,
    tech: 'Joel Bautista', odo: 48210, discount: 3000,
    items: [
      li('Part', 'Front bumper assembly (OEM)', 1, 28500),
      li('Part', 'Bumper bracket & clip set', 2, 1450),
      li('Part', 'Left fender panel (replacement)', 1, 9800),
      li('Labor', 'Body panel alignment & fitting', 1, 6500),
      li('Labor', 'Panel repair + 3-coat repaint', 1, 8500),
      li('Materials', 'Paint mixing & clear coat', 1, 4200),
      li('Labor', 'Headlamp alignment & polishing', 1, 1200),
    ],
    notes: 'Customer approval for parts on file (Messenger screenshot). Replacement fender ordered — ETA 2 days. Paint match verified against fuel door panel.',
    warranty: '6 months workmanship warranty on paint and fitment.',
    zones: ['Front', 'Front-Left', 'Left', 'Rear', 'Engine Bay', 'Odometer'],
    damaged: ['Front', 'Front-Left'],
    damages: [
      { area: 'Left fender', severity: 'Moderate', note: 'Pre-existing dent and paint scuff near wheel arch.', photoId: `ph-CD-${YR}-0144-1`, acknowledged: true },
      { area: 'Front bumper', severity: 'Major', note: 'Crack below headlamp; clip tabs broken.', photoId: `ph-CD-${YR}-0144-0`, acknowledged: false },
      { area: 'Hood leading edge', severity: 'Minor', note: 'Stone chips along the edge.', photoId: `ph-CD-${YR}-0144-0`, acknowledged: true },
    ],
    progress: {
      'Checked-in': 'Unit received 8:20 AM. Keys and OR/CR photocopy turned over.',
      'Pre-Inspection': 'Six pre-inspection photos captured, including existing fender dent and bumper crack.',
      Diagnosis: 'Panel gap measurement completed. Left fender beyond repair — replacement recommended.',
      'For Approval': 'Quotation sent to customer. Approved same day at 3:40 PM.',
      'In Progress': 'Fender replacement fitted and aligned. Bumper prep in progress in Bay 2.',
    },
  }),
  makeJob({
    n: 145, vehicleId: 'v2', customerId: 'c2', services: ['Mechanical'],
    concern: 'Overheating after 20 minutes of driving; coolant reservoir empty. Suspected water pump failure.',
    stage: 'For Approval', received: ago(2, 9, 10), promised: ahead(2), released: null,
    tech: 'Rey Salvador', odo: 61400,
    items: [
      li('Part', 'Water pump assembly', 1, 8900),
      li('Part', 'Thermostat with housing', 1, 2400),
      li('Part', 'Coolant concentrate (5L)', 2, 650),
      li('Labor', 'Cooling system overhaul', 1, 3500),
      li('Labor', 'Pressure test & bleed', 1, 800),
    ],
    notes: 'Pressure test confirms leak at the pump weep hole. Awaiting customer approval before ordering parts. No fixed price was quoted before inspection, per shop policy.',
    warranty: '3 months on parts, 6 months on labor.',
    zones: ['Front', 'Engine Bay', 'Odometer'],
    progress: {
      'Checked-in': 'Unit received for overheating complaint.',
      'Pre-Inspection': 'Coolant level below minimum. No external body damage noted.',
      Diagnosis: 'Pressure test isolated a leak at the water pump weep hole. Thermostat also sticking.',
      'For Approval': 'Quotation of ₱16,900 sent to customer via email and Messenger. Awaiting approval.',
    },
  }),
  makeJob({
    n: 146, vehicleId: 'v3', customerId: 'c3', services: ['Electrical'],
    concern: 'Intermittent no-start; battery drains overnight. Aftermarket alarm installed last month.',
    stage: 'Diagnosis', received: ago(1, 8, 45), promised: ahead(1), released: null,
    tech: 'Arnel Dizon', odo: 38720,
    items: [li('Labor', 'Electrical diagnostic (parasitic draw)', 1, 1500)],
    notes: 'Parasitic draw measured at 0.42A at rest. Aftermarket alarm module is the prime suspect; probing harness next. Battery load-tested healthy.',
    warranty: '—',
    zones: ['Front', 'Engine Bay', 'Odometer'],
    progress: {
      'Checked-in': 'Unit dropped off at 8:45 AM. Customer reports two no-start incidents this week.',
      'Pre-Inspection': 'Battery terminals and visible wiring photographed.',
      Diagnosis: 'Parasitic draw test in progress. Alarm module drawing 0.42A at rest — likely root cause.',
    },
  }),
  makeJob({
    n: 147, vehicleId: 'v4', customerId: 'c4', services: ['Carbon Fiber'],
    concern: 'Custom carbon fiber hood with vented centre, front fender vents, and rear ducktail. Customer-supplied design reference.',
    stage: 'Finishing & QC', received: ago(11, 9, 0), promised: ahead(1), released: null,
    tech: 'Kim Fernandez', odo: 54890, discount: 5000,
    items: [
      li('Part', 'Carbon fiber hood (custom mold)', 1, 48000),
      li('Part', 'Fender vent pair (pre-preg)', 2, 6500),
      li('Part', 'Rear ducktail spoiler', 1, 12000),
      li('Labor', 'Fabrication, fitting & alignment', 1, 9000),
      li('Materials', 'UV clear coat & wet sand', 1, 3800),
    ],
    notes: '3K twill weave, vacuum-bagged. Hood pins test-fitted. Final wet-sand and UV clear in progress. One-week lead-time extension due to mold cure.',
    warranty: '1 year workmanship warranty on fabrication and clear coat.',
    zones: ['Front', 'Left', 'Rear'],
    progress: {
      'Checked-in': 'Build project received. Design reference and fitment notes logged.',
      'Pre-Inspection': 'Factory hood and fender condition documented before removal.',
      Diagnosis: 'Mounting points measured; custom mold prepared for hood and ducktail.',
      'For Approval': 'Revised quotation approved after adding fender vents.',
      'In Progress': 'Hood and ducktail laid up and vacuum-bagged. Trial fit completed on the vehicle.',
      'Finishing & QC': 'Wet sand 1500–3000 grit and UV clear applied. Curing under bay lamps.',
    },
  }),
  makeJob({
    n: 148, vehicleId: 'v5', customerId: 'c5', services: ['Mechanical'],
    concern: '100,000 km preventive maintenance: change oil, filters, brake pads, transmission fluid.',
    stage: 'Ready for Release', received: ago(4, 8, 0), promised: ago(1), released: null,
    tech: 'Rey Salvador', odo: 102300,
    items: [
      li('Part', 'Engine oil (fully synthetic)', 7, 480),
      li('Part', 'Oil filter', 1, 650),
      li('Part', 'Air filter', 1, 1250),
      li('Part', 'Cabin filter', 1, 900),
      li('Part', 'Front brake pad set', 1, 3200),
      li('Part', 'Automatic transmission fluid', 4, 620),
      li('Labor', '100k PMS labor', 1, 2500),
    ],
    notes: 'Complete and road-tested. Brake rotors still above minimum thickness; advised replacement at the next service. Customer notified for pickup.',
    warranty: '3 months on consumables fitment.',
    zones: ['Front', 'Engine Bay', 'Odometer'],
    progress: {
      'Pre-Inspection': 'Underbody and brake condition photographed before service.',
      'In Progress': 'Oil, filters, brake pads and ATF replaced. Torque values recorded.',
      'Finishing & QC': 'Road test completed — 8 km. No leaks or warning lights.',
      'Ready for Release': 'Washed and parked in release bay. Customer advised by SMS.',
    },
  }),
  makeJob({
    n: 149, vehicleId: 'v6', customerId: 'c6', services: ['Electrical'],
    concern: 'Charging port intermittently fails to latch; 12V auxiliary battery warning appears after long idle.',
    stage: 'Checked-in', received: ago(0, 8, 15), promised: ahead(2), released: null,
    tech: 'Arnel Dizon', odo: 21450,
    items: [li('Labor', 'EV diagnostic & safety check', 1, 1800)],
    notes: 'Unit just arrived. Complete the EV high-voltage safety checklist before probing the charge port. Customer advised not to leave the vehicle below 20% charge.',
    warranty: '—',
    zones: ['Front', 'Engine Bay'],
    progress: {
      'Checked-in': 'Arrived 8:15 AM. Charge port fault reproduced once at reception.',
    },
  }),
  makeJob({
    n: 150, vehicleId: 'v7', customerId: 'c7', services: ['Body Repair'],
    concern: 'Right bedside dent from reversing into a post; tailgate scuffed. Repaint and blend.',
    stage: 'Released', received: ago(38, 9, 0), promised: ago(18), released: ago(16, 15, 30),
    tech: 'Joel Bautista', odo: 44700, discount: 1000,
    items: [
      li('Labor', 'Panel beating — right bedside', 1, 7500),
      li('Labor', 'Repaint right quarter + blend', 1, 8000),
      li('Materials', 'Paint & clear coat', 1, 3400),
      li('Labor', 'Tailgate scuff repair', 1, 2200),
    ],
    notes: 'Released and signed. Job order, invoice and receipt scanned into CARBONTrack — no paper retention risk.',
    warranty: '6 months workmanship warranty on paint.',
    zones: ['Front', 'Right', 'Rear'],
    progress: {
      'For Approval': 'Repair scope and cost approved by customer.',
      'In Progress': 'Panel beating on right bedside completed; tailgate prepped.',
      'Finishing & QC': 'Paint blended and cured. Color match checked under daylight lamps.',
      'Ready for Release': 'Final inspection passed. Customer scheduled pickup.',
      Released: 'Turned over to customer at 3:30 PM. Signed release form scanned.',
    },
  }),
  makeJob({
    n: 151, vehicleId: 'v8', customerId: 'c8', services: ['Detailing'],
    concern: 'Full exterior decontamination, two-step paint correction, and 5-year ceramic coating.',
    stage: 'Released', received: ago(21, 8, 30), promised: ago(19), released: ago(19, 16, 0),
    tech: 'Marvin Cruz', odo: 33120, discount: 2000,
    items: [
      li('Labor', 'Two-step paint correction', 1, 8500),
      li('Part', 'Ceramic coating (5-year)', 1, 18000),
      li('Labor', 'Interior detail', 1, 3500),
      li('Labor', 'Engine bay detail', 1, 1500),
    ],
    notes: 'Coating cured 24 hours in the bay. Customer advised not to wash for 7 days. Warranty card issued.',
    warranty: '5-year ceramic coating warranty — registered.',
    zones: ['Front', 'Interior', 'Odometer'],
    progress: {
      'In Progress': 'Decontamination and clay bar complete; paint correction started.',
      'Finishing & QC': 'Coating applied and curing under IR lamps.',
      Released: 'Released to customer with care instructions.',
    },
  }),
  makeJob({
    n: 152, vehicleId: 'v9', customerId: 'c9', services: ['Mechanical'],
    concern: 'Aircon weak at idle; cabin filter due. Initial inspection before quotation.',
    stage: 'Pre-Inspection', received: ago(0, 9, 5), promised: ahead(2), released: null,
    tech: 'Rey Salvador', odo: 18900,
    items: [li('Labor', 'Initial inspection', 1, 1000)],
    notes: 'Walk-in at 9:05 AM. Awaiting bay assignment. Pre-inspection photos required before diagnostic work, per shop policy.',
    warranty: '—',
    zones: ['Front', 'Engine Bay'],
    progress: {
      'Checked-in': 'Walk-in unit logged at reception. Customer waiting for initial estimate.',
      'Pre-Inspection': 'Body condition captured. Awaiting bay availability for A/C pressure test.',
    },
  }),
  makeJob({
    n: 153, vehicleId: 'v10', customerId: 'c10', services: ['Body Repair'],
    concern: 'Rear bumper and tailgate damage from a low-speed backing collision; parking sensors misaligned.',
    stage: 'In Progress', received: ago(5, 10, 10), promised: ahead(2), released: null,
    tech: 'Joel Bautista', odo: 41330, discount: 1500,
    items: [
      li('Part', 'Rear bumper cover', 1, 16800),
      li('Labor', 'Tailgate panel repair', 1, 5200),
      li('Labor', 'Paint & blend — rear section', 1, 6500),
      li('Materials', 'Paint materials', 1, 3100),
      li('Labor', 'Parking sensor recalibration', 1, 1800),
    ],
    notes: 'Bumper painted and curing in Bay 3. Sensor recalibration scheduled after reassembly. Target release Friday.',
    warranty: '6 months workmanship warranty on paint and fitment.',
    zones: ['Rear', 'Right', 'Front'],
    progress: {
      'Pre-Inspection': 'Rear bumper scuffing and sensor misalignment documented with photos.',
      'For Approval': 'Approved by customer the same afternoon.',
      'In Progress': 'New bumper cover painted; tailgate repair completed. Sensor calibration pending reassembly.',
    },
  }),
  makeJob({
    n: 154, vehicleId: 'v11', customerId: 'c11', services: ['Detailing'],
    concern: 'Interior deep clean and paint correction for pre-delivery presentation.',
    stage: 'Released', received: ago(52, 8, 0), promised: ago(49), released: ago(49, 17, 0),
    tech: 'Marvin Cruz', odo: 12040,
    items: [
      li('Labor', 'Interior deep clean', 1, 6000),
      li('Labor', 'Paint correction', 1, 9000),
      li('Part', 'Glass coating', 1, 2500),
    ],
    notes: 'Photographed before and after. Owner requested records kept permanently for resale documentation.',
    warranty: '—',
    zones: ['Front', 'Interior'],
    progress: {
      'In Progress': 'Interior steam clean and leather conditioning completed.',
      'Finishing & QC': 'Paint corrected and glass coated. Final walkaround with owner.',
      Released: 'Released. Before/after photo set archived with the record.',
    },
  }),
  makeJob({
    n: 155, vehicleId: 'v12', customerId: 'c12', services: ['Mechanical'],
    concern: 'Clutch slipping under load. Fleet unit — requesting approval for clutch kit replacement.',
    stage: 'For Approval', received: ago(3, 7, 50), promised: ahead(3), released: null,
    tech: 'Rey Salvador', odo: 88410, discount: 2000,
    items: [
      li('Part', 'Clutch kit', 1, 14500),
      li('Part', 'Release bearing', 1, 2800),
      li('Labor', 'Transmission removal & install', 1, 6500),
      li('Part', 'Gear oil (1L)', 3, 720),
    ],
    notes: 'Fleet account — approval required from Liza Fernandez (Purchasing). Priority bay reserved under the 15-unit service agreement.',
    warranty: '6 months on clutch kit fitment.',
    zones: ['Front', 'Engine Bay', 'Odometer'],
    progress: {
      'Checked-in': 'Fleet unit #1 received under the monthly service agreement.',
      'Pre-Inspection': 'Odometer and underbody photographed for fleet reporting.',
      Diagnosis: 'Clutch slip confirmed on road test. Flywheel scoring visible through inspection port.',
      'For Approval': 'Quotation sent to fleet purchasing for approval. Awaiting PO.',
    },
  }),
  makeJob({
    n: 156, vehicleId: 'v14', customerId: 'c13', services: ['Body Repair'],
    concern: 'Rear-end collision claim. Insurer estimate requires photo documentation and an itemized job order.',
    stage: 'Pre-Inspection', received: ago(0, 10, 30), promised: ahead(5), released: null,
    tech: 'Joel Bautista', odo: 57890, claimNo: 'AXA-CL-2026-04417',
    items: [
      li('Part', 'Rear bumper cover', 1, 14200),
      li('Labor', 'Trunk floor pull & realign', 1, 4500),
      li('Labor', 'Paint — rear section', 1, 6000),
    ],
    notes: 'Insurance referral from AXA. Photo set captured for claim submission. Digital claim integration is a proposed Phase 2 workflow and is not part of this prototype.',
    warranty: 'Per insurer approval.',
    zones: ['Front-Left', 'Front', 'Left', 'Odometer', 'Interior', 'Rear'],
    damaged: ['Rear'],
    damages: [
      { area: 'Rear bumper', severity: 'Major', note: 'Deformation and cracked cover from rear impact.', photoId: `ph-CD-${YR}-0156-5`, acknowledged: true },
      { area: 'Trunk floor', severity: 'Moderate', note: 'Slight buckling near the spare well.', photoId: `ph-CD-${YR}-0156-5`, acknowledged: true },
    ],
    progress: {
      'Checked-in': 'Claim unit received from AXA. Claim number recorded against the job order.',
      'Pre-Inspection': 'Six-angle photo set captured for the insurer, including rear impact damage.',
    },
    extraDocs: ['Insurance'],
  }),
];

/* ---------------------------------------------------------------
   Bookings — always inside the current week (Mon–Sat)
   --------------------------------------------------------------- */
const weekStart = (() => {
  const d = new Date(NOW);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow));
  return d;
})();
const day = (i: number) => {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const bookings: Booking[] = [
  { id: 'b1', customerId: 'c12', name: 'Liza Fernandez', phone: '0917 888 1200', plate: 'CBF 2211', vehicle: 'Isuzu D-Max LS-A', service: 'Mechanical', concern: 'Monthly fleet PMS — oil, filters, brake inspection.', date: day(0), time: '08:00', status: 'Confirmed', walkIn: false, note: 'Fleet unit #2 · 15-unit account', createdAt: ago(5, 10, 0) },
  { id: 'b2', customerId: 'c2', name: 'Andrea Villanueva', phone: '0918 335 2214', plate: 'ABC 1234', vehicle: 'Honda Civic 1.8 E', service: 'Mechanical', concern: 'Follow-up on overheating concern before parts approval.', date: day(0), time: '09:00', status: 'Completed', walkIn: false, createdAt: ago(4, 14, 20) },
  { id: 'b3', customerId: 'c1', name: 'Miguel Santos', phone: '0917 824 5510', plate: 'NCR 4821', vehicle: 'Toyota Fortuner 2.8 V', service: 'Body Repair', concern: 'Check paint blend and bumper fitment before release.', date: day(1), time: '10:00', status: 'Confirmed', walkIn: false, createdAt: ago(3, 9, 15) },
  { id: 'b4', customerId: 'c9', name: 'Joanne Aquino', phone: '0928 337 5521', plate: 'CHR 9932', vehicle: 'Chery Tiggo 8 Pro', service: 'Mechanical', concern: 'Aircon diagnosis — weak cooling at idle.', date: day(1), time: '08:00', status: 'Confirmed', walkIn: false, createdAt: ago(2, 16, 40) },
  { id: 'b5', customerId: 'c6', name: 'Bianca Manalo', phone: '0916 448 7723', plate: 'BYD 8821', vehicle: 'BYD Atto 3 EV', service: 'Electrical', concern: 'Charge port latch and 12V warning — EV specialist slot.', date: day(2), time: '11:00', status: 'Confirmed', walkIn: false, createdAt: ago(2, 8, 5) },
  { id: 'b6', customerId: 'c8', name: 'Paolo Garcia', phone: '0917 990 4418', plate: 'SAA 1180', vehicle: 'Suzuki Jimny GLX', service: 'Detailing', concern: 'Ceramic coating maintenance wash; needs the unit for two days.', date: day(2), time: '13:00', status: 'Pending', walkIn: false, note: 'Time-constrained — weekend trip', createdAt: ago(1, 11, 30) },
  { id: 'b7', customerId: 'c11', name: 'Carlos Tan', phone: '0918 776 2210', plate: 'LCR 0021', vehicle: 'Toyota Land Cruiser 300', service: 'Detailing', concern: 'Annual interior detail and glass coating.', date: day(3), time: '14:00', status: 'Confirmed', walkIn: false, createdAt: ago(6, 13, 10) },
  { id: 'b8', customerId: 'c10', name: 'Mark Anthony Bautista', phone: '0917 221 8890', plate: 'MGG 3310', vehicle: 'MG ZS Alpha', service: 'Body Repair', concern: 'Parking sensor recalibration and bumper check.', date: day(4), time: '09:00', status: 'Completed', walkIn: false, createdAt: ago(5, 15, 45) },
  { id: 'b9', customerId: 'c4', name: 'Kristine Reyes', phone: '0917 662 9031', plate: 'CFB 086', vehicle: 'Toyota 86 GT', service: 'Carbon Fiber', concern: 'Final fitment check and pickup of carbon parts.', date: day(5), time: '10:00', status: 'Confirmed', walkIn: false, createdAt: ago(8, 10, 20) },
  { id: 'b10', customerId: 'c7', name: 'Dennis Ocampo', phone: '0927 551 8842', plate: 'TGP 4477', vehicle: 'Ford Ranger Raptor', service: 'Body Repair', concern: 'Warranty check on right bedside paint.', date: day(4), time: '15:00', status: 'Cancelled', walkIn: false, note: 'Rescheduled by customer', createdAt: ago(4, 9, 0) },
  { id: 'b11', customerId: 'c5', name: 'Jeremiah Lim', phone: '0995 220 1187', plate: 'NGI 5521', vehicle: 'Nissan Navara EL 4x4', service: 'Mechanical', concern: 'Post-service check after 100k PMS.', date: day(5), time: '13:00', status: 'Pending', walkIn: false, note: 'Requested Saturday afternoon', createdAt: ago(1, 9, 45) },
];

/* ---------------------------------------------------------------
   Activity feed
   --------------------------------------------------------------- */
const minsAgo = (m: number) => new Date(NOW.getTime() - m * 60_000).toISOString();

const activity: Activity[] = [
  { id: 'a1', kind: 'stage', text: 'Joel Bautista moved NCR 4821 to In Progress', detail: 'Bumper prep started in Bay 2', at: minsAgo(18), ref: 'jo-144' },
  { id: 'a2', kind: 'inspect', text: 'Pre-inspection photos captured for VIO 3391', detail: '6 photos · AXA claim AXA-CL-2026-04417', at: minsAgo(47), ref: 'jo-156' },
  { id: 'a3', kind: 'photo', text: 'Rey Salvador logged a diagnosis on DVL 872', detail: 'Parasitic draw 0.42A at rest', at: minsAgo(76), ref: 'jo-146' },
  { id: 'a4', kind: 'doc', text: 'Invoice scanned for CD-' + YR + '-0150', detail: 'Job order + receipt archived permanently', at: ago(1, 16, 10), ref: 'jo-150' },
  { id: 'a5', kind: 'booking', text: 'New booking — Bianca Manalo · BYD 8821', detail: 'Wednesday 11:00 AM · Electrical', at: ago(2, 8, 5) },
  { id: 'a6', kind: 'stage', text: 'Kim Fernandez moved CFB 086 to Finishing & QC', detail: 'UV clear applied, curing under lamps', at: ago(2, 15, 20), ref: 'jo-147' },
  { id: 'a7', kind: 'vehicle', text: 'New vehicle record added — CBF 2211', detail: 'Vista Verde Logistics Corp. fleet unit #2', at: ago(6, 9, 5) },
  { id: 'a8', kind: 'stage', text: 'Rey Salvador completed NGI 5521', detail: 'Ready for release · 100k PMS', at: ago(1, 14, 40), ref: 'jo-148' },
];

export const seedState = (): AppState => ({
  customers,
  vehicles,
  jobs,
  bookings,
  activity,
  session: null,
  seq: 157,
});
