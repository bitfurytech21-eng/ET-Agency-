/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, startTransition } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HomeShowcaseSection } from './components/HomeShowcaseSection';
import { AwardsSection } from './components/AwardsSection';
import { PropertiesSection } from './components/PropertiesSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AreaGuideSection } from './components/AreaGuideSection';
import { CorporateView } from './components/CorporateView';
import { AboutView } from './components/AboutView';
import { HostDesignView } from './components/HostDesignView';
import { FAQView } from './components/FAQView';
import { TermsView } from './components/TermsView';
import { BlogView } from './components/BlogView';
import { ContactSection } from './components/ContactSection';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { BrochureModal } from './components/BrochureModal';
import { PropertyDetailView } from './components/PropertyDetailView';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { VehicleBookingModal } from './components/VehicleBookingModal';
import { VehiclesSection } from './components/VehiclesSection';
import { CustomerPortal } from './components/CustomerPortal';
import { SignInView } from './components/SignInView';
import { RegisterView } from './components/RegisterView';
import { AdminPortal } from './components/AdminPortal';
import { CartDrawer } from './components/CartDrawer';
import { ShopServicesSection } from './components/ShopServicesSection';
import { CartCheckoutView } from './components/CartCheckoutView';
import { LivePhotoBackground } from './components/LivePhotoBackground';
import { CartProvider, useCart } from './context/CartContext';
import { PROPERTIES } from './data/lodgingData';
import { UsVehicle } from './data/vehicleData';
import { FloatingConcierge } from './components/FloatingConcierge';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { BrandedPageLoader } from './components/common/BrandedPageLoader';

const ROUTE_MAP: Record<string, string> = {
  corporate: 'corporate',
  'extended-stays': 'corporate',
  portfolio: 'portfolio',
  residences: 'portfolio',
  about: 'about',
  'about-us': 'about',
  beahost: 'beahost',
  'want-to-be-a-host': 'beahost',
  guide: 'guide',
  'area-guide': 'guide',
  faq: 'faq',
  faqs: 'faq',
  terms: 'terms',
  'terms-and-conditions': 'terms',
  blog: 'blog',
  contact: 'contact',
  'contact-us': 'contact',
  privacy: 'privacy',
  'privacy-policy': 'privacy',
  vehicles: 'vehicles',
  fleet: 'vehicles',
  cars: 'vehicles',
  'car-rentals': 'vehicles',
  'vehicle-rentals': 'vehicles',
  shop: 'shop',
  services: 'shop',
  packages: 'shop',
  store: 'shop',
  cart: 'cart',
  checkout: 'checkout',
  orders: 'cart',
  'track-order': 'cart',
  portal: 'dashboard',
  'client-portal': 'dashboard',
  dashboard: 'dashboard',
  units: 'dashboard',
  login: 'login',
  signin: 'login',
  'sign-in': 'login',
  register: 'register',
  signup: 'register',
  'sign-up': 'register',
  'create-account': 'register',
  admin: 'admin',
  'admin-portal': 'admin',
};

