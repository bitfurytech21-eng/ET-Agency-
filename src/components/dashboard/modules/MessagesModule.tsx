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

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState('concierge');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const subTabOptions: SubTabOption[] = [
    { id: 'inbox', label: 'Inbox & Threads', badge: unreadCount },
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
        }, 1400);
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

      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0f172a] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#14616d]" /> Executive Concierge &amp; Host Desk
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct communications with your California property management team and fleet coordinators.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubTab('compose')}
            className="btn btn-primary btn-sm self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Message</span>
          </button>
        </div>

        {activeSubTab === 'compose' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6">
            <div>
              <h4 className="font-heading font-bold text-base text-[#0f172a]">
                Send Direct Communication
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our California operations team monitors this workspace 7 days a week.
              </p>
            </div>

            {sendSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message dispatched to the designated concierge desk.</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="form-label">Designated Department *</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="form-select"
                >
                  <option value="concierge">Hospitality Concierge (General Inquiries &amp; Requests)</option>
                  <option value="host">Property Hosts (Unit Access, Keys &amp; Maintenance)</option>
                  <option value="fleet">Fleet Coordinator (Vehicle Delivery &amp; Airport Staging)</option>
                  <option value="billing">Treasury &amp; Invoicing Division (Wire Confirmations)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Early Check-In Coordination for Suite 104"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Message Details *</label>
                <textarea
                  required
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Detail your inquiry, flight timeline, stay accommodation, or housekeeping schedule..."
                  className="form-textarea resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('inbox')}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn-primary btn-sm disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab !== 'compose' && (
          <>
            {messages.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No Inquiries or Messages"
                description="Your mailbox is currently empty. Direct messages and concierge updates will appear here."
                actionText="Compose New Message"
                onAction={() => setActiveSubTab('compose')}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-2">
                  <div className="text-xs font-semibold text-slate-500 px-1">
                    Communications ({messages.length})
                  </div>
                  {messages.map((msg) => {
                    const isSelected = selectedMsg?.id === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMsgId(msg.id)}
                        className={`p-4 rounded-2xl border transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#edf6f8]/60 border-[#14616d]'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-[#0f172a] truncate">
                            {msg.senderName}
                          </span>
                          <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                            {msg.timestamp}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 truncate">
                          {msg.subject}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {msg.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-7">
                  {selectedMsg ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
                      <div className="border-b border-slate-100 pb-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#edf6f8] text-[#14616d] flex items-center justify-center font-bold text-xs">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#0f172a]">
                                {selectedMsg.senderName}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                                Reference: {selectedMsg.id}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 tabular-nums">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{selectedMsg.timestamp}</span>
                          </div>
                        </div>

                        <h3 className="font-heading font-bold text-base text-[#0f172a] pt-2">
                          {selectedMsg.subject}
                        </h3>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {selectedMsg.body}
                      </div>

                      <div className="pt-4 border-t border-slate-100 bg-slate-50 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#14616d]" /> Direct Operations Assistance
                        </span>
                        <p className="text-xs text-slate-600">
                          Need urgent adjustments or on-site support? Reach our Sacramento regional dispatch directly:
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1">
                          <a
                            href="tel:9168003295"
                            className="flex items-center gap-1 text-[#14616d] hover:underline tabular-nums"
                          >
                            <Phone className="w-3.5 h-3.5" /> 916-800-3295
                          </a>
                          <a
                            href="mailto:easytravelagency@trustagent.space"
                            className="flex items-center gap-1 text-[#14616d] hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5" /> easytravelagency@trustagent.space
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
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
