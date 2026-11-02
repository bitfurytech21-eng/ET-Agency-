import React, { useEffect, useState } from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

interface BrandedPageLoaderProps {
  onComplete?: () => void;
  minDuration?: number; // ms
}

export const BrandedPageLoader: React.FC<BrandedPageLoaderProps> = ({
  onComplete,
  minDuration = 450,
}) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      const hideTimer = setTimeout(() => {
        setHidden(true);
        if (onComplete) onComplete();
      }, 300);
      return () => clearTimeout(hideTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-200 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading platform"
    >
      <div className="flex flex-col items-center space-y-4 max-w-sm px-6 text-center animate-scale-in">
        {/* Brand Icon Mark */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-[#14616d] flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Name & Loading Indicator */}
        <div className="space-y-1">
          <h2 className="type-h4 text-slate-900">
            Easy Travel Lodging
          </h2>
          <p className="type-support text-slate-500">
            Furnished Corporate Residences &amp; Fleet
          </p>
        </div>

        {/* Progress line */}
        <div className="w-36 h-1 bg-slate-200 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-[#14616d] rounded-full animate-shimmer" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
