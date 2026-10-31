import React, { useState } from 'react';
import { 
  Check, 
  Mail, 
  Phone, 
  Download, 
  Calendar, 
  ExternalLink, 
  X,
  Heart,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

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
    'Hotel quality queen-size mattress',
    'Vinyl-free bed bug liner for the mattress',
    'Mattress protector washed for each new guest',
    '2 sets of sheets/pillows with pillowcases and protectors---400-600 thread count',
    '2 sets of white towels for each guest'
  ];

  const safetyAndComfortItemsCol2 = [
    'Hotel quality duvet and duvet insert',
    '2 Smart TVs---a 43-inch TV in the bedroom(s) and a 55-inch in the living/family room',
    'Electronic key system',
    'Convenient parking',
    'And so much more!'
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
          SECTION 0: Hero Section (et_pb_section_0)
          ========================================================================= */}
      <section className="et_section_corporate_hero et_pb_section et_pb_with_background pt-16 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h5 className="font-heading font-bold uppercase text-xs sm:text-sm tracking-[5px] text-slate-900 mb-2 sm:mb-3">
              Corporate Housing for
            </h5>
            <h1 className="font-alt-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#00b7a8] tracking-tight leading-tight mb-8 drop-shadow-xs">
              Traveling Professionals
            </h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenBrochure}
                className="et_pb_button et_pb_button_white group cursor-pointer shadow-sm text-sm sm:text-base font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-700 group-hover:text-[#00b7a8] transition-colors" />
                <span>Download Our Brochure</span>
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_teal cursor-pointer shadow-md text-sm sm:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>CONTACT US FOR MORE INFORMATION</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: Lead Intro Section (et_pb_section_1)
          ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 leading-relaxed">
            Providing luxurious, fully-furnished, and equipped properties with excellent service for traveling professionals throughout the Sacramento region for stays of 30 days or more.
          </p>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Welcome to <strong className="text-slate-900 font-bold">Easy Travel Lodging (ETL)</strong>. Our commitment to you is to provide excellent service with superior accommodations. We go &ldquo;over and above&rdquo; because by staying with us, we want you to feel safe, comfortable, and appreciated. We want your experience to be so special that you want to tell your friends all about it!
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: How do we do that? (et_pb_section_2)
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
                How do we do that?
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                You will discover that each location has been personally vetted by the Easy Travel Lodging staff. Each living space is hand chosen based on our high standards for quality, safety, location, and easy access to the freeways and local venues.
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                We start off by planning each living space with guidance from our team of design experts. You will feel like you have walked into a space that has been specially created just for you---because it has! No two accommodations are alike. We want your &ldquo;new home&rdquo; to feel like your home away from home that includes a wonderful easy living feeling with a touch of elegance.
              </p>
            </div>

            {/* Right Column: Signature Divi Left-Curved Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="et_curve_left max-w-md w-full bg-stone-100">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_499595186-web.jpg"
                  alt="Vetted Corporate Housing by Easy Travel Lodging"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: What we provide... (et_pb_section_3)
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-stone-50/70 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Script heading */}
          <div className="text-left lg:text-right mb-6 sm:mb-10">
            <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
              What we provide...
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
            {/* Left Column: Signature Divi Right-Curved Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="et_curve_right max-w-md w-full bg-stone-100">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_59543525-web.jpg"
                  alt="Fully Furnished Corporate Lodging Amenities"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Not only will you have a beautifully furnished space, but you will also have the basic equipment and supplies you will need for your stay---everything from paper clips to paper towels! We like to go over and above &ldquo;the basics.&rdquo; (A full list is available upon request at:{' '}
                <a 
                  href="mailto:contact@easytravellodging.com" 
                  className="text-[#00b7a8] font-semibold hover:underline"
                >
                  contact@easytravellodging.com
                </a>)
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                You will also receive a &ldquo;Starter Kit&rdquo; that includes some of the necessities of life---everything from toiletries to laundry /kitchen, and basic office supplies---and plenty of hangers!
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Just so you know, every ETL living space is professionally cleaned before your arrival and after your departure.
              </p>
            </div>
          </div>

          {/* Safety & Comfort List */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-slate-900 font-bold text-lg sm:text-xl mb-6 text-center sm:text-left">
              We also provide the following for your safety and comfort:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Column 1 */}
              <div className="space-y-3">
                {safetyAndComfortItemsCol1.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="text-slate-700 text-sm sm:text-base font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                {safetyAndComfortItemsCol2.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="text-slate-700 text-sm sm:text-base font-medium leading-snug">
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
          SECTION 4: It's the little things that count... (et_pb_section_4)
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
                It&apos;s the little things that count...
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Waiting for you when you arrive, you will find your ETL Welcome Guidebook designed to showcase things that are local favorites, such as restaurants, breweries, and parks, along with maps, activities in the area, and coupons from our local businesses here in the area.
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                You will also receive an ETL Welcome Basket filled with local goodies and edible treats.
              </p>
            </div>

            {/* Right Column: Signature Divi Left-Curved Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="et_curve_left max-w-md w-full bg-stone-100">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/AdobeStock_409481882-web.jpg"
                  alt="ETL Welcome Guidebook and Basket"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: And in the end... (et_pb_section_5)
          ========================================================================= */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-stone-50/70 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Script heading */}
          <div className="text-left lg:text-right mb-6 sm:mb-10">
            <h2 className="font-script text-4xl sm:text-5xl text-[#00b7a8] font-bold">
              And in the end...
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Signature Divi Right-Curved Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="et_curve_right max-w-md w-full bg-stone-100">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/IMG_5654-web.jpg"
                  alt="Relax and Rejuvenate with Easy Travel Lodging"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Text & Contact */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Our goal is to make things as EASY as possible for you. As a Traveling Professional, you can completely relax, rejuvenate, and enjoy your accommodations selected and designed by <strong className="text-slate-900 font-bold">Easy Travel Lodging</strong>.
              </p>

              <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="font-heading font-bold text-slate-900 text-base uppercase tracking-wider">
                  For more information:
                </h4>
                <div className="space-y-2 text-sm sm:text-base text-slate-700">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#00b7a8]" />
                    <span>Call: <a href="tel:9168003295" className="font-bold text-slate-900 hover:text-[#00b7a8]">916-800-3295</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#00b7a8]" />
                    <span>E-mail: <a href="mailto:Contact@EasyTravellodging.com" className="font-semibold text-slate-900 hover:text-[#00b7a8]">Contact@EasyTravellodging.com</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-[#00b7a8]" />
                    <span>Website: <span className="font-semibold text-slate-900">Easy Travel lodging.com</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 text-[#82634f] font-semibold text-sm sm:text-base italic">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
                <span>A portion of our proceeds will be donated to our favorite causes: Kids, Vets, and Pets.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Guest Reviews Parallax (et_pb_section_6)
          ========================================================================= */}
      <section className="et_section_corporate_reviews py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xs p-6 sm:p-12 rounded-2xl shadow-xl border border-white/60">
          <div className="mb-8 text-left">
            <h6 className="font-heading font-bold uppercase text-slate-800 tracking-[5px] text-xs sm:text-sm mb-2">
              Reviews
            </h6>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-slate-950">
              Guest Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {guestReviews.map((rev, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedReviewImage(rev.src)}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-stone-200"
              >
                <img 
                  src={rev.src} 
                  alt={rev.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: Scenic Divider Banner (et_pb_section_7)
          ========================================================================= */}
      <section className="et_section_corporate_divider py-20 sm:py-28 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-heading font-bold text-2xl sm:text-4xl drop-shadow-md">
            Ready to Experience the ETL Standard?
          </h2>
          <p className="text-white/90 text-sm sm:text-lg max-w-xl mx-auto font-light">
            Contact us today for midterm corporate rates, customized lease agreements, and direct insurance billing.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="et_pb_button et_pb_button_teal cursor-pointer shadow-lg text-sm sm:text-base font-bold uppercase tracking-wider"
            >
              Book Corporate Stays
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: Pre-Footer Bar (et_pb_section_9)
          ========================================================================= */}
      <section className="bg-[#282828] text-white py-8 px-4 sm:px-8 border-t border-stone-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center text-center sm:text-left">
            {/* Column 1: Contact Blurps */}
            <div className="space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-200">
                <Mail className="w-4 h-4 text-[#00b7a8] shrink-0" />
                <a href="mailto:Contact@EasyTravelLodging.com" className="hover:text-[#00b7a8] transition-colors break-all">
                  Contact@EasyTravelLodging.com
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-200">
                <Phone className="w-4 h-4 text-[#00b7a8] shrink-0" />
                <a href="tel:9168003295" className="hover:text-[#00b7a8] transition-colors font-bold">
                  916-800-3295
                </a>
              </div>
            </div>

            {/* Column 2: BBB & Chamber Badges */}
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
                />
              </a>
              <img 
                src="https://easytravellodging.com/wp-content/uploads/2022/12/RANCHO-CORDOVA-PROUD-MEMBER-BADGE.jpg" 
                alt="Rancho Cordova Proud Member Badge" 
                className="h-10 sm:h-12 w-auto rounded-xs shadow-xs"
              />
            </div>

            {/* Column 3: Discovery Call Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onOpenDiscoveryCall || onOpenBooking}
                className="et_pb_button text-xs sm:text-sm font-bold bg-[#82634f] hover:bg-[#6e5341] text-white px-4 py-3 rounded-none text-center shadow-md transition-all cursor-pointer"
              >
                Book Your FREE Vacation Rental Design Discovery Call
              </button>
            </div>

            {/* Column 4: 19 Badge */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="https://easytravellodging.com/wp-content/uploads/2023/04/19.png" 
                alt="19 Badge" 
                className="h-14 sm:h-16 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Reviews */}
      {selectedReviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center">
              <img 
                src={selectedReviewImage} 
                alt="Review Preview" 
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
