import React from 'react';
import { UserNotificationItem } from '../types';
import { Bell, CreditCard, ShieldCheck, Check } from 'lucide-react';

interface NotificationCardProps {
  notification: UserNotificationItem;
  onMarkAsRead: (id: string) => void;
  onClickAction?: (notification: UserNotificationItem) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onClickAction,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'booking':
        return <ShieldCheck className="w-4 h-4 text-[#14616d]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        notification.isRead
          ? 'bg-white border-slate-200'
          : 'bg-[#edf6f8]/60 border-[#14616d]/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <h5 className="font-heading font-bold text-sm text-[#0f172a]">{notification.title}</h5>
            {!notification.isRead && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-[11px] font-semibold text-[#14616d]">Unread</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{notification.message}</p>
          <div className="text-[11px] text-slate-400 tabular-nums">
            {notification.timestamp}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center shrink-0">
        {!notification.isRead && (
          <button
            type="button"
            onClick={() => onMarkAsRead(notification.id)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <Check className="w-3.5 h-3.5 text-[#14616d]" />
            <span>Mark Read</span>
          </button>
        )}
        {notification.actionTab && onClickAction && (
          <button
            type="button"
            onClick={() => onClickAction(notification)}
            className="btn btn-primary btn-sm"
          >
            Open Section
          </button>
        )}
      </div>
    </div>
  );
};
