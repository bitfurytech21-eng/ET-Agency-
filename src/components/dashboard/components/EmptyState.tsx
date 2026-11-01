import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl space-y-3">
      <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dfd5] text-[#82634f] flex items-center justify-center mx-auto shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-heading font-bold text-base text-[#282828]">{title}</h4>
      <p className="text-xs text-[#5c5046] max-w-md mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
