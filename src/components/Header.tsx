import React, { useState } from 'react';
import { PROPERTIES } from '../data/lodgingData';
import { useCart } from '../context/CartContext';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: (propertyId?: string) => void;
  onSearchListings?: (query: string) => void;
  authUser?: { id: string; name: string; email: string } | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onSearchListings,
  authUser,
  onSignOut,
}) => {
  const { cart, openDrawer, liveProperties } = useCart();
  const navProperties = liveProperties.length > 0 ? liveProperties : PROPERTIES;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    setPortfolioDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (onSearchListings) {
      onSearchListings(q);
    } else {
      setCurrentTab('portfolio');
    }
    setSearchOpen(false);
  };

  const firstName = authUser?.name ? authUser.name.trim().split(' ')[0] : '';

  const navLinkClass = (isActive: boolean) =>
    `type-nav relative px-3 py-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-lg ${
      isActive
        ? 'text-[#14616d] bg-[#edf6f8]'
        : 'text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-colors duration-150 ${
        scrolled ? 'border-[#cbd5e1] shadow-xs' : 'border-[#e2e8f0]'
      }`}
    >
      <div
        id="main-header"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 h-[74px] sm:h-[80px]"
      >
        {/* Zone 1: Brand Wordmark / Logo */}
        <div className="logo_container flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center shrink-0 whitespace-nowrap"
          >
            {logoFailed ? (
              <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-[#0f172a] whitespace-nowrap">
                Easy Travel <span className="text-[#14616d]">Lodging</span>
              </span>
            ) : (
              <img
                src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
                alt="Easy Travel Lodging"
                id="logo"
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
                className="max-h-[50px] sm:max-h-[56px] w-auto object-contain cursor-pointer"
              />
            )}
          </a>
        </div>

        {/* Zone 2: Primary Desktop Navigation */}
        <div id="et-top-navigation" className="hidden xl:flex items-center">
          <nav id="top-menu-nav" aria-label="Main Navigation">
            <ul id="top-menu" className="flex items-center gap-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className={navLinkClass(currentTab === 'home')}
                >
                  Home
                </button>
              </li>

              {/* Residences Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => setPortfolioDropdownOpen(true)}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick('portfolio')}
                  className={`${navLinkClass(
                    ['portfolio', 'faq', 'terms'].includes(currentTab) || currentTab.startsWith('listing:'),
                  )} inline-flex items-center gap-1`}
                >
                  <span>Residences</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </button>

                {portfolioDropdownOpen && (
                  <div className="absolute top-full left-0 pt-1.5 w-80 z-50">
                    <div className="bg-white border border-[#e2e8f0] shadow-lg rounded-xl p-2 animate-scale-in origin-top-left">
                      <button
                        type="button"
                        onClick={() => handleNavClick('portfolio')}
                        className="type-support w-full text-left px-3.5 py-2.5 rounded-lg text-[#0f172a] hover:text-[#14616d] hover:bg-[#edf6f8] font-semibold flex items-center justify-between cursor-pointer"
                      >
                        <span>All Furnished Residences</span>
                        <span className="type-support text-[#14616d] font-medium">View All →</span>
                      </button>
                      <div className="border-t border-[#f1f5f9] my-1" />
                      <div className="max-h-64 overflow-y-auto space-y-0.5">
                        {navProperties.slice(0, 7).map((prop) => (
                          <button
                            key={prop.id}
                            type="button"
                            onClick={() => handleNavClick(`listing:${prop.id}`)}
                            className="type-support w-full text-left px-3.5 py-2 rounded-lg text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] flex justify-between items-center gap-2 cursor-pointer transition-colors"
                          >
                            <span className="truncate font-medium">Unit {prop.unitNumber}</span>
                            <span className="type-support font-mono tabular-nums text-[#14616d] font-semibold shrink-0">
                              ${prop.monthlyRate.toLocaleString()}/mo
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-[#f1f5f9] my-1" />
                      <button
                        type="button"
                        onClick={() => handleNavClick('guide')}
                        className="type-support w-full text-left px-3.5 py-2 rounded-lg font-medium text-[#475569] hover:text-[#14616d] hover:bg-[#edf6f8] flex items-center gap-2 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-[#14616d]" />
                        <span>California Destination Guide</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('vehicles')}
                  className={navLinkClass(currentTab === 'vehicles')}
                >
                  Car Rentals
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('corporate')}
                  className={navLinkClass(currentTab === 'corporate')}
                >
                  Corporate Stays
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className={navLinkClass(currentTab === 'about')}
                >
                  About
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className={navLinkClass(currentTab === 'contact')}
                >
                  Contact
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={navLinkClass(currentTab === 'dashboard' || currentTab === 'portal')}
                >
                  Client Portal
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Zone 3: Cart, Account Actions & Enlarged Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Trigger (Desktop) */}
          <div className="hidden xl:block relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] cursor-pointer transition-colors"
              aria-label="Search residences"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-full mt-2 w-72 bg-white p-2 rounded-xl shadow-lg border border-[#e2e8f0] z-50 flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-[#64748b] ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search residences or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border-0 focus:ring-0 focus:shadow-none outline-none text-[#0f172a]"
                  autoFocus
                />
              </form>
            )}
          </div>

          {/* Shopping Cart Trigger */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Shopping cart with ${cart.itemCount} items`}
            className={`btn btn-sm inline-flex items-center gap-2 border cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'cart' || currentTab === 'checkout'
                ? 'bg-[#0f172a] text-white border-[#0f172a]'
                : 'bg-white hover:bg-[#f8fafc] text-[#0f172a] border-[#cbd5e1] hover:border-[#14616d]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#14616d]" />
            <span className="hidden sm:inline font-semibold">Cart</span>
            <span className="px-1.5 py-0.5 rounded bg-[#14616d] text-white text-xs font-semibold leading-none tabular-nums">
              {cart.itemCount}
            </span>
          </button>

          {/* Desktop Auth Controls */}
          <div className="hidden xl:flex items-center gap-2 pl-2.5 border-l border-[#e2e8f0]">
            {authUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`btn btn-sm inline-flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                    currentTab === 'dashboard' || currentTab === 'portal'
                      ? 'bg-[#14616d] text-white border-[#14616d]'
                      : 'bg-[#edf6f8] hover:bg-[#e0f1f4] text-[#14616d] border-[#14616d]/25'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{firstName ? `${firstName}'s Portal` : 'My Portal'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="btn btn-sm btn-outline text-[#475569] hover:text-rose-700 hover:border-rose-300"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden 2xl:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="btn btn-sm btn-outline font-semibold"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="btn btn-sm btn-primary font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Enlarged Mobile Menu Trigger (48x48px with prominent 26px 3-bar icon) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-12 h-12 flex items-center justify-center cursor-pointer text-[#14616d] hover:text-[#0f4952] bg-[#f8fafc] hover:bg-[#edf6f8] border border-[#cbd5e1] rounded-xl transition-colors shrink-0 shadow-2xs"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[2.4] text-[#0f172a]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.4] text-[#14616d]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Sign In / Sign Up intentionally omitted per user request) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#e2e8f0] px-5 py-4 space-y-1.5 shadow-lg animate-fade-in-down">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'home' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('portfolio')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              ['portfolio', 'faq', 'terms'].includes(currentTab) || currentTab.startsWith('listing:')
                ? 'bg-[#edf6f8] text-[#14616d]'
                : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Furnished Residences
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('vehicles')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'vehicles' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Car Rentals &amp; 3D Fleet
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('corporate')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'corporate' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Corporate Stays
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('guide')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'guide' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Destination Guide
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'about' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'contact' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`type-nav w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
              currentTab === 'dashboard' || currentTab === 'portal'
                ? 'bg-[#edf6f8] text-[#14616d]'
                : 'text-[#0f172a] hover:bg-[#f8fafc]'
            }`}
          >
            {authUser ? `My Portal (${authUser.name})` : 'Client Dashboard'}
          </button>

          {authUser && (
            <div className="pt-3 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSignOut) onSignOut();
                }}
                className="btn btn-sm btn-outline w-full text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
