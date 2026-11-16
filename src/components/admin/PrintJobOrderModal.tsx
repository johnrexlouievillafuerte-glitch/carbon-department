import React from 'react';
import { X, Printer } from 'lucide-react';
import type { JobOrder, Customer, Vehicle } from '../../data/carbonStore';

interface PrintJobOrderModalProps {
  job: JobOrder | null;
  customer?: Customer;
  vehicle?: Vehicle;
  onClose: () => void;
}

export const PrintJobOrderModal: React.FC<PrintJobOrderModalProps> = ({
  job,
  customer,
  vehicle,
  onClose,
}) => {
  if (!job) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-[#172B57] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm">
              Official Job Order Print Preview — {job.jobNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg btn-amber text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto font-sans space-y-6 text-xs text-slate-900 bg-white leading-relaxed">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-xl font-bold font-serif tracking-tight text-slate-950 uppercase">
                Carbon Department Auto Body &amp; Repair Services Co.
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">
                009 Felix Ave., Vista Verde Executive Village, San Isidro, Cainta, Rizal
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Phone: 0948-243-2421 · Email: carbondepartment2.0@gmail.com
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Mayor's Permit No: 2026-06150 · TIN: 606-592-520-00000
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block text-xs font-mono font-bold px-3 py-1 bg-slate-900 text-white rounded">
                JOB ORDER: {job.jobNo}
              </span>
              <p className="text-[11px] font-mono text-slate-600 block">
                Date: {job.dateReceived}
              </p>
              <p className="text-[10px] text-slate-500 font-mono block">
                Est. Release: {job.estimatedRelease}
              </p>
            </div>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 rounded bg-slate-50/50">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Customer Details
              </span>
              <p className="font-bold text-sm text-slate-900">{customer?.name || 'Walk-in Client'}</p>
              <p className="text-slate-600">{customer?.phone}</p>
              <p className="text-slate-600">{customer?.address}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Vehicle Specifications
              </span>
              <p className="font-bold text-sm text-slate-900 font-mono">
                PLATE: {vehicle?.plateNumber}
              </p>
              <p className="text-slate-700">
                {vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.color})
              </p>
              <p className="text-[10px] font-mono text-slate-500">
                VIN: {vehicle?.vin} · Chassis: {vehicle?.chassisNumber}
              </p>
            </div>
          </div>

          {/* Division & Scope */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-slate-300 pb-1">
              <span className="font-bold text-xs uppercase text-slate-900">
                Authorized Scope of Work ({job.division})
              </span>
              <span className="text-[11px] font-mono text-slate-600">
                Status: {job.stage} ({job.progressPercent}%)
              </span>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-slate-800">
              {job.services.map((s, idx) => (
                <li key={idx} className="font-medium">
                  {s}
                </li>
              ))}
            </ul>

            <div className="p-3 bg-slate-100 rounded text-slate-700 text-[11px] mt-2">
              <strong className="block text-slate-900">Customer Stated Concern:</strong>
              {job.customerConcern}
            </div>
          </div>

          {/* Pre-Inspection Checklist Summary */}
          <div className="space-y-2">
            <span className="font-bold text-xs uppercase text-slate-900 block border-b border-slate-300 pb-1">
              Intake Walkaround &amp; Pre-Inspection Record
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div>✓ Exterior body condition verified at bay intake</div>
              <div>✓ Pre-existing scratches/scuffs documented with owner</div>
              <div>✓ Engine oil &amp; fluid levels inspected</div>
              <div>✓ Fuel Level: Quarter {job.intakeChecklist?.fuelLevelQuarter || 3} of 4</div>
            </div>

            <p className="text-[11px] text-slate-600 italic bg-amber-50/60 p-2 border border-amber-200 rounded">
              Walkaround Note: {job.intakeNotes}
            </p>
          </div>

          {/* Assigned Technicians */}
          <div className="text-[11px] text-slate-700">
            <strong>Assigned Technical Leads:</strong> {job.assignedTechnicians.join(', ')}
          </div>

          {/* Legal Retention Guarantee Notice */}
          <div className="p-3 bg-slate-100 border-l-4 border-slate-700 rounded text-[10px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">
              PERMANENT RECORD RETENTION &amp; PRIVACY GUARANTEE:
            </p>
            <p>
              In compliance with Republic Act No. 10173 (Data Privacy Act of 2012) and shop standard operating procedures, this digital job order, attached intake condition photographs, and repair progress logs are preserved permanently in the shop's encrypted archives. Archived records are never discarded after 3 months.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="space-y-6">
              <div className="border-b border-slate-400 pb-1 h-8" />
              <p className="font-bold text-slate-900">Customer Signature / Authorization</p>
              <p className="text-[10px] text-slate-500">{customer?.name}</p>
            </div>

            <div className="space-y-6">
              <div className="border-b border-slate-400 pb-1 h-8" />
              <p className="font-bold text-slate-900">Service Advisor / Technical Operations</p>
              <p className="text-[10px] text-slate-500">Carbon Department Cainta Facility</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
