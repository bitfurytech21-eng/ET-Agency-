import React, { useState } from 'react';
import { ChevronRight, Mail, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/lodgingData';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenBooking?: () => void;
  onOpenBrochure?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const [chamberImgError, setChamberImgError] = useState(false);
  const [expertImgError, setExpertImgError] = useState(false);

  return (
    <>
      {/* Resized Dark Pre-Footer Section (#282828) */}
      <section
        aria-label="Affiliations and Design Consultation"
        className="bg-[#282828] text-white py-12 sm:py-14"
      >
        <div className="w-[80%] max-w-[360px] sm:max-w-[420px] lg:w-full lg:max-w-[1240px] mx-auto lg:px-8">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* Column 1: Direct Contact Details */}
            <div className="lg:col-span-3 space-y-3 text-left">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2.5 text-[15px] font-medium text-[#f0f0f0] hover:text-[#00b7a8] transition-colors"
              >
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="break-all">{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneClean}`}
                className="flex items-center gap-2.5 text-[15px] font-medium text-[#f0f0f0] hover:text-[#00b7a8] transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Column 2: Proud Member — Rancho Cordova Chamber of Commerce */}
            <div className="lg:col-span-3 flex justify-start lg:justify-center">
              {!chamberImgError ? (
                <img
                  src="/assets/rancho-cordova-proud-member-badge.jpg"
                  alt="Proud Member — Rancho Cordova Chamber of Commerce"
                  width={1050}
                  height={600}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallbackRemote =
                      'https://easytravellodging.com/wp-content/uploads/2022/12/RANCHO-CORDOVA-PROUD-MEMBER-BADGE.jpg';
                    if (e.currentTarget.src !== fallbackRemote) {
                      e.currentTarget.src = fallbackRemote;
                    } else {
                      setChamberImgError(true);
                    }
                  }}
                  className="w-[79%] max-w-[270px] lg:w-[240px] xl:w-[265px] lg:max-w-full h-auto object-contain block"
                />
              ) : (
                <div className="w-[265px] bg-white text-[#282828] rounded-[2px] overflow-hidden border-b-4 border-[#961b28]">
                  <div className="bg-[#961b28] text-white text-center font-bold text-lg py-1.5 tracking-wide">
                    Proud Member
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-xs font-semibold tracking-widest text-[#777777] uppercase">
                      Rancho Cordova
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-[#961b28]">
                      CHAMBER
                    </div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-[#777777] uppercase">
                      of Commerce
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Vacation Rental Design Discovery Call CTA */}
            <div className="lg:col-span-3 flex justify-center">
              <button
                type="button"
                onClick={() => onNavClick('beahost')}
                className="w-full max-w-[342px] rounded-[4px] bg-[#00b7a8] hover:bg-[#00a193] active:bg-[#008e82] text-white px-5 py-[18px] text-[19px] sm:text-[20px] lg:text-[18px] xl:text-[19px] font-medium leading-[1.45] text-center transition-colors cursor-pointer"
              >
                Book Your FREE Vacation Rental Design Discovery{' '}
                <span className="inline-flex items-center whitespace-nowrap">
                  Call
                  <ChevronRight className="w-5 h-5 ml-1.5 stroke-[2.25]" />
                </span>
              </button>
            </div>

            {/* Column 4: Vacation Rental Design Expert Circular Seal */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end pt-1 lg:pt-0">
              {!expertImgError ? (
                <img
                  src="/assets/vacation-rental-design-expert-badge.png"
                  alt="Vacation Rental Design Expert"
                  width={500}
                  height={500}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallbackRemote =
                      'https://easytravellodging.com/wp-content/uploads/2023/04/19.png';
                    if (e.currentTarget.src !== fallbackRemote) {
                      e.currentTarget.src = fallbackRemote;
                    } else {
                      setExpertImgError(true);
                    }
                  }}
                  className="w-[210px] h-[210px] lg:w-[185px] lg:h-[185px] xl:w-[205px] xl:h-[205px] object-contain block"
                />
              ) : (
                <div className="w-[205px] h-[205px] rounded-full bg-white border-4 border-[#e5e5e5] flex flex-col items-center justify-center p-5 text-center text-[#1b1d20]">
                  <span className="text-[11px] font-semibold tracking-[0.26em] uppercase">
                    Vacation
                  </span>
                  <span className="text-xl font-semibold text-[#1a6d7a] my-2">
                    Design Expert
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.26em] uppercase">
                    Rental
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Copyright Bar (#171717) */}
      <footer id="main-footer" className="bg-[#171717] text-[#8a8a8a] py-5 border-t border-[#222222]">
        <div className="w-[84%] max-w-[1240px] mx-auto lg:px-8 text-center lg:text-left">
          <div className="text-[15px] leading-[1.6] text-[#7f7f7f]">
            © Copyright {new Date().getFullYear()} {COMPANY_INFO.name} | All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
};
