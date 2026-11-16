import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SERVICES } from '../data/services';

interface BookingWidgetProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  onBookingSuccess: (bookingData: any) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  selectedServiceIds,
  onToggleService,
  onBookingSuccess,
}) => {
  // Pristine Form State (Completely Empty / Brand New)
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM – 12:00 PM)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specificConcern, setSpecificConcern] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) newErrors.name = 'Full name is required';
    if (!customerPhone.trim()) newErrors.phone = 'Mobile number is required';
    if (!vehiclePlate.trim()) newErrors.plate = 'Plate number is required for records lookup';
    if (selectedServiceIds.length === 0) newErrors.services = 'Select at least one capability';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#38BDF8', '#FFFFFF', '#10B981'],
      });
    } catch (_e) {
      // safe fallback
    }

    const bookingRef = `CD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedTitles = SERVICES.filter((s) => selectedServiceIds.includes(s.id)).map((s) => s.title);

    const bookingData = {
      referenceId: bookingRef,
      vehicle: `${vehicleYear || '2024'} ${vehicleMakeModel || 'Standard Vehicle'}`.trim(),
      plateNumber: vehiclePlate.toUpperCase().trim(),
      services: selectedTitles.length > 0 ? selectedTitles : ['General Diagnostic Intake'],
      date: bookingDate || new Date().toISOString().split('T')[0],
      timeSlot,
      customerName,
      customerPhone,
      customerEmail: 'N/A',
      customerAddress: 'Cainta, Rizal',
      specificConcern: specificConcern || 'Diagnostic intake assessment',
    };

    onBookingSuccess(bookingData);
  };

  return (
    <section id="booking" className="py-16 bg-[#08090C] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00F0FF] uppercase tracking-wider mb-1">
            <CalendarIcon size={13} />
            <span>Bay Reservation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Schedule Intake &amp; Consultation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            009 Felix Ave, Cainta. Pre-booking prioritizes hoist allocation and reduces wait times.
          </p>
        </div>

        {/* Pristine Clean Form Card */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl bg-[#0D0F15] border border-white/10 space-y-6 shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Vehicle & Service */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">
                1. Vehicle Identifiers
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                  Plate Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NBD 4821"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white uppercase plate-font transition-colors focus:outline-none"
                />
                {errors.plate && <p className="text-[10px] text-rose-400 mt-1">{errors.plate}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Vehicle Make &amp; Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Fortuner / LC200"
                    value={vehicleMakeModel}
                    onChange={(e) => setVehicleMakeModel(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none text-center placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Service Selection Chips */}
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1.5">
                  Select Capabilities *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICES.map((s) => {
                    const isSelected = selectedServiceIds.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => onToggleService(s.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#00F0FF] text-black font-semibold'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}
                      </button>
                    );
                  })}
                </div>
                {errors.services && <p className="text-[10px] text-rose-400 mt-1">{errors.services}</p>}
              </div>

            </div>

            {/* Right Column: Date, Contact & Concern */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">
                2. Schedule &amp; Client Details
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Time Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-2.5 py-2 text-xs text-white transition-colors focus:outline-none"
                  >
                    <option value="Morning (8:00 AM – 12:00 PM)">Morning (8AM–12PM)</option>
                    <option value="Afternoon (1:00 PM – 5:00 PM)">Afternoon (1PM–5PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none placeholder-slate-600"
                  />
                  {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="09XX-XXX-XXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none placeholder-slate-600"
                  />
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 uppercase font-medium block mb-1">
                  Specific Concern / Symptoms
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe mechanical noise, oil leak, collision dent, or custom carbon fiber request..."
                  value={specificConcern}
                  onChange={(e) => setSpecificConcern(e.target.value)}
                  className="w-full bg-[#08090C] border border-white/10 focus:border-[#00F0FF] rounded-lg px-3 py-2 text-xs text-white transition-colors focus:outline-none resize-none placeholder-slate-600"
                />
              </div>

            </div>

          </div>

          {/* Form Bottom & Submit */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Diagnostic assessment performed before firm quote. Walk-ins welcome.</span>
            </span>

            <button
              type="submit"
              className="btn-cyan px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Submit Intake Reservation</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};
