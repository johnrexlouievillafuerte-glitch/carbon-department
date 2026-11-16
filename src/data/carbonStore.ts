// ============================================================================
// Carbon Department Auto Body and Repair Services Co.
// Automotive Repair Management System & Public Experience Data Store
// ============================================================================

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
  'Received',
  'Pre-Inspection',
  'Estimate/Approval',
  'In Repair',
  'Finishing/Paint',
  'Final Assessment',
  'Ready for Release',
  'Released',
];

export const STAGE_PROGRESS_MAP: Record<JobStage, number> = {
  'Received': 12,
  'Pre-Inspection': 25,
  'Estimate/Approval': 40,
  'In Repair': 65,
  'Finishing/Paint': 82,
  'Final Assessment': 94,
  'Ready for Release': 100,
  'Released': 100,
};

export type Division = 'Body & Custom Work' | 'Mechanical & Maintenance' | 'Dual-Division';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  since: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  plateNumber: string; // Philippine Plate format e.g. "NBC 4821"
  make: string;
  model: string;
  year: string;
  color: string;
  bodyType: string;
  vin: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: string;
  currentOdometer: number;
}

export interface IntakePhoto {
  id: string;
  angle: 'front' | 'rear' | 'left' | 'right' | 'damage_closeup' | 'odometer';
  label: string;
  url: string;
  caption: string;
  timestamp: string;
  hasDamage?: boolean;
}

export interface ProgressLog {
  id: string;
  stage: JobStage;
  note: string;
  timestamp: string;
  technician: string;
  photoUrl?: string;
}

export interface InspectionChecklist {
  exteriorBodyClean: boolean;
  preExistingScratchesNoted: boolean;
  engineOilLevelChecked: boolean;
  coolantBrakeFluidChecked: boolean;
  batteryHealthVerified: boolean;
  underchassisDamageChecked: boolean;
  dashboardWarningLightsChecked: boolean;
  personalBelongingsInventoried: boolean;
  fuelLevelQuarter: number; // 1 to 4
}

export interface JobOrder {
  id: string;
  jobNo: string; // CD-2026-XXXX
  customerId: string;
  vehicleId: string;
  division: Division;
  services: string[];
  customerConcern: string;
  stage: JobStage;
  progressPercent: number;
  assignedTechnicians: string[];
  intakeChecklist: InspectionChecklist;
  intakeNotes: string;
  intakePhotos: IntakePhoto[];
  progressLogs: ProgressLog[];
  dateReceived: string;
  estimatedRelease: string;
  releasedAt?: string;
  isArchived: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  plateNumber: string;
  makeModel: string;
  year: string;
  division: Division;
  serviceRequested: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rescheduled' | 'Declined' | 'Converted';
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  jobNo: string;
  plateNumber: string;
  customerName: string;
  documentTitle: string;
  category: 'Job Order' | 'Inspection Sheet' | 'Estimate' | 'Customer Approval' | 'Release Gate Pass';
  dateArchived: string;
  fileKb: number;
  archivedBy: string;
  isPermanent: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'Admin' | 'Staff';
  action: string;
  target: string;
  details: string;
}

// Initial Shop Metadata from Profile
export const SHOP_INFO = {
  name: 'Carbon Department Auto Body and Repair Services Co.',
  shortName: 'Carbon Department',
  tagline: 'You bring it in, and we fix it.',
  address: '009 Felix Ave., Vista Verde Executive Village, San Isidro, Cainta, Rizal',
  phone: '0948-243-2421',
  email: 'carbondepartment2.0@gmail.com',
  founded: 2020,
  hours: 'Monday – Saturday · 8:00 AM – 6:00 PM (Closed Sundays)',
  bayCapacity: 6,
};

