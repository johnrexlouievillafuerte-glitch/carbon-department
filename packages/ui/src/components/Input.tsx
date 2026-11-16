import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#9A9A9A]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full h-11 px-3.5 py-2.5 rounded-[6px] text-sm',
          'bg-[#161617] border text-[#F2F2F0] placeholder-[#9A9A9A]/60',
          'focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]',
          'transition-colors',
          error ? 'border-[#FF5D6C]' : 'border-white/[0.08]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#FF5D6C]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#9A9A9A]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'w-full px-3.5 py-2.5 rounded-[6px] text-sm resize-y min-h-[90px]',
          'bg-[#161617] border text-[#F2F2F0] placeholder-[#9A9A9A]/60',
          'focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]',
          error ? 'border-[#FF5D6C]' : 'border-white/[0.08]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#FF5D6C]">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, className, id, options, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#9A9A9A]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={clsx(
          'w-full h-11 px-3.5 py-2.5 rounded-[6px] text-sm',
          'bg-[#161617] border text-[#F2F2F0]',
          'focus:outline-none focus:ring-1 focus:ring-[#00B8F0] focus:border-[#00B8F0]',
          error ? 'border-[#FF5D6C]' : 'border-white/[0.08]',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#161617] text-[#F2F2F0]">{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#FF5D6C]">{error}</p>}
    </div>
  );
}
