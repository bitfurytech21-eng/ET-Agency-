import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'vehicle' | 'hero' | 'table' | 'detail' | 'stats' | 'full';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'full', count = 3 }) => {
  if (type === 'hero') {
    return (
      <div className="relative overflow-hidden py-24 sm:py-32 px-4 bg-[#1e1713] text-center border-b border-[#3a2f28]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-4 w-40 bg-[#3a2f28] rounded-full mx-auto animate-shimmer" />
          <div className="h-10 sm:h-14 w-3/4 bg-[#3a2f28] rounded-xl mx-auto animate-shimmer" />
          <div className="h-4 w-5/6 bg-[#3a2f28] rounded-lg mx-auto animate-shimmer" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-12 w-36 bg-[#3a2f28] rounded-xl animate-shimmer" />
            <div className="h-12 w-36 bg-[#3a2f28] rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#e5ded4] p-5 shadow-xs space-y-4">
            <div className="w-full h-60 bg-[#f4eee6] rounded-xl animate-shimmer" />
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-4 w-20 bg-[#ede5dc] rounded-md animate-shimmer" />
            </div>
            <div className="h-6 w-3/4 bg-[#ede5dc] rounded-md animate-shimmer" />
            <div className="h-4 w-full bg-[#f4eee6] rounded-md animate-shimmer" />
            <div className="h-4 w-2/3 bg-[#f4eee6] rounded-md animate-shimmer" />
            <div className="pt-4 border-t border-[#f0eae1] flex justify-between items-center">
              <div className="h-6 w-28 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-10 w-28 bg-[#ede5dc] rounded-xl animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'vehicle') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-[#e5ded4] p-5 shadow-xs space-y-4">
            <div className="w-full h-52 bg-[#f4eee6] rounded-xl animate-shimmer" />
            <div className="flex justify-between items-center">
              <div className="h-5 w-40 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-5 w-16 bg-[#ede5dc] rounded-md animate-shimmer" />
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="h-8 bg-[#f4eee6] rounded-lg animate-shimmer" />
              <div className="h-8 bg-[#f4eee6] rounded-lg animate-shimmer" />
              <div className="h-8 bg-[#f4eee6] rounded-lg animate-shimmer" />
            </div>
            <div className="pt-3 border-t border-[#f0eae1] flex justify-between items-center">
              <div className="h-6 w-24 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-10 w-32 bg-[#ede5dc] rounded-xl animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e5ded4] p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="w-8 h-8 rounded-xl bg-[#ede5dc] animate-shimmer" />
            </div>
            <div className="h-8 w-32 bg-[#ede5dc] rounded-lg animate-shimmer" />
            <div className="h-3 w-40 bg-[#f4eee6] rounded-md animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-[#ede5dc] rounded-lg animate-shimmer" />
          <div className="h-9 w-32 bg-[#ede5dc] rounded-xl animate-shimmer" />
        </div>
        <div className="bg-white rounded-2xl border border-[#e5ded4] p-6 space-y-3 shadow-xs">
          <div className="h-10 w-full bg-[#f4eee6] rounded-xl animate-shimmer" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-[#faf7f2] rounded-xl flex items-center justify-between px-4">
              <div className="h-4 w-1/4 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-4 w-1/5 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-4 w-1/6 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-8 w-20 bg-[#ede5dc] rounded-lg animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="h-6 w-36 bg-[#ede5dc] rounded-lg animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-96 w-full bg-[#f4eee6] rounded-2xl animate-shimmer" />
            <div className="h-8 w-2/3 bg-[#ede5dc] rounded-lg animate-shimmer" />
            <div className="h-4 w-full bg-[#f4eee6] rounded-md animate-shimmer" />
            <div className="h-4 w-5/6 bg-[#f4eee6] rounded-md animate-shimmer" />
          </div>
          <div className="space-y-6">
            <div className="h-80 w-full bg-white rounded-2xl border border-[#e5ded4] p-6 space-y-4 shadow-xs">
              <div className="h-6 w-1/2 bg-[#ede5dc] rounded-md animate-shimmer" />
              <div className="h-12 w-full bg-[#f4eee6] rounded-xl animate-shimmer" />
              <div className="h-12 w-full bg-[#ede5dc] rounded-xl animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full default fallback
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#14616d]/10 border border-[#14616d]/20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#14616d] border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <div className="h-5 w-44 bg-[#ede5dc] rounded-md mx-auto animate-shimmer" />
        <div className="h-3.5 w-60 bg-[#f4eee6] rounded-md mx-auto animate-shimmer" />
      </div>
    </div>
  );
};
