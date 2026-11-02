import React from 'react';
import { DashboardTab, UserSession } from '../types';
import {
  LayoutDashboard,
  Building2,
  Car,
  CreditCard,
  Bell,
  User,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Bookmark,
  MessageSquare,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardSidebarProps {
  user?: UserSession;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onSignOut?: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  savedItemsCount?: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onSignOut = () => {},
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
}) => {
  const navGroups: { heading: string; items: NavItem[] }[] = [
    {
      heading: 'Reservations & Billing',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'accommodation', label: 'Accommodation', icon: Building2 },
        { id: 'car-rentals', label: 'Car Rentals', icon: Car },
        { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
        { id: 'saved-items', label: 'Saved Items', icon: Bookmark },
      ],
    },
    {
      heading: 'Concierge & Account',
      items: [
        { id: 'messages', label: 'Concierge Messages', icon: MessageSquare, badge: unreadMessagesCount },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
        { id: 'profile', label: 'Profile & Billing', icon: User },
        { id: 'security', label: 'Security & Password', icon: Shield },
        { id: 'settings', label: 'Preferences', icon: Settings },
        { id: 'support', label: 'Support & Assistance', icon: HelpCircle },
      ],
    },
  ];

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'CL';

  return (
    <aside className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl text-slate-200 flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-5">
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14616d] text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="type-nav text-white truncate">{user?.name || 'Verified Client'}</div>
            <div className="type-support text-slate-400 truncate">{user?.email || 'easytravelagency@trustagent.space'}</div>
            <div className="type-support font-mono text-slate-500 truncate mt-0.5 tabular-nums">
              ID: {user?.id || 'USR-CORP'}
            </div>
          </div>
        </div>

        <nav className="space-y-4" aria-label="Client workspace navigation">
          {navGroups.map((group) => (
            <div key={group.heading} className="space-y-1">
              <div className="px-3 type-support font-semibold text-slate-400">
                {group.heading}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`type-nav w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#14616d] text-white font-semibold'
                        : 'text-slate-300 font-medium hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-xs font-bold tabular-nums leading-none ${
                            isActive ? 'bg-white text-[#14616d]' : 'bg-[#14616d] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl type-support text-slate-400 space-y-1">
          <span className="text-white font-semibold block">Direct Guest Assistance</span>
          <p className="type-support text-slate-400">
            Call <strong className="text-slate-200 tabular-nums">916-800-3295</strong> or email{' '}
            <strong className="text-slate-200 break-all">easytravelagency@trustagent.space</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="type-btn w-full px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-rose-400/50 bg-slate-900 hover:bg-rose-950/40 text-slate-200 hover:text-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
