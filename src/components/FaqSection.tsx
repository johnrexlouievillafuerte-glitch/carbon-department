import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How long does XPEL PPF last, and will it damage original factory paint upon removal?',
    answer: 'XPEL Ultimate Plus and Stealth films carry an official 10-year manufacturer warranty against yellowing, bubbling, and cracking. Because our films use optically clear acrylic adhesives engineered specifically for automotive substrates, the film can be safely removed by our technicians without pulling or degrading original factory paint.',
  },
  {
    question: 'How does paint correction differ from a standard car wash & wax?',
    answer: 'Wax merely masks paint defects with temporary oils that wash away in weeks. Paint correction is a permanent leveling process: using microscopic abrasives and ultrasonic thickness gauges, our certified detailers remove swirls, oxidation, and scratches from the clear coat itself to create true optical mirror reflections.',
  },
  {
    question: 'What is the curing time before I can wash my vehicle after Ceramic Coating?',
    answer: 'After treatment in our infrared quartz curing bay, the ceramic coating is 90% cross-linked before handover. We ask clients to avoid detergent-based washing for 7 days while the final matrix fully cures. We provide a complimentary 30-day inspection and decontamination booster wash with every package.',
  },
  {
    question: 'Will bespoke AWD Dyno performance tuning void my car’s factory warranty?',
    answer: 'Our software engineers flash calibrations within strict manufacturer safety thermal limits and AFR envelopes. For track clients and enthusiasts desiring warranty compliance, we offer bench-flashes that can be reset to factory stock flash IDs prior to scheduled dealership servicing.',
  },
  {
    question: 'Do you offer covered enclosed trailer pickup for rare collector vehicles?',
    answer: 'Yes. Carbon-Department operates a dedicated air-ride enclosed transport service with soft tie-downs and ultra-low approach ramps specifically designed for low ground-clearance GT3 cars, hypercars, and vintage collector pieces.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 relative bg-[#0D0E15] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12131C] border border-cyan-500/30 text-xs font-semibold text-[#00F0FF] mb-3">
            <HelpCircle size={13} />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-gradient-cyan">Inquiries</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Everything you need to know about paint film warranties, ceramic care, and studio bay bookings.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#12131C] border border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-white/5 text-cyan-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 bg-[#0A0A0C]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
