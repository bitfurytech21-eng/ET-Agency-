import React from 'react';
import { UserPaymentRecord, UserSession } from '../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: UserPaymentRecord | null;
  userSession?: UserSession | null;
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
  const clientEmail = userSession?.email || 'corporate@easytravellodging.com';
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
            <span className="font-heading font-bold text-xs uppercase tracking-wider">
              Printable Transaction Receipt Template
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
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

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black uppercase font-heading leading-tight">
                  Easy Travel Lodging
                </h1>
                <span className="text-[11px] font-bold tracking-widest text-black/80 uppercase block">
                  Easy Travel Lodging LLC • Corporate Treasury
                </span>
                <p className="text-[10px] text-black/70 font-mono mt-0.5">
                  Nationwide Turnkey Furnished Residences &amp; 3D Fleet Dispatch
                </p>
              </div>
            </div>

            {/* Official Receipt Badge */}
            <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-0 border-black pl-3 sm:pl-0 shrink-0">
              <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-md mb-1">
                Transactional Receipt
              </span>
              <div className="text-xs font-mono font-bold text-black block">
                RCP-{activePayment.invoiceNumber}
              </div>
              <div className="text-[11px] font-semibold text-black/80">
                Date: {activePayment.date}
              </div>
            </div>
          </div>

          {/* Company & Client Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b-2 border-black pb-5">
            {/* Company Info */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                ISSUED BY (MERCHANT OF RECORD):
              </span>
              <p className="font-bold text-black text-sm">Easy Travel Lodging LLC</p>
              <p className="text-black/80">100 Corporate Center Drive, Suite 500</p>
              <p className="text-black/80">Los Angeles, CA 90012, USA</p>
              <p className="text-black/80 font-mono text-[11px]">EIN / Tax ID: 95-8830192</p>
              <p className="text-black/80">Treasury Line: +1 (800) 555-0199</p>
            </div>

            {/* Client Info */}
            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                BILLED TO (CLIENT ACCOUNT):
              </span>
              <p className="font-bold text-black text-sm">{clientName}</p>
              <p className="font-semibold text-black/90">{clientCompany}</p>
              <p className="text-black/80">{clientEmail}</p>
              <p className="text-black/80 font-mono text-[11px]">Account ID: {clientId}</p>
              <p className="text-black/80 font-mono text-[11px]">Ledger Ref: {activePayment.referenceCode}</p>
            </div>
          </div>

          {/* Transaction Overview Banner */}
          <div className="p-4 bg-neutral-100 border-2 border-black rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                SETTLEMENT CHANNEL &amp; METHOD
              </span>
              <div className="font-bold text-black text-sm flex items-center gap-1.5">
                <span>{activePayment.paymentMethod}</span>
              </div>
              <div className="text-xs font-mono text-black/80">
                Memo Ref: <strong>{activePayment.referenceCode}</strong>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                SETTLEMENT STATUS
              </span>
              <div className="mt-0.5 inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-md text-xs font-bold uppercase tracking-wider">
                {isPending ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>PENDING ADMIN APPROVAL</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>PAID &amp; SETTLED</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-black block">
              ITEMIZED TRANSACTION PARTICULARS
            </span>

            <table className="w-full text-xs text-left border-2 border-black border-collapse">
              <thead>
                <tr className="bg-black text-white font-bold border-b-2 border-black text-[11px] uppercase tracking-wider">
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
                    <span className="block text-[10px] text-black/70 font-mono mt-0.5">
                      Direct treasury balance credit / GSA Per Diem Housing allocation
                    </span>
                  </td>
                  <td className="p-3 border-r-2 border-black text-center font-mono text-[11px]">
                    {activePayment.referenceCode}
                  </td>
                  <td className="p-3 border-r-2 border-black text-center font-mono text-[11px]">
                    1 @ 100%
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-sm tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-neutral-50 text-[11px]">
                  <td colSpan={3} className="p-2.5 text-right font-bold border-r-2 border-black uppercase">
                    Subtotal:
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-neutral-50 text-[11px]">
                  <td colSpan={3} className="p-2.5 text-right font-bold border-r-2 border-black uppercase">
                    Sales Tax / Local Lodging Tax (GSA Exempt):
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">$0.00</td>
                </tr>
                <tr className="bg-neutral-50 text-[11px]">
                  <td colSpan={3} className="p-2.5 text-right font-bold border-r-2 border-black uppercase">
                    Processing / Wire Settlement Surcharge:
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold tabular-nums">$0.00</td>
                </tr>
                <tr className="bg-black text-white font-black text-sm">
                  <td colSpan={3} className="p-3.5 text-right uppercase tracking-wider border-r border-white/20">
                    TOTAL AMOUNT PAID:
                  </td>
                  <td className="p-3.5 text-right font-mono text-base tabular-nums">
                    ${activePayment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official Digital Seal & Verification Signature */}
          <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            {/* Treasury Stamp Seal */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-black p-1 flex items-center justify-center text-center shrink-0">
                <div className="w-full h-full rounded-full border-2 border-dashed border-black flex flex-col items-center justify-center leading-none p-1">
                  <ShieldCheck className="w-5 h-5 text-black mb-0.5" />
                  <span className="text-[7px] font-black uppercase text-black tracking-tight">ETL TREASURY</span>
                  <span className="text-[6px] font-mono font-bold text-black">VERIFIED</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                  OFFICIAL TREASURY AUDIT STAMP
                </span>
                <p className="text-[11px] text-black/80 font-medium leading-tight">
                  This computer-generated receipt is verified by Bank of America Escrow Clearing.
                </p>
                <p className="text-[9px] font-mono text-black/70">
                  Hash: 0x8F92A...E4129B | Status: RECONCILED
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right shrink-0 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                AUTHORIZED TREASURY SIGNATURE
              </span>
              <div className="font-serif italic text-lg font-bold text-black border-b border-black pb-1 px-4 inline-block">
                Easy Travel Lodging Treasury Desk
              </div>
              <p className="text-[10px] font-bold text-black uppercase tracking-wider">
                Financial Operations Manager
              </p>
            </div>
          </div>

          {/* Footer Terms & Legal Disclaimer */}
          <div className="pt-4 border-t border-black/30 text-[10px] text-black/70 text-center space-y-1">
            <p>
              Easy Travel Lodging LLC • 100 Corporate Center Drive, Suite 500, Los Angeles, CA 90012
            </p>
            <p>
              Thank you for choosing Easy Travel Lodging for your corporate housing and 3D fleet mobility requirements.
            </p>
          </div>

        </div>

        {/* Bottom Modal Actions (Hidden on Print) */}
        <div className="p-4 bg-neutral-100 border-t-2 border-black flex items-center justify-between gap-3 shrink-0 print:hidden">
          <span className="text-xs font-bold text-black">
            Format: High-Contrast White Background &amp; Black Ink Template
          </span>

          <div className="flex items-center gap-2">
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
              className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
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
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
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
