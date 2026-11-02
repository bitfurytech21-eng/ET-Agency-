import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  X, 
  Printer
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const [downloadName, setDownloadName] = useState('');
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadPhone, setDownloadPhone] = useState('');
  const [isReady, setIsReady] = useState(false);

  if (!isOpen) return null;

  const handleDownloadForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brochure',
          name: downloadName,
          email: downloadEmail,
          phone: downloadPhone,
          message: 'Downloaded Corporate & Midterm Housing Brochure Packet',
        }),
      });
    } catch {
      // Proceed to unlock brochure even if offline
    }
    setIsReady(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1c1613]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e6dfd5] text-left relative flex flex-col animate-scale-in">
        {/* Header with Live Realistic Courtyard Photo */}
        <div className="relative overflow-hidden px-6 py-5 border-b border-[#3a2f28] text-white shrink-0">
          <LivePhotoBackground scene="courtyard" overlay="espresso" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b7a8] text-white flex items-center justify-center shadow-xs shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="type-h3 text-white">
                  Easy Travel Lodging Brochure
                </h3>
                <p className="type-support text-[#ede5dc]">
                  Furnished Residences, Fleet Rentals &amp; Guest Services Overview
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-lg text-[#ede5dc] hover:text-white hover:bg-white/15 cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-[#4a3e35] type-body bg-[#fcfaf7]">
          {!isReady ? (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 bg-[#f5efe8] rounded-2xl border border-[#dfd3c5]">
                <p className="text-[#3d2e24] type-body">
                  Our goal is to make every arrival effortless. Whether you are visiting family, relocating across California’s homes, remodeling your home, or arranging extended corporate housing, download our illustrated residence packet to review floor plans, amenities, and inclusions.
                </p>
              </div>

              <form onSubmit={handleDownloadForm} className="space-y-4 pt-1">
                <h4 className="type-h4 text-[#282828]">
                  Fill in your details below for instant access
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">First &amp; Last Name *</label>
                    <input
                      type="text"
                      required
                      value={downloadName}
                      onChange={(e) => setDownloadName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] bg-white text-[#282828] text-base focus:border-[#00b7a8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block type-label text-[#282828] mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={downloadEmail}
                      onChange={(e) => setDownloadEmail(e.target.value)}
                      placeholder="rachel@example.com"
                      className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] bg-white text-[#282828] text-base focus:border-[#00b7a8] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block type-label text-[#282828] mb-1.5">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={downloadPhone}
                    onChange={(e) => setDownloadPhone(e.target.value)}
                    placeholder="(916) 555-0199"
                    className="w-full px-3.5 h-11 rounded-xl border border-[#d8cfc3] bg-white text-[#282828] text-base focus:border-[#00b7a8] outline-none tabular-nums"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] text-white type-btn rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>View &amp; Download Brochure Packet</span>
                  </button>
                </div>

                <p className="type-support text-center text-[#6e5f53]">
                  We respect your email privacy. Zero marketing spam.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="border border-[#e6dfd5] rounded-2xl p-6 bg-white space-y-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#efe9e0] pb-3.5">
                  <div>
                    <h4 className="type-h3 text-[#282828]">
                      Easy Travel Lodging
                    </h4>
                    <p className="type-support text-[#00897d] font-semibold">
                      Nationwide Furnished Residences &amp; Corporate Suites
                    </p>
                  </div>
                  <span className="type-support text-[#82634f] font-semibold">
                    BBB Torch Award Winner
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 type-support">
                  <div>
                    <span className="font-semibold text-[#282828] block">Hosts</span>
                    <span className="text-[#5c5046]">Bill Wheelock &amp; Dr. Marlena Uhrik</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#282828] block">Direct Concierge</span>
                    <span className="text-[#5c5046] tabular-nums">916-800-3295</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#282828] block">Stay Flexibility</span>
                    <span className="text-[#5c5046]">5+ Night Short Stays · 30+ Day Tax-Exempt</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#282828] block">Check-In / Check-Out</span>
                    <span className="text-[#5c5046] tabular-nums">2:00 PM / 11:00 AM</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#efe9e0]">
                  <h5 className="type-h4 text-[#282828] mb-2.5">
                    Suite Inclusions Checklist
                  </h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 type-support text-[#5c5046]">
                    <li>✓ 400+ Mbps Ultra Fast WiFi</li>
                    <li>✓ In-Unit Stackable Washer &amp; Dryer</li>
                    <li>✓ 55&quot; 4K Smart TV in Living Room</li>
                    <li>✓ 43&quot; Smart TV in each Bedroom</li>
                    <li>✓ Cozy Indoor Fireplace &amp; Patio</li>
                    <li>✓ Keurig Brewer &amp; Instant Pot</li>
                    <li>✓ Full Kitchenware &amp; Dinnerware for 4</li>
                    <li>✓ 24-Hr Fitness, Pools &amp; Spas</li>
                    <li>✓ ETL Starter Kit &amp; Welcome Basket</li>
                    <li>✓ All Utilities (Electric, Gas, Water) Paid</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-3 bg-[#82634f] text-white rounded-xl type-btn flex items-center justify-center gap-2 hover:bg-[#6e5240] transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Brochure Sheet</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 border border-[#d8cfc3] text-[#5c5046] rounded-xl type-btn hover:bg-[#f4efe9] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
