import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreListings?: () => void;
  onOpenBrochure?: () => void;
  onLearnEthics?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreListings, onOpenBrochure, onLearnEthics }) => {
  return (
    <section className="et_section_hero relative overflow-hidden py-16 sm:py-24 border-b border-[#e5e5e5]">
      <div className="max-w-[1331px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column matching exact text and hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h5 className="et_hero_h5 mb-1">
                STAY WITH US IN
              </h5>
              <h1 className="et_hero_h1 tracking-normal">
                COMFORT
              </h1>
            </div>

            <div className="space-y-3">
              <h6 className="et_section_h6 text-[#000000]">
                A Home Away From Home
              </h6>
              <p className="font-heading font-semibold text-[20px] sm:text-[22px] text-[#000000] leading-snug max-w-[650px]">
                Fully furnished and equipped rentals for traveling professionals in Sacramento for 30 days or more
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-sm"
              >
                <span>Book Your Stay</span>
                <span className="ml-3 text-[14px] text-[#333333] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </button>

              {onExploreListings && (
                <button
                  onClick={onExploreListings}
                  className="et_pb_button et_pb_button_teal group cursor-pointer shadow-sm"
                >
                  <span>Explore Listings</span>
                  <span className="ml-2 text-[14px] group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </button>
              )}

              {onOpenBrochure && (
                <button
                  onClick={onOpenBrochure}
                  className="text-xs font-bold text-[#358385] hover:text-[#00b7a8] underline underline-offset-4 cursor-pointer px-2 py-1"
                >
                  Download Our Brochure PDF
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hotel Keys Board cropped photo from easytravellodging.com */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-[85%] sm:w-[78%]">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/keys-hotel-board-web-crop.png"
                alt="Easy Travel Lodging Hotel Keys Board"
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
