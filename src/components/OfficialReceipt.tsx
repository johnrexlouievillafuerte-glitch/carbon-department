import React from 'react';
import { Printer } from 'lucide-react';
import type { VehicleRecord } from '../data/documents';

interface OfficialReceiptProps {
  record: VehicleRecord;
  onPrint?: () => void;
}

export const OfficialReceipt: React.FC<OfficialReceiptProps> = ({ record, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const baseRate = record.amount || 3500;
  const laborTotal = Math.round(baseRate * 0.65);
  const materialsTotal = baseRate - laborTotal;

  return (
    <div className="space-y-4">
      {/* On-screen Print Control Bar (Hidden when printed) */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E1017] border border-white/10 no-print">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">Ready-Made Official Repair Receipt</span>
          <span className="text-slate-500 block text-[11px] mt-0.5">
            Standard high-contrast white-paper format matching official workshop documentation.
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="btn-cyan px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Printer size={14} />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* The Printable Official Receipt (White Paper Format matching preview file) */}
      <div
        id="official-receipt-print"
        className="bg-white text-neutral-900 p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-300 max-w-3xl mx-auto font-sans leading-normal text-xs print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-full"
      >
        {/* Receipt Header */}
        <div className="border-b-2 border-neutral-900 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                Carbon Department Auto-Body and Repair Services Co.
              </div>
              <div className="text-[11px] text-neutral-700 font-medium mt-0.5">
                009 Felix Avenue, Vista Verde Executive Village, Cainta, 1900 Rizal
              </div>
              <div className="text-[10px] text-neutral-600 mt-0.5">
                Landline: (02) 8655-0842 • Mobile: +63 917 882 1923 • Business Hours: Mon–Sat 8:00 AM – 6:00 PM
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                Non-VAT Reg. TIN: 421-890-123-000 • Mayor&apos;s Permit: 2026-08192 • DTI Reg. No. 04829103
              </div>
            </div>

            <div className="sm:text-right shrink-0 border sm:border-none border-neutral-200 p-2 sm:p-0 rounded bg-neutral-50 sm:bg-transparent">
              <div className="inline-block px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-bold tracking-wider uppercase mb-1">
                Official Repair Receipt
              </div>
              <div className="text-sm font-black font-mono text-neutral-900 block">
                {record.jobOrderNo}
              </div>
              <div className="text-[10px] text-neutral-600">
                Date: <strong className="text-neutral-900 font-mono">{record.dateReceived}</strong>
              </div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">
                {record.isPaid ? 'Payment Received: Paid' : 'Status: Official Bill / JO'}
              </div>
            </div>
          </div>
        </div>

        {/* Client & Vehicle Particulars (2-Box Bordered Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Customer Particulars */}
          <div className="border border-neutral-300 rounded p-3 bg-neutral-50/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pb-1.5 border-b border-neutral-200">
              Customer Information
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Full Name:</span>
                <span className="font-bold text-neutral-900">{record.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact Number:</span>
                <span className="font-medium text-neutral-800 font-mono">{record.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Billing Address:</span>
                <span className="text-neutral-700 truncate max-w-[180px]">{record.address}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Particulars */}
          <div className="border border-neutral-300 rounded p-3 bg-neutral-50/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pb-1.5 border-b border-neutral-200">
              Vehicle Particulars
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Plate Number:</span>
                <span className="font-bold font-mono text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded">
                  {record.plateNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Make &amp; Model:</span>
                <span className="font-bold text-neutral-900">{record.vehicleMakeModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Color / Year:</span>
                <span className="text-neutral-700">{record.vehicleColor} ({record.vehicleYear})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Chassis / VIN:</span>
                <span className="font-mono text-[10px] text-neutral-600">{record.chassisNumber || record.vin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stated Issue & Intake Damage Disclosure (2 columns) */}
        <div className="border border-neutral-300 rounded p-3 mb-4 bg-neutral-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Customer Stated Issue / Service Scope
              </span>
              <p className="text-neutral-800 leading-relaxed text-[11px]">
                {record.specificConcern}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Pre-Inspection Intake Condition (Shop Walkaround)
              </span>
              <p className="text-neutral-700 leading-relaxed text-[11px] italic bg-amber-50/60 p-2 rounded border border-amber-200">
                {record.preInspectionNotes || 'No pre-existing exterior damage recorded at intake inspection.'}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Table of Operations and Charges (Exact layout of preview file) */}
        <div className="border border-neutral-300 rounded overflow-hidden mb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-white text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3">Item / Service Description</th>
                <th className="py-2 px-2 text-center w-24">Type</th>
                <th className="py-2 px-3 text-right w-28">Amount (PHP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-[11px]">
              <tr>
                <td className="py-2 px-3">
                  <span className="font-semibold text-neutral-900 block">
                    Comprehensive Multi-Point Diagnostic Inspection
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Automotive scan, structural check, and preliminary bay inspection
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-neutral-600">Inspection</td>
                <td className="py-2 px-3 text-right font-mono text-neutral-800">Included</td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span className="font-semibold text-neutral-900 block">
                    {record.serviceCategory} Workshop Labor &amp; Specialist Service
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Certified technician labor for stated scope of work
                    {record.tasks && record.tasks.length > 0 && ` (${record.tasks.map(t => t.task).join(', ')})`}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-neutral-600">Labor</td>
                <td className="py-2 px-3 text-right font-mono font-medium text-neutral-900">
                  ₱{laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">
                  <span className="font-semibold text-neutral-900 block">
                    Consumable Workshop Supplies &amp; Specialized Chemical Materials
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Solvents, primers, adhesives, and workshop shop sundries
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-neutral-600">Materials</td>
                <td className="py-2 px-3 text-right font-mono font-medium text-neutral-900">
                  ₱{materialsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-900 bg-neutral-50 font-medium">
                <td colSpan={2} className="py-2.5 px-3 text-right text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                  Total Settlement Due:
                </td>
                <td className="py-2.5 px-3 text-right font-black font-mono text-sm text-neutral-900">
                  ₱{baseRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Warranty Terms (Matching preview file) */}
        <div className="border border-neutral-200 rounded p-2.5 mb-4 text-[10px] text-neutral-600 space-y-0.5 bg-neutral-50/30">
          <span className="font-bold text-neutral-700 uppercase tracking-wider block">Warranty &amp; Terms:</span>
          <p>1. Workmanship is warranted for thirty (30) calendar days from vehicle release date.</p>
          <p>2. Carbon Department composite fabrication carries a 1-year structural warranty against de-lamination under normal operating conditions.</p>
          <p>3. Carbon Department is not liable for personal valuables left in the vehicle during service.</p>
        </div>

        {/* Tri-Signature Sign-Off Block (Matching preview file with font-serif simulated signatures) */}
        <div className="pt-4 border-t-2 border-neutral-900 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="h-9 border-b border-neutral-400 flex items-end justify-center font-serif text-[11px] text-neutral-800 pb-0.5">
              {record.adminInCharge || 'Service Advisor'}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-600 mt-1">Service Management</div>
            <div className="text-[8px] text-neutral-500">Diagnostic Advisor</div>
          </div>
          <div>
            <div className="h-9 border-b border-neutral-400 flex items-end justify-center font-serif text-[11px] text-neutral-800 pb-0.5">
              {record.mechanicAssigned || 'Lead Mechanical Technician'}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-600 mt-1">Certified Lead Technician</div>
            <div className="text-[8px] text-neutral-500">Quality Inspection</div>
          </div>
          <div>
            <div className="h-9 border-b border-neutral-400 flex items-end justify-center font-serif text-[11px] text-neutral-800 pb-0.5">
              {record.customerName}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-600 mt-1">Customer Acceptance</div>
            <div className="text-[8px] text-neutral-500">Release &amp; Settlement Sign-Off</div>
          </div>
        </div>

      </div>
    </div>
  );
};
