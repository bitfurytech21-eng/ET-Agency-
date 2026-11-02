import React, { useState } from 'react';
import { SupportSubView, UserSupportTicket } from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  HelpCircle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  MessageSquare,
} from 'lucide-react';

interface SupportModuleProps {
  tickets: UserSupportTicket[];
  onCreateTicket: (payload: {
    category: string;
    priority: 'normal' | 'urgent';
    subject: string;
    message: string;
  }) => Promise<{ ok: boolean; message: string }>;
}

export const SupportModule: React.FC<SupportModuleProps> = ({ tickets, onCreateTicket }) => {
  const [subView, setSubView] = useState<SupportSubView>('index');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const [category, setCategory] = useState('Accommodation & Stay Assistance');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Support Overview' },
    { id: 'my-tickets', label: 'My Support Requests', badge: tickets.length },
    { id: 'submit-request', label: 'Submit a Request' },
    { id: 'faq', label: 'Stay & Rental FAQs' },
    { id: 'contact-support', label: 'Direct Concierge Contact' },
  ];

  const faqs = [
    {
      q: 'How do I access my residence on check-in day?',
      a: 'All residences use contactless digital keypads. Once your booking is confirmed, your 4-digit keypad code appears under Accommodation > Stay Details and activates at 3:00 PM on arrival day.',
    },
    {
      q: 'Where do I park my personal car or reserved fleet vehicle?',
      a: 'Every residence includes an assigned covered parking stall steps from your entry door. Your stall number is listed in your Stay Details panel.',
    },
    {
      q: 'How do I settle an invoice via Wire, ACH, or Zelle?',
      a: 'Open Payments & Invoices > Receiving Bank Details to copy our official Chase Bank routing credentials or Zelle corporate email (easytravelagency@trustagent.space), then submit your confirmation code under Submit Transfer Proof.',
    },
    {
      q: 'Can I modify my reservation dates or cancel online?',
      a: 'Yes. Open Accommodation or Car Rentals in your personal dashboard and select Modify Dates or Cancel on any active or pending reservation.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFeedback({ type: 'error', message: 'Please provide both a subject and message.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    const res = await onCreateTicket({
      category,
      priority,
      subject: subject.trim(),
      message: message.trim(),
    });
    setSubmitting(false);

    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
    if (res.ok) {
      setSubject('');
      setMessage('');
      setSubView('my-tickets');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as SupportSubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#282828]">
              Support &amp; Customer Assistance
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Submit a personal support ticket, browse stay FAQs, or contact our California concierge desk directly
            </p>
          </div>
          {subView !== 'submit-request' && (
            <button
              type="button"
              onClick={() => setSubView('submit-request')}
              className="px-4 py-2 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 w-fit"
            >
              New Support Request
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Overview */}
        {subView === 'index' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <Phone className="w-4 h-4 text-[#00897d]" />
                  <span>Direct Phone Line</span>
                </div>
                <p className="text-[#5c5046]">
                  Speak directly with our guest &amp; fleet coordination team.
                </p>
                <p className="font-bold text-sm text-[#282828] tabular-nums pt-1">916-800-3295</p>
              </div>
              <a
                href="tel:9168003295"
                className="text-xs font-bold text-[#00897d] hover:underline w-fit"
              >
                Call 916-800-3295
              </a>
            </div>

            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <Mail className="w-4 h-4 text-[#82634f]" />
                  <span>Official Email Desk</span>
                </div>
                <p className="text-[#5c5046]">
                  For corporate leases, billing statements, and reservation inquiries.
                </p>
                <p className="font-bold text-[#282828] break-all pt-1">
                  easytravelagency@trustagent.space
                </p>
              </div>
              <a
                href="mailto:easytravelagency@trustagent.space"
                className="text-xs font-bold text-[#00897d] hover:underline w-fit"
              >
                Send Email
              </a>
            </div>

            <div className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] flex flex-col justify-between space-y-4 tabular-nums">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#282828]">
                  <MessageSquare className="w-4 h-4 text-[#00897d]" />
                  <span>Support Tickets ({tickets.length})</span>
                </div>
                <p className="text-[#5c5046]">
                  Track requests linked directly to your personal User ID.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubView('my-tickets')}
                className="text-xs font-bold text-[#00897d] hover:underline cursor-pointer w-fit"
              >
                View My Tickets
              </button>
            </div>
          </div>
        )}

        {/* My Tickets */}
        {subView === 'my-tickets' &&
          (tickets.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No support tickets submitted"
              description="If you need assistance with a stay, car rental handover, or invoice, submit a ticket and track updates here."
              actionText="Submit a Request"
              onAction={() => setSubView('submit-request')}
            />
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 tabular-nums">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#82634f]">{t.ticketNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#5c5046]">{t.category}</span>
                      <span aria-hidden="true">·</span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <span className="text-[#857568]">{t.createdAt.split('T')[0]}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#282828]">{t.subject}</h4>
                  <p className="text-[#5c5046] leading-relaxed">{t.message}</p>
                </div>
              ))}
            </div>
          ))}

        {/* Submit Request */}
        {subView === 'submit-request' && (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
          >
            <h4 className="font-heading font-bold text-base text-[#282828]">
              Submit a Customer Assistance Request
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="Accommodation & Stay Assistance">
                    Accommodation &amp; Stay Assistance
                  </option>
                  <option value="Car Rental & Delivery">Car Rental &amp; Delivery</option>
                  <option value="Billing, Wire & Invoices">Billing, Wire &amp; Invoices</option>
                  <option value="Account & Profile">Account &amp; Profile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="normal">Standard Inquiry</option>
                  <option value="urgent">Urgent (Active Check-In / Handover)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of how we can help"
                className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include any relevant reservation ID, dates, or questions..."
                className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Support Ticket</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* FAQs */}
        {subView === 'faq' && (
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const open = expandedFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(open ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-heading font-bold text-sm text-[#282828]">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#82634f] transition-transform shrink-0 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {open && (
                    <div className="px-5 pb-4 text-xs text-[#5c5046] leading-relaxed border-t border-[#efe9e0] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Direct Contact */}
        {subView === 'contact-support' && (
          <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4 text-xs">
            <h4 className="font-heading font-bold text-base text-[#282828]">
              Easy Travel Lodging — Guest &amp; Corporate Desk
            </h4>
            <p className="text-[#5c5046] leading-relaxed">
              Our hospitality and fleet team is available daily for arrival assistance, corporate lease extensions, and billing verification.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 tabular-nums">
              <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                <span className="text-[#857568] block">Direct Telephone</span>
                <strong className="text-sm text-[#282828] block">916-800-3295</strong>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#efe9e0] space-y-1">
                <span className="text-[#857568] block">Official Email</span>
                <strong className="text-sm text-[#282828] block break-all">
                  easytravelagency@trustagent.space
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
