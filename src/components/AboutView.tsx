import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/lodgingData';
import { 
  Heart, 
  Award, 
  Plane, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Mail,
  Phone,
  X
} from 'lucide-react';

interface AboutViewProps {
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenBooking }) => {
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  const guestReviews = [
    {
      name: 'Stacy S.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Stacy-S.png',
      alt: 'Stacy S. Guest Review for Easy Travel Lodging'
    },
    {
      name: 'Jayda F.',
      src: 'https://easytravellodging.com/wp-content/uploads/2023/06/Jayda-F.-.png',
      alt: 'Jayda F. Guest Review for Easy Travel Lodging'
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
          SECTION 1: Hero Banner (About Us - Hello from Easy Travel Lodging!)
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-[#00b7a8] inline-block">
            Hello from Easy Travel Lodging!
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            About Us
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2">
            We are a corporate housing company designed to serve traveling professionals who will be in the Sacramento area for <strong>30 days or more</strong>.
          </p>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Bill and Marlena have been married for <strong>38 years</strong> and are &ldquo;officially&rdquo; retired from their W-2 jobs. They love to spend their time with friends and family and be outdoors. They love kayaking, hiking, traveling, and fun adventures.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Host Bill Section
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Image Col (Left) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="et_curve_left max-w-md w-full bg-stone-100 shadow-lg overflow-hidden border border-slate-200">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-airplanehangersign.jpg"
                  alt="Bill Wheelock - Easy Travel Lodging Host"
                  className="w-full h-80 sm:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text Col (Right) */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#00b7a8]">
                Your Host
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
                Bill
              </h2>
              <div className="space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed pt-2">
                <p>
                  Bill’s career in <strong>Information Systems Management</strong> had him busy traveling around the United States where he headed up teams of people who installed computer systems in a variety of industries.
                </p>
                <p>
                  As a <strong>Private Pilot for over 40 years</strong>, a Radio Voiceover artist, and a <strong>Navy Veteran serving in Vietnam</strong>, he is also a graduate of the University of San Francisco with an MBA from the University of Phoenix.
                </p>
                <p>
                  He has been able to utilize all these skills and life experiences to really champion the things that are important to him.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ U.S. Navy Veteran</span>
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ 40+ Year Pilot</span>
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ MBA Graduate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Host Marlena Section
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-stone-50/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Text Col (Left) */}
            <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#00b7a8]">
                Your Host
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
                Marlena
              </h2>
              <div className="space-y-3 text-slate-700 text-base sm:text-lg leading-relaxed pt-2">
                <p>
                  Marlena spent her entire career in <strong>Education</strong>. Starting off as an Elementary School Teacher and working extensively in diverse settings her career culminated in getting her <strong>Doctorate degree in Educational Leadership</strong>.
                </p>
                <p>
                  She retired as an <strong>Educational Consultant for the California Department of Education</strong> and is noted for the many local, national, and international awards for her work for kids and families.
                </p>
                <p>
                  Marlena’s after-retirement journey took her to become a Real Estate Investor, Realtor, Certified Home Stager, and a published author with several award-winning books.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ Ed.D. Educational Leadership</span>
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ 1996 Olympic Torchbearer</span>
                <span className="px-3 py-1 bg-slate-100 rounded-md border border-slate-200">✓ Published Author</span>
              </div>
            </div>

            {/* Image Col (Right) */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="et_curve_right max-w-md w-full bg-stone-100 shadow-lg overflow-hidden border border-slate-200">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/01/Bill-Marlena-dressedup.jpg"
                  alt="Dr. Marlena Uhrik - Easy Travel Lodging Host"
                  className="w-full h-80 sm:h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Bill & Marlena Joint Mission & Philanthropy
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Joint Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-w-md w-full">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/11/Marlena-Bill-Plane.jpg"
                  alt="Bill and Marlena Wheelock with Airplane"
                  className="w-full h-80 sm:h-[380px] object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Joint Narrative */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
                Bill &amp; Marlena
              </h2>

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Both Bill and Marlena know what it is like to be traveling professionals. It is what they did throughout their careers. While the travel aspect might seem like fun---especially in the beginning---there are stressors and limitations when, at the end of the day, all you have is an empty hotel room to stay in.
              </p>

              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                People have asked, &ldquo;Why are you doing Easy Travel Lodging at our age?&rdquo; Both Bill and Marlena say they have found fulfillment in serving others even throughout their careers. Easy Travel Lodging serves as a vehicle for providing great service to others and at the same time supporting the things that are important to them.
              </p>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-sm sm:text-base font-semibold flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 shrink-0" />
                <span>
                  A portion of their proceeds from Easy Travel Lodging goes to their favorite causes: <strong>kids, vets, and pets</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Inspirational Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
              <p className="text-slate-800 text-sm sm:text-base italic font-medium leading-relaxed">
                &ldquo;We are so excited about providing an awesome experience for our guests. We really wanted Easy Travel Lodging to be the flagship for short-term rentals.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
              <p className="text-slate-800 text-sm sm:text-base italic font-medium leading-relaxed">
                &ldquo;We wanted to be distinct and have people remember us as providing exceptional service with amazing accommodations.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
              <p className="text-slate-800 text-sm sm:text-base italic font-medium leading-relaxed">
                &ldquo;It has been a pleasure to watch our company grow and serve so many people. We love meeting people from around the world and having a chance to learn from others.&rdquo;
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-left">
              <p className="text-slate-800 text-sm sm:text-base italic font-medium leading-relaxed">
                &ldquo;We are thrilled when people say, &lsquo;This was the BEST ever&rsquo; or &lsquo;I can&rsquo;t say enough about how awesome Bill and Marlena were!&rsquo;&rdquo;
              </p>
            </div>
          </div>

          {/* Closing Invitation */}
          <div className="text-center p-8 bg-teal-50 rounded-2xl border border-teal-200 space-y-3">
            <h3 className="font-heading font-black text-2xl text-teal-950">
              We love what we are doing. Come be a part of it!
            </h3>
            <p className="text-teal-800 text-base max-w-xl mx-auto">
              Share in the peace and tranquility in your home away from home in Rancho Cordova and Sacramento.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="et_pb_button et_pb_button_teal cursor-pointer shadow-md text-sm font-bold uppercase tracking-wider"
              >
                Book Your Stay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Guest Reviews Section (Parallax Background)
          ========================================================================= */}
      <section className="et_section_corporate_reviews py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xs p-6 sm:p-12 rounded-2xl shadow-xl border border-white/60 text-left">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-[4px] text-slate-800 block mb-1">
              Reviews
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-950">
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
