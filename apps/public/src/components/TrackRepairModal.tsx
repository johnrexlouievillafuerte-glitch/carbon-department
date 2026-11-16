import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Input, StageBadge, ProgressRing } from '@carbon/ui';

interface TrackRepairModalProps {
  open: boolean;
  onClose: () => void;
  prefillPlate?: string;
  prefillJobNo?: string;
  prefillPin?: string;
}

interface TrackingResult {
  stage: string;
  progress: number;
  estimated_release: string;
  date_received: string;
}

export const TrackRepairModal: React.FC<TrackRepairModalProps> = ({
  open,
  onClose,
  prefillPlate = '',
  prefillJobNo = '',
  prefillPin = '',
}) => {
  const [plate, setPlate] = useState(prefillPlate);
  const [jobNo, setJobNo] = useState(prefillJobNo);
  const [pin, setPin] = useState(prefillPin);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);

  useEffect(() => {
    if (prefillPlate) setPlate(prefillPlate);
    if (prefillJobNo) setJobNo(prefillJobNo);
    if (prefillPin) setPin(prefillPin);
  }, [prefillPlate, prefillJobNo, prefillPin]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim() || !jobNo.trim() || !pin.trim()) {
      setError('Please provide all three: Plate Number, Job Order Number, and 6-digit PIN.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/public/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate_number: plate.trim().toUpperCase(),
          job_no: jobNo.trim().toUpperCase(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No matching active repair found.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'No matching record found. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const stagesList = [
    'Received',
    'Pre-Inspection',
    'Estimate/Approval',
    'In Repair',
    'Finishing/Paint',
    'Final Assessment',
    'Ready for Release',
  ];

  return (
    <Modal open={open} onClose={onClose} title="Customer Repair Tracker" wide>
      <div className="space-y-6">
        {/* Lookup Form */}
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Plate Number *"
              placeholder="e.g. NBC 4821"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="font-mono uppercase"
            />
            <Input
              label="Job Order Number *"
              placeholder="e.g. CD-2026-0001"
              value={jobNo}
              onChange={(e) => setJobNo(e.target.value)}
              className="font-mono uppercase"
            />
            <Input
              label="6-Digit SMS PIN *"
              type="password"
              placeholder="••••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-[#9A9A9A] font-body">
              Your PIN is provided on your physical intake sheet or via confirmation SMS.
            </span>
            <Button type="submit" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
              {loading ? 'Searching...' : 'Track Repair'}
            </Button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C] flex items-center gap-2.5">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="p-6 rounded-[8px] bg-[#0F0F10] border border-white/[0.08] space-y-6">
            {/* Header with Stage Badge & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <span className="text-xs text-[#9A9A9A] block font-mono">
                  Vehicle Status ({plate.toUpperCase()})
                </span>
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-heading font-semibold text-[#F2F2F0]">
                    {result.stage}
                  </h4>
                  <StageBadge stage={result.stage} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ProgressRing percent={result.progress} size={48} />
              </div>
            </div>

            {/* 7-Stage Pipeline */}
            <div className="space-y-2">
              <span className="text-xs text-[#9A9A9A] font-mono uppercase tracking-wider block">
                Repair Milestone Progress
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-1">
                {stagesList.map((stg, i) => {
                  const currentIdx = stagesList.indexOf(result.stage);
                  const isDone = i < currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div
                      key={stg}
                      className={`p-2.5 rounded-[6px] border text-center transition-all ${
                        isCurrent
                          ? 'bg-[#00B8F0]/10 border-[#00B8F0] text-[#00B8F0] font-medium'
                          : isDone
                          ? 'bg-[#2DD4A0]/10 border-[#2DD4A0]/30 text-[#2DD4A0]'
                          : 'bg-[#161617] border-white/[0.08] text-[#9A9A9A]/50'
                      }`}
                    >
                      <span className="text-[10px] font-mono block">0{i + 1}</span>
                      <span className="text-xs font-medium block truncate mt-0.5">
                        {stg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-[6px] bg-[#161617] border border-white/[0.08] space-y-1">
                <span className="text-[#9A9A9A] block font-mono">Date Received at Bay:</span>
                <span className="font-mono text-[#F2F2F0] font-medium block">
                  {result.date_received || 'In Workshop'}
                </span>
              </div>
              <div className="p-3.5 rounded-[6px] bg-[#161617] border border-white/[0.08] space-y-1">
                <span className="text-[#9A9A9A] block font-mono">Estimated Target Release:</span>
                <span className="font-mono text-[#00B8F0] font-medium block">
                  {result.estimated_release || 'Under Active Inspection'}
                </span>
              </div>
            </div>

            {/* Warranty Certificate Action */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161617] p-4 rounded-[6px]">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 size={16} className="text-[#2DD4A0] shrink-0" />
                <div>
                  <span className="font-medium text-[#F2F2F0] block">Official Workshop Warranty</span>
                  <span className="text-[11px] text-[#9A9A9A]">1-Year Paint &amp; 6-Month Composite Guarantee</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-[6px] bg-[#00B8F0] hover:bg-[#38C5F5] text-[#0F0F10] font-semibold text-xs cursor-pointer transition-colors"
              >
                Print / Save Warranty Receipt
              </button>
            </div>

            <p className="text-[11px] text-[#9A9A9A] italic pt-1">
              * Stage updates are synchronized in real-time as shop-floor technicians complete inspection and paint milestones.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
