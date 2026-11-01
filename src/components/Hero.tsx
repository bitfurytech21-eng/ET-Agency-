import React from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreListings?: () => void;
  onOpenBrochure?: () => void;
  onLearnEthics?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreListings,
  onOpenBrochure,
}) => {
  return (
    <section className="et_section_hero relative overflow-hidden py-16 sm:py-24 border-b border-[#e5ded4]">
      <LivePhotoBackground scene="cycle" secondaryScene="interior" overlay="warm-hero" />

      <div className="relative z-10 max-w-[1331px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h5 className="font-heading font-bold text-sm sm:text-base uppercase tracking-[0.22em] text-[#82634f] mb-1">
                STAY WITH US IN
              </h5>
              <h1 className="font-heading font-black text-5xl sm:text-7xl text-[#282828] tracking-tight leading-none">
                COMFORT
              </h1>
            </div>

            <div className="space-y-3">
              <h6 className="et_section_h6 text-[#282828]">
                Move-In-Ready Living, Tailored to Your Schedule
              </h6>
              <p className="font-heading font-semibold text-[19px] sm:text-[21px] text-[#1f1a17] leading-snug max-w-[660px]">
                Thoughtfully furnished 1- and 2-bedroom residences, private vehicle rentals, and attentive local concierge services for short visits, family relocations, home transitions, and extended stays.
              </p>
              <p className="text-sm sm:text-[15px] text-[#4a3f37] max-w-[640px] leading-relaxed">
                Whether you are visiting loved ones for a week, navigating a home remodel, relocating to Northern California, or booking housing for a multi-month project, reserve residences, vehicles, and arrival services together in one seamless cart.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap gap-3.5 items-center">
              {onExploreListings && (
                <button
                  onClick={onExploreListings}
                  className="et_pb_button et_pb_button_teal group cursor-pointer shadow-sm"
                >
                  <span>Browse Residences</span>
                </button>
              )}

              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-sm"
              >
                <span>Request Custom Stay</span>
              </button>

              {onOpenBrochure && (
                <button
                  onClick={onOpenBrochure}
                  className="text-xs font-bold text-[#358385] hover:text-[#00b7a8] underline underline-offset-4 cursor-pointer px-2 py-1"
                >
                  Overview Brochure
                </button>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-[85%] sm:w-[78%] bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#e6dfd5] shadow-lg">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/keys-hotel-board-web-crop.png"
                alt="Easy Travel Lodging Welcome Keys Board"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(0);
                }}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
