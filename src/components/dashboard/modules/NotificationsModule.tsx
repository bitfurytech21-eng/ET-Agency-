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

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0f172a]">
              Notifications &amp; Account Updates
            </h3>
            <p className="text-xs text-slate-500">
              Confirmation notices, payment reconciliation alerts, and account updates for your workspace
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={markingAll}
              onClick={handleMarkAll}
              className="btn btn-outline btn-sm disabled:opacity-50 w-fit"
            >
              <CheckCheck className="w-4 h-4 text-[#14616d]" />
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
