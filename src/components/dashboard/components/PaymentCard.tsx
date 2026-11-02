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
        isPending ? 'border-amber-300' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#14616d] shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 type-support">
              <span className="font-mono font-bold text-[#0f172a] tabular-nums">{payment.referenceCode}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <StatusBadge status={payment.status} size="sm" />
            </div>
            <p className="type-body text-slate-600 font-medium mt-0.5">{payment.description}</p>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="type-h4 text-[#0f172a] tabular-nums">
            ${payment.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
          <span className="type-support text-slate-500 block">{payment.paymentMethod}</span>
        </div>
      </div>

      {isPending && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 type-support flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Pending Verification:</strong> Transfer notice received and queued for accounting reconciliation.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 type-support text-slate-600 tabular-nums">
        <div className="flex flex-wrap items-center gap-2">
          <span>Date: <strong className="text-[#0f172a]">{payment.date}</strong></span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="font-mono">Invoice #{payment.invoiceNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewInvoice && (
            <button
              type="button"
              onClick={() => onViewInvoice(payment)}
              className="btn btn-outline btn-sm"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Invoice</span>
            </button>
          )}
          {onViewReceipt && (
            <button
              type="button"
              onClick={() => onViewReceipt(payment)}
              className="btn btn-outline btn-sm"
            >
              <ArrowDownToLine className="w-4 h-4 text-[#14616d]" />
              <span>Receipt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
