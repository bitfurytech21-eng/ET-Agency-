import React, { useState } from 'react';
import {
  Check,
  Mail,
  Phone,
  Download,
  ExternalLink,
  X,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { PROPERTIES, getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';

interface CorporateViewProps {
  onOpenBooking: () => void;
  onOpenBrochure: () => void;
  onOpenDiscoveryCall?: () => void;
}

export const CorporateView: React.FC<CorporateViewProps> = ({
  onOpenBooking,
  onOpenBrochure,
}) => {
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  const safetyAndComfortItemsCol1 = [
    'Hotel-grade queen mattresses for restorative sleep',
    'Hypoallergenic, vinyl-free mattress encasements',
    'Freshly laundered mattress protectors before every arrival',
    'Two sets of 400–600 thread count cotton sheets and pillow protectors',
    'Two plush white bath towel sets prepared for every registered guest',
  ];

  const safetyAndComfortItemsCol2 = [
    'Freshly cleaned duvets and seasonal bedding inserts',
    '55-inch 4K Smart TV in the living room plus 43-inch Smart TVs in bedrooms',
    'Contactless smart-lock keypad entry with unique guest codes',
    'Reserved covered parking steps from your front door',
    'All utilities, 400+ Mbps Wi-Fi, and in-unit laundry included',
  ];

  const guestReviews = [
    {
      name: 'Stacy S.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Stacy-S.png',
      alt: 'Stacy S. Guest Review for Easy Travel Lodging',
    },
    {
      name: "Grandma's Love",
      src: 'https://easytravellodging.com/wp-content/uploads/2023/08/grandmas-love-400.png',
      alt: "Grandma's Love Guest Review for Easy Travel Lodging",
    },
    {
      name: 'Joanne H.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Joanne-H.png',
      alt: 'Joanne H. Guest Review for Easy Travel Lodging',
    },
  ];

  return (
    <div className="w-full bg-white text-[#0f172a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-b border-[#e2e8f0]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="warm-hero" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <span className="et_section_h6 block">
              Extended Stays · Corporate Relocations · Group Housing
            </span>
            <h1 className="type-h1 text-[#0f172a]">
              Turnkey Furnished Residences Across California
            </h1>
            <p className="type-body-lg text-[#475569] max-w-2xl leading-relaxed">
              Tailored for families between homes, insurance temporary displacement, medical fellowships, corporate relocations, and government per diem travel.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button type="button" onClick={onOpenBooking} className="btn btn-primary">
                <span>Request Custom Stay or Group Quote</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button type="button" onClick={onOpenBrochure} className="btn btn-outline">
                <Download className="w-4 h-4 text-[#14616d]" />
                <span>Download Residence Overview</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Intro Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-5">
          <p className="type-h3 text-[#0f172a]">
            Move-in-ready residences with transparent rates, consolidated invoicing, and attentive local care—available for 5+ night short stays and tax-exempt 30+ day extended leases.
          </p>

          <p className="type-body text-[#475569]">
            Welcome to <strong className="text-[#0f172a] font-semibold">Easy Travel Lodging (ETL)</strong>. Whether you are coordinating housing for a relocating family, arranging temporary living during a home renovation, visiting medical and research centers, or managing corporate and government employee travel, our goal is simple: to make every guest feel safe, comfortable, and genuinely cared for from arrival through departure.
          </p>
        </div>
      </section>

      {/* Section 2: How we prepare every residence */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="et_section_h6 block">Quality Assurance</span>
              <h2 className="type-h2 text-[#0f172a]">
                How We Prepare Every Residence
              </h2>

              <p className="type-body text-[#475569]">
                Every apartment in our portfolio is personally selected and inspected by our hospitality leadership. We choose quiet residential communities with reserved parking, landscaped grounds, and convenient access to major business corridors, medical complexes, and transport hubs.
              </p>

              <p className="type-body text-[#475569]">
                Each floor plan is thoughtfully furnished by our interior design specialists—combining residential comfort, dedicated workspaces, full kitchens, and welcoming living areas so no two residences feel like sterile hotel rooms.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="max-w-md w-full bg-[#f8fafc] rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm aspect-[4/3]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_499595186-web.jpg"
                  alt="Furnished Extended Stay Residence by Easy Travel Lodging"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(0);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What is waiting inside */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm aspect-[4/3]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_59543525-web.jpg"
                  alt="Fully Equipped Residence Kitchen and Living Essentials"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(1);
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
              <span className="et_section_h6 block">Turnkey Inventory</span>
              <h2 className="type-h2 text-[#0f172a]">
                What Is Waiting Inside Every Suite
              </h2>

              <p className="type-body text-[#475569]">
                Beyond full furniture and kitchenware, we stock the everyday household items guests actually use—from cookware, coffee makers, and storage wraps to desk supplies and generous closet hangers. For a complete inventory sheet, reach us anytime at{' '}
                <a
                  href="mailto:easytravelagency@trustagent.space"
                  className="text-[#14616d] font-semibold hover:underline"
                >
                  easytravelagency@trustagent.space
                </a>
                .
              </p>

              <p className="type-body text-[#475569]">
                Every arrival includes our signature <strong className="text-[#0f172a]">Starter Kit</strong> with bath toiletries, paper goods, laundry and dishwasher detergent, and household cleaning supplies—saving you an errand run on your first night.
              </p>

              <p className="type-body text-[#475569]">
                Every residence is professionally cleaned and inspected prior to check-in, and optional mid-stay housekeeping, pantry provisioning, and executive fleet vehicle rentals can be added directly to your cart.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e2e8f0]">
            <h3 className="type-h4 text-[#0f172a] mb-5">
              Standard Comfort, Hygiene &amp; Connectivity Inclusions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
              <div className="space-y-3">
                {safetyAndComfortItemsCol1.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-[#edf6f8] text-[#14616d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="type-body text-[#334155] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {safetyAndComfortItemsCol2.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-[#edf6f8] text-[#14616d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="type-body text-[#334155] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Thoughtful arrival touches */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="et_section_h6 block">Guest Experience</span>
              <h2 className="type-h2 text-[#0f172a]">
                Thoughtful Arrival Touches
              </h2>

              <p className="type-body text-[#475569]">
                Waiting on the counter when you arrive is our custom Guest Guidebook highlighting favorite neighborhood cafes, scenic parkways, seasonal community events, and local maps.
              </p>

              <p className="type-body text-[#475569]">
                Each stay also begins with a complimentary Welcome Basket of snacks and regional treats for you and your household.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="max-w-md w-full bg-[#f8fafc] rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm aspect-[4/3]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_409481882-web.jpg"
                  alt="ETL Welcome Guidebook and Basket"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(2);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Flexible billing & personal support */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm aspect-[4/3]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/IMG_5654-web.jpg"
                  alt="Relax and Rejuvenate with Easy Travel Lodging"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(3);
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <span className="et_section_h6 block">Corporate &amp; Insurance Billing</span>
              <h2 className="type-h2 text-[#0f172a]">
                Flexible Billing &amp; Dedicated Support
              </h2>

              <p className="type-body text-[#475569]">
                We support individual bookings, family relocations, insurance housing adjusters, and corporate travel departments alike—offering online cart checkout, prepaid Lodging Unit packages, and verified Bank Wire, Direct ACH, or Zelle settlement.
              </p>

              <div className="p-5 sm:p-6 bg-white rounded-xl border border-[#e2e8f0] space-y-3">
                <h4 className="type-support font-semibold text-[#64748b]">
                  Direct Reservations &amp; Account Desk
                </h4>
                <div className="space-y-2 type-body text-[#475569]">
                  <div className="flex items-center gap-3 tabular-nums">
                    <Phone className="w-4 h-4 text-[#14616d]" />
                    <span>
                      Phone:{' '}
                      <a href="tel:9168003295" className="font-semibold text-[#0f172a] hover:text-[#14616d]">
                        916-800-3295
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#14616d]" />
                    <span>
                      Email:{' '}
                      <a
                        href="mailto:easytravelagency@trustagent.space"
                        className="font-semibold text-[#0f172a] hover:text-[#14616d]"
                      >
                        easytravelagency@trustagent.space
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#14616d]" />
                    <span>
                      Web: <span className="font-semibold text-[#0f172a]">EasyTravelLodging.com</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1 type-support text-[#475569]">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                <span>A portion of proceeds from every stay supports charities serving children, veterans, and pets.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Guest Reviews */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-8 border-t border-[#e2e8f0]">
        <LivePhotoBackground scene="courtyard" overlay="light" />
        <div className="relative z-10 max-w-6xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-[#e2e8f0]">
          <div className="mb-8 text-left space-y-1.5">
            <span className="et_section_h6 block">Guest Feedback</span>
            <h2 className="type-h2 text-[#0f172a]">Stories From Recent Stays</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {guestReviews.map((rev, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedReviewImage(rev.src)}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden border border-[#e2e8f0] card-hover"
              >
                <img
                  src={rev.src}
                  alt={rev.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                />
                <div className="absolute inset-0 bg-[#0f172a]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="type-btn bg-white/95 text-[#0f172a] px-3.5 py-2 rounded-lg shadow-sm">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6B: Los Angeles Luxury Vacation Rentals Collection */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="et_section_h6 block">Southern California Collection</span>
            <h2 className="type-h2 text-[#0f172a]">
              Los Angeles Luxury Estates &amp; Oceanfront Villas
            </h2>
            <p className="type-body text-[#475569]">
              Curated under Easy Travel Lodging, explore luxury vacation villas, Bel-Air sanctuaries, Malibu oceanfront retreats, and Hollywood Hills panoramic estates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROPERTIES.filter((p) => p.id.startsWith('la-')).map((laProp) => (
              <div
                key={laProp.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-xs card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f5f9]">
                    <img
                      src={laProp.images[0]}
                      alt={laProp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover img-zoom"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 right-3 bg-white/95 text-[#0f172a] type-support font-bold font-mono px-3 py-1 rounded-lg shadow-xs tabular-nums">
                      ${laProp.monthlyRate.toLocaleString()} / mo
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="type-support font-medium text-[#64748b] tabular-nums">
                      {laProp.location} · {laProp.bedrooms} Bedrooms · {laProp.bathrooms} Baths · {laProp.sqft}
                    </div>
                    <h3 className="type-h3 text-[#0f172a]">{laProp.title}</h3>
                    <p className="type-body text-[#475569] line-clamp-3">
                      {laProp.shortDesc}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {laProp.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 type-support font-medium text-[#334155] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-md"
                        >
                          <Check className="w-3.5 h-3.5 text-[#14616d]" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 flex items-center justify-between gap-4 border-t border-[#f1f5f9]">
                  <span className="type-support text-[#64748b] font-medium">{laProp.pricingNote}</span>
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="btn btn-sm btn-primary shrink-0"
                  >
                    Inquire Villa Stay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Group Inquiry Banner */}
      <section className="relative overflow-hidden py-18 sm:py-24 px-4 text-center text-white border-t border-[#1e293b]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <h2 className="type-h2 text-white">
            Planning a Relocation, Extended Stay, or Multi-Unit Booking?
          </h2>
          <p className="type-body-lg text-slate-300 max-w-xl mx-auto">
            Reach out for custom date windows, multi-residence availability, direct insurance invoicing, or corporate billing arrangements.
          </p>
          <div className="pt-1">
            <button type="button" onClick={onOpenBooking} className="btn btn-white">
              <span>Inquire About Dates &amp; Rates</span>
              <ChevronRight className="w-4 h-4 text-[#14616d]" />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Reviews */}
      {selectedReviewImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center">
              <img
                src={selectedReviewImage}
                alt="Review Preview"
                referrerPolicy="no-referrer"
                className="max-h-[80vh] w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = getFallbackPropertyImage(0);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
