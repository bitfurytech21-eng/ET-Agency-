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
  const [unitFilter, setUnitFilter] = useState<
    'all' | 'saved' | 'sacramento' | 'los-angeles' | '1bed' | '2bed' | 'downstairs' | 'upstairs'
  >('all');
  const [localQuery, setLocalQuery] = useState<string>('');

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
    if (a.includes('air') || a.includes('conditioning') || a.includes('heat'))
      return <Snowflake className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('bath')) return <Bath className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('disabled') || a.includes('wheelchair'))
      return <Accessibility className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('pet')) return <Dog className="w-3.5 h-3.5 text-[#14616d]" />;
    if (a.includes('fire')) return <Flame className="w-3.5 h-3.5 text-[#14616d]" />;
    return <Check className="w-3.5 h-3.5 text-[#14616d]" />;
  };

  return (
    <section id="portfolio" className="bg-[#f8fafc] py-14 sm:py-20 text-left border-b border-[#e2e8f0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        {/* Section Intro */}
        <div className="text-center space-y-3 max-w-[820px] mx-auto">
          <span className="et_section_h6 block">Portfolio &amp; Residences</span>
          <h2 className="type-h2 text-[#0f172a]">
            Furnished Residences for Flexible &amp; Extended Stays
          </h2>
          <p className="type-body text-[#475569]">
            Explore our collection of fully furnished 1- and 2-bedroom apartments. Designed for relocating homeowners, visiting professionals on <strong className="font-semibold text-[#0f172a]">5+ night stays</strong>, and organizations booking <strong className="font-semibold text-[#0f172a]">30+ day corporate leases</strong>. Every suite includes high-speed Wi-Fi, utilities, and dedicated parking.
          </p>
        </div>

        {/* Interactive Portfolio Filter & Search Bar */}
        <div className="bg-white border border-[#e2e8f0] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All Collections (${sourceProperties.length})` },
              ...(wishlistIds.length > 0
                ? [{ id: 'saved', label: `Saved (${wishlistIds.length})` }]
                : []),
              { id: 'sacramento', label: 'Corporate Stays' },
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
                  className={`type-btn px-3.5 py-2 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#14616d] text-white border-[#14616d]'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1] hover:text-[#0f172a]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 xl:w-64">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localQuery || searchQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  if (!e.target.value && onClearSearch) onClearSearch();
                }}
                placeholder="Search unit, floor, amenity..."
                className="w-full h-11 pl-9 pr-3 bg-[#f8fafc] focus:bg-white border border-[#cbd5e1] text-base text-[#0f172a] rounded-lg outline-none focus:border-[#14616d] transition-colors"
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
                className="type-btn px-3 py-2 text-[#64748b] hover:text-[#0f172a] cursor-pointer whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Listings Container */}
        <div className="space-y-10 sm:space-y-12">
          {filteredProperties.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#e2e8f0] rounded-2xl shadow-xs space-y-4">
              <p className="type-body font-medium text-[#475569]">
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
              <ScrollReveal key={prop.id} delay={Math.min(propIdx * 40, 160)} direction="up">
                <div id={prop.slug} className="card-surface p-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Image Gallery Column */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl group">
                        <img
                          src={displayImage}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getFallbackPropertyImage(propIdx + currentImgIdx);
                          }}
                          className="w-full h-full object-cover img-zoom cursor-pointer"
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
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0f172a]/70 hover:bg-[#0f172a] text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
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
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0f172a]/70 hover:bg-[#0f172a] text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenModal(prop, 'gallery')}
                          className="type-btn absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-[#0f172a] rounded-lg shadow-xs border border-[#e2e8f0] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#14616d]" />
                          <span>All Photos ({prop.images.length})</span>
                        </button>

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
                              ? 'bg-white text-rose-600 shadow-xs'
                              : 'bg-[#0f172a]/65 hover:bg-[#0f172a]/85 text-white'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isWishlisted(prop.id) ? 'fill-rose-600 text-rose-600' : ''
                            }`}
                          />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-[#0f172a]/75 text-white font-mono text-xs px-2 py-0.5 rounded tabular-nums">
                          {currentImgIdx + 1} / {prop.images.length}
                        </div>
                      </div>

                      {/* Thumbnail Row */}
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {prop.images.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSelectedMainImages((prev) => ({ ...prev, [prop.id]: i }));
                            }}
                            className={`w-18 sm:w-20 h-14 shrink-0 overflow-hidden rounded-lg border transition-opacity cursor-pointer ${
                              currentImgIdx === i
                                ? 'border-[#14616d] ring-1 ring-[#14616d] opacity-100'
                                : 'border-[#e2e8f0] opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={img}
                              alt=""
                              referrerPolicy="no-referrer"
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
                        <div className="mt-3 border border-[#e2e8f0] rounded-xl overflow-hidden">
                          <YouTubeEmbed
                            urlOrId={videoTestimonials[prop.id]}
                            title={`Guest Video Walkthrough - ${prop.unitNumber}`}
                            aspectRatio="aspect-16/9"
                          />
                        </div>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-6 space-y-5">
                      {/* Header Row: Unboxed metadata + rate */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e2e8f0] pb-4">
                        <div className="type-support flex flex-wrap items-center gap-2 text-[#475569]">
                          <span className="font-semibold text-[#14616d]">
                            {prop.unitNumber} ({prop.code})
                          </span>
                          <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                          <span>{prop.floor}</span>
                          <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                          <span>
                            {prop.bedrooms} Bed / {prop.bathrooms} Bath · Up to{' '}
                            {prop.maxGuests || Math.max(2, prop.bedrooms * 2)} Guests
                          </span>
                          {prop.verified === true && (
                            <>
                              <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#0f172a]">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#14616d]" />
                                <span>Verified</span>
                              </span>
                            </>
                          )}
                          <span aria-hidden="true" className="text-[#cbd5e1]">·</span>
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
                          <span className="text-2xl font-bold font-mono tracking-tight text-[#0f172a] block">
                            ${prop.monthlyRate.toLocaleString()}{' '}
                            <span className="type-support font-normal font-sans text-[#64748b]">/ month</span>
                          </span>
                          <span className="type-support text-[#64748b] font-mono">
                            ~${nightlyEstimate}/night (5–29 nights)
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
                          className="type-h3 text-[#0f172a] hover:text-[#14616d] cursor-pointer transition-colors"
                        >
                          {prop.title}
                        </h3>
                        <p className="type-support text-[#64748b] mt-1.5">
                          {prop.pricingNote ||
                            'Includes utilities, 400+ Mbps Wi-Fi, and dedicated parking. Flexible 5+ night short stays and tax-exempt 30+ day stays.'}
                        </p>
                      </div>

                      {/* Amenities Strip */}
                      <div className="flex flex-wrap gap-2">
                        {prop.amenities.map((amenity, idx) => (
                          <div
                            key={idx}
                            className="type-support inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg font-medium text-[#334155]"
                          >
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Availability Status Callout */}
                      {avail && (
                        <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#475569] flex items-center justify-between gap-3">
                          <div className="type-support flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#14616d] shrink-0" />
                            <span>{avail.statusMessage}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleInlineCalendar(prop.id)}
                            className="type-btn text-[#14616d] hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            {isCalendarOpen ? 'Hide Calendar ↑' : 'View Calendar ↓'}
                          </button>
                        </div>
                      )}

                      {/* Narrative Description */}
                      <div className="type-body text-[#475569] whitespace-pre-line space-y-2">
                        <p>{prop.fullDesc}</p>
                      </div>

                      <div>
                        <h4 className="type-h4 text-[#0f172a] mb-2.5">
                          Residence Highlights &amp; Inclusions
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[#475569]">
                          {prop.features.slice(0, 6).map((f, i) => (
                            <li key={i} className="type-body flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#14616d] shrink-0 mt-1" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instant Cart Configuration Bar */}
                      <div className="p-4 sm:p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="type-label text-[#0f172a]">
                            Configure Stay
                          </span>
                          <span className="text-base font-bold font-mono tracking-tight text-[#0f172a] tabular-nums">
                            Est. ${estimatedStaySubtotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label text-[#475569]">
                              Stay Length
                            </label>
                            <select
                              value={selectedTermVal}
                              onChange={(e) =>
                                setStayTerms((prev) => ({ ...prev, [prop.id]: e.target.value }))
                              }
                              disabled={isReserved}
                              className="form-select font-medium"
                            >
                              {STAY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="form-label text-[#475569]">
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
                              className="form-input font-mono tabular-nums"
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
                                ? 'bg-[#e2e8f0] text-[#64748b] cursor-not-allowed border-[#e2e8f0]'
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
                          type="button"
                          onClick={() => {
                            if (onViewListingDetails) {
                              onViewListingDetails(prop);
                            } else {
                              handleOpenModal(prop, 'gallery');
                            }
                          }}
                          className="btn btn-sm btn-white group"
                        >
                          <span>Full Suite Details</span>
                          <ArrowRight className="w-4 h-4 text-[#14616d] btn-arrow" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleInlineCalendar(prop.id)}
                          className={`btn btn-sm ${
                            isCalendarOpen
                              ? 'btn-secondary'
                              : 'bg-[#edf6f8] text-[#14616d] border border-[#14616d]/25 hover:bg-[#e0f1f4]'
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
                    <div className="mt-8 pt-6 border-t border-[#e2e8f0] animate-fade-in">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="type-h4 text-[#0f172a] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#14616d]" />
                          <span>Availability Calendar for {prop.unitNumber} ({prop.code})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setExpandedCalendarId(null)}
                          className="type-btn text-[#64748b] hover:text-[#0f172a] cursor-pointer"
                        >
                          Close
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
        <div className="type-body bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-10 space-y-4 text-left text-[#475569] shadow-xs">
          <span className="et_section_h6 block">Included Standards</span>
          <h3 className="type-h3 text-[#0f172a]">
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
          <p className="font-semibold text-[#0f172a] pt-1">
            Utilities include electricity, gas, water, dedicated parking, and 400+ Mbps Wi-Fi, plus 4K Smart TVs in the living room and bedrooms. Approved pets and service animals are welcome in designated suites.
          </p>
        </div>
      </div>

      {/* Modal Lightbox with Gallery and Availability Calendar Tabs */}
      {activeModalProperty && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-2xl p-6 sm:p-8 space-y-6 relative border border-[#e2e8f0] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <div>
                <span className="type-support font-semibold text-[#14616d] block">
                  {activeModalProperty.unitNumber} ({activeModalProperty.code}) · {activeModalProperty.category || 'Furnished Residence'}
                </span>
                <h3 className="type-h3 text-[#0f172a] mt-0.5">
                  {activeModalProperty.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProperty(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Gallery vs Availability Calendar */}
            <div className="flex border-b border-[#e2e8f0] gap-2">
              <button
                type="button"
                onClick={() => setModalTab('gallery')}
                className={`type-btn py-2.5 px-4 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                  modalTab === 'gallery'
                    ? 'border-[#14616d] text-[#14616d]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Photo Gallery ({activeModalProperty.images.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('calendar')}
                className={`type-btn py-2.5 px-4 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  modalTab === 'calendar'
                    ? 'border-[#14616d] text-[#14616d]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Availability Calendar</span>
              </button>
            </div>

            {modalTab === 'gallery' ? (
              <>
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] bg-[#0f172a] rounded-xl overflow-hidden">
                    <img
                      src={activeModalProperty.images[modalImageIndex] || activeModalProperty.images[0]}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackPropertyImage(modalImageIndex);
                      }}
                      className="w-full h-full object-contain"
                    />
                    {activeModalProperty.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === 0 ? activeModalProperty.images.length - 1 : prev - 1,
                            )
                          }
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center cursor-pointer"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === activeModalProperty.images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center cursor-pointer"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {activeModalProperty.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setModalImageIndex(i)}
                        className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-opacity ${
                          modalImageIndex === i
                            ? 'border-[#14616d]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          referrerPolicy="no-referrer"
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

                <div className="type-body space-y-3 text-[#475569]">
                  <p className="whitespace-pre-line">{activeModalProperty.fullDesc}</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="type-body text-[#475569]">
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e2e8f0]">
              <span className="font-bold font-mono tracking-tight text-xl text-[#0f172a] tabular-nums">
                ${activeModalProperty.monthlyRate.toLocaleString()} / month
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (onViewListingDetails) {
                      const prop = activeModalProperty;
                      setActiveModalProperty(null);
                      onViewListingDetails(prop);
                    } else {
                      setActiveModalProperty(null);
                    }
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Full Suite Page
                </button>
                <button
                  type="button"
                  disabled={activeModalProperty.status === 'Reserved' || isMutating}
                  onClick={async () => {
                    const prop = activeModalProperty;
                    setActiveModalProperty(null);
                    await handleAddPropertyToCart(prop);
                  }}
                  className={`btn btn-sm ${
                    activeModalProperty.status === 'Reserved'
                      ? 'bg-[#e2e8f0] text-[#64748b] cursor-not-allowed border-[#e2e8f0]'
                      : 'btn-primary'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {activeModalProperty.status === 'Reserved' ? 'Reserved' : 'Add Stay to Cart'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = activeModalProperty.id;
                    setActiveModalProperty(null);
                    onSelectPropertyForBooking(id);
                  }}
                  className="btn btn-sm btn-secondary"
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
