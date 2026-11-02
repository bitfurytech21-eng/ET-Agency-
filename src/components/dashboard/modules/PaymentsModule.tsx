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
  balanceUsd?: number;
  unitsBalance?: number;
  userSession?: UserSession;
  paymentAccounts?: PaymentAccountInfo | null;
  availableTargets?: PayableTargetOption[];
  onOpenTopUpUnits?: () => void;
  onSubmitManualPayment?: (payload: {
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
  onUploadProof?: (refCode: string, bank: string, sender: string, fileNotes: string) => Promise<boolean>;
  onApprovePayment?: (paymentId: string) => void;
  onRejectPayment?: (paymentId: string) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  balanceUsd = 0,
  unitsBalance = 0,
  userSession,
  paymentAccounts = null,
  availableTargets = [],
  onOpenTopUpUnits = () => {},
  onSubmitManualPayment,
  onUploadProof,
}) => {
  const [subView, setSubView] = useState<PaymentsSubView>('index');
  const [receiptPayment, setReceiptPayment] = useState<UserPaymentRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [selectedTargetKey, setSelectedTargetKey] = useState<string>('units:');
  const [amountUsd, setAmountUsd] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<
    'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate'
  >('Wire Transfer');
  const [senderName, setSenderName] = useState<string>(userSession?.name || 'Alexander Sterling');
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
    let res = { ok: true, message: 'Transfer proof submitted for accounting review.' };
    if (onSubmitManualPayment) {
      res = await onSubmitManualPayment({
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
    } else if (onUploadProof) {
      const ok = await onUploadProof(
        wireReference.trim(),
        originatingBank.trim() || 'Client Bank',
        senderName.trim(),
        notes.trim(),
      );
      res = { ok, message: ok ? 'Remittance notice registered.' : 'Unable to register proof.' };
    }
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
    bankName: 'Associated Bank',
    accountName: 'Heather Frederick',
    accountNumber: '2913762643',
    achRoutingNumber: '075900575',
    wireRoutingNumber: '075900575',
    swiftCode: 'ASBDUS44',
    zelleEmail: 'easytravelagency@trustagent.space',
    corporateMailingAddress: '400 S Chestnut Ave, Marshfield, WI 54449, USA',
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

      <div className="space-y-6">
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 tabular-nums">
          <div className="space-y-1">
            <div className="flex items-center gap-2 type-support text-slate-300">
              <Wallet className="w-4 h-4 text-[#5eead4]" />
              <span>Account Treasury Balance</span>
            </div>
            <div className="type-h2 text-white">
              ${balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
            <div className="type-support text-slate-400">
              {unitsBalance} Lodging Units · {settledPayments.length} settled · {pendingPayments.length} pending verification
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTopUpUnits}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Account Funds</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('upload-payment-proof')}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 type-btn flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-4 h-4 text-[#5eead4]" />
              <span>Submit Transfer Proof</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border type-support flex items-start gap-2.5 ${
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

        {subView === 'payment-details' && (
          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5">
            <div>
              <h3 className="type-h3 text-[#0f172a]">
                Official Receiving Bank &amp; Remittance Instructions
              </h3>
              <p className="type-body text-slate-500 mt-1">{bank.paymentInstructions}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 type-support tabular-nums">
              {[
                { label: 'Beneficiary Institution', value: bank.bankName },
                { label: 'Beneficiary Account Name', value: bank.accountName },
                { label: 'Account Number', value: bank.accountNumber },
                { label: 'ACH Routing Number', value: bank.achRoutingNumber },
                { label: 'Domestic Wire Routing', value: bank.wireRoutingNumber },
                { label: 'International SWIFT', value: bank.swiftCode },
                { label: 'Zelle Corporate Email', value: bank.zelleEmail },
                { label: 'Reference Memo', value: `User ID ${userSession?.id || 'USR-CORP'}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="type-support text-slate-500 block">{item.label}</span>
                    <strong className="font-mono type-support text-[#0f172a] truncate block mt-0.5">
                      {item.value}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.label, item.value)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:border-[#14616d] text-slate-600 hover:text-[#14616d] cursor-pointer shrink-0"
                    title={`Copy ${item.label}`}
                  >
                    {copiedField === item.label ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="type-support text-slate-600 pt-3 border-t border-slate-100">
              Mailing Address: <strong className="text-[#0f172a]">{bank.corporateMailingAddress}</strong> · Accounting Desk:{' '}
              <strong className="text-[#0f172a]">easytravelagency@trustagent.space</strong>
            </div>
          </div>
        )}

        {subView === 'upload-payment-proof' && (
          <form
            onSubmit={handleSubmitProof}
            className="max-w-2xl p-6 rounded-2xl border border-slate-200 bg-white space-y-4"
          >
            <div>
              <h3 className="type-h3 text-[#0f172a]">
                Submit Wire, ACH, or Zelle Remittance Proof
              </h3>
              <p className="type-body text-slate-500 mt-1">
                Link your bank transfer confirmation to an active reservation or add funds to your balance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Apply Payment Toward *</label>
                <select
                  value={selectedTargetKey}
                  onChange={(e) => handleTargetSelection(e.target.value)}
                  className="form-select"
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
                <label className="form-label">Transfer Amount (USD) *</label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Payment Channel *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate',
                    )
                  }
                  className="form-select"
                >
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Direct ACH">Direct ACH</option>
                  <option value="Zelle Corporate">Zelle Corporate</option>
                </select>
              </div>

              <div>
                <label className="form-label">Transfer Date *</label>
                <input
                  type="date"
                  required
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="form-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Sender Account Name *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Account holder or company name"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Originating Bank Name *</label>
                <input
                  type="text"
                  required
                  value={originatingBank}
                  onChange={(e) => setOriginatingBank(e.target.value)}
                  placeholder="e.g. Wells Fargo, Citibank, Chase"
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Wire / ACH / Zelle Reference Code *</label>
                <input
                  type="text"
                  required
                  value={wireReference}
                  onChange={(e) => setWireReference(e.target.value)}
                  placeholder="IMAD / Trace / Confirmation #"
                  className="form-input font-mono"
                />
              </div>

              <div>
                <label className="form-label">Receipt Document (Optional, Max 4 MB)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-lg type-support text-slate-600"
                />
                {receiptFileName && (
                  <span className="type-support text-[#14616d] font-semibold block mt-1">
                    Attached: {receiptFileName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Accounting Memo (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional invoice or booking reference note..."
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm disabled:opacity-50"
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

        {subView === 'invoices' &&
          (payments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices generated yet"
              description="Invoices and printable payment statements are automatically generated when you submit a payment or complete a booking settlement."
            />
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Method</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Statement</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-mono font-semibold text-[#0f172a]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="text-slate-600">{inv.date}</td>
                      <td className="text-[#0f172a] font-medium">{inv.description}</td>
                      <td className="text-slate-600">{inv.paymentMethod}</td>
                      <td className="text-right font-bold text-[#0f172a]">
                        ${inv.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => setReceiptPayment(inv)}
                          className="btn btn-outline btn-sm"
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
