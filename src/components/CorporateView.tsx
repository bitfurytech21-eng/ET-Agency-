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
import { getFallbackPropertyImage } from '../data/lodgingData';
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
            <h5 className="font-heading font-bold uppercase text-xs sm:text-sm tracking-[5px] text-[#82634f] mb-2 sm:mb-3">
              Extended Stays, Relocations &amp; Group Housing
            </h5>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#00b7a8] tracking-tight leading-tight mb-4">
              Turnkey Furnished Living in Greater Sacramento
            </h1>
            <p className="text-[#282828] text-base sm:text-lg max-w-2xl leading-relaxed mb-8 font-medium">
              Tailored for families between homes, homeowner insurance claims, medical and university stays, corporate relocations, and organizations coordinating multi-week or multi-month accommodations.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenBrochure}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-sm text-sm sm:text-base font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#82634f] group-hover:text-[#00b7a8] transition-colors" />
                <span>Download Residence Overview</span>
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_teal cursor-pointer shadow-md text-sm sm:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2"
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
          <p className="text-xl sm:text-2xl font-semibold text-[#282828] leading-relaxed">
            Move-in-ready residences with transparent rates, consolidated invoicing, and attentive local care—available for 5+ night short stays and tax-exempt 30+ day extended leases.
          </p>

          <p className="text-base sm:text-lg text-[#5c5046] leading-relaxed">
            Welcome to <strong className="text-[#282828] font-bold">Easy Travel Lodging (ETL)</strong>. Whether you are coordinating housing for a relocating family, arranging temporary living during a home renovation, visiting UC Davis Health or regional medical centers, or managing employee travel, our goal is simple: to make every guest feel safe, comfortable, and genuinely cared for from arrival through departure.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: How we prepare every residence
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-white border-t border-[#efe9e0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
                How we prepare every residence
              </h2>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                Every apartment in our Rancho Cordova and Greater Sacramento collection is personally selected and inspected by our local team. We choose quiet residential communities with reliable parking, green outdoor spaces, and quick access to Highway 50, Folsom, and downtown Sacramento.
              </p>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
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
            <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
              What is waiting inside...
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
              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                Beyond full furniture and kitchenware, we stock the everyday household items guests actually use—from cookware, coffee makers, and storage wraps to desk supplies and plenty of closet hangers. For a complete inventory sheet, reach us anytime at{' '}
                <a 
                  href="mailto:Contact@EasyTravelLodging.com" 
                  className="text-[#00b7a8] font-semibold hover:underline"
                >
                  Contact@EasyTravelLodging.com
                </a>.
              </p>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                Every arrival includes our signature <strong className="text-[#282828]">Starter Kit</strong> with bath toiletries, paper goods, laundry and dishwasher detergent, and household cleaning supplies—saving you an errand run on your first night.
              </p>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                Every residence is professionally cleaned and inspected prior to check-in, and optional mid-stay housekeeping, pantry provisioning, and 3D fleet vehicle rentals can be added directly to your cart.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e6dfd5]">
            <h3 className="text-[#282828] font-bold text-lg sm:text-xl mb-6 text-center sm:text-left">
              Standard Comfort, Hygiene &amp; Connectivity Inclusions:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-3">
                {safetyAndComfortItemsCol1.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#e6f8f6] text-[#00897d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="text-[#3d352e] text-sm sm:text-base font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {safetyAndComfortItemsCol2.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#e6f8f6] text-[#00897d] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="text-[#3d352e] text-sm sm:text-base font-medium leading-snug">
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
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
                Thoughtful arrival touches...
              </h2>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                Waiting on the counter when you arrive is our custom Guest Guidebook highlighting favorite neighborhood cafes, parks along the American River Parkway, seasonal community events, and helpful local maps.
              </p>

              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
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
            <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
              Flexible billing &amp; personal support...
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
              <p className="text-[#5c5046] text-base sm:text-lg leading-relaxed">
                We support individual bookings, family relocations, insurance housing adjusters, and corporate travel departments alike—offering online cart checkout, prepaid Lodging Unit packages, and verified Bank Wire, Direct ACH, or Zelle settlement.
              </p>

              <div className="p-6 bg-white rounded-xl border border-[#e6dfd5] shadow-2xs space-y-3">
                <h4 className="font-heading font-bold text-[#282828] text-base uppercase tracking-wider">
                  Direct Reservations &amp; Account Desk:
                </h4>
                <div className="space-y-2 text-sm sm:text-base text-[#5c5046]">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#00b7a8]" />
                    <span>Phone: <a href="tel:9168003295" className="font-bold text-[#282828] hover:text-[#00b7a8]">916-800-3295</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#00b7a8]" />
                    <span>Email: <a href="mailto:Contact@EasyTravelLodging.com" className="font-semibold text-[#282828] hover:text-[#00b7a8]">Contact@EasyTravelLodging.com</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#00b7a8]" />
                    <span>Web: <span className="font-semibold text-[#282828]">EasyTravelLodging.com</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 text-[#82634f] font-semibold text-sm sm:text-base italic">
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
            <h6 className="font-heading font-bold uppercase text-[#82634f] tracking-[5px] text-xs sm:text-sm mb-2">
              Guest Feedback
            </h6>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#282828]">
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
                  <span className="bg-white/95 text-[#282828] px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                    Click to Enlarge
                  </span>
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
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white">
            Planning a Relocation, Extended Stay, or Multi-Unit Booking?
          </h2>
          <p className="text-[#ede5dc] text-sm sm:text-lg max-w-xl mx-auto">
            Reach out for custom date windows, multi-residence availability, direct insurance invoicing, or corporate billing arrangements.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="et_pb_button et_pb_button_teal cursor-pointer shadow-lg text-sm sm:text-base font-bold uppercase tracking-wider"
            >
              Inquire About Dates &amp; Rates
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: Pre-Footer Bar
          ========================================================================= */}
      <section className="bg-[#282828] text-white py-8 px-4 sm:px-8 border-t border-[#3a322c]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center text-center sm:text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-[#e6dfd5]">
                <Mail className="w-4 h-4 text-[#00b7a8] shrink-0" />
                <a href="mailto:Contact@EasyTravelLodging.com" className="hover:text-[#00b7a8] transition-colors break-all">
                  Contact@EasyTravelLodging.com
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-[#e6dfd5]">
                <Phone className="w-4 h-4 text-[#00b7a8] shrink-0" />
                <a href="tel:9168003295" className="hover:text-[#00b7a8] transition-colors font-bold">
                  916-800-3295
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a 
                href="https://www.bbb.org/us/ca/sacramento/profile/boarding-house/easy-travel-lodging-1156-90076707/#sealclick" 
                target="_blank" 
                rel="noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img 
                  src="https://seal-necal.bbb.org/seals/blue-seal-120-61-bbb-90076707.png" 
                  alt="Easy Travel Lodging BBB Business Review"
                  className="h-10 sm:h-12 w-auto bg-white rounded-xs p-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
              <img 
                src="https://easytravellodging.com/wp-content/uploads/2022/12/RANCHO-CORDOVA-PROUD-MEMBER-BADGE.jpg" 
                alt="Rancho Cordova Proud Member Badge" 
                className="h-10 sm:h-12 w-auto rounded-xs shadow-xs"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={onOpenDiscoveryCall || onOpenBooking}
                className="et_pb_button text-xs sm:text-sm font-bold bg-[#82634f] hover:bg-[#6e5341] text-white px-4 py-3 rounded-none text-center shadow-md transition-all cursor-pointer"
              >
                Schedule a Complimentary Rental Design Call
              </button>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img 
                src="https://easytravellodging.com/wp-content/uploads/2023/04/19.png" 
                alt="19 Badge" 
                className="h-14 sm:h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
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
