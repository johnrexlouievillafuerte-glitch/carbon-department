import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Modal, Button, Input, Textarea, Select } from '@carbon/ui';

interface BookingWizardModalProps {
  open: boolean;
  onClose: () => void;
  initialDivision?: string;
  initialService?: string;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  open,
  onClose,
  initialDivision = 'Body & Custom Work',
  initialService = 'Carbon Fiber & Fiberglass Layup',
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State - Starts Empty
  const [division, setDivision] = useState(initialDivision);
  const [serviceRequested, setServiceRequested] = useState(initialService);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [year, setYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ ref: string; pin: string } | null>(null);

  // Synchronize when opening modal
  useEffect(() => {
    if (open) {
      if (initialDivision) setDivision(initialDivision);
      if (initialService) setServiceRequested(initialService);
      setError('');
    }
  }, [open, initialDivision, initialService]);

  // Reset when closed
  const handleModalClose = () => {
    setStep(1);
    setError('');
    setSuccessData(null);
    onClose();
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!division || !serviceRequested) {
      setError('Please choose a division and service.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    if (!customerName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(09|\+639)\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid Philippine mobile number (e.g., 09171234567 or +639171234567).');
      return;
    }
    if (!makeModel.trim()) {
      setError('Please enter your vehicle make and model.');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3 Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) {
      setError('Please select a preferred visit date.');
      return;
    }

    // Check Sunday
    const chosenDay = new Date(preferredDate).getDay();
    if (chosenDay === 0) {
      setError('The workshop is closed on Sundays. Please choose Monday through Saturday.');
      return;
    }

    // Check past date
    const today = new Date().toISOString().split('T')[0];
    if (preferredDate < today) {
      setError('Please choose a future date.');
      return;
    }

