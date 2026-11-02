import React from 'react';
import { PaymentAccountInfo, UserPaymentRecord, UserSession } from '../types';
import { Printer, X, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: UserPaymentRecord | null;
  userSession?: UserSession | null;
  paymentAccounts?: PaymentAccountInfo | null;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  userSession,
  paymentAccounts,
}) => {
  const [logoFailed, setLogoFailed] = React.useState(false);

  if (!isOpen || !payment) return null;

  const clientName = userSession?.name || 'Registered Guest';
  const clientCompany = userSession?.company || '';
  const clientEmail = userSession?.email || '';
  const clientId = userSession?.id || '';
  const bankName = paymentAccounts?.bankName || 'Chase Bank, N.A.';
  const merchantAddress =
    paymentAccounts?.corporateMailingAddress ||
    'Easy Travel Lodging LLC · Rancho Cordova, CA 95670';

  const isPending = payment.status === 'pending';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white text-black w-full max-w-2xl rounded-2xl sm:rounded-3xl border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:h-auto print:w-full print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-black text-white px-5 py-3 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-heading font-bold text-xs uppercase tracking-wider">
              Transaction Statement &amp; Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div
          id="printable-receipt-content"
          className="p-6 sm:p-10 space-y-6 overflow-y-auto flex-1 bg-white text-black print:overflow-visible print:p-0 print:space-y-5"
        >
          {/* Header Section */}
          <div className="border-b-2 border-black pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 border border-black font-heading font-black text-sm">
                  ETL
                </div>
              )}

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black uppercase font-heading leading-tight">
                  Easy Travel Lodging
                </h1>
                <span className="text-[11px] font-bold tracking-widest text-black/80 uppercase block">
                  Easy Travel Lodging LLC · Accounting &amp; Settlements
                </span>
                <p className="text-[10px] text-black/70 font-mono mt-0.5">
                  Furnished Residences &amp; Fleet Mobility
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 tabular-nums">
              <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-md mb-1">
                Official Receipt
              </span>
              <div className="text-xs font-mono font-bold text-black block">
                RCP-{payment.invoiceNumber}
              </div>
              <div className="text-[11px] font-semibold text-black/80">
                Date: {payment.date}
              </div>
            </div>
          </div>

          {/* Merchant & Client Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b-2 border-black pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Issued By:
              </span>
              <p className="font-bold text-black text-sm">Easy Travel Lodging LLC</p>
              <p className="text-black/80">{merchantAddress}</p>
              <p className="text-black/80 tabular-nums">Phone: 916-800-3295</p>
              <p className="text-black/80">Email: easytravelagency@trustagent.space</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Account Holder:
              </span>
              <p className="font-bold text-black text-sm">{clientName}</p>
              {clientCompany && <p className="font-semibold text-black/90">{clientCompany}</p>}
              {clientEmail && <p className="text-black/80">{clientEmail}</p>}
              {clientId && <p className="text-black/80 font-mono text-[11px]">User ID: {clientId}</p>}
              <p className="text-black/80 font-mono text-[11px]">Reference: {payment.referenceCode}</p>
            </div>
          </div>

          {/* Settlement Banner */}
          <div className="p-4 bg-neutral-100 border-2 border-black rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Payment Method
              </span>
              <div className="font-bold text-black text-sm">{payment.paymentMethod}</div>
              <div className="text-xs font-mono text-black/80">
                Reference Code: <strong>{payment.referenceCode}</strong>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Status
              </span>
              <div className="mt-0.5 inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-md text-xs font-bold uppercase tracking-wider">
                {isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pending Verification</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Settled</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-black block">
              Transaction Breakdown
            </span>

            <table className="w-full text-xs text-left border-2 border-black border-collapse tabular-nums">
              <thead>
                <tr className="bg-black text-white font-bold border-b-2 border-black text-[11px] uppercase tracking-wider">
                  <th className="p-3 border-r border-white/20">Description</th>
                  <th className="p-3 border-r border-white/20 text-center">Reference</th>
                  <th className="p-3 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-medium">
                <tr>
                  <td className="p-3 border-r-2 border-black font-semibold">
                    {payment.description}
                  </td>
                  <td className="p-3 border-r-2 border-black text-center font-mono text-[11px]">
                    {payment.referenceCode}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-sm">
                    ${payment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-black text-white font-black text-sm">
                  <td colSpan={2} className="p-3.5 text-right uppercase tracking-wider border-r border-white/20">
                    Total Amount:
                  </td>
                  <td className="p-3.5 text-right font-mono text-base">
                    ${payment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Note */}
          <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-black shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                  Receiving Depository Institution
                </span>
                <p className="text-[11px] text-black/80 font-medium">
                  {bankName} · Easy Travel Lodging LLC
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Issued By
              </span>
              <p className="text-xs font-bold text-black">Easy Travel Lodging Billing Desk</p>
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 bg-neutral-100 border-t-2 border-black flex items-center justify-end gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
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
