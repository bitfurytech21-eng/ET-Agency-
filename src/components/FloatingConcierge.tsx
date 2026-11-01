import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Phone,
  Copy,
  Check,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/lodgingData';

const TILDA_CHAT_URL = 'https://www.tilda.cc/';

export const FloatingConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://easytravellodging.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleOpenTildaChat = () => {
    window.open(TILDA_CHAT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="Concierge quick chat" className="fixed bottom-6 right-6 z-40 text-left font-sans">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-[#d8cfc4] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#282828] text-white p-4 flex items-center justify-between border-b border-[#3d3834]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00897d] flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white leading-tight">
                  Live Concierge Chat
                </h3>
                <span className="text-[11px] text-[#c9bfb5] block">
                  California’s homes · Direct guest support
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#c9bfb5] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close concierge menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-3 bg-[#faf8f5] max-h-[420px] overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#82634f] px-1 pt-1">
              Live chat support
            </div>

            <button
              type="button"
              onClick={handleOpenTildaChat}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#e8f8f6] border border-[#e2d9cd] hover:border-[#00897d] transition-colors group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00897d]/10 text-[#00897d] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#282828] group-hover:text-[#00897d] flex items-center gap-1.5">
                    <span>Tilda Live Chat</span>
                    <span className="text-[10px] font-semibold text-[#00897d] bg-[#00897d]/10 px-1.5 py-0.2 rounded">Live</span>
                  </div>
                  <span className="text-[11px] text-[#5c5046] block">Open the concierge chat window for instant help</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#857568] group-hover:text-[#00897d]" />
            </button>

            <div className="pt-2 border-t border-[#e8dfd3] grid grid-cols-2 gap-2">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="p-2.5 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#e2d9cd] text-[#282828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#00897d]" />
                <span>Call Staff</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#e2d9cd] text-[#282828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#82634f]" />
                    <span>Share Site</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle concierge quick contact channels"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#282828] hover:bg-[#1a1a1a] text-white border border-[#4a423a] shadow-xl hover:shadow-2xl transition-all cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#00b7a8] group-hover:scale-110 transition-transform" />
        <MessageCircle className="w-4 h-4 text-[#7ce8df]" />
        <span className="text-xs font-bold tracking-wide">Tilda Live Chat</span>
      </button>
    </aside>
  );
};
