import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let colorClasses = 'text-stone-700';

  if (['confirmed', 'settled', 'completed', 'active', 'verified', 'passed', 'resolved'].includes(norm)) {
    colorClasses = 'text-emerald-700';
  } else if (['pending', 'pending_verification', 'in_progress', 'scheduled', 'waiting', 'open'].includes(norm)) {
    colorClasses = 'text-amber-700';
  } else if (['cancelled', 'rejected', 'failed', 'urgent', 'overdue'].includes(norm)) {
    colorClasses = 'text-rose-700';
  }

  const textSize = size === 'sm' ? 'text-xs' : 'type-support';

  return (
    <span className={`inline-flex items-center font-semibold capitalize ${textSize} ${colorClasses}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
