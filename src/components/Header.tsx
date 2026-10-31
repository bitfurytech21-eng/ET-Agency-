import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/lodgingData';
import { Search, ChevronDown, Menu, X, Car, User } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenBooking: (propertyId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    setPortfolioDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentTab('portfolio');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5] shadow-xs">
      <div id="main-header" className="max-w-[1331px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[86px]">
        {/* Logo Container */}
        <div className="logo_container flex items-center">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center"
          >
            <img
              src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
              alt="Easy Travel Lodging"
              id="logo"
              className="max-h-[66px] w-auto object-contain cursor-pointer"
            />
          </a>
        </div>

        {/* Desktop Navigation matching Divi #top-menu */}
        <div id="et-top-navigation" className="hidden lg:flex items-center gap-6">
          <nav id="top-menu-nav">
            <ul id="top-menu" className="flex items-center gap-5 text-[14px] font-semibold tracking-normal text-[#666666]">
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

              <li className={currentTab === 'corporate' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('corporate')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'corporate' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Corporate Housing
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
                  Want To Be A Host?
                </button>
              </li>

              {/* Portfolio Dropdown (Divi sub-menu) */}
              <li 
                className="relative menu-item-has-children"
                onMouseEnter={() => setPortfolioDropdownOpen(true)}
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className={`flex items-center gap-1 hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    ['portfolio', 'faq', 'terms'].includes(currentTab) ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  <span>Portfolio</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {portfolioDropdownOpen && (
                  <ul className="absolute top-full left-0 mt-1 w-64 bg-white border-t-2 border-[#00b7a8] shadow-xl rounded-b-md py-2 z-50 text-[13px] animate-in fade-in">
                    <li>
                      <button
                        onClick={() => handleNavClick('portfolio')}
                        className="w-full text-left px-4 py-1.5 text-slate-900 hover:text-[#00b7a8] hover:bg-slate-50 font-bold"
                      >
                        All Listings (#A - #E)
                      </button>
                    </li>
                    <li className="border-t border-slate-100 my-1"></li>
                    <li>
                      <button
                        onClick={() => handleNavClick('listing:unit-91')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 text-xs flex justify-between"
                      >
                        <span>Unit 91 (#A) - 1 Bed / 1 Bath</span>
                        <span className="text-slate-400">$2,500</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('listing:unit-173')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 text-xs flex justify-between"
                      >
                        <span>Unit 173 (#B) - 1 Bed / 1 Bath</span>
                        <span className="text-slate-400">$2,500</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('listing:unit-250')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 text-xs flex justify-between"
                      >
                        <span>Unit 250 (#C) - 2 Bed / 2 Bath</span>
                        <span className="text-slate-400">$2,800</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('listing:unit-333')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 text-xs flex justify-between"
                      >
                        <span>Unit 333 (#D) - 2 Bed / 2 Bath</span>
                        <span className="text-slate-400">$2,800</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('listing:unit-335')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 text-xs flex justify-between"
                      >
                        <span>Unit 335 (#E) - 2 Bed / 2 Bath</span>
                        <span className="text-slate-400">$2,800</span>
                      </button>
                    </li>
                    <li className="border-t border-slate-100 my-1"></li>
                    <li>
                      <button
                        onClick={() => handleNavClick('faq')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 font-medium"
                      >
                        FAQs
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavClick('terms')}
                        className="w-full text-left px-4 py-1.5 text-[#666666] hover:text-[#00b7a8] hover:bg-slate-50 font-medium"
                      >
                        Terms and Conditions
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Fleet Rentals (3D US Cars) */}
              <li className={currentTab === 'vehicles' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('vehicles')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'vehicles' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-[#00b7a8]" />
                  <span>Fleet Rentals</span>
                </button>
              </li>

              <li className={currentTab === 'blog' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('blog')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'blog' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Blog
                </button>
              </li>

              <li className={currentTab === 'contact' ? 'current-menu-item' : ''}>
                <button
                  onClick={() => handleNavClick('contact')}
                  className={`hover:text-[#00b7a8] transition-colors cursor-pointer ${
                    currentTab === 'contact' ? 'text-[#00b7a8] font-bold' : ''
                  }`}
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </nav>

          {/* Client Portal / Dashboard Sign In CTA */}
          <button
            onClick={() => handleNavClick('portal')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              currentTab === 'portal'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-stone-50 hover:bg-[#e6f8f6] text-slate-800 border-stone-300 hover:border-[#00b7a8] hover:text-[#00897d]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#00b7a8]" />
            <span>Client Sign In</span>
          </button>

          {/* Search Icon */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#666666] hover:text-[#00b7a8] p-1 cursor-pointer transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-full mt-2 w-64 bg-white p-2 rounded shadow-lg border border-slate-200 z-50 flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-xs outline-none"
                  autoFocus
                />
              </form>
            )}
          </div>
        </div>

        {/* Mobile Navigation Icons (Search & Hamburger) */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-slate-800 hover:text-[#00b7a8] p-1.5 cursor-pointer transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-full mt-2 w-64 bg-white p-2 rounded-xl shadow-xl border border-slate-200 z-50 flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-xs outline-none"
                  autoFocus
                />
              </form>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 cursor-pointer text-[#358385] hover:text-[#00b7a8] transition-colors"
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

      {/* Mobile Drawer matching Divi mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-2 shadow-md">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'home' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('corporate')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'corporate' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Corporate Housing
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'about' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('beahost')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'beahost' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Want To Be A Host?
          </button>
          <button
            onClick={() => handleNavClick('portfolio')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'portfolio' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`block w-full text-left py-2 text-sm font-semibold pl-4 text-xs ${
              currentTab === 'faq' ? 'text-[#00b7a8]' : 'text-[#777777]'
            }`}
          >
            ↳ FAQs
          </button>
          <button
            onClick={() => handleNavClick('terms')}
            className={`block w-full text-left py-2 text-sm font-semibold pl-4 text-xs ${
              currentTab === 'terms' ? 'text-[#00b7a8]' : 'text-[#777777]'
            }`}
          >
            ↳ Terms and Conditions
          </button>
          <button
            onClick={() => handleNavClick('vehicles')}
            className={`block w-full text-left py-2 text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'vehicles' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            <Car className="w-4 h-4 text-[#00b7a8]" />
            <span>Fleet Rentals (3D)</span>
          </button>
          <button
            onClick={() => handleNavClick('portal')}
            className={`block w-full text-left py-2 text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'portal' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            <User className="w-4 h-4 text-[#00b7a8]" />
            <span>Client Dashboard &amp; Units Sign In</span>
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'blog' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left py-2 text-sm font-semibold ${
              currentTab === 'contact' ? 'text-[#00b7a8]' : 'text-[#666666]'
            }`}
          >
            Contact Us
          </button>
        </div>
      )}
    </header>
  );
};
