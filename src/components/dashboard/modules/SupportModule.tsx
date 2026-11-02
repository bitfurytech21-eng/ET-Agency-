import React, { useState } from 'react';
import { SupportSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import {
  HelpCircle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const SupportModule: React.FC = () => {
  const [subView, setSubView] = useState<SupportSubView>('index');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Request Form
  const [reqCategory, setReqCategory] = useState('Housing Amenities');
  const [reqPriority, setReqPriority] = useState('normal');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Help Center', fileName: 'index.php' },
    { id: 'help-center', label: 'Guides & Manuals', fileName: 'help-center.php' },
    { id: 'faq', label: 'Stay FAQs', fileName: 'faq.php' },
    { id: 'contact-support', label: 'Direct Hotline', fileName: 'contact-support.php' },
    { id: 'submit-request', label: 'Submit Ticket', fileName: 'submit-request.php' },
  ];

  const faqs = [
    {
      q: 'How do I access my residence on check-in day?',
      a: 'All our residences utilize contactless digital keypads. Your unique 4-digit PIN is displayed in the "Accommodation > Stay Details" tab of your client portal. Enter your PIN followed by # to unlock the front door starting at 2:00 PM on move-in day.',
    },
    {
      q: 'Where do I park my personal car or 3D rental vehicle?',
      a: 'Each residence includes an assigned, covered parking space steps from your front door. The parking stall number is listed on your booking card and inside your stay packet.',
    },
    {
      q: 'What if my flight arrives late for my vehicle delivery?',
      a: 'Our dispatch team tracks incoming commercial flights in real-time. If your flight is delayed or rescheduled, your vehicle concierge automatically adjusts delivery to your new arrival gate and terminal bay at no extra charge.',
    },
    {
      q: 'Can my company settle invoices via ACH or direct wire?',
      a: 'Yes. Easy Travel Lodging provides standard GSA-compliant and corporate invoicing. You can view Bank of America wire routing instructions under "Payments > Bank Instructions" or upload an ACH remittance confirmation under "Payments > Upload Proof".',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setReqSubject('');
    setReqDesc('');
    setTimeout(() => {
      setRequestSubmitted(false);
      setSubView('index');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Support/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as SupportSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6 max-w-4xl">
        {/* 1. Help Center Hub (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                24/7 Concierge &amp; Guest Support (Support/)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Fast answers, direct founding host lines, and maintenance service requests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div
                onClick={() => setSubView('contact-support')}
                className="p-5 bg-white border border-[#e6dfd5] hover:border-[#00b7a8] rounded-2xl cursor-pointer transition-all shadow-2xs space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#282828]">Immediate Phone Support</h4>
                <p className="text-[#5c5046]">916-800-3295 • 7 days a week for immediate guest assistance.</p>
              </div>

              <div
                onClick={() => setSubView('faq')}
                className="p-5 bg-white border border-[#e6dfd5] hover:border-[#00b7a8] rounded-2xl cursor-pointer transition-all shadow-2xs space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-[#faf8f5] text-[#00b7a8] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#282828]">Searchable Stay FAQs</h4>
                <p className="text-[#5c5046]">Answers on Wi-Fi, HVAC, appliances, and check-out procedures.</p>
              </div>

              <div
                onClick={() => setSubView('submit-request')}
                className="p-5 bg-white border border-[#e6dfd5] hover:border-[#00b7a8] rounded-2xl cursor-pointer transition-all shadow-2xs space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-[#faf8f5] text-[#82634f] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-[#282828]">Submit Support Ticket</h4>
                <p className="text-[#5c5046]">File a ticket for extra linens, maintenance, or vehicle logistics.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. FAQs (faq.php) */}
        {(subView === 'index' || subView === 'faq') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h4 className="font-heading font-bold text-base text-[#282828]">
              Frequently Asked Questions (faq.php)
            </h4>

            <div className="divide-y divide-[#efe9e0] text-xs">
              {faqs.map((f, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div key={idx} className="py-3.5 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left font-bold text-sm text-[#282828] flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span>{f.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#00b7a8] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-[#5c5046] leading-relaxed pt-1 text-xs">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Direct Contact (contact-support.php) */}
        {subView === 'contact-support' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Direct Founder &amp; Concierge Hotline (contact-support.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Talk with agency founders Bill Wheelock and Dr. Marlena Uhrik directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <span className="font-bold text-sm text-[#282828] block flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00b7a8]" /> Telephone &amp; SMS
                </span>
                <p className="text-base font-extrabold text-[#282828]">916-800-3295</p>
                <p className="text-[#857568]">Available 7 days a week for immediate assistance.</p>
              </div>

              <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] space-y-2">
                <span className="font-bold text-sm text-[#282828] block flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#82634f]" /> Concierge Email Desk
                </span>
                <p className="text-sm font-extrabold text-[#282828] break-all">easytravelagency@trustagent.space</p>
                <p className="text-[#857568]">Response guaranteed within 2 hours during daytime hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Submit Ticket (submit-request.php) */}
        {subView === 'submit-request' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Submit Guest or Fleet Request (submit-request.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Dispatches a high-priority ticket directly to our on-call operations team.
              </p>
            </div>

            {requestSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket submitted. Dispatch reference assigned.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  >
                    <option value="Housing Amenities">Housing Amenities &amp; Supplies</option>
                    <option value="Keyless Access">Keyless Smart-Lock Access</option>
                    <option value="Fleet Vehicle">3D Fleet Vehicle &amp; Delivery</option>
                    <option value="Billing & Wire">Billing &amp; Wire Settlement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Priority</label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                  >
                    <option value="normal">Normal (Routine Inquiry)</option>
                    <option value="urgent">Urgent (In-Stay Access / Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Requesting extra bath linens or flight delay update"
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Details &amp; Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please provide specifics so our team can immediately take action..."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
