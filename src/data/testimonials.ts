export interface TestimonialItem {
  id: string;
  author: string;
  title: string;
  vehicle: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
  verified: boolean;
  location: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    author: 'Atty. Juan Carlos Reyes',
    title: 'Toyota LC200 Owner',
    vehicle: 'Toyota Land Cruiser 200 V8',
    rating: 5,
    service: 'Mechanical Overhaul & Valve Cover Gasket',
    comment:
      'What impressed me most was their pre-inspection documentation. Before touching the engine, the service advisor walked me around the truck and logged every minor exterior scratch on the digital JO. No finger-pointing later. Oil leak completely resolved and suspension is whisper quiet.',
    date: 'October 2026',
    verified: true,
    location: 'Vista Verde, Cainta',
  },
  {
    id: 't-2',
    author: 'Mark Dave Ramos',
    title: 'Drift & Track Enthusiast',
    vehicle: 'Nissan Silvia S15 Spec-R',
    rating: 5,
    service: 'Custom Carbon Fiber Vented Hood',
    comment:
      'Finding real carbon craftsmen who know vacuum resin infusion is rare. The fabrication team really understands composite molds and high-temp curing. The hood fitment to the fenders is factory-tight and clearcoat has zero pinholes even after high engine bay heat.',
    date: 'September 2026',
    verified: true,
    location: 'Pasig City / Cainta',
  },
  {
    id: 't-3',
    author: 'Engr. Michael Bautista',
    title: 'SUV Fleet Operator',
    vehicle: 'Toyota Fortuner 2.8 D-4D',
    rating: 5,
    service: 'Electrical System & Alternator Rebuild',
    comment:
      'Our Fortuner suddenly had battery discharge issues along Ortigas Ave Extension. The lead technician tested the charging voltage on the bench right in front of me (11.8V failing to 14.2V rebuilt). Transparent diagnosis with honest pricing instead of blindly replacing whole assemblies.',
    date: 'August 2026',
    verified: true,
    location: 'Taytay, Rizal',
  },
  {
    id: 't-4',
    author: 'Christine Joy Mendoza',
    title: 'Daily Commuter',
    vehicle: 'Toyota Vios 1.3 Dual VVT-i',
    rating: 5,
    service: 'Collision Dent Repair & Oven Bake Repaint',
    comment:
      'Got rear-ended in heavy Marcos Highway traffic. Carbon Department handled the dent repair and panel refinishing. The silver metallic color match is flawless—you cannot tell which panel was repainted under direct sunlight.',
    date: 'October 2026',
    verified: true,
    location: 'Marikina / Cainta',
  },
];

export const CERTIFICATIONS = [
  { name: 'Ex Carporn Racing Craftsmanship', badge: 'HERITAGE', detail: 'Composite & Carbon Fabrication' },
  { name: 'CARBONTrack Verified Shop', badge: 'SYSTEM', detail: 'Digital Job Order & Pre-Inspection Audited' },
  { name: '40-Unit Fleet Delivery Completed', badge: 'COMMERCIAL', detail: 'Boracay E-Trike Fiberglass Fleet' },
  { name: 'Targeting AXA Insurance Accreditation', badge: 'PARTNERSHIP', detail: 'Collision & Body Repair Facility' },
];
