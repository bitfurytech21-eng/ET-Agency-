import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 type-support text-slate-600 tabular-nums">
      <div>
        Showing page <span className="font-semibold text-[#0f172a]">{currentPage}</span> of{' '}
        <span className="font-semibold text-[#0f172a]">{totalPages}</span> ({totalRecords} total items)
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] h-9 px-2.5 rounded-lg type-btn tabular-nums transition-colors cursor-pointer ${
              currentPage === p
                ? 'bg-[#14616d] text-white shadow-2xs'
                : 'border border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
