import React, { useState } from 'react';
import { FAQS } from '../data/lodgingData';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  MessageSquare,
  Phone
} from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

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
    <div className="bg-[#faf8f5]">
      {/* Live Realistic Courtyard Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 text-center text-white border-b border-[#3a2f28]">
        <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#4de0d2] text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-4 h-4 text-[#4de0d2]" />
            <span>Guest Help Center &amp; FAQs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight text-balance">
            Frequently Asked Questions
          </h1>

          <p className="text-[#ede5dc] text-base sm:text-lg leading-relaxed">
            Clear answers about furnished short and extended stays, online cart checkout, 3D fleet rentals, arrival essentials, and community guidelines.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Search & Categories Filter */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#857568] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. checkout, utilities, pets, WiFi, minimum stay)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#d8cfc3] focus:border-[#00b7a8] focus:ring-2 focus:ring-[#00b7a8]/15 bg-white text-sm text-[#282828] outline-none shadow-2xs transition-all"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {(['All', 'General', 'Stays & Amenities', 'Booking & Policies'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00b7a8] text-white shadow-2xs'
                    : 'bg-white border border-[#e6dfd5] text-[#5c5046] hover:bg-[#f4efe9]'
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
            <div className="text-center p-12 bg-white rounded-2xl border border-[#e6dfd5]">
              <p className="text-[#6e5f53] text-sm">No questions matched your search query. Try another term!</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#e6dfd5] overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  >
                    <span className="font-heading font-bold text-base sm:text-lg text-[#282828]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#e8f8f6] text-[#00897d]' : 'bg-[#f4efe9] text-[#6e5f53]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-[#5c5046] text-sm leading-relaxed border-t border-[#efe9e0] animate-in fade-in duration-200">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box with Live Realistic Twilight Photo */}
        <div className="relative overflow-hidden text-white rounded-3xl p-8 sm:p-10 border border-[#3a2f28] shadow-xl">
          <LivePhotoBackground scene="twilight" overlay="espresso" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                Have a Specific Question About Your Travel Dates?
              </h3>
              <p className="text-xs sm:text-sm text-[#ede5dc] max-w-lg leading-relaxed">
                Bill and Marlena are always ready to answer any questions to verify if Easy Travel Lodging is the ideal fit for your stay.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:9168003295"
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-2 border border-white/25 transition-all"
              >
                <Phone className="w-4 h-4 text-[#4de0d2]" />
                <span>Call 916-800-3295</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Send An Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
