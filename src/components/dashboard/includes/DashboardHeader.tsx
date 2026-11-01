import React from 'react';
import { UserSession, DashboardTab } from '../types';
import {
  Bell,
  Coins,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  PlusCircle,
  LayoutDashboard,
  Building2,
  Car,
  CreditCard,
  Heart,
  MessageSquare,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface DashboardHeaderProps {
  user: UserSession;
  activeTab: DashboardTab;
  currentPhpPath: string;
  unreadNotificationsCount: number;
  unreadMessagesCount?: number;
  savedItemsCount?: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenTopUpUnits: () => void;
  onSignOut: () => void;
  onReturnToSite: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  activeTab,
  currentPhpPath,
  unreadNotificationsCount,
  unreadMessagesCount = 0,
  savedItemsCount = 0,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigateTab,
  onOpenTopUpUnits,
  onSignOut,
  onReturnToSite,
}) => {
  const allNavItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview & Summary',
      desc: 'Account Home & KPI Ledger',
      icon: LayoutDashboard,
    },
    {
      id: 'accommodation' as DashboardTab,
      label: 'Accommodation Stays',
      desc: 'Furnished Suites & Smart Locks',
      icon: Building2,
    },
    {
      id: 'car-rentals' as DashboardTab,
      label: '3D Vehicle Fleet Rentals',
      desc: 'Airport & Suite Handover',
      icon: Car,
    },
    {
      id: 'payments' as DashboardTab,
      label: 'Payments & Wire Ledger',
      desc: 'Invoices, ACH & Wire Receipts',
      icon: CreditCard,
    },
    {
      id: 'saved-items' as DashboardTab,
      label: 'Saved Wishlist & Shortlist',
      desc: 'Bookmarked Suites & Vehicles',
      icon: Heart,
      badge: savedItemsCount,
    },
    {
      id: 'notifications' as DashboardTab,
      label: 'Account Alerts & Notices',
      desc: 'Real-time check-in and wire alerts',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    {
      id: 'messages' as DashboardTab,
      label: 'Concierge Messages Desk',
      desc: 'Direct dispatch communication',
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      id: 'profile' as DashboardTab,
      label: 'Guest & Partner Profile',
      desc: 'Personal & Company Info',
      icon: User,
    },
    {
      id: 'security' as DashboardTab,
      label: 'Security & 2FA Settings',
      desc: 'Password, 2FA & Audit Log',
      icon: Shield,
    },
    {
      id: 'settings' as DashboardTab,
      label: 'System & Currency Settings',
      desc: 'Notifications & Locale',
      icon: Settings,
    },
    {
      id: 'support' as DashboardTab,
      label: 'Support & Concierge Help',
      desc: 'Hotline & Ticket Submission',
      icon: HelpCircle,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1f1915]/95 backdrop-blur-md border-b border-[#3f332b] text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Hamburger Activities Menu + Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (visible on ALL screens) */}
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="p-2.5 rounded-2xl bg-[#29201a] hover:bg-[#382b23] border border-[#4a3b31] text-white cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
              title="Open Dashboard Activities Menu"
              aria-label="Open Dashboard Activities Navigation"
            >
              <Menu className="w-5 h-5 text-[#00b7a8]" />
              <span className="text-xs font-bold hidden sm:inline text-[#ede5dc]">Activities</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm sm:text-base text-white tracking-tight">
                  Easy Travel Lodging
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#00b7a8]/20 border border-[#00b7a8]/40 text-[#4de0d2]">
                  Client Portal
                </span>
              </div>
            </div>
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Mini Pill */}
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#29201a] border border-[#4a3b31] hover:bg-[#382b23] text-white text-left transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#00b7a8] flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-xs leading-tight hidden sm:block">
                <span className="font-bold text-white block truncate max-w-[110px]">{user.name}</span>
                <span className="text-[10px] text-[#a89988] block truncate max-w-[110px]">
                  {user.company || 'Member'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Activities Slide-Out Drawer Navigation (Triggered by Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-start animate-in fade-in">
          <div className="w-full max-w-md bg-[#1c1612] text-white border-r border-[#3a2e26] h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 bg-[#251d17] border-b border-[#3f332b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00b7a8]/20 border border-[#00b7a8]/40 text-[#4de0d2] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    Dashboard Activities
                  </h3>
                  <span className="text-[11px] font-mono text-[#4de0d2]">
                    UserDashboard/Activities Navigation
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close Activities Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Activities Nav List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#857568] px-2 block mb-1">
                Select Activity Module
              </span>

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
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00b7a8] text-white shadow-lg font-bold'
                        : 'bg-[#261d17] hover:bg-[#342820] text-[#ede5dc] border border-[#3f332b]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#1b140e] text-[#00b7a8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-white/80' : 'text-[#a89988]'
                          }`}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isActive
                              ? 'bg-white text-[#00897d]'
                              : 'bg-[#00b7a8] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive ? 'text-white' : 'text-[#6e5d50]'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#17110d] border-t border-[#3f332b] text-xs text-[#a89988] flex items-center justify-between">
              <span>Client Session Active</span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-rose-400 font-bold hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Click Outside to Close Area */}
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