// Initial Team Members from PDF
export const SHOP_TEAM = [
  {
    id: 'team-oliver',
    name: 'Capt. Oliver Jimenez',
    role: 'CEO & Co-Owner',
    division: 'Executive & Strategy',
    experience: '11 Years Commercial Airline Pilot',
    bio: 'With 11 years of experience as a commercial airline pilot, Oliver’s professional life is built on a foundation of technical rigor and operational excellence. His lifelong passion for performance automotive engineering led him to co-found Carbon Department with Ramjay Anor.',
    certifications: ['Commercial Airline Pilot', 'Operations Safety Specialist'],
    photo: '/assets/team-oliver-jimenez.jpg',
  },
  {
    id: 'team-ramjay',
    name: 'Ramjay Anor',
    role: 'Co-Owner & Technical Operations Lead',
    division: 'Body & Custom Work',
    experience: '12+ Years Composite Fabrication Specialist',
    bio: 'Seasoned specialist with over a decade of hands-on expertise in composite fabrication for premier shops like Car Porn Racing and Stage 21 Body Kits. Oversees the entire production lifecycle from chemical testing and precision design to intricate skinning of carbon fiber and fiberglass.',
    certifications: [
      'Automotive Mold Maker (Car Porn Racing 2017–2021)',
      'Carbon Fiber & Fiberglass Technician (Stage 21 2012–2014)',
      'Certified Auto Detailer (Sonax 2016–2017)',
    ],
    photo: '/assets/team-ramjay-anor.jpg',
  },
  {
    id: 'team-arman',
    name: 'Arman Boadilla',
    role: 'Mechanic / Technical Operations',
    division: 'Mechanical & Paint',
    experience: '15+ Years Mechanical & Dealership Paint Management',
    bio: 'Experienced Technical Lead with over 15 years in mechanical repair, paint management, and performance builds. Managed paint supply operations for major dealerships including Toyota Angeles and Lexus Pasong Tamo Body Repair Center.',
    certifications: [
      'Axalta Coatings / Cromax Tinting & Application (2014)',
      'Motul School Certified (2015)',
      'Axalta Coatings Waterborne Application (2018)',
    ],
    photo: '/assets/team-arman-boadilla.jpg',
  },
  {
    id: 'team-adrian',
    name: 'Adrian Arzaga',
    role: 'Mechanic / Technical Operations',
    division: 'Mechanical & Diagnostics',
    experience: '10+ Years International Diagnostic Professional',
    bio: 'Over a decade of international experience in mechanical assembly and diagnostics for global brands including Toyota, Lexus, and Tata Motors. Certified Pro Technician in Doha, Qatar backed by TESDA certifications.',
    certifications: [
      'NC II Automotive Mechanical Assembly (TESDA)',
      'NC I Automotive Servicing (TESDA)',
      'Pro Technician Certified (Toyota-Lexus Qatar 2018–2020)',
      'Toyota Technician Certification (Abdullah Abdulghani & Bros.)',
    ],
    photo: '/assets/team-adrian-arzaga.jpg',
  },
  {
    id: 'team-monchito',
    name: 'Monchito Baldovino',
    role: 'Carbon Fiber & Fiberglass Technician',
    division: 'Body & Custom Work',
    experience: '20+ Years Specialized Composite Craftsmanship',
    bio: 'With over two decades of dedicated craftsmanship centered on the precision of carbon fiber and fiberglass (FRP). Renowned across the custom car scene for structural custom designs, wide-body tubs, and autoclave-level finishes.',
    certifications: [
      'Carbon Fiber & Fiberglass Lead (Carbon Department 2020–Present)',
      'Carbon Complex Technician (2017–2020)',
      'Carbon 101 Specialist (2015–2017)',
      'Stage 21 Senior Technician (2005–2015)',
    ],
    photo: '/assets/team-monchito-baldovino.jpg',
  },
];

// Initial Workshop Areas from PDF
export const WORKSHOP_AREAS = [
  {
    id: 'area-parking',
    title: 'Open Area Parking & Staging',
    caption: 'Intake staging, customer handover, and multi-point 360° walkaround inspection zone.',
    photo: '/assets/workshop-open-parking.jpg',
    specs: '6-Vehicle Staging Capacity · Natural Lighting for Paint & Damage Walkaround',
  },
  {
    id: 'area-mechanical',
    title: 'Mechanical Area',
    caption: 'Full-service maintenance bay equipped with hoists, fluid exchange stations, and OBD2 diagnostic suites.',
    photo: '/assets/workshop-mechanical-area.jpg',
    specs: 'Hydraulic 2-Post Hoists · Engine Cranes · Complete Suspension Tooling',
  },
  {
    id: 'area-paint',
    title: 'Paint Room & Downdraft Booth',
    caption: 'Enclosed, climate-controlled spray booth with high-efficiency air filtration and heat lamps for factory-grade baking.',
    photo: '/assets/workshop-paint-room.jpg',
    specs: 'Downdraft Airflow · Axalta/Cromax Waterborne Matching · Temperature Curing',
  },
  {
    id: 'area-body',
    title: 'Body Repair Area',
    caption: 'Heavy-duty structural realignment, panel beating, custom metalwork, and precision aero mockup bay.',
    photo: '/assets/workshop-body-repair.jpg',
    specs: 'Frame Alignment Jig · TIG/MIG Aluminum Welding · Metal Shroud Fabrication',
  },
  {
    id: 'area-carbon',
    title: 'Carbon Fiber & Fiberglass Production',
    caption: 'Dedicated composite atelier for mold design, vacuum resin infusion, pre-preg layup, and hand-finishing.',
    photo: '/assets/workshop-carbon-production.jpg',
    specs: 'Vacuum Infusion Table · Controlled Temperature Curing · Precision Mold Vault',
  },
];

