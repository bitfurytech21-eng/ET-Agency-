import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';
import { ScrollReveal } from './common/ScrollReveal';
import { CaliforniaExperiencesAccordion } from './CaliforniaExperiencesAccordion';

interface AreaGuideSectionProps {
  onOpenBooking: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const AreaGuideSection: React.FC<AreaGuideSectionProps> = ({
  onOpenBooking,
}) => {
  return (
    <>
      {/* California Experiences Section */}
      <section className="bg-[#f8fafc] py-16 sm:py-20 border-b border-[#e2e8f0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <ScrollReveal direction="up" className="max-w-3xl space-y-2.5">
            <span className="et_section_h6 inline-flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#14616d]" />
              <span>California Experiences &amp; Destination Guide</span>
            </span>
            <h2 className="type-h2 text-[#0f172a]">
              Explore Premier Destinations &amp; <span className="text-[#14616d]">California Corridors</span>
            </h2>
            <p className="type-body text-[#475569] leading-relaxed pt-1">
              Whether you are traveling for healthcare assignments, corporate consulting, government relocations, or family transitions, Easy Travel Lodging coordinates move-in-ready furnished residences, airport fleet delivery, and attentive concierge support across California&apos;s premier destinations.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={80}>
            <CaliforniaExperiencesAccordion showIntro={false} />
          </ScrollReveal>
        </div>
      </section>

      {/* Availability Call-to-Action Banner */}
      <section className="et_section_attractions relative overflow-hidden py-18 sm:py-24 text-white text-left border-b border-[#1e293b]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="type-support font-semibold tracking-wide text-[#5eead4] block">
                Turnkey Living Across California
              </span>
              <h2 className="type-h2 text-white">
                Check open dates or configure your stay online.
              </h2>
            </div>

            <button
              type="button"
              onClick={onOpenBooking}
              className="btn btn-white group"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-4 h-4 text-[#14616d] btn-arrow" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
