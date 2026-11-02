import React, { useState } from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground, LIVE_PHOTO_URLS } from './LivePhotoBackground';
import { ArrowRight, Calendar, Car, Building2, FileText, Search } from 'lucide-react';

interface HeroProps {
  onOpenBooking: (propertyId?: string, moveInDate?: string, duration?: string) => void;
  onExploreListings?: () => void;
  onExploreVehicles?: () => void;
  onOpenBrochure?: () => void;
  onLearnEthics?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreListings,
  onExploreVehicles,
  onOpenBrochure,
}) => {
  const [searchService, setSearchService] = useState<'residences' | 'corporate' | 'vehicles'>('residences');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [stayDuration, setStayDuration] = useState<string>('30-60');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchService === 'vehicles') {
      if (onExploreVehicles) {
        onExploreVehicles();
      }
      return;
    }
    onOpenBooking('any', checkInDate || undefined, stayDuration);
  };

  return (
    <section className="et_section_hero relative overflow-hidden py-14 sm:py-20 lg:py-24 border-b border-[#e2e8f0]">
      <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="warm-hero" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-8 space-y-10 lg:space-y-12">
        {/* Balanced 2-Column Executive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="type-support flex flex-wrap items-center gap-2 font-semibold text-[#14616d] tracking-wide">
              <span>California Furnished Residences</span>
              <span aria-hidden="true" className="text-[#94a3b8]">·</span>
              <span>Executive Car Rentals</span>
              <span aria-hidden="true" className="text-[#94a3b8]">·</span>
              <span>Concierge Arrival</span>
            </div>

            <div className="space-y-4">
              <h1 className="type-h1 text-[#0f172a] max-w-2xl">
                Turnkey Furnished Residences &amp; Executive Mobility Across California
              </h1>
              <p className="type-body-lg text-[#475569] max-w-[620px]">
                Move-in-ready 1- and 2-bedroom apartments, flexible 5-night to 12-month corporate leases, and private terminal-staged rental vehicles backed by responsive hospitality specialists.
              </p>
            </div>

            {/* Clean Unboxed Capabilities */}
            <div className="type-support flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-[#334155] font-medium">
              <span>5 Nights to 12+ Months</span>
              <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
              <span>Chef Kitchens &amp; Fiber WiFi</span>
              <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
              <span>Consolidated Corporate Billing</span>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {onExploreListings && (
                <button
                  type="button"
                  onClick={onExploreListings}
                  className="btn btn-primary group"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Browse Residences</span>
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </button>
              )}

              {onExploreVehicles && (
                <button
                  type="button"
                  onClick={onExploreVehicles}
                  className="btn btn-outline"
                >
                  <Car className="w-4 h-4 text-[#14616d]" />
                  <span>Explore Car Rentals</span>
                </button>
              )}

              {onOpenBrochure && (
                <button
                  type="button"
                  onClick={onOpenBrochure}
                  className="btn btn-ghost text-[#475569] hover:text-[#14616d]"
                >
                  <FileText className="w-4 h-4 text-[#14616d]" />
                  <span>Download Portfolio Brochure</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: High-Resolution Architectural Suite Showcase */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#cbd5e1] shadow-lg bg-[#0f172a] aspect-[4/3] lg:aspect-auto lg:min-h-[380px] group">
              <img
                src={LIVE_PHOTO_URLS.interior}
                alt="Furnished executive apartment living and dining room in California"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(0);
                }}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white space-y-1.5">
                <div className="type-support flex items-center justify-between text-slate-300 font-medium">
                  <span>California Executive Collection</span>
                  <span className="font-mono tabular-nums text-white">Move-In Ready</span>
                </div>
                <p className="type-body font-semibold text-white leading-snug">
                  Inspected residences with dedicated workspaces, in-unit laundry, and reserved parking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Commercial Booking & Fleet Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          aria-label="Check residence or vehicle availability"
          className="bg-white border border-[#cbd5e1] rounded-2xl p-4 sm:p-5 shadow-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 space-y-1.5">
              <label htmlFor="hero-service-select" className="form-label text-[#334155] mb-0">
                Booking Category
              </label>
              <select
                id="hero-service-select"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value as 'residences' | 'corporate' | 'vehicles')}
                className="form-select font-medium"
              >
                <option value="residences">Furnished Residences (Short &amp; Extended Stay)</option>
                <option value="corporate">Corporate &amp; Relocation Housing (30+ Days)</option>
                <option value="vehicles">Executive Car Rentals &amp; Airport Delivery</option>
              </select>
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label htmlFor="hero-checkin-date" className="form-label text-[#334155] mb-0">
                Preferred Arrival / Pick-Up
              </label>
              <div className="relative">
                <input
                  id="hero-checkin-date"
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="form-input font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label htmlFor="hero-duration-select" className="form-label text-[#334155] mb-0">
                Estimated Duration
              </label>
              <select
                id="hero-duration-select"
                value={stayDuration}
                onChange={(e) => setStayDuration(e.target.value)}
                className="form-select font-medium"
              >
                <option value="5-14">5 – 14 Nights (Flexible Stay)</option>
                <option value="15-29">15 – 29 Nights (Mid-Term)</option>
                <option value="30-60">30 – 60 Days (Extended Stay)</option>
                <option value="60-90">60 – 90 Days (Corporate Lease)</option>
                <option value="90+">90+ Days (Relocation Program)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                <Search className="w-4 h-4" />
                <span>{searchService === 'vehicles' ? 'View Fleet' : 'Check Rates'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
