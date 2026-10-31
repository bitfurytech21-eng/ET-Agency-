import React, { useState } from 'react';
import { FAQS } from '../data/lodgingData';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';

interface FAQViewProps {
  onOpenBooking: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onOpenBooking }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'General' | 'Stays & Amenities' | 'Booking & Policies'>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-5': true
  });

  const toggleFAQ = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = FAQS.filter((faq) => {
    if (selectedCategory !== 'All' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  return (
    <div className="py-12 sm:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            Easy Travel Lodging FAQs
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-slate-600 text-base sm:text-lg">
            Everything you need to know about our corporate housing, mid-term stay lengths, starter kits, and booking guidelines.
          </p>
        </div>

        {/* Search & Categories Filter */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. starter kit, utilities, pets, WiFi)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sm outline-none shadow-xs transition-all"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {(['All', 'General', 'Stays & Amenities', 'Booking & Policies'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No questions matched your search query. Try another term!</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-heading font-bold text-base sm:text-lg text-slate-900">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-sky-100 text-sky-700' : 'text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-700 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading font-black text-xl text-white">
              Have a Specific Question About Your Travel Dates?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Bill and Marlena are always ready to answer any questions to verify if Easy Travel Lodging is the ideal fit for your stay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:9168003295"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition-all"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Call 916-800-3295</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>Send An Inquiry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
