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
    { id: 'index', label: 'Help Center' },
    { id: 'help-center', label: 'Guides & Manuals' },
    { id: 'faq', label: 'Stay FAQs' },
    { id: 'contact-support', label: 'Direct Hotline' },
    { id: 'submit-request', label: 'Submit Ticket' },
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

  const guides = [
    {
      title: 'Smart-Lock & Digital Check-In Guide',
      summary: 'Step-by-step instructions for activating keypad entry, garage access remotes, and perimeter security settings upon arrival.',
      category: 'Residence Access · 3 min read',
    },
    {
      title: 'Appliance, Fiber Wi-Fi & Climate Manual',
      summary: 'Operating reference for dual-zone HVAC thermostats, enterprise Wi-Fi mesh credentials, washer/dryer cycles, and kitchen equipment.',
      category: 'In-Residence Operations · 4 min read',
    },
    {
      title: 'Airport Curbside Fleet Delivery & Return',
      summary: 'Terminal staging & concierge handover in El Dorado Hills, CA and SMF Airport, inspection checklists, EV charging, and return procedures.',
      category: 'Executive Fleet · 3 min read',
    },
    {
      title: 'Corporate Billing, Per-Diem & Extension Protocol',
      summary: 'How to download tax-exempt folio statements, submit wire confirmations, and request lease extensions without re-papering.',
      category: 'Commercial Accounting · 2 min read',
    },
  ].filter(
    (g) =>
      !searchQuery.trim() ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as SupportSubView)}
      />

      <div className="px-4 sm:px-8 pb-8 space-y-6 max-w-4xl">
        {/* 1. Help Center Hub */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5 space-y-1">
              <h3 className="type-h3 text-slate-900">
                24/7 Concierge &amp; Guest Support
              </h3>
              <p className="type-body text-slate-600">
                Fast answers, direct founding host lines, and maintenance service requests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div
                onClick={() => setSubView('contact-support')}
                className="p-6 bg-white border border-slate-200 hover:border-[#14616d] rounded-2xl cursor-pointer transition-colors shadow-xs space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="type-h4 text-slate-900">Immediate Phone Support</h4>
                <p className="type-support text-slate-600 tabular-nums">
                  916-800-3295 · 7 days a week for immediate guest assistance.
                </p>
              </div>

              <div
                onClick={() => setSubView('faq')}
                className="p-6 bg-white border border-slate-200 hover:border-[#14616d] rounded-2xl cursor-pointer transition-colors shadow-xs space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#14616d] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="type-h4 text-slate-900">Searchable Stay FAQs</h4>
                <p className="type-support text-slate-600">
                  Answers on Wi-Fi, HVAC, appliances, and check-out procedures.
                </p>
              </div>

              <div
                onClick={() => setSubView('submit-request')}
                className="p-6 bg-white border border-slate-200 hover:border-[#14616d] rounded-2xl cursor-pointer transition-colors shadow-xs space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#8c6a4a] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="type-h4 text-slate-900">Submit Support Ticket</h4>
                <p className="type-support text-slate-600">
                  File a ticket for extra linens, maintenance, or vehicle logistics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1b. Guides & Manuals */}
        {subView === 'help-center' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <h3 className="type-h3 text-slate-900">
                  Residence &amp; Fleet Operating Manuals
                </h3>
                <p className="type-body text-slate-600">
                  Reference documentation for check-in access, home systems, and corporate invoicing.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter manuals..."
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((guide, i) => (
                <div
                  key={i}
                  className="p-6 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-xs"
                >
                  <div className="type-support text-[#14616d] font-semibold">
                    {guide.category}
                  </div>
                  <h4 className="type-h4 text-slate-900">{guide.title}</h4>
                  <p className="type-support text-slate-600">{guide.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. FAQs */}
        {(subView === 'index' || subView === 'faq') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h4 className="type-h4 text-slate-900">
              Frequently Asked Questions
            </h4>

            <div className="divide-y divide-slate-200">
              {faqs.map((f, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div key={idx} className="py-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left type-btn text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{f.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#14616d] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="type-body text-slate-600 pt-1">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Direct Contact */}
        {subView === 'contact-support' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-200 pb-5 space-y-1">
              <h3 className="type-h3 text-slate-900">
                Direct Founder &amp; Concierge Hotline
              </h3>
              <p className="type-body text-slate-600">
                Speak directly with agency founders Bill Wheelock and Dr. Marlena Uhrik.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="type-label text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#14616d]" /> Telephone &amp; SMS
                </span>
                <p className="type-h4 text-slate-900 tabular-nums">916-800-3295</p>
                <p className="type-support text-slate-500">Available 7 days a week for immediate assistance.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="type-label text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8c6a4a]" /> Concierge Email Desk
                </span>
                <p className="type-body font-semibold text-slate-900 break-all">
                  easytravelagency@trustagent.space
                </p>
                <p className="type-support text-slate-500">Response guaranteed within 2 hours during daytime hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Submit Ticket */}
        {subView === 'submit-request' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-200 pb-5 space-y-1">
              <h3 className="type-h3 text-slate-900">
                Submit Guest or Fleet Request
              </h3>
              <p className="type-body text-slate-600">
                Dispatches a priority ticket directly to our on-call operations team.
              </p>
            </div>

            {requestSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 type-support font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket submitted. Dispatch reference assigned.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="Housing Amenities">Housing Amenities &amp; Supplies</option>
                    <option value="Keyless Access">Keyless Smart-Lock Access</option>
                    <option value="Fleet Vehicle">3D Fleet Vehicle &amp; Delivery</option>
                    <option value="Billing & Wire">Billing &amp; Wire Settlement</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="normal">Normal (Routine Inquiry)</option>
                    <option value="urgent">Urgent (In-Stay Access / Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Requesting extra bath linens or flight delay update"
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Details &amp; Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please provide specifics so our team can immediately take action..."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary"
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
