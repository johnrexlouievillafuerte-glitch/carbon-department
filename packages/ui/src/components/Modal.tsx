import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, wide, footer }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F0F10]/80 transition-opacity cursor-pointer"
        style={{ zIndex: 9999 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering wrapper */}
      <div
        className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center relative pointer-events-none"
        style={{ zIndex: 10000 }}
      >
        {/* Modal Dialog Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'pointer-events-auto relative w-full bg-[#161617] border border-white/[0.08] rounded-[8px]',
            'shadow-xl flex flex-col text-left my-auto transition-all overflow-hidden',
            'max-h-[90vh]',
            wide ? 'max-w-4xl' : 'max-w-lg'
          )}
          style={{ zIndex: 10001 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.08] shrink-0 bg-[#161617]">
            <h2 className="text-base sm:text-lg font-heading font-semibold text-[#F2F2F0] tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[6px] bg-transparent hover:bg-white/[0.06] text-[#9A9A9A] hover:text-[#F2F2F0] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 overscroll-contain text-[#F2F2F0]">
            {children}
          </div>

          {/* Optional Pinned Footer */}
          {footer && (
            <div className="px-5 sm:px-6 py-3.5 border-t border-white/[0.08] shrink-0 bg-[#161617]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
