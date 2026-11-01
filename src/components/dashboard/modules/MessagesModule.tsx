import React, { useState } from 'react';
import { UserMessageItem, UserSupportTicket, MessagesSubView } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { EmptyState } from '../components/EmptyState';
import {
  MessageSquare,
  Send,
  LifeBuoy,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface MessagesModuleProps {
  messages: UserMessageItem[];
  onSendMessage: (subject: string, body: string, recipient: string) => Promise<boolean>;
}

export const MessagesModule: React.FC<MessagesModuleProps> = ({
  messages,
  onSendMessage,
}) => {
  const [subView, setSubView] = useState<MessagesSubView>('conversations');
  const [activeMessageId, setActiveMessageId] = useState<string>(messages[0]?.id || '');

  // New message composer state
  const [recipient, setRecipient] = useState('Host Concierge (Bill & Marlena)');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Support tickets dummy state
  const [tickets, setTickets] = useState<UserSupportTicket[]>([
    {
      id: 'TCK-1092',
      category: 'Access / Keyless',
      subject: 'Secondary family member smart lock code request',
      status: 'resolved',
      priority: 'normal',
      createdAt: '2026-10-25',
      updatedAt: '2026-10-25',
      messagesCount: 3,
    },
    {
      id: 'TCK-1098',
      category: 'Fleet Vehicle',
      subject: 'Airport terminal concierge flight arrival delay update',
      status: 'in_progress',
      priority: 'urgent',
      createdAt: '2026-10-30',
      updatedAt: '2026-10-31',
      messagesCount: 4,
    },
  ]);

  const subTabOptions: SubTabOption[] = [
    { id: 'conversations', label: 'Conversations', fileName: 'conversations.php', badge: messages.filter((m) => !m.isRead).length },
    { id: 'new-message', label: 'Compose Message', fileName: 'new-message.php' },
    { id: 'support-tickets', label: 'Support Tickets', fileName: 'support-tickets.php', badge: tickets.filter((t) => t.status !== 'resolved').length },
  ];

  const activeMsg = messages.find((m) => m.id === activeMessageId) || messages[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const ok = await onSendMessage(msgSubject, msgBody, recipient);
    setIsSending(false);
    if (ok) {
      setSendSuccess(true);
      setMsgSubject('');
      setMsgBody('');
      setTimeout(() => {
        setSendSuccess(false);
        setSubView('conversations');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Messages/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as MessagesSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {/* 1. Conversations (conversations.php) */}
        {subView === 'conversations' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Left Column: Messages List */}
            <div className="md:col-span-5 border-r border-[#e6dfd5] p-4 space-y-2 bg-[#faf8f5]">
              <div className="flex items-center justify-between pb-2 border-b border-[#e6dfd5]">
                <h4 className="font-heading font-bold text-sm text-[#282828]">Direct Host Threads</h4>
                <button
                  type="button"
                  onClick={() => setSubView('new-message')}
                  className="text-xs font-bold text-[#00b7a8] hover:underline"
                >
                  + New
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-xs text-[#5c5046] p-4 text-center">No messages yet.</p>
              ) : (
                messages.map((m) => {
                  const isSelected = m.id === activeMessageId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMessageId(m.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white shadow-2xs border border-[#00b7a8]'
                          : 'hover:bg-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#282828] truncate">{m.senderName}</span>
                        <span className="text-[10px] text-[#857568]">{m.timestamp}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-[#5c5046] mt-0.5 truncate">{m.subject}</h5>
                      <p className="text-[11px] text-[#857568] line-clamp-1 mt-0.5">{m.body}</p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Column: Active Conversation */}
            <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
              {activeMsg ? (
                <>
                  <div className="space-y-3">
                    <div className="border-b border-[#efe9e0] pb-3 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-heading font-bold text-base text-[#282828]">{activeMsg.subject}</h4>
                        <span className="text-xs text-[#00897d] font-semibold">
                          From: {activeMsg.senderName} ({activeMsg.sender})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#857568]">{activeMsg.timestamp}</span>
                    </div>

                    <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] text-xs text-[#3d352e] leading-relaxed whitespace-pre-wrap">
                      {activeMsg.body}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#efe9e0] space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Type a quick reply to Bill & Marlena..."
                      className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => alert('Reply transmitted to concierge.')}
                        className="px-4 py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center my-auto text-xs text-[#5c5046]">
                  Select a message thread from the left list.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Compose New Message (new-message.php) */}
        {subView === 'new-message' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Send Message to Concierge (new-message.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Direct line to hosts Bill &amp; Marlena and 24/7 client dispatch.
              </p>
            </div>

            {sendSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message dispatched successfully.</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Recipient</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-semibold text-[#282828]"
                >
                  <option value="Host Concierge (Bill & Marlena)">Host Concierge (Bill &amp; Marlena)</option>
                  <option value="3D Fleet Logistics Desk">3D Fleet Logistics Desk (Airport Handover)</option>
                  <option value="Accounting & Corporate Billing">Accounting &amp; Corporate Billing</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Additional parking space inquiry or flight arrival change"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                />
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubView('conversations')}
                  className="px-4 py-2 rounded-xl border border-[#d8cfc3] text-[#5c5046] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. Support Tickets (support-tickets.php) */}
        {subView === 'support-tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Maintenance &amp; Support Tickets (support-tickets.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Track HVAC service, keyless lock assistance, and high-priority stay tickets.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-5 bg-white border border-[#e6dfd5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#82634f]">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-[#857568]">[{t.category}]</span>
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#282828]">{t.subject}</h5>
                    <span className="text-[11px] text-[#857568]">Opened on {t.createdAt} • Priority: {t.priority}</span>
                  </div>

                  <span className="text-xs font-bold text-[#00b7a8]">{t.messagesCount} Updates</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
