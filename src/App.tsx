/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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

export interface AuthCustomerSummary {
  id: string;
  name: string;
  email: string;
}

const ROUTE_TAB_MAP: Record<string, string> = {
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

function resolveTabFromUrl(propertiesList = PROPERTIES): string {
  const rawHash = window.location.hash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '');
  const rawPath = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const candidate = rawHash || rawPath;

  if (!candidate || candidate === 'home' || candidate === 'index.html') {
    return 'home';
  }

  const lower = candidate.toLowerCase();
  if (lower === 'admin' || lower === 'admin-portal' || lower.startsWith('admin/')) {
    return 'admin';
  }

  if (ROUTE_TAB_MAP[lower]) {
    return ROUTE_TAB_MAP[lower];
  }

  if (candidate.startsWith('listing:')) {
    return candidate;
  }

  if (lower.startsWith('listing/') || lower.startsWith('properties/') || lower.startsWith('property/')) {
    const slugOrId = candidate.split('/').slice(1).join('/');
    const matchedProp = propertiesList.find(
      (p) => p.slug === slugOrId || p.id === slugOrId || p.unitNumber === slugOrId || p.code === slugOrId,
    );
    return matchedProp ? `listing:${matchedProp.id}` : `listing:${slugOrId}`;
  }

  const matched = propertiesList.find(
    (p) => p.slug === candidate || p.id === candidate || p.unitNumber === candidate || p.code === candidate,
  );
  if (matched) {
    return `listing:${matched.id}`;
  }

  return 'home';
}

