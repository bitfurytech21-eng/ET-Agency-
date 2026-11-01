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
      {/* Sub-Navigation matching admin/payments/ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#00b7a8] text-white border-[#00b7a8] shadow-xs'
                    : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#00b7a8]/40 hover:text-[#282828]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                      active ? 'bg-white/20 text-white' : 'bg-[#e8f8f6] text-[#00897d]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'wires' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search wire ref or sender..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#dfd6ca] rounded-lg text-xs outline-none focus:border-[#00b7a8]"
            />
          </div>
        )}
      </div>

      {/* 1. WIRES & ACH QUEUE */}
      {activeTab === 'wires' && (
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-[#282828]">Bank Wire &amp; Direct ACH Settlements</h3>
              <p className="text-xs text-[#5c5046]">
                Verify incoming funds before releasing prepaid Lodging Units, confirming suites, or dispatching fleet.
              </p>
            </div>

            <div className="flex gap-1.5 text-xs">
              {(['all', 'pending_verification', 'verified', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md capitalize font-semibold cursor-pointer border ${
                    statusFilter === st ? 'bg-[#82634f] text-white border-[#82634f]' : 'bg-white text-[#5c5046] border-[#e6dfd5]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Notice Ref</th>
                  <th className="py-3 px-3">Sender &amp; Client</th>
                  <th className="py-3 px-3">Bank &amp; Wire Ref</th>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Amount ($ USD)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {filteredWires.map((w) => (
                  <tr key={w.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#82634f]">{w.referenceCode}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#282828]">{w.customerName}</div>
                      <div className="text-[11px] text-[#5c5046]">{w.customerEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#282828]">{w.originatingBank || 'Direct Wire'}</div>
                      <div className="font-mono text-[10px] text-[#857568]">Ref: {w.wireReference}</div>
                    </td>
                    <td className="py-3 px-3 capitalize font-medium text-[#5c5046]">
                      {w.targetType.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums text-sm">
                      ${w.amountUsd?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
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
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending_verification' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(w.id, 'verify', 'Bank settlement confirmed in treasury')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(w.id, 'reject', 'Wire not located in bank ledger')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[11px] cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#857568]">Settled</span>
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
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#e6dfd5] pb-3">
            <h3 className="font-heading font-bold text-base text-[#282828]">Storefront Orders &amp; Invoices</h3>
            <p className="text-xs text-[#5c5046]">Complete ledger of packages, add-on services, and lodging reservations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-[#857568] uppercase font-bold tracking-wider border-b border-[#e6dfd5]">
                <tr>
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd5]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#fbf9f6] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#82634f]">{ord.orderReference}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#282828]">{ord.customerName}</div>
                      <div className="text-[11px] text-[#5c5046]">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3 px-3">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="text-[#5c5046] line-clamp-1">
                          {item.quantity}x {item.title}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#00897d] tabular-nums">
                      ${ord.totalUsd?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 capitalize text-[#5c5046]">
                      {ord.paymentMethod?.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
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
        <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="border-b border-[#e6dfd5] pb-3">
            <h3 className="font-heading font-bold text-lg text-[#282828]">Bank of America Operating Accounts</h3>
            <p className="text-xs text-[#5c5046]">
              Configured wire and ACH details shown to clients upon checkout.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-[#857568]">Financial Institution:</span>
                <span className="font-bold text-[#282828]">Bank of America, N.A.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">Account Beneficiary:</span>
                <span className="font-bold text-[#282828]">Easy Travel Lodging LLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">ACH Electronic Routing Number:</span>
                <span className="font-mono font-bold text-[#82634f]">121000358</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">Fedwire Domestic Routing Number:</span>
                <span className="font-mono font-bold text-[#82634f]">026009593</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">Operating Account Number:</span>
                <span className="font-mono font-bold text-[#00897d]">3250 8841 9022</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857568]">SWIFT / BIC Code:</span>
                <span className="font-mono font-bold text-[#282828]">BOFAUS3N</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
