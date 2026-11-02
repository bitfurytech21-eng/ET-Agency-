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
import { ScrollReveal } from './common/ScrollReveal';

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
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('tv')) return <Tv className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('air') || a.includes('conditioning') || a.includes('heat')) return <Snowflake className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('bath')) return <Bath className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('disabled') || a.includes('wheelchair')) return <Accessibility className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('pet')) return <Dog className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('fire')) return <Flame className="w-3.5 h-3.5 text-[#14616d]" />;
    return <Check className="w-3.5 h-3.5 text-[#14616d]" />;
  };

  return (
    <section id="portfolio" className="bg-[#faf7f2] py-14 sm:py-20 text-left border-b border-[#e2ded6]">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        {/* Section Intro */}
        <div className="text-center space-y-3.5 max-w-[820px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#e2ded6] text-xs font-semibold uppercase tracking-wider text-[#14616d] shadow-2xs">
            <span>Portfolio &amp; Residences</span>
          </div>
          <h2 className="type-h2 text-[#182024]">
            Furnished Residences for Flexible &amp; Extended Stays
          </h2>
          <p className="type-body text-[#4a545c]">
            Explore our collection of fully furnished 1- and 2-bedroom apartments. Designed for relocating homeowners, visiting professionals on <strong className="font-semibold text-[#182024]">5+ night stays</strong>, and organizations booking <strong className="font-semibold text-[#182024]">30+ day corporate leases</strong>. Every suite includes high-speed Wi-Fi, utilities, and dedicated parking.
          </p>
        </div>

        {/* Interactive Portfolio Filter & Search Bar */}
        <div className="bg-white border border-[#e2ded6] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: `All Collections (${sourceProperties.length})` },
              ...(wishlistIds.length > 0
                ? [{ id: 'saved', label: `Saved (${wishlistIds.length})` }]
                : []),
              { id: 'sacramento', label: 'Sacramento & Cordova' },
              { id: 'los-angeles', label: 'Los Angeles Suites' },
              { id: '1bed', label: '1 Bed / 1 Bath' },
              { id: '2bed', label: '2 Bed / 2 Bath' },
              { id: 'downstairs', label: 'Ground Floor' },
              { id: 'upstairs', label: 'Upper Level' },
            ].map((f) => {
              const isActive = unitFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setUnitFilter(f.id as typeof unitFilter)}
                  className={`type-btn px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#14616d] text-white border-[#14616d] shadow-2xs'
                      : 'bg-white text-[#4a545c] border-[#e2ded6] hover:border-[#14616d]/50 hover:text-[#182024]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-[#727e86] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localQuery || searchQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  if (!e.target.value && onClearSearch) onClearSearch();
                }}
                placeholder="Search unit, floor, amenity..."
                className="w-full h-10 pl-9 pr-3 bg-[#faf7f2]/60 hover:bg-white focus:bg-white border border-[#e2ded6] text-xs sm:text-sm text-[#182024] rounded-xl outline-none focus:border-[#14616d] transition-colors"
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
                className="type-btn px-3 py-2 text-xs font-semibold text-[#727e86] hover:text-[#182024] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Listings Container */}
        <div className="space-y-12 sm:space-y-16">
          {filteredProperties.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e2ded6] rounded-2xl shadow-xs space-y-4">
              <p className="type-body font-medium text-[#4a545c]">
                No residences matched your current search or filter selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setUnitFilter('all');
                  setLocalQuery('');
                  onClearSearch?.();
                }}
                className="btn btn-primary px-6"
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
              <ScrollReveal
                key={prop.id}
                delay={Math.min(propIdx * 50, 200)}
                direction="up"
              >
                <div
                  id={prop.slug}
                  className="card-surface card-hover p-6 sm:p-8"
                >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Image Gallery Column */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="relative aspect-4/3 overflow-hidden bg-[#faf7f2] border border-[#e2ded6] rounded-xl shadow-xs group">
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
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-4 h-4" />
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
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleOpenModal(prop, 'gallery')}
                        className="type-btn absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-[#182024] rounded-lg shadow-sm border border-[#e2ded6] flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#14616d]" />
                        <span>All Photos ({prop.images.length})</span>
                      </button>

                      <div className="type-support absolute top-3 left-3 bg-[#182024]/85 text-white font-semibold text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs">
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
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isWishlisted(prop.id)
                            ? 'bg-white text-rose-600 shadow-sm'
                            : 'bg-black/60 hover:bg-black/80 text-white'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted(prop.id) ? 'fill-rose-600 text-rose-600' : ''
                          }`}
                        />
                      </button>

                      <div className="type-support absolute bottom-3 left-3 bg-black/70 text-white font-medium text-xs px-2 py-0.5 rounded-md tabular-nums">
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
                          className={`w-18 sm:w-20 h-14 shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer ${
                            currentImgIdx === i
                              ? 'border-[#14616d] ring-1 ring-[#14616d] opacity-100 shadow-2xs'
                              : 'border-[#e2ded6] opacity-75 hover:opacity-100'
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
                      <div className="mt-3 border border-[#e2ded6] rounded-xl overflow-hidden shadow-2xs">
                        <YouTubeEmbed
                          urlOrId={videoTestimonials[prop.id]}
                          title={`Guest Video Walkthrough - ${prop.unitNumber}`}
                          aspectRatio="aspect-16/9"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                    {/* Header Row: Unit metadata + live status + rate */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2ded6] pb-3.5">
                      <div className="type-support flex flex-wrap items-center gap-2 text-[#4a545c]">
                        <span className="font-semibold text-[#14616d]">
                          {prop.unitNumber} ({prop.code})
                        </span>
                        <span aria-hidden="true" className="text-[#a5b0b6]">·</span>
                        <span>{prop.floor}</span>
                        <span aria-hidden="true" className="text-[#a5b0b6]">·</span>
                        <span>
                          {prop.bedrooms} Bed / {prop.bathrooms} Bath · Up to{' '}
                          {prop.maxGuests || Math.max(2, prop.bedrooms * 2)} Guests
                        </span>
                        {prop.verified === true && (
                          <>
                            <span aria-hidden="true" className="text-[#a5b0b6]">·</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-[#182024]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#14616d]" />
                              <span>Verified</span>
                            </span>
                          </>
                        )}
                        <span aria-hidden="true" className="text-[#a5b0b6]">·</span>
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
                        <span className="text-2xl font-bold font-mono tracking-tight text-[#182024] block">
                          ${prop.monthlyRate.toLocaleString()}{' '}
                          <span className="text-xs font-normal font-sans text-[#727e86]">/ month</span>
                        </span>
                        <span className="type-support text-xs text-[#727e86]">
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
                        className="type-h3 text-[#182024] hover:text-[#14616d] cursor-pointer transition-colors"
                      >
                        {prop.title}
                      </h3>
                      <p className="type-support text-[#4a545c] mt-1.5">
                        {prop.pricingNote ||
                          'Includes utilities, 400+ Mbps Wi-Fi, and dedicated parking. Flexible 5+ night short stays and tax-exempt 30+ day stays.'}
                      </p>
                    </div>

                    {/* Amenities Strip */}
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {prop.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="type-support inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] border border-[#e2ded6] rounded-lg font-medium text-[#4a545c] text-xs"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Availability Status Callout */}
                    {avail && (
                      <div className="type-support p-3.5 bg-[#faf7f2] border border-[#e2ded6] rounded-xl text-[#4a545c] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-4 h-4 text-[#14616d] shrink-0" />
                          <span>{avail.statusMessage}</span>
                        </div>
                        <button
                          onClick={() => toggleInlineCalendar(prop.id)}
                          className="type-btn text-xs font-semibold text-[#14616d] hover:underline cursor-pointer shrink-0"
                        >
                          {isCalendarOpen ? 'Hide Calendar ↑' : 'View Calendar ↓'}
                        </button>
                      </div>
                    )}

                    {/* Narrative Description */}
                    <div className="type-body text-[#4a545c] whitespace-pre-line space-y-2">
                      <p>{prop.fullDesc}</p>
                    </div>

                    <div className="pt-1">
                      <h4 className="type-h4 text-[#182024] mb-2.5">
                        Residence Highlights &amp; Inclusions
                      </h4>
                      <ul className="type-support grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4a545c]">
                        {prop.features.slice(0, 6).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <Check className="w-4 h-4 text-[#14616d] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instant Cart Configuration Bar */}
                    <div className="p-4 sm:p-5 bg-[#faf7f2] border border-[#e2ded6] rounded-2xl space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="type-label text-xs uppercase tracking-wider font-bold text-[#182024]">
                          Configure Stay
                        </span>
                        <span className="text-base font-bold font-mono tracking-tight text-[#182024] tabular-nums">
                          Est. ${estimatedStaySubtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#4a545c] mb-1.5">
                            Stay Length
                          </label>
                          <select
                            value={selectedTermVal}
                            onChange={(e) =>
                              setStayTerms((prev) => ({ ...prev, [prop.id]: e.target.value }))
                            }
                            disabled={isReserved}
                            className="w-full h-11 px-3 bg-white border border-[#e2ded6] rounded-xl text-xs sm:text-sm font-medium text-[#182024] outline-none focus:border-[#14616d]"
                          >
                            {STAY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a545c] mb-1.5">
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
                            className="w-full h-11 px-3 bg-white border border-[#e2ded6] rounded-xl text-xs sm:text-sm font-medium text-[#182024] outline-none focus:border-[#14616d]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          disabled={isReserved || isMutating}
                          onClick={() => handleAddPropertyToCart(prop)}
                          className={`btn flex-1 min-w-[180px] ${
                            isReserved
                              ? 'bg-[#e2ded6] text-[#727e86] cursor-not-allowed border-[#e2ded6]'
                              : justAddedUnit === prop.id
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'btn-primary'
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
                          className="btn btn-outline"
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
                        className="btn btn-white text-xs group"
                      >
                        <span>Full Suite Details</span>
                        <ArrowRight className="w-4 h-4 text-[#14616d] btn-arrow" />
                      </button>

                      <button
                        onClick={() => toggleInlineCalendar(prop.id)}
                        className={`btn text-xs ${
                          isCalendarOpen
                            ? 'bg-[#966746] text-white border-[#966746]'
                            : 'bg-[#e8f2f4] text-[#14616d] border-[#14616d]/30 hover:bg-[#d8eaed]'
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
                  <div className="mt-8 pt-6 border-t border-[#e2ded6] animate-in fade-in">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="type-h4 text-[#182024] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#14616d]" />
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
              </ScrollReveal>
            );
          })}
        </div>

        {/* Community & Residence Inclusions Summary */}
        <div className="type-body bg-white border border-[#e2ded6] rounded-2xl p-6 sm:p-10 space-y-4 text-left text-[#4a545c] shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#faf7f2] border border-[#e2ded6] text-xs font-semibold uppercase tracking-wider text-[#14616d]">
            <span>Included Standards</span>
          </div>
          <h3 className="type-h3 text-[#182024]">
            Standard Residence &amp; Community Inclusions
          </h3>
          <p>
            Every Easy Travel Lodging residence is curated for immediate, comfortable living—whether you are booking a 5-night executive visit, managing a home renovation or relocation, or settling in for an extended multi-month lease.
          </p>
          <p>
            Guests enjoy access to community fitness facilities, swimming pools, heated spas, and outdoor sports courts. Inside each residence you will find central air and heating, full-size refrigeration, microwave, dishwasher, cookware, and private in-unit laundry.
          </p>
          <p>
            Living spaces feature dedicated dining credenzas, comfortable work areas, private patios or balconies, and starter coffee and tea bars.
          </p>
          <p className="font-semibold text-[#182024] pt-1">
            Utilities include electricity, gas, water, dedicated parking, and 400+ Mbps Wi-Fi, plus 4K Smart TVs in the living room and bedrooms. Approved pets and service animals are welcome in designated suites.
          </p>
        </div>
      </div>

      {/* Modal Lightbox with Gallery and Availability Calendar Tabs */}
      {activeModalProperty && (
        <div className="fixed inset-0 z-50 bg-[#182024]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-6 relative border border-[#e2ded6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e2ded6] pb-4">
              <div>
                <span className="type-support font-semibold text-[#14616d] text-xs uppercase tracking-wider block">
                  {activeModalProperty.unitNumber} ({activeModalProperty.code}) · {activeModalProperty.category || 'Furnished Residence'}
                </span>
                <h3 className="type-h3 text-[#182024] mt-0.5">
                  {activeModalProperty.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProperty(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#727e86] hover:text-[#182024] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Gallery vs Availability Calendar */}
            <div className="flex border-b border-[#e2ded6] gap-2">
              <button
                onClick={() => setModalTab('gallery')}
                className={`type-btn py-2.5 px-4 cursor-pointer text-xs font-semibold border-b-2 transition-colors ${
                  modalTab === 'gallery'
                    ? 'border-[#14616d] text-[#14616d]'
                    : 'border-transparent text-[#727e86] hover:text-[#182024]'
                }`}
              >
                Photo Gallery ({activeModalProperty.images.length})
              </button>
              <button
                onClick={() => setModalTab('calendar')}
                className={`type-btn py-2.5 px-4 cursor-pointer text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'calendar'
                    ? 'border-[#14616d] text-[#14616d]'
                    : 'border-transparent text-[#727e86] hover:text-[#182024]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Availability Calendar</span>
              </button>
            </div>

            {modalTab === 'gallery' ? (
              <>
                <div className="space-y-3">
                  <div className="relative aspect-16/9 bg-[#182024] rounded-xl overflow-hidden shadow-inner">
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
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center cursor-pointer shadow-md"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === activeModalProperty.images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center cursor-pointer shadow-md"
                          aria-label="Next image"
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
                        className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          modalImageIndex === i ? 'border-[#14616d] ring-1 ring-[#14616d]' : 'border-transparent opacity-70 hover:opacity-100'
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

                <div className="type-body space-y-3 text-[#4a545c]">
                  <p className="whitespace-pre-line">{activeModalProperty.fullDesc}</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="type-body text-[#4a545c]">
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e2ded6]">
              <span className="font-bold font-mono tracking-tight text-xl text-[#182024] tabular-nums">
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
                  className="btn btn-outline text-xs"
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
                  className={`btn text-xs ${
                    activeModalProperty.status === 'Reserved'
                      ? 'bg-[#e2ded6] text-[#727e86] cursor-not-allowed border-[#e2ded6]'
                      : 'btn-primary'
                  }`}
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
                  className="btn btn-secondary text-xs"
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
