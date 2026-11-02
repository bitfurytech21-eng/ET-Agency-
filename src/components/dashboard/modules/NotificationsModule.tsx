import React, { useState } from 'react';
import { DashboardTab, NotificationsSubView, UserNotificationItem } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { NotificationCard } from '../components/NotificationCard';
import { EmptyState } from '../components/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

interface NotificationsModuleProps {
  notifications: UserNotificationItem[];
  onMarkAsRead: ((id: string) => Promise<void>) | ((id: string) => void);
  onMarkAllAsRead: (() => Promise<void>) | (() => void);
  onNavigateTab?: (tab: DashboardTab) => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab = () => {},
}) => {
  const [subView, setSubView] = useState<NotificationsSubView>('index');
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Updates', badge: unreadCount },
    { id: 'booking-alerts', label: 'Booking Updates' },
    { id: 'payment-alerts', label: 'Payment Updates' },
    { id: 'system-notifications', label: 'Account & System' },
  ];

  const filtered = notifications.filter((n) => {
    if (subView === 'booking-alerts') return n.type === 'booking';
    if (subView === 'payment-alerts') return n.type === 'payment';
    if (subView === 'system-notifications') return n.type === 'system';
    return true;
  });

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as NotificationsSubView)}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Notifications &amp; Account Updates
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Confirmation notices, payment reconciliation alerts, and account updates for your dashboard
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={handleMarkAll}
              className="px-4 py-2 rounded-xl border border-[#d8cfc3] hover:bg-[#faf8f5] disabled:opacity-50 text-xs font-bold text-[#282828] flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 w-fit"
            >
              <CheckCheck className="w-4 h-4 text-[#00b7a8]" />
              <span>{markingAll ? 'Updating...' : 'Mark All as Read'}</span>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications in this category"
            description="New reservation confirmations, transfer verifications, and account updates will appear here automatically."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkAsRead={(id) => {
                  onMarkAsRead(id);
                }}
                onClickAction={
                  notif.actionTab
                    ? (item) => {
                        if (item.actionTab) {
                          onNavigateTab(item.actionTab);
                        }
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