    if (!privacyConsent) {
      setError('You must agree to the Data Privacy Notice to submit a request.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          plate_number: plateNumber.trim().toUpperCase(),
          make_model: makeModel.trim(),
          year: year.trim(),
          division,
          service_requested: serviceRequested,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          notes: notes.trim(),
          privacy_consent: privacyConsent,
          _hp: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking request.');
      }

      setSuccessData({ ref: data.ref, pin: data.pin });
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const servicesMap: Record<string, string[]> = {
    'Body & Custom Work': [
      'Carbon Fiber & Fiberglass Layup',
      'Custom Metalwork & Aluminum Shrouds',
      'Collision Repair & Downdraft Paint',
      'Widebody Conversion & Arch Tubbing',
    ],
    'Mechanical & Maintenance': [
      'Basic Service & PMS (50-Point Check)',
      'Engine Work & Diagnostics',
      'Aircon Repair & System Recharge',
      'Underchassis, Bushings & Suspension',
    ],
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title={successData ? 'Visit Request Received' : 'Book a Workshop Visit'}
      wide
    >
      {successData ? (
        /* Success Screen */
        <div className="py-6 space-y-6 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-[6px] bg-[#2DD4A0]/15 text-[#2DD4A0] flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-heading font-semibold text-[#F2F2F0]">
              Slot Request Recorded
            </h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Your visit request has been logged. Our service advisor will call your mobile number to confirm bay availability and intake time.
            </p>
          </div>

          <div className="p-4 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] space-y-3 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">Reference Number:</span>
              <span className="font-mono font-semibold text-[#F2F2F0]">{successData.ref}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">Repair Tracker PIN:</span>
              <span className="font-mono font-semibold text-[#00B8F0] tracking-wider text-sm">
                {successData.pin}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">Requested Date:</span>
              <span className="text-[#F2F2F0]">{preferredDate} ({preferredTime})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9A9A9A]">Service:</span>
              <span className="text-[#F2F2F0]">{serviceRequested}</span>
            </div>
          </div>

          <p className="text-xs text-[#9A9A9A] italic">
            Save your 6-digit PIN. Once your vehicle is admitted to a bay, you can track repair progress online using your plate number and PIN.
          </p>

          <Button
            variant="primary"
            size="md"
            className="w-full text-center justify-center"
            onClick={handleModalClose}
          >
            Done
          </Button>
        </div>
      ) : (
        /* 3-Step Wizard */
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 text-xs">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Vehicle & Contact' },
              { num: 3, label: 'Schedule' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 ${
                  step === s.num
                    ? 'text-[#00B8F0] font-semibold'
                    : step > s.num
                    ? 'text-[#2DD4A0]'
                    : 'text-[#9A9A9A]/60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-mono text-xs font-semibold ${
                    step === s.num
                      ? 'bg-[#00B8F0] text-[#0F0F10]'
                      : step > s.num
                      ? 'bg-[#2DD4A0]/20 text-[#2DD4A0]'
                      : 'bg-[#0F0F10] text-[#9A9A9A]/60 border border-white/[0.08]'
                  }`}
                >
                  {s.num}
                </div>
                <span className="hidden sm:inline font-mono">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C] flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Service */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A] font-semibold block">
                  Select Workshop Division
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {['Body & Custom Work', 'Mechanical & Maintenance'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDivision(d);
                        setServiceRequested(servicesMap[d][0]);
                      }}
                      className={`p-4 rounded-[6px] border text-left transition-colors cursor-pointer ${
                        division === d
                          ? 'bg-[#0F0F10] border-[#00B8F0] text-[#F2F2F0] ring-1 ring-[#00B8F0]'
                          : 'bg-[#0F0F10] border-white/[0.08] text-[#9A9A9A] hover:border-white/[0.2]'
                      }`}
                    >
                      <span className="font-heading font-semibold text-sm text-[#F2F2F0] block">{d}</span>
                      <span className="text-xs text-[#9A9A9A] mt-1 block">
                        {d === 'Body & Custom Work'
                          ? 'Carbon fiber, custom aero, collision & paint'
                          : 'PMS, diagnostics, AC & underchassis'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#9A9A9A] font-semibold block">
                  Requested Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(servicesMap[division] || []).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setServiceRequested(s)}
                      className={`p-3 rounded-[6px] border text-left text-xs transition-colors cursor-pointer ${
                        serviceRequested === s
                          ? 'bg-[#00B8F0]/10 border-[#00B8F0] text-[#00B8F0] font-medium'
                          : 'bg-[#0F0F10] border-white/[0.08] text-[#9A9A9A] hover:text-[#F2F2F0] hover:border-white/[0.2]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" size="md" className="text-center justify-center flex items-center gap-1.5" onClick={handleNextStep1}>
                  <span>Next: Vehicle Details</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle & Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Juan dela Cruz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  label="Philippine Mobile Number *"
                  placeholder="0917-123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="juan@example.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Vehicle Make & Model *"
                    placeholder="e.g. Toyota Fortuner / Subaru WRX"
                    value={makeModel}
                    onChange={(e) => setMakeModel(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Year Model"
                    placeholder="2022"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <Input
                label="Plate Number (Optional)"
                placeholder="e.g. NBC 4821"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="font-mono uppercase"
              />

              <div className="pt-4 flex items-center justify-between">
                <Button variant="secondary" size="md" className="text-center justify-center flex items-center gap-1.5" onClick={() => setStep(1)}>
                  <ArrowLeft size={15} /> <span>Back</span>
                </Button>
                <Button variant="primary" size="md" className="text-center justify-center flex items-center gap-1.5" onClick={handleNextStep2}>
                  <span>Next: Date &amp; Time</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Consent */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field */}
              <input
                type="text"
                name="_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Visit Date (Mon – Sat) *"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
                <Select
                  label="Preferred Time Window *"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  options={[
                    { value: '08:00 AM', label: 'Morning (08:00 AM – 10:00 AM)' },
                    { value: '10:00 AM', label: 'Mid-Day (10:00 AM – 12:00 PM)' },
                    { value: '01:00 PM', label: 'Afternoon (01:00 PM – 03:00 PM)' },
                    { value: '03:00 PM', label: 'Late Afternoon (03:00 PM – 05:00 PM)' },
                  ]}
                />
              </div>

              <Textarea
                label="Special Requests or Vehicle Symptoms (Optional)"
                rows={2}
                placeholder="Describe any particular damage, sounds, custom aero objectives, or questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Data Privacy Act Consent Checkbox */}
              <div className="p-3.5 rounded-[6px] bg-[#0F0F10] border border-white/[0.08] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#9A9A9A] leading-relaxed">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 rounded-[4px] border-white/20 bg-[#161617] text-[#00B8F0] focus:ring-[#00B8F0]"
                  />
                  <span>
                    <strong className="text-[#F2F2F0]">Data Privacy Act Notice (RA 10173): </strong>
                    I consent to Carbon Department collecting and processing my contact and vehicle details solely for scheduling this workshop visit and updating repair records. Your data will never be shared or used for unauthorized marketing.
                  </span>
                </label>
              </div>

              <p className="text-[11px] text-[#9A9A9A] italic">
                * Note: This request books an intake consultation slot. Official job order creation and cost approval happen during physical bay inspection.
              </p>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="text-center justify-center flex items-center gap-1.5"
                  onClick={() => setStep(2)}
                  disabled={loading}
                >
                  <ArrowLeft size={15} /> <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="text-center justify-center"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Confirm Request'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
};
