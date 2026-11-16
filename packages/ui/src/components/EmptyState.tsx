import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, action, onAction, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-[#172544] flex items-center justify-center mb-4">
        <Icon size={22} className="text-[#A3B1C8]" />
      </div>
      <p className="text-sm text-[#A3B1C8] mb-4">{title}</p>
      {action && onAction && (
        <Button size="sm" onClick={onAction}>{action}</Button>
      )}
    </div>
  );
}
