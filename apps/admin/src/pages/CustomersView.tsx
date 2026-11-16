import React, { useState } from 'react';
import { Users, Plus, Phone, Mail, MapPin } from 'lucide-react';
import { Button, Input, Modal, EmptyState } from '@carbon/ui';
import { api } from '../api';
import type { Customer, Vehicle, JobOrder } from '@carbon/ui';

interface CustomersViewProps {
  customers: Customer[];
  vehicles: Vehicle[];
  jobOrders: JobOrder[];
  onRefresh: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  vehicles,
  jobOrders,
  onRefresh,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone number are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      });
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setOpenAdd(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create customer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Customer Directory
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Client contacts, linked registered vehicles, and permanent repair order histories.
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={() => setOpenAdd(true)}>
          <Plus size={15} /> <span>Add New Client</span>
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={Users}
            title="No customers yet. Client profiles are created during intake or added here."
            action="Add New Client"
            onAction={() => setOpenAdd(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => {
            const linkedVehicles = vehicles.filter((v) => v.customer_id === c.id);
            const linkedJobs = jobOrders.filter((j) => j.customer_id === c.id);

            return (
              <div
                key={c.id}
                className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-heading font-semibold text-[#F2F2F0]">{c.name}</h3>
                    <span className="text-[10px] text-[#9A9A9A] font-mono">
                      Member since {c.created_at?.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#9A9A9A]">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#00B8F0]" />
                      <span className="font-mono text-[#F2F2F0]">{c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-[#00B8F0]" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#00B8F0]" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#9A9A9A]">
                  <span>{linkedVehicles.length} {linkedVehicles.length === 1 ? 'Vehicle' : 'Vehicles'}</span>
                  <span>{linkedJobs.length} {linkedJobs.length === 1 ? 'Job Order' : 'Job Orders'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Register Customer Profile">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
              {error}
            </div>
          )}

          <Input
            label="Full Name *"
            placeholder="e.g. Maria Clara Santos"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Mobile Number (PH) *"
            placeholder="0917-000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="client@email.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Address / Subdivision"
            placeholder="Vista Verde Executive Village, Cainta"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
            <Button type="button" variant="secondary" size="md" className="text-center justify-center" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
              {loading ? 'Saving...' : 'Register Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
