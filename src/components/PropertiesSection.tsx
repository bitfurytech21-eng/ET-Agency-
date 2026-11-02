import React, { useState, useMemo } from 'react';
import { PROPERTIES, PropertyListing, getFallbackPropertyImage } from '../data/lodgingData';
import { AVAILABILITY_SCHEDULES } from '../data/availabilityData';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { useCart } from '../context/CartContext';
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Maximize2,
  Clock,
  Wifi,
  Tv,
  Snowflake,
  Bath,
  Accessibility,
  Dog,
  Flame,
  ArrowRight,
  Search,
  ShoppingBag,
  Heart,
  ShieldCheck,
} from 'lucide-react';

import { YouTubeEmbed } from './YouTubeEmbed';

interface PropertiesSectionProps {
  properties?: PropertyListing[];
  onSelectPropertyForBooking: (propertyId: string, startDate?: string, duration?: string) => void;
  onViewListingDetails?: (property: PropertyListing) => void;
  onNavigate?: (view: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const STAY_OPTIONS = [
  { value: 'month:1', label: '1 Month (30 Days)', billingUnit: 'month' as const, qty: 1 },
  { value: 'month:2', label: '2 Months (60 Days)', billingUnit: 'month' as const, qty: 2 },
  { value: 'month:3', label: '3 Months (90 Days)', billingUnit: 'month' as const, qty: 3 },
  { value: 'night:5', label: '5 Nights (Short Stay)', billingUnit: 'night' as const, qty: 5 },
  { value: 'night:7', label: '7 Nights (1 Week)', billingUnit: 'night' as const, qty: 7 },
  { value: 'night:14', label: '14 Nights (2 Weeks)', billingUnit: 'night' as const, qty: 14 },
];

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  properties,
  onSelectPropertyForBooking,
  onViewListingDetails,
  onNavigate,
  searchQuery = '',
  onClearSearch,
}) => {
  const { addItem, liveProperties, isMutating, wishlistIds, isWishlisted, toggleWishlist } = useCart();
  const sourceProperties = properties?.length
    ? properties
    : liveProperties.length
    ? liveProperties
    : PROPERTIES;

  const [activeModalProperty, setActiveModalProperty] = useState<PropertyListing | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const [modalTab, setModalTab] = useState<'gallery' | 'calendar'>('gallery');
  const [expandedCalendarId, setExpandedCalendarId] = useState<string | null>(null);
  const [selectedMainImages, setSelectedMainImages] = useState<Record<string, number>>({});
  const [unitFilter, setUnitFilter] = useState<'all' | 'saved' | 'sacramento' | 'los-angeles' | '1bed' | '2bed' | 'downstairs' | 'upstairs'>('all');
  const [localQuery, setLocalQuery] = useState<string>('');

  // Per-unit cart term & check-in state
  const [stayTerms, setStayTerms] = useState<Record<string, string>>({});
  const [checkInDates, setCheckInDates] = useState<Record<string, string>>({});
  const [justAddedUnit, setJustAddedUnit] = useState<string | null>(null);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const effectiveQuery = (localQuery || searchQuery).trim().toLowerCase();

  const filteredProperties = useMemo(() => {
    return sourceProperties.filter((prop) => {
      if (unitFilter === 'saved' && !wishlistIds.includes(prop.id)) return false;
      if (unitFilter === 'sacramento' && prop.id.startsWith('la-')) return false;
      if (unitFilter === 'los-angeles' && !prop.id.startsWith('la-')) return false;
      if (unitFilter === '1bed' && prop.bedrooms !== 1) return false;
      if (unitFilter === '2bed' && prop.bedrooms !== 2) return false;
      if (unitFilter === 'downstairs' && prop.floor !== 'Downstairs') return false;
      if (unitFilter === 'upstairs' && prop.floor !== 'Upstairs') return false;
      if (effectiveQuery) {
        const hay = `${prop.title} ${prop.unitNumber} ${prop.code} ${prop.floor} ${prop.fullDesc} ${prop.amenities.join(' ')}`.toLowerCase();
        if (!hay.includes(effectiveQuery)) return false;
      }
      return true;
    });
  }, [sourceProperties, unitFilter, effectiveQuery, wishlistIds]);

  const videoTestimonials: Record<string, string> = {
    'unit-91': 'X1BZWkGFV9c',
    'unit-173': 'rOrM5xTcuU4',
    'unit-250': '46k-NuEegY0',
    'unit-333': 'sekSKD_H2WM',
    'unit-335': 'rOrM5xTcuU4',
  };

  const handleOpenModal = (prop: PropertyListing, defaultTab: 'gallery' | 'calendar' = 'gallery') => {
    setActiveModalProperty(prop);
    setModalImageIndex(0);
    setModalTab(defaultTab);
  };

  const toggleInlineCalendar = (propertyId: string) => {
    setExpandedCalendarId((prev) => (prev === propertyId ? null : propertyId));
  };

  const handleAddPropertyToCart = async (prop: PropertyListing) => {
    if (prop.status === 'Reserved') return;
    const selectedTermVal = stayTerms[prop.id] || 'month:1';
    const term = STAY_OPTIONS.find((o) => o.value === selectedTermVal) || STAY_OPTIONS[0];
    const checkIn = checkInDates[prop.id] || undefined;

    const ok = await addItem(
      {
        referenceId: prop.id,
        itemType: 'accommodation',
        quantity: term.qty,
        metadata: {
          billingUnit: term.billingUnit,
          checkIn,
        },
      },
      { openDrawerOnSuccess: true },
    );

    if (ok) {
      setJustAddedUnit(prop.id);
      window.setTimeout(() => {
        setJustAddedUnit((curr) => (curr === prop.id ? null : curr));
      }, 2000);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('tv')) return <Tv className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('air') || a.includes('conditioning') || a.includes('heat')) return <Snowflake className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('bath')) return <Bath className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('disabled') || a.includes('wheelchair')) return <Accessibility className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('pet')) return <Dog className="w-3.5 h-3.5 text-[#00b7a8]" />;
    if (a.includes('fire')) return <Flame className="w-3.5 h-3.5 text-[#00b7a8]" />;
    return <Check className="w-3.5 h-3.5 text-[#00b7a8]" />;
  };

  return (
    <section id="portfolio" className="bg-white py-12 sm:py-16 text-left border-b border-[#e5e5e5]">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Intro */}
        <div className="text-center space-y-3 max-w-[850px] mx-auto">
          <h6 className="et_section_h6 text-[#1d4f5d]">
            Furnished Residences &amp; Flexible Stays
          </h6>
          <h2 className="type-h2 text-[#1b1d20]">
            Comfortable, Move-In-Ready Apartments for Short Visits, Relocations, and Extended Stays
          </h2>
          <p className="type-body text-[#434a4f]">
            Explore our collection of fully furnished 1- and 2-bedroom apartments in Rancho Cordova. Designed for families, relocating homeowners, visiting guests on <strong className="font-semibold text-[#1b1d20]">5+ night stays</strong>, and organizations booking <strong className="font-semibold text-[#1b1d20]">30+ day extended stays</strong>, every residence includes utilities, high-speed Wi-Fi, and dedicated parking.
          </p>
        </div>

        {/* Interactive Portfolio Filter & Search Bar */}
        <div className="bg-[#faf8f5] border border-[#e6dfd5] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Collections (${sourceProperties.length})` },
              ...(wishlistIds.length > 0
                ? [{ id: 'saved', label: `Saved (${wishlistIds.length})` }]
                : []),
              { id: 'sacramento', label: 'Corporate Stays' },
              { id: 'los-angeles', label: 'Los Angeles Vacation Rentals' },
              { id: '1bed', label: '1 Bed / 1 Bath' },
              { id: '2bed', label: '2 Bed / 2 Bath' },
              { id: 'downstairs', label: 'Ground Floor' },
              { id: 'upstairs', label: 'Upstairs' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setUnitFilter(f.id as typeof unitFilter)}
                className={`type-btn px-3.5 py-2 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  unitFilter === f.id
                    ? 'bg-[#00b7a8] text-white border-[#00b7a8]'
                    : 'bg-white text-[#5c5046] border-[#dfd7cc] hover:border-[#00b7a8]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-[#857568] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={localQuery || searchQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  if (!e.target.value && onClearSearch) onClearSearch();
                }}
                placeholder="Search unit, layout, amenity..."
                className="w-full h-10 pl-9 pr-3 bg-white border border-[#dfd7cc] text-sm rounded-lg outline-none focus:border-[#00b7a8]"
              />
            </div>
            {(unitFilter !== 'all' || effectiveQuery) && (
              <button
                type="button"
                onClick={() => {
                  setUnitFilter('all');
                  setLocalQuery('');
                  onClearSearch?.();
                }}
                className="type-btn px-3 py-2 text-[#5c5046] hover:text-[#282828] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Listings Container */}
        <div className="space-y-16">
          {filteredProperties.length === 0 ? (
            <div className="p-10 text-center bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3">
              <p className="type-body font-medium text-[#5c5046]">
                No residences matched your current search or filter selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setUnitFilter('all');
                  setLocalQuery('');
                  onClearSearch?.();
                }}
                className="et_pb_button et_pb_button_teal type-btn py-2.5 px-5 cursor-pointer"
              >
                Show All {sourceProperties.length} Residences
              </button>
            </div>
          ) : null}

          {filteredProperties.map((prop, propIdx) => {
            const avail = AVAILABILITY_SCHEDULES[prop.id];
            const isCalendarOpen = expandedCalendarId === prop.id;
            const currentImgIdx = selectedMainImages[prop.id] || 0;
            const displayImage = prop.images[currentImgIdx] || prop.images[0] || getFallbackPropertyImage(propIdx);
            const isReserved = prop.status === 'Reserved';
            const selectedTermVal = stayTerms[prop.id] || 'month:1';
            const activeTerm = STAY_OPTIONS.find((o) => o.value === selectedTermVal) || STAY_OPTIONS[0];
            const nightlyEstimate = Math.round((prop.monthlyRate / 30) * 1.12);
            const estimatedStaySubtotal =
              activeTerm.billingUnit === 'month'
                ? prop.monthlyRate * activeTerm.qty
                : nightlyEstimate * activeTerm.qty;

            return (
              <div
                key={prop.id}
                id={prop.slug}
                className="border-t border-[#e5e5e5] pt-12 first:border-t-0 first:pt-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Image Gallery Column */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="relative aspect-4/3 overflow-hidden bg-[#f4efe9] border border-[#e6dfd5] rounded-lg shadow-xs group">
                      <img
                        src={displayImage}
                        alt={prop.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackPropertyImage(propIdx + currentImgIdx);
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 cursor-pointer"
                        loading="lazy"
                        onClick={() => {
                          if (onViewListingDetails) {
                            onViewListingDetails(prop);
                          } else {
                            handleOpenModal(prop, 'gallery');
                          }
                        }}
                      />

                      {prop.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMainImages((prev) => ({
                                ...prev,
                                [prop.id]: currentImgIdx === 0 ? prop.images.length - 1 : currentImgIdx - 1,
                              }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMainImages((prev) => ({
                                ...prev,
                                [prop.id]: currentImgIdx === prop.images.length - 1 ? 0 : currentImgIdx + 1,
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleOpenModal(prop, 'gallery')}
                        className="type-btn absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-[#282828] rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>All Photos ({prop.images.length})</span>
                      </button>

                      <div className="type-support absolute top-3 left-3 bg-[#241d18]/80 text-white font-semibold px-3 py-1 rounded-md">
                        {prop.propertyType || prop.category || 'Furnished Residence'}
                      </div>

                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const res = await toggleWishlist(prop.id);
                          if (res.requiresAuth) {
                            onNavigate?.('login');
                          }
                        }}
                        aria-label={isWishlisted(prop.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isWishlisted(prop.id)
                            ? 'bg-white text-rose-600 shadow-sm'
                            : 'bg-black/65 hover:bg-black/85 text-white'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted(prop.id) ? 'fill-rose-600 text-rose-600' : ''
                          }`}
                        />
                      </button>

                      <div className="type-support absolute bottom-3 left-3 bg-black/75 text-white font-medium px-2.5 py-0.5 rounded-md tabular-nums">
                        {currentImgIdx + 1} / {prop.images.length}
                      </div>
                    </div>

                    {/* Thumbnail Row */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {prop.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedMainImages((prev) => ({ ...prev, [prop.id]: i }));
                          }}
                          className={`w-18 sm:w-20 h-14 shrink-0 overflow-hidden rounded border transition-all cursor-pointer ${
                            currentImgIdx === i
                              ? 'border-[#00b7a8] opacity-100 shadow-xs'
                              : 'border-[#d9d9d9] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackPropertyImage(propIdx + i);
                            }}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Video Walkthrough Embed if available */}
                    {videoTestimonials[prop.id] && (
                      <div className="mt-4 border border-[#e5e5e5] rounded-lg overflow-hidden">
                        <YouTubeEmbed
                          urlOrId={videoTestimonials[prop.id]}
                          title={`Guest Video Walkthrough & Review - ${prop.unitNumber}`}
                          aspectRatio="aspect-16/9"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-6 space-y-5">
                    {/* Header Row: Unit metadata + live status + rate */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#efe9e0] pb-3">
                      <div className="type-support flex flex-wrap items-center gap-2 text-[#5c5046]">
                        <span className="font-semibold text-[#00897d]">
                          {prop.unitNumber} ({prop.code})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.floor}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {prop.bedrooms} Bed / {prop.bathrooms} Bath · Up to{' '}
                          {prop.maxGuests || Math.max(2, prop.bedrooms * 2)} Guests
                        </span>
                        {prop.verified === true && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#1b1d20]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#00897d]" />
                              <span>Verified</span>
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            isReserved
                              ? 'text-rose-700'
                              : prop.status === 'Inquired'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {isReserved
                            ? 'Currently Reserved'
                            : avail
                            ? `${avail.currentStatus} (${avail.nextAvailableDate})`
                            : prop.status}
                        </span>
                      </div>

                      <div className="text-right tabular-nums">
                        <span className="text-xl font-bold text-[#282828] block">
                          ${prop.monthlyRate.toLocaleString()}{' '}
                          <span className="type-support font-normal text-[#857568]">/ month</span>
                        </span>
                        <span className="type-support text-[#857568]">
                          or ~${nightlyEstimate}/night (5–29 nights)
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3
                        onClick={() => {
                          if (onViewListingDetails) {
                            onViewListingDetails(prop);
                          } else {
                            handleOpenModal(prop, 'gallery');
                          }
                        }}
                        className="type-h3 text-[#282828] hover:text-[#00b7a8] cursor-pointer transition-colors"
                      >
                        {prop.title}
                      </h3>
                      <p className="type-support text-[#697076] mt-1.5">
                        {prop.pricingNote ||
                          'Includes utilities, 400+ Mbps Wi-Fi, and dedicated parking. Flexible 5+ night short stays and tax-exempt 30+ day stays.'}
                      </p>
                    </div>

                    {/* Amenities Strip */}
                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                      {prop.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="type-support inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-md font-medium text-[#5c5046]"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Availability Status Callout */}
                    {avail && (
                      <div className="type-support p-3.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-lg text-[#5c5046] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00b7a8] shrink-0" />
                          <span>{avail.statusMessage}</span>
                        </div>
                        <button
                          onClick={() => toggleInlineCalendar(prop.id)}
                          className="type-btn text-[#00897d] hover:underline cursor-pointer shrink-0"
                        >
                          {isCalendarOpen ? 'Close Calendar ↑' : 'View Calendar ↓'}
                        </button>
                      </div>
                    )}

                    {/* Narrative Description */}
                    <div className="type-body text-[#434a4f] whitespace-pre-line space-y-2">
                      <p>{prop.fullDesc}</p>
                    </div>

                    <div className="pt-1">
                      <h4 className="type-h4 text-[#1b1d20] mb-2.5">
                        Residence Highlights &amp; Inclusions
                      </h4>
                      <ul className="type-support grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#434a4f]">
                        {prop.features.slice(0, 6).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instant Cart Configuration Bar */}
                    <div className="p-4 sm:p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="type-label text-[#282828]">Configure Stay &amp; Add to Cart</span>
                        <span className="text-base font-bold text-[#282828] tabular-nums">
                          Est. ${estimatedStaySubtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block type-label text-[#282828] mb-1.5">
                            Stay Length
                          </label>
                          <select
                            value={selectedTermVal}
                            onChange={(e) =>
                              setStayTerms((prev) => ({ ...prev, [prop.id]: e.target.value }))
                            }
                            disabled={isReserved}
                            className="w-full h-11 px-3 bg-white border border-[#dfd7cc] rounded-lg text-sm font-medium text-[#282828] outline-none focus:border-[#00b7a8]"
                          >
                            {STAY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block type-label text-[#282828] mb-1.5">
                            Preferred Check-In
                          </label>
                          <input
                            type="date"
                            min={todayIso}
                            value={checkInDates[prop.id] || ''}
                            onChange={(e) =>
                              setCheckInDates((prev) => ({ ...prev, [prop.id]: e.target.value }))
                            }
                            disabled={isReserved}
                            className="w-full h-11 px-3 bg-white border border-[#dfd7cc] rounded-lg text-sm font-medium text-[#282828] outline-none focus:border-[#00b7a8]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          disabled={isReserved || isMutating}
                          onClick={() => handleAddPropertyToCart(prop)}
                          className={`type-btn flex-1 min-w-[180px] py-2.5 px-4 rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                            isReserved
                              ? 'bg-[#ebe4da] text-[#857568]'
                              : justAddedUnit === prop.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#00b7a8] hover:bg-[#009b8e] text-white'
                          }`}
                        >
                          {isReserved ? (
                            <span>Currently Reserved</span>
                          ) : justAddedUnit === prop.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Cart</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add Stay to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onSelectPropertyForBooking(
                              prop.id,
                              checkInDates[prop.id] || undefined,
                              activeTerm.billingUnit === 'month' ? '30-60' : '5-10',
                            )
                          }
                          className="type-btn py-2.5 px-4 rounded-lg border border-[#dfd7cc] bg-white hover:bg-[#f4efe9] text-[#282828] cursor-pointer transition-colors"
                        >
                          Custom Inquiry
                        </button>
                      </div>
                    </div>

                    {/* Secondary Action Buttons Row */}
                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (onViewListingDetails) {
                            onViewListingDetails(prop);
                          } else {
                            handleOpenModal(prop, 'gallery');
                          }
                        }}
                        className="et_pb_button et_pb_button_white type-btn py-2.5 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Full Suite Details</span>
                        <ArrowRight className="w-4 h-4 text-[#00b7a8]" />
                      </button>

                      <button
                        onClick={() => toggleInlineCalendar(prop.id)}
                        className={`et_pb_button type-btn py-2.5 px-4 flex items-center gap-1.5 cursor-pointer ${
                          isCalendarOpen
                            ? 'bg-[#82634f] text-white'
                            : 'bg-[#e6f8f6] text-[#00897d] border border-[#00b7a8]/40 hover:bg-[#d0f3ef]'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{isCalendarOpen ? 'Hide Calendar' : 'Availability Calendar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Visual Availability Calendar Accordion */}
                {isCalendarOpen && (
                  <div className="mt-8 pt-6 border-t border-[#e6dfd5] animate-in fade-in">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="type-h4 text-[#282828] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00b7a8]" />
                        <span>Availability Calendar for {prop.unitNumber} ({prop.code})</span>
                      </h4>
                      <button
                        onClick={() => setExpandedCalendarId(null)}
                        className="type-btn text-[#857568] hover:text-[#282828] cursor-pointer"
                      >
                        Close [×]
                      </button>
                    </div>

                    <AvailabilityCalendar
                      propertyId={prop.id}
                      unitTitle={prop.title}
                      unitNumber={prop.unitNumber}
                      onSelectDates={(startDate, duration) => {
                        setCheckInDates((prev) => ({ ...prev, [prop.id]: startDate }));
                        onSelectPropertyForBooking(prop.id, startDate, duration);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Community & Residence Inclusions Summary */}
        <div className="type-body bg-[#faf8f5] border border-[#e6dfd5] rounded-xl p-6 sm:p-10 space-y-4 text-left text-[#434a4f]">
          <h3 className="type-h3 text-[#282828]">
            Standard Residence &amp; Community Inclusions
          </h3>
          <p>
            Every Easy Travel Lodging apartment is prepared for immediate, comfortable living—whether you are booking a 5-night family visit, managing a home renovation or relocation, or settling in for a multi-month stay across California’s homes.
          </p>
          <p>
            Guests enjoy access to a 24-hour fitness center, swimming pools, heated spas, and outdoor volleyball and tennis courts. Inside each apartment you will find central air and heating, a full-size refrigerator, range and oven, microwave, dishwasher, updated kitchen counters, and an in-unit stackable washer and dryer.
          </p>
          <p>
            Living spaces include a built-in dining credenza, an indoor fireplace, an updated bathroom, and a private patio or balcony. Kitchens and utility closets come stocked with a Keurig coffee maker, Instant Pot, cookware, dishes, vacuum cleaner, iron and ironing board, and starter laundry and cleaning supplies.
          </p>
          <p className="font-semibold text-[#1b1d20]">
            Utilities include electricity, gas, water, sewer, trash, dedicated parking, and 400+ Mbps Wi-Fi, plus a 55&quot; Smart TV in the living room and a 43&quot; Smart TV in every bedroom. Approved pets and service animals are welcome in designated suites with advance notice.
          </p>
        </div>
      </div>

      {/* Modal Lightbox with Gallery and Availability Calendar Tabs */}
      {activeModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-xl p-6 sm:p-8 space-y-6 relative border border-[#d9d9d9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
              <div>
                <span className="type-support font-semibold text-[#00897d] uppercase tracking-wider block">
                  {activeModalProperty.unitNumber} ({activeModalProperty.code}) · {activeModalProperty.category || 'Furnished Residence'}
                </span>
                <h3 className="type-h3 text-[#1b1d20] mt-0.5">
                  {activeModalProperty.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProperty(null)}
                className="p-2 text-slate-500 hover:text-black cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs: Gallery vs Availability Calendar */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setModalTab('gallery')}
                className={`type-btn py-2.5 px-4 cursor-pointer border-b-2 transition-colors ${
                  modalTab === 'gallery'
                    ? 'border-[#00b7a8] text-[#00b7a8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Photo Gallery ({activeModalProperty.images.length})
              </button>
              <button
                onClick={() => setModalTab('calendar')}
                className={`type-btn py-2.5 px-4 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'calendar'
                    ? 'border-[#00b7a8] text-[#00b7a8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Availability Calendar</span>
              </button>
            </div>

            {modalTab === 'gallery' ? (
              <>
                <div className="space-y-3">
                  <div className="relative aspect-16/9 bg-black rounded-lg overflow-hidden">
                    <img
                      src={activeModalProperty.images[modalImageIndex] || activeModalProperty.images[0]}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackPropertyImage(modalImageIndex);
                      }}
                      className="w-full h-full object-contain"
                    />
                    {activeModalProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === 0 ? activeModalProperty.images.length - 1 : prev - 1,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === activeModalProperty.images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {activeModalProperty.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setModalImageIndex(i)}
                        className={`w-16 h-12 shrink-0 rounded overflow-hidden border-2 cursor-pointer ${
                          modalImageIndex === i ? 'border-[#00b7a8]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackPropertyImage(i);
                          }}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="type-body space-y-3 text-[#434a4f]">
                  <p className="whitespace-pre-line">{activeModalProperty.fullDesc}</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="type-body text-slate-600">
                  Select your preferred check-in and check-out dates for {activeModalProperty.unitNumber}. Both short stays (5+ nights) and extended monthly stays are supported.
                </p>
                <AvailabilityCalendar
                  propertyId={activeModalProperty.id}
                  unitTitle={activeModalProperty.title}
                  unitNumber={activeModalProperty.unitNumber}
                  onSelectDates={(startDate, duration) => {
                    const id = activeModalProperty.id;
                    setActiveModalProperty(null);
                    onSelectPropertyForBooking(id, startDate, duration);
                  }}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e5e5e5]">
              <span className="font-bold text-xl text-[#1b1d20] tabular-nums">
                ${activeModalProperty.monthlyRate.toLocaleString()} / month
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    if (onViewListingDetails) {
                      const prop = activeModalProperty;
                      setActiveModalProperty(null);
                      onViewListingDetails(prop);
                    } else {
                      setActiveModalProperty(null);
                    }
                  }}
                  className="type-btn px-4 py-2.5 rounded-lg border border-[#dfd7cc] cursor-pointer hover:bg-[#faf8f5]"
                >
                  Full Suite Page
                </button>
                <button
                  disabled={activeModalProperty.status === 'Reserved' || isMutating}
                  onClick={async () => {
                    const prop = activeModalProperty;
                    setActiveModalProperty(null);
                    await handleAddPropertyToCart(prop);
                  }}
                  className="type-btn px-5 py-2.5 rounded-lg bg-[#00b7a8] hover:bg-[#009b8e] disabled:bg-[#ebe4da] disabled:text-[#857568] text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {activeModalProperty.status === 'Reserved' ? 'Reserved' : 'Add Stay to Cart'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    const id = activeModalProperty.id;
                    setActiveModalProperty(null);
                    onSelectPropertyForBooking(id);
                  }}
                  className="type-btn px-4 py-2.5 rounded-lg bg-[#82634f] hover:bg-[#6e5240] text-white cursor-pointer"
                >
                  Custom Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
