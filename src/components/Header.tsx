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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e6dfd5] shadow-2xs">
      <div
        id="main-header"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[86px]"
      >
        {/* Logo Container */}
        <div className="logo_container flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center"
          >
            {logoFailed ? (
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-bold text-lg tracking-tight text-[#282828] whitespace-nowrap">
                  Easy Travel <span className="text-[#00b7a8]">Lodging</span>
                </span>
              </div>
            ) : (
              <img
                src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
                alt="Easy Travel Lodging"
                id="logo"
                onError={() => setLogoFailed(true)}
                className="max-h-[64px] w-auto object-contain cursor-pointer"
              />
            )}
          </a>
        </div>

        {/* Desktop Navigation */}
        <div id="et-top-navigation" className="hidden xl:flex items-center gap-4">
          <nav id="top-menu-nav">
            <ul
              id="top-menu"
              className="flex items-center gap-1.5 type-nav font-medium text-[#555555]"
            >
              <li className={currentTab === 'home' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`type-nav hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'home' ? 'text-[#00b7a8] font-semibold' : ''
                  }`}
                >
                  Home
                </button>
              </li>

              {/* Accommodation (Residences) Dropdown */}
              <li
                className="relative menu-item-has-children"
                onMouseEnter={() => setPortfolioDropdownOpen(true)}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className={`type-nav flex items-center gap-1 hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    ['portfolio', 'faq', 'terms'].includes(currentTab) ||
                    currentTab.startsWith('listing:')
                      ? 'text-[#00b7a8] font-semibold'
                      : ''
                  }`}
                >
                  <span>Accommodation</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {portfolioDropdownOpen && (
                  <ul className="absolute top-full left-0 mt-1 w-80 bg-white border-t-2 border-[#00b7a8] border-x border-b border-x-[#e6dfd5] border-b-[#e6dfd5] shadow-xl rounded-b-md py-2 z-50 type-nav animate-in fade-in">
                    <li>
                      <button
                        onClick={() => handleNavClick('portfolio')}
                        className="w-full text-left px-4 py-2 text-[#282828] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-semibold cursor-pointer"
                      >
                        All Accommodation Listings
                      </button>
                    </li>
                    <li className="border-t border-[#efe9e0] my-1"></li>
                    {navProperties.slice(0, 8).map((prop) => (
                      <li key={prop.id}>
                        <button
                          onClick={() => handleNavClick(`listing:${prop.id}`)}
                          className="w-full text-left px-4 py-2 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] type-nav flex justify-between items-center gap-2 cursor-pointer"
                        >
                          <span className="truncate">
                            {prop.unitNumber} ({prop.code})
                          </span>
                          <span className="type-support text-[#82634f] font-semibold tabular-nums shrink-0">
                            ${prop.monthlyRate.toLocaleString()}/mo
                          </span>
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-[#efe9e0] my-1"></li>
                    <li>
                      <button
                        onClick={() => handleNavClick('guide')}
                        className="w-full text-left px-4 py-2 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-medium cursor-pointer"
                      >
                        Destination &amp; Area Guide
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              <li className={currentTab === 'vehicles' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('vehicles')}
                  className={`type-nav hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'vehicles' ? 'text-[#00b7a8] font-semibold' : ''
                  }`}
                >
                  Car Rentals
                </button>
              </li>

              <li className={currentTab === 'about' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`type-nav hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'about' ? 'text-[#00b7a8] font-semibold' : ''
                  }`}
                >
                  About Us
                </button>
              </li>

              <li className={currentTab === 'contact' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('contact')}
                  className={`type-nav hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'contact' ? 'text-[#00b7a8] font-semibold' : ''
                  }`}
                >
                  Contact
                </button>
              </li>

              <li
                className={
                  currentTab === 'dashboard' || currentTab === 'portal' ? 'current-menu-item' : ''
                }
              >
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`type-nav hover:text-[#00b7a8] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'dashboard' || currentTab === 'portal'
                      ? 'text-[#00b7a8] font-semibold'
                      : ''
                  }`}
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 pl-2 border-l border-[#e6dfd5]">
            {/* Live Shopping Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Shopping cart with ${cart.itemCount} items`}
              className={`type-btn relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                currentTab === 'cart' || currentTab === 'checkout'
                  ? 'bg-[#282828] text-white border-[#282828]'
                  : 'bg-white hover:bg-[#faf8f5] text-[#282828] border-[#dcd3c7] hover:border-[#00b7a8]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#00b7a8]" />
              <span>Cart</span>
              <span className="px-1.5 py-0.5 rounded bg-[#00b7a8] text-white text-xs font-semibold leading-none tabular-nums">
                {cart.itemCount}
              </span>
            </button>

            {authUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`type-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                    currentTab === 'dashboard' || currentTab === 'portal'
                      ? 'bg-[#00b7a8] text-white border-[#00b7a8]'
                      : 'bg-[#e8f8f6] hover:bg-[#d5f3ef] text-[#00897d] border-[#00b7a8]/40'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{firstName ? `${firstName}'s Dashboard` : 'My Dashboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="type-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#555555] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className={`type-btn px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentTab === 'login'
                      ? 'text-[#00b7a8] font-bold'
                      : 'text-[#555555] hover:text-[#00b7a8]'
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className={`type-btn px-3.5 py-2 rounded-lg transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                    currentTab === 'register'
                      ? 'bg-[#00b7a8] text-white border-[#00b7a8]'
                      : 'bg-white hover:bg-[#e6f8f6] text-[#00897d] border-[#00b7a8]/40'
                  }`}
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Search Icon */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#666666] hover:text-[#00b7a8] p-2 cursor-pointer transition-colors"
                aria-label="Search residences"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-full mt-2 w-72 bg-white p-2 rounded-lg shadow-lg border border-[#e6dfd5] z-50 flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Search residences & amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm outline-none text-[#282828]"
                    autoFocus
                  />
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Controls (Cart + Search + Hamburger Menu) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open cart (${cart.itemCount} items)`}
            className="type-btn inline-flex xl:hidden items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dcd3c7] bg-white text-[#282828] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#00b7a8]" />
            <span className="tabular-nums font-semibold">{cart.itemCount}</span>
          </button>

          <div className="relative xl:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#282828] hover:text-[#00b7a8] p-2 cursor-pointer transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-full mt-2 w-64 bg-white p-2 rounded-xl shadow-xl border border-[#e6dfd5] z-50 flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search residences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm outline-none text-[#282828]"
                  autoFocus
                />
              </form>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 cursor-pointer text-[#00897d] hover:text-[#00b7a8] transition-colors rounded-xl hover:bg-[#faf8f5]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3.2] transform scale-125" />
            ) : (
              <Menu className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3.2] transform scale-125" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="bg-white border-t border-[#e6dfd5] px-6 py-4 space-y-1 shadow-md animate-in fade-in">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              currentTab === 'home' ? 'text-[#00b7a8] font-bold' : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('portfolio')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              ['portfolio', 'faq', 'terms'].includes(currentTab) ||
              currentTab.startsWith('listing:')
                ? 'text-[#00b7a8] font-bold'
                : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            Accommodation
          </button>

          <button
            onClick={() => handleNavClick('vehicles')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              currentTab === 'vehicles' ? 'text-[#00b7a8] font-bold' : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            Car Rentals
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              currentTab === 'about' ? 'text-[#00b7a8] font-bold' : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              currentTab === 'contact' ? 'text-[#00b7a8] font-bold' : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            Contact
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`block w-full text-left py-2.5 type-nav cursor-pointer text-base sm:text-lg ${
              currentTab === 'dashboard' || currentTab === 'portal'
                ? 'text-[#00b7a8] font-bold'
                : 'text-[#282828] font-medium hover:text-[#00b7a8]'
            }`}
          >
            {authUser ? `My Dashboard (${authUser.name})` : 'Dashboard'}
          </button>

          {authUser && (
            <div className="pt-2 border-t border-[#efe9e0]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSignOut) onSignOut();
                }}
                className="block w-full text-left py-2.5 type-nav font-semibold text-rose-700 hover:text-rose-800 cursor-pointer text-base sm:text-lg"
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