// Initial Notable Projects from PDF
export const NOTABLE_PROJECTS = [
  {
    id: 'proj-subaru',
    title: 'Subaru STi Wide Body Conversion',
    tagline: 'The only shop in the Philippines providing this service.',
    category: 'Body & Custom Work',
    vehicle: 'Subaru Impreza WRX STi Hatchback',
    plate: 'NBC 4821',
    description:
      'Complete bespoke widebody conversion engineered from raw structural chassis work. Hand-crafted flared arches tubbed to clear competition-spec wheel offsets, retaining pristine OEM body lines and high-gloss multi-stage pearl finish.',
    materials: 'High-density FRP composite & reinforced structural polyurethane',
    technicians: 'Ramjay Anor, Monchito Baldovino & Arman Boadilla',
    image: '/assets/project-subaru-sti-widebody.jpg',
    beforeImage: '/assets/workshop-body-repair.jpg', // Before intake in workshop
    jobNo: 'CD-2026-0147',
  },
  {
    id: 'proj-370z',
    title: 'Nissan 370Z Custom Design Carbon Hood',
    tagline: '1-of-1 functional aerodynamic composite engineering.',
    category: 'Body & Custom Work',
    vehicle: 'Nissan 370Z Nismo',
    plate: 'NDL 9102',
    description:
      'Custom-designed vented carbon fiber hood crafted to reduce front-axle weight and evacuate high-pressure engine bay heat. Features an exposed 2x2 twill weave centerpiece with integrated rain guards and UV-resistant mirror clearcoat.',
    materials: 'Toray 3K 2x2 Twill Carbon Fiber, Epoxy Vacuum Infusion, UV Clearcoat',
    technicians: 'Ramjay Anor & Monchito Baldovino',
    image: '/assets/project-nissan-370z-hood.jpg',
    beforeImage: '/assets/workshop-open-parking.jpg',
    jobNo: 'CD-2026-0139',
  },
  {
    id: 'proj-boracay',
    title: '40 Units Pure-EV Fleet for Boracay',
    tagline: 'High-volume commercial EV finishing & composite reinforcement.',
    category: 'Fleet & Custom Work',
    vehicle: 'PURE-EV Eco Solar Transit Trikes (40 Units)',
    plate: 'EV-BOC-04',
    description:
      'Contract fabrication and high-durability refinishing for 40 fleet passenger units deployed to the island of Boracay. Structural fiberglass weatherproofing and marine-grade polyurethane topcoats to resist salt air and tropical humidity.',
    materials: 'Marine-grade fiberglass (FRP), Axalta industrial epoxy primer & polyurethane clear',
    technicians: 'Capt. Oliver Jimenez, Arman Boadilla & Ramjay Anor',
    image: '/assets/project-boracay-etrike.jpg',
    beforeImage: '/assets/workshop-paint-room.jpg',
    jobNo: 'CD-2026-0112',
  },
];

// Initial Permits & Clearances from PDF
export const SHOP_PERMITS = [
  {
    id: 'permit-business',
    title: 'Business Permit',
    number: 'Permit No: 2026-06150',
    authority: 'Office of the Mayor, Municipality of Cainta, Rizal',
    details: 'Line of Business: Auto Repair Shop. Issued to Carbon Department Auto Body and Repair Services Co., 009 Felix Ave., Vista Verde Executive Village, San Isidro, Cainta, Rizal.',
    thumbnail: '/assets/permit-business.jpg',
    fullImage: '/assets/permit-page-18-full.jpg',
  },
  {
    id: 'permit-barangay',
    title: 'Barangay Business Clearance',
    number: 'Permit No: 2026-V-082',
    authority: 'Barangay San Isidro, Municipality of Cainta, Rizal',
    details: 'Certified in accordance with Section 152 of the Local Government Code of 1991. Commercial auto repair and fabrication facility approval.',
    thumbnail: '/assets/permit-barangay.jpg',
    fullImage: '/assets/permit-page-18-full.jpg',
  },
  {
    id: 'permit-environment',
    title: 'Municipal Environment Clearance',
    number: 'MENRO Clearance 2026',
    authority: 'Municipal Environment and Natural Resources Office, Cainta',
    details: 'Fully compliant with ecological waste disposal, paint booth ventilation, and used oil containment standards under R.A. 9003 and R.A. 6969.',
    thumbnail: '/assets/permit-environment.jpg',
    fullImage: '/assets/permit-page-18-full.jpg',
  },
  {
    id: 'permit-sanitary',
    title: 'Sanitary Permit to Operate',
    number: 'Permit No: 26-06150',
    authority: 'Municipal Health Office, Cainta, Rizal',
    details: 'Sanitary inspection verified for employee hygiene, hazardous chemical storage, and workplace safety compliance.',
    thumbnail: '/assets/permit-sanitary.jpg',
    fullImage: '/assets/permit-page-18-full.jpg',
  },
  {
    id: 'permit-philhealth',
    title: 'PhilHealth Registration',
    number: 'PIN: 00-301001235-2',
    authority: 'Philippine Health Insurance Corporation',
    details: 'Registered employer providing health insurance coverage for all workshop technicians and administrative personnel.',
    thumbnail: '/assets/permit-philhealth.jpg',
    fullImage: '/assets/permit-page-19-full.jpg',
  },
  {
    id: 'permit-pagibig',
    title: 'Pag-IBIG Employer Data',
    number: 'Pag-IBIG Registration',
    authority: 'Home Development Mutual Fund',
    details: 'Compliant employer record under Republic Act No. 9679 for employee housing and provident savings.',
    thumbnail: '/assets/permit-pagibig.jpg',
    fullImage: '/assets/permit-page-19-full.jpg',
  },
  {
    id: 'permit-sss',
    title: 'SSS Certificate of Registration',
    number: 'Employer No: 60-0418907-1-000',
    authority: 'Republic of the Philippines Social Security System',
    details: 'Duly registered with the Social Security System with official certification issued June 2025.',
    thumbnail: '/assets/permit-sss.jpg',
    fullImage: '/assets/permit-page-19-full.jpg',
  },
  {
    id: 'permit-bir',
    title: 'BIR Form 2303 Certificate',
    number: 'TIN: 606-592-520-00000',
    authority: 'Bureau of Internal Revenue, RDO 045 Cainta-Taytay',
    details: 'General Partnership Taxpayer registered for Corporate Income Tax, Percentage Tax, and Expanded Withholding Tax.',
    thumbnail: '/assets/permit-bir2303.jpg',
    fullImage: '/assets/permit-page-19-full.jpg',
  },
];

