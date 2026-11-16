import React from 'react';
import { 
  CheckCircle, 
  X, 
  MessageSquare, 
  Download, 
  ShieldCheck, 
} from 'lucide-react';

interface BookingSuccessModalProps {
  bookingData: any;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ 
  bookingData, 
  onClose 
}) => {
  if (!bookingData) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Carbon-Department! I've booked an intake for my ${bookingData.vehicle}.\n\nReference: ${bookingData.referenceId}\nServices: ${bookingData.services.join(', ')}\nDate: ${bookingData.date} (${bookingData.timeSlot})\nEstimated: $${bookingData.totalEstimate}\n\nPlease confirm bay availability.`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#12131C] border border-cyan-400/50 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Top Celebration Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-xl shadow-cyan-500/25 mb-1">
            <CheckCircle size={32} />
          </div>
          <div className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider">
            Bay Reservation Confirmed
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Studio Intake Reserved
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Your high-gloss service request has been queued in our master workshop registry.
          </p>
          <div className="inline-block bg-[#0A0A0C] px-4 py-1.5 rounded-xl border border-white/10 text-xs text-cyan-300 mt-2">
            Reference ID: <strong className="text-white mono-spec">{bookingData.referenceId}</strong>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="py-6 space-y-3">
          <div className="bg-[#0A0A0C] p-4 rounded-xl border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Vehicle:</span>
              <span className="text-white font-bold">{bookingData.vehicle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Intake Schedule:</span>
              <span className="text-slate-200">{bookingData.date} • {bookingData.timeSlot.split(' ')[0]} {bookingData.timeSlot.split(' ')[1]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Studio Bay:</span>
              <span className="text-cyan-400 font-medium">{bookingData.bayChoice}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm">
              <span className="text-slate-400">Estimated Total:</span>
              <span className="text-[#00F0FF] font-extrabold">
                ${bookingData.totalEstimate.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#00F0FF] shrink-0" />
            <span>A studio manager will review clear-coat depth specs and send your concierge check-in packet via WhatsApp or SMS.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <a
            href={`https://wa.me/18005552272?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <MessageSquare size={16} />
            <span>Instant Chat on WhatsApp with Booking Reference</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="btn-primary-cyan py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Done</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
