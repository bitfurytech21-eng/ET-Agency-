import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let colorClasses = 'bg-stone-100 text-stone-700 border-stone-200';

  if (['confirmed', 'settled', 'completed', 'active', 'verified', 'passed', 'resolved'].includes(norm)) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (['pending', 'in_progress', 'scheduled', 'waiting', 'open'].includes(norm)) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (['cancelled', 'rejected', 'failed', 'urgent', 'overdue'].includes(norm)) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-lg border ${padding} ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
};
