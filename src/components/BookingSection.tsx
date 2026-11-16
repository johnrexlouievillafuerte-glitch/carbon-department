import React, { useState } from 'react';
import { 
  Calendar, 
  Layers, 
  Wrench, 
  CheckCircle2, 
  ShieldAlert, 
  Send 
} from 'lucide-react';
import { useCarbon } from '../context/CarbonContext';
import type { Division } from '../data/carbonStore';

interface BookingSectionProps {
  preselectedService?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ preselectedService }) => {
  const { createBooking } = useCarbon();

  const [division, setDivision] = useState<Division>('Body & Custom Work');
  const [service, setService] = useState(preselectedService || 'Carbon Fiber & Fiberglass (Parts/Repair)');
  const [plateNumber, setPlateNumber] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [year, setYear] = useState('2023');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');

  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);

  const servicesByDivision: Record<Division, string[]> = {
    'Body & Custom Work': [
      'Carbon Fiber & Fiberglass (Parts/Repair)',
      'Custom Metalwork & Aluminum Shrouds',
      'Body & Paint Collision Refinishing',
      'Wide-body Conversion Consultation',
      'Custom Aerodynamic Splitter / Spoiler',
    ],
    'Mechanical & Maintenance': [
      'Basic Service & 50-Point PMS (Motul)',
      'Engine Work & General Powertrain Repair',
      'Aircon Evaporator Leak & Recharge',
      'Underchassis, Bushing & Suspension Work',
      'OBD2 Computerized Diagnostic Scan',
    ],
    'Dual-Division': [
      'Full Restomod: Composite Body + Mechanical',
      'Track Preparation: Cooling + Carbon Aero',
      'Collision Repair with Mechanical Alignment',
    ],
  };

  const timeSlots = [
    '08:30 AM',
    '10:00 AM',
    '11:30 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !customerName || !phone) return;

    const booking = createBooking({
      customerName,
      phone,
      email: email || 'customer@client.ph',
      plateNumber: plateNumber.toUpperCase().trim(),
      makeModel: makeModel || 'Standard Vehicle',
      year: year || '2023',
      division,
      serviceRequested: service,
      preferredDate,
      preferredTime,
      notes: notes || 'Online appointment request for bay intake.',
    });

    setSubmittedBooking(booking);
  };

  return (
    <section id="booking" className="py-20 bg-carbon-twill border-b border-[#7B93BE]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B57]/50 border border-[#7B93BE]/30 text-xs font-mono-code text-[#FFB020] uppercase font-semibold">
              <Calendar size={13} />
              <span>Visit Reservation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Book a Workshop Visit. <br />
              <span className="text-[#7B93BE]">Reserve Your Bay Slot in Cainta.</span>
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              Requests an intake slot and consultation. <strong className="text-[#FFB020]">Zero upfront fees or online payment required.</strong> You bring your vehicle in, we conduct the physical inspection, and agree on the work before a single bolt is turned.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/25 text-xs font-mono-code text-slate-300 space-y-1">
            <div className="text-[#10B981] font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Workshop Open Mon–Sat 8:00 AM – 6:00 PM
            </div>
            <div className="text-slate-400 text-[11px]">
              Direct Phone: 0948-243-2421
            </div>
          </div>
        </div>

        {/* Confirmation State if just submitted */}
        {submittedBooking ? (
          <div className="glass-navy p-8 sm:p-10 rounded-3xl border border-[#10B981]/50 clip-brand-lg space-y-6 text-center max-w-2xl mx-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#10B981] flex items-center justify-center mx-auto border-2 border-[#10B981]/40 shadow-lg">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono-code text-[#FFB020] uppercase tracking-wider font-semibold">
                Slot Request Logged in Shop System
              </span>
              <h3 className="text-2xl font-heading font-bold text-white">
                Intake Consultation Reserved!
              </h3>
              <p className="text-xs text-slate-300 font-body max-w-md mx-auto">
                Thank you, <strong className="text-white">{submittedBooking.customerName}</strong>. Your requested slot for plate <strong className="text-[#FFB020] font-mono-code">{submittedBooking.plateNumber}</strong> on <strong className="text-white">{submittedBooking.preferredDate} ({submittedBooking.preferredTime})</strong> has been dispatched to our Cainta service desk.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0D12]/90 border border-[#7B93BE]/30 text-left font-mono-code text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Ref:</span>
                <span className="text-white font-bold">{submittedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="text-[#7B93BE] font-semibold">{submittedBooking.serviceRequested}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="text-[#10B981]">Php 0.00 (No payment on booking)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedBooking(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#172B57] hover:bg-[#203a74] text-white text-xs font-semibold cursor-pointer border border-[#7B93BE]/40"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-navy p-6 sm:p-10 rounded-3xl border border-[#7B93BE]/30 clip-brand-lg shadow-2xl space-y-8"
          >
            <div className="brand-corner-tr" />
            <div className="brand-corner-bl" />

            {/* Step 1: Select Division & Service */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                  01
                </span>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Select Division &amp; Service Category
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Body & Custom Work', 'Mechanical & Maintenance', 'Dual-Division'] as Division[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDivision(d);
                      setService(servicesByDivision[d][0]);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      division === d
                        ? 'bg-[#172B57] border-[#7B93BE] text-white shadow-lg'
                        : 'bg-[#11141C] border-[#7B93BE]/25 text-slate-400 hover:text-white hover:bg-[#151922]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {d === 'Body & Custom Work' ? (
                        <Layers size={16} className="text-[#FFB020]" />
                      ) : (
                        <Wrench size={16} className="text-[#7B93BE]" />
                      )}
                      <span className="text-xs font-heading font-bold">
                        {d}
                      </span>
                    </div>
                    {division === d && <CheckCircle2 size={14} className="text-[#FFB020]" />}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {servicesByDivision[division].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setService(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all cursor-pointer ${
                      service === s
                        ? 'bg-[#FFB020] text-slate-950 font-bold shadow-md'
                        : 'bg-[#11141C] text-slate-300 border border-[#7B93BE]/30 hover:bg-[#172B57]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Vehicle & Customer Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                  02
                </span>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Vehicle &amp; Customer Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    License Plate Number <span className="text-[#FFB020]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g. NBC 4821"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020] uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Vehicle Make &amp; Model
                  </label>
                  <input
                    type="text"
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                    placeholder="e.g. Subaru WRX STi"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Year Model
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2021"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Customer Full Name <span className="text-[#FFB020]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Juan dela Cruz"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Mobile Number (PH) <span className="text-[#FFB020]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0917-123-4567"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Date, Time & Symptoms / Note */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                  03
                </span>
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Preferred Intake Schedule &amp; Symptoms
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Preferred Drop-off Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                    Preferred Arrival Time Window
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-xs focus:outline-none focus:border-[#FFB020]"
                  >
                    {timeSlots.map((t) => (
                      <option key={t} value={t} className="bg-[#11141C]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Vehicle Symptoms / Scope Note
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your concerns: strange noise, custom composite concept, collision damage area, or routine PMS..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-body text-xs focus:outline-none focus:border-[#FFB020]"
                />
              </div>
            </div>

            {/* Clear Disclaimer & Submit */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-body">
                <ShieldAlert size={15} className="text-[#FFB020] shrink-0" />
                <span>
                  Slot request only. Does not require payment. We will confirm your schedule via call/SMS.
                </span>
              </div>

              <button
                type="submit"
                className="btn-amber px-8 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center justify-center gap-2 clip-tr shadow-lg shadow-[#FFB020]/25"
              >
                <Send size={14} />
                <span>Submit Bay Slot Request</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
