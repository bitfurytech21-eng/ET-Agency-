import React, { useState } from 'react';
import { PROPERTIES, PropertyListing } from '../data/lodgingData';
import { AVAILABILITY_SCHEDULES } from '../data/availabilityData';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { 
  X, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Maximize2,
  Clock,
  Sparkles,
  Info,
  Wifi,
  Tv,
  Snowflake,
  Bath,
  Accessibility,
  Dog,
  Flame,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

import { YouTubeEmbed } from './YouTubeEmbed';

interface PropertiesSectionProps {
  onSelectPropertyForBooking: (propertyId: string, startDate?: string, duration?: string) => void;
  onViewListingDetails?: (property: PropertyListing) => void;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  onSelectPropertyForBooking,
  onViewListingDetails
}) => {
  const [activeModalProperty, setActiveModalProperty] = useState<PropertyListing | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const [modalTab, setModalTab] = useState<'gallery' | 'calendar'>('gallery');
  const [expandedCalendarId, setExpandedCalendarId] = useState<string | null>(null);
  const [selectedMainImages, setSelectedMainImages] = useState<Record<string, number>>({});

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
        {/* Section Intro matching easytravellodging.com */}
        <div className="text-center space-y-3 max-w-[850px] mx-auto">
          <h6 className="et_section_h6 text-[#000000]">
            EASY TRAVEL LODGING
          </h6>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#000000] leading-snug">
            Are you coming to Sacramento for an extended business assignment? Great, we’ve got the perfect housing solution for you…
          </h2>
          <p className="text-[16px] text-[#333333] leading-relaxed">
            We provide luxurious, fully-furnished and equipped rental properties with excellent service for traveling professionals throughout the Sacramento region for stays of <strong>30 days or more</strong>.
          </p>

          {/* Quick Notice about Real-Time Availability */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold rounded-xs mt-2">
            <span className="w-2 h-2 rounded-full bg-[#00b7a8] animate-pulse" />
            <span>Interactive Availability Calendars &amp; authentic details enabled for all Sacramento units below.</span>
          </div>
        </div>

        {/* Listings Container matching Divi layout */}
        <div className="space-y-16">
          {PROPERTIES.map((prop) => {
            const avail = AVAILABILITY_SCHEDULES[prop.id];
            const isCalendarOpen = expandedCalendarId === prop.id;
            const currentImgIdx = selectedMainImages[prop.id] || 0;
            const displayImage = prop.images[currentImgIdx] || prop.images[0];

            return (
              <div
                key={prop.id}
                id={prop.slug}
                className="border-t border-[#e5e5e5] pt-12 first:border-t-0 first:pt-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Image Gallery Column */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 border border-[#e5e5e5] shadow-xs group">
                      <img
                        src={displayImage}
                        alt={prop.title}
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
                      <button
                        onClick={() => handleOpenModal(prop, 'gallery')}
                        className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 shadow-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Photos ({prop.images.length})</span>
                      </button>

                      <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-xs">
                        {prop.category || 'Holiday Apartment, Family Apartment'}
                      </div>
                    </div>

                    {/* Thumbnail Row */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {prop.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedMainImages(prev => ({ ...prev, [prop.id]: i }));
                          }}
                          className={`w-18 sm:w-20 h-14 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                            currentImgIdx === i 
                              ? 'border-[#00b7a8] opacity-100 shadow-xs' 
                              : 'border-[#d9d9d9] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>

                    {/* Video Testimonial Embed if available */}
                    {videoTestimonials[prop.id] && (
                      <div className="mt-4 border border-[#e5e5e5] rounded-xs overflow-hidden">
                        <YouTubeEmbed
                          urlOrId={videoTestimonials[prop.id]}
                          title={`Guest Video Walkthrough & Review - ${prop.unitNumber}`}
                          aspectRatio="aspect-16/9"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Header Row: Unit code + live status + rate */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase font-extrabold text-[#00b7a8] tracking-wider bg-[#00b7a8]/10 px-2 py-0.5 rounded-xs">
                          {prop.unitNumber} ({prop.code}) • {prop.floor}
                        </span>

                        {avail && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold ${
                            avail.currentStatus === 'Available Now'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              avail.currentStatus === 'Available Now' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`} />
                            <span>{avail.currentStatus}: {avail.nextAvailableDate}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900 block">
                          ${prop.monthlyRate.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ mo</span>
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
                        className="font-heading font-bold text-xl sm:text-2xl text-[#000000] hover:text-[#00b7a8] cursor-pointer transition-colors leading-tight"
                      >
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {prop.pricingNote || 'May vary. Includes $100.00 utilities and parking. Minimum stay 30 days.'}
                      </p>
                    </div>

                    {/* VikBooking Amenities Badges Strip */}
                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                      {prop.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f9fa] border border-[#e2e8f0] rounded-xs text-[11px] font-semibold text-slate-700"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Availability Status Callout Box */}
                    {avail && (
                      <div className="p-3 bg-[#fcfcfc] border-l-3 border-[#00b7a8] text-xs text-slate-700 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#00b7a8] shrink-0" />
                          <span>{avail.statusMessage}</span>
                        </div>
                        <button
                          onClick={() => toggleInlineCalendar(prop.id)}
                          className="text-[11px] font-bold text-[#00b7a8] hover:underline cursor-pointer shrink-0"
                        >
                          {isCalendarOpen ? 'Close Calendar ↑' : 'View Calendar ↓'}
                        </button>
                      </div>
                    )}

                    {/* Full Description & Highlights */}
                    <div className="text-[14px] text-[#333333] leading-relaxed whitespace-pre-line space-y-2">
                      <p>{prop.fullDesc}</p>
                    </div>

                    <div className="pt-2">
                      <h5 className="font-heading font-bold text-xs text-[#000000] uppercase tracking-wider mb-2">
                        Included Features &amp; Comforts:
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#555555]">
                        {prop.features.slice(0, 6).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#00b7a8] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (onViewListingDetails) {
                            onViewListingDetails(prop);
                          } else {
                            handleOpenModal(prop, 'gallery');
                          }
                        }}
                        className="et_pb_button et_pb_button_white text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View Listing Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#00b7a8]" />
                      </button>

                      <button
                        onClick={() => toggleInlineCalendar(prop.id)}
                        className={`et_pb_button text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer ${
                          isCalendarOpen
                            ? 'bg-slate-900 text-white'
                            : 'bg-[#e6f8f6] text-[#00897d] border border-[#00b7a8]/40 hover:bg-[#d0f3ef]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isCalendarOpen ? 'Hide Calendar' : 'Availability Calendar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Visual Availability Calendar Accordion */}
                {isCalendarOpen && (
                  <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00b7a8]" />
                        <span>Real-Time Availability Calendar for {prop.unitNumber} ({prop.code})</span>
                      </h4>
                      <button
                        onClick={() => setExpandedCalendarId(null)}
                        className="text-xs text-slate-500 hover:text-black cursor-pointer"
                      >
                        Close [×]
                      </button>
                    </div>

                    <AvailabilityCalendar
                      propertyId={prop.id}
                      unitTitle={prop.title}
                      unitNumber={prop.unitNumber}
                      onSelectDates={(startDate, duration) => {
                        onSelectPropertyForBooking(prop.id, startDate, duration);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* More Details Box verbatim from easytravellodging.com */}
        <div className="bg-[#f8f9fa] border border-[#e5e5e5] p-6 sm:p-10 space-y-4 text-left text-sm text-[#333333] leading-relaxed">
          <h4 className="font-heading font-bold text-xl text-[#000000]">
            More Details:
          </h4>
          <p>
            Easy Travel Lodging provides midterm rentals for traveling professionals who are in the Sacramento, California area for 30 days or more. Each midterm rental is constructed with style, safety, compassion, and convenience.
          </p>
          <p>
            Included in your stay are a 24-hour fitness center, swimming pools, and heated spas along with volleyball and tennis courts. Amenities include central air, central heat, refrigerator, oven/stove, microwave, dishwasher, updated kitchen counters, and in-unit stackable washer/dryer.
          </p>
          <p>
            The built-in credenza in the dining area provides extra storage. Your living room includes a cozy indoor fireplace. The updated bathroom includes a newly reglazed bathtub. Your private patio offers a secluded outdoor space for your rest and tranquility. Your unit is fully furnished and equipped including Keurig Coffee Maker and Instant Pot. Also, a vacuum cleaner, iron, and ironing board are included along with basic cleaning and laundry supplies.
          </p>
          <p className="font-semibold text-[#000000]">
            Utilities include electricity, heat, gas, internet (400+ MBPS Wi-Fi), garbage/trash, sewer, and water. No pets. Enjoy a 55" Smart TV in the living room and a 43" Smart TV in each bedroom.
          </p>
        </div>
      </div>

      {/* Modal Lightbox with Gallery and Availability Calendar Tabs */}
      {activeModalProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border border-[#d9d9d9] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
              <div>
                <span className="text-xs font-bold text-[#00b7a8] uppercase">
                  {activeModalProperty.unitNumber} ({activeModalProperty.code}) • {activeModalProperty.category || 'Holiday Apartment, Family Apartment'}
                </span>
                <h3 className="font-heading font-bold text-2xl text-[#000000]">
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
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                  modalTab === 'gallery'
                    ? 'border-[#00b7a8] text-[#00b7a8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Photo Gallery ({activeModalProperty.images.length})
              </button>
              <button
                onClick={() => setModalTab('calendar')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                  modalTab === 'calendar'
                    ? 'border-[#00b7a8] text-[#00b7a8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Live Availability Calendar</span>
              </button>
            </div>

            {modalTab === 'gallery' ? (
              <>
                {/* Gallery in Modal */}
                <div className="space-y-3">
                  <div className="relative aspect-16/9 bg-black overflow-hidden">
                    <img
                      src={activeModalProperty.images[modalImageIndex] || activeModalProperty.images[0]}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                    {activeModalProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === 0 ? activeModalProperty.images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === activeModalProperty.images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black"
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
                        className={`w-16 h-12 shrink-0 border-2 cursor-pointer ${
                          modalImageIndex === i ? 'border-[#00b7a8]' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-[#333333]">
                  <p className="whitespace-pre-line leading-relaxed">{activeModalProperty.fullDesc}</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Select your move-in and estimated move-out date for {activeModalProperty.unitNumber}. Stays must be 30 days or more.
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

            <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
              <span className="font-bold text-lg text-[#000000]">
                {activeModalProperty.startingRate}
              </span>
              <div className="flex gap-3">
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
                  className="px-4 py-2 border border-[#d9d9d9] text-xs font-bold cursor-pointer hover:bg-slate-50"
                >
                  Full Page Details
                </button>
                <button
                  onClick={() => {
                    const id = activeModalProperty.id;
                    setActiveModalProperty(null);
                    onSelectPropertyForBooking(id);
                  }}
                  className="et_pb_button et_pb_button_teal text-xs py-2 px-6"
                >
                  Reserve For Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
