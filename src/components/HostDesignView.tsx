import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Phone, 
  Mail, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const HostDesignView: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const [downloadEmail, setDownloadEmail] = useState('');

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadSubmitted(true);
  };

  return (
    <div className="w-full bg-white text-[#333333]">
      {/* =========================================================================
          SECTION 1: Hero Banner (Want To Be A Host? EASY TRAVEL LODGING)
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-[#00b7a8] inline-block">
            EASY TRAVEL LODGING
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            Want To Be A Host?
          </h1>
          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2 font-light">
            Welcome to <strong>Easy Travel Lodging Design Services</strong>, your expert Midterm Rental design team in Sacramento, California. Our team of experienced designers understands the unique challenges that come with Midterm Rental properties as well as Vacation Rental properties, and Airbnb.
          </p>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We provide luxurious, fully-furnished and equipped rental properties with excellent service for traveling professionals throughout the Sacramento region for stays of 30 days or more.
          </p>

          <div className="pt-6">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="et_pb_button et_pb_button_white group cursor-pointer shadow-md text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#00b7a8]" />
              <span>Click Here to Access Your FREE Download</span>
            </button>
            <p className="text-xs text-slate-400 mt-2 italic">
              Discover the Top 5 Interior Design Secrets that Make You Money Every Day with Your Midterm Rental
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Main Design Services Narrative & Case Study
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-slate-100 text-left">
        <div className="max-w-5xl mx-auto space-y-8 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p>
            We are here to help you maximize your property&apos;s potential. From functional layouts to stylish decor, we will work with you to create a space that not only meets your guests&apos; needs but also increases your occupancy rates and revenue.
          </p>

          <div className="p-6 sm:p-8 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-4">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-amber-950">
              Let&apos;s face it. The competition is stiff out there.
            </h2>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              For instance, did you know that <strong>14,000 new hosts</strong> joined the Airbnb platform each month in 2022? People look at the pictures of your property and within seconds, make up their minds whether to book with you.
            </p>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              We wanted to personally check out what was happening in a local zip code. We compared two Airbnb properties in the same zip code, just a mile from each other, with the same square footage. One property was getting <strong>over $100.00 more a night</strong> than the other comparable property. The difference? <strong>Style. Attention to detail.</strong>
            </p>
          </div>

          <p>
            Our specialized training and personal experience in the Vacation Rental industry sets us apart from other interior designers. We know what guests are looking for and how to make your property stand out in a crowded market. Plus, our local expertise means we understand the specific needs and trends of the Sacramento market, so we can tailor our design solutions to fit your property and attract more guests.
          </p>

          <p>
            As Midterm Rental experts, we understand the unique challenges that come with Vacation Rental properties. From tight budgets to limited space, we know how to make the most of your property&apos;s features to create a memorable guest experience. Whether you&apos;re looking for a complete renovation or just a few design tweaks, we&apos;ll work with you to make your Midterm Rental stand out from the crowd.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Time is Money
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-stone-50/70 border-b border-slate-200 text-left">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00b7a8]">
              Efficiency &amp; ROI
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 mt-1">
              Time is Money
            </h2>
          </div>

          <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed">
            <p>
              As real estate investors ourselves, we understand that time is money. That&apos;s why we prioritize speed and efficiency in our design process. Our <strong>streamlined approach</strong> allows us to complete projects quickly without sacrificing quality. Plus, our specialized training in the vacation rental industry means we know how to create spaces that not only look good but also meet the needs of your guests.
            </p>

            <p>
              If you&apos;re a property manager, we understand the pressure to keep your clients happy. That&apos;s why we focus on creating designs that not only appeal to guests but also meet the needs of property owners. Our goal is to help you maintain a loyal guest base and increase occupancy rates, all while making your job easier.
            </p>

            <p>
              At <strong>Easy Travel Lodging</strong>, we pride ourselves on being industry experts. We know what guests are looking for and how to <strong>make your property stand out</strong> in a crowded market. Plus, our <strong>local expertise</strong> means we understand the specific needs and trends of the Sacramento market, so we can tailor our design solutions to fit your property and attract more guests.
            </p>
          </div>

          {/* Callout box: Is Midterm Rental business in your future? */}
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-heading font-extrabold text-2xl text-[#00b7a8]">
              Is Midterm Rental business in your future? Have you thought about it?
            </h3>
            <p className="text-slate-800 font-bold text-lg">
              It&apos;s not Airbnb!
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Look to see about all the possibilities of a Midterm Rental business in your area. Don&apos;t let a poorly designed Midterm Rental hold you back. Contact us today to schedule your consultation and take your vacation rental to the next level.
            </p>
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-teal-950 text-xs sm:text-sm italic leading-relaxed">
              <strong>P.S. Wait! Don’t live in Sacramento, California?</strong> We’ve got you covered! Easy Travel Lodging Design Team specializes in remote services so that with the use of technology, we can design and/or refresh your Midterm Rental to meet your needs and exceed your guests’ expectations! Get those rave reviews! Be that Super Host! Get that 5 Star Review…and Keep It, Too!!!
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Why Choose Easy Travel Lodging Design Team?
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-slate-200 text-left">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
              Why Choose Easy Travel Lodging Design Team?
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              Three core principles that make your midterm property a high-earning flagship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Customized Design Solutions
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We understand that every property is unique, and we tailor our design solutions to meet your specific needs. Whether you need help with interior design, furniture selection, decor, or all of the above, we can create a customized design plan that fits your style, budget, and target audience.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Increased Bookings and Revenue
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our design expertise is not just about making your property look beautiful; it&apos;s also about maximizing its earning potential. We know how to create spaces that are functional and optimized for guest comfort. A well-designed property attracts more bookings, commands higher rates, and generates more positive reviews.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b7a8]/10 text-[#00b7a8] flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Hassle-Free Process
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We understand that as a host, your time is valuable. That&apos;s why we strive to make our design service process as seamless and hassle-free as possible. From the initial consultation to the final installation, we take care of all the details, so you can focus on running your business.
              </p>
            </div>
          </div>

          <div className="text-center pt-4 space-y-4">
            <h3 className="font-heading font-bold text-2xl text-slate-900">
              Call today to get things going! It’s time to take things to the next level. Let your Mid-Term Rental be a show-stopper!!!
            </h3>

            <a
              href="https://app.acuityscheduling.com/schedule.php?owner=19330770&appointmentType=13695494"
              target="_blank"
              rel="noopener noreferrer"
              className="et_pb_button et_pb_button_teal inline-flex items-center gap-2 cursor-pointer shadow-lg text-sm sm:text-base font-bold uppercase tracking-wider py-4 px-8"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Your FREE Vacation Rental Design Discovery Call</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Testimonial by Al Williamson
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-stone-900 text-white border-b border-stone-800 text-left">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Al Williamson Portrait */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="rounded-2xl overflow-hidden border-2 border-[#00b7a8] shadow-2xl max-w-xs w-full bg-slate-800">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/04/Al.png"
                  alt="Al Williamson - Leading Landlord & Business Owner"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs font-bold uppercase tracking-[4px] text-[#00b7a8]">
                Reviews &amp; Client Testimonial
              </span>

              <blockquote className="text-slate-200 text-base sm:text-xl font-light italic leading-relaxed">
                &ldquo;I wanted a flagship for my corporate housing business. It needed to be a show stopper – but I am good with numbers, not design. So, I retained Marlena.
              </blockquote>

              <blockquote className="text-slate-200 text-base sm:text-xl font-light italic leading-relaxed">
                We emailed photos back and forth, discussed how guests would use the space, and created something that exceeded my expectation. There’s no way I could have picked the artwork, fabrics, and patterns that blend so nicely. There’s no way I could have been so clever.
              </blockquote>

              <blockquote className="text-slate-200 text-base sm:text-xl font-light italic leading-relaxed">
                I’m looking forward to working with Marlena on other projects. She truly can turn a Timex into a Rolex.&rdquo;
              </blockquote>

              <div className="pt-2 border-t border-slate-800">
                <div className="font-heading font-bold text-white text-lg sm:text-xl">
                  Al Williamson
                </div>
                <div className="text-xs text-[#00b7a8] uppercase tracking-wider font-semibold">
                  Leading Landlord, Business Owner • Sacramento, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Download Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
            <button
              onClick={() => {
                setDownloadModalOpen(false);
                setDownloadSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-heading font-black text-slate-900 mb-1">
              Download Free Design Secrets Guide
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Discover the Top 5 Interior Design Secrets that Make You Money Every Day with Your Midterm Rental
            </p>

            {downloadSubmitted ? (
              <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="font-heading font-bold text-teal-900 text-base">Guide Sent!</h4>
                <p className="text-xs text-teal-700">
                  Thank you, {downloadName}. Check <strong>{downloadEmail}</strong> for your direct download link.
                </p>
                <button
                  onClick={() => {
                    setDownloadModalOpen(false);
                    setDownloadSubmitted(false);
                  }}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#00b7a8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#00b7a8] outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDownloadModalOpen(false)}
                    className="w-1/2 py-3 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#00b7a8] hover:bg-[#358385] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
                  >
                    Access Download
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
