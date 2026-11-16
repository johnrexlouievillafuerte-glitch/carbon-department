import React, { useState } from 'react';
import { Car, Plus } from 'lucide-react';
import { PlateBadge, Button, Input, Select, Modal, EmptyState } from '@carbon/ui';
import { api } from '../api';
import type { Vehicle, Customer, JobOrder } from '@carbon/ui';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  customers: Customer[];
  jobOrders: JobOrder[];
  onRefresh: () => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  customers,
  jobOrders,
  onRefresh,
}) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !plateNumber.trim() || !make.trim() || !model.trim()) {
      setError('Please choose a customer and provide plate number, make, and model.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createVehicle({
        customer_id: customerId,
        plate_number: plateNumber.trim().toUpperCase(),
        make: make.trim(),
        model: model.trim(),
        year: year.trim(),
        color: color.trim(),
        vin: vin.trim(),
      });
      setCustomerId('');
      setPlateNumber('');
      setMake('');
      setModel('');
      setYear('');
      setColor('');
      setVin('');
      setOpenAdd(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to register vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Philippine Motor Vehicle Registry
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            All admitted client vehicles with permanent service records and chassis identifiers.
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={() => setOpenAdd(true)}>
          <Plus size={15} /> <span>Add Vehicle</span>
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={Car}
            title="No registered vehicles yet. Vehicles are registered during intake or added here."
            action="Add Vehicle"
            onAction={() => setOpenAdd(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const owner = customers.find((c) => c.id === v.customer_id);
            const history = jobOrders.filter((j) => j.vehicle_id === v.id);

            return (
              <div
                key={v.id}
                className="bg-[#161617] border border-white/[0.08] rounded-[8px] p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <PlateBadge plate={v.plate_number} />
                    <span className="text-[11px] text-[#9A9A9A] font-mono">
                      {v.year} Model
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-heading font-semibold text-[#F2F2F0]">
                      {v.make} {v.model}
                    </h3>
                    <p className="text-xs text-[#9A9A9A] mt-0.5">
                      Finish: {v.color || 'Standard Finish'}
                    </p>
                  </div>

                  <div className="p-3 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] text-xs space-y-1">
                    <span className="text-[#9A9A9A] block text-[10px] uppercase font-mono">
                      Registered Owner
                    </span>
                    <span className="font-medium text-[#F2F2F0] block">
                      {owner ? owner.name : 'Unknown Owner'}
                    </span>
                    <span className="text-[11px] text-[#00B8F0] font-mono">
                      {owner?.phone}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#9A9A9A]">
                  <span>{history.length} {history.length === 1 ? 'Service Order' : 'Service Orders'}</span>
                  <span className="text-[#00B8F0] font-medium">Active Record</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="Register Vehicle to Fleet">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
              {error}
            </div>
          )}

          <Select
            label="Registered Customer Owner *"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            options={[
              { value: '', label: '-- Choose Owner --' },
              ...customers.map((c) => ({ value: c.id, label: `${c.name} (${c.phone})` })),
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Plate Number *"
              placeholder="e.g. NBC 4821"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="font-mono uppercase"
            />
            <Input
              label="Make *"
              placeholder="e.g. Subaru"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
            <Input
              label="Model *"
              placeholder="e.g. WRX STi"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Year Model"
              placeholder="2022"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Input
              label="Color / Coating"
              placeholder="e.g. Pure Red"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <Input
            label="Chassis VIN / Serial (Optional)"
            placeholder="e.g. VAB-019283"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className="font-mono text-xs uppercase"
          />

          <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
            <Button type="button" variant="secondary" size="md" className="text-center justify-center" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
              {loading ? 'Registering...' : 'Register Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
