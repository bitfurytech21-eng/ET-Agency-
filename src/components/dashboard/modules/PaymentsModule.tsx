import React, { useState } from 'react';
import {
  PaymentAccountInfo,
  PaymentsSubView,
  UserPaymentRecord,
  UserSession,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { PaymentCard } from '../components/PaymentCard';
import { EmptyState } from '../components/EmptyState';
import { TransactionReceiptModal } from '../components/TransactionReceiptModal';
import {
  CreditCard,
  Landmark,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  PlusCircle,
  Wallet,
} from 'lucide-react';

export interface PayableTargetOption {
  id: string;
  targetType: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
  label: string;
  suggestedAmountUsd?: number;
}

interface PaymentsModuleProps {
  payments: UserPaymentRecord[];
  balanceUsd: number;
  unitsBalance: number;
  userSession: UserSession;
  paymentAccounts: PaymentAccountInfo | null;
  availableTargets: PayableTargetOption[];
  onOpenTopUpUnits: () => void;
  onSubmitManualPayment: (payload: {
    targetType: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
    targetId?: string;
    amountUsd: number;
    paymentMethod: 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate';
    senderName: string;
    originatingBank: string;
    wireReference: string;
    transferDate: string;
    receiptFileName?: string;
    receiptDataUrl?: string;
    notes?: string;
  }) => Promise<{ ok: boolean; message: string }>;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  balanceUsd,
  unitsBalance,
  userSession,
  paymentAccounts,
  availableTargets,
  onOpenTopUpUnits,
  onSubmitManualPayment,
}) => {
  const [subView, setSubView] = useState<PaymentsSubView>('index');
  const [receiptPayment, setReceiptPayment] = useState<UserPaymentRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submit Transfer Proof state
  const [selectedTargetKey, setSelectedTargetKey] = useState<string>('units:');
  const [amountUsd, setAmountUsd] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<
    'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate'
  >('Wire Transfer');
  const [senderName, setSenderName] = useState<string>(userSession.name);
  const [originatingBank, setOriginatingBank] = useState<string>('');
  const [wireReference, setWireReference] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(
    () => new Date().toISOString().split('T')[0],
  );
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const settledPayments = payments.filter((p) => p.status === 'settled');

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Overview & Ledger', badge: payments.length },
    { id: 'payment-history', label: 'Settled History', badge: settledPayments.length },
    { id: 'pending-payments', label: 'Pending Verification', badge: pendingPayments.length },
    { id: 'payment-details', label: 'Receiving Bank Details' },
    { id: 'upload-payment-proof', label: 'Submit Transfer Proof' },
    { id: 'invoices', label: 'Invoices & Receipts', badge: payments.length },
  ];

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Attachment must be smaller than 4 MB.' });
      return;
    }
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTargetSelection = (val: string) => {
    setSelectedTargetKey(val);
    const [tType, tId] = val.split(':');
    const found = availableTargets.find((t) => t.targetType === tType && t.id === tId);
    if (found?.suggestedAmountUsd && found.suggestedAmountUsd > 0) {
      setAmountUsd(String(found.suggestedAmountUsd));
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amountUsd);
    if (!numericAmount || numericAmount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid USD transfer amount.' });
      return;
    }
    if (!senderName.trim() || !wireReference.trim()) {
      setFeedback({
        type: 'error',
        message: 'Sender account name and wire/ACH confirmation reference are required.',
      });
      return;
    }

    const [rawType, rawId] = selectedTargetKey.split(':');
    const targetType = (
      ['units', 'housing_booking', 'vehicle_booking', 'order'].includes(rawType) ? rawType : 'units'
    ) as 'units' | 'housing_booking' | 'vehicle_booking' | 'order';

    setSubmitting(true);
    setFeedback(null);
    const res = await onSubmitManualPayment({
      targetType,
      targetId: rawId || undefined,
      amountUsd: numericAmount,
      paymentMethod,
      senderName: senderName.trim(),
      originatingBank: originatingBank.trim() || 'Client Financial Institution',
      wireReference: wireReference.trim(),
      transferDate,
      receiptFileName: receiptFileName || undefined,
      receiptDataUrl: receiptDataUrl || undefined,
      notes: notes.trim() || undefined,
    });
    setSubmitting(false);

    setFeedback({ type: res.ok ? 'success' : 'error', message: res.message });
    if (res.ok) {
      setWireReference('');
      setReceiptFileName('');
      setReceiptDataUrl('');
      setNotes('');
      setSubView('pending-payments');
    }
  };

  const bank = paymentAccounts || {
    bankName: 'Chase Bank, N.A.',
    accountName: 'Easy Travel Lodging LLC',
    accountNumber: '8492017462',
    achRoutingNumber: '322271627',
    wireRoutingNumber: '021000021',
    swiftCode: 'CHASUS33',
    zelleEmail: 'easytravelagency@trustagent.space',
    corporateMailingAddress: 'Easy Travel Lodging LLC · 10940 White Rock Rd, Rancho Cordova, CA 95670',
    paymentInstructions:
      'Include your Booking Reference or User ID in the transfer memo for rapid reconciliation.',
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => {
          setFeedback(null);
          setSubView(id as PaymentsSubView);
        }}
      />

      <div className="px-4 sm:px-8 pb-6 space-y-6">
        {/* Summary Bar */}
        <div className="bg-[#241d18] text-white rounded-2xl p-6 border border-[#3f332b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 tabular-nums">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#d6c7b8]">
              <Wallet className="w-4 h-4 text-[#4de0d2]" />
              <span>Personal Account Balance</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black text-white">
              ${balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
            <div className="text-xs text-[#b8a99a]">
              {unitsBalance} Lodging Units · {settledPayments.length} settled · {pendingPayments.length} pending verification
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTopUpUnits}
              className="px-4 py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Account Funds</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('upload-payment-proof')}
              className="px-4 py-2.5 rounded-xl bg-[#322720] hover:bg-[#41332a] border border-[#4f3f34] text-[#ede5dc] text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4 text-[#4de0d2]" />
              <span>Submit Transfer Proof</span>
            </button>
          </div>
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

        {/* Overview & Ledger */}
        {subView === 'index' &&
          (payments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payment or invoice records yet"
              description="Settled transactions, wire transfer verifications, and official invoices for your account will appear here."
              actionText="View Receiving Bank Details"
              onAction={() => setSubView('payment-details')}
            />
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onViewInvoice={(p) => setReceiptPayment(p)}
                  onViewReceipt={(p) => setReceiptPayment(p)}
                />
              ))}
            </div>
          ))}

        {/* Settled History */}
        {subView === 'payment-history' &&
          (settledPayments.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No settled payments yet"
              description="Once a transfer or account settlement is verified, it will be listed here with a printable receipt."
            />
          ) : (
            <div className="space-y-4">
              {settledPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onViewInvoice={(p) => setReceiptPayment(p)}
                  onViewReceipt={(p) => setReceiptPayment(p)}
                />
              ))}
            </div>
          ))}

        {/* Pending Verification */}
        {subView === 'pending-payments' &&
          (pendingPayments.length === 0 ? (
            <EmptyState
              icon={Landmark}
              title="No transfers pending verification"
              description="All submitted wire, ACH, or Zelle payment notices have been processed."
              actionText="Submit New Transfer Proof"
              onAction={() => setSubView('upload-payment-proof')}
            />
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onViewInvoice={(p) => setReceiptPayment(p)}
                  onViewReceipt={(p) => setReceiptPayment(p)}
                />
              ))}
            </div>
          ))}

        {/* Receiving Bank Details */}
        {subView === 'payment-details' && (
          <div className="p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-5">
            <div>
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Official Receiving Bank &amp; Remittance Instructions
              </h4>
              <p className="text-xs text-[#6e5d50] mt-0.5">{bank.paymentInstructions}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tabular-nums">
              {[
                { label: 'Beneficiary Institution', value: bank.bankName },
                { label: 'Beneficiary Account Name', value: bank.accountName },
                { label: 'Account Number', value: bank.accountNumber },
                { label: 'ACH Routing Number', value: bank.achRoutingNumber },
                { label: 'Domestic Wire Routing', value: bank.wireRoutingNumber },
                { label: 'International SWIFT', value: bank.swiftCode },
                { label: 'Zelle Corporate Email', value: bank.zelleEmail },
                { label: 'Reference Memo', value: `User ID ${userSession.id}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 bg-white rounded-xl border border-[#efe9e0] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] text-[#857568] block">{item.label}</span>
                    <strong className="font-mono text-xs text-[#282828] truncate block mt-0.5">
                      {item.value}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.label, item.value)}
                    className="p-2 rounded-lg border border-[#e6dfd5] hover:border-[#00b7a8] text-[#5c5046] hover:text-[#00897d] cursor-pointer shrink-0"
                    title={`Copy ${item.label}`}
                  >
                    {copiedField === item.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-xs text-[#5c5046] pt-2 border-t border-[#e6dfd5]">
              Mailing Address: <strong>{bank.corporateMailingAddress}</strong> · Accounting Desk:{' '}
              <strong>easytravelagency@trustagent.space</strong>
            </div>
          </div>
        )}

        {/* Submit Transfer Proof */}
        {subView === 'upload-payment-proof' && (
          <form
            onSubmit={handleSubmitProof}
            className="max-w-2xl p-6 rounded-2xl border border-[#e6dfd5] bg-[#faf8f5] space-y-4"
          >
            <div>
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Submit Wire, ACH, or Zelle Remittance Proof
              </h4>
              <p className="text-xs text-[#6e5d50] mt-0.5">
                Link your bank transfer confirmation to an active reservation or add funds to your personal balance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Apply Payment Toward *
                </label>
                <select
                  value={selectedTargetKey}
                  onChange={(e) => handleTargetSelection(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="units:">Add Account Funds / Lodging Units</option>
                  {availableTargets.map((t) => (
                    <option key={`${t.targetType}:${t.id}`} value={`${t.targetType}:${t.id}`}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Transfer Amount (USD) *
                </label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Payment Channel *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate',
                    )
                  }
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                >
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Direct ACH">Direct ACH</option>
                  <option value="Zelle Corporate">Zelle Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Transfer Date *
                </label>
                <input
                  type="date"
                  required
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Sender Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Account holder or company name"
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Originating Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={originatingBank}
                  onChange={(e) => setOriginatingBank(e.target.value)}
                  placeholder="e.g. Wells Fargo, Citibank, Chase"
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Wire / ACH / Zelle Reference Code *
                </label>
                <input
                  type="text"
                  required
                  value={wireReference}
                  onChange={(e) => setWireReference(e.target.value)}
                  placeholder="IMAD / Trace / Confirmation #"
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none focus:border-[#00b7a8] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#282828] mb-1">
                  Receipt Document (Optional, Max 4 MB)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full h-10 px-2.5 py-1.5 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#5c5046]"
                />
                {receiptFileName && (
                  <span className="text-[11px] text-[#00897d] font-semibold block mt-1">
                    Attached: {receiptFileName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#282828] mb-1">
                Accounting Memo (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional invoice or booking reference note..."
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
                  <span>Submitting Notice...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submit Transfer Confirmation</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Invoices & Receipts */}
        {subView === 'invoices' &&
          (payments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices generated yet"
              description="Invoices and printable payment statements are automatically generated when you submit a payment or complete a booking settlement."
            />
          ) : (
            <div className="overflow-x-auto border border-[#e6dfd5] rounded-2xl bg-white">
              <table className="w-full text-left text-xs tabular-nums">
                <thead className="bg-[#faf8f5] border-b border-[#e6dfd5] text-[#6e5d50]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Invoice #</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Description</th>
                    <th className="py-3 px-4 font-bold">Method</th>
                    <th className="py-3 px-4 font-bold text-right">Amount</th>
                    <th className="py-3 px-4 font-bold text-right">Statement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efe9e0]">
                  {payments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-4 font-mono font-bold text-[#282828]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-[#5c5046]">{inv.date}</td>
                      <td className="py-3 px-4 text-[#282828] font-medium">{inv.description}</td>
                      <td className="py-3 px-4 text-[#5c5046]">{inv.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#00897d]">
                        ${inv.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setReceiptPayment(inv)}
                          className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] hover:border-[#00b7a8] text-xs font-semibold text-[#282828] cursor-pointer whitespace-nowrap"
                        >
                          Open Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      <TransactionReceiptModal
        isOpen={Boolean(receiptPayment)}
        onClose={() => setReceiptPayment(null)}
        payment={receiptPayment}
        userSession={userSession}
        paymentAccounts={paymentAccounts}
      />
    </div>
  );
};
