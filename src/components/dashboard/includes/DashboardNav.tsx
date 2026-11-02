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
    <div className="bg-white border border-slate-200 rounded-xl p-1.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 min-w-max">
        {options.map((opt) => {
          const isActive = activeSubTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSubTab(opt.id)}
              className={`type-nav px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#14616d] text-white font-semibold'
                  : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge !== undefined && opt.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-bold tabular-nums leading-none ${
                    isActive ? 'bg-white text-[#14616d]' : 'bg-slate-100 text-slate-700'
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
