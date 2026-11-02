import React, { useState } from 'react';
import { UserMessageItem } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { EmptyState } from '../components/EmptyState';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface MessagesModuleProps {
  messages: UserMessageItem[];
  onSendMessage: (subject: string, body: string, recipient: string) => Promise<boolean>;
}

export const MessagesModule: React.FC<MessagesModuleProps> = ({
  messages,
  onSendMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'compose' | 'sent'>('inbox');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(messages[0]?.id || null);

  // Compose State
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState('concierge');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const subTabOptions: SubTabOption[] = [
    { id: 'inbox', label: 'Inbox & Notifications', badge: unreadCount },
    { id: 'compose', label: 'New Direct Inquiry' },
    { id: 'sent', label: 'Sent History' },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setIsSending(true);
    try {
      const ok = await onSendMessage(subject, body, recipient);
      if (ok) {
        setSendSuccess(true);
        setSubject('');
        setBody('');
        setTimeout(() => {
          setSendSuccess(false);
          setActiveSubTab('inbox');
        }, 1500);
      }
    } finally {
      setIsSending(false);
    }
  };

  const selectedMsg = messages.find((m) => m.id === selectedMsgId) || messages[0];

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={activeSubTab}
        options={subTabOptions}
        onSelectSubTab={(id) => setActiveSubTab(id as 'inbox' | 'compose' | 'sent')}
      />

      <div className="px-4 sm:px-8 pb-8 space-y-6">
        <div className="border-b border-[#e6dfd5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00b7a8]" /> Executive Concierge &amp; Host Desk
            </h3>
            <p className="text-xs text-[#5c5046] mt-0.5">
              Encrypted direct communications with your California property management principals and fleet coordinators.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubTab('compose')}
            className="px-3.5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Message</span>
          </button>
        </div>

        {/* 1. COMPOSE TAB */}
        {activeSubTab === 'compose' && (
          <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 max-w-2xl shadow-2xs space-y-6">
            <div>
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Send In-App Communication
              </h4>
              <p className="text-xs text-[#5c5046] mt-0.5">
                Our California operations team monitors this portal actively 7 days a week.
              </p>
            </div>

            {sendSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message dispatched successfully to the designated concierge desk.</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1.5">
                  Designated Department *
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="concierge">Executive Hospitality Concierge (General Inquiries &amp; Requests)</option>
                  <option value="host">Property Hosts (Unit Access, Keys &amp; Maintenance)</option>
                  <option value="fleet">3D Fleet Coordinator (Vehicle Delivery &amp; Airport Staging)</option>
                  <option value="billing">Treasury &amp; Invoicing Division (Wire Confirmations)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1.5">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Early Check-In Coordination for Unit 91"
                  className="w-full px-3.5 h-10 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1.5">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Detail your inquiry, flight timeline, special stay accommodation, or housekeeping schedule..."
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#dcd4c8] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('inbox')}
                  className="px-4 py-2 text-xs font-bold text-[#5c5046] hover:text-[#282828] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. INBOX / THREADS TAB */}
        {activeSubTab !== 'compose' && (
          <>
            {messages.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No Inquiries or Messages"
                description="Your executive mailbox is currently empty. Direct messages and concierge updates will appear here."
                actionText="Compose New Message"
                onAction={() => setActiveSubTab('compose')}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Message List */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#82634f] px-1">
                    Inbox Communications ({messages.length})
                  </div>
                  {messages.map((msg) => {
                    const isSelected = selectedMsg?.id === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMsgId(msg.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-white border-[#00b7a8] shadow-sm'
                            : 'bg-white/80 hover:bg-white border-[#e6dfd5]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#282828] truncate">
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-[#857568] tabular-nums shrink-0">
                            {msg.timestamp}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-[#3a322c] truncate">
                          {msg.subject}
                        </h5>
                        <p className="text-[11px] text-[#5c5046] line-clamp-2 mt-1 leading-relaxed">
                          {msg.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Message Detail View */}
                <div className="lg:col-span-7">
                  {selectedMsg ? (
                    <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs">
                      <div className="border-b border-[#efe9e0] pb-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00b7a8]/10 text-[#00897d] flex items-center justify-center font-bold text-xs">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#282828]">
                                {selectedMsg.senderName}
                              </h4>
                              <p className="text-[10px] text-[#857568] uppercase font-mono">
                                Reference ID: {selectedMsg.id}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-[#857568] flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{selectedMsg.timestamp}</span>
                          </div>
                        </div>

                        <h3 className="font-heading font-black text-base text-[#282828] pt-2">
                          {selectedMsg.subject}
                        </h3>
                      </div>

                      <div className="text-xs sm:text-sm text-[#4a3f35] leading-relaxed whitespace-pre-line">
                        {selectedMsg.body}
                      </div>

                      <div className="pt-4 border-t border-[#efe9e0] bg-[#faf8f5] rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-[#282828] block flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#00b7a8]" /> Direct Operations Assistance
                        </span>
                        <p className="text-xs text-[#5c5046]">
                          Need urgent adjustments or on-site support? Reach our Sacramento regional dispatch directly:
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1">
                          <a
                            href="tel:9168003295"
                            className="flex items-center gap-1 text-[#00897d] hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" /> 916-800-3295
                          </a>
                          <a
                            href="mailto:easytravelagency@trustagent.space"
                            className="flex items-center gap-1 text-[#00897d] hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5" /> easytravelagency@trustagent.space
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-white border border-[#e6dfd5] rounded-2xl text-center text-xs text-[#857568]">
                      Select a message to view details.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
