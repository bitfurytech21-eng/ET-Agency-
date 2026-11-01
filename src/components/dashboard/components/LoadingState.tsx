import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading dashboard records...' }) => {
  return (
    <div className="p-12 text-center bg-white border border-[#e6dfd5] rounded-2xl space-y-3">
      <Loader2 className="w-7 h-7 text-[#00b7a8] animate-spin mx-auto" />
      <p className="text-xs font-semibold text-[#5c5046]">{message}</p>
    </div>
  );
};
