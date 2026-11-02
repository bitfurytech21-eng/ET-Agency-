import React, { useEffect, useState } from 'react';
import { MessageSquare, X, Send, PhoneCall, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { LivePhotoBackground } from './LivePhotoBackground';

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
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorNote, setErrorNote] = useState<string | null>(null);

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
        document.head.appendChild(script);
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

  const handleSubmitChatInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !chatMessage.trim()) {
      setErrorNote('Please enter your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setErrorNote(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'live_chat',
          name: senderName.trim(),
          email: senderEmail.trim(),
          message: chatMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not send message');
      setSubmittedRef(data.referenceCode || 'ETL-CHAT');
      setChatMessage('');
    } catch (err: unknown) {
      setErrorNote(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={handleOpenChat}
          aria-label="Open Concierge Chat"
          className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold text-sm rounded-full shadow-xl transition-all duration-200 cursor-pointer border-2 border-white"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Concierge Support</span>
            </>
          )}
        </button>
      </div>

      {isOpen && !smartsupKey && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e6dfd5] overflow-hidden text-[#282828] animate-in fade-in">
          <div className="relative overflow-hidden text-white p-4 border-b border-[#3a2f28]">
            <LivePhotoBackground scene="courtyard" overlay="espresso" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#00b7a8] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                  ETL
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm">Guest &amp; Concierge Support</h4>
                  <p className="text-[11px] text-[#4de0d2]">
                    Local Hosts · El Dorado Hills, CA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#ede5dc] hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto bg-[#faf8f5] text-xs text-[#5c5046] text-left">
            <div className="p-3 bg-white rounded-xl border border-[#e6dfd5] shadow-2xs space-y-1">
              <span className="font-semibold text-[#282828] text-xs block">
                Welcome to Easy Travel Lodging
              </span>
              <p className="text-[11px] text-[#5c5046] leading-relaxed">
                Planning a short or extended furnished stay, 3D fleet rental, or arrival package in El Dorado Hills, CA? Message our local concierge desk below.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <a
                href="tel:9168003295"
                className="flex items-center gap-2.5 p-2.5 bg-[#e8f8f6] hover:bg-[#d6f3ef] text-[#005951] font-bold rounded-xl border border-[#b8ebe5] transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#00897d]" />
                <span>Call/Text Directly: 916-800-3295</span>
              </a>
              <a
                href="mailto:easytravelagency@trustagent.space"
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-[#f4efe9] text-[#282828] font-medium rounded-xl border border-[#e6dfd5] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00b7a8] shrink-0" />
                <span className="break-all">easytravelagency@trustagent.space</span>
              </a>
            </div>

            {submittedRef ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <div className="font-bold text-emerald-950 text-xs">Message Dispatched!</div>
                <p className="text-[11px] text-emerald-800">
                  Reference <strong className="font-mono">{submittedRef}</strong> has been logged for our El Dorado Hills, CA housing team.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedRef(null)}
                  className="px-3 py-1.5 bg-[#82634f] text-white rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitChatInquiry} className="pt-2 border-t border-[#e6dfd5] space-y-2">
                <p className="font-semibold text-[#282828] text-xs">Send Quick Concierge Message:</p>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name *"
                  className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-lg text-xs text-[#282828] focus:border-[#00b7a8] outline-none"
                />
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Your Email *"
                  className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-lg text-xs text-[#282828] focus:border-[#00b7a8] outline-none"
                />
                <textarea
                  rows={2}
                  required
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Dates, preferred unit, or fleet vehicle question..."
                  className="w-full px-3 py-2 bg-white border border-[#d8cfc3] rounded-lg text-xs text-[#282828] focus:border-[#00b7a8] outline-none resize-none"
                />
                {errorNote && <p className="text-[11px] text-rose-600 font-medium">{errorNote}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
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
