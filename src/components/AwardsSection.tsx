import React from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { ScrollReveal } from './common/ScrollReveal';

interface AwardsSectionProps {
  onOpenBrochure?: () => void;
  onExploreListings?: () => void;
}

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  onOpenBrochure,
  onExploreListings
}) => {
  return (
    <>
      {/* Premium Corporate Editorial Section: Our Commitment to Excellence & Ethics */}
      <section className="bg-[#ede7de] py-14 sm:py-20 md:py-24 px-4 sm:px-8 border-b border-[#ded7cc]">
        {/* Row 1: Certificates Grid in Vertical Format */}
        <ScrollReveal direction="up" className="max-w-[900px] mx-auto mb-10 sm:mb-14">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14616d]">
              Recognized Distinction
            </span>
            <h3 className="type-h3 text-[#182024]">
              Accreditations &amp; Civic Commendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-3 shadow-xs border border-[#ded7cc] rounded-xl hover:shadow-md transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Senate-Roger-Niello-web.jpg"
                alt="California State Senate Certificate of Recognition - Senator Roger Niello"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(1);
                }}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-3 shadow-xs border border-[#ded7cc] rounded-xl hover:shadow-md transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Assembly-Josh-Hoover-web.jpg"
                alt="California State Assembly Certificate of Recognition - Assemblymember Josh Hoover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(2);
                }}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-3 shadow-xs border border-[#ded7cc] rounded-xl hover:shadow-md transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/Congressional-Recognition-Ami-Bera-web.jpg"
                alt="U.S. Congressional Recognition - Congressman Ami Bera"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(4);
                }}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Row 2: White Editorial Card Container */}
        <ScrollReveal direction="up" delay={80} className="max-w-[960px] mx-auto">
          <div className="bg-white p-8 sm:p-14 md:p-16 shadow-xs border border-[#ded7cc] rounded-2xl text-left space-y-6">
            <div className="text-center space-y-2 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#966746]">
                Civic &amp; Legislative Distinction
              </span>
              <h2 className="type-h2 text-[#14616d]">
                Our Commitment to Excellence &amp; Ethics
              </h2>
            </div>

            <p className="type-body text-[#4a545c] text-left">
              At <strong className="font-semibold text-[#182024]">Easy Travel Lodging</strong>, integrity isn’t just a corporate talking point — it is the cornerstone of every reservation, lease agreement, and guest interaction. We are honored to be recognized across municipal, legislative, and congressional commendations celebrating organizational integrity and transparency.
            </p>

            <p className="type-body text-[#4a545c] text-left">
              The certificates awarded to founders <strong className="font-semibold text-[#182024]">Dr. Marlena Uhrik and Bill Wheelock</strong> reflect years of sustained dedication to welcoming every guest with honesty, reliability, and turnkey hospitality.
            </p>

            <p className="type-body text-[#4a545c] text-left">
              Our standards are highlighted through <strong className="font-semibold text-[#182024]">Congressional Recognition</strong> by <strong className="font-semibold text-[#182024]">U.S. Congressman Ami Bera</strong>, alongside official legislative commendations from <strong className="font-semibold text-[#182024]">California Assemblymember Josh Hoover</strong> and <strong className="font-semibold text-[#182024]">State Senator Roger Niello</strong>.
            </p>

            <p className="type-body text-[#4a545c] text-left">
              Whether you are visiting family, relocating to California, navigating an insurance transition, or securing extended corporate housing, our team ensures complete peace of mind.
            </p>

            <div className="pt-4 border-t border-[#e2ded6]">
              <p className="type-body-lg text-[#182024] font-semibold">
                Easy Travel Lodging
              </p>
              <p className="type-body text-[#727e86] italic text-sm">
                Where comfort meets integrity, and every guest is welcomed with dignity and care.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Section 2: 3 Photos + Corporate CTA Buttons */}
      <section className="bg-white py-14 sm:py-16 border-b border-[#e2ded6]">
        <ScrollReveal direction="up" delay={60} className="max-w-[1100px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="overflow-hidden bg-[#faf7f2] rounded-xl shadow-xs border border-[#e2ded6] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/173-LR.jpg"
                alt="Unit 173 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(5);
                }}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-104"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#faf7f2] rounded-xl shadow-xs border border-[#e2ded6] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/250-LR.jpg"
                alt="Unit 250 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(6);
                }}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-104"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#faf7f2] rounded-xl shadow-xs border border-[#e2ded6] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/P91-LR.jpg"
                alt="Unit 91 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(7);
                }}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-104"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {onOpenBrochure && (
              <button
                onClick={onOpenBrochure}
                className="btn btn-outline w-full sm:w-auto"
              >
                View Residence &amp; Services Brochure
              </button>
            )}
            {onExploreListings && (
              <button
                onClick={onExploreListings}
                className="btn btn-primary w-full sm:w-auto"
              >
                Explore Available Residences
              </button>
            )}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
};
