import React, { useState } from 'react';
import { UserNotificationItem, NotificationsSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { NotificationCard } from '../components/NotificationCard';
import { EmptyState } from '../components/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

interface NotificationsModuleProps {
  notifications: UserNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [subView, setSubView] = useState<NotificationsSubView>('index');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'All Alerts', fileName: 'index.php', badge: unreadCount },
    { id: 'booking-alerts', label: 'Booking Alerts', fileName: 'booking-alerts.php' },
    { id: 'payment-alerts', label: 'Payment Alerts', fileName: 'payment-alerts.php' },
    { id: 'system-notifications', label: 'System Alerts', fileName: 'system-notifications.php' },
  ];

  const filtered = notifications.filter((n) => {
    if (subView === 'booking-alerts') return n.type === 'booking';
    if (subView === 'payment-alerts') return n.type === 'payment';
    if (subView === 'system-notifications') return n.type === 'system';
    return true;
  });

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Notifications/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as NotificationsSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Account Notifications &amp; Alerts (Notifications/)
            </h3>
            <p className="text-xs text-[#5c5046]">
              Real-time updates on keyless codes, arrival check-in readiness, and wire clearing notices.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-3.5 py-1.5 rounded-xl border border-[#d8cfc3] hover:bg-white text-xs font-semibold text-[#5c5046] flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#00b7a8]" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications in this Category"
            description="You are completely caught up! New reservation and billing alerts will appear here."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
