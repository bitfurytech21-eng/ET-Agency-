import React, { useState } from 'react';
import { PROPERTIES } from '../data/lodgingData';
import { useCart } from '../context/CartContext';
import { WeatherWidget } from './WeatherWidget';
import { Search, ChevronDown, Menu, X, User, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: (propertyId?: string) => void;
  onSearchListings?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onSearchListings,
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e6dfd5] shadow-2xs">
      <div id="main-header" className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[86px]">
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
                <span className="font-heading font-black text-lg tracking-tight text-[#282828]">
                  EASY TRAVEL <span className="text-[#00b7a8]">LODGING</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#82634f]">
                  Furnished Stays &amp; Mobility
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
        <div id="et-top-navigation" className="hidden xl:flex items-center gap-5">
          <nav id="top-menu-nav">
            <ul id="top-menu" className="flex items-center gap-4 text-[13.5px] font-semibold tracking-normal text-[#555555]">
              <li className={currentTab === 'home' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'home' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Home
                </button>
              </li>

              {/* Residences Dropdown */}
              <li
                className="relative menu-item-has-children"
                onMouseEnter={() => setPortfolioDropdownOpen(true)}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className={`flex items-center gap-1 hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    ['portfolio', 'faq', 'terms'].includes(currentTab) || currentTab.startsWith('listing:')
                      ? 'text-[#00b7a8] font-bold'
                      : ''
                  }`}
                >
                  <span>Residences</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {portfolioDropdownOpen && (
                  <ul className="absolute top-full left-0 mt-1 w-72 bg-white border-t-2 border-[#00b7a8] border-x border-b border-x-[#e6dfd5] border-b-[#e6dfd5] shadow-xl rounded-b-md py-2 z-50 text-[13px] animate-in fade-in">
                    <li>
                      <button
                        onClick={() => handleNavClick('portfolio')}
                        className="w-full text-left px-4 py-1.5 text-[#282828] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-bold cursor-pointer"
                      >
                        All Furnished Residences (#A – #E)
                      </button>
                    </li>
                    <li className="border-t border-[#efe9e0] my-1"></li>
                    {navProperties.map((prop) => (
                      <li key={prop.id}>
                        <button
                          onClick={() => handleNavClick(`listing:${prop.id}`)}
                          className="w-full text-left px-4 py-1.5 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] text-xs flex justify-between items-center gap-2 cursor-pointer"
                        >
                          <span className="truncate">
                            {prop.unitNumber} ({prop.code}) · {prop.bedrooms}BR/{prop.bathrooms}BA
                          </span>
                          <span className="text-[#82634f] font-semibold tabular-nums shrink-0">
                            ${prop.monthlyRate.toLocaleString()}/mo
                          </span>
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-[#efe9e0] my-1"></li>
                    <li>
                      <button
                        onClick={() => handleNavClick('guide')}
                        className="w-full text-left px-4 py-1.5 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-medium cursor-pointer"
                      >
                        Regional Area Guide
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('faq')}
                        className="w-full text-left px-4 py-1.5 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-medium cursor-pointer"
                      >
                        FAQs &amp; Guest Help
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('terms')}
                        className="w-full text-left px-4 py-1.5 text-[#555555] hover:text-[#00b7a8] hover:bg-[#faf8f5] font-medium cursor-pointer"
                      >
                        Booking Terms &amp; Guidelines
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              <li className={currentTab === 'corporate' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('corporate')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'corporate' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Extended &amp; Group Stays
                </button>
              </li>

              <li className={currentTab === 'about' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'about' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  About Us
                </button>
              </li>

              <li className={currentTab === 'beahost' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('beahost')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'beahost' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Host Services
                </button>
              </li>

              <li className={currentTab === 'blog' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('blog')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'blog' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Insights
                </button>
              </li>

              <li className={currentTab === 'contact' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('contact')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'contact' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2.5 pl-1 border-l border-[#e6dfd5]">
            {/* Live Weather Widget Badge for California Guests */}
            <WeatherWidget compact className="hidden xl:inline-flex" />

            {/* Live Shopping Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Shopping cart with ${cart.itemCount} items`}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                currentTab === 'cart' || currentTab === 'checkout'
                  ? 'bg-[#282828] text-white border-[#282828]'
                  : 'bg-white hover:bg-[#faf8f5] text-[#282828] border-[#dcd3c7] hover:border-[#00b7a8]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#00b7a8]" />
              <span>Cart</span>
              <span className="px-1.5 py-0.5 rounded bg-[#00b7a8] text-white text-[11px] font-extrabold leading-none tabular-nums">
                {cart.itemCount}
              </span>
            </button>

            {/* Client Portal Sign In */}
            <button
              type="button"
              onClick={() => handleNavClick('portal')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                currentTab === 'portal'
                  ? 'bg-[#82634f] text-white border-[#82634f]'
                  : 'bg-[#faf8f5] hover:bg-[#e6f8f6] text-[#282828] border-[#dcd3c7] hover:border-[#00b7a8] hover:text-[#00897d]'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${currentTab === 'portal' ? 'text-white' : 'text-[#00b7a8]'}`} />
              <span>Client Portal</span>
            </button>

            {/* Search Icon */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#666666] hover:text-[#00b7a8] p-1.5 cursor-pointer transition-colors"
                aria-label="Search residences"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-full mt-2 w-64 bg-white p-2 rounded-lg shadow-lg border border-[#e6dfd5] z-50 flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Search residences & amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-2 py-1 text-xs outline-none text-[#282828]"
                    autoFocus
                  />
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Controls (Cart + Search + Hamburger) */}
        <div className="xl:hidden flex items-center gap-2.5">
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Open cart (${cart.itemCount} items)`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dcd3c7] bg-white text-[#282828] text-xs font-bold cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#00b7a8]" />
            <span className="tabular-nums font-extrabold">{cart.itemCount}</span>
          </button>

          <div className="relative">
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
                  className="w-full px-2 py-1 text-xs outline-none text-[#282828]"
                  autoFocus
                />
              </form>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 cursor-pointer text-[#358385] hover:text-[#00b7a8] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 stroke-[2.5]" />
            ) : (
              <Menu className="w-7 h-7 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-[#e6dfd5] px-6 py-4 space-y-1.5 shadow-md">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'home' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'about' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('beahost')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'beahost' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            Property Owner &amp; Host Services
          </button>
          <button
            onClick={() => handleNavClick('guide')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'guide' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            Regional Area Guide
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`block w-full text-left py-2 text-xs font-semibold pl-4 cursor-pointer ${
              currentTab === 'faq' ? 'text-[#00b7a8]' : 'text-[#777777]'
            }`}
          >
            ↳ FAQs &amp; Help
          </button>
          <button
            onClick={() => handleNavClick('terms')}
            className={`block w-full text-left py-2 text-xs font-semibold pl-4 cursor-pointer ${
              currentTab === 'terms' ? 'text-[#00b7a8]' : 'text-[#777777]'
            }`}
          >
            ↳ Terms &amp; Guidelines
          </button>
          <button
            onClick={() => handleNavClick('portal')}
            className={`w-full text-left py-2 text-sm font-semibold flex items-center gap-2 cursor-pointer ${
              currentTab === 'portal' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            <User className="w-4 h-4 text-[#00b7a8]" />
            <span>Client Portal &amp; Lodging Units</span>
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'blog' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            Insights &amp; Articles
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left py-2 text-sm font-semibold cursor-pointer ${
              currentTab === 'contact' ? 'text-[#00b7a8]' : 'text-[#555555]'
            }`}
          >
            Contact Us
          </button>
        </div>
      )}
    </header>
  );
};
