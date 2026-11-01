import React, { useMemo, useState } from 'react';
import { PropertyListing, getFallbackPropertyImage } from '../data/lodgingData';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { ShopServicesSection } from './ShopServicesSection';
import { useCart } from '../context/CartContext';
import {
  Wifi,
  Tv,
  Snowflake,
  Bath,
  Accessibility,
  Dog,
  Flame,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { YouTubeEmbed } from './YouTubeEmbed';

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
  onOpenBooking,
  onNavigate,
}) => {
  const { addItem, isMutating } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState('');
  const [selectedDurationDays, setSelectedDurationDays] = useState(30);
  const [justAdded, setJustAdded] = useState(false);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isReserved = property.status === 'Reserved';

  const videoTestimonials: Record<string, string> = {
    'unit-91': 'X1BZWkGFV9c',
    'unit-173': 'rOrM5xTcuU4',
    'unit-250': '46k-NuEegY0',
    'unit-333': 'sekSKD_H2WM',
    'unit-335': 'rOrM5xTcuU4',
  };

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('tv')) return <Tv className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('air') || a.includes('conditioning') || a.includes('heat')) return <Snowflake className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('bath')) return <Bath className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('disabled') || a.includes('wheelchair')) return <Accessibility className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('pet')) return <Dog className="w-5 h-5 text-[#00b7a8]" />;
    if (a.includes('fire')) return <Flame className="w-5 h-5 text-[#00b7a8]" />;
    return <Check className="w-5 h-5 text-[#00b7a8]" />;
  };

  const isMonthlyStay = selectedDurationDays >= 30;
  const monthsCount = Math.max(1, Math.round(selectedDurationDays / 30));
  const nightlyRate = Math.round((property.monthlyRate / 30) * 1.12);
  const calculatedSubtotal = isMonthlyStay
    ? property.monthlyRate * monthsCount
    : nightlyRate * selectedDurationDays;

  const handleAddStayToCart = async () => {
    if (isReserved) return;
    const ok = await addItem(
      {
        referenceId: property.id,
        itemType: 'accommodation',
        quantity: isMonthlyStay ? monthsCount : selectedDurationDays,
        metadata: {
          billingUnit: isMonthlyStay ? 'month' : 'night',
          checkIn: selectedCheckInDate || undefined,
        },
      },
      { openDrawerOnSuccess: true },
    );
    if (ok) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white text-[#333333] pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#faf8f5] border-b border-[#e6dfd5] py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[#5c5046] hover:text-[#00b7a8] font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Residences</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[#857568]">
            <span>Residences</span>
            <span>/</span>
            <span className="text-[#282828] font-medium">{property.unitNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Title & Classification */}
        <div className="space-y-2 border-b border-stone-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#857568] mb-1">
                <span className="font-bold text-[#00897d]">
                  {property.category || 'Furnished Residence'}
                </span>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-bold ${
                    isReserved
                      ? 'text-rose-700'
                      : property.status === 'Inquired'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {isReserved ? 'Currently Reserved' : property.status}
                </span>
              </div>
              <h1 className="font-heading font-bold text-2xl sm:text-4xl text-[#282828]">
                {property.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#857568] mt-1">
                {property.unitNumber} ({property.code}) · {property.floor} · {property.bedrooms} Bed, {property.bathrooms} Bath · Rancho Cordova, CA
              </p>
            </div>

            {/* Price Card */}
            <div className="text-left sm:text-right bg-stone-50 border border-stone-200 p-3.5 sm:p-4 rounded-xl tabular-nums">
              <span className="text-xs text-[#857568] font-semibold block">Extended Monthly Rate</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#282828]">
                ${property.monthlyRate.toLocaleString()}
                <span className="text-sm font-normal text-[#5c5046]"> / month</span>
              </div>
              <span className="text-[11px] text-[#857568] block">
                Short stays (5–29 nights): ~${nightlyRate}/night · Utilities &amp; parking included
              </span>
            </div>
          </div>
        </div>

        {/* Flexible Stay & Rate Transparency Notice */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#282828] space-y-1">
          <p className="font-semibold">
            Flexible Stay Options: Reserve 30+ day extended stays (occupancy-tax exempt under California guidelines) or 5–29 night short visits.
          </p>
          <p className="text-[#5c5046]">
            {property.pricingNote ||
              'Includes utilities, 400+ Mbps Wi-Fi, and dedicated covered parking. Add directly to your shopping cart or request a custom multi-unit quote.'}
          </p>
        </div>

        {/* Hero Photo Gallery with Thumbnails & Lightbox */}
        <div className="space-y-3">
          <div className="relative aspect-16/10 sm:aspect-16/9 bg-stone-900 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={`${property.title} Photo ${activeImageIndex + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackPropertyImage(activeImageIndex);
              }}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {property.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>View All {property.images.length} Photos</span>
            </button>

            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 text-white text-xs font-medium rounded-lg tabular-nums">
              Photo {activeImageIndex + 1} of {property.images.length}
            </div>
          </div>

          {/* Thumbnail Slider */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 sm:w-24 h-14 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#00b7a8] scale-102 opacity-100 shadow-xs'
                    : 'border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
          {/* Main Info (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Amenities */}
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4">
              <h4 className="font-heading font-bold text-lg text-slate-900 border-b border-stone-200 pb-2">
                Included Residence Amenities
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-stone-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-xl text-slate-900">
                About This Residence
              </h4>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {property.fullDesc}
              </div>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h4 className="font-heading font-bold text-lg text-slate-900">
                Features &amp; Furnishings
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Availability Calendar */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#00b7a8]" />
                    <span>Availability Calendar</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your preferred check-in date and duration (5+ nights or 30+ day monthly increments) to update your estimate.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-xl shadow-xs">
                <AvailabilityCalendar
                  propertyId={property.id}
                  unitTitle={property.title}
                  unitNumber={property.unitNumber}
                  onSelectDates={(startDate, duration) => {
                    setSelectedCheckInDate(startDate);
                    if (duration) {
                      const durNum = parseInt(duration, 10);
                      if (!isNaN(durNum) && durNum > 0) {
                        setSelectedDurationDays(durNum >= 30 ? Math.round(durNum / 30) * 30 : Math.max(5, Math.min(29, durNum)));
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Video Walkthrough */}
            {videoTestimonials[property.id] && (
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <h4 className="font-heading font-bold text-lg text-slate-900">
                  Guest Video Walkthrough &amp; Review
                </h4>
                <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                  <YouTubeEmbed
                    urlOrId={videoTestimonials[property.id]}
                    title={`Guest Video Walkthrough & Review - ${property.unitNumber}`}
                    aspectRatio="aspect-16/9"
                  />
                </div>
              </div>
            )}

            {/* Full Rental Provisions */}
            <div className="bg-[#faf8f5] border border-[#e6dfd5] p-6 sm:p-8 space-y-3 text-xs sm:text-sm text-[#5c5046] leading-relaxed rounded-xl">
              <h5 className="font-heading font-bold text-base text-[#282828]">
                Residence Provisions &amp; Community Amenities
              </h5>
              <p>
                Easy Travel Lodging welcomes individuals, couples, families, relocating homeowners, and business guests staying in Greater Sacramento for short visits (5+ nights) or extended 30+ day stays.
              </p>
              <p>
                Community privileges include a 24-hour fitness center, swimming pools, heated spas, and outdoor volleyball and tennis courts. Inside, enjoy central air and heating, full kitchen appliances, updated counters, and an in-unit stackable washer and dryer.
              </p>
              <p>
                Every apartment comes furnished with a Keurig coffee maker, Instant Pot, cookware, dishes, dining credenza, indoor fireplace, private patio or balcony, vacuum cleaner, iron and ironing board, and starter cleaning and laundry supplies.
              </p>
              <p className="font-semibold text-[#282828]">
                Utilities include electricity, heat, gas, 400+ Mbps Wi-Fi, water, sewer, trash, and covered parking, plus a 55″ Smart TV in the living room and a 43″ Smart TV in each bedroom.
              </p>
            </div>
          </div>

          {/* Sticky Cart & Reservation Sidebar Card (Right 4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white border border-stone-300 p-6 rounded-2xl shadow-lg space-y-5">
              <div className="border-b border-stone-200 pb-4 tabular-nums">
                <span className="text-xs font-extrabold text-[#00897d] uppercase tracking-wider block">
                  Configure Your Stay
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  ${property.monthlyRate.toLocaleString()}
                  <span className="text-sm font-normal text-slate-500"> / mo</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Utilities, 400+ Mbps Wi-Fi &amp; parking included
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Check-In Date
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={selectedCheckInDate}
                    onChange={(e) => setSelectedCheckInDate(e.target.value)}
                    disabled={isReserved}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-sm font-medium rounded-lg focus:ring-1 focus:ring-[#00b7a8] focus:border-[#00b7a8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stay Duration
                  </label>
                  <select
                    value={selectedDurationDays}
                    onChange={(e) => setSelectedDurationDays(Number(e.target.value))}
                    disabled={isReserved}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-sm font-medium rounded-lg focus:ring-1 focus:ring-[#00b7a8] focus:border-[#00b7a8]"
                  >
                    <option value={5}>5 Nights (Short Stay)</option>
                    <option value={7}>7 Nights (1 Week)</option>
                    <option value={10}>10 Nights</option>
                    <option value={14}>14 Nights (2 Weeks)</option>
                    <option value={21}>21 Nights (3 Weeks)</option>
                    <option value={30}>30 Days (1 Month · Tax-Exempt)</option>
                    <option value={60}>60 Days (2 Months · Tax-Exempt)</option>
                    <option value={90}>90 Days (3 Months · Tax-Exempt)</option>
                    <option value={180}>180 Days (6 Months · Tax-Exempt)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Summary */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1.5 text-xs text-slate-700 tabular-nums">
                <div className="flex justify-between">
                  <span>
                    {isMonthlyStay
                      ? `${monthsCount} ${monthsCount === 1 ? 'Month' : 'Months'} × $${property.monthlyRate.toLocaleString()}`
                      : `${selectedDurationDays} Nights × $${nightlyRate}`}
                  </span>
                  <span className="font-bold text-slate-900">${calculatedSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Preparation &amp; Inspection Fee</span>
                  <span className="font-semibold">$95</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Utilities, Wi-Fi &amp; Parking</span>
                  <span className="font-bold">Included</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Estimated Subtotal</span>
                  <span className="text-[#00897d] text-base">
                    ${(calculatedSubtotal + 95).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={isReserved || isMutating}
                  onClick={handleAddStayToCart}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                    isReserved
                      ? 'bg-[#ebe4da] text-[#857568]'
                      : justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#00b7a8] hover:bg-[#009b8e] text-white shadow-sm'
                  }`}
                >
                  {isReserved ? (
                    <span>Currently Reserved</span>
                  ) : justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Cart</span>
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
                    onOpenBooking(
                      property.id,
                      selectedCheckInDate || undefined,
                      isMonthlyStay ? '30-60' : '5-10',
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-800 text-xs font-bold text-center cursor-pointer transition-colors"
                >
                  Request Custom Quote / Inquiry
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2 px-4 text-xs font-semibold text-slate-500 hover:text-slate-900 text-center cursor-pointer"
                >
                  ← Browse All Residences
                </button>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-slate-600 space-y-2 rounded-xl">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#00b7a8]" />
                <span>Personal Support &amp; Custom Billing</span>
              </div>
              <p>
                Planning a family relocation, home insurance stay, or multi-unit organizational booking? Speak directly with hosts Bill &amp; Marlena:
              </p>
              <a
                href="tel:9168003295"
                className="font-bold text-[#00897d] hover:underline block text-sm"
              >
                916-800-3295
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Add-On Services Cross-Sell */}
      <div className="mt-14">
        <ShopServicesSection compact onNavigate={onNavigate} />
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3">
            <span className="text-sm font-semibold">
              {property.title} — Photo {activeImageIndex + 1} of {property.images.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative max-w-5xl w-full h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={property.images[activeImageIndex]}
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackPropertyImage(activeImageIndex);
              }}
              className="max-h-full max-w-full object-contain"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          <div
            className="max-w-5xl w-full flex gap-2 overflow-x-auto pt-4 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-16 h-12 shrink-0 overflow-hidden border-2 cursor-pointer ${
                  activeImageIndex === i ? 'border-[#00b7a8]' : 'border-transparent opacity-50 hover:opacity-100'
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
      )}
    </div>
  );
};
