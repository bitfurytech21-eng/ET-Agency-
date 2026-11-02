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
      {/* Resized Dark Pre-Footer Section */}
      <section
        aria-label="Affiliations and Design Consultation"
        className="bg-[#1e1712] text-white py-12 sm:py-14 border-t border-[#35271f]"
      >
        <div className="w-[88%] max-w-[360px] sm:max-w-[420px] lg:w-full lg:max-w-[1240px] mx-auto lg:px-8">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* Column 1: Direct Contact Details */}
            <div className="lg:col-span-3 space-y-3 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#966746] block">
                Direct Contact
              </span>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2.5 text-sm font-medium text-[#d6cdc2] hover:text-[#4de0d2] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#4de0d2] shrink-0" />
                <span className="break-all">{COMPANY_INFO.email}</span>
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-medium text-[#d6cdc2] hover:text-[#25D366] transition-colors tabular-nums"
              >
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.237a9.92 9.92 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.914 9.914 0 0012.012 2zm5.836 14.288c-.244.686-1.42 1.309-1.959 1.385-.506.071-1.168.102-1.884-.127-.433-.139-1.002-.326-1.728-.639-3.04-1.31-5.018-4.385-5.17-4.588-.152-.203-1.233-1.639-1.233-3.125 0-1.486.777-2.217 1.053-2.52.276-.303.602-.379.803-.379.201 0 .401.002.576.01.185.008.434-.07.679.519.245.589.833 2.034.906 2.181.073.148.122.322.024.518-.098.196-.148.318-.293.489-.146.171-.307.382-.439.514-.146.146-.298.305-.128.597.17.292.756 1.248 1.621 2.018 1.112.99 2.051 1.298 2.343 1.444.292.146.463.122.634-.073.171-.195.732-.854.927-1.147.195-.293.39-.244.659-.146.268.098 1.708.805 2.001.952.293.146.488.22.561.342.073.122.073.708-.171 1.394z" />
                </svg>
                <span>WhatsApp: {COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Column 2: California Statewide Hospitality Accreditation */}
            <div className="lg:col-span-3 flex justify-start lg:justify-center">
              <div className="w-[265px] bg-[#281e17] text-white rounded-xl p-4 border border-[#423328] shadow-xs text-left space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#4de0d2]">
                  Statewide Operations
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  California Hospitality
                </div>
                <p className="text-xs text-[#c2b5a7] leading-tight">
                  Accredited corporate lodging &amp; executive mobility network across California.
                </p>
              </div>
            </div>

            {/* Column 3: Vacation Rental Design Discovery Call CTA */}
            <div className="lg:col-span-3 flex justify-center">
              <button
                type="button"
                onClick={() => onNavClick('beahost')}
                className="w-full max-w-[340px] rounded-xl bg-[#14616d] hover:bg-[#0f4952] active:bg-[#0b383f] text-white px-5 py-3.5 text-sm sm:text-base font-semibold leading-snug text-center transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Book Vacation Rental Design Call</span>
                <ChevronRight className="w-4 h-4 ml-0.5 stroke-[2.25]" />
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
                  className="w-[180px] h-[180px] lg:w-[170px] lg:h-[170px] xl:w-[190px] xl:h-[190px] object-contain block"
                />
              ) : (
                <div className="w-[180px] h-[180px] rounded-full bg-white border-4 border-[#e2ded6] flex flex-col items-center justify-center p-5 text-center text-[#182024] shadow-xs">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#727e86]">
                    Vacation
                  </span>
                  <span className="text-lg font-bold text-[#14616d] my-1">
                    Design Expert
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#727e86]">
                    Rental
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Strip Banner */}
      <section aria-label="Social Media Channels" className="bg-[#f2f2f2] py-5 border-t border-[#dedede] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center gap-2">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity block cursor-pointer"
            title="Follow Easy Travel Lodging on Social Media"
          >
            <img
              src="/assets/aistudio/IMG_7629_ef5cf5c5.jpeg"
              alt="Easy Travel Lodging Social Media - TikTok, Instagram & Facebook"
              className="h-10 sm:h-12 w-auto object-contain mx-auto mix-blend-multiply"
            />
          </a>
        </div>
      </section>

      {/* Bottom Copyright Bar */}
      <footer id="main-footer" className="bg-[#140e0a] text-[#8a7f76] py-5 border-t border-[#241a13]">
        <div className="w-[88%] max-w-[1240px] mx-auto lg:px-8 text-center lg:text-left">
          <div className="text-xs sm:text-sm text-[#8a7f76]">
            © Copyright {new Date().getFullYear()} {COMPANY_INFO.name} | All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
};
