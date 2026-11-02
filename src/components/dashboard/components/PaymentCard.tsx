import React from 'react';
import { UserPaymentRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { Landmark, FileText, ArrowDownToLine, Clock } from 'lucide-react';

interface PaymentCardProps {
  payment: UserPaymentRecord;
  onViewInvoice?: (payment: UserPaymentRecord) => void;
  onViewReceipt?: (payment: UserPaymentRecord) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onViewInvoice,
  onViewReceipt,
}) => {
  const isPending = payment.status === 'pending';

  return (
    <div
      className={`bg-white border rounded-2xl p-4 sm:p-5 transition-colors space-y-3 ${
        isPending ? 'border-amber-300' : 'border-[#e6dfd5] hover:border-[#00b7a8]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efe9e0] pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#82634f] shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#282828] tabular-nums">{payment.referenceCode}</span>
              <span className="text-[#857568]" aria-hidden="true">·</span>
              <StatusBadge status={payment.status} size="sm" />
            </div>
            <p className="text-xs text-[#5c5046] font-medium mt-0.5">{payment.description}</p>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${payment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
          <span className="text-[11px] text-[#857568] block">{payment.paymentMethod}</span>
        </div>
      </div>

      {isPending && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Pending Verification:</strong> Transfer notice received and queued for accounting reconciliation.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5c5046] tabular-nums">
        <div className="flex flex-wrap items-center gap-2">
          <span>Date: <strong>{payment.date}</strong></span>
          <span className="text-[#857568]" aria-hidden="true">·</span>
          <span className="font-mono">Invoice #{payment.invoiceNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewInvoice && (
            <button
              type="button"
              onClick={() => onViewInvoice(payment)}
              className="px-3 py-1.5 rounded-lg border border-[#d8cfc3] hover:bg-[#faf8f5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-[#82634f]" />
              <span>Invoice</span>
            </button>
          )}
          {onViewReceipt && (
            <button
              type="button"
              onClick={() => onViewReceipt(payment)}
              className="px-3 py-1.5 rounded-lg bg-[#faf8f5] border border-[#d8cfc3] hover:border-[#00b7a8] text-[#282828] text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#00b7a8]" />
              <span>Receipt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
