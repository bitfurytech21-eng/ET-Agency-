import React, { useState } from 'react';
import { PropertyListing } from '../data/lodgingData';
import { AvailabilityCalendar } from './AvailabilityCalendar';
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
  ExternalLink,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

interface PropertyDetailViewProps {
  property: PropertyListing;
  onBack: () => void;
  onOpenBooking: (propertyId: string, startDate?: string, duration?: string) => void;
  onSelectAnotherProperty?: (propertyId: string) => void;
}

import { YouTubeEmbed } from './YouTubeEmbed';

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onOpenBooking
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState('');
  const [selectedDurationDays, setSelectedDurationDays] = useState(7);

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

  const calculatedTotal = Math.round((property.monthlyRate / 30) * selectedDurationDays);

  return (
    <div className="w-full bg-white text-[#333333] pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#f9f9f9] border-b border-[#e5e5e5] py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#00b7a8] font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All Listings</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Home</span>
            <span>/</span>
            <span>Our Accommodations</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">{property.unitNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Title & Classification matching VikBooking header */}
        <div className="space-y-2 border-b border-stone-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00b7a8] bg-[#00b7a8]/10 px-2.5 py-1 rounded-xs inline-block mb-1">
                {property.category || 'Holiday Apartment, Family Apartment'}
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-4xl text-[#000000]">
                {property.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {property.unitNumber} • {property.floor} Floor • {property.bedrooms} Bed, {property.bathrooms} Bath • Rancho Cordova, CA
              </p>
            </div>

            {/* Price badge right */}
            <div className="text-left sm:text-right bg-stone-50 border border-stone-200 p-3 sm:p-4 rounded-xs">
              <span className="text-xs text-slate-500 uppercase font-semibold block">Monthly Midterm Rate</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ${property.monthlyRate.toLocaleString()}
                <span className="text-sm font-normal text-slate-600"> / month</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Includes $100.00 utilities & parking
              </span>
            </div>
          </div>
        </div>

        {/* Pricing notice callout box matching easytravellodging.com */}
        <div className="p-4 bg-teal-50/70 border-l-4 border-[#00b7a8] text-xs sm:text-sm text-slate-800 space-y-1">
          <p className="font-semibold">
            The price displayed is per monthly stay. The minimum stay is 30 days. Prices may vary.
          </p>
          <p className="text-slate-600">
            {property.pricingNote || 'May vary. Includes $100.00 utilities and parking. Fully equipped for traveling executives, nurses, and relocated guests.'}
          </p>
        </div>

        {/* Hero Photo Gallery with Thumbnails & Lightbox */}
        <div className="space-y-3">
          <div className="relative aspect-16/10 sm:aspect-16/9 bg-stone-900 rounded-xs overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={`${property.title} Photo ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Prev / Next controls */}
            {property.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
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
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Enlarge button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>View All {property.images.length} Photos</span>
            </button>

            {/* Counter tag */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 text-white text-xs font-medium rounded-xs">
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
                className={`w-20 sm:w-24 h-14 sm:h-16 shrink-0 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#00b7a8] scale-102 opacity-100 shadow-xs'
                    : 'border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout: Left = Description & Amenities, Right = Sticky Booking / Inquiry Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
          {/* Main Info (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Authentic VikBooking Amenities Icons */}
            <div className="bg-stone-50 p-6 rounded-xs border border-stone-200 space-y-4">
              <h4 className="font-heading font-bold text-lg text-slate-900 border-b border-stone-200 pb-2">
                Amenities
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 bg-white rounded-xs border border-stone-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentic Narrative Description */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-xl text-slate-900">
                About This Property
              </h4>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {property.fullDesc}
              </div>
            </div>

            {/* Key Features Bullet List */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h4 className="font-heading font-bold text-lg text-slate-900">
                Property Features & Provisions:
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
                    Select a check-in and check-out date (minimum 30 days) to calculate exact rate.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-xs shadow-xs">
                <AvailabilityCalendar
                  propertyId={property.id}
                  unitTitle={property.title}
                  unitNumber={property.unitNumber}
                  onSelectDates={(startDate, duration) => {
                    setSelectedCheckInDate(startDate);
                    if (duration) {
                      const durNum = parseInt(duration, 10);
                      if (!isNaN(durNum) && durNum > 0) {
                        setSelectedDurationDays(durNum);
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Video Testimonial Embed if available */}
            {videoTestimonials[property.id] && (
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <h4 className="font-heading font-bold text-lg text-slate-900">
                  Guest Video Walkthrough & Review
                </h4>
                <div className="rounded-xs overflow-hidden border border-stone-200 shadow-xs">
                  <YouTubeEmbed
                    urlOrId={videoTestimonials[property.id]}
                    title={`Guest Video Walkthrough & Review - ${property.unitNumber}`}
                    aspectRatio="aspect-16/9"
                  />
                </div>
              </div>
            )}

            {/* Authentic "More Details" specification block */}
            <div className="bg-[#f8f9fa] border border-[#e5e5e5] p-6 sm:p-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed rounded-xs">
              <h5 className="font-heading font-bold text-base text-slate-900 uppercase tracking-wider">
                Full Rental Provisions & Community Inclusions
              </h5>
              <p>
                Easy Travel Lodging provides midterm rentals for traveling professionals who are in the Sacramento, California area for 30 days or more. Each midterm rental is constructed with style, safety, compassion, and convenience.
              </p>
              <p>
                Included in your stay are a 24-hour fitness center, swimming pools, and heated spas along with volleyball and tennis courts. Amenities include central air, central heat, refrigerator, oven/stove, microwave, dishwasher, updated kitchen counters, and in-unit stackable washer/dryer.
              </p>
              <p>
                The built-in credenza in the dining area provides extra storage. Your living room includes a cozy indoor fireplace. The updated bathroom includes a newly reglazed bathtub. Your private patio offers a secluded outdoor space for your rest and tranquility. Your unit is fully furnished and equipped including Keurig Coffee Maker and Instant Pot. Also, a vacuum cleaner, iron, and ironing board are included along with basic cleaning and laundry supplies.
              </p>
              <p className="font-semibold text-slate-900">
                Utilities include electricity, heat, gas, internet (400+ MBPS Wi-Fi), garbage/trash, sewer, and water. Enjoy a 55″ Smart TV in the living room and a 43″ Smart TV in each bedroom.
              </p>
            </div>
          </div>

          {/* Sticky Booking / Inquire Sidebar Card (Right 4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white border-2 border-stone-300 p-6 rounded-xs shadow-lg space-y-5">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-xs uppercase font-extrabold text-[#00b7a8] tracking-wider block">
                  Select Check-in & Duration
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  ${property.monthlyRate.toLocaleString()}
                  <span className="text-sm font-normal text-slate-500"> / mo</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  $100 utilities + dedicated parking included
                </div>
              </div>

              {/* Date selection input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estimated Move-In Date:
                  </label>
                  <input
                    type="date"
                    value={selectedCheckInDate}
                    onChange={(e) => setSelectedCheckInDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-sm font-medium rounded-xs focus:ring-1 focus:ring-[#00b7a8] focus:border-[#00b7a8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Stay Duration:
                  </label>
                  <select
                    value={selectedDurationDays}
                    onChange={(e) => setSelectedDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-sm font-medium rounded-xs focus:ring-1 focus:ring-[#00b7a8] focus:border-[#00b7a8]"
                  >
                    <option value={5}>5 Days (Short Stay)</option>
                    <option value={7}>7 Days (1 Week)</option>
                    <option value={10}>10 Days</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={60}>60 Days (2 Months)</option>
                    <option value={90}>90 Days (3 Months)</option>
                    <option value={180}>180 Days (6 Months)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Summary */}
              <div className="bg-stone-50 p-3 rounded-xs border border-stone-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Base Rate ({selectedDurationDays} days):</span>
                  <span className="font-bold text-slate-900">${calculatedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Utilities & Parking:</span>
                  <span className="font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>400+ Mbps Wi-Fi:</span>
                  <span className="font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-1.5 text-sm font-bold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-[#00b7a8] text-base">${calculatedTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBooking(
                      property.id,
                      selectedCheckInDate || undefined,
                      `${selectedDurationDays} days`
                    )
                  }
                  className="w-full et_pb_button et_pb_button_teal text-sm py-3 px-4 font-bold uppercase tracking-wider text-center cursor-pointer shadow-md"
                >
                  Reserve {property.unitNumber}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full et_pb_button et_pb_button_white text-xs py-2.5 px-4 font-semibold text-center cursor-pointer"
                >
                  ← Return to All Listings
                </button>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-slate-600 space-y-2 rounded-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#00b7a8]" />
                <span>Need Corporate Billing or Assistance?</span>
              </div>
              <p>
                Have questions about insurance housing or direct corporate employer invoicing? Call Bill &amp; Marlena directly:
              </p>
              <a
                href="tel:9168003295"
                className="font-bold text-[#00b7a8] hover:underline block text-sm"
              >
                916-800-3295
              </a>
            </div>
          </div>
        </div>
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
              className="max-h-full max-w-full object-contain"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox thumbnail row */}
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
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
