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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e6dfd5] text-xs text-[#5c5046]">
      <div>
        Showing page <span className="font-bold text-[#282828]">{currentPage}</span> of{' '}
        <span className="font-bold text-[#282828]">{totalPages}</span> ({totalRecords} total items)
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-[#d8cfc3] bg-white text-[#282828] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf8f5]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg font-bold transition-colors ${
              currentPage === p
                ? 'bg-[#00b7a8] text-white shadow-2xs'
                : 'border border-[#d8cfc3] bg-white text-[#282828] hover:bg-[#faf8f5]'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-[#d8cfc3] bg-white text-[#282828] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf8f5]"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
