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
  Building2,
  Car,
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
      setScrolled(window.scrollY > 15);
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

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-200 ${
      scrolled ? 'border-[#d5cbbf] shadow-sm' : 'border-[#e6dfd5] shadow-xs'
    }`}>
      <div
        id="main-header"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[76px] sm:h-[82px]"
      >
        {/* Zone 1: Logo & Brand */}
        <div className="logo_container flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-3 group"
          >
            {logoFailed ? (
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#182024] whitespace-nowrap">
                  Easy Travel <span className="text-[#14616d]">Lodging</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#738089] font-medium">
                  Furnished Residences &amp; Fleet
                </span>
              </div>
            ) : (
              <img
                src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
                alt="Easy Travel Lodging"
                id="logo"
                onError={() => setLogoFailed(true)}
                className="max-h-[52px] sm:max-h-[60px] w-auto object-contain cursor-pointer transition-transform group-hover:scale-[1.01]"
              />
            )}
          </a>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <div id="et-top-navigation" className="hidden xl:flex items-center gap-6">
          <nav id="top-menu-nav" aria-label="Main Navigation">
            <ul id="top-menu" className="flex items-center gap-2 type-nav font-medium text-[#4a545c]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    currentTab === 'home'
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  Home
                </button>
              </li>

              {/* Accommodation (Residences) Dropdown */}
              <li
                className="relative"
                onMouseEnter={() => setPortfolioDropdownOpen(true)}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick('portfolio')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    ['portfolio', 'faq', 'terms'].includes(currentTab) || currentTab.startsWith('listing:')
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Residences</span>
                  <ChevronDown className="w-3 h-3 text-[#738089]" />
                </button>

                {portfolioDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-[#e6dfd5] shadow-xl rounded-xl p-2 z-50 animate-scale-in origin-top-left">
                    <button
                      type="button"
                      onClick={() => handleNavClick('portfolio')}
                      className="w-full text-left px-3.5 py-2.5 rounded-lg text-[#182024] hover:text-[#14616d] hover:bg-[#edf6f8] font-bold text-xs flex items-center justify-between cursor-pointer"
                    >
                      <span>All Furnished Residences</span>
                      <span className="text-[11px] text-[#14616d] font-mono">View All →</span>
                    </button>
                    <div className="border-t border-[#f0eae1] my-1" />
                    <div className="max-h-64 overflow-y-auto space-y-0.5">
                      {navProperties.slice(0, 7).map((prop) => (
                        <button
                          key={prop.id}
                          type="button"
                          onClick={() => handleNavClick(`listing:${prop.id}`)}
                          className="w-full text-left px-3.5 py-2 rounded-lg text-[#4a545c] hover:text-[#14616d] hover:bg-[#faf7f2] text-xs flex justify-between items-center gap-2 cursor-pointer transition-colors"
                        >
                          <span className="truncate font-medium">Unit {prop.unitNumber}</span>
                          <span className="text-[11px] font-mono text-[#966746] font-bold shrink-0">
                            ${prop.monthlyRate.toLocaleString()}/mo
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[#f0eae1] my-1" />
                    <button
                      type="button"
                      onClick={() => handleNavClick('guide')}
                      className="w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold text-[#68737a] hover:text-[#14616d] hover:bg-[#edf6f8] flex items-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#14616d]" />
                      <span>Destination &amp; Area Guide</span>
                    </button>
                  </div>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('vehicles')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    currentTab === 'vehicles'
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>3D Fleet Rentals</span>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    currentTab === 'about'
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  About Us
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    currentTab === 'contact'
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  Contact
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    currentTab === 'dashboard' || currentTab === 'portal'
                      ? 'text-[#14616d] bg-[#edf6f8]'
                      : 'hover:text-[#14616d] hover:bg-[#faf7f2]'
                  }`}
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Zone 3: Actions (Cart + Sign In / User Dashboard + Mobile Trigger) */}
        <div className="flex items-center gap-3">
          {/* Live Shopping Cart Trigger */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Shopping cart with ${cart.itemCount} items`}
            className={`btn btn-sm inline-flex items-center gap-2 border cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'cart' || currentTab === 'checkout'
                ? 'bg-[#182024] text-white border-[#182024]'
                : 'bg-white hover:bg-[#faf7f2] text-[#182024] border-[#d6cfc5] hover:border-[#14616d]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#14616d]" />
            <span className="hidden sm:inline font-semibold text-xs">Cart</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#14616d] text-white text-[11px] font-bold leading-none tabular-nums">
              {cart.itemCount}
            </span>
          </button>

          {/* Desktop Auth Controls */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-[#e6dfd5]">
            {authUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`btn btn-sm inline-flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
                    currentTab === 'dashboard' || currentTab === 'portal'
                      ? 'bg-[#14616d] text-white border-[#14616d]'
                      : 'bg-[#edf6f8] hover:bg-[#e0f1f4] text-[#14616d] border-[#14616d]/30'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{firstName ? `${firstName}'s Dashboard` : 'My Dashboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="btn btn-sm btn-outline text-xs text-[#5c6770] hover:text-rose-700 hover:border-rose-300"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden 2xl:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="btn btn-sm btn-outline text-xs text-[#354047] font-semibold"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="btn btn-sm btn-primary text-xs font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Quick Search */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-[#5c6770] hover:text-[#14616d] hover:bg-[#faf7f2] cursor-pointer transition-colors"
                aria-label="Search residences"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-full mt-2 w-72 bg-white p-2 rounded-xl shadow-xl border border-[#e6dfd5] z-50 flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Search residences &amp; amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs outline-none text-[#182024]"
                    autoFocus
                  />
                </form>
              )}
            </div>
          </div>

          {/* Mobile Menu Button (Comfortable 44px Touch Target with proportional icon) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-11 h-11 flex items-center justify-center cursor-pointer text-[#182024] hover:text-[#14616d] bg-[#faf7f2] hover:bg-[#f0ece4] border border-[#d6cfc5] rounded-xl transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#182024]" />
            ) : (
              <Menu className="w-5 h-5 text-[#182024]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Responsive, Clean, Structured) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#e6dfd5] px-5 py-4 space-y-2 shadow-lg animate-fade-in-down">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              currentTab === 'home' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('portfolio')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              ['portfolio', 'faq', 'terms'].includes(currentTab) || currentTab.startsWith('listing:')
                ? 'bg-[#edf6f8] text-[#14616d]'
                : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            Furnished Residences
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('vehicles')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              currentTab === 'vehicles' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            Curated 3D Fleet Rentals
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              currentTab === 'about' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              currentTab === 'contact' ? 'bg-[#edf6f8] text-[#14616d]' : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors ${
              currentTab === 'dashboard' || currentTab === 'portal'
                ? 'bg-[#edf6f8] text-[#14616d]'
                : 'text-[#182024] hover:bg-[#faf7f2]'
            }`}
          >
            {authUser ? `My Dashboard (${authUser.name})` : 'Client Dashboard'}
          </button>

          <div className="pt-3 border-t border-[#f0eae1] flex items-center gap-2.5">
            {authUser ? (
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
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="btn btn-sm btn-outline flex-1"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="btn btn-sm btn-primary flex-1"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
