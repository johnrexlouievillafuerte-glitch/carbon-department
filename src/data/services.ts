export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category: 'carbon-fiber' | 'mechanical' | 'electrical' | 'body-repair' | 'detailing';
  startingPrice: string;
  duration: string;
  warranty: string;
  image?: string;
  popular?: boolean;
  features: string[];
  specs: { label: string; value: string }[];
  description: string;
  consultationRequired: boolean;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'carbon-fiber',
    title: 'Carbon Fiber Fabrication',
    tagline: 'Signature 1-of-1 custom molds, hoods, splitters, and aerodynamic parts',
    category: 'carbon-fiber',
    startingPrice: 'Starts at ₱15,000 (Custom quote per mold)',
    duration: '5 – 10 Days',
    warranty: 'Workmanship & Structural Fitment Guarantee',
    popular: true,
    features: [
      'Original shop specialization established in 2020 (ex Carporn Racing heritage)',
      'Custom 1-of-1 handmade fiberglass negative plugs & vacuum molds',
      'High-grade 2x2 twill weave, plain weave, and forged carbon options',
      'UV-inhibited automotive clearcoat to prevent yellowing and oxidation',
      'Bespoke track splitters, vented hoods, rear diffusers & fender flares',
    ],
    specs: [
      { label: 'Crafting', value: 'Vacuum Resin Infused' },
      { label: 'Material', value: 'High-Tensile Carbon Weave' },
      { label: 'Finish', value: 'High-Gloss / Satin UV Clear' },
      { label: 'Origin', value: 'In-House Cainta Atelier' },
    ],
    description:
      'Carbon Department began with carbon fiber fabrication as our primary craft. Our lead fabricators create custom molds from scratch for rare vehicles, track cars, and custom projects where off-the-shelf parts are non-existent.',
    consultationRequired: true,
  },
  {
    id: 'mechanical',
    title: 'Mechanical Repair & Maintenance',
    tagline: 'Engine repair, periodic maintenance, change oil, and underchassis overhauls',
    category: 'mechanical',
    startingPrice: 'Diagnostic consultation required for pricing',
    duration: '1 – 3 Days depending on parts',
    warranty: 'Service & Parts Guarantee',
    popular: true,
    features: [
      'Comprehensive mechanical diagnostic inspection before quote',
      'Engine overhaul, oil leak repair (valve cover, oil pan, front/rear seals)',
      'Periodic Maintenance Service (PMS) with fully synthetic oils',
      'Suspension rebuild: bushings, tie-rod ends, ball joints, shock absorbers',
      'Brake system maintenance, rotor resurfacing & pad replacement',
    ],
    specs: [
      { label: 'Focus', value: 'Engine & Suspension' },
      { label: 'Pricing', value: 'Inspection-Based Quote' },
      { label: 'Specialty', value: 'Toyota, SUVs & Japanese Engines' },
      { label: 'Records', value: 'Digital JO & History Stored' },
    ],
    description:
      'We handle full mechanical overhauls and regular servicing. As mechanical issues (leaks, knocking, overheating) cannot be accurately diagnosed online, an on-site inspection is conducted before creating an official job order.',
    consultationRequired: true,
  },
  {
    id: 'electrical',
    title: 'Electrical Diagnostics & Rewiring',
    tagline: 'Alternator servicing, starter motors, battery systems, and wiring repair',
    category: 'electrical',
    startingPrice: 'Consultation & bench test required',
    duration: '1 – 2 Days',
    warranty: 'Parts & Labor Warranty',
    features: [
      'Alternator diode replacement, rotor rebuild, and voltage regulation',
      'Starter motor reconditioning and solenoid replacement',
      'Battery health load-testing and parasitic draw diagnostic',
      'Complete harness repair, fuse box inspection, and relay testing',
      'Computer OBD2 diagnostic scanning and sensor replacement',
    ],
    specs: [
      { label: 'Testing', value: 'Digital Bench & Scan Tool' },
      { label: 'Charging', value: '13.8V – 14.4V Verified' },
      { label: 'Battery', value: 'Load Tested' },
      { label: 'Safety', value: 'Fused Circuit Protection' },
    ],
    description:
      'Electrical malfunctions often present unpredictable symptoms like alternator failure, dead batteries, or intermittent starting. Our technicians test voltage levels and wiring continuity to address the exact root cause.',
    consultationRequired: true,
  },
  {
    id: 'body-repair',
    title: 'Body Repair & Collision Restoration',
    tagline: 'Accident repair, metal pulling, custom fender modifications, and spray painting',
    category: 'body-repair',
    startingPrice: '₱3,500 per panel (Estimate varies by damage)',
    duration: '3 – 7 Days',
    warranty: 'Paint Adhesion & Match Guarantee',
    popular: true,
    features: [
      'Full collision reconstruction and chassis alignment',
      'Panel beating and dent pulling without excessive body filler',
      'Custom fender cutting, arch rolling, and body styling for wide stances',
      'Computerized color-matching and 2-stage polyurethane bake painting',
      'Pre-inspection photo documentation to catalog vehicle condition before work',
    ],
    specs: [
      { label: 'Process', value: 'Metal Pull + Epoxy + Bake' },
      { label: 'Paint', value: 'Polyurethane 2K' },
      { label: 'Fleet Capability', value: 'Multi-Unit Projects Handled' },
      { label: 'Insurance', value: 'AXA Partner Targeting' },
    ],
    description:
      'Whether recovering from a minor fender bender or performing custom metal and fiberglass work, our body shop provides factory-grade panel alignment, seamless paint blending, and durable rust-inhibited priming.',
    consultationRequired: true,
  },
  {
    id: 'detailing',
    title: 'Automotive Detailing & Restoration',
    tagline: 'Multi-stage paint correction, interior steam deep clean, and engine degrease',
    category: 'detailing',
    startingPrice: '₱3,500 – ₱8,500 depending on vehicle size',
    duration: '1 – 2 Days',
    warranty: '100% Satisfaction',
    features: [
      'Chemical decontamination foam bath, clay bar, and iron fallout removal',
      'Multi-stage rotary compounding to eliminate swirls, watermarks, and oxidation',
      'Deep interior carpet and seat hot-water extraction and steam sanitization',
      'Engine bay safe degreasing and protective satin dressing',
      'Hydrophobic protective paint sealant and headlight lens restoration',
    ],
    specs: [
      { label: 'Duration', value: '6 – 10 Hours' },
      { label: 'Compound', value: 'Diminishing Nano Abrasives' },
      { label: 'Interior', value: 'Steam Sanitized' },
      { label: 'Engine Bay', value: 'Degreased & Sealed' },
    ],
    description:
      'Restore showroom clarity and clean freshness to your daily driver or collector car. We thoroughly decontaminate all paint, remove acid-rain etching, deep-clean carpets, and dress engine bays.',
    consultationRequired: false,
  },
];
