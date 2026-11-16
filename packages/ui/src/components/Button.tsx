import React from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#00B8F0] hover:bg-[#38C5F5] text-[#0F0F10] font-semibold active:bg-[#009fd0]',
  secondary: 'bg-[#161617] hover:bg-[#1F1F21] border border-white/[0.12] hover:border-white/[0.24] text-[#F2F2F0]',
  ghost: 'text-[#9A9A9A] hover:text-[#F2F2F0] bg-transparent',
  danger: 'bg-[#FF5D6C] hover:bg-[#ff7a86] text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center text-center leading-normal gap-2 rounded-[6px] font-medium transition-colors cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8F0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F10]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