// Initial Pre-loaded Data
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Atty. Ramon Arceo',
    phone: '0917-882-1923',
    email: 'atty.arceo@lawfirm.ph',
    address: 'Phase 2, Vista Verde Executive Village, Cainta, Rizal',
    since: '2022-04-10',
    notes: 'Long-time customer. Demands OEM-level fitment for track builds.',
  },
  {
    id: 'cust-2',
    name: 'Vincent S. Gomez',
    phone: '0918-442-9912',
    email: 'vince.gomez@techdrive.ph',
    address: '7 Sunflower St., Brookside Hills, Cainta, Rizal',
    since: '2023-01-18',
    notes: 'Nissan 370Z club member. Frequently attends track days in Clark.',
  },
  {
    id: 'cust-3',
    name: 'Pure-EV Fleet Mobility Corp. (c/o Dennis Yu)',
    phone: '0948-243-2421',
    email: 'operations@pure-ev.ph',
    address: 'Boracay Island / Pasig Corporate Center, Metro Manila',
    since: '2024-03-01',
    notes: 'Fleet contract: 40 units island eco-transit finishing.',
  },
  {
    id: 'cust-4',
    name: 'Engr. Vincent D. Tan',
    phone: '0918-904-7711',
    email: 'v.tan@apexstructures.ph',
    address: '18 Greenwoods Executive Village, Cainta, Rizal',
    since: '2024-11-05',
    notes: 'Family fleet manager. Strict adherence to Motul 100% synthetic fluids.',
  },
  {
    id: 'cust-5',
    name: 'Marco Alessandro Reyes',
    phone: '0920-551-8890',
    email: 'm.reyes.drift@yahoo.com',
    address: 'Ortigas Extension, Pasig City',
    since: '2021-09-12',
    notes: 'Performance build customer. R35 GT-R track enthusiast.',
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    customerId: 'cust-1',
    plateNumber: 'NBC 4821',
    make: 'Subaru',
    model: 'Impreza WRX STi Hatchback',
    year: '2021',
    color: 'Crystal White Pearl',
    bodyType: 'Hatchback',
    vin: 'JF1GR8H67L0019284',
    chassisNumber: 'GRB-019284',
    engineNumber: 'EJ257-891024',
    fuelType: 'Gasoline 97+ Octane',
    currentOdometer: 42180,
  },
  {
    id: 'veh-2',
    customerId: 'cust-2',
    plateNumber: 'NDL 9102',
    make: 'Nissan',
    model: '370Z Nismo',
    year: '2019',
    color: 'Brilliant Silver',
    bodyType: 'Coupe',
    vin: 'JN1AZ4EH9KM710928',
    chassisNumber: 'Z34-710928',
    engineNumber: 'VQ37VHR-394102',
    fuelType: 'Gasoline 97+ Octane',
    currentOdometer: 38500,
  },
  {
    id: 'veh-3',
    customerId: 'cust-3',
    plateNumber: 'EV-BOC-04',
    make: 'PURE-EV',
    model: 'Solar Transit Trike Gen 2',
    year: '2024',
    color: 'Island Sky Blue / White',
    bodyType: 'Passenger Trike',
    vin: 'PEV-2024-BOC-0004',
    chassisNumber: 'PEV-BOC-004',
    engineNumber: 'BLDC-72V-5KW',
    fuelType: 'Electric 72V 100Ah LiFePO4',
    currentOdometer: 120,
  },
  {
    id: 'veh-4',
    customerId: 'cust-4',
    plateNumber: 'NDB 4410',
    make: 'Toyota',
    model: 'Fortuner 2.8 GR-Sport 4x4',
    year: '2023',
    color: 'Attitude Black Mica',
    bodyType: 'SUV',
    vin: 'MR0BA3CD4N0128941',
    chassisNumber: 'GUN156-8091234',
    engineNumber: '1GD-FTV-894120',
    fuelType: 'Diesel Euro 5',
    currentOdometer: 29400,
  },
  {
    id: 'veh-5',
    customerId: 'cust-5',
    plateNumber: 'CAR 8800',
    make: 'Nissan',
    model: 'GT-R R35 Track Spec',
    year: '2020',
    color: 'Gun Metallic',
    bodyType: 'Coupe',
    vin: 'JN1GAR35U00449102',
    chassisNumber: 'CBA-R35-044910',
    engineNumber: 'VR38DETT-992184',
    fuelType: 'Gasoline 100 Octane',
    currentOdometer: 21300,
  },
];

