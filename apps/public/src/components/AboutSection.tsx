import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '@carbon/ui';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  bio: string;
  credentials: string[];
  photo: string;
}

interface WorkshopArea {
  id: string;
  title: string;
  caption: string;
  specs: string;
  photo: string;
}

interface AboutSectionProps {
  onRequestVerification: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onRequestVerification }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);

  const team: TeamMember[] = [
    {
      id: 'oliver',
      name: 'Capt. Oliver Jimenez',
      role: 'CEO & Co-Owner',
      division: 'Executive & Operations',
      bio: 'Commercial airline captain with over a decade of commercial aviation experience, applying aviation-grade safety checklists and operational rigor to automotive repair management.',
      credentials: ['Commercial Airline Pilot', 'Operations Safety Specialist'],
      photo: '/assets/team-oliver-jimenez.jpg',
    },
    {
      id: 'ramjay',
      name: 'Ramjay Anor',
      role: 'Co-Owner & Technical Operations Lead',
      division: 'Body & Custom Work',
      bio: 'Over 12 years of hands-on expertise in composite fabrication, overseeing mold design, resin chemistry, and custom aero fabrication.',
      credentials: ['Automotive Mold Specialist', 'Composite Fabrication Lead'],
      photo: '/assets/team-ramjay-anor.jpg',
    },
    {
      id: 'arman',
      name: 'Arman Boadilla',
      role: 'Technical Operations & Paint Lead',
      division: 'Body & Paint',
      bio: 'Over 15 years in mechanical repair, collision panel beating, and dealership paint mixing and booth application.',
      credentials: ['Automotive Coatings Specialist', 'Collision Repair Technician'],
      photo: '/assets/team-arman-boadilla.jpg',
    },
    {
      id: 'adrian',
      name: 'Adrian Arzaga',
      role: 'Diagnostics & Mechanical Lead',
      division: 'Mechanical & Maintenance',
      bio: 'Over a decade of automotive mechanical servicing and electronic diagnostics experience, certified in multi-brand assembly and maintenance.',
      credentials: ['Automotive Servicing Specialist', 'OBD Diagnostics Certified'],
      photo: '/assets/team-adrian-arzaga.jpg',
    },
    {
      id: 'monchito',
      name: 'Monchito Baldovino',
      role: 'Senior Composite Craftsman',
      division: 'Body & Custom Work',
      bio: 'Over 20 years of specialized craft in structural fiberglass molding, custom widebody tubs, and autoclave-level carbon finishing.',
      credentials: ['Master Composite Craftsman', 'Structural Mold Maker'],
      photo: '/assets/team-monchito-baldovino.jpg',
    },
  ];

  const workshopAreas: WorkshopArea[] = [
    {
      id: 'paint-room',
      title: 'Paint Room & Downdraft Booth',
      caption: 'Enclosed, climate-controlled spray chamber with high-efficiency air filtration and thermal curing lamps.',
      specs: 'Downdraft Airflow · Factory Color-Matching · Oven Curing',
      photo: '/assets/workshop-paint-room.jpg',
    },
    {
      id: 'carbon-production',
      title: 'Carbon Fiber & Fiberglass Production Area',
      caption: 'Dedicated composite atelier isolated from mechanical dust for mold casting, vacuum infusion, and resin layup.',
      specs: 'Vacuum Infusion Table · Climate Curing · Precision Mold Vault',
      photo: '/assets/workshop-carbon-production.jpg',
    },
    {
      id: 'mechanical-bay',
      title: 'Mechanical Area & Diagnostic Bays',
      caption: 'Full-service maintenance facility equipped with two-post hydraulic hoists and engine diagnostic suites.',
      specs: 'Hydraulic Hoists · Fluid Evacuation · Full Engine Tooling',
      photo: '/assets/workshop-mechanical-area.jpg',
    },
    {
      id: 'body-repair',
      title: 'Body Repair & Panel Alignment Area',
      caption: 'Structural frame realignment, panel beating, custom aluminum shroud welding, and aero mockup bay.',
      specs: 'Frame Alignment Jig · TIG/MIG Welding · Custom Metalworking',
      photo: '/assets/workshop-body-repair.jpg',
    },
    {
      id: 'open-parking',
      title: 'Open Area Parking & Staging',
      caption: 'Organized intake staging and multi-point 360° walkaround vehicle inspection under natural daylight.',
      specs: 'Customer Vehicle Staging · Pre-Repair Inspection Station',
      photo: '/assets/workshop-open-parking.jpg',
    },
  ];

  const currentArea = workshopAreas[selectedAreaIndex];

  return (
    <section id="about" className="py-24 sm:py-28 bg-[#0F0F10] border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-24">
        
        {/* Story Section: Left-aligned 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
              About Carbon Department
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-heading font-semibold text-[#F2F2F0] tracking-tight leading-[1.16]">
              Aviation-grade rigor meets bespoke automotive craft.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#9A9A9A] font-body text-base leading-relaxed">
            <p>
              Founded in 2020 in Cainta, Rizal, Carbon Department was built to resolve a clear gap in Philippine automotive servicing: delivering dealership-level precision, factory paint matching, and bespoke composite engineering without corporate bureaucracy.
            </p>
            <p>
              Directed by commercial aviation leadership and veteran master craftsmen, our team applies structured multi-point checklists, climate-controlled zone isolation, and strict intake-to-release quality control across every vehicle that enters our bays.
            </p>

            {/* Key Facts List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
              <div>
                <span className="block font-mono text-[#00B8F0] text-sm font-semibold">2020</span>
                <span className="text-xs text-[#9A9A9A]">Founded in Cainta</span>
              </div>
              <div>
                <span className="block font-mono text-[#00B8F0] text-sm font-semibold">5 Zones</span>
                <span className="text-xs text-[#9A9A9A]">Dedicated Bays</span>
              </div>
              <div>
                <span className="block font-mono text-[#00B8F0] text-sm font-semibold">100%</span>
                <span className="text-xs text-[#9A9A9A]">Certified Leads</span>
              </div>
              <div>
                <span className="block font-mono text-[#00B8F0] text-sm font-semibold">RA 10173</span>
                <span className="text-xs text-[#9A9A9A]">Data Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Tour: 5 Workshop Zones Gallery (No large navy box) */}
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
              Facility Tour
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F2F2F0]">
              5 Dedicated Workshop Zones
            </h3>
            <p className="text-sm text-[#9A9A9A]">
              Purpose-built infrastructure isolating composite resin chemistry from mechanical dust and fluid bays.
            </p>
          </div>

          {/* Large Active Image */}
          <div className="space-y-4">
            <div className="relative aspect-video sm:aspect-[21/9] rounded-[8px] overflow-hidden bg-[#161617] border border-white/[0.08]">
              <img
                src={currentArea.photo}
                alt={currentArea.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Caption directly under image */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
              <div>
                <h4 className="text-base font-heading font-semibold text-[#F2F2F0]">
                  {currentArea.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#9A9A9A] mt-0.5">
                  {currentArea.caption}
                </p>
              </div>
              <span className="text-xs font-mono text-[#00B8F0] shrink-0">
                {currentArea.specs}
              </span>
            </div>

            {/* Row of Zone Names / Thumbnails to switch */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {workshopAreas.map((area, idx) => {
                const isSelected = selectedAreaIndex === idx;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedAreaIndex(idx)}
                    className={`p-2.5 rounded-[6px] border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#00B8F0] bg-[#161617]'
                        : 'border-white/[0.08] bg-[#0F0F10] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="aspect-video rounded-[4px] overflow-hidden bg-[#161617] mb-2">
                      <img
                        src={area.photo}
                        alt={area.title}
                        className={`w-full h-full object-cover transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#9A9A9A] block">
                      Zone 0{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-medium block truncate mt-0.5 ${
                        isSelected ? 'text-[#00B8F0]' : 'text-[#F2F2F0]'
                      }`}
                    >
                      {area.title.split('&')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Technical Team: Unified Headshots (4:5 aspect ratio, grayscale to color on hover, no card boxes) */}
        <div className="space-y-8 pt-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
              Technical Team
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F2F2F0]">
              Experienced Leadership &amp; Master Technicians
            </h3>
            <p className="text-sm text-[#9A9A9A]">
              Direct access to composite fabrication leads, master paint technicians, and OBD diagnostic leads.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col justify-between"
              >
                <div>
                  {/* Photo: 4:5 aspect ratio, grayscale, full color on hover */}
                  <div
                    onClick={() => setSelectedMember(member)}
                    className="aspect-[4/5] rounded-[6px] overflow-hidden bg-[#161617] border border-white/[0.08] cursor-pointer"
                  >
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}
                  <h4
                    onClick={() => setSelectedMember(member)}
                    className="text-sm font-heading font-semibold text-[#F2F2F0] mt-3 group-hover:text-[#00B8F0] transition-colors cursor-pointer"
                  >
                    {member.name}
                  </h4>

                  {/* Role: Allow two lines, do not truncate */}
                  <p className="text-xs text-[#9A9A9A] leading-snug mt-1">
                    {member.role}
                  </p>
                </div>

                {/* Text link */}
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="text-xs font-mono text-[#00B8F0] hover:underline mt-2.5 inline-flex items-center gap-1 cursor-pointer w-fit"
                >
                  <span>View credentials</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Licenses & Registration: Quiet single row with hairline dividers */}
        <div className="border-y border-white/[0.08] py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-[#00B8F0] shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-[#F2F2F0]">
                Licensed &amp; Registered Independent Automotive Facility:
              </span>
              <span className="text-[#9A9A9A] ml-2 hidden md:inline">
                Business Permit (valid Dec 31, 2026) · Barangay Clearance · Municipal Environment Clearance · Sanitary Operating Permit · BIR 2303 / DTI Registered
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onRequestVerification}
              className="text-xs font-mono text-[#00B8F0] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Request verification</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* Team Member Detail Modal */}
      {selectedMember && (
        <Modal
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={`${selectedMember.name} — Technical Profile`}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.08]">
              <div className="w-16 h-20 aspect-[4/5] rounded-[6px] overflow-hidden bg-[#161617] shrink-0 border border-white/[0.08]">
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-base font-heading font-semibold text-[#F2F2F0]">
                  {selectedMember.name}
                </h4>
                <p className="text-xs font-mono text-[#00B8F0] mt-0.5">
                  {selectedMember.role} · {selectedMember.division}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-[#F2F2F0] uppercase tracking-wider font-mono">
                Background &amp; Expertise
              </h5>
              <p className="text-xs text-[#9A9A9A] leading-relaxed font-body">
                {selectedMember.bio}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-[#F2F2F0] uppercase tracking-wider font-mono">
                Certifications &amp; Credentials
              </h5>
              <div className="space-y-2">
                {selectedMember.credentials.map((cred, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#F2F2F0]">
                    <CheckCircle2 size={13} className="text-[#2DD4A0] shrink-0" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
