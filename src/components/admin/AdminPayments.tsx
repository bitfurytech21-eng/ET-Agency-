import React, { useState } from 'react';
import {
  Landmark,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  FileText,
  Search,
  Download,
  Eye,
  Check,
  X,
  Building,
} from 'lucide-react';

interface ManualPayment {
  id: string;
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  targetType: string;
  amountUsd: number;
  paymentMethod: string;
  senderName: string;
  originatingBank: string;
  wireReference: string;
  transferDate: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  adminNotes?: string;
  verifiedAt?: string;
  createdAt: string;
}

interface OrderRecord {
  id: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  totalUsd: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{ title: string; quantity: number; unitPriceUsd: number }>;
}

interface AdminPaymentsProps {
  manualPayments: ManualPayment[];
  orders: OrderRecord[];
  onVerifyPayment: (id: string, action: 'verify' | 'reject', notes: string) => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({
  manualPayments,
  orders,
  onVerifyPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'wires' | 'orders' | 'config'>('wires');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_verification' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<ManualPayment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredWires = manualPayments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q) ||
      p.referenceCode.toLowerCase().includes(q) ||
      p.wireReference.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'wires', label: 'Wire / ACH Verification Queue', icon: Landmark, count: manualPayments.filter((p) => p.status === 'pending_verification').length },
            { id: 'orders', label: 'Orders & Sales Ledger', icon: ShoppingBag, count: orders.length },
            { id: 'config', label: 'Payment Account Setup & Routing', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl type-nav flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap tabular-nums ${
                  active
                    ? 'bg-[#14616d] text-white border-[#14616d] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`type-support font-semibold ${
                      active ? 'text-white/85' : 'text-[#14616d]'
                    }`}
                  >
                    ({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'wires' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search wire ref or sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        )}
      </div>

      {/* 1. WIRES & ACH QUEUE */}
      {activeTab === 'wires' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <h3 className="type-h3 text-slate-900">Bank Wire &amp; Direct ACH Settlements</h3>
              <p className="type-support text-slate-500">
                Verify incoming funds before releasing prepaid Lodging Units, confirming suites, or dispatching fleet.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['all', 'pending_verification', 'verified', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize type-btn cursor-pointer border whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Notice Ref</th>
                  <th>Sender &amp; Client</th>
                  <th>Bank &amp; Wire Ref</th>
                  <th>Target</th>
                  <th>Amount ($ USD)</th>
                  <th>Status</th>
                  <th className="text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWires.map((w) => (
                  <tr key={w.id}>
                    <td className="font-mono font-semibold text-[#8c6a4a] type-support">{w.referenceCode}</td>
                    <td>
                      <div className="font-semibold text-slate-900">{w.customerName}</div>
                      <div className="type-support text-slate-500">{w.customerEmail}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{w.originatingBank || 'Direct Wire'}</div>
                      <div className="font-mono type-support text-slate-500">Ref: {w.wireReference}</div>
                    </td>
                    <td className="capitalize font-medium text-slate-600">
                      {w.targetType.replace('_', ' ')}
                    </td>
                    <td className="font-semibold text-[#14616d] tabular-nums">
                      ${w.amountUsd?.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-md type-support font-semibold capitalize border inline-block ${
                          w.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : w.status === 'pending_verification'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {w.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      {w.status === 'pending_verification' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(w.id, 'verify', 'Bank settlement confirmed in treasury')}
                            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(w.id, 'reject', 'Wire not located in bank ledger')}
                            className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="type-support text-slate-500">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ORDERS LEDGER */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <h3 className="type-h3 text-slate-900">Storefront Orders &amp; Invoices</h3>
            <p className="type-support text-slate-500">Complete ledger of packages, add-on services, and lodging reservations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-mono font-semibold text-[#8c6a4a] type-support">{ord.orderReference}</td>
                    <td>
                      <div className="font-semibold text-slate-900">{ord.customerName}</div>
                      <div className="type-support text-slate-500">{ord.customerEmail}</div>
                    </td>
                    <td>
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="type-support text-slate-600 line-clamp-1">
                          {item.quantity}x {item.title}
                        </div>
                      ))}
                    </td>
                    <td className="font-semibold text-[#14616d] tabular-nums">
                      ${ord.totalUsd?.toLocaleString()}
                    </td>
                    <td className="capitalize text-slate-600">
                      {ord.paymentMethod?.replace('_', ' ')}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-md type-support font-semibold capitalize bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-md type-support font-semibold capitalize bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PAYMENT ACCOUNTS & ROUTING CONFIG */}
      {activeTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <h3 className="type-h3 text-slate-900">Associated Bank Company Account</h3>
            <p className="type-body text-slate-600">
              Configured wire, ACH, and checking details shown to clients upon checkout.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 type-support tabular-nums">
            <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500">Financial Institution:</span>
              <span className="font-semibold text-slate-900 text-right">Associated Bank</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500">Account Name:</span>
              <span className="font-semibold text-slate-900 text-right">Heather Frederick</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500">Routing Number:</span>
              <span className="font-mono font-semibold text-[#8c6a4a] text-right">075900575</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500">Account Number:</span>
              <span className="font-mono font-semibold text-[#14616d] text-right">2913762643</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500">Account Type:</span>
              <span className="font-semibold text-slate-900 text-right">Checking</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Bank Address:</span>
              <span className="font-semibold text-slate-900 text-right">400 S Chestnut Ave, Marshfield, WI 54449, USA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
