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
} from 'lucide-react';

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface DashboardSidebarProps {
  user: UserSession;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onSignOut: () => void;
  unreadNotificationsCount?: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onSignOut,
  unreadNotificationsCount = 0,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'accommodation', label: 'Accommodation', icon: Building2 },
    { id: 'car-rentals', label: 'Car Rentals', icon: Car },
    { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Profile & Settings', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'support', label: 'Support & Assistance', icon: HelpCircle },
  ];

  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <aside className="w-full bg-[#241d18] border border-[#3f332b] rounded-2xl text-[#ede5dc] flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-4">
        {/* Personal Account Card */}
        <div className="p-3.5 bg-[#1b1511] rounded-xl border border-[#3f332b] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00b7a8] text-white font-heading font-black text-sm flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[11px] text-[#b8a99a] truncate">{user.email}</div>
            <div className="text-[10px] font-mono text-[#8e7f70] truncate mt-0.5 tabular-nums">
              ID: {user.id}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1" aria-label="Personal dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00b7a8] text-white font-bold'
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
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums leading-none ${
                        isActive ? 'bg-white text-[#00897d]' : 'bg-[#00b7a8] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#6e5d50]'}`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-2 border-t border-[#3f332b]">
        <div className="p-3 bg-[#1c1612] border border-[#3f332b] rounded-xl text-[11px] text-[#b8a99a] space-y-1">
          <span className="text-white font-bold block">Direct Guest Assistance</span>
          <p className="text-[11px] leading-relaxed">
            Call <strong className="text-[#ede5dc] tabular-nums">916-800-3295</strong> or email{' '}
            <strong className="text-[#ede5dc]">easytravelagency@trustagent.space</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#4a3b31] hover:border-rose-400/50 bg-[#1b1511] hover:bg-rose-950/30 text-xs font-bold text-[#ede5dc] hover:text-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
