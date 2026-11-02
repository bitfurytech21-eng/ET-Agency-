import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading dashboard records...' }) => {
  return (
    <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
      <Loader2 className="w-7 h-7 text-[#14616d] animate-spin mx-auto" />
      <p className="type-body font-medium text-slate-600">{message}</p>
    </div>
  );
};
