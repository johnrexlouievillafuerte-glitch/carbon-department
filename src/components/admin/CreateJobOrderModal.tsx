import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Fuel 
} from 'lucide-react';
import { useCarbon } from '../../context/CarbonContext';
import type { Division, InspectionChecklist } from '../../data/carbonStore';
import { SHOP_TEAM } from '../../data/carbonStore';

interface CreateJobOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillPlate?: string;
}

export const CreateJobOrderModal: React.FC<CreateJobOrderModalProps> = ({
  isOpen,
  onClose,
  prefillPlate = '',
}) => {
  const { createJobOrder } = useCarbon();

  const [plateNumber, setPlateNumber] = useState(prefillPlate);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('0917-');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Cainta, Rizal');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Fortuner');
  const [year, setYear] = useState('2023');
  const [color, setColor] = useState('Attitude Black Mica');
  const [vin, setVin] = useState('');
  
  const [division, setDivision] = useState<Division>('Body & Custom Work');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Carbon Fiber & Fiberglass Layup']);
  const [concern, setConcern] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['Ramjay Anor']);
  const [estimatedDays, setEstimatedDays] = useState(7);
  const [intakeNotes, setIntakeNotes] = useState('Walkaround inspection conducted with customer present. Pre-existing stone chips documented.');

  // Checklist
  const [checklist, setChecklist] = useState<InspectionChecklist>({
    exteriorBodyClean: true,
    preExistingScratchesNoted: true,
    engineOilLevelChecked: true,
    coolantBrakeFluidChecked: true,
    batteryHealthVerified: true,
    underchassisDamageChecked: true,
    dashboardWarningLightsChecked: true,
    personalBelongingsInventoried: true,
    fuelLevelQuarter: 3,
  });

  if (!isOpen) return null;

  const availableServices = [
    'Carbon Fiber & Fiberglass Layup',
    'Custom Metalwork & Aluminum Shrouds',
    'Collision Body Repair & Downdraft Paint',
    'Widebody Conversion & Arch Tubbing',
    'Periodic Maintenance Service (PMS) 50-Point',
    'Engine Overhaul & Drivetrain Repair',
    'Aircon Evaporator Leak & Recharge',
    'Underchassis, Bushings & Suspension Press',
  ];

  const handleToggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleToggleTech = (techName: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techName) ? prev.filter((item) => item !== techName) : [...prev, techName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !customerName.trim() || !phone.trim()) return;

    createJobOrder({
      plateNumber,
      customerName,
      phone,
      email,
      address,
      make,
      model,
      year,
      color,
      vin,
      division,
      services: selectedServices,
      customerConcern: concern || 'Intake diagnosis and repair work order.',
      technicians: selectedTechs,
      intakeNotes,
      checklist,
      estimatedReleaseDays: estimatedDays,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0E121B] border border-[#7B93BE]/40 rounded-3xl overflow-hidden clip-brand-lg shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="brand-corner-tr" />
        <div className="brand-corner-bl" />

        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#172B57]/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-[#7B93BE]/40 flex items-center justify-center text-[#FFB020] shadow-md clip-brand">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
                New Automotive Job Order Intake
              </h2>
              <span className="text-xs text-[#7B93BE] font-mono-code">
                Automatic Permanent Record Creation (CD-2026-XXXX)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#0B0D12] hover:bg-[#151922] text-slate-400 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 text-xs font-body">
          
          {/* Section 1: Customer & Vehicle Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                01
              </span>
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                Customer &amp; Vehicle Identifiers
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Plate Number <span className="text-[#FFB020]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. NBC 4821"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code uppercase focus:outline-none focus:border-[#FFB020]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Vehicle Make
                </label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Subaru"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Model
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. WRX STi"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Year &amp; Color
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2021"
                    className="w-16 px-2 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="White Pearl"
                    className="flex-1 px-2 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Chassis / VIN
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="VAB-029411"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code text-[11px] focus:outline-none focus:border-[#FFB020]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Customer Full Name <span className="text-[#FFB020]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Atty. Ramon Arceo"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
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
                  placeholder="0917-882-1923"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code focus:outline-none focus:border-[#FFB020]"
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
                  placeholder="ramon.arceo@email.ph"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Customer Address / Village
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vista Verde Executive Village, Cainta"
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Division & Scope of Work */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                02
              </span>
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                Division &amp; Services Scope
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Body & Custom Work', 'Mechanical & Maintenance', 'Dual-Division'] as Division[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDivision(d)}
                  className={`p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between ${
                    division === d
                      ? 'bg-[#172B57] border-[#FFB020] text-white shadow-md'
                      : 'bg-[#11141C] border-[#7B93BE]/30 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-heading font-bold">{d}</span>
                  {division === d && <CheckCircle2 size={14} className="text-[#FFB020]" />}
                </button>
              ))}
            </div>

            {/* Service Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableServices.map((s) => {
                const checked = selectedServices.includes(s);
                return (
                  <div
                    key={s}
                    onClick={() => handleToggleService(s)}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      checked
                        ? 'bg-[#172B57]/60 border-[#7B93BE] text-white'
                        : 'bg-[#11141C] border-[#7B93BE]/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        checked ? 'bg-[#FFB020] border-[#FFB020] text-slate-950 font-bold' : 'border-slate-500'
                      }`}
                    >
                      {checked && '✓'}
                    </div>
                    <span>{s}</span>
                  </div>
                );
              })}
            </div>

            {/* Customer Concern */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Customer Stated Problem / Consultation Objective
              </label>
              <textarea
                rows={2}
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="State the customer's exact complaint or requested custom aero fabrication..."
                className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
              />
            </div>
          </div>

          {/* Section 3: Pre-Inspection Checklist & Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="font-mono-code text-xs font-bold text-[#FFB020] px-2 py-0.5 rounded bg-[#172B57]">
                03
              </span>
              <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                Intake Walkaround Checklist &amp; Technicians
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#11141C] border border-[#7B93BE]/25">
              {[
                { key: 'exteriorBodyClean', label: 'Exterior body clean upon intake' },
                { key: 'preExistingScratchesNoted', label: 'Pre-existing scratches/dents recorded' },
                { key: 'engineOilLevelChecked', label: 'Engine oil level verified' },
                { key: 'coolantBrakeFluidChecked', label: 'Coolant & brake fluids verified' },
                { key: 'batteryHealthVerified', label: 'Battery terminal & voltage check passed' },
                { key: 'underchassisDamageChecked', label: 'Underchassis scrape inspection complete' },
                { key: 'dashboardWarningLightsChecked', label: 'Zero unexpected CEL / dashboard alarms' },
                { key: 'personalBelongingsInventoried', label: 'Personal items inside vehicle noted' },
              ].map(({ key, label }) => {
                const isChecked = checklist[key as keyof InspectionChecklist] as boolean;
                return (
                  <label key={key} className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setChecklist((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                      className="rounded border-slate-600 text-[#FFB020] focus:ring-0"
                    />
                    <span className="text-[11px]">{label}</span>
                  </label>
                );
              })}
            </div>

            {/* Fuel Level */}
            <div className="space-y-1 p-3 rounded-xl bg-[#11141C] border border-[#7B93BE]/25">
              <div className="flex items-center justify-between text-[11px] font-mono-code">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Fuel size={13} className="text-[#FFB020]" /> Fuel Level at Bay Check-in:
                </span>
                <span className="text-[#FFB020] font-bold">
                  {checklist.fuelLevelQuarter === 1
                    ? '1/4 Tank (Reserve)'
                    : checklist.fuelLevelQuarter === 2
                    ? '1/2 Tank'
                    : checklist.fuelLevelQuarter === 3
                    ? '3/4 Tank'
                    : 'Full Tank'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={checklist.fuelLevelQuarter}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, fuelLevelQuarter: Number(e.target.value) }))
                }
                className="w-full cursor-pointer accent-[#FFB020]"
              />
            </div>

            {/* Assign Technicians */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                Assign Lead Technicians
              </label>
              <div className="flex flex-wrap gap-2">
                {SHOP_TEAM.map((t) => {
                  const assigned = selectedTechs.includes(t.name);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToggleTech(t.name)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-heading font-semibold transition-all cursor-pointer ${
                        assigned
                          ? 'bg-[#172B57] text-[#FFB020] border-[#FFB020]'
                          : 'bg-[#11141C] text-slate-400 border-[#7B93BE]/30 hover:text-white'
                      }`}
                    >
                      {t.name} ({t.role.split(' ')[0]})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Turnaround Days & Intake Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Turnaround (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white font-mono-code"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-[11px] font-mono-code uppercase text-slate-300 block font-semibold">
                  Intake Walkaround Notes &amp; Observations
                </label>
                <input
                  type="text"
                  value={intakeNotes}
                  onChange={(e) => setIntakeNotes(e.target.value)}
                  placeholder="Document pre-existing dents, stone chips, or customer notes..."
                  className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-[#7B93BE]/30 text-white focus:outline-none focus:border-[#FFB020]"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-code">
              <ShieldCheck size={13} className="text-[#10B981]" />
              <span>Immutable Archive Record Guaranteed</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#11141C] hover:bg-[#151922] text-slate-300 text-xs font-semibold border border-[#7B93BE]/30 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-amber px-6 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer clip-tr shadow-md"
              >
                Create Job Order
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