export const INITIAL_JOB_ORDERS: JobOrder[] = [
  {
    id: 'jo-1',
    jobNo: 'CD-2026-0147',
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    division: 'Body & Custom Work',
    services: [
      'Subaru STi Wide Body Conversion',
      'Custom Fender Arch Tubbing & Clearance',
      'Precision Down-draft Pearl Paint Finish',
    ],
    customerConcern:
      'Customer requests full bespoke widebody conversion to house 18x10.5J competition wheels without rubbing. Match factory Crystal White Pearl with zero orange peel.',
    stage: 'Finishing/Paint',
    progressPercent: 82,
    assignedTechnicians: ['Ramjay Anor', 'Monchito Baldovino'],
    intakeChecklist: {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 3,
    },
    intakeNotes:
      'Vehicle arrived clean. Pre-existing minor stone chips on lower front lip documented with owner. Factory rear quarter panels cut and bonded with aircraft structural epoxy.',
    intakePhotos: [
      {
        id: 'p-1',
        angle: 'front',
        label: 'Front Clip & Bumper Alignment',
        url: '/assets/project-subaru-sti-widebody.jpg',
        caption: 'Front bumper fitment and intercooler clearance verified prior to wide fender mounting.',
        timestamp: '2026-10-12 09:15',
      },
      {
        id: 'p-2',
        angle: 'damage_closeup',
        label: 'Left Rear Quarter Panel Arch Cut',
        url: '/assets/workshop-body-repair.jpg',
        caption: 'Rear quarter panel seam welded and sealed with anti-corrosion primer before flare attachment.',
        timestamp: '2026-10-12 09:30',
        hasDamage: true,
      },
      {
        id: 'p-3',
        angle: 'odometer',
        label: 'Intake Dashboard & Mileage',
        url: '/assets/workshop-open-parking.jpg',
        caption: 'Odometer verified at 42,180 km. Fuel tank 3/4 full. No CEL warnings.',
        timestamp: '2026-10-12 09:40',
      },
    ],
    progressLogs: [
      {
        id: 'log-1',
        stage: 'Received',
        note: 'Vehicle checked in at Cainta workshop. Work order scope verified with Atty. Arceo.',
        timestamp: '2026-10-12 09:00',
        technician: 'Ramjay Anor',
      },
      {
        id: 'log-2',
        stage: 'Pre-Inspection',
        note: 'Multi-point inspection and chassis laser measurement complete. Suspension clearance mapped.',
        timestamp: '2026-10-13 11:30',
        technician: 'Arman Boadilla',
      },
      {
        id: 'log-3',
        stage: 'In Repair',
        note: 'Fender arches fabricated, tubbed, and bonded. Structural primer applied.',
        timestamp: '2026-10-18 16:00',
        technician: 'Monchito Baldovino',
      },
      {
        id: 'log-4',
        stage: 'Finishing/Paint',
        note: 'Tri-stage Pearl White applied in down-draft paint room. Currently under 60°C bake lamps.',
        timestamp: '2026-10-24 14:15',
        technician: 'Ramjay Anor',
        photoUrl: '/assets/workshop-paint-room.jpg',
      },
    ],
    dateReceived: '2026-10-12',
    estimatedRelease: '2026-10-28',
    isArchived: false,
  },
  {
    id: 'jo-2',
    jobNo: 'CD-2026-0139',
    customerId: 'cust-2',
    vehicleId: 'veh-2',
    division: 'Body & Custom Work',
    services: [
      'Custom Design Carbon Fiber Hood Fabrication',
      'Vacuum Resin Infusion Layup',
      'UV-Resistant Deep Gloss Clearcoat',
    ],
    customerConcern:
      'Engine oil temps rising during track sessions. Wants custom aggressive heat extractors with OEM latch retention.',
    stage: 'Final Assessment',
    progressPercent: 94,
    assignedTechnicians: ['Ramjay Anor', 'Monchito Baldovino'],
    intakeChecklist: {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 2,
    },
    intakeNotes:
      'Stock aluminum hood removed and stored safely. Custom mold prepared. Zero gap variance with front fenders.',
    intakePhotos: [
      {
        id: 'p-4',
        angle: 'front',
        label: 'Front View & Custom Hood Gap Fitment',
        url: '/assets/project-nissan-370z-hood.jpg',
        caption: 'Custom carbon fiber vented hood installed. 3mm uniform gap tolerance maintained.',
        timestamp: '2026-10-08 10:20',
      },
      {
        id: 'p-5',
        angle: 'damage_closeup',
        label: 'Exposed Weave Center Vent Detail',
        url: '/assets/workshop-carbon-production.jpg',
        caption: '2x2 twill carbon weave alignment inspected with zero distortion.',
        timestamp: '2026-10-14 15:00',
      },
    ],
    progressLogs: [
      {
        id: 'log-5',
        stage: 'Received',
        note: '370Z intake logged. Hood design schematics approved by customer.',
        timestamp: '2026-10-08 10:00',
        technician: 'Ramjay Anor',
      },
      {
        id: 'log-6',
        stage: 'In Repair',
        note: 'Vacuum infusion completed. High-temp epoxy cured and demolded.',
        timestamp: '2026-10-15 16:30',
        technician: 'Monchito Baldovino',
      },
      {
        id: 'log-7',
        stage: 'Finishing/Paint',
        note: 'Three coats of UV clear sprayed and polished to 3000-grit mirror gloss.',
        timestamp: '2026-10-21 11:00',
        technician: 'Arman Boadilla',
      },
      {
        id: 'log-8',
        stage: 'Final Assessment',
        note: 'Hood latch catch tested at 100 km/h simulated flow. Final QA inspection passed.',
        timestamp: '2026-10-25 09:30',
        technician: 'Ramjay Anor',
      },
    ],
    dateReceived: '2026-10-08',
    estimatedRelease: '2026-10-26',
    isArchived: false,
  },
  {
    id: 'jo-3',
    jobNo: 'CD-2026-0112',
    customerId: 'cust-3',
    vehicleId: 'veh-3',
    division: 'Body & Custom Work',
    services: [
      '40 Units Fleet Prep & Bodywork',
      'Marine-Grade FRP Composite Reinforcement',
      'Island Weather UV Polyurethane Coating',
    ],
    customerConcern:
      'Contract commercial delivery: Final batch unit of 40 eco trikes bound for Boracay passenger transport.',
    stage: 'Ready for Release',
    progressPercent: 100,
    assignedTechnicians: ['Capt. Oliver Jimenez', 'Arman Boadilla', 'Ramjay Anor'],
    intakeChecklist: {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 4,
    },
    intakeNotes:
      'Commercial fleet production batch. Unit #04 of 40. Quality certified for maritime transport to Aklan port.',
    intakePhotos: [
      {
        id: 'p-6',
        angle: 'front',
        label: 'Pure-EV Solar Trike Fleet Exterior',
        url: '/assets/project-boracay-etrike.jpg',
        caption: 'High-visibility two-tone blue/white polyurethane finish inspected and cleared.',
        timestamp: '2026-09-28 14:00',
      },
      {
        id: 'p-7',
        angle: 'left',
        label: 'Side Passenger Body Panels',
        url: '/assets/workshop-paint-room.jpg',
        caption: 'Paint booth curing stage before final maritime logistics packing.',
        timestamp: '2026-10-02 16:45',
      },
    ],
    progressLogs: [
      {
        id: 'log-9',
        stage: 'In Repair',
        note: 'FRP composite side roofs and seat shells laminated and reinforced.',
        timestamp: '2026-10-01 08:30',
        technician: 'Arman Boadilla',
      },
      {
        id: 'log-10',
        stage: 'Ready for Release',
        note: 'Gate pass generated. Ready for logistics pickup by Ro-Ro freight forwarder.',
        timestamp: '2026-10-23 17:00',
        technician: 'Capt. Oliver Jimenez',
      },
    ],
    dateReceived: '2026-09-28',
    estimatedRelease: '2026-10-24',
    isArchived: false,
  },
  {
    id: 'jo-4',
    jobNo: 'CD-2026-0155',
    customerId: 'cust-4',
    vehicleId: 'veh-4',
    division: 'Mechanical & Maintenance',
    services: [
      'Periodic Maintenance Service (PMS) 50-Point',
      'Motul Fully Synthetic Oil Flush & Change',
      'Front Suspension Lower Control Arm Bushings',
    ],
    customerConcern:
      'Thumping sound over road humps along Felix Ave. Sluggish throttle response before turbo spool.',
    stage: 'In Repair',
    progressPercent: 65,
    assignedTechnicians: ['Adrian Arzaga', 'Arman Boadilla'],
    intakeChecklist: {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 3,
    },
    intakeNotes:
      'Front lower arm rubber bushings torn. Front brake pads at 30% life remaining. Replaced with OEM components.',
    intakePhotos: [
      {
        id: 'p-8',
        angle: 'front',
        label: 'Front Bay Hoist Inspection',
        url: '/assets/workshop-mechanical-area.jpg',
        caption: 'Vehicle mounted on 2-post hoist. Fluid drains initiated.',
        timestamp: '2026-10-23 08:45',
      },
    ],
    progressLogs: [
      {
        id: 'log-11',
        stage: 'Received',
        note: 'Check-in completed. Customer approved Motul synthetic oil upgrade.',
        timestamp: '2026-10-23 08:30',
        technician: 'Adrian Arzaga',
      },
      {
        id: 'log-12',
        stage: 'In Repair',
        note: 'Oil drained, filter replaced. New hydraulic control arm bushings pressed in.',
        timestamp: '2026-10-24 13:00',
        technician: 'Adrian Arzaga',
      },
    ],
    dateReceived: '2026-10-23',
    estimatedRelease: '2026-10-26',
    isArchived: false,
  },
  {
    id: 'jo-5',
    jobNo: 'CD-2026-0160',
    customerId: 'cust-5',
    vehicleId: 'veh-5',
    division: 'Dual-Division',
    services: [
      'Custom Aluminum Intercooler Cooling Shroud',
      'Dry Carbon Front Air Splitter Replacement',
      'Motul RBF 660 High-Temp Brake Bleed',
    ],
    customerConcern:
      'Splitter scraped on low ramp at BGC parking. Customer requests reinforced autoclave carbon splitter with quick-release aluminum brackets.',
    stage: 'Estimate/Approval',
    progressPercent: 40,
    assignedTechnicians: ['Ramjay Anor', 'Adrian Arzaga'],
    intakeChecklist: {
      exteriorBodyClean: true,
      preExistingScratchesNoted: true,
      engineOilLevelChecked: true,
      coolantBrakeFluidChecked: true,
      batteryHealthVerified: true,
      underchassisDamageChecked: true,
      dashboardWarningLightsChecked: true,
      personalBelongingsInventoried: true,
      fuelLevelQuarter: 2,
    },
    intakeNotes:
      'Underbody front belly pan scraped. Carbon splitter mold on hand from previous session.',
    intakePhotos: [
      {
        id: 'p-9',
        angle: 'front',
        label: 'Front Bumper Scrape Documentation',
        url: '/assets/workshop-open-parking.jpg',
        caption: 'Existing scrape marks documented before dismantling splitter mounting brackets.',
        timestamp: '2026-10-24 10:15',
        hasDamage: true,
      },
    ],
    progressLogs: [
      {
        id: 'log-13',
        stage: 'Received',
        note: 'Vehicle intake completed at Cainta bay.',
        timestamp: '2026-10-24 10:00',
        technician: 'Ramjay Anor',
      },
      {
        id: 'log-14',
        stage: 'Estimate/Approval',
        note: 'Written scope sent to Mr. Reyes. Awaiting final signed approval.',
        timestamp: '2026-10-24 16:30',
        technician: 'Capt. Oliver Jimenez',
      },
    ],
    dateReceived: '2026-10-24',
    estimatedRelease: '2026-10-30',
    isArchived: false,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    customerName: 'Dra. Maricel Santos',
    phone: '0917-310-8844',
    email: 'dra.santos@clinic.ph',
    plateNumber: 'NGA 7721',
    makeModel: 'Honda Civic RS Turbo',
    year: '2022',
    division: 'Mechanical & Maintenance',
    serviceRequested: 'Aircon Evaporator Leak Diagnostic & Refrigerant Recharge',
    preferredDate: '2026-10-26',
    preferredTime: '09:00 AM',
    notes: 'Aircon not blowing cold air when idling in traffic along Ortigas Ave.',
    status: 'Pending',
    createdAt: '2026-10-24 14:20',
  },
  {
    id: 'book-2',
    customerName: 'Atty. Benjamin Cruz',
    phone: '0919-223-4100',
    email: 'cruz.law@gmail.com',
    plateNumber: 'ABC 1982',
    makeModel: 'Toyota Land Cruiser Prado',
    year: '2020',
    division: 'Body & Custom Work',
    serviceRequested: 'Collision Body Repair & Left Fender Painting',
    preferredDate: '2026-10-27',
    preferredTime: '10:30 AM',
    notes: 'Minor parking scrape on left rear quarter panel.',
    status: 'Approved',
    createdAt: '2026-10-23 11:15',
  },
  {
    id: 'book-3',
    customerName: 'Carlo Mendoza',
    phone: '0922-814-9922',
    email: 'carlo.m@mendozamedia.com',
    plateNumber: 'WOD 5421',
    makeModel: 'Mitsubishi Lancer Evolution IX',
    year: '2006',
    division: 'Body & Custom Work',
    serviceRequested: 'Custom Dry Carbon Trunk & Rear Diffuser Consultation',
    preferredDate: '2026-10-28',
    preferredTime: '02:00 PM',
    notes: 'Inquiry for lightweight dry carbon trunk mold fabrication.',
    status: 'Pending',
    createdAt: '2026-10-25 08:45',
  },
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-1',
    jobNo: 'CD-2026-0147',
    plateNumber: 'NBC 4821',
    customerName: 'Atty. Ramon Arceo',
    documentTitle: 'Official Job Order & Technical Specifications Sheet',
    category: 'Job Order',
    dateArchived: '2026-10-12',
    fileKb: 482,
    archivedBy: 'Capt. Oliver Jimenez',
    isPermanent: true,
  },
  {
    id: 'doc-2',
    jobNo: 'CD-2026-0147',
    plateNumber: 'NBC 4821',
    customerName: 'Atty. Ramon Arceo',
    documentTitle: 'Intake 360° Walkaround & Damage Pre-Inspection Log',
    category: 'Inspection Sheet',
    dateArchived: '2026-10-12',
    fileKb: 890,
    archivedBy: 'Ramjay Anor',
    isPermanent: true,
  },
  {
    id: 'doc-3',
    jobNo: 'CD-2026-0139',
    plateNumber: 'NDL 9102',
    customerName: 'Vincent S. Gomez',
    documentTitle: 'Signed Scope of Work & Composite Fabrication Estimate',
    category: 'Estimate',
    dateArchived: '2026-10-08',
    fileKb: 340,
    archivedBy: 'Capt. Oliver Jimenez',
    isPermanent: true,
  },
  {
    id: 'doc-4',
    jobNo: 'CD-2026-0112',
    plateNumber: 'EV-BOC-04',
    customerName: 'Pure-EV Fleet Mobility Corp.',
    documentTitle: 'Official Release Gate Pass & Fleet Acceptance Certificate',
    category: 'Release Gate Pass',
    dateArchived: '2026-10-23',
    fileKb: 520,
    archivedBy: 'Capt. Oliver Jimenez',
    isPermanent: true,
  },
  {
    id: 'doc-5',
    jobNo: 'CD-2026-0155',
    plateNumber: 'NDB 4410',
    customerName: 'Engr. Vincent D. Tan',
    documentTitle: '50-Point PMS Checklist & Suspension Diagnostic Report',
    category: 'Inspection Sheet',
    dateArchived: '2026-10-23',
    fileKb: 412,
    archivedBy: 'Adrian Arzaga',
    isPermanent: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-10-25 09:30:14',
    user: 'Ramjay Anor',
    role: 'Admin',
    action: 'Status Transition',
    target: 'Job Order CD-2026-0139 (NDL 9102)',
    details: 'Advanced stage from Finishing/Paint to Final Assessment after road-test inspection.',
  },
  {
    id: 'audit-2',
    timestamp: '2026-10-24 16:32:00',
    user: 'Capt. Oliver Jimenez',
    role: 'Admin',
    action: 'Document Archival',
    target: 'Document doc-5 (NDB 4410)',
    details: 'Permanently archived 50-Point PMS Checklist to encrypted vault. Retention policy: Never Discarded.',
  },
  {
    id: 'audit-3',
    timestamp: '2026-10-24 14:15:22',
    user: 'Ramjay Anor',
    role: 'Admin',
    action: 'Photo Upload',
    target: 'Job Order CD-2026-0147 (NBC 4821)',
    details: 'Attached paint room down-draft curing progress photo. Synced to Customer Tracking portal.',
  },
  {
    id: 'audit-4',
    timestamp: '2026-10-24 10:15:40',
    user: 'Adrian Arzaga',
    role: 'Staff',
    action: 'Intake Inspection Logged',
    target: 'Vehicle CAR 8800 (R35 GT-R)',
    details: 'Captured pre-existing front chin spoiler scrape and fuel level during bay check-in.',
  },
  {
    id: 'audit-5',
    timestamp: '2026-10-23 17:05:10',
    user: 'Capt. Oliver Jimenez',
    role: 'Admin',
    action: 'Gate Pass Release',
    target: 'Job Order CD-2026-0112 (EV-BOC-04)',
    details: 'Generated and signed Gate Pass for Boracay Pure-EV transport unit.',
  },
];
