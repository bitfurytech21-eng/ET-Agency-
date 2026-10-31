import React, { useState } from 'react';
import { COMPANY_INFO, PROPERTIES } from '../data/lodgingData';
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  Phone, 
  Mail,
  MapPin
} from 'lucide-react';

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

  const handleDownloadForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReady(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-left relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Easy Travel Lodging Brochure
              </h3>
              <p className="text-xs text-slate-500">Corporate & Midterm Housing Overview</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-700 text-sm">
          {!isReady ? (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                <p className="text-sky-900 text-xs sm:text-sm font-medium leading-relaxed">
                  Our goal is to make things as <strong>EASY</strong> as possible for you. As a Traveling Professional, you can completely relax, rejuvenate, and enjoy your accommodations selected and designed by Easy Travel Lodging.
                </p>
              </div>

              <form onSubmit={handleDownloadForm} className="space-y-3 pt-2">
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  Fill in your details below for instant access:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First & Last Name *</label>
                    <input
                      type="text"
                      required
                      value={downloadName}
                      onChange={(e) => setDownloadName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={downloadEmail}
                      onChange={(e) => setDownloadEmail(e.target.value)}
                      placeholder="rachel@example.com"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={downloadPhone}
                    onChange={(e) => setDownloadPhone(e.target.value)}
                    placeholder="(916) 555-0199"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>View & Download Brochure Packet</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500">
                  We respect your email privacy. Zero marketing spam.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-heading font-black text-xl text-slate-900">
                      EASY TRAVEL LODGING
                    </h4>
                    <p className="text-xs text-sky-700 font-bold">
                      Sacramento & Rancho Cordova Midterm Housing
                    </p>
                  </div>
                  <span className="text-xs text-amber-700 font-bold bg-amber-100 px-3 py-1 rounded-full">
                    BBB Torch Award Winner
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Hosts:</span>
                    <span>Bill Wheelock & Dr. Marlena Uhrik</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Direct Inquiries:</span>
                    <span>916-800-3295</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Minimum Occupancy:</span>
                    <span>30 Days or More</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Check-in / Check-out:</span>
                    <span>2:00 PM / 11:00 AM</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    Suite Inclusions Checklist:
                  </h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    <li>✓ 400+ Mbps Ultra Fast WiFi</li>
                    <li>✓ In-Unit Stackable Washer & Dryer</li>
                    <li>✓ 55" 4K Smart TV in Living Room</li>
                    <li>✓ 43" Smart TV in each Bedroom</li>
                    <li>✓ Cozy Indoor Fireplace & Patio</li>
                    <li>✓ Keurig Brewer & Instant Pot</li>
                    <li>✓ Full Kitchenware & Dinnerware for 4</li>
                    <li>✓ 24-Hr Fitness, Pools & Spas</li>
                    <li>✓ ETL Starter Kit & Welcome Basket</li>
                    <li>✓ All Utilities (Electric, Gas, Water) Paid</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Brochure Sheet</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
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
