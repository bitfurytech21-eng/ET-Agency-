import React from 'react';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';
import { Building2, Car, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreListings?: () => void;
  onOpenBrochure?: () => void;
  onLearnEthics?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreListings,
  onOpenBrochure,
}) => {
  return (
    <section className="et_section_hero relative overflow-hidden py-16 lg:py-24 border-b border-[#e6dfd5]">
      <LivePhotoBackground scene="cycle" secondaryScene="interior" overlay="warm-hero" />

      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 border border-[#e2dacd] rounded-lg text-xs font-semibold text-[#14616d] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14616d]" />
              <span>Turnkey Executive Housing &amp; Curated 3D Fleet</span>
            </div>

            <div className="space-y-3">
              <h1 className="type-h1 text-[#182024] tracking-tight">
                Move-In-Ready Residences, Tailored to Your Schedule
              </h1>
              <p className="type-body-lg text-[#4a545c] max-w-[640px] leading-relaxed">
                Thoughtfully equipped 1- and 2-bedroom executive residences, private airport vehicle staging, and dedicated concierge hospitality across California’s premier residential communities.
              </p>
            </div>

            {/* Value Proposition Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1 text-xs text-[#354047] font-medium">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14616d] shrink-0" />
                <span>5 Nights to 12+ Months</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14616d] shrink-0" />
                <span>Chef Kitchen &amp; Fast WiFi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14616d] shrink-0" />
                <span>Direct Fedwire &amp; ACH Invoicing</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3.5 items-center">
              {onExploreListings && (
                <button
                  type="button"
                  onClick={onExploreListings}
                  className="btn btn-primary group shadow-sm flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <span>Explore Residences</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              <button
                type="button"
                onClick={onOpenBooking}
                className="btn btn-white shadow-xs flex items-center gap-2 border border-[#d6cfc5]"
              >
                <span>Request Custom Stay</span>
              </button>

              {onOpenBrochure && (
                <button
                  type="button"
                  onClick={onOpenBrochure}
                  className="btn btn-outline text-xs text-[#14616d] hover:text-[#0f4952] flex items-center gap-1.5 border-dashed"
                >
                  <FileText className="w-3.5 h-3.5 text-[#14616d]" />
                  <span>Overview Brochure (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px] bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e5dfd6] shadow-lg space-y-3.5 card-hover group">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#1a2024]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/01/keys-hotel-board-web-crop.png"
                  alt="Easy Travel Lodging Welcome Keys Board"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(0);
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold rounded-md">
                  California Portfolio
                </div>
              </div>

              <div className="p-1 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#182024]">
                  <span>California Regional Network</span>
                  <span className="text-[#14616d] font-mono">100% Turnkey</span>
                </div>
                <p className="text-xs text-[#5f6972] leading-relaxed">
                  Sanitized, inspected, and fully outfitted with housewares, premium linens, and high-speed enterprise connectivity prior to arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