function AppShell() {
  const { liveProperties, refreshWishlist } = useCart();
  const activeProperties = liveProperties.length > 0 ? liveProperties : PROPERTIES;

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const initial = resolveTabFromUrl(PROPERTIES);
    const token = localStorage.getItem('etl_php_token');
    if (initial === 'dashboard' && !token) return 'login';
    if ((initial === 'login' || initial === 'register') && token) return 'dashboard';
    return initial;
  });
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

  // Authenticated customer session state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    localStorage.removeItem('etl_user_session');
    return localStorage.getItem('etl_php_token');
  });
  const [authUser, setAuthUser] = useState<AuthCustomerSummary | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Verify stored token against backend session on startup & token change
  useEffect(() => {
    localStorage.removeItem('etl_user_session');
    if (!authToken) {
      setAuthUser(null);
      return;
    }

    let cancelled = false;
    fetch('/api/auth/customer/session', {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (cancelled) return;
        if (ok && body.success && body.customer) {
          setAuthUser({
            id: body.customer.id,
            name: body.customer.name,
            email: body.customer.email,
          });
          refreshWishlist();
        } else {
          localStorage.removeItem('etl_php_token');
          setAuthToken(null);
          setAuthUser(null);
          refreshWishlist();
          if (currentTab === 'dashboard' || currentTab === 'portal') {
            setAuthNotice('Your session expired. Please sign in to access your personal dashboard.');
            setCurrentTab('login');
            window.location.hash = 'login';
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  // Sync token across browser tabs
  useEffect(() => {
    const handleStorage = () => {
      setAuthToken(localStorage.getItem('etl_php_token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Handle URL pathname + hash routing and protected dashboard guards
  useEffect(() => {
    const syncRoute = () => {
      const resolved = resolveTabFromUrl(activeProperties);
      const token = localStorage.getItem('etl_php_token');

      if (resolved === 'dashboard' && !token) {
        setAuthNotice(
          'Please sign in or create an account to access your personal dashboard.',
        );
        setCurrentTab('login');
        if (window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/#login');
        } else {
          window.location.hash = 'login';
        }
        return;
      }

      if ((resolved === 'login' || resolved === 'register') && token) {
        setCurrentTab('dashboard');
        if (window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/#dashboard');
        } else {
          window.location.hash = 'dashboard';
        }
        return;
      }

      setCurrentTab(resolved);
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, [activeProperties]);

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

  const navigateToTab = useCallback((tab: string) => {
    const token = localStorage.getItem('etl_php_token');

    if (tab === 'dashboard' || tab === 'portal') {
      if (!token) {
        setAuthNotice(
          'Please sign in or create an account to access your personal dashboard.',
        );
        setCurrentTab('login');
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/#login');
        } else {
          window.location.hash = 'login';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setCurrentTab('dashboard');
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/#dashboard');
      } else {
        window.location.hash = 'dashboard';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if ((tab === 'login' || tab === 'register') && token) {
      setCurrentTab('dashboard');
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/#dashboard');
      } else {
        window.location.hash = 'dashboard';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentTab(tab);
    if (tab === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (tab === 'home') {
      window.history.pushState(null, '', '/');
    } else if (window.location.pathname !== '/') {
      window.history.pushState(null, '', `/#${tab}`);
    } else {
      window.location.hash = tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSignOut = useCallback(async () => {
    const token = localStorage.getItem('etl_php_token');
    if (token) {
      try {
        await fetch('/api/auth/customer/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Proceed with client sign-out
      }
    }
    localStorage.removeItem('etl_php_token');
    localStorage.removeItem('etl_user_session');
    setAuthToken(null);
    setAuthUser(null);
    setAuthNotice(null);
    refreshWishlist();
    setCurrentTab('login');
    window.location.hash = 'login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [refreshWishlist]);

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

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#282828] flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        onOpenBooking={() => handleOpenBooking()}
        authUser={authUser}
        onSignOut={handleSignOut}
        onSearchListings={(q) => {
          setPortfolioSearchQuery(q);
          navigateToTab('portfolio');
        }}
      />

      <main className="flex-1">
        {(currentTab === 'home' ||
          (!knownViews.includes(currentTab) && !currentTab.startsWith('listing:'))) && (
          <>
            <Hero
              onExploreListings={() => navigateToTab('portfolio')}
              onOpenBooking={() => handleOpenBooking()}
              onOpenBrochure={() => setBrochureOpen(true)}
              onLearnEthics={() => navigateToTab('about')}
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
            <div className="relative overflow-hidden py-16 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
              <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <span className="type-support uppercase font-semibold text-[#4de0d2] tracking-[0.08em] block">
                  Furnished Residences · California’s homes
                </span>
                <h1 className="type-h1 mt-2 text-white">
                  1- &amp; 2-Bedroom Furnished Apartments &amp; Suites
                </h1>
                <p className="type-body text-[#ede5dc] max-w-2xl mx-auto mt-4">
                  Move-in-ready furnished residences and corporate housing across California’s homes for flexible stays (5+ nights), extended 30+ day corporate leases, family relocations, and organizational housing.
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
            <div className="relative overflow-hidden py-16 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
              <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <span className="type-support uppercase font-semibold text-[#4de0d2] tracking-[0.08em] block">
                  California’s homes Corridor &amp; Regional Guide
                </span>
                <h1 className="type-h1 mt-2 text-white">
                  California’s homes Metropolitan &amp; Destination Guide
                </h1>
                <p className="type-body text-[#ede5dc] max-w-2xl mx-auto mt-4">
                  Explore corporate hubs, scenic outdoor trails, cultural landmarks, culinary districts, and seamless connectivity across major California’s homes regions.
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
          <div className="pt-8">
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
            onSignOut={handleSignOut}
            onAuthExpired={() => {
              setAuthToken(null);
              setAuthUser(null);
              setAuthNotice('Please sign in to access your personal dashboard.');
              setCurrentTab('login');
              window.location.hash = 'login';
            }}
            onUserUpdated={(updated) => setAuthUser(updated)}
          />
        )}

        {currentTab === 'login' && (
          <SignInView
            onNavigateTab={navigateToTab}
            authNotice={authNotice}
            onLoginSuccess={(token, customer) => {
              setAuthToken(token);
              if (customer?.id) {
                setAuthUser({
                  id: customer.id,
                  name: customer.name,
                  email: customer.email,
                });
              }
              refreshWishlist();
              setAuthNotice(null);
              setCurrentTab('dashboard');
              window.location.hash = 'dashboard';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'register' && (
          <RegisterView
            onNavigateTab={navigateToTab}
            onRegisterSuccess={(token, customer) => {
              setAuthToken(token);
              if (customer?.id) {
                setAuthUser({
                  id: customer.id,
                  name: customer.name,
                  email: customer.email,
                });
              }
              refreshWishlist();
              setAuthNotice(null);
              setCurrentTab('dashboard');
              window.location.hash = 'dashboard';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && <AdminPortal onNavigateTab={navigateToTab} />}
      </main>

      {!['portal', 'dashboard', 'admin'].includes(currentTab) && (
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
