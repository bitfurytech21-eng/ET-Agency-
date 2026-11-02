import React from 'react';
import { UserSession, DashboardTab } from '../types';
import {
  Bell,
  LogOut,
  Menu,
  X,
  User,
  LayoutDashboard,
  Building2,
  Car,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Home,
  Bookmark,
  MessageSquare,
  Settings,
} from 'lucide-react';

interface DashboardHeaderProps {
  user: UserSession;
  activeTab: DashboardTab;
  unreadNotificationsCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigateTab: (tab: DashboardTab) => void;
  onSignOut: () => void;
  onReturnToSite: () => void;
  onOpenTopUpUnits?: () => void;
  unreadMessagesCount?: number;
  savedItemsCount?: number;
}

const SECTION_LABELS: Record<DashboardTab, string> = {
  overview: 'Overview',
  accommodation: 'Accommodation',
  'car-rentals': 'Car Rentals',
  payments: 'Payments & Invoices',
  'saved-items': 'Saved Items',
  notifications: 'Notifications',
  messages: 'Concierge Messages',
  profile: 'Profile & Billing',
  security: 'Security & Password',
  settings: 'Preferences',
  support: 'Support & Assistance',
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  unreadNotificationsCount,
  unreadMessagesCount = 0,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigateTab,
  onSignOut,
  onReturnToSite,
}) => {
  const allNavItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      desc: 'Account summary, balance & active bookings',
      icon: LayoutDashboard,
    },
    {
      id: 'accommodation' as DashboardTab,
      label: 'Accommodation',
      desc: 'Active stays, history & check-in credentials',
      icon: Building2,
    },
    {
      id: 'car-rentals' as DashboardTab,
      label: 'Car Rentals',
      desc: 'Fleet reservations, delivery & driver profile',
      icon: Car,
    },
    {
      id: 'payments' as DashboardTab,
      label: 'Payments & Invoices',
      desc: 'Receipts, bank routing & transfer proof',
      icon: CreditCard,
    },
    {
      id: 'saved-items' as DashboardTab,
      label: 'Saved Items',
      desc: 'Bookmarked residences & fleet vehicles',
      icon: Bookmark,
    },
    {
      id: 'messages' as DashboardTab,
      label: 'Concierge Messages',
      desc: 'Direct communications with hospitality & fleet desk',
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      id: 'notifications' as DashboardTab,
      label: 'Notifications',
      desc: 'Account updates & reservation alerts',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    {
      id: 'profile' as DashboardTab,
      label: 'Profile & Billing',
      desc: 'Contact details, billing address & stay settings',
      icon: User,
    },
    {
      id: 'security' as DashboardTab,
      label: 'Security & Password',
      desc: 'Password management, 2FA & active sessions',
      icon: Shield,
    },
    {
      id: 'settings' as DashboardTab,
      label: 'Preferences',
      desc: 'Localization, alert channels & tax entity',
      icon: Settings,
    },
    {
      id: 'support' as DashboardTab,
      label: 'Support & Assistance',
      desc: 'Concierge desk, FAQs & service requests',
      icon: HelpCircle,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0f172a] border-b border-slate-800 text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white cursor-pointer transition-colors flex items-center gap-2 shrink-0"
              aria-label="Open Dashboard Menu"
            >
              <Menu className="w-5 h-5 text-[#5eead4]" />
              <span className="type-btn hidden sm:inline text-slate-200 whitespace-nowrap">Menu</span>
            </button>

            <div className="flex items-center gap-2 type-nav min-w-0">
              <span className="font-bold text-white whitespace-nowrap shrink-0">
                Easy Travel Lodging
              </span>
              <span className="text-slate-600 shrink-0" aria-hidden="true">/</span>
              <span className="text-slate-400 font-medium truncate hidden sm:inline">Client Workspace</span>
              <span className="text-slate-600 shrink-0 hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-[#5eead4] font-semibold truncate">
                {SECTION_LABELS[activeTab]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('notifications')}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="View Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#14616d] text-white text-xs font-bold leading-none tabular-nums">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onReturnToSite}
              className="type-btn px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Home className="w-4 h-4 text-[#5eead4]" />
              <span className="hidden sm:inline">Return to Website</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="type-btn px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-400/50 text-slate-200 hover:text-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex justify-start lg:hidden">
          <div className="w-full max-w-sm bg-[#0f172a] text-white border-r border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="type-h4 text-white truncate">
                  {user.name}
                </h3>
                <p className="type-support text-slate-400 truncate">{user.email}</p>
                <p className="type-support font-mono text-slate-500 mt-0.5 tabular-nums truncate">
                  ID: {user.id}
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="Close Dashboard Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigateTab(item.id);
                      onToggleMobileMenu();
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#14616d] text-white font-semibold'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/15 text-white' : 'bg-slate-800 text-[#5eead4]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="type-nav truncate">{item.label}</div>
                        <div
                          className={`type-support truncate ${
                            isActive ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${
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

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onToggleMobileMenu();
                  onReturnToSite();
                }}
                className="type-nav text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
              >
                Return to Website
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleMobileMenu();
                  onSignOut();
                }}
                className="type-btn px-3.5 py-2 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 hover:bg-rose-900/60 cursor-pointer whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div
            className="flex-1 cursor-pointer"
            onClick={onToggleMobileMenu}
            aria-label="Close Overlay"
          />
        </div>
      )}
    </>
  );
};
