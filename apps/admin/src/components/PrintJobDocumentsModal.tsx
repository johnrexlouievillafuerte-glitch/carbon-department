import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck,
  ShieldCheck,
  Receipt,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@carbon/ui';
import type { JobOrder, Customer, Vehicle } from '@carbon/ui';

interface PrintJobDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  job: JobOrder | null;
  customer?: Customer;
  vehicle?: Vehicle;
}

type DocType = 'pre-inspection' | 'warranty-release' | 'quotation';

interface QuotationItem {
  id: string;
  description: string;
  action: string;
  quantity: number;
  unitPrice: number;
}

export const PrintJobDocumentsModal: React.FC<PrintJobDocumentsModalProps> = ({
  open,
  onClose,
  job,
  customer,
  vehicle,
}) => {
  if (!open || !job) return null;

  const [activeDoc, setActiveDoc] = useState<DocType>('warranty-release');
  const [showEditor, setShowEditor] = useState(true);

  // Editable Form Data initialized from Job / Customer / Vehicle
  const [customerName, setCustomerName] = useState(customer?.name || 'Client Name');
  const [customerContact, setCustomerContact] = useState(customer?.phone || '0917-000-0000');
  const [customerEmail, setCustomerEmail] = useState(customer?.email || 'client@example.ph');
  const [vehicleModel, setVehicleModel] = useState(
    vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle'
  );
  const [plateNumber, setPlateNumber] = useState(vehicle?.plate_number || 'ABC 1234');
  const [odometer, setOdometer] = useState(
    (job.intake_checklist as any)?.odometerReading || '42,500'
  );
  const [fuelLevel, setFuelLevel] = useState(
    (job.intake_checklist as any)?.fuelLevel || '3/4 Full'
  );
  const [date, setDate] = useState(job.date_received || new Date().toISOString().split('T')[0]);
  const [releaseDate, setReleaseDate] = useState(
    job.estimated_release || new Date().toISOString().split('T')[0]
  );
  const [preparedBy, setPreparedBy] = useState(
    job.assigned_technicians?.[0] || 'Ramjay Anor (Shop Operations Lead)'
  );

  // Document 1: Pre-Inspection Checklist
  const [looseItems, setLooseItems] = useState<Record<string, boolean>>({
    'Spare Tire': true,
    'Jack / Tools': true,
    'Documents': true,
    'Floor Mats': true,
    'Audio Unit': true,
    'RFID / E-Pass': false,
    'Dash Camera': true,
    'Other Valuables': false,
  });

  const [damageNotes, setDamageNotes] = useState<Record<string, string>>({
    front: 'Stone chips on lower front lip (S)',
    driverSide: 'Minor swirl marks on door panel (S)',
    passengerSide: 'Clear, no visible dents',
    rear: 'Clean, badge alignment inspected',
    top: 'Factory gloss intact',
  });

  const [operationalStatus, setOperationalStatus] = useState<
    Array<{ item: string; status: 'OK' | 'FAIL' | 'N/A'; remarks: string }>
  >([
    { item: 'Warning Lights on Dash', status: 'OK', remarks: 'No DTC check engine' },
    { item: 'Headlights / Tail Lights', status: 'OK', remarks: 'All LED diodes functional' },
    { item: 'Turn Signals / Hazard Lights', status: 'OK', remarks: 'Relay clicks verified' },
    { item: 'Air Conditioning System', status: 'OK', remarks: 'Cold at 18°C vent reading' },
    { item: 'Power Windows / Central Lock', status: 'OK', remarks: 'All 4 regulators smooth' },
    { item: 'Wiper & Washer Fluid', status: 'OK', remarks: 'Blades pliable, reservoir filled' },
    { item: 'Horn Operation', status: 'OK', remarks: 'Dual tone audible' },
  ]);

  const [mechanicalRecs, setMechanicalRecs] = useState(
    'Recommend front brake pad replacement in 5,000 km. Bushings and ball joints inspected tight.'
  );
  const [electricalRecs, setElectricalRecs] = useState(
    'Battery health tested at 12.6V resting. Alternator output stable at 14.2V.'
  );
  const [otherSuggestions, setOtherSuggestions] = useState(
    'Apply ceramic sealant after 30-day paint cure window.'
  );

  // Document 2: Release & Warranty Terms
  const [performedProcedures, setPerformedProcedures] = useState<string>(
    job.services?.join('\n') ||
      '• Multi-stage surface preparation and panel realignment\n• Carbon fiber composite mold layup and resin vacuum infusion\n• Down-draft oven bake with polyurethane UV-blocking clearcoat\n• 50-point mechanical safety and fluid verification'
  );

  const [warrantyDetails, setWarrantyDetails] = useState<string>(
    '1. 12-Month Limited Finish Warranty: Covers polyurethane clearcoat against blistering, bubbling, or peeling under normal operational use.\n2. 6-Month Composite Structural Warranty: Covers carbon fiber and FRP molds against delamination and resin fracture.\n3. 30-Day Workmanship Warranty: On all mechanical reassembly tolerances, torqued fasteners, and fluid seals.\n4. Exclusions: Damage resulting from subsequent vehicular collision, stone chips, chemical misuse, or unauthorized disassembly voids coverage.'
  );

  // Document 3: Quotation & Line Items
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    {
      id: '1',
      description: job.services?.[0] || 'Custom Carbon Fiber Fabrication',
      action: 'Molding, Resin Infusion & Clearcoat',
      quantity: 1,
      unitPrice: (job.intake_checklist as any)?.estimatedCost
        ? parseFloat(String((job.intake_checklist as any).estimatedCost).replace(/,/g, '')) || 28500
        : 28500,
    },
    {
      id: '2',
      description: 'Panel Alignment & Downdraft Spray Prep',
      action: 'Surface primer & oven curing',
      quantity: 1,
      unitPrice: 8500,
    },
    {
      id: '3',
      description: 'Comprehensive 50-Point PMS & Fluid Analysis',
      action: 'Inspection, torque verify, multi-point walkaround',
      quantity: 1,
      unitPrice: 2500,
    },
  ]);

  const handleAddQuotationItem = () => {
    setQuotationItems([
      ...quotationItems,
      {
        id: Date.now().toString(),
        description: 'Additional Service Item',
        action: 'Labor / Installation',
        quantity: 1,
        unitPrice: 1500,
      },
    ]);
  };

  const handleRemoveQuotationItem = (id: string) => {
    setQuotationItems(quotationItems.filter((i) => i.id !== id));
  };

  const handleUpdateQuotationItem = (
    id: string,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    setQuotationItems(
      quotationItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const grandTotal = quotationItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-[#0F0F10]/80 no-print cursor-pointer"
        onClick={onClose}
        style={{ zIndex: 9999 }}
      />

      {/* Main Container */}
      <div
        className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6 text-center relative"
        style={{ zIndex: 10000 }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl bg-[#161617] border border-white/[0.08] rounded-[8px] shadow-2xl flex flex-col text-left my-auto transition-all overflow-hidden max-h-[94vh]"
          style={{ zIndex: 10001 }}
        >
          {/* Top Bar: Controls (Hidden on Print) */}
          <div className="p-4 bg-[#161617] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            {/* Document Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveDoc('warranty-release')}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeDoc === 'warranty-release'
                    ? 'bg-[#00B8F0] text-[#0F0F10] font-semibold'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
                }`}
              >
                <ShieldCheck size={14} />
                <span>Warranty &amp; Release</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('pre-inspection')}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeDoc === 'pre-inspection'
                    ? 'bg-[#00B8F0] text-[#0F0F10] font-semibold'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
                }`}
              >
                <FileCheck size={14} />
                <span>Pre-Inspection Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('quotation')}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeDoc === 'quotation'
                    ? 'bg-[#00B8F0] text-[#0F0F10] font-semibold'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
                }`}
              >
                <Receipt size={14} />
                <span>Repair Quotation</span>
              </button>
            </div>

            {/* Actions: Toggle Editor, Print, Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditor(!showEditor)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  showEditor
                    ? 'bg-[#0F0F10] border-[#00B8F0]/40 text-[#00B8F0]'
                    : 'bg-[#0F0F10] border-white/[0.08] text-[#9A9A9A] hover:text-[#F2F2F0]'
                }`}
              >
                <Edit3 size={14} />
                <span className="hidden sm:inline">{showEditor ? 'Hide Editor' : 'Edit Info'}</span>
              </button>

              <Button
                variant="primary"
                size="sm"
                className="text-center justify-center font-semibold px-4 flex items-center gap-1.5"
                onClick={handlePrint}
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-[6px] bg-[#0F0F10] hover:bg-white/[0.06] text-[#9A9A9A] hover:text-[#F2F2F0] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Workspace Body (Split Editor & Live A4 Sheet Preview) */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left: Dynamic Editor Panel (Collapsible, no-print) */}
            {showEditor && (
              <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#0F0F10] p-4 overflow-y-auto space-y-4 text-xs no-print shrink-0">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="font-heading font-semibold text-[#F2F2F0] flex items-center gap-1.5">
                    <Edit3 size={13} className="text-[#00B8F0]" />
                    Document Customizer
                  </span>
                  <span className="text-[10px] text-[#9A9A9A] font-mono">Updates live</span>
                </div>

                {/* Common Details */}
                <div className="space-y-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                    Customer &amp; Vehicle Info
                  </span>
                  <div>
                    <label className="text-[11px] text-[#9A9A9A] block mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Plate Number</label>
                      <input
                        type="text"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] font-mono uppercase text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] font-mono text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9A9A9A] block mb-1">Vehicle Model &amp; Year</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Mileage (km)</label>
                      <input
                        type="text"
                        value={odometer}
                        onChange={(e) => setOdometer(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] font-mono text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Fuel Gauge</label>
                      <input
                        type="text"
                        value={fuelLevel}
                        onChange={(e) => setFuelLevel(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9A9A9A] block mb-1">Technician / Advisor</label>
                    <input
                      type="text"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]"
                    />
                  </div>
                </div>

                {/* Specific Editor Fields per Document */}
                {activeDoc === 'warranty-release' && (
                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                      Warranty Terms &amp; Procedures
                    </span>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">
                        Completed Procedures / Parts
                      </label>
                      <textarea
                        rows={3}
                        value={performedProcedures}
                        onChange={(e) => setPerformedProcedures(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] font-sans text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">
                        Warranty Coverage Scope
                      </label>
                      <textarea
                        rows={4}
                        value={warrantyDetails}
                        onChange={(e) => setWarrantyDetails(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0] focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0] font-sans text-xs"
                      />
                    </div>
                  </div>
                )}

                {activeDoc === 'pre-inspection' && (
                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                      Damage Map &amp; Recommendations
                    </span>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Front Clip / Bumper</label>
                      <input
                        type="text"
                        value={damageNotes.front}
                        onChange={(e) =>
                          setDamageNotes({ ...damageNotes, front: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">Sides &amp; Quarters</label>
                      <input
                        type="text"
                        value={damageNotes.driverSide}
                        onChange={(e) =>
                          setDamageNotes({ ...damageNotes, driverSide: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9A9A9A] block mb-1">
                        Mechanical Recommendations
                      </label>
                      <textarea
                        rows={2}
                        value={mechanicalRecs}
                        onChange={(e) => setMechanicalRecs(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[#161617] border border-white/[0.08] text-[#F2F2F0]"
                      />
                    </div>
                  </div>
                )}

                {activeDoc === 'quotation' && (
                  <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold">
                        Quotation Items ({quotationItems.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddQuotationItem}
                        className="text-xs font-mono text-[#00B8F0] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Item
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {quotationItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-[6px] bg-[#161617] border border-white/[0.08] space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] text-[#9A9A9A]">#{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuotationItem(item.id)}
                              className="text-[#FF5D6C] hover:text-white cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateQuotationItem(item.id, 'description', e.target.value)
                            }
                            className="w-full px-2 py-1 rounded-[4px] bg-[#0F0F10] border border-white/[0.08] text-[#F2F2F0] text-xs"
                          />
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuotationItem(
                                  item.id,
                                  'quantity',
                                  parseFloat(e.target.value) || 1
                                )
                              }
                              className="px-2 py-1 rounded-[4px] bg-[#0F0F10] border border-white/[0.08] text-[#F2F2F0] text-xs font-mono"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleUpdateQuotationItem(
                                  item.id,
                                  'unitPrice',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="px-2 py-1 rounded-[4px] bg-[#0F0F10] border border-white/[0.08] text-[#F2F2F0] text-xs font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between font-bold text-sm text-[#00B8F0] border-t border-white/[0.08]">
                      <span>Total:</span>
                      <span className="font-mono">₱ {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right: The Live Printable A4 Sheet */}
            <div className="flex-1 overflow-y-auto bg-black/40 p-4 sm:p-8 flex justify-center items-start print:p-0 print:bg-white print:overflow-visible">
              
              {/* White Document A4 Page Container */}
              <div
                id="print-sheet-content"
                className="w-full max-w-[800px] bg-white text-slate-950 p-8 sm:p-12 shadow-2xl rounded-sm print:shadow-none print:p-6 print:max-w-none text-xs leading-normal font-sans"
              >
                
                {/* ── Official Company Header ── */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4 gap-4">
                  <div className="space-y-0.5">
                    <h1 className="font-serif font-black text-base sm:text-lg tracking-tight uppercase text-slate-950">
                      Carbon Department Auto Body &amp; Repair Services Co.
                    </h1>
                    <p className="text-[10px] font-mono font-semibold text-slate-700">
                      SEC Registration No. 2022040049759-14 | TIN: 608-592-520-00000
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Address: 009 Felix Ave. Vista Verde, Cainta, Rizal
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Contact: 0948-243-2421 | Email: carbondepartment2.0@gmail.com
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end">
                    <img
                      src="/assets/logo.png"
                      alt="Carbon Department"
                      className="h-12 sm:h-14 w-auto object-contain"
                    />
                    <span className="font-mono text-[9px] text-slate-500 mt-1 uppercase">
                      Job: {job.job_no}
                    </span>
                  </div>
                </div>

                {/* ═════════════════════════════════════════════════════════════
                    DOCUMENT 1: PRE-INSPECTION FORM
                    ═════════════════════════════════════════════════════════════ */}
                {activeDoc === 'pre-inspection' && (
                  <div className="space-y-4">
                    {/* Dark Title Banner */}
                    <div className="bg-slate-900 text-white py-2 px-3 text-center rounded-sm">
                      <h2 className="font-sans font-bold text-sm tracking-wide uppercase">
                        VEHICLE PRE-INSPECTION FORM
                      </h2>
                      <p className="text-[9px] text-slate-300 italic">
                        Documenting vehicle condition prior to service
                      </p>
                    </div>

                    {/* Section 1: General Information */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        1. General Information
                      </div>
                      <table className="w-full border-collapse border border-slate-400 text-[10px]">
                        <tbody>
                          <tr className="border-b border-slate-300">
                            <td className="p-1.5 font-bold w-1/4 bg-slate-50">Customer Name:</td>
                            <td className="p-1.5 w-1/4">{customerName}</td>
                            <td className="p-1.5 font-bold w-1/4 bg-slate-50">Date / Time:</td>
                            <td className="p-1.5 w-1/4 font-mono">{date}</td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="p-1.5 font-bold bg-slate-50">Vehicle Make / Model:</td>
                            <td className="p-1.5">{vehicleModel}</td>
                            <td className="p-1.5 font-bold bg-slate-50">Plate Number:</td>
                            <td className="p-1.5 font-mono font-bold uppercase">{plateNumber}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50">Mileage (Odometer):</td>
                            <td className="p-1.5 font-mono">{odometer} km</td>
                            <td className="p-1.5 font-bold bg-slate-50">Fuel Level:</td>
                            <td className="p-1.5">{fuelLevel}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 2: Body Condition & Damage Map */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        2. Body Condition &amp; Damage Map
                      </div>
                      <div className="border border-t-0 border-slate-400 p-3 space-y-2">
                        <p className="text-[9px] text-slate-600 italic">
                          Mark locations of damage: (S) Scratch, (D) Dent, (C) Crack/Chip, (M) Missing Item, (B) Bent
                        </p>

                        {/* Schematic Grid */}
                        <div className="grid grid-cols-3 gap-2 py-2 text-center text-[10px]">
                          <div className="border border-slate-300 rounded p-2 bg-slate-50">
                            <span className="font-bold block text-[9px] text-slate-700">DRIVER SIDE (F / R)</span>
                            <div className="h-10 flex items-center justify-center font-mono text-[9px] text-slate-500">
                              [ F ── ○ ────────── ○ ── R ]
                            </div>
                            <span className="text-[9px] text-slate-600 block italic">{damageNotes.driverSide}</span>
                          </div>

                          <div className="border border-slate-300 rounded p-2 bg-slate-50">
                            <span className="font-bold block text-[9px] text-slate-700">TOP ROOF &amp; HOOD</span>
                            <div className="h-10 flex items-center justify-center font-mono text-[9px] text-slate-500">
                              [ ── FRONT HOOD ── CABIN ── TRUNK ── ]
                            </div>
                            <span className="text-[9px] text-slate-600 block italic">{damageNotes.top}</span>
                          </div>

                          <div className="border border-slate-300 rounded p-2 bg-slate-50">
                            <span className="font-bold block text-[9px] text-slate-700">PASSENGER SIDE (R / F)</span>
                            <div className="h-10 flex items-center justify-center font-mono text-[9px] text-slate-500">
                              [ R ── ○ ────────── ○ ── F ]
                            </div>
                            <span className="text-[9px] text-slate-600 block italic">{damageNotes.passengerSide}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-1.5 border border-slate-300 rounded bg-slate-50">
                            <strong className="text-[9px]">Front Bumper / Grille: </strong>
                            <span>{damageNotes.front}</span>
                          </div>
                          <div className="p-1.5 border border-slate-300 rounded bg-slate-50">
                            <strong className="text-[9px]">Rear Hatch / Exhaust: </strong>
                            <span>{damageNotes.rear}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Loose Items Check */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        3. Loose Items &amp; Valuables Check
                      </div>
                      <div className="border border-t-0 border-slate-400 p-2.5 grid grid-cols-4 gap-2 text-[10px]">
                        {Object.entries(looseItems).map(([key, checked]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <span
                              className={`w-3.5 h-3.5 border border-slate-400 flex items-center justify-center text-[9px] font-bold ${
                                checked ? 'bg-slate-900 text-white' : 'bg-white'
                              }`}
                            >
                              {checked ? '✓' : ''}
                            </span>
                            <span>{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: Interior & Operational Status */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        4. Interior &amp; Operational Status
                      </div>
                      <table className="w-full border-collapse border border-slate-400 text-[9px]">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-400 text-slate-700">
                            <th className="p-1 text-left">Item Description</th>
                            <th className="p-1 text-center w-24">Status (OK / FAIL / N/A)</th>
                            <th className="p-1 text-left">Observations / Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {operationalStatus.map((op, idx) => (
                            <tr key={idx} className="border-b border-slate-300">
                              <td className="p-1 font-medium">{op.item}</td>
                              <td className="p-1 text-center font-bold font-mono">{op.status}</td>
                              <td className="p-1 text-slate-600">{op.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Section 5: Recommendations */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        5. Mechanical &amp; Electrical Future Recommendations
                      </div>
                      <div className="border border-t-0 border-slate-400 p-2.5 space-y-1.5 text-[9px]">
                        <p>
                          <strong>Mechanical: </strong> {mechanicalRecs}
                        </p>
                        <p>
                          <strong>Electrical: </strong> {electricalRecs}
                        </p>
                        <p>
                          <strong>Other Suggestions: </strong> {otherSuggestions}
                        </p>
                      </div>
                    </div>

                    {/* Section 6: Customer Consent & Signatures */}
                    <div>
                      <div className="bg-slate-200 px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-800 border border-slate-400">
                        6. Customer Consent &amp; Authorization
                      </div>
                      <div className="border border-t-0 border-slate-400 p-3 space-y-4 text-[9px] text-slate-700 leading-relaxed">
                        <p>
                          I hereby acknowledge that the above diagram correctly represents the condition of my vehicle upon turnover. I authorize the repair work as discussed and understand that additional findings (listed in Section 5) may require further approval and separate billing.
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                          <div className="border-t border-slate-800 pt-1 text-center space-y-0.5">
                            <span className="font-bold block uppercase text-[10px]">
                              {customerName}
                            </span>
                            <span className="text-slate-500 text-[8px] block">Customer Signature</span>
                            <span className="font-mono text-[8px] text-slate-600">Date Signed: {date}</span>
                          </div>

                          <div className="border-t border-slate-800 pt-1 text-center space-y-0.5">
                            <span className="font-bold block uppercase text-[10px]">
                              {preparedBy}
                            </span>
                            <span className="text-slate-500 text-[8px] block">
                              Technician / Service Advisor Signature
                            </span>
                            <span className="font-mono text-[8px] text-slate-600">License / ID Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═════════════════════════════════════════════════════════════
                    DOCUMENT 2: VEHICLE RELEASE CONFIRMATION & WARRANTY
                    ═════════════════════════════════════════════════════════════ */}
                {activeDoc === 'warranty-release' && (
                  <div className="space-y-6 pt-2">
                    <div className="text-center space-y-1 pb-2">
                      <h2 className="font-serif font-black text-xl tracking-tight uppercase text-slate-950">
                        Vehicle Release Confirmation
                      </h2>
                      <span className="text-[10px] font-mono tracking-widest text-[#00B8F0] uppercase font-bold block">
                        Official Service Warranty Certificate
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                      <div>
                        <span>Dear </span>
                        <strong className="text-slate-900 font-bold">{customerName}</strong>,
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Plate: {plateNumber} · {vehicleModel}
                        </p>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span>Release Date: </span>
                        <strong>{releaseDate}</strong>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                      <p>
                        We are pleased to inform you that the service requested for your vehicle has been successfully completed in accordance with Carbon Department engineering standards.
                      </p>
                      <p className="font-semibold text-slate-900">
                        The following procedures were performed and/or parts were installed:
                      </p>
                      <div className="p-3.5 rounded bg-slate-50 border border-slate-300 font-mono text-[11px] whitespace-pre-line text-slate-800 leading-normal">
                        {performedProcedures}
                      </div>
                    </div>

                    {/* Warranty Details Block */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-slate-300">
                        <ShieldCheck size={14} className="text-emerald-700" />
                        <h3 className="font-serif font-bold text-xs uppercase text-slate-950">
                          Warranty Details &amp; Operational Guarantee:
                        </h3>
                      </div>

                      <div className="p-3.5 rounded bg-slate-50 border border-slate-300 font-sans text-[10px] whitespace-pre-line text-slate-700 leading-relaxed space-y-1.5">
                        {warrantyDetails}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-100 rounded border border-slate-200 text-[10px] text-slate-700 italic">
                      "By signing below, I acknowledge that I have inspected the vehicle, verified all completed items, and accept it in its current release condition."
                    </div>

                    <div className="text-right text-[11px] italic text-slate-600">
                      Sincerely, Shop Management
                    </div>

                    {/* Signature Blocks */}
                    <div className="grid grid-cols-2 gap-12 pt-8">
                      <div className="border-t-2 border-slate-900 pt-1.5 text-center">
                        <span className="font-bold block uppercase text-xs text-slate-900">
                          {preparedBy}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                          Prepared By (Authorized Representative)
                        </span>
                      </div>

                      <div className="border-t-2 border-slate-900 pt-1.5 text-center">
                        <span className="font-bold block uppercase text-xs text-slate-900">
                          {customerName}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                          Customer Name &amp; Signature
                        </span>
                      </div>
                    </div>

                    {/* Footer Verification Stamp */}
                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-mono">
                      <span>Carbon Department Cainta · Official Form Rev 2026</span>
                      <span>Security PIN Verified · SEC 2022040049759-14</span>
                    </div>
                  </div>
                )}

                {/* ═════════════════════════════════════════════════════════════
                    DOCUMENT 3: VEHICLE REPAIR QUOTATION
                    ═════════════════════════════════════════════════════════════ */}
                {activeDoc === 'quotation' && (
                  <div className="space-y-4">
                    <div className="text-center space-y-0.5 pb-2">
                      <h2 className="font-serif font-black text-lg tracking-tight uppercase text-slate-950">
                        Vehicle Repair Quotation
                      </h2>
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-medium">
                        Official Service Estimate &amp; Statement of Account
                      </span>
                    </div>

                    {/* Info Matrix */}
                    <table className="w-full border-collapse border border-slate-300 text-[10px]">
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td className="p-1.5 font-bold w-1/4 bg-slate-50">Name:</td>
                          <td className="p-1.5 w-1/4">{customerName}</td>
                          <td className="p-1.5 font-bold w-1/4 bg-slate-50">Date:</td>
                          <td className="p-1.5 w-1/4 font-mono">{date}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-1.5 font-bold bg-slate-50">Vehicle &amp; Year Model:</td>
                          <td className="p-1.5">{vehicleModel}</td>
                          <td className="p-1.5 font-bold bg-slate-50">Contact:</td>
                          <td className="p-1.5 font-mono">{customerContact}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-1.5 font-bold bg-slate-50">VIN / Plate No.:</td>
                          <td className="p-1.5 font-mono font-bold uppercase">{plateNumber}</td>
                          <td className="p-1.5 font-bold bg-slate-50">E-mail:</td>
                          <td className="p-1.5">{customerEmail}</td>
                        </tr>
                        <tr>
                          <td className="p-1.5 font-bold bg-slate-50">Mileage:</td>
                          <td className="p-1.5 font-mono">{odometer} km</td>
                          <td className="p-1.5 font-bold bg-slate-50">Job Reference:</td>
                          <td className="p-1.5 font-mono text-slate-700">{job.job_no}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Line Items Table */}
                    <table className="w-full border-collapse border border-slate-400 text-[10px]">
                      <thead>
                        <tr className="bg-slate-200 border-b border-slate-400 text-slate-900 font-bold uppercase text-[9px]">
                          <th className="p-2 text-left border-r border-slate-300">Description</th>
                          <th className="p-2 text-left border-r border-slate-300">Repair Action Taken</th>
                          <th className="p-2 text-center border-r border-slate-300 w-14">Qty</th>
                          <th className="p-2 text-right border-r border-slate-300 w-24">Unit Price</th>
                          <th className="p-2 text-right w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotationItems.map((item, i) => (
                          <tr key={i} className="border-b border-slate-300">
                            <td className="p-2 border-r border-slate-300 font-medium">
                              {item.description}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-slate-600">
                              {item.action}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-center font-mono">
                              {item.quantity}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-right font-mono">
                              ₱ {item.unitPrice.toLocaleString()}
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-slate-950">
                              ₱ {(item.quantity * item.unitPrice).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {/* Empty fill rows to simulate paper aesthetic */}
                        {quotationItems.length < 5 &&
                          Array.from({ length: 5 - quotationItems.length }).map((_, idx) => (
                            <tr key={`fill-${idx}`} className="border-b border-slate-200 h-6">
                              <td className="p-2 border-r border-slate-300">&nbsp;</td>
                              <td className="p-2 border-r border-slate-300">&nbsp;</td>
                              <td className="p-2 border-r border-slate-300">&nbsp;</td>
                              <td className="p-2 border-r border-slate-300">&nbsp;</td>
                              <td className="p-2">&nbsp;</td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100 border-t-2 border-slate-900 font-bold">
                          <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider text-xs">
                            Grand Total:
                          </td>
                          <td className="p-2.5 text-right font-mono text-sm text-slate-950 font-black">
                            ₱ {grandTotal.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Prepared By Footer */}
                    <div className="pt-8 flex justify-between items-end">
                      <div className="text-[9px] text-slate-500 max-w-xs space-y-1">
                        <p>* Quotation is valid for 30 calendar days from issue date.</p>
                        <p>* Official Receipt issued upon complete bay turnover and billing settlement.</p>
                      </div>

                      <div className="w-56 border-t-2 border-slate-900 pt-1.5 text-center">
                        <span className="font-bold block uppercase text-xs text-slate-900">
                          {preparedBy}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                          Prepared By (Authorized Signatory)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
