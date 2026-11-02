import React, { useState } from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { Heart, X } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface AboutViewProps {
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenBooking }) => {
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  const guestReviews = [
    {
      name: 'Stacy S.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Stacy-S.png',
      alt: 'Stacy S. Guest Review for Easy Travel Lodging'
    },
    {
      name: 'Jayda F.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Jayda-F.-.png',
      alt: 'Jayda F. Guest Review for Easy Travel Lodging'
    },
    {
      name: 'Joanne H.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Joanne-H.png',
      alt: 'Joanne H. Guest Review for Easy Travel Lodging'
    }
  ];

  return (
    <div className="w-full bg-white text-[#333333]">
      {/* =========================================================================
          SECTION 1: Live Realistic Photo Hero Banner
          ========================================================================= */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-[#3a2f28]">
        <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <span className="type-support font-semibold text-[#4de0d2] inline-block">
            Nationwide Agency Hospitality &amp; Travel Logistics
          </span>
          <h1 className="type-h1 text-white">
            Meet Bill &amp; Marlena
          </h1>
          <p className="type-body-lg text-[#f2ebe2] max-w-3xl mx-auto pt-2">
            We founded Easy Travel Lodging to give families, relocating homeowners, corporate teams, and extended-stay travelers a genuine home across the entire state of California—whether for a weeklong stay or several months.
          </p>
          <p className="type-body text-[#dfd3c5] max-w-3xl mx-auto">
            Married for <strong className="font-semibold text-white">38 years</strong>, Bill Wheelock and Dr. Marlena Uhrik bring decades of leadership, education, and interior staging experience to hospitality—and enjoy kayaking, hiking, aviation, and time outdoors with family and friends.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Host Bill Section
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-[#efe9e0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="max-w-md w-full bg-[#faf8f5] rounded-2xl shadow-lg overflow-hidden border border-[#e6dfd5]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-airplanehangersign.jpg"
                  alt="Bill Wheelock - Easy Travel Lodging Co-Founder"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(11);
                  }}
                  className="w-full h-80 sm:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="type-support font-semibold text-[#14616d] block">
                Co-Founder &amp; Operations Lead
              </span>
              <h2 className="type-h2 text-[#182024]">
                Bill Wheelock
              </h2>
              <div className="type-body space-y-3 text-[#4a545c] pt-2">
                <p>
                  Bill’s career in <strong className="font-semibold text-[#182024]">Information Systems Management</strong> took him across the state of California leading technical teams that deployed enterprise systems across diverse industries.
                </p>
                <p>
                  A <strong className="font-semibold text-[#182024]">U.S. Navy veteran</strong>, radio voiceover artist, and <strong className="font-semibold text-[#182024]">licensed private pilot for more than 40 years</strong>, Bill holds a bachelor’s degree from the University of San Francisco and an MBA from the University of Phoenix.
                </p>
                <p>
                  Today, he oversees residence readiness, guest logistics, and fleet coordination with the same reliability and attention to detail he valued during his own years on the road.
                </p>
              </div>

              <div className="type-support pt-2 flex flex-wrap items-center gap-2 font-semibold text-[#966746]">
                <span>U.S. Navy Veteran</span>
                <span aria-hidden="true">·</span>
                <span>40+ Year Private Pilot</span>
                <span aria-hidden="true">·</span>
                <span>MBA, Operations &amp; Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Host Marlena Section
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-[#faf7f2] border-b border-[#e2ded6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
              <span className="type-support font-semibold text-[#14616d] block">
                Co-Founder &amp; Design Director
              </span>
              <h2 className="type-h2 text-[#182024]">
                Dr. Marlena Uhrik
              </h2>
              <div className="type-body space-y-3 text-[#4a545c] pt-2">
                <p>
                  Marlena dedicated her first career to <strong className="font-semibold text-[#182024]">public education</strong>—beginning as an elementary school teacher before earning her <strong className="font-semibold text-[#182024]">Doctorate in Educational Leadership</strong>.
                </p>
                <p>
                  She retired as an <strong className="font-semibold text-[#182024]">Educational Consultant for the California Department of Education</strong>, recognized locally, nationally, and internationally for her work supporting children and families.
                </p>
                <p>
                  In her second chapter, Marlena became a licensed Realtor, real estate investor, Certified Home Stager, and award-winning author—shaping the warm, livable aesthetic of every Easy Travel Lodging residence.
                </p>
              </div>

              <div className="type-support pt-2 flex flex-wrap items-center gap-2 font-semibold text-[#966746]">
                <span>Ed.D. Educational Leadership</span>
                <span aria-hidden="true">·</span>
                <span>1996 Olympic Torchbearer</span>
                <span aria-hidden="true">·</span>
                <span>Certified Home Stager &amp; Author</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="max-w-md w-full bg-[#f4efe9] rounded-2xl shadow-lg overflow-hidden border border-[#e6dfd5]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-dressedup.jpg"
                  alt="Dr. Marlena Uhrik - Easy Travel Lodging Co-Founder"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(12);
                  }}
                  className="w-full h-80 sm:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Bill & Marlena Joint Mission & Philanthropy
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#e6dfd5] max-w-md w-full">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/Marlena-Bill-Plane.jpg"
                  alt="Bill and Marlena Wheelock with Airplane"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(13);
                  }}
                  className="w-full h-80 sm:h-[380px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-left">
              <h2 className="type-h2 text-[#282828]">
                Why We Built Easy Travel Lodging
              </h2>

              <p className="type-body text-[#5c5046]">
                Having spent years traveling across the country during their own careers, Bill and Marlena know firsthand how tiring impersonal hotel rooms become when you are away from home for more than a few nights.
              </p>

              <p className="type-body text-[#5c5046]">
                They created Easy Travel Lodging to offer a better alternative—welcoming families between homes, visiting relatives, patients and caregivers, vacationers, and business guests with residences that feel calm, well-equipped, and genuinely cared for.
              </p>

              <div className="type-body p-4 rounded-xl bg-[#faf3ef] border border-[#e3d2c7] text-[#3d2e24] font-medium flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 shrink-0" />
                <span>
                  A portion of proceeds from every reservation supports organizations serving <strong className="font-semibold">children, veterans, and pets</strong>.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-2 text-left">
              <p className="type-body text-[#3d352e] italic font-medium">
                &ldquo;We wanted every residence to set a higher standard for furnished rentals—combining residential comfort with dependable, personal hospitality.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-2 text-left">
              <p className="type-body text-[#3d352e] italic font-medium">
                &ldquo;Every guest deserves to arrive to a spotless home, a stocked kitchen, and hosts who are reachable whenever a question comes up.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-2 text-left">
              <p className="type-body text-[#3d352e] italic font-medium">
                &ldquo;Welcoming guests from down the street and across the country—and helping make their relocation and extended travel effortless—is what keeps us inspired.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-2 text-left">
              <p className="type-body text-[#3d352e] italic font-medium">
                &ldquo;Nothing means more to us than hearing a guest say their apartment truly felt like home from day one.&rdquo;
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden text-center p-10 rounded-3xl border border-[#3a2f28] space-y-3 text-white shadow-lg">
            <LivePhotoBackground scene="interior" overlay="espresso" />
            <div className="relative z-10 space-y-3">
              <h3 className="type-h3 text-white">
                We Would Love to Host Your Upcoming Stay
              </h3>
              <p className="type-body text-[#ede5dc] max-w-xl mx-auto">
                Explore open dates across our nationwide portfolio of furnished residences or reach out with questions anytime.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="btn btn-primary"
                >
                  Check Residence Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Guest Reviews Section
          ========================================================================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8">
        <LivePhotoBackground scene="courtyard" overlay="light" />
        <div className="relative z-10 max-w-6xl mx-auto bg-white/95 backdrop-blur-xs p-6 sm:p-12 rounded-2xl shadow-lg border border-[#e6dfd5] text-left">
          <div className="mb-8">
            <span className="type-support font-semibold text-[#82634f] block mb-1.5">
              Reviews
            </span>
            <h2 className="type-h2 text-[#282828]">
              Guest Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {guestReviews.map((rev, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedReviewImage(rev.src)}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-[#e6dfd5]"
              >
                <img 
                  src={rev.src} 
                  alt={rev.alt}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#282828]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="type-btn bg-white/95 text-[#282828] px-3.5 py-2 rounded-lg shadow-md">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Reviews */}
      {selectedReviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-[#1c1613]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#faf8f5] hover:bg-[#efe9e0] text-[#282828] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center">
              <img 
                src={selectedReviewImage} 
                alt="Review Preview" 
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
