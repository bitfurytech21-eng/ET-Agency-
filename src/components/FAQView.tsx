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
    <div className="bg-[#faf7f2] min-h-screen">
      {/* Live Realistic Courtyard Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 text-center text-white border-b border-[#382b22]">
        <LivePhotoBackground scene="courtyard" secondaryScene="interior" overlay="espresso" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-[#4de0d2]">
            <HelpCircle className="w-4 h-4 text-[#4de0d2]" />
            <span>Guest Help Center &amp; FAQs</span>
          </div>

          <h1 className="type-h1 text-white">
            Frequently Asked Questions
          </h1>

          <p className="type-body text-[#e2ded6] max-w-2xl mx-auto">
            Clear answers about furnished short and extended stays, online cart checkout, 3D fleet rentals, arrival essentials, and community guidelines.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Search & Categories Filter */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#727e86] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. checkout, utilities, pets, WiFi, minimum stay)..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#e2ded6] focus:border-[#14616d] bg-white text-xs sm:text-sm text-[#182024] outline-none shadow-2xs transition-all"
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {(['All', 'General', 'Stays & Amenities', 'Booking & Policies'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`type-btn px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#14616d] text-white border-[#14616d] shadow-2xs'
                    : 'bg-white border-[#e2ded6] text-[#4a545c] hover:border-[#14616d]/50 hover:text-[#182024]'
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
            <div className="text-center p-12 bg-white rounded-2xl border border-[#e2ded6]">
              <p className="type-body text-[#727e86]">No questions matched your search query. Try another term.</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-[#e2ded6] overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf7f2] transition-colors"
                  >
                    <span className="type-h4 text-[#182024]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#e8f2f4] text-[#14616d]' : 'bg-[#faf7f2] text-[#727e86]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="type-body px-6 pb-6 pt-2 text-[#4a545c] border-t border-[#e2ded6] animate-in fade-in duration-200">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box with Live Realistic Twilight Photo */}
        <div className="relative overflow-hidden text-white rounded-2xl p-8 sm:p-10 border border-[#382b22] shadow-xl">
          <LivePhotoBackground scene="twilight" overlay="espresso" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="type-h3 text-white">
                Have a Specific Question About Your Travel Dates?
              </h3>
              <p className="type-body text-[#e2ded6] max-w-lg">
                Bill and Marlena are always ready to answer any questions to verify if Easy Travel Lodging is the ideal fit for your stay.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:9168003295"
                className="btn btn-white text-xs tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#14616d]" />
                <span>Call 916-800-3295</span>
              </a>
              <button
                onClick={onOpenBooking}
                className="btn btn-primary text-xs"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Send an Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
