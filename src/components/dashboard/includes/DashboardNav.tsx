import React from 'react';

export interface SubTabOption {
  id: string;
  label: string;
  fileName: string;
  badge?: number;
}

interface DashboardNavProps {
  currentFolder: string;
  activeSubTab: string;
  options: SubTabOption[];
  onSelectSubTab: (subTabId: string) => void;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({
  currentFolder,
  activeSubTab,
  options,
  onSelectSubTab,
}) => {
  return (
    <div className="bg-white border-b border-[#e6dfd5] px-4 sm:px-8 py-2.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        <span className="text-[11px] font-mono text-[#857568] mr-2 hidden sm:inline">
          {currentFolder}
        </span>
        {options.map((opt) => {
          const isActive = activeSubTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSubTab(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00b7a8] text-white shadow-2xs font-bold'
                  : 'bg-[#faf8f5] text-[#5c5046] hover:bg-[#ede5dc] hover:text-[#282828] border border-[#e6dfd5]'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-[10px] font-mono opacity-70 ${isActive ? 'text-white' : 'text-[#857568]'}`}>
                ({opt.fileName})
              </span>
              {opt.badge !== undefined && opt.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-[#00897d]' : 'bg-[#00897d] text-white'
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
