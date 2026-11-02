import React from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { ScrollReveal } from './common/ScrollReveal';

interface AwardsSectionProps {
  onOpenBrochure?: () => void;
  onExploreListings?: () => void;
}

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  onOpenBrochure,
  onExploreListings,
}) => {
  return (
    <>
      {/* Corporate Editorial Section: Commitment to Excellence & Ethics */}
      <section className="bg-[#f1f5f9] py-16 sm:py-20 px-4 sm:px-8 border-b border-[#e2e8f0]">
        {/* Row 1: Legislative & Congressional Commendations */}
        <ScrollReveal direction="up" className="max-w-[960px] mx-auto mb-12 sm:mb-14">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="et_section_h6 block">Recognized Distinction</span>
            <h3 className="type-h3 text-[#0f172a]">
              Accreditations &amp; Civic Commendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-3.5 shadow-xs border border-[#e2e8f0] rounded-xl">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Senate-Roger-Niello-web.jpg"
                alt="California State Senate Certificate of Recognition - Senator Roger Niello"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(1);
                }}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-3.5 shadow-xs border border-[#e2e8f0] rounded-xl">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Assembly-Josh-Hoover-web.jpg"
                alt="California State Assembly Certificate of Recognition - Assemblymember Josh Hoover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(2);
                }}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-3.5 shadow-xs border border-[#e2e8f0] rounded-xl">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/Congressional-Recognition-Ami-Bera-web.jpg"
                alt="U.S. Congressional Recognition - Congressman Ami Bera"
                referrerPolicy="no-referrer"
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

        {/* Row 2: Editorial Statement */}
        <ScrollReveal direction="up" delay={60} className="max-w-[960px] mx-auto">
          <div className="bg-white p-8 sm:p-12 md:p-14 shadow-xs border border-[#e2e8f0] rounded-2xl text-left space-y-5">
            <div className="space-y-2 pb-2">
              <span className="et_section_h6 block">Civic &amp; Legislative Distinction</span>
              <h2 className="type-h2 text-[#0f172a]">
                Our Commitment to Excellence &amp; Ethics
              </h2>
            </div>

            <p className="type-body text-[#475569]">
              At <strong className="font-semibold text-[#0f172a]">Easy Travel Lodging</strong>, integrity is the foundation of every reservation, lease agreement, and guest interaction. We are honored to hold municipal, legislative, and congressional commendations recognizing organizational transparency and ethical stewardship.
            </p>

            <p className="type-body text-[#475569]">
              The certificates awarded to founders <strong className="font-semibold text-[#0f172a]">Dr. Marlena Uhrik and Bill Wheelock</strong> reflect years of sustained dedication to welcoming every guest with honesty, reliability, and turnkey hospitality.
            </p>

            <p className="type-body text-[#475569]">
              Our standards are highlighted through <strong className="font-semibold text-[#0f172a]">Congressional Recognition</strong> by <strong className="font-semibold text-[#0f172a]">U.S. Congressman Ami Bera</strong>, alongside official legislative commendations from <strong className="font-semibold text-[#0f172a]">California Assemblymember Josh Hoover</strong> and <strong className="font-semibold text-[#0f172a]">State Senator Roger Niello</strong>.
            </p>

            <p className="type-body text-[#475569]">
              Whether you are visiting family, relocating to California, navigating an insurance transition, or securing extended corporate housing, our team ensures complete peace of mind.
            </p>

            <div className="pt-5 border-t border-[#e2e8f0]">
              <p className="text-base text-[#0f172a] font-semibold">
                Easy Travel Lodging
              </p>
              <p className="text-sm text-[#64748b]">
                Where comfort meets integrity, and every guest is welcomed with dignity and care.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Interior Photography Trio + Brochure Actions */}
      <section className="bg-white py-14 sm:py-16 border-b border-[#e2e8f0]">
        <ScrollReveal direction="up" delay={50} className="max-w-[1160px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="overflow-hidden bg-[#f8fafc] rounded-xl border border-[#e2e8f0] aspect-[4/3] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/173-LR.jpg"
                alt="Unit 173 Furnished Living Room"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(5);
                }}
                className="w-full h-full object-cover img-zoom"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#f8fafc] rounded-xl border border-[#e2e8f0] aspect-[4/3] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/250-LR.jpg"
                alt="Unit 250 Furnished Living Room"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(6);
                }}
                className="w-full h-full object-cover img-zoom"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#f8fafc] rounded-xl border border-[#e2e8f0] aspect-[4/3] group">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/P91-LR.jpg"
                alt="Unit 91 Furnished Living Room"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(7);
                }}
                className="w-full h-full object-cover img-zoom"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
            {onOpenBrochure && (
              <button
                type="button"
                onClick={onOpenBrochure}
                className="btn btn-outline w-full sm:w-auto"
              >
                View Residence &amp; Services Brochure
              </button>
            )}
            {onExploreListings && (
              <button
                type="button"
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