function AppShell() {
  const { liveProperties, isLoading: isDataLoading } = useCart();
  const activeProperties = liveProperties.length > 0 ? liveProperties : PROPERTIES;

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [brochureOpen, setBrochureOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('any');
  const [modalDate, setModalDate] = useState('');
  const [modalDuration, setModalDuration] = useState('30-60');

  // 3D Fleet Vehicle Booking Modal state
  const [vehicleModalOpen, setVehicleModalOpen] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<UsVehicle | null>(null);
  const [selectedVehicleColor, setSelectedVehicleColor] = useState<string | undefined>(undefined);

  // Portfolio search filter state
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState<string>('');

  // Auth state & redirect notice
  const [, setAuthToken] = useState<string | null>(() => localStorage.getItem('etl_php_token'));
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      setAuthToken(localStorage.getItem('etl_php_token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Resolve both URL hash (#admin) and direct URL pathname (/admin)
  useEffect(() => {
    const resolveLocation = () => {
      const hashToken = window.location.hash.replace('#', '').replace(/^\//, '').replace(/\/$/, '');
      const pathToken = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
      const rawRoute = hashToken || pathToken;

      if (!rawRoute || rawRoute === 'home' || rawRoute === 'index.html') {
        setCurrentTab('home');
        return;
      }

      const normalized = rawRoute.toLowerCase();
      const resolved =
        ROUTE_MAP[normalized] ||
        (rawRoute.startsWith('listing:') ? rawRoute : null);

      if (resolved === 'dashboard') {
        const token = localStorage.getItem('etl_php_token');
        if (!token) {
          setAuthNotice('Sign in required to access your Client Dashboard. Create an account below if you do not have one yet.');
          setCurrentTab('login');
          window.location.hash = 'login';
          return;
        }
      }

      if (resolved) {
        startTransition(() => {
          setCurrentTab(resolved);
        });
        return;
      }

      const matched = PROPERTIES.find(
        (p) => p.slug === rawRoute || p.id === rawRoute || p.unitNumber === rawRoute || p.code === rawRoute,
      );
      if (matched) {
        startTransition(() => {
          setCurrentTab(`listing:${matched.id}`);
        });
        return;
      }

      setCurrentTab('home');
    };

    resolveLocation();
    window.addEventListener('hashchange', resolveLocation);
    window.addEventListener('popstate', resolveLocation);
    return () => {
      window.removeEventListener('hashchange', resolveLocation);
      window.removeEventListener('popstate', resolveLocation);
    };
  }, []);

  const handleOpenBooking = (propertyId?: string, moveInDate?: string, duration?: string) => {
    setSelectedPropertyId(propertyId || 'any');
    if (moveInDate) {
      setModalDate(moveInDate);
    }
    if (duration) {
      setModalDuration(duration);
    }
    setBookingModalOpen(true);
  };

  const navigateToTab = (tab: string) => {
    if (tab === 'dashboard' || tab === 'portal') {
      const token = localStorage.getItem('etl_php_token');
      if (!token) {
        setAuthNotice('Sign in required to access your Client Dashboard. Create an account below if you do not have one yet.');
        setCurrentTab('login');
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/#login');
        } else {
          window.location.hash = 'login';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsNavigating(true);
    startTransition(() => {
      setCurrentTab(tab);
      if (tab === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (window.location.pathname !== '/') {
        window.history.pushState(null, '', `/#${tab}`);
      } else {
        window.location.hash = tab;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    setTimeout(() => {
      setIsNavigating(false);
    }, 160);
  };

  const knownViews = [
    'corporate',
    'portfolio',
    'about',
    'beahost',
    'guide',
    'faq',
    'terms',
    'blog',
    'contact',
    'privacy',
    'vehicles',
    'shop',
    'cart',
    'checkout',
    'portal',
    'dashboard',
    'login',
    'register',
    'admin',
  ];

  const isDedicatedAppShell = ['portal', 'dashboard', 'admin'].includes(currentTab);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans">
      {!isDedicatedAppShell && (
        <Header
          currentTab={currentTab}
          setCurrentTab={navigateToTab}
          onOpenBooking={() => handleOpenBooking()}
          onSearchListings={(q) => {
            setPortfolioSearchQuery(q);
            navigateToTab('portfolio');
          }}
        />
      )}

      <main className="flex-1">
        <Suspense fallback={<LoadingSkeleton type={currentTab === 'portfolio' ? 'card' : 'hero'} count={3} />}>
          {isNavigating || isDataLoading ? (
            <LoadingSkeleton type={currentTab === 'portfolio' ? 'card' : currentTab.startsWith('listing:') ? 'detail' : 'hero'} count={3} />
          ) : (
            <div key={currentTab} className="page-transition-wrapper">
              {(currentTab === 'home' ||
                (!knownViews.includes(currentTab) && !currentTab.startsWith('listing:'))) && (
                <>
                  <Hero
                    onExploreListings={() => navigateToTab('portfolio')}
                    onExploreVehicles={() => navigateToTab('vehicles')}
                    onOpenBooking={(propId, date, dur) => handleOpenBooking(propId, date, dur)}
                    onOpenBrochure={() => setBrochureOpen(true)}
                    onLearnEthics={() => navigateToTab('about')}
                  />
                  <HomeShowcaseSection
                    properties={activeProperties}
                    onViewProperty={(property) => navigateToTab(`listing:${property.id}`)}
                    onBookProperty={(id) => handleOpenBooking(id)}
                    onExploreAllProperties={() => navigateToTab('portfolio')}
                    onReserveVehicle={(vehicle) => {
                      setSelectedVehicle(vehicle);
                      setSelectedVehicleColor(vehicle.defaultColor);
                      setVehicleModalOpen(true);
                    }}
                    onExploreAllVehicles={() => navigateToTab('vehicles')}
                  />
                  <AwardsSection
                    onOpenBrochure={() => setBrochureOpen(true)}
                    onExploreListings={() => navigateToTab('portfolio')}
                  />
                  <ReviewsSection />
                  <AmenitiesSection />
                  <AreaGuideSection
                    onOpenBooking={() => handleOpenBooking()}
                    onOpenDiscoveryCall={() => navigateToTab('beahost')}
                  />
                </>
              )}

              {currentTab === 'corporate' && (
                <CorporateView
                  onOpenBooking={() => handleOpenBooking()}
                  onOpenBrochure={() => setBrochureOpen(true)}
                  onOpenDiscoveryCall={() => navigateToTab('beahost')}
                />
              )}

              {currentTab === 'portfolio' && (
                <>
                  <div className="relative overflow-hidden py-16 sm:py-20 px-4 text-center text-white border-b border-[#1e293b]">
                    <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-3.5">
                      <span className="type-support font-semibold text-[#5eead4] tracking-wide block">
                        Furnished Residences · California Portfolio
                      </span>
                      <h1 className="type-h1 text-white">
                        1- &amp; 2-Bedroom Furnished Apartments &amp; Suites
                      </h1>
                      <p className="type-body-lg text-slate-200 max-w-2xl mx-auto">
                        Move-in-ready furnished residences and corporate housing across California for flexible stays (5+ nights), extended 30+ day corporate leases, family relocations, and organizational housing.
                      </p>
                    </div>
                  </div>
                  <PropertiesSection
                    properties={activeProperties}
                    onSelectPropertyForBooking={(id, date, dur) => handleOpenBooking(id, date, dur)}
                    onViewListingDetails={(property) => navigateToTab(`listing:${property.id}`)}
                    onNavigate={navigateToTab}
                    searchQuery={portfolioSearchQuery}
                    onClearSearch={() => setPortfolioSearchQuery('')}
                  />
                  <AmenitiesSection />
                </>
              )}

              {currentTab.startsWith('listing:') &&
                (() => {
                  const propId = currentTab.replace('listing:', '');
                  const property =
                    activeProperties.find((p) => p.id === propId || p.slug === propId) ||
                    activeProperties[0];
                  return (
                    <PropertyDetailView
                      property={property}
                      onBack={() => navigateToTab('portfolio')}
                      onOpenBooking={(id, date, dur) => handleOpenBooking(id, date, dur)}
                      onSelectAnotherProperty={(id) => navigateToTab(`listing:${id}`)}
                      onNavigate={navigateToTab}
                    />
                  );
                })()}

              {currentTab === 'about' && (
                <>
                  <AboutView onOpenBooking={() => handleOpenBooking()} />
                  <AwardsSection
                    onOpenBrochure={() => setBrochureOpen(true)}
                    onExploreListings={() => navigateToTab('portfolio')}
                  />
                  <ReviewsSection />
                </>
              )}

              {currentTab === 'beahost' && <HostDesignView />}

              {currentTab === 'guide' && (
                <>
                  <div className="relative overflow-hidden py-16 sm:py-20 px-4 text-center text-white border-b border-[#1e293b]">
                    <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-3.5">
                      <span className="type-support font-semibold text-[#5eead4] tracking-wide block">
                        California Regional Guide
                      </span>
                      <h1 className="type-h1 text-white">
                        California Destinations &amp; Experiences Guide
                      </h1>
                      <p className="type-body-lg text-slate-200 max-w-xl mx-auto">
                        Explore corporate hubs, scenic outdoor trails, cultural landmarks, culinary districts, and connectivity across premier California destinations.
                      </p>
                    </div>
                  </div>
                  <AreaGuideSection
                    onOpenBooking={() => handleOpenBooking()}
                    onOpenDiscoveryCall={() => navigateToTab('beahost')}
                  />
                </>
              )}

              {currentTab === 'faq' && <FAQView onOpenBooking={() => handleOpenBooking()} />}

              {currentTab === 'terms' && <TermsView onOpenBooking={() => handleOpenBooking()} />}

              {currentTab === 'blog' && <BlogView onOpenBooking={() => handleOpenBooking()} />}

              {currentTab === 'contact' && (
                <div className="pt-6">
                  <ContactSection preselectedPropertyId={selectedPropertyId} />
                </div>
              )}

              {currentTab === 'privacy' && <PrivacyPolicyView />}

              {currentTab === 'vehicles' && (
                <VehiclesSection
                  onReserveVehicle={(vehicle, colorHex) => {
                    setSelectedVehicle(vehicle);
                    setSelectedVehicleColor(colorHex);
                    setVehicleModalOpen(true);
                  }}
                  onNavigate={navigateToTab}
                />
              )}

              {currentTab === 'shop' && <ShopServicesSection onNavigate={navigateToTab} />}

              {currentTab === 'cart' && (
                <CartCheckoutView initialMode="cart" onNavigate={navigateToTab} />
              )}

              {currentTab === 'checkout' && (
                <CartCheckoutView initialMode="checkout" onNavigate={navigateToTab} />
              )}

              {(currentTab === 'portal' || currentTab === 'dashboard') && (
                <CustomerPortal
                  onOpenBooking={() => handleOpenBooking()}
                  onNavigateTab={navigateToTab}
                />
              )}

              {currentTab === 'login' && (
                <SignInView
                  onNavigateTab={navigateToTab}
                  authNotice={authNotice}
                  onLoginSuccess={(token) => {
                    setAuthToken(token);
                    setAuthNotice(null);
                    navigateToTab('dashboard');
                  }}
                />
              )}

              {currentTab === 'register' && (
                <RegisterView
                  onNavigateTab={navigateToTab}
                  onRegisterSuccess={(token) => {
                    setAuthToken(token);
                    setAuthNotice(null);
                    navigateToTab('dashboard');
                  }}
                />
              )}

              {currentTab === 'admin' && <AdminPortal onNavigateTab={navigateToTab} />}
            </div>
          )}
        </Suspense>
      </main>

      {!isDedicatedAppShell && (
        <Footer
          onNavClick={navigateToTab}
          onOpenBooking={() => handleOpenBooking()}
          onOpenBrochure={() => setBrochureOpen(true)}
        />
      )}

      <CartDrawer onNavigate={navigateToTab} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialPropertyId={selectedPropertyId}
        initialMoveInDate={modalDate}
        initialDuration={modalDuration}
        properties={activeProperties}
      />

      <VehicleBookingModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        initialVehicle={selectedVehicle}
        initialColorHex={selectedVehicleColor}
        onOpenPortal={() => {
          setVehicleModalOpen(false);
          navigateToTab('dashboard');
        }}
        onNavigate={navigateToTab}
      />

      <BrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />

      <FloatingConcierge />

      <BrandedPageLoader minDuration={350} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}
