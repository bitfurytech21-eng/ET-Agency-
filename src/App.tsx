/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { SmartsupChat } from './components/SmartsupChat';
import { BookingModal } from './components/BookingModal';
import { VehicleBookingModal } from './components/VehicleBookingModal';
import { VehiclesSection } from './components/VehiclesSection';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminPortal } from './components/AdminPortal';
import { CartDrawer } from './components/CartDrawer';
import { ShopServicesSection } from './components/ShopServicesSection';
import { CartCheckoutView } from './components/CartCheckoutView';
import { LivePhotoBackground } from './components/LivePhotoBackground';
import { CartProvider, useCart } from './context/CartContext';
import { PROPERTIES } from './data/lodgingData';
import { UsVehicle } from './data/vehicleData';

function AppShell() {
  const { liveProperties } = useCart();
  const activeProperties = liveProperties.length > 0 ? liveProperties : PROPERTIES;

  const [currentTab, setCurrentTab] = useState<string>('home');
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

  // Handle URL hash if any
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '').replace(/\/$/, '');
      if (!hash || hash === 'home') {
        setCurrentTab('home');
        return;
      }

      const tabMap: Record<string, string> = {
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
        portal: 'portal',
        'client-portal': 'portal',
        login: 'portal',
        dashboard: 'portal',
        units: 'portal',
        admin: 'admin',
        'admin-portal': 'admin',
      };

      if (tabMap[hash]) {
        setCurrentTab(tabMap[hash]);
        return;
      }

      if (hash.startsWith('listing:')) {
        setCurrentTab(hash);
        return;
      }

      const matched = PROPERTIES.find(
        (p) => p.slug === hash || p.id === hash || p.unitNumber === hash || p.code === hash,
      );
      if (matched) {
        setCurrentTab(`listing:${matched.id}`);
        return;
      }

      setCurrentTab('home');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    'admin',
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#282828] flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        onOpenBooking={() => handleOpenBooking()}
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
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-xs uppercase font-extrabold text-[#4de0d2] tracking-widest">
                  Furnished Residences · Greater Sacramento
                </span>
                <h1 className="text-3xl sm:text-5xl font-heading font-black mt-2 text-white">
                  1- &amp; 2-Bedroom Furnished Apartments
                </h1>
                <p className="text-[#ede5dc] text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed">
                  Move-in-ready residences in Rancho Cordova for short visits (5+ nights), extended 30+ day stays, family relocations, home renovations, and organizational housing.
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
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-xs uppercase font-extrabold text-[#4de0d2] tracking-widest">
                  Regional Guide &amp; Neighborhood Highlights
                </span>
                <h1 className="text-3xl sm:text-5xl font-heading font-black mt-2 text-white">
                  Greater Sacramento &amp; Rancho Cordova Guide
                </h1>
                <p className="text-[#ede5dc] text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
                  Explore American River Parkway trails, local dining, the Barrel District, cultural landmarks, and weekend trips from Gold Country to Lake Tahoe.
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

        {currentTab === 'portal' && (
          <CustomerPortal
            onOpenBooking={() => handleOpenBooking()}
            onNavigateTab={navigateToTab}
          />
        )}

        {currentTab === 'admin' && <AdminPortal onNavigateTab={navigateToTab} />}
      </main>

      <Footer
        onNavClick={navigateToTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenBrochure={() => setBrochureOpen(true)}
      />

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
          navigateToTab('portal');
        }}
        onNavigate={navigateToTab}
      />

      <BrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />

      <SmartsupChat />
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
