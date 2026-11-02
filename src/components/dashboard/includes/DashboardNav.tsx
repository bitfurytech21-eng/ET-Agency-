import React from 'react';

export interface SubTabOption {
  id: string;
  label: string;
  fileName?: string;
  badge?: number;
}

interface DashboardNavProps {
  currentFolder?: string;
  activeSubTab: string;
  options: SubTabOption[];
  onSelectSubTab: (subTabId: string) => void;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  activeSubTab,
  options,
  onSelectSubTab,
}) => {
  return (
    <div className="bg-white border border-[#e6dfd5] rounded-2xl px-3 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {options.map((opt) => {
          const isActive = activeSubTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSubTab(opt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#00b7a8] text-white font-bold'
                  : 'text-[#5c5046] hover:bg-[#faf8f5] hover:text-[#282828]'
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge !== undefined && opt.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums leading-none ${
                    isActive ? 'bg-white text-[#00897d]' : 'bg-[#ede5dc] text-[#282828]'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
