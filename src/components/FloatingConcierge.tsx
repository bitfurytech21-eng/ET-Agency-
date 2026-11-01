import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Share2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/lodgingData';

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

  return (
    <aside aria-label="Concierge quick chat" className="fixed bottom-6 right-6 z-40 text-left font-sans">
      {/* Floating Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-[#d8cfc4] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-[#282828] text-white p-4 flex items-center justify-between border-b border-[#3d3834]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00897d] flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white leading-tight">
                  Executive Concierge
                </h3>
                <span className="text-[11px] text-[#c9bfb5] block">
                  California’s homes · Regional Guest Support
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

          {/* Quick Channels List */}
          <div className="p-3.5 space-y-2 bg-[#faf8f5] max-h-[420px] overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#82634f] px-1 pt-1">
              Direct Chat &amp; Messaging
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/19168003295?text=Hello%20Easy%20Travel%20Lodging%20concierge,%20I%20have%20an%20inquiry%20about%20a%20furnished%20stay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#e8f8f6] border border-[#e2d9cd] hover:border-[#00897d] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#282828] group-hover:text-[#00897d] flex items-center gap-1.5">
                    <span>Chat on WhatsApp</span>
                    <span className="text-[10px] font-semibold text-[#128C7E] bg-[#25D366]/15 px-1.5 py-0.2 rounded">Fastest</span>
                  </div>
                  <span className="text-[11px] text-[#5c5046] block">Direct message with staff at +1 916-800-3295</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#857568] group-hover:text-[#00897d]" />
            </a>

            {/* Facebook Messenger */}
            <a
              href="https://m.me/easytravellodging"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f0f4fc] border border-[#e2d9cd] hover:border-[#1877F2] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">f</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#282828] group-hover:text-[#1877F2]">
                    Facebook Messenger
                  </div>
                  <span className="text-[11px] text-[#5c5046] block">Messenger chat with hosting team</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#857568] group-hover:text-[#1877F2]" />
            </a>

            {/* Instagram Direct */}
            <a
              href="https://ig.me/m/easytravellodging"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#fdf2f7] border border-[#e2d9cd] hover:border-[#E1306C] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E1306C]/15 text-[#E1306C] flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">IG</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#282828] group-hover:text-[#E1306C]">
                    Instagram Direct
                  </div>
                  <span className="text-[11px] text-[#5c5046] block">Direct DM with concierge staff</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#857568] group-hover:text-[#E1306C]" />
            </a>

            {/* Share / Post on X */}
            <a
              href="https://twitter.com/intent/tweet?text=Connecting%20with%20@easytravellodging%20for%20furnished%20executive%20housing%20in%20Rancho%20Cordova%20CA&url=https://easytravellodging.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#f2f2f2] border border-[#e2d9cd] hover:border-[#000000] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#000000]/10 text-[#000000] flex items-center justify-center shrink-0">
                  <span className="text-xs font-black">𝕏</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#282828] group-hover:text-[#000000]">
                    Share on X
                  </div>
                  <span className="text-[11px] text-[#5c5046] block">Post, inquiry &amp; mention</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#857568] group-hover:text-[#000000]" />
            </a>

            {/* Direct Phone & Copy Link Row */}
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
                    <span>Share Company</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Concierge Action Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle concierge quick contact channels"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#282828] hover:bg-[#1a1a1a] text-white border border-[#4a423a] shadow-xl hover:shadow-2xl transition-all cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#00b7a8] group-hover:scale-110 transition-transform" />
        <MessageCircle className="w-4 h-4 text-[#7ce8df]" />
        <span className="text-xs font-bold tracking-wide">Concierge Chat</span>
      </button>
    </aside>
  );
};
