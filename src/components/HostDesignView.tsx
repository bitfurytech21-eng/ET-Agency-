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
          <span className="type-support font-semibold uppercase tracking-[0.14em] text-[#4de0d2] inline-block">
            Easy Travel Lodging Design Studio
          </span>
          <h1 className="type-h1 text-white">
            Interior Design &amp; Staging for Rental Hosts
          </h1>
          <p className="type-body-lg text-[#f2ebe2] max-w-3xl mx-auto pt-2">
            Partner with <strong className="font-semibold text-white">Easy Travel Lodging Design Services</strong> to turn furnished apartments, vacation homes, and extended-stay rentals into high-occupancy, guest-ready residences—in Northern California or remotely nationwide.
          </p>
          <p className="type-body text-[#dfd3c5] max-w-2xl mx-auto">
            Led by Certified Home Stager Dr. Marlena Uhrik, our studio blends durable hospitality furnishings, smart spatial planning, and listing-ready styling that stands out immediately in search results.
          </p>

          <div className="pt-6">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="btn btn-white inline-flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#14616d]" />
              <span>Download Complimentary Host Design Guide</span>
            </button>
            <p className="type-support text-[#dfd3c5] mt-2.5">
              Five practical interior design strategies that elevate nightly and monthly occupancy
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Main Design Services Narrative & Case Study
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-[#efe9e0] text-left">
        <div className="type-body max-w-5xl mx-auto space-y-8 text-[#5c5046]">
          <p>
            From floor-plan flow and durable furniture sourcing to lighting, linens, and finishing artwork, we collaborate with property owners and managers to create spaces that photograph beautifully, hold up between turnovers, and earn consistent five-star reviews.
          </p>

          <div className="p-6 sm:p-8 bg-[#faf3e9] rounded-2xl border border-[#e3d2bc] space-y-4">
            <h2 className="type-h3 text-[#3d2e24]">
              First impressions drive booking decisions in seconds.
            </h2>
            <p className="type-body text-[#4a3e35]">
              With thousands of new short-term and extended-stay listings entering the market each year, prospective guests compare photos side by side before reading a single paragraph of description.
            </p>
            <p className="type-body text-[#4a3e35]">
              In a local market comparison of two properties in the same zip code—just a mile apart with identical square footage—one residence commanded <strong className="font-semibold text-[#282828]">over $100 more per night</strong> than its neighbor. The difference came down to cohesive interior styling, lighting, and functional layout.
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
            <span className="type-support font-semibold uppercase tracking-[0.12em] text-[#14616d] block">
              Turnkey Execution &amp; Return on Investment
            </span>
            <h2 className="type-h2 text-[#282828] mt-1.5">
              Efficient Turnarounds Without Compromising Quality
            </h2>
          </div>

          <div className="type-body space-y-5 text-[#5c5046]">
            <p>
              As property investors ourselves, we know every vacant week carries a real carrying cost. Our structured procurement and installation workflow gets your listing furnished, staged, and ready to photograph on schedule.
            </p>

            <p>
              For property managers overseeing multiple owners, we create repeatable, low-maintenance design standards that simplify housekeeping, reduce replacement expenses, and encourage repeat guest bookings.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#e6dfd5] shadow-2xs space-y-4">
            <h3 className="type-h3 text-[#14616d]">
              Launching or Refreshing a Furnished Rental?
            </h3>
            <p className="type-body text-[#5c5046]">
              Explore what thoughtful positioning can do for your short-stay, vacation, or extended-stay property. Schedule a complimentary discovery call to discuss your floor plan, target guest profile, and revenue goals.
            </p>
            <div className="type-support p-4 bg-[#f0f7f8] rounded-xl border border-[#cbe3e6] text-[#0f4952]">
              <strong className="font-semibold">Property Owner Support:</strong> Our comprehensive design and staging packages deliver room-by-room mood boards, clickable procurement lists, floor-plan placement guides, and video walk-through coaching anywhere in California’s homes.
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
            <h2 className="type-h2 text-[#282828]">
              Why Owners Work With Our Design Studio
            </h2>
            <p className="type-body text-[#6e5f53] max-w-2xl mx-auto">
              Three practical principles that turn an ordinary rental into a sought-after residence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="type-support font-semibold text-[#14616d] tabular-nums">
                01. Tailored Scope
              </div>
              <h3 className="type-h3 text-[#282828]">
                Custom Design Plans
              </h3>
              <p className="type-body text-[#5c5046]">
                Every property and neighborhood is different. Whether you need full turnkey furnishing, room-by-room styling, or targeted upgrades, we align every selection with your architecture and budget.
              </p>
            </div>

            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="type-support font-semibold text-[#14616d] tabular-nums">
                02. Commercial Performance
              </div>
              <h3 className="type-h3 text-[#282828]">
                Stronger Rates &amp; Reviews
              </h3>
              <p className="type-body text-[#5c5046]">
                We balance visual warmth with real-world durability—pairing inviting living areas and restful bedrooms with practical amenities that earn stronger nightly and monthly rates.
              </p>
            </div>

            <div className="p-8 bg-[#faf8f5] rounded-2xl border border-[#e6dfd5] space-y-3">
              <div className="type-support font-semibold text-[#14616d] tabular-nums">
                03. Streamlined Delivery
              </div>
              <h3 className="type-h3 text-[#282828]">
                End-to-End Coordination
              </h3>
              <p className="type-body text-[#5c5046]">
                From initial concept boards and furniture ordering to final accessory placement, we manage the details clearly so you can focus on welcoming guests.
              </p>
            </div>
          </div>

          <div className="text-center pt-4 space-y-4">
            <h3 className="type-h3 text-[#282828]">
              Ready to elevate your rental property? Let’s plan your project together.
            </h3>

            <a
              href="https://app.acuityscheduling.com/schedule.php?owner=19330770&appointmentType=13695494"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Your Complimentary Design Discovery Call</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
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
              <div className="rounded-2xl overflow-hidden border-2 border-[#14616d] shadow-2xl max-w-xs w-full bg-[#241d18]">
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
              <span className="type-support font-semibold uppercase tracking-[0.14em] text-[#4de0d2] block">
                Reviews &amp; Client Testimonial
              </span>

              <blockquote className="type-body-lg text-[#f2ebe2] italic">
                &ldquo;I wanted a flagship for my corporate housing business. It needed to be a show stopper – but I am good with numbers, not design. So, I retained Marlena.
              </blockquote>

              <blockquote className="type-body-lg text-[#f2ebe2] italic">
                We emailed photos back and forth, discussed how guests would use the space, and created something that exceeded my expectation. There’s no way I could have picked the artwork, fabrics, and patterns that blend so nicely. There’s no way I could have been so clever.
              </blockquote>

              <blockquote className="type-body-lg text-[#f2ebe2] italic">
                I’m looking forward to working with Marlena on other projects. She truly can turn a Timex into a Rolex.&rdquo;
              </blockquote>

              <div className="pt-3 border-t border-white/15">
                <div className="type-h4 text-white">
                  Al Williamson
                </div>
                <div className="type-support text-[#4de0d2] font-semibold mt-0.5">
                  Leading Landlord, Business Owner · Sacramento, CA
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

            <h3 className="type-h3 text-[#282828] mb-1.5">
              Download Free Design Secrets Guide
            </h3>
            <p className="type-support text-[#6e5f53] mb-5">
              Discover the Top 5 Interior Design Secrets that Make You Money Every Day with Your Midterm Rental
            </p>

            {downloadSubmitted ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#f0f7f8] border border-[#cbe3e6] flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#14616d] shrink-0" />
                  <div>
                    <h4 className="type-h4 text-[#0f4952]">
                      Guide Unlocked for {downloadName}
                    </h4>
                    <p className="type-support text-[#14616d]">
                      Copy also logged for <strong className="font-semibold">{downloadEmail}</strong>. Review or print the 5 secrets below:
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-2xl p-4">
                  {HOST_DESIGN_SECRETS.map((sec) => (
                    <div key={sec.number} className="p-3.5 bg-white rounded-xl border border-[#e6dfd5] space-y-1">
                      <div className="type-label text-[#14616d] tabular-nums">
                        0{sec.number}. <span className="text-[#282828]">{sec.title}</span>
                      </div>
                      <p className="type-support text-[#5c5046]">{sec.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDownloadModalOpen(false);
                      setDownloadSubmitted(false);
                    }}
                    className="btn btn-secondary"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block type-label text-[#282828] mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={downloadName}
                    onChange={(e) => setDownloadName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#d8cfc3] text-sm sm:text-base focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                  />
                </div>

                <div>
                  <label className="block type-label text-[#282828] mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#d8cfc3] text-sm sm:text-base focus:border-[#14616d] focus:ring-1 focus:ring-[#14616d] outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDownloadModalOpen(false)}
                    className="btn btn-outline w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-1/2 shadow-xs"
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
