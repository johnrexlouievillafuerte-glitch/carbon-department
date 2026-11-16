import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { StatusBadge, Button, EmptyState } from '@carbon/ui';
import { api } from '../api';
import type { Booking } from '@carbon/ui';

interface BookingsViewProps {
  bookings: Booking[];
  onRefresh: () => void;
  onConvertBooking: (booking: Booking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onRefresh,
  onConvertBooking,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.updateBookingStatus(id, status);
      onRefresh();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
          Consultation &amp; Visit Slot Requests
        </h2>
        <p className="text-xs text-[#9A9A9A]">
          Submitted through the public website. Review, confirm bay availability, or convert directly into a formal job order.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={Calendar}
            title="No bookings yet. Requests submitted from the public site will appear here."
          />
        </div>
      ) : (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0F10] text-[#9A9A9A] font-mono">
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Vehicle / Plate</th>
                  <th className="p-4 font-medium">Requested Service</th>
                  <th className="p-4 font-medium">Preferred Schedule</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-[#F2F2F0] block">{b.customer_name}</span>
                      <span className="text-[10px] text-[#9A9A9A] font-mono">
                        PIN: {b.pin}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[#F2F2F0]">{b.phone}</td>
                    <td className="p-4">
                      <span className="text-[#F2F2F0] block">
                        {b.year} {b.make_model}
                      </span>
                      <span className="text-[11px] font-mono text-[#00B8F0] font-semibold">
                        {b.plate_number || 'No plate noted'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[#00B8F0] block font-medium">{b.division}</span>
                      <span className="text-[#9A9A9A] block truncate max-w-xs">
                        {b.service_requested}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[#F2F2F0] block">{b.preferred_date}</span>
                      <span className="text-[11px] text-[#9A9A9A] block">{b.preferred_time}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(b.id, 'Approved')}
                              disabled={updatingId === b.id}
                              className="px-2.5 py-1 rounded-[4px] bg-[#2DD4A0]/15 text-[#2DD4A0] hover:bg-[#2DD4A0]/25 text-[11px] font-semibold cursor-pointer text-center inline-flex items-center justify-center"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(b.id, 'Declined')}
                              disabled={updatingId === b.id}
                              className="px-2.5 py-1 rounded-[4px] bg-[#FF5D6C]/15 text-[#FF5D6C] hover:bg-[#FF5D6C]/25 text-[11px] font-semibold cursor-pointer text-center inline-flex items-center justify-center"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-center justify-center whitespace-nowrap"
                          onClick={() => onConvertBooking(b)}
                        >
                          Convert to Job
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
