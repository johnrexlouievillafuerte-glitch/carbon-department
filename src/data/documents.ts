export interface VehicleRecord {
  id: string;
  plateNumber: string; // Fast unique search key
  customerName: string;
  contactNumber: string;
  address: string;
  vehicleMakeModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vin: string;
  chassisNumber: string; // From OR/CR
  dateReceived: string;
  serviceCategory: 'Mechanical' | 'Electrical' | 'Body Repair' | 'Carbon Fiber' | 'Detailing';
  specificConcern: string;
  jobOrderNo: string;
  status: 'Intake & Pre-Inspection' | 'Diagnosis' | 'In Progress' | 'Quality Inspection' | 'Ready for Release' | 'Released';
  progressPercent: number;
  mechanicAssigned: string;
  adminInCharge: string;
  preInspectionNotes: string; // Documents pre-existing damage to prevent disputes
  preInspectionPhotos: { url: string; caption: string; damageType: string }[];
  workPerformedPhotos?: { url: string; caption: string }[];
  amount?: number;
  isPaid: boolean;
  notes: string;
  tasks: { task: string; status: 'Pending' | 'In Progress' | 'Completed' }[];
}

// Brand new database state (empty by default)
export const VEHICLE_RECORDS: VehicleRecord[] = [];

// Sample benchmark records available on-demand for presentations & defense
export const SAMPLE_PRESENTATION_RECORDS: VehicleRecord[] = [
  {
    id: 'demo-001',
    plateNumber: 'NDB 4821',
    customerName: 'Atty. Juan Carlos Reyes',
    contactNumber: '0917-882-1923',
    address: 'Vista Verde Executive Village, Cainta, Rizal',
    vehicleMakeModel: 'Toyota Land Cruiser 200 V8',
    vehicleYear: '2022',
    vehicleColor: 'Pearl White',
    vin: 'JTMHY05J604019283',
    chassisNumber: 'URJ200-019283',
    dateReceived: '2026-10-18',
    serviceCategory: 'Mechanical',
    specificConcern: 'Engine oil leak around valve cover gasket, front suspension knocking on uneven pavement, regular periodic maintenance.',
    jobOrderNo: 'JO-2026-0001',
    status: 'In Progress',
    progressPercent: 65,
    mechanicAssigned: 'Lead Mechanical Technician',
    adminInCharge: 'Service Advisor',
    preInspectionNotes: 'Pre-existing 4-inch clearcoat scratch on right front fender prior to bay intake. Documented with owner at walkaround.',
    preInspectionPhotos: [
      {
        url: '',
        caption: 'Right front fender: Pre-existing scratch (4 inches) recorded before bay intake',
        damageType: 'Pre-existing Clearcoat Scratch',
      },
      {
        url: '',
        caption: 'Underchassis inspection: Valve cover oil seepage identified',
        damageType: 'Mechanical Oil Seepage',
      },
    ],
    amount: 18500,
    isPaid: false,
    notes: 'Toyota OEM valve cover gasket and synthetic oil package approved. Suspension bushings ordered. AXA Insurance accreditation pending.',
    tasks: [
      { task: 'Pre-inspection vehicle condition and damage photo documentation', status: 'Completed' },
      { task: 'Engine oil drain, flush, and fully synthetic replacement', status: 'Completed' },
      { task: 'Valve cover gasket replacement and torque check', status: 'In Progress' },
      { task: 'Front lower control arm bushing and stabilizer link replacement', status: 'In Progress' },
      { task: 'Final road test and quality sign-off by Admin', status: 'Pending' },
    ],
  },
  {
    id: 'demo-002',
    plateNumber: 'CAR 8800',
    customerName: 'Marco Dizon',
    contactNumber: '0918-552-3019',
    address: 'Ortigas Extension, Pasig City',
    vehicleMakeModel: 'Nissan Silvia S15 (Drift Spec)',
    vehicleYear: '2002',
    vehicleColor: 'Gunmetal Gray',
    vin: 'S15-029481',
    chassisNumber: 'S15-029481',
    dateReceived: '2026-10-16',
    serviceCategory: 'Carbon Fiber',
    specificConcern: 'Custom 1-of-1 lightweight dry carbon fiber vented hood fabrication and front splitter vacuum mold.',
    jobOrderNo: 'JO-2026-0002',
    status: 'In Progress',
    progressPercent: 80,
    mechanicAssigned: 'Composite Fabrication Specialist',
    adminInCharge: 'Service Advisor',
    preInspectionNotes: 'Front bumper fiberglass previously cracked at right lip from track session. Documented before intake.',
    preInspectionPhotos: [
      {
        url: '',
        caption: 'Front lip: Existing crack from previous track event documented',
        damageType: 'Pre-existing Track Crack',
      },
    ],
    amount: 45000,
    isPaid: false,
    notes: 'Crafted using shop custom vacuum mold techniques. Signature Carbon Department 2x2 twill weave with UV clearcoat.',
    tasks: [
      { task: 'Digital 3D caliper measurement of engine bay clearances', status: 'Completed' },
      { task: 'Custom fiberglass negative mold plug fabrication', status: 'Completed' },
      { task: 'Carbon fiber vacuum resin infusion layup', status: 'In Progress' },
      { task: 'High-gloss UV clearcoat curing in oven', status: 'Pending' },
    ],
  },
  {
    id: 'demo-003',
    plateNumber: 'NBD 9024',
    customerName: 'Engr. Michael Bautista',
    contactNumber: '0920-412-8871',
    address: 'Brookside Hills, Cainta, Rizal',
    vehicleMakeModel: 'Toyota Fortuner 2.8 D-4D',
    vehicleYear: '2020',
    vehicleColor: 'Attitude Black',
    vin: 'MHFY59G200192831',
    chassisNumber: 'GUN156-002918',
    dateReceived: '2026-10-17',
    serviceCategory: 'Electrical',
    specificConcern: 'Battery discharge warning lamp, intermittent hard starting, alternator charging test.',
    jobOrderNo: 'JO-2026-0003',
    status: 'Ready for Release',
    progressPercent: 100,
    mechanicAssigned: 'Lead Diagnostic Technician',
    adminInCharge: 'Service Advisor',
    preInspectionNotes: 'Vehicle exterior in good condition. Minor door edge chip on driver side. Documented at intake.',
    preInspectionPhotos: [
      {
        url: '',
        caption: 'Engine electrical bay pre-inspection before alternator pull-out',
        damageType: 'Electrical Diagnostic',
      },
    ],
    amount: 11200,
    isPaid: true,
    notes: 'Alternator diode pack replaced, 85Ah battery installed. Charging voltage stable at 14.2V. Ready for pickup.',
    tasks: [
      { task: 'Pre-inspection intake and battery health load test', status: 'Completed' },
      { task: 'Alternator bench test and diode replacement', status: 'Completed' },
      { task: 'Final electrical scan and clear DTC fault codes', status: 'Completed' },
    ],
  },
];
