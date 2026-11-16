import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '@carbon/ui';
import { api } from '../api';
import type { Customer, Vehicle } from '@carbon/ui';

interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  vehicles: Vehicle[];
  onJobCreated: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  open,
  onClose,
  customers,
  vehicles,
  onJobCreated,
}) => {
  // Existing or New entity mode
  const [customerMode, setCustomerMode] = useState<'new' | 'existing'>('new');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // New Customer Fields
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // New Vehicle Fields
  const [vehPlate, setVehPlate] = useState('');
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehYear, setVehYear] = useState('');
  const [vehColor, setVehColor] = useState('');

  // Job Details
  const [division, setDivision] = useState<'Body & Custom Work' | 'Mechanical & Maintenance'>(
    'Body & Custom Work'
  );
  const [services, setServices] = useState<string>('Carbon Fiber & Fiberglass Layup');
  const [customerConcern, setCustomerConcern] = useState('');
  const [assignedTechs, setAssignedTechs] = useState('Ramjay Anor');
  const [estimatedRelease, setEstimatedRelease] = useState('');
  const [odometer, setOdometer] = useState('42,500');
  const [fuelLevel, setFuelLevel] = useState('3/4 Full');
  const [initialQuotation, setInitialQuotation] = useState('25,000');
  const [intakeNotes, setIntakeNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let custId = selectedCustomerId;
      let vehId = selectedVehicleId;

      // Create new customer if needed
      if (customerMode === 'new') {
        if (!custName.trim() || !custPhone.trim()) {
          throw new Error('Customer full name and mobile number are required.');
        }
        if (!vehPlate.trim() || !vehMake.trim() || !vehModel.trim()) {
          throw new Error('Vehicle plate number, make, and model are required.');
        }

        const newCust = await api.createCustomer({
          name: custName.trim(),
          phone: custPhone.trim(),
          email: custEmail.trim(),
          address: custAddress.trim(),
        });
        custId = newCust.id;

        const newVeh = await api.createVehicle({
          customer_id: custId,
          plate_number: vehPlate.trim().toUpperCase(),
          make: vehMake.trim(),
          model: vehModel.trim(),
          year: vehYear.trim(),
          color: vehColor.trim(),
        });
        vehId = newVeh.id;
      } else {
        if (!custId) throw new Error('Please select a customer.');
        if (!vehId) throw new Error('Please select a vehicle.');
      }

      // Create Job Order
      await api.createJobOrder({
        customer_id: custId,
        vehicle_id: vehId,
        division,
        services: [services],
        customer_concern: customerConcern.trim() || services,
        assigned_technicians: [assignedTechs],
        intake_checklist: {
          exteriorBodyInspected: true,
          fluidsVerified: true,
          odometerRecorded: true,
          odometerReading: odometer.trim(),
          fuelLevel,
          estimatedCost: initialQuotation.trim(),
        },
        intake_notes: intakeNotes.trim()
          ? `${intakeNotes.trim()} [Mileage: ${odometer} km | Fuel: ${fuelLevel} | Est: ₱${initialQuotation}]`
          : `Mileage: ${odometer} km | Fuel: ${fuelLevel} | Initial Est: ₱${initialQuotation}`,
        estimated_release: estimatedRelease,
      });

      onJobCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create job order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Automotive Job Order"
      wide
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <span className="text-xs font-mono text-[#9A9A9A] order-2 sm:order-1 text-center sm:text-left">
            Records are permanently archived and never discarded.
          </span>
          <div className="flex items-center gap-2.5 order-1 sm:order-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="text-center justify-center flex-1 sm:flex-initial"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-job-order-form"
              variant="primary"
              size="md"
              className="text-center justify-center flex-1 sm:flex-initial"
              disabled={loading}
            >
              {loading ? 'Creating Record...' : 'Create Job Order'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="create-job-order-form" onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
            {error}
          </div>
        )}

        {/* Customer & Vehicle Source Switcher */}
        <div className="flex gap-2 p-1 rounded-[6px] bg-[#0F0F10] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setCustomerMode('new')}
            className={`flex-1 py-2 px-3 rounded-[4px] text-xs font-medium cursor-pointer transition-colors text-center flex items-center justify-center ${
              customerMode === 'new'
                ? 'bg-[#161617] text-[#00B8F0] border border-white/[0.08] font-semibold'
                : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
            }`}
          >
            New Customer &amp; Vehicle Intake
          </button>
          <button
            type="button"
            onClick={() => setCustomerMode('existing')}
            className={`flex-1 py-2 px-3 rounded-[4px] text-xs font-medium cursor-pointer transition-colors text-center flex items-center justify-center ${
              customerMode === 'existing'
                ? 'bg-[#161617] text-[#00B8F0] border border-white/[0.08] font-semibold'
                : 'text-[#9A9A9A] hover:text-[#F2F2F0]'
            }`}
          >
            Existing Client Directory
          </button>
        </div>

        {customerMode === 'new' ? (
          <div className="space-y-5">
            {/* 1. Customer Information */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                1. Customer Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Customer Full Name *"
                  placeholder="e.g. Atty. Ramon Arceo"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                />
                <Input
                  label="Philippine Mobile Number *"
                  placeholder="0917-123-4567"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="client@domain.ph"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                />
                <Input
                  label="Address / Village"
                  placeholder="Vista Verde Executive Village, Cainta"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                />
              </div>
            </div>

            {/* 2. Vehicle Specifications */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
                2. Vehicle Specifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Input
                  label="Plate Number *"
                  placeholder="e.g. NBC 4821"
                  value={vehPlate}
                  onChange={(e) => setVehPlate(e.target.value)}
                  className="font-mono uppercase"
                />
                <Input
                  label="Vehicle Make *"
                  placeholder="e.g. Subaru / Toyota"
                  value={vehMake}
                  onChange={(e) => setVehMake(e.target.value)}
                />
                <Input
                  label="Model *"
                  placeholder="e.g. WRX STi / Fortuner"
                  value={vehModel}
                  onChange={(e) => setVehModel(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Year Model"
                  placeholder="2022"
                  value={vehYear}
                  onChange={(e) => setVehYear(e.target.value)}
                />
                <Input
                  label="Color / Finish"
                  placeholder="Crystal White Pearl"
                  value={vehColor}
                  onChange={(e) => setVehColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Existing Customer *"
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const firstVeh = vehicles.find((v) => v.customer_id === e.target.value);
                if (firstVeh) setSelectedVehicleId(firstVeh.id);
              }}
              options={[
                { value: '', label: '-- Choose Client --' },
                ...customers.map((c) => ({ value: c.id, label: `${c.name} (${c.phone})` })),
              ]}
            />
            <Select
              label="Select Registered Vehicle *"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              options={[
                { value: '', label: '-- Choose Vehicle --' },
                ...vehicles
                  .filter((v) => !selectedCustomerId || v.customer_id === selectedCustomerId)
                  .map((v) => ({
                    value: v.id,
                    label: `${v.plate_number} — ${v.year} ${v.make} ${v.model}`,
                  })),
              ]}
            />
          </div>
        )}

        {/* 3. Job Scope & Division */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
            3. Workshop Scope &amp; Assignment
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Workshop Division *"
              value={division}
              onChange={(e) => setDivision(e.target.value as any)}
              options={[
                { value: 'Body & Custom Work', label: 'Body & Custom Work' },
                { value: 'Mechanical & Maintenance', label: 'Mechanical & Maintenance' },
              ]}
            />
            <Input
              label="Primary Service / Scope *"
              placeholder="e.g. Widebody Arch Tubbing or PMS 50-Point"
              value={services}
              onChange={(e) => setServices(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Assigned Lead Technician"
              placeholder="e.g. Ramjay Anor / Arman Boadilla"
              value={assignedTechs}
              onChange={(e) => setAssignedTechs(e.target.value)}
            />
            <Input
              label="Target Release Date"
              type="date"
              value={estimatedRelease}
              onChange={(e) => setEstimatedRelease(e.target.value)}
            />
          </div>
        </div>

        {/* 4. Pre-Inspection & Quotation Parameters */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          <span className="text-xs uppercase font-mono tracking-wider text-[#00B8F0] font-semibold block">
            4. Initial Inspection &amp; Estimate Parameters
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Odometer (km)"
              placeholder="42,500"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="font-mono"
            />
            <Select
              label="Fuel Level"
              value={fuelLevel}
              onChange={(e) => setFuelLevel(e.target.value)}
              options={[
                { value: 'Empty', label: 'E (Empty)' },
                { value: '1/4 Full', label: '1/4 Full' },
                { value: '1/2 Full', label: '1/2 (Half)' },
                { value: '3/4 Full', label: '3/4 Full' },
                { value: 'Full Tank', label: 'F (Full Tank)' },
              ]}
            />
            <Input
              label="Initial Estimate (₱)"
              placeholder="25,000"
              value={initialQuotation}
              onChange={(e) => setInitialQuotation(e.target.value)}
              className="font-mono"
            />
          </div>

          <Textarea
            label="Customer Stated Concern / Intake Notes"
            rows={2}
            placeholder="Document pre-repair scratches, stone chips, customer request..."
            value={intakeNotes}
            onChange={(e) => setIntakeNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
