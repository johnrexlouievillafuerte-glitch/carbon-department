import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-[#08090C] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider block mb-1">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Client Reputation in Cainta &amp; Rizal
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Unedited reviews from vehicle owners who trust our mechanical repair, collision paint, and composite fabrication.
          </p>
        </div>

        {/* Minimalist Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#0D0F15] border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] text-cyan-300 font-medium">
                    {item.service}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#00F0FF] font-bold text-xs flex items-center justify-center shrink-0">
                    {item.author.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.author}</div>
                    <div className="text-[11px] text-slate-400">{item.location}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300 block">{item.vehicle}</span>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
