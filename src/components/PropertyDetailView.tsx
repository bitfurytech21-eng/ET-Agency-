import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accessibility,
  ArrowLeft,
  Bath,
  Check,
  Dog,
  Flame,
  ShieldCheck,
  Snowflake,
  Tv,
  Wifi,
} from 'lucide-react';
import { PropertyListing } from '../data/lodgingData';
import { BlockedDateRange } from '../data/propertyEnrichment';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { useCart } from '../context/CartContext';
import { PropertyGallery } from './property/PropertyGallery';
import { PropertySpecsGrid } from './property/PropertySpecsGrid';
import { PropertyStickyNav, PropertySectionNavItem } from './property/PropertyStickyNav';
import { BedroomExplorer } from './property/BedroomExplorer';
import { VideoTourSection } from './property/VideoTourSection';
import { ConciergeAddonsSection } from './property/ConciergeAddonsSection';
import { InteractiveBookingPanel } from './property/InteractiveBookingPanel';
import { PropertyReviewsSection } from './property/PropertyReviewsSection';
import { PropertyLocationSection } from './property/PropertyLocationSection';

interface PropertyDetailViewProps {
  property: PropertyListing;
  onBack: () => void;
  onOpenBooking: (propertyId: string, startDate?: string, duration?: string) => void;
  onSelectAnotherProperty?: (propertyId: string) => void;
  onNavigate?: (view: string) => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onNavigate,
}) => {
  const { catalogItems, refreshCatalog } = useCart();

  // Booking & Guest Configuration State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedAddonQuantities, setSelectedAddonQuantities] = useState<Record<string, number>>({});
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Live database-driven blocked date ranges
  const [liveBlockedRanges, setLiveBlockedRanges] = useState<BlockedDateRange[] | undefined>(
    property.blockedDates,
  );

  const loadLiveAvailability = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/properties/${encodeURIComponent(property.id)}/availability`,
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success && Array.isArray(data.blockedRanges)) {
        setLiveBlockedRanges(data.blockedRanges);
      }
    } catch {
      // Retain seeded/fallback property blocked dates if offline
    }
  }, [property.id]);

  useEffect(() => {
    setCheckIn('');
    setCheckOut('');
    setAdults(1);
    setChildrenCount(0);
    setInfants(0);
    setSelectedAddonQuantities({});
    setBookingModalOpen(false);
    setLiveBlockedRanges(property.blockedDates);
    loadLiveAvailability();
  }, [property.id, property.blockedDates, loadLiveAvailability]);

  const hasActiveConciergeServices = useMemo(
    () => catalogItems.some((item) => item.itemType === 'addon_service' && item.available),
    [catalogItems],
  );

  const navSections = useMemo<PropertySectionNavItem[]>(() => {
    const base: PropertySectionNavItem[] = [
      { id: 'section-about', label: 'About' },
      { id: 'section-rooms', label: 'Rooms' },
      { id: 'section-amenities', label: 'Amenities' },
    ];
    if (hasActiveConciergeServices) {
      base.push({ id: 'section-concierge', label: 'Concierge' });
    }
    base.push(
      { id: 'section-availability', label: 'Availability' },
      { id: 'section-reviews', label: 'Reviews' },
      { id: 'section-location', label: 'Location' },
    );
    return base;
  }, [hasActiveConciergeServices]);

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet'))
      return <Wifi className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('tv')) return <Tv className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('air') || a.includes('conditioning') || a.includes('heat') || a.includes('climate'))
      return <Snowflake className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('bath') || a.includes('spa'))
      return <Bath className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('disabled') || a.includes('wheelchair') || a.includes('step-free'))
      return <Accessibility className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('pet')) return <Dog className="w-4 h-4 text-[#00897d] shrink-0" />;
    if (a.includes('fire')) return <Flame className="w-4 h-4 text-[#00897d] shrink-0" />;
    return <Check className="w-4 h-4 text-[#00897d] shrink-0" />;
  };

  const handleAddonQuantityChange = (serviceId: string, nextQty: number) => {
    setSelectedAddonQuantities((prev) => {
      if (nextQty <= 0) {
        const clone = { ...prev };
        delete clone[serviceId];
        return clone;
      }
      return { ...prev, [serviceId]: nextQty };
    });
  };

  const isReserved = property.status === 'Reserved';
  const maxGuests = property.maxGuests || Math.max(2, property.bedrooms * 2);
  const minStay = property.minimumStayDays || 5;
  const maxStay = property.maximumStayDays || 365;
  const nightlyEstimate = Math.round((property.monthlyRate / 30) * 1.12);

  const displayLocationLabel = property.locationInfo
    ? `${property.locationInfo.city}, ${property.locationInfo.state}`
    : property.location;

  return (
    <div className="w-full bg-white text-[#282828] pb-24 lg:pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#faf8f5] border-b border-[#e6dfd5] py-3.5 px-4 sm:px-8">
        <div className="type-nav max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="type-btn inline-flex items-center gap-1.5 text-[#5c5046] hover:text-[#1b1d20] cursor-pointer transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Residences</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[#697076] truncate">
            <span>Residences</span>
            <span aria-hidden="true">/</span>
            <span>{displayLocationLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#1b1d20] font-medium truncate">{property.unitNumber}</span>
          </div>
        </div>
      </div>

      {/* Hero Header & Gallery Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-7 pb-6 space-y-6">
        {/* Title, Unboxed Metadata & Pricing Overview */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-3xl space-y-2">
            {/* Clean Unboxed Metadata Row (Zero Pill Capsules) */}
            <div className="type-support flex flex-wrap items-center gap-2 text-[#5c5046]">
              <span className="font-semibold text-[#00897d]">
                {property.propertyType || property.category || 'Furnished Residence'}
              </span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-semibold ${
                  isReserved
                    ? 'text-rose-700'
                    : property.status === 'Inquired'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {isReserved ? 'Currently Reserved' : property.status}
              </span>
              {property.verified === true && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1b1d20]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00897d]" />
                    <span>Verified Residence</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="type-h1 text-[#1b1d20]">{property.title}</h1>

            <p className="type-support text-[#5c5046] flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
              <span className="font-medium text-[#1b1d20]">{property.unitNumber}</span>
              {property.code && <span>({property.code})</span>}
              <span aria-hidden="true">·</span>
              <span>{displayLocationLabel}</span>
              <span aria-hidden="true">·</span>
              <span>Up to {maxGuests} Guests</span>
              <span aria-hidden="true">·</span>
              <span>
                {property.bedrooms} Bed, {property.bathrooms} Bath
              </span>
              {property.sqft && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{property.sqft}</span>
                </>
              )}
            </p>
          </div>

          <div className="text-left lg:text-right tabular-nums shrink-0">
            <span className="type-support text-[#697076] block">Extended Monthly Rate</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#1b1d20]">
              ${property.monthlyRate.toLocaleString()}
              <span className="type-support font-normal text-[#5c5046]"> / month</span>
            </div>
            <span className="type-support text-[#697076] block mt-0.5">
              {minStay}–29 night stays: ~${nightlyEstimate.toLocaleString()}/night
            </span>
          </div>
        </div>

        {/* Interactive Property Image Gallery */}
        <PropertyGallery
          propertyId={property.id}
          title={property.title}
          unitNumber={property.unitNumber}
          images={property.images}
          onRequireAuth={() => onNavigate?.('login')}
        />

        {/* Minimalist Specifications Grid */}
        <PropertySpecsGrid property={property} />
      </div>

      {/* Sticky Section Anchor Navigation */}
      <PropertyStickyNav
        sections={navSections}
        monthlyRate={property.monthlyRate}
        onQuickReserve={() => setBookingModalOpen(true)}
      />

      {/* Main 2-Column Content + Sticky Booking Module */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Detailed Residence Sections */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. ABOUT SECTION */}
            <section id="section-about" className="scroll-mt-28 space-y-6">
              <div className="space-y-3">
                <h2 className="type-h2 text-[#1b1d20]">About This Residence</h2>
                <div className="type-body text-[#434a4f] whitespace-pre-line leading-relaxed">
                  {property.fullDesc}
                </div>
              </div>

              {/* Residence Highlights & Furnishings */}
              {property.features && property.features.length > 0 && (
                <div className="pt-5 border-t border-[#efe9e0] space-y-3">
                  <h3 className="type-h3 text-[#1b1d20]">Interior Features &amp; Appointments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="type-body text-[#434a4f] flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#00897d] shrink-0 mt-1.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Booking Conditions */}
              <div className="p-5 sm:p-6 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-4">
                <h3 className="type-h4 text-[#1b1d20]">Pricing &amp; Booking Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
                  <div>
                    <span className="type-support text-[#697076] block">Minimum / Maximum Stay</span>
                    <span className="type-nav font-semibold text-[#1b1d20]">
                      {minStay} to {maxStay} Nights
                    </span>
                  </div>
                  <div>
                    <span className="type-support text-[#697076] block">30+ Day Extended Tax Rule</span>
                    <span className="type-nav font-semibold text-[#00897d]">
                      0% CA Occupancy Tax
                    </span>
                  </div>
                  <div>
                    <span className="type-support text-[#697076] block">Check-In / Check-Out</span>
                    <span className="type-nav font-semibold text-[#1b1d20]">
                      3:00 PM / 11:00 AM
                    </span>
                  </div>
                </div>

                <p className="type-support text-[#434a4f]">
                  {property.pricingNote ||
                    'Includes electricity, gas, water, trash, 400+ Mbps Wi-Fi, and dedicated parking. Stays under 30 nights incur standard 8% California occupancy tax and a one-time $95 residence preparation & inspection fee.'}
                </p>

                {property.seasonalPricing && property.seasonalPricing.length > 0 && (
                  <div className="pt-3 border-t border-[#e6dfd5] space-y-1.5">
                    <span className="type-label text-[#1b1d20] block">Seasonal Rate Schedule</span>
                    {property.seasonalPricing.map((rule) => (
                      <div
                        key={rule.id}
                        className="type-support text-[#5c5046] flex flex-wrap items-center justify-between gap-2 tabular-nums"
                      >
                        <span>
                          <strong className="font-semibold text-[#1b1d20]">{rule.label}</strong> (
                          {rule.startMonthDay} to {rule.endMonthDay})
                        </span>
                        <span>
                          {rule.nightlyRateOverride
                            ? `$${rule.nightlyRateOverride}/night`
                            : rule.multiplier
                            ? `${Math.round((rule.multiplier - 1) * 100)}% short-stay adjustment`
                            : 'Standard rate'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 2. INTERACTIVE BEDROOM EXPLORER & CONDITIONAL VIDEO TOUR */}
            <section id="section-rooms" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5] space-y-8">
              <BedroomExplorer
                propertyId={property.id}
                bedrooms={property.bedroomsDetail || []}
                fallbackImages={property.images}
              />

              <VideoTourSection
                videoTourUrl={property.videoTourUrl}
                posterUrl={property.videoPosterUrl || property.images[0]}
                propertyTitle={property.title}
                unitNumber={property.unitNumber}
              />
            </section>

            {/* 3. AMENITIES & FACILITIES */}
            <section id="section-amenities" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5] space-y-6">
              <div>
                <h2 className="type-h2 text-[#1b1d20]">Residence Amenities &amp; Facilities</h2>
                <p className="type-body text-[#5c5046] mt-1">
                  Every residence is prepared with turnkey kitchenware, high-speed connectivity, climate control, and community privileges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center gap-3 type-support font-medium text-[#1b1d20]"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              {property.facilities && property.facilities.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h3 className="type-h4 text-[#1b1d20]">Property &amp; Community Facilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.facilities.map((facility, idx) => (
                      <div key={idx} className="type-support text-[#434a4f] flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#00897d] shrink-0" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 4. CONCIERGE ADD-ONS & EXTRA SERVICES */}
            {hasActiveConciergeServices && (
              <section id="section-concierge" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5]">
                <ConciergeAddonsSection
                  services={catalogItems}
                  selectedQuantities={selectedAddonQuantities}
                  onChangeQuantity={handleAddonQuantityChange}
                  onExploreVehicles={() => onNavigate?.('vehicles')}
                />
              </section>
            )}

            {/* 5. LIVE AVAILABILITY CALENDAR */}
            <section id="section-availability" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5] space-y-4">
              <div>
                <h2 className="type-h2 text-[#1b1d20]">Availability &amp; Stay Dates</h2>
                <p className="type-body text-[#5c5046] mt-1">
                  Select your check-in and check-out dates below to update your live reservation quote automatically.
                </p>
              </div>

              <AvailabilityCalendar
                propertyId={property.id}
                unitTitle={property.title}
                unitNumber={property.unitNumber}
                minimumStayDays={minStay}
                maximumStayDays={maxStay}
                externalBlockedRanges={liveBlockedRanges}
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                onSelectDateRange={(nextCheckIn, nextCheckOut) => {
                  setCheckIn(nextCheckIn);
                  setCheckOut(nextCheckOut);
                }}
              />
            </section>

            {/* 6. GUEST REVIEWS */}
            <section id="section-reviews" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5]">
              <PropertyReviewsSection
                propertyId={property.id}
                unitNumber={property.unitNumber}
                onRequireAuth={() => onNavigate?.('login')}
              />
            </section>

            {/* 7. LOCATION & SURROUNDINGS */}
            <section id="section-location" className="scroll-mt-28 pt-10 border-t border-[#e6dfd5]">
              <PropertyLocationSection
                locationInfo={property.locationInfo}
                fallbackLocation={property.location}
              />
            </section>
          </div>

          {/* Right Column: Sticky Purchase & Availability Module */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <InteractiveBookingPanel
              property={property}
              checkIn={checkIn}
              checkOut={checkOut}
              onChangeDates={(nextIn, nextOut) => {
                setCheckIn(nextIn);
                setCheckOut(nextOut);
              }}
              adults={adults}
              childrenCount={childrenCount}
              infants={infants}
              onChangeGuests={({ adults: a, children: c, infants: inf }) => {
                setAdults(a);
                setChildrenCount(c);
                setInfants(inf);
              }}
              selectedAddonQuantities={selectedAddonQuantities}
              onChangeAddonQuantity={handleAddonQuantityChange}
              catalogServices={catalogItems}
              bookingModalOpen={bookingModalOpen}
              onOpenBookingModal={() => setBookingModalOpen(true)}
              onCloseBookingModal={() => setBookingModalOpen(false)}
              onBookingCreated={() => {
                loadLiveAvailability();
                refreshCatalog();
              }}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
