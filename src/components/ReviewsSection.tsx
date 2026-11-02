import React from 'react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { getFallbackPropertyImage } from '../data/lodgingData';

export const ReviewsSection: React.FC = () => {
  return (
    <>
      {/* Hospitality Promise Banner */}
      <section className="bg-[#332922] py-12 sm:py-16 text-left border-b border-[#473930]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-3.5">
          <span className="type-support font-semibold uppercase tracking-[0.1em] text-[#7ce8df] block">
            Nationwide Hospitality Promise
          </span>
          <h2 className="type-h2 text-white">
            Hospitality That Feels Like Home
          </h2>
          <p className="type-body-lg font-medium text-[#f3ede6] max-w-3xl">
            Whether you are in town for a week, bridging a home closing, visiting family, or settling in for several months, every detail is ready before you arrive.
          </p>
          <p className="type-body text-[#dfd4c8] max-w-4xl">
            Co-founders Bill Wheelock and Dr. Marlena Uhrik personally oversee each residence—pairing full kitchens, in-unit laundry, reserved parking, and responsive concierge support so every guest enjoys a calm, reliable stay across our nationwide residences.
          </p>
        </div>
      </section>

      {/* Guest Stories & Video Testimonials */}
      <section 
        className="relative py-14 sm:py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://easytravellodging.com/wp-content/uploads/2022/03/RANCHO-Andrea-Crettol-7-Web.jpg')`,
          backgroundAttachment: 'scroll'
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="bg-[rgba(255,255,255,0.92)] rounded-t-[15px] p-6 sm:p-10 text-left space-y-6">
            <div>
              <h6 className="et_section_h6 text-[#282828]">
                Verified Experiences
              </h6>
              <h2 className="type-h2 text-[#1b1d20] mt-1">
                What Guests Say About Staying With Us
              </h2>
            </div>

            {/* 3 Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-1.png"
                  alt="Guest Review 1"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(8);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-2-1.png"
                  alt="Guest Review 2"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(9);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-3-1.png"
                  alt="Guest Review 3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(10);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Video Testimonials (Row 9) */}
          <div className="bg-[rgba(255,255,255,0.85)] rounded-b-[15px] p-6 sm:p-10 pt-0 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden rounded-xs shadow-xs">
                <YouTubeEmbed
                  urlOrId="rOrM5xTcuU4"
                  title="Mark - Unit 335 Testimony"
                />
              </div>

              <div className="overflow-hidden rounded-xs shadow-xs">
                <YouTubeEmbed
                  urlOrId="46k-NuEegY0"
                  title="Nick - Unit 173 Testimony"
                />
              </div>

              <div className="overflow-hidden rounded-xs shadow-xs">
                <YouTubeEmbed
                  urlOrId="sekSKD_H2WM"
                  title="Jackie - Guest Review"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
