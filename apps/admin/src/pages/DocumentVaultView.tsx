import React, { useState } from 'react';
import { FolderLock, Plus, FileText, Download, ShieldCheck } from 'lucide-react';
import { Button, Input, Select, Modal, EmptyState, PlateBadge, JobTag } from '@carbon/ui';
import { api } from '../api';
import type { DocumentRecord } from '@carbon/ui';

interface DocumentVaultViewProps {
  documents: DocumentRecord[];
  onRefresh: () => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  onRefresh,
}) => {
  const [openUpload, setOpenUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Signed Job Order');
  const [jobNo, setJobNo] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }
    if (!file) {
      setError('Please select a PDF or image file.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title.trim());
      fd.append('category', category);
      fd.append('job_no', jobNo.trim().toUpperCase());
      fd.append('plate_number', plateNumber.trim().toUpperCase());
      fd.append('customer_name', customerName.trim());

      await api.uploadDocument(fd);
      setTitle('');
      setJobNo('');
      setPlateNumber('');
      setCustomerName('');
      setFile(null);
      setOpenUpload(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to archive document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-[#F2F2F0]">
            Permanent Digital Document Vault
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Archived records are never discarded. Solving paper job order loss with immutable digital storage.
          </p>
        </div>

        <Button variant="primary" size="md" className="flex items-center gap-1.5" onClick={() => setOpenUpload(true)}>
          <Plus size={15} /> <span>Upload Document</span>
        </Button>
      </div>

      {/* Permanence Banner */}
      <div className="p-4 rounded-[8px] bg-[#161617] border border-white/[0.08] flex items-center gap-3 text-xs text-[#9A9A9A]">
        <ShieldCheck size={18} className="text-[#2DD4A0] shrink-0" />
        <div>
          <strong className="text-[#F2F2F0]">Permanent Retention Policy: </strong>
          Physical paper orders are often discarded after ~3 months; all records digitized here remain securely accessible in encrypted private storage indefinitely.
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px]">
          <EmptyState
            icon={FolderLock}
            title="No documents yet. Scanned job orders, signed estimates, and gate passes will be stored here."
            action="Upload Document"
            onAction={() => setOpenUpload(true)}
          />
        </div>
      ) : (
        <div className="bg-[#161617] border border-white/[0.08] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0F0F10] text-[#9A9A9A] font-mono">
                  <th className="p-4 font-medium">Document Title</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Linked Job / Plate</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Date Archived</th>
                  <th className="p-4 font-medium text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-[#00B8F0] shrink-0" />
                        <div>
                          <span className="font-medium text-[#F2F2F0] block">
                            {doc.title}
                          </span>
                          <span className="text-[10px] text-[#9A9A9A] font-mono">
                            {doc.file_size_kb} KB
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-[4px] bg-[#00B8F0]/15 text-[#00B8F0] text-[11px] font-medium border border-[#00B8F0]/30 font-mono">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {doc.job_no && <JobTag code={doc.job_no} />}
                        {doc.plate_number && <PlateBadge plate={doc.plate_number} />}
                      </div>
                    </td>
                    <td className="p-4 text-[#F2F2F0]">{doc.customer_name || '—'}</td>
                    <td className="p-4 font-mono text-[#9A9A9A]">
                      {doc.created_at?.split(' ')[0]}
                    </td>
                    <td className="p-4 text-right">
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#0F0F10] hover:bg-[#00B8F0] hover:text-[#0F0F10] text-[#F2F2F0] border border-white/[0.08] text-xs font-medium transition-colors"
                        >
                          <Download size={13} />
                          <span>Signed Link</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#9A9A9A]">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal open={openUpload} onClose={() => setOpenUpload(false)} title="Archive File into Digital Vault">
        <form onSubmit={handleUpload} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-[6px] bg-[#FF5D6C]/10 border border-[#FF5D6C]/30 text-xs text-[#FF5D6C]">
              {error}
            </div>
          )}

          <Input
            label="Document Title *"
            placeholder="e.g. Signed Walkaround Intake Sheet — NBC 4821"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Document Classification *"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Signed Job Order', label: 'Signed Job Order Sheet' },
              { value: 'Inspection Sheet', label: 'Walkaround Inspection Sheet' },
              { value: 'Cost Estimate', label: 'Approved Cost Estimate' },
              { value: 'Release Gate Pass', label: 'Release Gate Pass' },
              { value: 'Permits & Regulatory', label: 'Permits & Regulatory Certificate' },
              { value: 'General', label: 'General Technical Document' },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Job Order Number (Optional)"
              placeholder="e.g. CD-2026-0001"
              value={jobNo}
              onChange={(e) => setJobNo(e.target.value)}
              className="font-mono uppercase"
            />
            <Input
              label="Plate Number (Optional)"
              placeholder="e.g. NBC 4821"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="font-mono uppercase"
            />
          </div>

          <Input
            label="Customer Name (Optional)"
            placeholder="e.g. Atty. Ramon Arceo"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A]">File (PDF or Image) *</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#9A9A9A] file:mr-3 file:py-2 file:px-3 file:rounded-[4px] file:border-0 file:text-xs file:font-semibold file:bg-[#0F0F10] file:text-[#00B8F0] cursor-pointer"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
            <Button type="button" variant="secondary" size="md" className="text-center justify-center" onClick={() => setOpenUpload(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="text-center justify-center" disabled={loading}>
              {loading ? 'Archiving...' : 'Securely Archive'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
