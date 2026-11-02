import React from 'react';
import { YouTubeEmbed } from './YouTubeEmbed';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { ScrollReveal } from './common/ScrollReveal';

export const ReviewsSection: React.FC = () => {
  return (
    <>
      {/* Hospitality Promise Banner */}
      <section className="bg-[#1e1713] py-14 sm:py-18 text-left border-b border-[#382b22]">
        <ScrollReveal direction="up" className="max-w-[1250px] mx-auto px-4 sm:px-8 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-[#4de0d2]">
            <span>Nationwide Hospitality Standards</span>
          </div>
          <h2 className="type-h2 text-white">
            Hospitality That Feels Like Home
          </h2>
          <p className="type-body font-medium text-[#ede5dc] max-w-3xl">
            Whether you are in town for a week, bridging a home closing, visiting family, or settling in for several months, every detail is ready before you arrive.
          </p>
          <p className="type-body text-[#c8b9a9] max-w-4xl">
            Co-founders Bill Wheelock and Dr. Marlena Uhrik personally oversee each residence—pairing full kitchens, in-unit laundry, reserved parking, and responsive concierge support so every guest enjoys a calm, reliable stay across our nationwide residences.
          </p>
        </ScrollReveal>
      </section>

      {/* Guest Stories & Video Testimonials */}
      <section 
        className="relative py-14 sm:py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://easytravellodging.com/wp-content/uploads/2022/03/RANCHO-Andrea-Crettol-7-Web.jpg')`,
          backgroundAttachment: 'scroll'
        }}
      >
        <ScrollReveal direction="up" delay={60} className="max-w-[1250px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 sm:p-10 text-left space-y-6 border border-[#e2ded6] shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#966746] block">
                Verified Guest Feedback
              </span>
              <h2 className="type-h2 text-[#182024]">
                What Guests Say About Staying With Us
              </h2>
            </div>

            {/* 3 Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2ded6] shadow-xs">
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
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2ded6] shadow-xs">
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
              <div className="overflow-hidden bg-white rounded-xl border border-[#e2ded6] shadow-xs">
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

            {/* Video Testimonials */}
            <div className="pt-4 border-t border-[#e2ded6]">
              <div className="mb-4">
                <h3 className="type-h4 text-[#182024]">
                  Video Walkthroughs &amp; Direct Guest Stories
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="overflow-hidden rounded-xl border border-[#e2ded6] shadow-xs">
                  <YouTubeEmbed
                    urlOrId="rOrM5xTcuU4"
                    title="Mark - Unit 335 Testimony"
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e2ded6] shadow-xs">
                  <YouTubeEmbed
                    urlOrId="46k-NuEegY0"
                    title="Nick - Unit 173 Testimony"
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e2ded6] shadow-xs">
                  <YouTubeEmbed
                    urlOrId="sekSKD_H2WM"
                    title="Jackie - Guest Review"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
};
