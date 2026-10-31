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
import { VehiclesSection } from './components/VehiclesSection';
import { CustomerPortal } from './components/CustomerPortal';
import { PROPERTIES } from './data/lodgingData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [brochureOpen, setBrochureOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('any');
  const [modalDate, setModalDate] = useState('');
  const [modalDuration, setModalDuration] = useState('30-60');

  // Handle URL hash if any
  useEffect(() => {
    const handleHash = () => {
      let hash = window.location.hash.replace('#', '').replace(/^\//, '').replace(/\/$/, '');
      if (!hash || hash === 'home') {
        setCurrentTab('home');
        return;
      }
      
      const tabMap: Record<string, string> = {
        'corporate': 'corporate',
        'portfolio': 'portfolio',
        'about': 'about',
        'about-us': 'about',
        'beahost': 'beahost',
        'want-to-be-a-host': 'beahost',
        'guide': 'guide',
        'area-guide': 'guide',
        'faq': 'faq',
        'faqs': 'faq',
        'terms': 'terms',
        'terms-and-conditions': 'terms',
        'blog': 'blog',
        'contact': 'contact',
        'contact-us': 'contact',
        'privacy': 'privacy',
        'privacy-policy': 'privacy',
        'vehicles': 'vehicles',
        'fleet': 'vehicles',
        'cars': 'vehicles',
        'car-rentals': 'vehicles',
        'vehicle-rentals': 'vehicles',
        'portal': 'portal',
        'client-portal': 'portal',
        'login': 'portal',
        'dashboard': 'portal',
        'units': 'portal'
      };

      if (tabMap[hash]) {
        setCurrentTab(tabMap[hash]);
        return;
      }

      if (hash.startsWith('listing:')) {
        setCurrentTab(hash);
        return;
      }

      // Check if hash matches any property slug or ID
      const matched = PROPERTIES.find(p => p.slug === hash || p.id === hash || p.unitNumber === hash || p.code === hash);
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
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    } else {
      setSelectedPropertyId('any');
    }
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        {(currentTab === 'home' || (!['corporate','portfolio','about','beahost','guide','faq','terms','blog','contact','privacy','vehicles','portal'].includes(currentTab) && !currentTab.startsWith('listing:'))) && (
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
            <div className="bg-slate-900 text-white py-12 px-4 text-center">
              <span className="text-xs uppercase font-extrabold text-sky-400 tracking-wider">
                Full Sacramento Inventory
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-black mt-1">
                Portfolio & Midterm Listings
              </h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2">
                Units 91, 173, 250, 333, and 335 in Rancho Cordova for 30+ day stays.
              </p>
            </div>
            <PropertiesSection
              onSelectPropertyForBooking={(id, date, dur) => handleOpenBooking(id, date, dur)}
              onViewListingDetails={(property) => navigateToTab(`listing:${property.id}`)}
            />
            <AmenitiesSection />
          </>
        )}

        {currentTab.startsWith('listing:') && (() => {
          const propId = currentTab.replace('listing:', '');
          const property = PROPERTIES.find(p => p.id === propId || p.slug === propId) || PROPERTIES[0];
          return (
            <PropertyDetailView
              property={property}
              onBack={() => navigateToTab('portfolio')}
              onOpenBooking={(id, date, dur) => handleOpenBooking(id, date, dur)}
              onSelectAnotherProperty={(id) => navigateToTab(`listing:${id}`)}
            />
          );
        })()}

        {currentTab === 'about' && (
          <>
            <AboutView onOpenBooking={() => handleOpenBooking()} />
            <AwardsSection />
            <ReviewsSection />
          </>
        )}

        {currentTab === 'beahost' && (
          <HostDesignView />
        )}

        {currentTab === 'guide' && (
          <>
            <div className="bg-slate-900 text-white py-12 px-4 text-center">
              <span className="text-xs uppercase font-extrabold text-teal-400 tracking-wider">
                Local Area Highlights
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-black mt-1">
                Sacramento & Rancho Cordova Travel Guide
              </h1>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2">
                Discover local dining, the 6-brewery Barrel District, historic parks, and Sierra day trips.
              </p>
            </div>
            <AreaGuideSection
              onOpenBooking={() => handleOpenBooking()}
              onOpenDiscoveryCall={() => navigateToTab('beahost')}
            />
          </>
        )}

        {currentTab === 'faq' && (
          <FAQView onOpenBooking={() => handleOpenBooking()} />
        )}

        {currentTab === 'terms' && (
          <TermsView onOpenBooking={() => handleOpenBooking()} />
        )}

        {currentTab === 'blog' && (
          <BlogView onOpenBooking={() => handleOpenBooking()} />
        )}

        {currentTab === 'contact' && (
          <div className="pt-8">
            <ContactSection preselectedPropertyId={selectedPropertyId} />
          </div>
        )}

        {currentTab === 'privacy' && (
          <PrivacyPolicyView />
        )}

        {currentTab === 'vehicles' && (
          <VehiclesSection
            onReserveVehicle={(vehicleName) => {
              handleOpenBooking(undefined, undefined, undefined);
            }}
          />
        )}

        {currentTab === 'portal' && (
          <CustomerPortal
            onOpenBooking={() => handleOpenBooking()}
            onNavigateTab={navigateToTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={navigateToTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenBrochure={() => setBrochureOpen(true)}
      />

      {/* Global Modern Booking / Reservation Inquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialPropertyId={selectedPropertyId}
        initialMoveInDate={modalDate}
        initialDuration={modalDuration}
      />

      {/* Brochure Modal */}
      <BrochureModal
        isOpen={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />

      {/* Smartsup Live Chat Widget */}
      <SmartsupChat />
    </div>
  );
}
