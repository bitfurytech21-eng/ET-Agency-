import React from 'react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';
import { ScrollReveal } from './common/ScrollReveal';

export const ReviewsSection: React.FC = () => {
  return (
    <>
      {/* Hospitality Promise Banner */}
      <section className="bg-[#0f172a] py-14 sm:py-18 text-left border-b border-[#1e293b]">
        <ScrollReveal direction="up" className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-3.5">
          <span className="type-support font-semibold tracking-wide text-[#5eead4] block">
            California Hospitality Standards
          </span>
          <h2 className="type-h2 text-white">
            Hospitality That Feels Like Home
          </h2>
          <p className="type-body-lg font-medium text-slate-200 max-w-3xl">
            Whether you are in town for a week, bridging a home closing, visiting family, or settling in for several months, every detail is ready before you arrive.
          </p>
          <p className="type-body text-slate-300 max-w-4xl">
            Co-founders Bill Wheelock and Dr. Marlena Uhrik personally oversee each residence—pairing full kitchens, in-unit laundry, reserved parking, and responsive concierge support so every guest enjoys a calm, reliable stay.
          </p>
        </ScrollReveal>
      </section>

      {/* Guest Stories & Video Testimonials */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-b border-[#e2e8f0]">
        <LivePhotoBackground scene="courtyard" overlay="light" />
        <ScrollReveal direction="up" delay={50} className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-10 text-left space-y-8 border border-[#e2e8f0] shadow-sm">
            <div className="space-y-1.5">
              <span className="et_section_h6 block">Verified Guest Feedback</span>
              <h2 className="type-h2 text-[#0f172a]">
                What Guests Say About Staying With Us
              </h2>
            </div>

            {/* 3 Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2e8f0]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-1.png"
                  alt="Verified Guest Review 1"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(8);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2e8f0]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-2-1.png"
                  alt="Verified Guest Review 2"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(9);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2e8f0]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-3-1.png"
                  alt="Verified Guest Review 3"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(10);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Video Testimonials */}
            <div className="pt-6 border-t border-[#e2e8f0]">
              <div className="mb-4">
                <h3 className="type-h3 text-[#0f172a]">
                  Video Walkthroughs &amp; Direct Guest Stories
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
                  <YouTubeEmbed urlOrId="rOrM5xTcuU4" title="Mark - Unit 335 Testimony" />
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
                  <YouTubeEmbed urlOrId="46k-NuEegY0" title="Nick - Unit 173 Testimony" />
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
                  <YouTubeEmbed urlOrId="sekSKD_H2WM" title="Jackie - Guest Review" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
};
