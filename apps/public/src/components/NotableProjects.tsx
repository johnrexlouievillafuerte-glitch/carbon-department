import React, { useState } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { Modal } from '@carbon/ui';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  vehicle: string;
  materials: string;
  description: string;
  image: string;
}

export const NotableProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'subaru-sti',
      title: 'Subaru STi Wide-Body Conversion',
      subtitle: 'Complete flared arch tubbing retaining OEM bumper and fuel-door body geometry.',
      category: 'Body & Custom Work',
      vehicle: 'Subaru Impreza WRX STi Hatchback',
      materials: 'High-density composite panels & reinforced polyurethane',
      description:
        'A comprehensive custom wide-body conversion engineered from raw chassis points. The arches were hand-formed and tubbed to accommodate aggressive wheel offsets while preserving factory bumper seams and fuel door access.',
      image: '/assets/project-subaru-sti-widebody.jpg',
    },
    {
      id: 'nissan-370z',
      title: 'Nissan 370Z Custom Carbon Hood',
      subtitle: 'Functional aerodynamic heat evacuation with exposed 2x2 twill carbon weave.',
      category: 'Body & Custom Work',
      vehicle: 'Nissan 370Z',
      materials: '2x2 Twill Carbon Fiber, Epoxy Vacuum Infusion, UV Clearcoat',
      description:
        'A 1-of-1 lightweight vented carbon fiber hood crafted to reduce front-axle weight and evacuate high-pressure under-hood heat. Features integrated rain channels and mirror-buffed UV protective clearcoat.',
      image: '/assets/project-nissan-370z-hood.jpg',
    },
    {
      id: 'boracay-etrike',
      title: 'Boracay Pure-EV Fleet Finishing',
      subtitle: 'Weatherproof composite refinishing and impact coating for 40 commercial units.',
      category: 'Fleet & Custom Work',
      vehicle: 'Commercial Eco Electric Transit Fleet (40 Units)',
      materials: 'Marine-grade fiberglass (FRP) & industrial polyurethane clear',
      description:
        'Contract composite reinforcement and high-durability finishing for 40 passenger units deployed in Boracay. Designed specifically to withstand tropical humidity, coastal salt spray, and continuous commercial duty cycles.',
      image: '/assets/project-boracay-etrike.jpg',
    },
  ];

  const featured = projects[0];
  const sideProjects = projects.slice(1);

  return (
    <section id="projects" className="section bg-[#0F0F10] border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header: Left-Aligned Editorial */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00B8F0] block">
              Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-[#F2F2F0]">
              Featured Projects
            </h2>
            <p className="text-sm sm:text-base text-[#9A9A9A] font-body leading-relaxed">
              Client-approved custom composite fabrications, widebody conversions, and fleet refinishing.
            </p>
          </div>

          <span className="text-xs font-mono text-[#9A9A9A]">
            03 ARCHIVED CASE STUDIES
          </span>
        </div>

        {/* Asymmetric Editorial Grid: 1 Large Left (7 cols), 2 Stacked Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Project (7 cols) */}
          <article
            onClick={() => setSelectedProject(featured)}
            className="lg:col-span-7 group cursor-pointer space-y-4"
          >
            <div className="relative aspect-[16/11] rounded-[8px] overflow-hidden border border-white/[0.08] bg-[#161617]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 p-2 rounded-[4px] bg-[#0F0F10]/80 text-[#F2F2F0] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Inspect project photo"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* Caption Directly Below Image (No navy box) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
                {featured.category} · {featured.vehicle}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F2F2F0] group-hover:text-[#00B8F0] transition-colors leading-snug">
                {featured.title}
              </h3>
              <p className="text-sm text-[#9A9A9A] font-body leading-relaxed max-w-xl">
                {featured.subtitle}
              </p>
              <div className="pt-1">
                <span className="text-xs font-semibold text-[#00B8F0] hover:underline inline-flex items-center gap-1">
                  <span>View project specs</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </article>

          {/* Side Projects (5 cols stacked) */}
          <div className="lg:col-span-5 space-y-8">
            {sideProjects.map((p) => (
              <article
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="group cursor-pointer space-y-3"
              >
                <div className="relative aspect-[16/10] rounded-[8px] overflow-hidden border border-white/[0.08] bg-[#161617]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-2 rounded-[4px] bg-[#0F0F10]/80 text-[#F2F2F0] opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Inspect project photo"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>

                {/* Caption Directly Below Image */}
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#00B8F0] uppercase tracking-wider block">
                    {p.category} · {p.vehicle}
                  </span>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-[#F2F2F0] group-hover:text-[#00B8F0] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9A9A9A] font-body line-clamp-2 leading-relaxed">
                    {p.subtitle}
                  </p>
                  <div className="pt-0.5">
                    <span className="text-xs font-semibold text-[#00B8F0] hover:underline inline-flex items-center gap-1">
                      <span>View project specs</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          wide
        >
          <div className="space-y-5">
            <div className="rounded-[8px] overflow-hidden bg-black aspect-video max-h-96 border border-white/[0.08]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-[#00B8F0]">
                  {selectedProject.vehicle}
                </span>
                <span className="text-xs text-[#9A9A9A]">
                  Verified In-Shop Build
                </span>
              </div>

              <p className="text-sm text-[#9A9A9A] leading-relaxed font-body">
                {selectedProject.description}
              </p>

              <div className="p-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-xs text-[#9A9A9A] font-mono">
                <strong className="text-[#F2F2F0]">Materials &amp; Techniques: </strong>
                {selectedProject.materials}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
