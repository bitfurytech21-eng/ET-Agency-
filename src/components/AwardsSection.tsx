import React from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';

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
      <section className="bg-[#B3A093] py-12 sm:py-20 md:py-24 px-4 sm:px-8">
        {/* Row 1: Certificates Grid in Vertical Format */}
        <div className="max-w-[860px] mx-auto mb-10 sm:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-2 sm:p-3 shadow-md border border-[#e6dfd5] rounded-sm hover:shadow-lg transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Senate-Roger-Niello-web.jpg"
                alt="California State Senate Certificate of Recognition - Senator Roger Niello"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(1);
                }}
                className="w-full h-auto object-contain rounded-xs"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-2 sm:p-3 shadow-md border border-[#e6dfd5] rounded-sm hover:shadow-lg transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/CA-State-Assembly-Josh-Hoover-web.jpg"
                alt="California State Assembly Certificate of Recognition - Assemblymember Josh Hoover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(2);
                }}
                className="w-full h-auto object-contain rounded-2xs"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-2 sm:p-3 shadow-md border border-[#e6dfd5] rounded-sm hover:shadow-lg transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/BBB-Torch-Award-web.jpg"
                alt="Better Business Bureau Torch Award for Ethics"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(3);
                }}
                className="w-full h-auto object-contain rounded-2xs"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-2 sm:p-3 shadow-md border border-[#e6dfd5] rounded-sm hover:shadow-lg transition-shadow">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2025/11/Congressional-Recognition-Ami-Bera-web.jpg"
                alt="U.S. Congressional Recognition - Congressman Ami Bera"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(4);
                }}
                className="w-full h-auto object-contain rounded-2xs"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Row 2: White Editorial Card Container */}
        <div className="max-w-[960px] mx-auto">
          <div className="bg-white p-8 sm:p-16 md:p-20 shadow-sm border border-[#e6dfd5] rounded-none sm:rounded-lg text-left space-y-6 sm:space-y-8">
            <h2 className="text-[#00b7a8] font-heading font-extrabold text-3xl sm:text-5xl md:text-[46px] leading-tight text-center tracking-tight mb-8 sm:mb-12">
              Our Commitment to Excellence &amp; Ethics
            </h2>

            <p className="text-[#282828] font-sans text-base sm:text-lg md:text-[20px] leading-[1.75] text-left">
              At <strong className="font-bold text-[#111111]">Easy Travel Lodging</strong>, integrity isn’t just a business value — it’s the foundation of everything we do. We are honored and humbled to be recognized by the <strong className="font-bold text-[#111111]">Better Business Bureau with the prestigious Torch Award</strong>, the highest distinction awarded for <strong className="font-bold text-[#111111]">Business Ethics</strong>. This award celebrates organizations that demonstrate exceptional character, build trust within the community, and uphold the strongest standards of integrity in every interaction.
            </p>

            <p className="text-[#282828] font-sans text-base sm:text-lg md:text-[20px] leading-[1.75] text-left">
              Receiving this award was an extraordinary moment for us. The photos you see of <strong className="font-bold text-[#111111]">Marlena Uhrik and Bill Wheelock</strong> accepting this honor reflect years of dedication to serving our guests with compassion, honesty, and excellence.
            </p>

            <p className="text-[#282828] font-sans text-base sm:text-lg md:text-[20px] leading-[1.75] text-left">
              Our commitment to ethical business practices was further acknowledged through <strong className="font-bold text-[#111111]">Congressional Recognition</strong>, presented by <strong className="font-bold text-[#111111]">U.S. Congressman Ami Bera</strong>, along with commendations from <strong className="font-bold text-[#111111]">California Assemblymember Josh Hoover</strong> and <strong className="font-bold text-[#111111]">California State Senator Roger Niello</strong>.
            </p>

            <p className="text-[#282828] font-sans text-base sm:text-lg md:text-[20px] leading-[1.75] text-left">
              These recognitions affirm our mission: to provide lodging experiences that are not only comfortable and convenient but grounded in trust, respect, and community service.
            </p>

            <p className="text-[#282828] font-sans text-base sm:text-lg md:text-[20px] leading-[1.75] text-left">
              At Easy Travel Lodging, we believe in doing business the right way — with transparency and genuine care. Whether you are visiting family, relocating to the region, bridging a home renovation, or arriving for an extended work assignment, you can count on a responsive local team dedicated to your comfort and peace of mind.
            </p>

            <div className="pt-4 border-t border-[#e6dfd5]">
              <p className="text-base sm:text-lg text-[#282828] font-bold">
                Easy Travel Lodging
              </p>
              <p className="text-sm sm:text-base text-[#6e5f53] italic">
                Where comfort meets integrity, and every guest is welcomed with dignity and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 3 Photos + Teal Buttons */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#e6dfd5]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="overflow-hidden bg-[#faf8f5] rounded-lg shadow-2xs border border-[#e6dfd5]">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/173-LR.jpg"
                alt="Unit 173 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(5);
                }}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#faf8f5] rounded-lg shadow-2xs border border-[#e6dfd5]">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/250-LR.jpg"
                alt="Unit 250 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(6);
                }}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden bg-[#faf8f5] rounded-lg shadow-2xs border border-[#e6dfd5]">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/01/P91-LR.jpg"
                alt="Unit 91 Furnished Living Room"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackPropertyImage(7);
                }}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            {onOpenBrochure && (
              <button
                onClick={onOpenBrochure}
                className="et_pb_button et_pb_button_white w-full sm:w-auto text-center cursor-pointer shadow-2xs"
              >
                View Residence &amp; Services Brochure
              </button>
            )}
            {onExploreListings && (
              <button
                onClick={onExploreListings}
                className="et_pb_button et_pb_button_teal w-full sm:w-auto text-center cursor-pointer shadow-2xs"
              >
                Explore Available Residences
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
