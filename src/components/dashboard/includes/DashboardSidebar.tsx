import React from 'react';
import { DashboardTab } from '../types';
import {
  LayoutDashboard,
  Building2,
  Car,
  Heart,
  Bell,
  MessageSquare,
  User,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: DashboardTab;
  label: string;
  folder: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  savedItemsCount?: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
  savedItemsCount = 0,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', folder: 'Overview/', icon: LayoutDashboard },
    { id: 'accommodation', label: 'Accommodation', folder: 'Accommodation/', icon: Building2 },
    { id: 'car-rentals', label: 'Car Rentals', folder: 'CarRentals/', icon: Car },
    { id: 'saved-items', label: 'Saved Items', folder: 'SavedItems/', icon: Heart, badge: savedItemsCount },
    { id: 'notifications', label: 'Notifications', folder: 'Notifications/', icon: Bell, badge: unreadNotificationsCount },
    { id: 'messages', label: 'Messages', folder: 'Messages/', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', folder: 'Profile/', icon: User },
    { id: 'security', label: 'Security', folder: 'Security/', icon: Shield },
    { id: 'settings', label: 'Settings', folder: 'Settings/', icon: Settings },
    { id: 'support', label: 'Support & Help', folder: 'Support/', icon: HelpCircle },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#241d18] border-r border-[#3f332b] text-[#ede5dc] flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-4">
        <div className="px-3 py-2 bg-[#1b1511] rounded-xl border border-[#3f332b] flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#00b7a8]" />
          <span className="text-[11px] font-mono text-[#4de0d2] font-semibold">UserDashboard/</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00b7a8] text-white shadow-md font-bold'
                    : 'text-[#d6c7b8] hover:bg-[#322720] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#a89988]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white text-[#00897d]'
                          : 'bg-[#00b7a8] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-[#6e5d50]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-[#1c1612] border border-[#3f332b] rounded-xl text-[11px] text-[#a89988] space-y-1">
        <span className="text-white font-bold block">24/7 Concierge Support</span>
        <p className="text-[10px] leading-relaxed">
          Assistance with check-in, keyless codes, or vehicle delivery across all US locations.
        </p>
      </div>
    </aside>
  );
};
