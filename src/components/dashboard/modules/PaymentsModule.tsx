import React, { useState } from 'react';
import {
  UserPaymentRecord,
  PaymentsSubView,
} from '../types';
import { DashboardNav, SubTabOption } from '../includes/DashboardNav';
import { PaymentCard } from '../components/PaymentCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { TransactionReceiptModal } from '../components/TransactionReceiptModal';
import {
  CreditCard,
  Landmark,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Printer,
  Coins,
  ShieldCheck,
} from 'lucide-react';

interface PaymentsModuleProps {
  payments: UserPaymentRecord[];
  unitsBalance: number;
  onOpenTopUpUnits: () => void;
  onUploadProof: (refCode: string, bank: string, sender: string, fileNotes: string) => Promise<boolean>;
  onApprovePayment?: (paymentId: string) => void;
  onRejectPayment?: (paymentId: string) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  payments,
  unitsBalance,
  onOpenTopUpUnits,
  onUploadProof,
  onApprovePayment,
  onRejectPayment,
}) => {
  const [subView, setSubView] = useState<PaymentsSubView>('index');
  const [selectedPayment, setSelectedPayment] = useState<UserPaymentRecord | null>(
    payments[0] || null
  );
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Upload Proof Form
  const [uploadRefCode, setUploadRefCode] = useState('');
  const [uploadBank, setUploadBank] = useState('Chase Bank / Commercial Treasury');
  const [uploadSender, setUploadSender] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const subTabOptions: SubTabOption[] = [
    { id: 'index', label: 'Payment Center', fileName: 'index.php', badge: payments.length },
    { id: 'payment-history', label: 'History', fileName: 'payment-history.php' },
    { id: 'pending-payments', label: 'Pending Wires', fileName: 'pending-payments.php' },
    { id: 'payment-details', label: 'Bank Instructions', fileName: 'payment-details.php' },
    { id: 'payment-methods', label: 'Payment Methods', fileName: 'payment-methods.php' },
    { id: 'upload-payment-proof', label: 'Upload Proof', fileName: 'upload-payment-proof.php' },
    { id: 'invoices', label: 'Invoices', fileName: 'invoices.php' },
    { id: 'receipts', label: 'Tax Receipts', fileName: 'receipts.php' },
  ];

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const settledPayments = payments.filter((p) => p.status === 'settled');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onUploadProof(uploadRefCode, uploadBank, uploadSender, uploadNotes);
    if (ok) {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSubView('payment-history');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardNav
        currentFolder="UserDashboard/Payments/"
        activeSubTab={subView}
        options={subTabOptions}
        onSelectSubTab={(id) => setSubView(id as PaymentsSubView)}
      />

      <div className="px-4 sm:px-8 space-y-6">
        {/* 1. Payment Center (index.php) */}
        {subView === 'index' && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#e6dfd5] rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00897d]">
                  <Landmark className="w-4 h-4" />
                  <span>Corporate Treasury &amp; Per Diem Ledger</span>
                </div>
                <h3 className="font-heading font-black text-2xl text-[#282828]">
                  Client Balance &amp; Settlement Center
                </h3>
                <p className="text-xs text-[#5c5046] max-w-xl leading-relaxed">
                  Track direct domestic wire transfers, ACH clearing notices, corporate invoicing, and tax-exempt monthly housing statements.
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#efe9e0] text-center min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-[#857568] block">Account USD Balance</span>
                <span className="text-2xl font-black text-[#00897d] block tabular-nums">
                  ${(unitsBalance * 100).toLocaleString()} USD
                </span>
                <span className="text-[11px] text-[#5c5046] block mb-2">
                  Verified Treasury Funds
                </span>
                <button
                  type="button"
                  onClick={onOpenTopUpUnits}
                  className="w-full py-1.5 bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  + Top-Up Balance
                </button>
              </div>
            </div>

            <div className="border-b border-[#e6dfd5] pb-3 flex items-center justify-between">
              <h4 className="font-heading font-bold text-base text-[#282828]">
                Recent Remittances &amp; Transactions
              </h4>
              <button
                type="button"
                onClick={() => setSubView('upload-payment-proof')}
                className="text-xs font-bold text-[#00b7a8] hover:underline"
              >
                + Upload Wire Remittance Slip
              </button>
            </div>

            {payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No Payment Records Found"
                description="Your reconciled invoices, ACH settlements, and account fund transfers will appear here."
              />
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <PaymentCard
                    key={p.id}
                    payment={p}
                    onViewInvoice={(pay) => {
                      setSelectedPayment(pay);
                      setSubView('invoices');
                    }}
                    onViewReceipt={(pay) => {
                      setSelectedPayment(pay);
                      setIsReceiptModalOpen(true);
                    }}
                    onApprove={(pay) => onApprovePayment?.(pay.id)}
                    onReject={(pay) => onRejectPayment?.(pay.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Payment History (payment-history.php) */}
        {subView === 'payment-history' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Settlement &amp; Remittance History (payment-history.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                All completed bank transfers, card authorizations, and account balance payments.
              </p>
            </div>

            <div className="space-y-3">
              {settledPayments.map((p) => (
                <PaymentCard
                  key={p.id}
                  payment={p}
                  onViewInvoice={(pay) => {
                    setSelectedPayment(pay);
                    setSubView('invoices');
                  }}
                  onViewReceipt={(pay) => {
                    setSelectedPayment(pay);
                    setIsReceiptModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Pending Payments (pending-payments.php) */}
        {subView === 'pending-payments' && (
          <div className="space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#282828]">
                  Pending Verifications &amp; Admin Approvals (pending-payments.php)
                </h3>
                <p className="text-xs text-[#5c5046]">
                  Manual top-ups stay pending until a treasury admin approves the transfer.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-bold shrink-0">
                {pendingPayments.length} Pending Approval
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All Payments Reconciled"
                description="There are currently zero pending bank transfers or unverified slips."
              />
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((p) => (
                  <PaymentCard
                    key={p.id}
                    payment={p}
                    onApprove={(pay) => onApprovePayment?.(pay.id)}
                    onReject={(pay) => onRejectPayment?.(pay.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Bank Instructions (payment-details.php) */}
        {subView === 'payment-details' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Direct Corporate Wire &amp; ACH Routing (payment-details.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Official wire credentials for accounts payable, corporate travel desks, and per diem settlements.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Zero transaction fees. Domestic wires clear in 1–2 business hours upon receipt.</span>
            </div>

            <div className="divide-y divide-[#efe9e0] text-xs">
              {[
                { label: 'Beneficiary Name', val: 'Easy Travel Lodging LLC', id: 'name' },
                { label: 'Receiving Bank', val: 'Bank of America, N.A.', id: 'bank' },
                { label: 'Bank Address', val: 'Corporate Treasury Hub, Charlotte, NC', id: 'addr' },
                { label: 'Routing / ABA (Domestic Wire)', val: '121000358', id: 'wire_aba' },
                { label: 'Routing / ACH (Direct Deposit)', val: '121042882', id: 'ach_aba' },
                { label: 'Account Number', val: '325088219441', id: 'acct' },
                { label: 'Account Type', val: 'Commercial Checking / Operating Escrow', id: 'type' },
              ].map((row) => (
                <div key={row.id} className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-[#5c5046]">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#282828]">{row.val}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(row.val, row.id)}
                      className="p-1 text-[#857568] hover:text-[#00b7a8] cursor-pointer"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedField === row.id && (
                      <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Payment Methods (payment-methods.php) */}
        {subView === 'payment-methods' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Accepted Payment Methods (payment-methods.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Configure corporate settlement preferences, direct deposit, or instant account balance settlements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
                <span className="text-sm font-bold text-[#282828] block flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#00b7a8]" /> Account USD Balance
                </span>
                <p className="text-[#5c5046]">
                  Immediate 1-click checkout for suites, vehicles, and amenities with zero credit card merchant fees.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Primary Account Balance
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
                <span className="text-sm font-bold text-[#282828] block flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#00b7a8]" /> Domestic Wire Transfer
                </span>
                <p className="text-[#5c5046]">
                  Same-day commercial wire routing directly to our verified Bank of America operating escrow.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                  Preferred for Corporate Invoices
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e6dfd5] space-y-2">
                <span className="text-sm font-bold text-[#282828] block flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#82634f]" /> Direct ACH / Direct Deposit
                </span>
                <p className="text-[#5c5046]">
                  Standard Automated Clearing House transfers for multi-month housing reimbursements and healthcare travel nurse stipends.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Standard 1-3 Business Days
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Upload Payment Proof (upload-payment-proof.php) */}
        {subView === 'upload-payment-proof' && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#e6dfd5] pb-4">
              <h3 className="font-heading font-bold text-lg text-[#282828]">
                Upload Wire / ACH Transfer Slip (upload-payment-proof.php)
              </h3>
              <p className="text-xs text-[#5c5046]">
                Submit your federal wire tracking number or bank transaction confirmation for rapid clearance.
              </p>
            </div>

            {uploadSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Wire receipt submitted successfully. Concierge will reconcile your ledger shortly.</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5c5046] font-bold mb-1">
                  Federal Reference Code / Federal Wire Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FED-WIRE-88910293 or ACH-77401"
                  value={uploadRefCode}
                  onChange={(e) => setUploadRefCode(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl font-mono text-xs text-[#282828]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Originating Financial Institution *</label>
                  <input
                    type="text"
                    required
                    value={uploadBank}
                    onChange={(e) => setUploadBank(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5046] font-bold mb-1">Remitter / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp Travel Desk"
                    value={uploadSender}
                    onChange={(e) => setUploadSender(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5c5046] font-bold mb-1">Additional Notes / Cost Center</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Settlement for Dr. Vance Suite #91 & Nissan Terra vehicle rental..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-[#d8cfc3] rounded-xl text-xs text-[#282828] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl shadow-2xs cursor-pointer"
                >
                  Submit Remittance Notice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 7. Invoices (invoices.php) & 8. Receipts (receipts.php) */}
        {(subView === 'invoices' || subView === 'receipts') && (
          <div className="bg-white border border-[#e6dfd5] rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
              <div>
                <h3 className="font-heading font-black text-xl text-[#282828]">
                  {subView === 'invoices' ? 'Corporate Invoice Statement' : 'Official Tax Receipt'}
                </h3>
                <span className="text-xs text-[#5c5046] font-mono">
                  Invoice #{selectedPayment?.invoiceNumber || 'INV-2026-9901'} • GSA Per Diem Compliant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Transactional Receipt (White/Black)</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#5c5046]">
              <div className="flex justify-between border-b border-[#efe9e0] pb-3">
                <div className="flex items-start gap-3">
                  <img
                    src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
                    alt="Easy Travel Lodging Logo"
                    className="h-10 w-auto object-contain shrink-0"
                  />
                  <div>
                    <strong className="text-[#282828] block">Issued By:</strong>
                    <span>Easy Travel Lodging LLC</span><br />
                    <span>100 Corporate Center Drive, Suite 500, Los Angeles, CA</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="text-[#282828] block">Billed To:</strong>
                  <span>Client Ledger #{selectedPayment?.referenceCode || 'REF-8819'}</span>
                </div>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-xl border border-[#efe9e0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#282828] block">{selectedPayment?.description || 'Corporate Lodging Stay Settlement'}</span>
                  <span className="text-[#857568]">Settlement: {selectedPayment?.paymentMethod || 'Wire Transfer'}</span>
                </div>
                <span className="text-base font-black text-[#00897d] tabular-nums">
                  ${selectedPayment?.amountUsd.toLocaleString() || '3,100'} USD
                </span>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>View Printable White &amp; Black Receipt Template</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Receipt Modal (White Background & Black Writing Template) */}
      <TransactionReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
};
