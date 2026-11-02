import React from 'react';
import { Mail, Phone, Compass } from 'lucide-react';
import { COMPANY_INFO } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';
import { ScrollReveal } from './common/ScrollReveal';
import { CaliforniaExperiencesAccordion } from './CaliforniaExperiencesAccordion';

interface AreaGuideSectionProps {
  onOpenBooking: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const AreaGuideSection: React.FC<AreaGuideSectionProps> = ({
  onOpenBooking,
  onOpenDiscoveryCall
}) => {
  return (
    <>
      {/* California Experiences Section */}
      <section className="bg-[#faf7f2] py-14 sm:py-20 border-b border-[#e2ded6]">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-8 text-left space-y-10">
          <ScrollReveal direction="up" className="max-w-3xl space-y-3">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#966746] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#14616d]" />
                California Experiences &amp; Destination Guide
              </span>
              <h2 className="type-h2 text-[#182024]">
                Explore Premier Destinations &amp; <span className="text-[#14616d]">California Corridors</span>
              </h2>
            </div>
            <p className="type-body text-[#4a545c] leading-relaxed pt-1">
              Whether you are traveling for healthcare assignments, corporate consulting, government relocations, or family transitions, Easy Travel Lodging coordinates move-in-ready furnished residences, airport fleet delivery, and attentive concierge support across California&apos;s premier destinations.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <CaliforniaExperiencesAccordion showIntro={false} />
          </ScrollReveal>
        </div>
      </section>

      {/* Live American River Sunrise Banner */}
      <section className="et_section_attractions relative overflow-hidden py-20 sm:py-28 text-white text-left border-b border-[#382b22]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4de0d2] block">
                Turnkey Living Across California
              </span>
              <h2 className="type-h2 text-white">
                Check open dates or build your stay online.
              </h2>
            </div>

            <div>
              <button
                onClick={onOpenBooking}
                className="btn btn-white shadow-md text-sm"
              >
                <span>Check Availability</span>
                <span className="text-[#14616d]">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Pre-Footer Strip */}
      <section className="bg-[#1e1713] py-8 text-white border-b border-[#2e231c]">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Column 1: Contact info */}
            <div className="space-y-2 text-xs sm:text-sm font-medium text-[#d6cdc2]">
              <a
                href="mailto:easytravelagency@trustagent.space"
                className="flex items-center gap-2 hover:text-[#4de0d2] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#4de0d2] shrink-0" />
                <span className="break-all">easytravelagency@trustagent.space</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors tabular-nums"
              >
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.92 9.92 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.914 9.914 0 0012.012 2zm5.836 14.288c-.244.686-1.42 1.309-1.959 1.385-.506.071-1.168.102-1.884-.127-.433-.139-1.002-.326-1.728-.639-3.04-1.31-5.018-4.385-5.17-4.588-.152-.203-1.233-1.639-1.233-3.125 0-1.486.777-2.217 1.053-2.52.276-.303.602-.379.803-.379.201 0 .401.002.576.01.185.008.434-.07.679.519.245.589.833 2.034.906 2.181.073.148.122.322.024.518-.098.196-.148.318-.293.489-.146.171-.307.382-.439.514-.146.146-.298.305-.128.597.17.292.756 1.248 1.621 2.018 1.112.99 2.051 1.298 2.343 1.444.292.146.463.122.634-.073.171-.195.732-.854.927-1.147.195-.293.39-.244.659-.146.268.098 1.708.805 2.001.952.293.146.488.22.561.342.073.122.073.708-.171 1.394z" />
                </svg>
                <span>WhatsApp: {COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Column 2: BBB Seal & Accredited Hospitality Badge */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.bbb.org/us/ca/sacramento/profile/boarding-house/easy-travel-lodging-1156-90076707/#sealclick"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-block bg-white p-1 rounded-lg"
              >
                <img
                  src="https://seal-necal.bbb.org/seals/blue-seal-120-61-bbb-90076707.png"
                  alt="Easy Travel Lodging BBB Business Review"
                  className="h-12 w-auto object-contain"
                />
              </a>
              <div className="px-3.5 py-2 rounded-lg bg-[#2b211a] border border-[#44362b] text-left shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-[#4de0d2] tracking-wider block">California</span>
                <span className="text-xs font-semibold text-white">Premier Hospitality</span>
              </div>
            </div>

            {/* Column 3: Discovery Call Button */}
            <div>
              <button
                onClick={onOpenDiscoveryCall || onOpenBooking}
                className="btn btn-primary w-full text-xs"
              >
                Schedule Rental Design Call
              </button>
            </div>

            {/* Column 4: Badge 19 */}
            <div className="flex justify-center md:justify-end">
              <img
                src="https://easytravellodging.com/wp-content/uploads/2023/04/19.png"
                alt="Badge 19"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
