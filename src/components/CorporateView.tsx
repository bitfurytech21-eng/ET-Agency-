import React, { useState } from 'react';
import { 
  Check, 
  Mail, 
  Phone, 
  Download, 
  ExternalLink, 
  X,
  Heart,
  ChevronRight
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
  onOpenDiscoveryCall
}) => {
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  const safetyAndComfortItemsCol1 = [
    'Hotel-grade queen mattresses for restorative sleep',
    'Hypoallergenic, vinyl-free mattress encasements',
    'Freshly laundered mattress protectors before every arrival',
    'Two sets of 400–600 thread count cotton sheets and pillow protectors',
    'Two plush white bath towel sets prepared for every registered guest'
  ];

  const safetyAndComfortItemsCol2 = [
    'Freshly cleaned duvets and seasonal bedding inserts',
    '55-inch 4K Smart TV in the living room plus 43-inch Smart TVs in bedrooms',
    'Contactless smart-lock keypad entry with unique guest codes',
    'Reserved covered parking steps from your front door',
    'All utilities, 400+ Mbps Wi-Fi, and in-unit laundry included'
  ];

  const guestReviews = [
    {
      name: 'Stacy S.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Stacy-S.png',
      alt: 'Stacy S. Guest Review for Easy Travel Lodging'
    },
    {
      name: "Grandma's Love",
      src: 'https://easytravellodging.com/wp-content/uploads/2023/08/grandmas-love-400.png',
      alt: "Grandma's Love Guest Review for Easy Travel Lodging"
    },
    {
      name: 'Joanne H.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Joanne-H.png',
      alt: 'Joanne H. Guest Review for Easy Travel Lodging'
    }
  ];

  return (
    <div className="w-full bg-white text-[#333333]">
      {/* =========================================================================
          SECTION 0: Live Realistic Photo Hero Section
          ========================================================================= */}
      <section className="et_section_corporate_hero relative overflow-hidden pt-16 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-[#e6dfd5]">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="warm-hero" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h5 className="type-support font-semibold uppercase tracking-[0.14em] text-[#82634f] mb-2 sm:mb-3">
              Extended Stays, Relocations &amp; Group Housing
            </h5>
            <h1 className="type-h1 text-[#18363f] mb-4">
              Turnkey Furnished Residences Across California’s homes
            </h1>
            <p className="type-body-lg text-[#282828] max-w-2xl mb-8 font-medium">
              Tailored for families between homes, insurance temporary displacement, medical fellowships, corporate relocations, and government per diem travel nationwide.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenBrochure}
                className="et_pb_button et_pb_button_white type-btn group cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#82634f] group-hover:text-[#00b7a8] transition-colors" />
                <span>Download Residence Overview</span>
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_teal type-btn cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Request Custom Stay or Group Quote</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: Lead Intro Section
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="type-h3 text-[#282828]">
            Move-in-ready residences with transparent rates, consolidated invoicing, and attentive local care—available for 5+ night short stays and tax-exempt 30+ day extended leases.
          </h3>

          <p className="type-body-lg text-[#5c5046]">
            Welcome to <strong className="text-[#282828] font-semibold">Easy Travel Lodging (ETL)</strong>. Whether you are coordinating housing for a relocating family, arranging temporary living during a home renovation, visiting medical and research centers nationwide, or managing corporate and government employee travel, our goal is simple: to make every guest feel safe, comfortable, and genuinely cared for from arrival through departure.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: How we prepare every residence
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-white border-t border-[#efe9e0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="type-h2 text-[#1d4f5d]">
                How We Prepare Every Residence
              </h2>

              <p className="type-body text-[#5c5046]">
                Every apartment in our nationwide portfolio is personally selected and inspected by our hospitality leadership. We choose quiet residential communities with reserved parking, peaceful landscaped grounds, and rapid access to major business corridors, medical complexes, and transport hubs nationwide.
              </p>

              <p className="type-body text-[#5c5046]">
                Each floor plan is thoughtfully furnished by our interior design specialists—combining warm residential decor, dedicated workspaces, full kitchens, and comfortable living areas so no two residences feel like cookie-cutter hotel rooms.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="max-w-md w-full bg-[#faf8f5] rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-md">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_499595186-web.jpg"
                  alt="Furnished Extended Stay Residence by Easy Travel Lodging"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
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

      {/* =========================================================================
          SECTION 3: What is waiting inside...
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-[#faf8f5] border-t border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-left lg:text-right mb-6 sm:mb-10">
            <h2 className="type-h2 text-[#1d4f5d]">
              What Is Waiting Inside
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="max-w-md w-full bg-[#f4efe9] rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-md">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_59543525-web.jpg"
                  alt="Fully Equipped Residence Kitchen and Living Essentials"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(1);
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <p className="type-body text-[#5c5046]">
                Beyond full furniture and kitchenware, we stock the everyday household items guests actually use—from cookware, coffee makers, and storage wraps to desk supplies and plenty of closet hangers. For a complete inventory sheet, reach us anytime at{' '}
                <a 
                  href="mailto:easytravelagency@trustagent.space" 
                  className="text-[#00897d] font-semibold hover:underline"
                >
                  easytravelagency@trustagent.space
                </a>.
              </p>

              <p className="type-body text-[#5c5046]">
                Every arrival includes our signature <strong className="text-[#282828] font-semibold">Starter Kit</strong> with bath toiletries, paper goods, laundry and dishwasher detergent, and household cleaning supplies—saving you an errand run on your first night.
              </p>

              <p className="type-body text-[#5c5046]">
                Every residence is professionally cleaned and inspected prior to check-in, and optional mid-stay housekeeping, pantry provisioning, and 3D fleet vehicle rentals can be added directly to your cart.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e6dfd5]">
            <h3 className="type-h3 text-[#282828] mb-6 text-center sm:text-left">
              Standard Comfort, Hygiene &amp; Connectivity Inclusions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-3">
                {safetyAndComfortItemsCol1.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#e6f8f6] text-[#00897d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </span>
                    <span className="type-body text-[#3d352e] font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {safetyAndComfortItemsCol2.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#e6f8f6] text-[#00897d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </span>
                    <span className="type-body text-[#3d352e] font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Thoughtful arrival touches...
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-white border-t border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="type-h2 text-[#1d4f5d]">
                Thoughtful Arrival Touches
              </h2>

              <p className="type-body text-[#5c5046]">
                Waiting on the counter when you arrive is our custom Guest Guidebook highlighting favorite neighborhood cafes, parks along the American River Parkway, seasonal community events, and helpful local maps.
              </p>

              <p className="type-body text-[#5c5046]">
                Each stay also begins with a complimentary Welcome Basket of snacks and regional treats for you and your household.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="max-w-md w-full bg-[#faf8f5] rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-md">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_409481882-web.jpg"
                  alt="ETL Welcome Guidebook and Basket"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
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

      {/* =========================================================================
          SECTION 5: Flexible billing & personal support...
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-[#faf8f5] border-t border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-left lg:text-right mb-6 sm:mb-10">
            <h2 className="type-h2 text-[#1d4f5d]">
              Flexible Billing &amp; Personal Support
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="max-w-md w-full bg-[#f4efe9] rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-md">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/IMG_5654-web.jpg"
                  alt="Relax and Rejuvenate with Easy Travel Lodging"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(3);
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <p className="type-body text-[#5c5046]">
                We support individual bookings, family relocations, insurance housing adjusters, and corporate travel departments alike—offering online cart checkout, prepaid Lodging Unit packages, and verified Bank Wire, Direct ACH, or Zelle settlement.
              </p>

              <div className="p-6 bg-white rounded-xl border border-[#e6dfd5] shadow-2xs space-y-3">
                <h4 className="type-h4 text-[#282828]">
                  Direct Reservations &amp; Account Desk
                </h4>
                <div className="type-body space-y-2 text-[#5c5046]">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#00b7a8]" />
                    <span>Phone: <a href="tel:9168003295" className="font-semibold text-[#282828] hover:text-[#00b7a8] tabular-nums">916-800-3295</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#00b7a8]" />
                    <span>Email: <a href="mailto:easytravelagency@trustagent.space" className="font-semibold text-[#282828] hover:text-[#00b7a8]">easytravelagency@trustagent.space</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#00b7a8]" />
                    <span>Web: <span className="font-semibold text-[#282828]">EasyTravelLodging.com</span></span>
                  </div>
                </div>
              </div>

              <div className="type-body flex items-center gap-3 pt-2 text-[#82634f] font-medium">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                <span>A portion of proceeds from every stay supports charities serving children, veterans, and pets.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Guest Reviews
          ========================================================================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-t border-[#e6dfd5]">
        <LivePhotoBackground scene="courtyard" overlay="light" />
        <div className="relative z-10 max-w-6xl mx-auto bg-white/95 backdrop-blur-xs p-6 sm:p-12 rounded-2xl shadow-lg border border-[#e6dfd5]">
          <div className="mb-8 text-left">
            <h6 className="type-support font-semibold uppercase text-[#82634f] tracking-[0.14em] mb-2">
              Guest Feedback
            </h6>
            <h2 className="type-h2 text-[#282828]">
              Stories From Recent Stays
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {guestReviews.map((rev, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedReviewImage(rev.src)}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-[#e6dfd5]"
              >
                <img 
                  src={rev.src} 
                  alt={rev.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPropertyImage(idx);
                  }}
                />
                <div className="absolute inset-0 bg-[#282828]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="type-btn bg-white/95 text-[#282828] px-3.5 py-2 rounded-lg shadow-md">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6B: Los Angeles Luxury Vacation Rentals Collection
          (Imported & Rebranded from Stay A While -> Easy Travel Lodging)
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#faf8f5] border-t border-[#e6dfd5]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="type-support font-semibold uppercase tracking-[0.12em] text-[#00897d] block">
              Collection 2 · Los Angeles Luxury Vacation Rentals
            </span>
            <h2 className="type-h2 text-[#282828]">
              Los Angeles Luxury Estates &amp; Oceanfront Villas
            </h2>
            <p className="type-body-lg text-[#5c5046]">
              Curated under Easy Travel Lodging, explore luxury vacation villas, Bel-Air sanctuaries, Malibu oceanfront retreats, and Hollywood Hills panoramic estates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROPERTIES.filter((p) => p.id.startsWith('la-')).map((laProp) => (
              <div
                key={laProp.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e6dfd5] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-[#f4efe9]">
                    <img
                      src={laProp.images[0]}
                      alt={laProp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="type-support absolute top-3 left-3 bg-[#1d1714]/85 text-white font-semibold px-3 py-1 rounded-md backdrop-blur-xs">
                      {laProp.category}
                    </div>
                    <div className="type-support absolute bottom-3 right-3 bg-white/95 text-[#282828] font-bold px-3 py-1 rounded-lg shadow-md tabular-nums">
                      ${laProp.monthlyRate.toLocaleString()} / mo
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="type-h3 text-[#282828]">
                      {laProp.title}
                    </h3>
                    <p className="type-support font-semibold text-[#00897d]">
                      {laProp.location} · {laProp.bedrooms} Bedrooms · {laProp.bathrooms} Baths · {laProp.sqft}
                    </p>
                    <p className="type-body text-[#5c5046] line-clamp-3">
                      {laProp.shortDesc}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {laProp.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="type-support inline-flex items-center gap-1 font-medium text-[#3d352e] bg-[#f4efe9] px-2.5 py-1 rounded-md"
                        >
                          <Check className="w-3.5 h-3.5 text-[#00b7a8]" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between gap-4 border-t border-[#f4efe9] mt-4">
                  <span className="type-support text-[#857568] font-medium">
                    {laProp.pricingNote}
                  </span>
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="et_pb_button et_pb_button_teal type-btn py-2.5 px-4 shrink-0 cursor-pointer shadow-xs"
                  >
                    Inquire Villa Stay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: Live Realistic Photo Divider Banner (replaces #6a7d8c steel blue)
          ========================================================================= */}
      <section className="et_section_corporate_divider relative overflow-hidden py-20 sm:py-28 px-4 text-center text-white border-t border-[#3a2f28]">
        <LivePhotoBackground scene="river" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="type-h2 text-white">
            Planning a Relocation, Extended Stay, or Multi-Unit Booking?
          </h2>
          <p className="type-body-lg text-[#ede5dc] max-w-xl mx-auto">
            Reach out for custom date windows, multi-residence availability, direct insurance invoicing, or corporate billing arrangements.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="et_pb_button et_pb_button_teal type-btn cursor-pointer shadow-lg"
            >
              Inquire About Dates &amp; Rates
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Reviews */}
      {selectedReviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-[#1c1613]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#faf8f5] hover:bg-[#efe9e0] text-[#282828] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center">
              <img 
                src={selectedReviewImage} 
                alt="Review Preview" 
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
