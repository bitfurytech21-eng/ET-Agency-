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
  currentPhpPath?: string;
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
  profile: 'Profile & Settings',
  security: 'Security & Password',
  settings: 'System & Preferences',
  support: 'Support & Assistance',
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  unreadNotificationsCount,
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
      desc: 'Personal welcome, balance & booking summary',
      icon: LayoutDashboard,
    },
    {
      id: 'accommodation' as DashboardTab,
      label: 'Accommodation',
      desc: 'Active stays, history & check-in details',
      icon: Building2,
    },
    {
      id: 'car-rentals' as DashboardTab,
      label: 'Car Rentals',
      desc: 'Fleet reservations, pickup & driver profile',
      icon: Car,
    },
    {
      id: 'payments' as DashboardTab,
      label: 'Payments & Invoices',
      desc: 'Receipts, bank routing & transfer proof',
      icon: CreditCard,
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
      label: 'Profile & Settings',
      desc: 'Personal details, address & stay preferences',
      icon: User,
    },
    {
      id: 'security' as DashboardTab,
      label: 'Security & Password',
      desc: 'Password management, 2FA & active sessions',
      icon: Shield,
    },
    {
      id: 'support' as DashboardTab,
      label: 'Support & Assistance',
      desc: 'Concierge desk, FAQs & support tickets',
      icon: HelpCircle,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1f1915] border-b border-[#3f332b] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Button + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-[#29201a] hover:bg-[#382b23] border border-[#4a3b31] text-white cursor-pointer transition-colors flex items-center gap-2 shrink-0"
              aria-label="Open Dashboard Menu"
            >
              <Menu className="w-5 h-5 text-[#4de0d2]" />
              <span className="text-xs font-bold hidden sm:inline text-[#ede5dc] whitespace-nowrap">Menu</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <span className="font-heading font-extrabold text-white whitespace-nowrap shrink-0">
                Easy Travel Lodging
              </span>
              <span className="text-[#857568] shrink-0" aria-hidden="true">/</span>
              <span className="text-[#d6c7b8] truncate hidden sm:inline">Client Portal</span>
              <span className="text-[#857568] shrink-0 hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-[#4de0d2] font-semibold truncate">
                {SECTION_LABELS[activeTab]}
              </span>
            </div>
          </div>

          {/* Right: Notifications Shortcut, Main Site & Sign Out */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('notifications')}
              className="relative p-2 rounded-xl bg-[#29201a] hover:bg-[#382b23] border border-[#4a3b31] text-[#ede5dc] hover:text-white transition-colors cursor-pointer"
              aria-label="View Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#14616d] text-white text-[10px] font-extrabold leading-none tabular-nums">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onReturnToSite}
              className="px-3 py-2 rounded-xl bg-[#29201a] hover:bg-[#382b23] border border-[#4a3b31] text-[#ede5dc] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Home className="w-3.5 h-3.5 text-[#4de0d2]" />
              <span className="hidden sm:inline">Browse Website</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="px-3 py-2 rounded-xl bg-[#29201a] hover:bg-rose-950/60 border border-[#4a3b31] hover:border-rose-400/50 text-[#ede5dc] hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-start lg:hidden">
          <div className="w-full max-w-sm bg-[#1c1612] text-white border-r border-[#3a2e26] h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header with User Info */}
            <div className="p-5 bg-[#251d17] border-b border-[#3f332b] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading font-extrabold text-base text-white truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-[#b8a99a] truncate">{user.email}</p>
                <p className="text-[10px] font-mono text-[#8e7f70] mt-0.5 tabular-nums truncate">
                  ID: {user.id}
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="Close Dashboard Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
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
                        ? 'bg-[#14616d] text-white font-bold'
                        : 'bg-[#261d17] hover:bg-[#342820] text-[#ede5dc] border border-[#3f332b]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#1b140e] text-[#00b7a8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div
                          className={`text-[11px] truncate ${
                            isActive ? 'text-white/85' : 'text-[#a89988]'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums ${
                            isActive ? 'bg-white text-[#00897d]' : 'bg-[#00b7a8] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6e5d50]'}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#17110d] border-t border-[#3f332b] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onToggleMobileMenu();
                  onReturnToSite();
                }}
                className="text-xs text-[#d6c7b8] hover:text-white font-semibold cursor-pointer whitespace-nowrap"
              >
                Browse Website
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleMobileMenu();
                  onSignOut();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-bold hover:bg-rose-900/60 cursor-pointer whitespace-nowrap"
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
