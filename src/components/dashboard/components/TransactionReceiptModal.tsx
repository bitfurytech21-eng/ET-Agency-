import React from 'react';
import { UserPaymentRecord, UserSession } from '../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: UserPaymentRecord | null;
  userSession?: UserSession | null;
  paymentAccounts?: any;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  userSession,
}) => {
  const [logoFailed, setLogoFailed] = React.useState(false);

  if (!isOpen) return null;

  // Fallback transaction data if none selected
  const activePayment: UserPaymentRecord = payment || {
    id: 'PAY-2026-001',
    referenceCode: 'FED-WIRE-982104',
    targetType: 'account_funds',
    description: 'Corporate Account Balance Top-Up (Fedwire Escrow Deposit)',
    amountUsd: 1000,
    paymentMethod: 'Direct Commercial Fedwire / SWIFT',
    status: 'settled',
    date: '2026-11-01',
    invoiceNumber: 'INV-2026-88194',
  };

  const clientName = userSession?.name || 'Alexander Sterling';
  const clientCompany = userSession?.company || 'OmniGlobal Enterprise Partners';
  const clientEmail = userSession?.email || 'easytravelagency@trustagent.space';
  const clientId = userSession?.id || 'USR-8942-CORP';

  const isPending = activePayment.status === 'pending';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container - Pure White Background & Pure Black Writing */}
      <div className="bg-white text-black w-full max-w-2xl rounded-2xl sm:rounded-3xl border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:h-auto print:w-full print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-black text-white px-5 py-3 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="type-support font-semibold text-white">
              Printable Transaction Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white text-black hover:bg-neutral-200 type-btn rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Receipt Content */}
        <div id="printable-receipt-content" className="p-6 sm:p-10 space-y-6 overflow-y-auto flex-1 bg-white text-black print:overflow-visible print:p-0 print:space-y-5">
          
          {/* Header Section with Brand Logo & Company Name */}
          <div className="border-b-2 border-black pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo and Brand Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {!logoFailed ? (
                <img
                  src="https://easytravellodging.com/wp-content/uploads/2022/02/Easy-Travel-Lodging-Logo_jpeg-color.jpg"
                  alt="Easy Travel Lodging"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                  className="h-14 sm:h-16 w-auto object-contain max-w-[220px]"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 border border-black shadow-xs">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0l2 2m-2-2l-2 2" />
                  </svg>
                </div>
              )}

              <div className="space-y-0.5">
                <h3 className="type-h3 text-black">
                  Easy Travel Lodging
                </h3>
                <span className="type-support font-semibold text-black/80 block">
                  Easy Travel Lodging LLC · Corporate Treasury
                </span>
                <p className="type-support text-black/70">
                  Turnkey Furnished Residences &amp; Fleet Mobility
                </p>
              </div>
            </div>

            {/* Official Receipt Reference */}
            <div className="text-left sm:text-right shrink-0 space-y-0.5 tabular-nums">
              <span className="type-support font-bold text-black block">
                Transactional Receipt
              </span>
              <div className="type-support font-mono font-bold text-black block">
                RCP-{activePayment.invoiceNumber}
              </div>
              <div className="type-support font-medium text-black/80">
                Date: {activePayment.date}
              </div>
            </div>
          </div>

          {/* Company & Client Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 type-support border-b-2 border-black pb-5">
            {/* Company Info */}
            <div className="space-y-1">
              <span className="type-support font-semibold text-black/70 block">
                Issued By (Merchant of Record)
              </span>
              <p className="type-h4 text-black">Easy Travel Lodging LLC</p>
              <p className="text-black/80">100 Corporate Center Drive, Suite 500</p>
              <p className="text-black/80">Los Angeles, CA 90012, USA</p>
              <p className="text-black/80 font-mono tabular-nums">EIN / Tax ID: 95-8830192</p>
              <p className="text-black/80 tabular-nums">Treasury Line: 916-800-3295</p>
            </div>

            {/* Client Info */}
            <div className="space-y-1 sm:text-right">
              <span className="type-support font-semibold text-black/70 block">
                Billed To (Client Account)
              </span>
              <p className="type-h4 text-black">{clientName}</p>
              <p className="font-semibold text-black/90">{clientCompany}</p>
              <p className="text-black/80">{clientEmail}</p>
              <p className="text-black/80 font-mono tabular-nums">Account ID: {clientId}</p>
              <p className="text-black/80 font-mono tabular-nums">Ledger Ref: {activePayment.referenceCode}</p>
            </div>
          </div>

          {/* Transaction Overview Banner */}
          <div className="p-4 bg-neutral-100 border-2 border-black rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="type-support font-semibold text-black/70 block">
                Settlement Channel &amp; Method
              </span>
              <div className="type-h4 text-black flex items-center gap-1.5">
                <span>{activePayment.paymentMethod}</span>
              </div>
              <div className="type-support font-mono text-black/80 tabular-nums">
                Memo Ref: <strong>{activePayment.referenceCode}</strong>
              </div>
            </div>

            <div className="sm:text-right shrink-0 space-y-1">
              <span className="type-support font-semibold text-black/70 block">
                Settlement Status
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-md type-support font-semibold">
                {isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pending Verification</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Paid &amp; Settled</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <div className="space-y-2">
            <span className="type-support font-semibold text-black block">
              Itemized Transaction Particulars
            </span>

            <table className="w-full type-support text-left border-2 border-black border-collapse tabular-nums">
              <thead>
                <tr className="bg-black text-white font-semibold border-b-2 border-black">
                  <th className="p-3 border-r border-white/20">Description / Particulars</th>
                  <th className="p-3 border-r border-white/20 text-center">Ref Code</th>
                  <th className="p-3 border-r border-white/20 text-center">Qty / Rate</th>
                  <th className="p-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-medium">
                <tr>
                  <td className="p-3 border-r-2 border-black font-semibold">
                    {activePayment.description}
                    <span className="block type-support text-black/70 font-normal mt-0.5">
                      Direct treasury balance credit / Corporate housing allocation
                    </span>
                  </td>
                  <td className="p-3 border-r-2 border-black text-center font-mono">
                    {activePayment.referenceCode}
                  </td>
                  <td className="p-3 border-r-2 border-black text-center font-mono">
                    1 @ 100%
                  </td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-neutral-50">
                  <td colSpan={3} className="p-2.5 text-right font-semibold border-r-2 border-black">
                    Subtotal:
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-neutral-50">
                  <td colSpan={3} className="p-2.5 text-right font-semibold border-r-2 border-black">
                    Sales Tax / Local Lodging Tax (Exempt):
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">$0.00</td>
                </tr>
                <tr className="bg-neutral-50">
                  <td colSpan={3} className="p-2.5 text-right font-semibold border-r-2 border-black">
                    Processing / Wire Settlement Surcharge:
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">$0.00</td>
                </tr>
                <tr className="bg-black text-white font-bold type-body">
                  <td colSpan={3} className="p-3.5 text-right border-r border-white/20">
                    Total Amount Paid:
                  </td>
                  <td className="p-3.5 text-right font-mono tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official Digital Seal & Verification Signature */}
          <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-6 type-support">
            {/* Treasury Verification */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div className="space-y-0.5">
                <span className="type-support font-bold text-black block">
                  Official Treasury Verification
                </span>
                <p className="type-support text-black/80">
                  Verified by Easy Travel Lodging Treasury &amp; Escrow Clearing.
                </p>
                <p className="type-support font-mono text-black/70 tabular-nums">
                  Ref: {activePayment.invoiceNumber} · Reconciled
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right shrink-0 space-y-1">
              <span className="type-support font-semibold text-black/70 block">
                Authorized Treasury Signature
              </span>
              <div className="type-h4 italic text-black border-b border-black pb-1 px-4 inline-block">
                Easy Travel Lodging Treasury Desk
              </div>
              <p className="type-support font-semibold text-black">
                Financial Operations Manager
              </p>
            </div>
          </div>

          {/* Footer Terms & Legal Disclaimer */}
          <div className="pt-4 border-t border-black/30 type-support text-black/70 text-center space-y-1">
            <p>
              Easy Travel Lodging LLC · 100 Corporate Center Drive, Suite 500, Los Angeles, CA 90012
            </p>
            <p>
              Thank you for choosing Easy Travel Lodging for your corporate housing and fleet mobility requirements.
            </p>
          </div>

        </div>

        {/* Bottom Modal Actions (Hidden on Print) */}
        <div className="p-4 bg-neutral-100 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <span className="type-support font-semibold text-black">
            Print-ready monochrome receipt layout
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-200 text-black type-btn rounded-xl cursor-pointer transition-colors whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white type-btn rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

      </div>

      {/* Global CSS for Print Mode */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: "Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          }
          #printable-receipt-content {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, nav, button, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
