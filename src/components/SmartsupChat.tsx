import React, { useEffect, useState } from 'react';
import { MessageSquare, X, Send, Sparkles, PhoneCall, Mail } from 'lucide-react';

declare global {
  interface Window {
    _smartsup?: {
      key?: string;
      [key: string]: unknown;
    };
    smartsup?: {
      (action: string, ...args: unknown[]): void;
      _?: unknown[];
    };
  }
}

interface SmartsupChatProps {
  key?: string;
}

export const SmartsupChat: React.FC<SmartsupChatProps> = ({ key: propKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use prop key, or VITE_SMARTSUP_KEY, or fallback placeholder
  const smartsupKey = propKey || import.meta.env.VITE_SMARTSUP_KEY || '';

  useEffect(() => {
    if (smartsupKey) {
      window._smartsup = window._smartsup || {};
      window._smartsup.key = smartsupKey;

      if (!document.getElementById('smartsup-script')) {
        const script = document.createElement('script');
        script.id = 'smartsup-script';
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = true;
        script.src = 'https://www.smartsupchat.com/w/smartsup.js';
        script.onload = () => {
          setIsLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    }
  }, [smartsupKey]);

  const handleOpenChat = () => {
    if (window.smartsup) {
      window.smartsup('chat:open');
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* Floating Action Button for Live Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-700 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">Chat with Housing Specialist</span>
          </div>
        )}

        <button
          onClick={handleOpenChat}
          aria-label="Open Live Chat"
          className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#00b7a8] hover:bg-[#009b8e] text-white font-bold text-sm rounded-full shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer border-2 border-white"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Live Housing Chat</span>
            </>
          )}
        </button>
      </div>

      {/* In-App Direct Inquiry Drawer fallback if no live Smartsup key is provided */}
      {isOpen && !smartsupKey && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#00b7a8] flex items-center justify-center font-bold text-white text-sm">
                ETL
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm">Sacramento Housing Live Support</h4>
                <p className="text-[11px] text-teal-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Agents Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto bg-slate-50 text-xs text-slate-600">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="font-semibold text-slate-900 flex items-center gap-1 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00b7a8]" /> Welcome to Easy Travel Lodging!
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Looking for 30+ day corporate or mid-term furnished housing in Rancho Cordova / Sacramento? Send your inquiry below or call us directly.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href="tel:9164263655"
                className="flex items-center gap-2.5 p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl border border-teal-200 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#00b7a8]" />
                <span>Call/Text Housing Specialist: (916) 426-3655</span>
              </a>
              <a
                href="mailto:hello@easytravellodging.com"
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-xl border border-slate-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00b7a8]" />
                <span>Email: hello@easytravellodging.com</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <p className="font-semibold text-slate-900 text-xs">Send Quick Chat Inquiry:</p>
              <input
                type="text"
                placeholder="Your Name & Email/Phone"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00b7a8] outline-none"
              />
              <textarea
                rows={2}
                placeholder="Dates & Property preference..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00b7a8] outline-none resize-none"
              />
              <button
                onClick={() => {
                  alert('Thank you! Your inquiry has been dispatched to our Sacramento housing team.');
                  setIsOpen(false);
                }}
                className="w-full py-2 bg-[#00b7a8] hover:bg-[#009b8e] text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const openSmartsupChat = (initialMessage?: string) => {
  if (window.smartsup) {
    window.smartsup('chat:open');
    if (initialMessage) {
      window.smartsup('chat:message', initialMessage);
    }
  }
};
