import React from 'react';
import { YouTubeEmbed } from './YouTubeEmbed';

export const ReviewsSection: React.FC = () => {
  return (
    <>
      {/* Section 3 from easytravellodging.com */}
      <section className="et_section_brown py-12 sm:py-16 text-left">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-4">
          <h2 className="et_teal_h2 text-3xl sm:text-5xl font-bold text-[#00b7a8]">
            EASY TRAVEL LODGING
          </h2>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-[#000000] leading-snug">
            Are you coming to Sacramento for an extended business assignment? Great, we’ve got the perfect housing solution for you…
          </p>
          <p className="text-[16px] text-[#000000] leading-relaxed">
            We provide luxurious, fully-furnished and equipped rental properties with excellent service for traveling professionals throughout the Sacramento region for stays of 30 days or more.
          </p>
        </div>
      </section>

      {/* Section 4 from easytravellodging.com: Parallax Background with Reviews and Video Testimonials */}
      <section 
        className="relative py-14 sm:py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://easytravellodging.com/wp-content/uploads/2022/03/RANCHO-Andrea-Crettol-7-Web.jpg')`,
          backgroundAttachment: 'scroll'
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-6">
          {/* Header & Graphic Reviews Container (Row 7 & 8) */}
          <div className="bg-[rgba(255,255,255,0.85)] rounded-t-[15px] p-6 sm:p-10 text-left space-y-6">
            <div>
              <h6 className="et_section_h6 text-[#000000]">
                Reviews
              </h6>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#000000] leading-tight mt-1">
                Guest Reviews
              </h2>
            </div>

            {/* 3 Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-1.png"
                  alt="Guest Review 1"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-2-1.png"
                  alt="Guest Review 2"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden bg-white shadow-xs">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/02/6-3-1.png"
                  alt="Guest Review 3"
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
