import React from 'react';
import { UserPaymentRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { Landmark, FileText, ArrowDownToLine, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PaymentCardProps {
  payment: UserPaymentRecord;
  onViewInvoice?: (payment: UserPaymentRecord) => void;
  onViewReceipt?: (payment: UserPaymentRecord) => void;
  onApprove?: (payment: UserPaymentRecord) => void;
  onReject?: (payment: UserPaymentRecord) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onViewInvoice,
  onViewReceipt,
  onApprove,
  onReject,
}) => {
  const isPending = payment.status === 'pending';

  return (
    <div
      className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs space-y-3 ${
        isPending
          ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20'
          : 'border-[#e6dfd5] hover:border-[#00b7a8]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#efe9e0] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#faf8f5] border border-[#e6dfd5] flex items-center justify-center text-[#82634f] shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#282828]">{payment.referenceCode}</span>
              <StatusBadge status={payment.status} size="sm" />
            </div>
            <p className="text-xs text-[#5c5046] font-medium mt-0.5">{payment.description}</p>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-base font-black text-[#00897d] tabular-nums">
            ${payment.amountUsd.toLocaleString()} USD
          </span>
          <span className="text-[11px] text-[#857568] block">{payment.paymentMethod}</span>
        </div>
      </div>

      {isPending && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pending Admin Approval:</strong> Transfer notice submitted. Awaiting treasury verification before balance update.
            </span>
          </div>

          {(onApprove || onReject) && (
            <div className="flex items-center gap-2 shrink-0">
              {onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(payment)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve &amp; Credit Balance</span>
                </button>
              )}
              {onReject && (
                <button
                  type="button"
                  onClick={() => onReject(payment)}
                  className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reject</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5c5046]">
        <div>
          <span>Settlement Date: <strong>{payment.date}</strong></span>
          <span className="ml-3 font-mono">Invoice #{payment.invoiceNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewInvoice && (
            <button
              type="button"
              onClick={() => onViewInvoice(payment)}
              className="px-3 py-1 rounded-lg border border-[#d8cfc3] hover:bg-[#faf8f5] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#82634f]" />
              <span>Invoice</span>
            </button>
          )}
          {onViewReceipt && (
            <button
              type="button"
              onClick={() => onViewReceipt(payment)}
              className="px-3 py-1 rounded-lg bg-[#faf8f5] border border-[#d8cfc3] hover:border-[#00b7a8] text-[#282828] text-xs font-semibold flex items-center gap-1 cursor-pointer"
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
