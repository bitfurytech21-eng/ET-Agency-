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
    <div className="p-8 sm:p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#14616d] flex items-center justify-center mx-auto">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="type-h3 text-[#0f172a]">{title}</h4>
      <p className="type-body text-slate-600 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="btn btn-primary btn-sm"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
