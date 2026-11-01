import React, { useState } from 'react';
import { HOST_DESIGN_SECRETS, getFallbackPropertyImage } from '../data/lodgingData';
import { 
  Download, 
  Calendar, 
  CheckCircle2, 
  X,
  ExternalLink,
  Printer
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

export const HostDesignView: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const [downloadEmail, setDownloadEmail] = useState('');

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'host_design',
          name: downloadName,
          email: downloadEmail,
          message: 'Unlocked Top 5 Midterm Rental Interior Design Secrets Guide',
        }),
      });
    } catch {
      // Unlock guide immediately
    }
    setDownloadSubmitted(true);
  };

  return (
    <div className="w-full bg-white text-[#333333]">
      {/* =========================================================================
          SECTION 1: Live Realistic Interior Photo Hero Banner
          ========================================================================= */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 px-4 sm:px-8 border-b border-[#3a2f28] text-center">
        <LivePhotoBackground scene="interior" secondaryScene="courtyard" overlay="espresso" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-[#4de0d2] inline-block">
            Easy Travel Lodging Design Studio
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            Interior Design &amp; Staging for Rental Hosts
          </h1>
          <p className="text-[#f2ebe2] text-base sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2">
            Partner with <strong>Easy Travel Lodging Design Services</strong> to turn furnished apartments, vacation homes, and extended-stay rentals into high-occupancy, guest-ready residences—in Northern California or remotely nationwide.
          </p>
          <p className="text-[#dfd3c5] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Led by Certified Home Stager Dr. Marlena Uhrik, our studio blends durable hospitality furnishings, smart spatial planning, and listing-ready styling that stands out immediately in search results.
          </p>

          <div className="pt-6">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="et_pb_button et_pb_button_white group cursor-pointer shadow-md text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#00b7a8]" />
              <span>Download the Complimentary Host Design Guide</span>
            </button>
            <p className="text-xs text-[#dfd3c5] mt-2 italic">
              Five practical interior design strategies that elevate nightly and monthly occupancy
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Main Design Services Narrative & Case Study
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-[#efe9e0] text-left">
        <div className="max-w-5xl mx-auto space-y-8 text-[#5c5046] text-base sm:text-lg leading-relaxed">
          <p>
            From floor-plan flow and durable furniture sourcing to lighting, linens, and finishing artwork, we collaborate with property owners and managers to create spaces that photograph beautifully, hold up between turnovers, and earn consistent five-star reviews.
          </p>

          <div className="p-6 sm:p-8 bg-[#faf3e9] rounded-2xl border border-[#e3d2bc] space-y-4">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-[#3d2e24]">
              First impressions drive booking decisions in seconds.
            </h2>
            <p className="text-[#4a3e35] text-sm sm:text-base leading-relaxed">
              With thousands of new short-term and extended-stay listings entering the market each year, prospective guests compare photos side by side before reading a single paragraph of description.
            </p>
            <p className="text-[#4a3e35] text-sm sm:text-base leading-relaxed">
              In a local market comparison of two properties in the same zip code—just a mile apart with identical square footage—one residence commanded <strong>over $100 more per night</strong> than its neighbor. The difference came down to cohesive interior styling, lighting, and functional layout.
            </p>
          </div>

          <p>
            Because we actively own and operate furnished residences ourselves, our recommendations go far beyond surface aesthetics. We select washable performance textiles, ergonomic workspaces, practical kitchen layouts, and bedroom details that serve families, relocating households, vacationers, and extended-stay guests alike.
          </p>

          <p>
            Whether you are furnishing an empty condo from scratch, refreshing an underperforming vacation rental, or preparing a multi-unit portfolio, we tailor every scope of work to your budget and timeline.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Turnkey Execution & Return on Investment
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-[#faf8f5] border-b border-[#e6dfd5] text-left">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00b7a8]">
              Turnkey Execution &amp; Return on Investment
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#282828] mt-1">
              Efficient Turnarounds Without Compromising Quality
            </h2>
          </div>

          <div className="space-y-5 text-[#5c5046] text-base sm:text-lg leading-relaxed">
            <p>
              As property investors ourselves, we know every vacant week carries a real carrying cost. Our structured procurement and installation workflow gets your listing furnished, staged, and ready to photograph on schedule.
            </p>

            <p>
              For property managers overseeing multiple owners, we create repeatable, low-maintenance design standards that simplify housekeeping, reduce replacement expenses, and encourage repeat guest bookings.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#e6dfd5] shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-2xl text-[#00b7a8]">
              Launching or Refreshing a Furnished Rental?
            </h3>
            <p className="text-[#5c5046] text-base leading-relaxed">
              Explore what thoughtful positioning can do for your short-stay, vacation, or extended-stay property. Schedule a complimentary discovery call to discuss your floor plan, target guest profile, and revenue goals.
            </p>
            <div className="p-4 bg-[#e8f8f6] rounded-xl border border-[#b8ebe5] text-[#005951] text-xs sm:text-sm leading-relaxed">
              <strong>Property Owner Support:</strong> Our comprehensive design and staging packages deliver room-by-room mood boards, clickable procurement lists, floor-plan placement guides, and video walk-through coaching anywhere in California’s homes.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Why Owners Work With Our Design Studio
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-[#e6dfd5] text-left">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#282828]">
              Why Owners Work With Our Design Studio
            </h2>
            <p className="text-[#6e5f53] text-base max-w-2xl mx-auto">
              Three practical principles that turn an ordinary rental into a sought-after residence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="text-sm font-bold text-[#00b7a8] tabular-nums">
                01. Tailored Scope
              </div>
              <h3 className="font-heading font-bold text-xl text-[#282828]">
                Custom Design Plans
              </h3>
              <p className="text-[#5c5046] text-sm leading-relaxed">
                Every property and neighborhood is different. Whether you need full turnkey furnishing, room-by-room styling, or targeted upgrades, we align every selection with your architecture and budget.
              </p>
            </div>

            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="text-sm font-bold text-[#00b7a8] tabular-nums">
                02. Commercial Performance
              </div>
              <h3 className="font-heading font-bold text-xl text-[#282828]">
                Stronger Rates &amp; Reviews
              </h3>
              <p className="text-[#5c5046] text-sm leading-relaxed">
                We balance visual warmth with real-world durability—pairing inviting living areas and restful bedrooms with practical amenities that earn stronger nightly and monthly rates.
              </p>
            </div>

            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="text-sm font-bold text-[#00b7a8] tabular-nums">
                03. Streamlined Delivery
              </div>
              <h3 className="font-heading font-bold text-xl text-[#282828]">
                End-to-End Coordination
              </h3>
              <p className="text-[#5c5046] text-sm leading-relaxed">
                From initial concept boards and furniture ordering to final accessory placement, we manage the details clearly so you can focus on welcoming guests.
              </p>
            </div>
          </div>

          <div className="text-center pt-4 space-y-4">
            <h3 className="font-heading font-bold text-2xl text-[#282828]">
              Ready to elevate your rental property? Let’s plan your project together.
            </h3>

            <a
              href="https://app.acuityscheduling.com/schedule.php?owner=19330770&appointmentType=13695494"
              target="_blank"
              rel="noopener noreferrer"
              className="et_pb_button et_pb_button_teal inline-flex items-center gap-2 cursor-pointer shadow-lg text-sm sm:text-base font-bold uppercase tracking-wider py-4 px-8"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Your Complimentary Design Discovery Call</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Testimonial by Al Williamson (Live Realistic Twilight Backdrop)
          ========================================================================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 text-white border-b border-[#3a2f28] text-left">
        <LivePhotoBackground scene="twilight" overlay="dark" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="rounded-2xl overflow-hidden border-2 border-[#00b7a8] shadow-2xl max-w-xs w-full bg-[#241d18]">
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2023/04/Al.png"
                  alt="Al Williamson - Leading Landlord & Business Owner"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackPropertyImage(3);
                  }}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs font-bold uppercase tracking-[4px] text-[#4de0d2]">
                Reviews &amp; Client Testimonial
              </span>

              <blockquote className="text-[#f2ebe2] text-base sm:text-xl font-light italic leading-relaxed">
                &ldquo;I wanted a flagship for my corporate housing business. It needed to be a show stopper – but I am good with numbers, not design. So, I retained Marlena.
              </blockquote>

              <blockquote className="text-[#f2ebe2] text-base sm:text-xl font-light italic leading-relaxed">
                We emailed photos back and forth, discussed how guests would use the space, and created something that exceeded my expectation. There’s no way I could have picked the artwork, fabrics, and patterns that blend so nicely. There’s no way I could have been so clever.
              </blockquote>

              <blockquote className="text-[#f2ebe2] text-base sm:text-xl font-light italic leading-relaxed">
                I’m looking forward to working with Marlena on other projects. She truly can turn a Timex into a Rolex.&rdquo;
              </blockquote>

              <div className="pt-2 border-t border-white/15">
                <div className="font-heading font-bold text-white text-lg sm:text-xl">
                  Al Williamson
                </div>
                <div className="text-xs text-[#4de0d2] uppercase tracking-wider font-semibold">
                  Leading Landlord, Business Owner • Sacramento, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Download Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1613]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#e6dfd5] text-left relative">
            <button
              onClick={() => {
                setDownloadModalOpen(false);
                setDownloadSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 text-[#857568] hover:text-[#282828] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-heading font-black text-[#282828] mb-1">
              Download Free Design Secrets Guide
            </h3>
            <p className="text-xs text-[#6e5f53] mb-5">
              Discover the Top 5 Interior Design Secrets that Make You Money Every Day with Your Midterm Rental
            </p>

            {downloadSubmitted ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#e8f8f6] border border-[#b8ebe5] flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#00897d] shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-[#005951] text-sm">
                      Guide Unlocked for {downloadName}!
                    </h4>
                    <p className="text-xs text-[#007a70]">
                      Copy also logged for <strong>{downloadEmail}</strong>. Review or print the 5 secrets below:
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-4">
                  {HOST_DESIGN_SECRETS.map((sec) => (
                    <div key={sec.number} className="p-3 bg-white rounded-xl border border-[#e6dfd5] space-y-1">
                      <div className="text-xs font-black text-[#00b7a8]">
                        SECRET #{sec.number} — <span className="text-[#282828]">{sec.title}</span>
                      </div>
                      <p className="text-xs text-[#5c5046] leading-relaxed">{sec.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadModalOpen(false);
                      setDownloadSubmitted(false);
                    }}
                    className="px-5 py-2.5 bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cfc3] text-sm focus:border-[#00b7a8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#282828] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cfc3] text-sm focus:border-[#00b7a8] outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDownloadModalOpen(false)}
                    className="w-1/2 py-3 border border-[#d8cfc3] text-[#5c5046] text-xs font-bold rounded-xl hover:bg-[#faf8f5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
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
