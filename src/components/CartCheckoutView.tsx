import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Minus,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Upload,
  Wallet,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LivePhotoBackground } from './LivePhotoBackground';

interface CartCheckoutViewProps {
  initialMode: 'cart' | 'checkout';
  onNavigate: (view: string) => void;
}

interface PaymentAccountConfig {
  bankName: string;
  accountName: string;
  accountNumber: string;
  achRoutingNumber: string;
  wireRoutingNumber: string;
  swiftCode: string;
  bankAddress: string;
  zelleEmail: string;
  zelleRecipient: string;
  paymentInstructions: string;
}

interface OrderRecord {
  id: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  role?: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  guestNotes?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    itemType: string;
    image: string;
    unitPriceUsd: number;
    quantity: number;
    quantityLabel: string;
    lineSubtotalUsd: number;
  }>;
  promoCode?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  paymentMethod: 'unit_balance' | 'wire_transfer' | 'direct_ach' | 'zelle';
  paymentStatus:
    | 'pending_payment'
    | 'pending_verification'
    | 'paid'
    | 'failed'
    | 'cancelled'
    | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentReference?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  confirmationEmailSentAt: string;
  createdAt: string;
}

const FALLBACK_IMAGE =
  'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg';

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  initialMode,
  onNavigate,
}) => {
  const {
    cartId,
    cart,
    isLoading,
    isMutating,
    banner,
    clearBanner,
    catalogItems,
    promoHints,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromo,
    removePromo,
    revalidateCart,
    syncCart,
  } = useCart();

  const [activeTab, setActiveTab] = useState<'cart' | 'checkout' | 'track'>(initialMode);
  const [promoInput, setPromoInput] = useState('');
  const [revalidatedMessage, setRevalidatedMessage] = useState<string | null>(null);

  // Payment accounts & optional signed-in client session
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountConfig | null>(null);
  const [clientToken, setClientToken] = useState<string>(
    () => (typeof window !== 'undefined' ? window.localStorage.getItem('etl_php_token') || '' : ''),
  );
  const [clientAccount, setClientAccount] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    units_balance: number;
    balance_usd: number;
  } | null>(null);

  // Inline client login inside checkout
  const [portalEmail, setPortalEmail] = useState('easytravelagency@trustagent.space');
  const [portalPassword, setPortalPassword] = useState('welcome123');
  const [portalAuthLoading, setPortalAuthLoading] = useState(false);
  const [portalAuthError, setPortalAuthError] = useState<string | null>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('California’s homes');
  const [guestNotes, setGuestNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<
    'unit_balance' | 'wire_transfer' | 'direct_ach' | 'zelle'
  >('wire_transfer');

  // Optional remittance proof during checkout
  const [senderName, setSenderName] = useState('');
  const [originatingBank, setOriginatingBank] = useState('');
  const [wireReference, setWireReference] = useState('');
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState('');

  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Order Tracker & Post-Checkout Proof Submission
  const [lookupInput, setLookupInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | null>(null);

  const [proofSender, setProofSender] = useState('');
  const [proofBank, setProofBank] = useState('');
  const [proofRef, setProofRef] = useState('');
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofFeedback, setProofFeedback] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // Fetch official bank instructions
  useEffect(() => {
    fetch('/api/payment-accounts')
      .then((r) => r.json())
      .then((d) => {
        if (d.paymentAccounts) setPaymentAccounts(d.paymentAccounts);
      })
      .catch(() => {});
  }, []);

  // Verify existing Client Portal token if present
  useEffect(() => {
    if (!clientToken) {
      setClientAccount(null);
      return;
    }
    fetch('/api/php/dashboard/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: clientToken }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.customer) {
          const acct = {
            name: d.customer.name,
            email: d.customer.email,
            phone: d.customer.phone || '',
            company: d.customer.company || '',
            role: d.customer.role || '',
            units_balance: Number(d.units_balance ?? d.customer.units_balance ?? 0),
            balance_usd: Number(d.balance_usd ?? d.customer.balance_usd ?? 0),
          };
          setClientAccount(acct);
          setCustomerName((prev) => prev || acct.name);
          setCustomerEmail((prev) => prev || acct.email);
          setCustomerPhone((prev) => prev || acct.phone);
          setCompany((prev) => prev || acct.company);
          setRole((prev) => prev || acct.role);
        } else {
          setClientAccount(null);
        }
      })
      .catch(() => {});
  }, [clientToken]);

  // Revalidate availability and server pricing whenever entering checkout
  useEffect(() => {
    if (activeTab === 'checkout' && cart.items.length > 0 && !completedOrder) {
      revalidateCart().then((res) => {
        if (res.valid) {
          setRevalidatedMessage('Availability and pricing verified with live inventory.');
        }
      });
    }
  }, [activeTab]);

  const hasUnitPackage = cart.items.some((item) => item.itemType === 'unit_package');
  const hasUnavailableItems = cart.items.some((item) => !item.available);

  useEffect(() => {
    if (hasUnitPackage && paymentMethod === 'unit_balance') {
      setPaymentMethod('wire_transfer');
    }
  }, [hasUnitPackage, paymentMethod]);

  const handleManualRevalidate = async () => {
    setRevalidatedMessage(null);
    const result = await revalidateCart();
    if (result.valid) {
      setRevalidatedMessage(
        `Verified at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: all ${
          result.cart.items.length
        } item(s) are available and priced accurately.`,
      );
    } else if (result.issues.length > 0) {
      setRevalidatedMessage(result.issues[0]);
    }
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = await applyPromo(promoInput.trim());
    if (ok) setPromoInput('');
  };

  const handlePortalQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortalAuthLoading(true);
    setPortalAuthError(null);
    try {
      const res = await fetch('/api/php/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: portalEmail, password: portalPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        setPortalAuthError(data.message || 'Sign-in failed. Check your credentials.');
        return;
      }
      window.localStorage.setItem('etl_php_token', data.token);
      setClientToken(data.token);
    } catch {
      setPortalAuthError('Unable to reach Client Portal authentication service.');
    } finally {
      setPortalAuthLoading(false);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setCheckoutError('Receipt attachment must be under 4 MB.');
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setSubmittingCheckout(true);

    try {
      // Final server-side revalidation before order submission
      const check = await revalidateCart();
      if (!check.valid) {
        setCheckoutError(
          check.issues[0] || 'Please resolve unavailable items in your cart before placing your order.',
        );
        setSubmittingCheckout(false);
        return;
      }

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          customerToken: clientToken || undefined,
          customerName,
          customerEmail,
          customerPhone,
          company: company || undefined,
          role: role || undefined,
          billingAddress: {
            line1,
            city,
            state: stateCode,
            postalCode,
            country,
          },
          guestNotes: guestNotes || undefined,
          paymentMethod,
          transferDetails:
            paymentMethod !== 'unit_balance' && (senderName.trim() || wireReference.trim())
              ? {
                  senderName: senderName.trim(),
                  originatingBank: originatingBank.trim(),
                  wireReference: wireReference.trim(),
                  transferDate,
                  receiptFileName: receiptFileName || undefined,
                  receiptDataUrl: receiptDataUrl || undefined,
                }
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCheckoutError(data.message || 'Unable to process checkout. Please review your details.');
        return;
      }

      setCompletedOrder(data.order);
      if (data.paymentAccounts) {
        setPaymentAccounts(data.paymentAccounts);
      }
      await syncCart();

      // Refresh client unit balance if settled with units
      if (clientToken) {
        fetch('/api/php/dashboard/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: clientToken }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.customer) {
              setClientAccount((prev) =>
                prev
                  ? {
                      ...prev,
                      units_balance: Number(d.units_balance ?? 0),
                      balance_usd: Number(d.balance_usd ?? 0),
                    }
                  : null,
              );
            }
          })
          .catch(() => {});
      }
    } catch {
      setCheckoutError('Network error while submitting your order. Please try again.');
    } finally {
      setSubmittingCheckout(false);
    }
  };

  const handleLookupOrder = async (e?: React.FormEvent, explicitRef?: string) => {
    if (e) e.preventDefault();
    const targetRef = (explicitRef ?? lookupInput).trim();
    if (!targetRef) return;
    setLookupLoading(true);
    setLookupError(null);
    setProofFeedback(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(targetRef)}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setLookupError(data.message || 'Order reference not found.');
        setTrackedOrder(null);
        return;
      }
      setTrackedOrder(data.order);
      if (data.paymentAccounts) setPaymentAccounts(data.paymentAccounts);
    } catch {
      setLookupError('Unable to look up order status right now.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmitProof = async (orderRef: string, isCompletedScreen: boolean) => {
    if (!proofSender.trim() || !proofRef.trim()) {
      setProofFeedback('Please provide both the sender account name and transfer reference code.');
      return;
    }
    setProofSubmitting(true);
    setProofFeedback(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderRef)}/submit-payment-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: proofSender.trim(),
          originatingBank: proofBank.trim() || 'Client Bank',
          wireReference: proofRef.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setProofFeedback(data.message || 'Could not submit payment proof.');
        return;
      }
      if (isCompletedScreen) {
        setCompletedOrder(data.order);
      } else {
        setTrackedOrder(data.order);
      }
      setProofSender('');
      setProofBank('');
      setProofRef('');
      setProofFeedback(data.message);
    } catch {
      setProofFeedback('Network error while submitting transfer reference.');
    } finally {
      setProofSubmitting(false);
    }
  };

  const renderPaymentStatusBanner = (order: OrderRecord) => {
    if (order.paymentStatus === 'paid') {
      return (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Backend Payment Verified
              </span>
              <h3 className="font-heading font-extrabold text-xl text-gray-950">
                Payment Confirmed — Order {order.orderReference}
              </h3>
              <p className="text-sm text-emerald-900 mt-1">
                Verified via {order.verifiedBy || 'Platform Ledger'} • Reference:{' '}
                <span className="font-mono font-bold">{order.paymentReference || 'Settled'}</span>. A confirmation receipt has been dispatched to{' '}
                <span className="font-semibold">{order.customerEmail}</span>.
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider shrink-0">
            Paid &amp; Confirmed
          </span>
        </div>
      );
    }

    if (order.paymentStatus === 'pending_verification') {
      return (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <Clock className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                Awaiting Treasury Verification
              </span>
              <h3 className="font-heading font-extrabold text-xl text-gray-950">
                Order Recorded — Payment Pending Verification ({order.orderReference})
              </h3>
              <p className="text-sm text-amber-950 mt-1">
                We logged transfer reference{' '}
                <span className="font-mono font-bold">{order.paymentReference}</span>. Payment is{' '}
                <strong>not yet marked complete</strong>—final confirmation issues automatically once our accounting team verifies bank settlement (typically 2–4 business hours).
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider shrink-0">
            Pending Verification
          </span>
        </div>
      );
    }

    if (order.paymentStatus === 'failed' || order.paymentStatus === 'cancelled') {
      return (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                Action Required
              </span>
              <h3 className="font-heading font-extrabold text-xl text-[#282828]">
                Payment {order.paymentStatus === 'failed' ? 'Unverified / Failed' : 'Cancelled'} ({order.orderReference})
              </h3>
              <p className="text-sm text-rose-900 mt-1">
                {order.adminNotes ||
                  'We could not verify this payment reference. Please submit an updated wire/ACH/Zelle confirmation below or contact our team.'}
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider shrink-0">
            {order.paymentStatus.replace('_', ' ')}
          </span>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-2xl bg-[#f5efe8] border border-[#dfd3c5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Clock className="w-7 h-7 text-[#82634f] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#82634f]">
              Order Reserved — Payment Required
            </span>
            <h3 className="font-heading font-extrabold text-xl text-[#282828]">
              Order {order.orderReference} Created — Awaiting Remittance
            </h3>
            <p className="text-sm text-[#4a3d33] mt-1">
              Your order invoice has been sent to <span className="font-semibold">{order.customerEmail}</span>. Complete your transfer using the receiving account coordinates below and submit your reference number so we can verify settlement.
            </p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-lg bg-[#82634f] text-white text-xs font-extrabold uppercase tracking-wider shrink-0">
          Pending Payment
        </span>
      </div>
    );
  };

  const renderOrderReceiptCard = (order: OrderRecord, isCompletedScreen: boolean) => (
    <div className="space-y-6">
      {renderPaymentStatusBanner(order)}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Itemized Order & Customer Info */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs text-gray-500">Order Reference</span>
              <div className="font-mono font-black text-lg text-gray-950">{order.orderReference}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Order Date</span>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="font-bold text-gray-500 uppercase block mb-1">Guest / Account</span>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
              {order.company && <p className="text-gray-500 mt-0.5">{order.company}</p>}
            </div>
            <div>
              <span className="font-bold text-gray-500 uppercase block mb-1">Billing Address</span>
              <p className="text-gray-800">{order.billingAddress.line1}</p>
              <p className="text-gray-800">
                {order.billingAddress.city}, {order.billingAddress.state}{' '}
                {order.billingAddress.postalCode}
              </p>
              <p className="text-gray-500">{order.billingAddress.country}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-700">
              Ordered Residences, Vehicles &amp; Services
            </h4>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.subtitle}</div>
                    <div className="text-xs text-gray-500 tabular-nums">
                      {item.quantity} {item.quantityLabel} × ${item.unitPriceUsd.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-sm text-gray-950 tabular-nums shrink-0">
                  ${item.lineSubtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 space-y-1.5 text-sm tabular-nums">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {order.serviceFeeUsd > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Suite Preparation &amp; Sanitization</span>
                <span>${order.serviceFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Taxes</span>
              <span>${order.taxUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {order.discountUsd > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                <span>-${order.discountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between font-heading font-black text-lg text-gray-950">
              <span>Order Total</span>
              <span>${order.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-800 inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt / Invoice
            </button>
            <button
              type="button"
              onClick={() => {
                setCompletedOrder(null);
                onNavigate('properties');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-xs font-bold text-white inline-flex items-center gap-2 cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        </div>

        {/* Right: Treasury Instructions & Payment Proof Submission */}
        <div className="lg:col-span-5 space-y-5">
          {order.paymentStatus !== 'paid' && paymentAccounts && (
            <div className="relative overflow-hidden text-white rounded-2xl p-6 space-y-4 border border-[#3d3129]">
              <LivePhotoBackground scene="twilight" overlay="dark" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7ce8df]">
                  Official Receiving Treasury
                </span>
                <h4 className="font-heading font-extrabold text-lg text-white">
                  Wire, Direct ACH &amp; Zelle Coordinates
                </h4>
              </div>

              <div className="relative z-10 space-y-2 text-xs bg-[#1c1612]/90 p-4 rounded-xl border border-[#4a3c32] tabular-nums">
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">Bank</span>
                  <span className="font-bold text-right">{paymentAccounts.bankName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">Beneficiary</span>
                  <span className="font-bold text-right">{paymentAccounts.accountName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">Account #</span>
                  <span className="font-mono font-bold">{paymentAccounts.accountNumber}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">ACH Routing</span>
                  <span className="font-mono font-bold">{paymentAccounts.achRoutingNumber}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">Wire Routing</span>
                  <span className="font-mono font-bold">{paymentAccounts.wireRoutingNumber}</span>
                </div>
                <div className="flex justify-between gap-2 pt-1.5 border-t border-[#4a3c32]">
                  <span className="text-[#c8baaa]">Zelle Address</span>
                  <span className="font-mono font-bold text-[#7ce8df]">{paymentAccounts.zelleEmail}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#c8baaa]">Required Memo</span>
                  <span className="font-mono font-bold text-amber-300">{order.orderReference}</span>
                </div>
              </div>

              {(order.paymentStatus === 'pending_payment' || order.paymentStatus === 'failed') && (
                <div className="relative z-10 pt-2 space-y-3 border-t border-white/15">
                  <h5 className="font-heading font-bold text-sm text-white">
                    Submit Transfer Confirmation Reference
                  </h5>
                  <input
                    type="text"
                    value={proofSender}
                    onChange={(e) => setProofSender(e.target.value)}
                    placeholder="Sender Account or Organization Name"
                    className="w-full h-10 px-3 rounded-xl bg-[#1c1612]/90 border border-[#4a3c32] text-xs text-white placeholder:text-[#9c8c7c] outline-none focus:border-[#00b7a8]"
                  />
                  <input
                    type="text"
                    value={proofBank}
                    onChange={(e) => setProofBank(e.target.value)}
                    placeholder="Originating Bank (e.g. Chase, Bank of America)"
                    className="w-full h-10 px-3 rounded-xl bg-[#1c1612]/90 border border-[#4a3c32] text-xs text-white placeholder:text-[#9c8c7c] outline-none focus:border-[#00b7a8]"
                  />
                  <input
                    type="text"
                    value={proofRef}
                    onChange={(e) => setProofRef(e.target.value)}
                    placeholder="Wire IMAD / ACH Trace / Zelle Confirmation #"
                    className="w-full h-10 px-3 rounded-xl bg-[#1c1612]/90 border border-[#4a3c32] text-xs text-white placeholder:text-[#9c8c7c] outline-none focus:border-[#00b7a8]"
                  />
                  <button
                    type="button"
                    disabled={proofSubmitting}
                    onClick={() => handleSubmitProof(order.orderReference, isCompletedScreen)}
                    className="w-full py-2.5 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    {proofSubmitting ? 'Submitting...' : 'Submit Payment Reference for Verification'}
                  </button>
                </div>
              )}

              {proofFeedback && (
                <p className="relative z-10 text-xs text-[#7ce8df] font-medium">{proofFeedback}</p>
              )}
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2 text-xs text-gray-600">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#00b7a8]" />
              Transactional Confirmation &amp; Support
            </div>
            <p className="leading-relaxed">
              Confirmation notice logged at{' '}
              {new Date(order.confirmationEmailSentAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              . Need to adjust arrival times or add a service? Call{' '}
              <a href="tel:9168003295" className="font-bold text-gray-900 underline">
                916-800-3295
              </a>{' '}
              or reference <span className="font-mono font-bold">{order.orderReference}</span> in the Client Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Recommended quick add-ons not yet in cart
  const recommendedAddons = catalogItems
    .filter((c) => c.available && !cart.items.some((ci) => ci.referenceId === c.id))
    .slice(0, 3);

  return (
    <div className="bg-[#faf8f5] min-h-[75vh] pb-14">
      {/* Live Realistic Photography Header Banner */}
      <div className="relative overflow-hidden py-10 md:py-12 mb-8 border-b border-[#e6dfd5]">
        <LivePhotoBackground
          scene="courtyard"
          secondaryScene="interior"
          overlay="espresso"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-[#7ce8df] hover:text-white inline-flex items-center gap-1.5 mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Storefront
            </button>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
              {completedOrder
                ? `Order Summary — ${completedOrder.orderReference}`
                : activeTab === 'cart'
                ? 'Your Shopping Cart'
                : activeTab === 'checkout'
                ? 'Secure Checkout & Payment'
                : 'Order Lookup & Payment Status'}
            </h1>
          </div>

          <div className="inline-flex rounded-xl bg-white/95 backdrop-blur-xs p-1 border border-[#e6dfd5] shadow-md self-start">
            <button
              type="button"
              onClick={() => {
                setCompletedOrder(null);
                setActiveTab('cart');
                onNavigate('cart');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer tabular-nums ${
                activeTab === 'cart' && !completedOrder
                  ? 'bg-[#00b7a8] text-white'
                  : 'text-[#5c5046] hover:text-[#282828]'
              }`}
            >
              1. Cart ({cart.itemCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setCompletedOrder(null);
                setActiveTab('checkout');
                onNavigate('checkout');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'checkout' && !completedOrder
                  ? 'bg-[#00b7a8] text-white'
                  : 'text-[#5c5046] hover:text-[#282828]'
              }`}
            >
              2. Checkout
            </button>
            <button
              type="button"
              onClick={() => {
                setCompletedOrder(null);
                setActiveTab('track');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-[#00b7a8] text-white'
                  : 'text-[#5c5046] hover:text-[#282828]'
              }`}
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Live Context Feedback */}
        {banner && !completedOrder && (
          <div
            className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
              banner.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : banner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <span>{banner.text}</span>
            <button type="button" onClick={clearBanner} className="underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* COMPLETED ORDER RECEIPT VIEW */}
        {completedOrder ? (
          renderOrderReceiptCard(completedOrder, true)
        ) : activeTab === 'track' ? (
          /* ORDER TRACKER TAB */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs max-w-3xl">
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Check Order &amp; Payment Verification Status
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter your Order Reference (for example,{' '}
                <button
                  type="button"
                  onClick={() => {
                    setLookupInput('ORD-ETL-842105');
                    handleLookupOrder(undefined, 'ORD-ETL-842105');
                  }}
                  className="font-mono font-bold text-[#358385] underline cursor-pointer"
                >
                  ORD-ETL-842105
                </button>{' '}
                or{' '}
                <button
                  type="button"
                  onClick={() => {
                    setLookupInput('ORD-ETL-849320');
                    handleLookupOrder(undefined, 'ORD-ETL-849320');
                  }}
                  className="font-mono font-bold text-[#358385] underline cursor-pointer"
                >
                  ORD-ETL-849320
                </button>
                ) to view real-time payment verification status or submit bank remittance details.
              </p>

              <form onSubmit={(e) => handleLookupOrder(e)} className="mt-5 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={lookupInput}
                  onChange={(e) => setLookupInput(e.target.value.toUpperCase())}
                  placeholder="ORD-ETL-XXXXXX"
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-300 font-mono text-sm uppercase outline-none focus:border-[#00b7a8]"
                />
                <button
                  type="submit"
                  disabled={lookupLoading || !lookupInput.trim()}
                  className="h-12 px-6 rounded-xl bg-[#00b7a8] hover:bg-[#009f92] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{lookupLoading ? 'Checking...' : 'Look Up Order'}</span>
                </button>
              </form>

              {lookupError && (
                <p className="mt-3 text-xs font-semibold text-red-600">{lookupError}</p>
              )}
            </div>

            {trackedOrder && renderOrderReceiptCard(trackedOrder, false)}
          </div>
        ) : isLoading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#00b7a8] mx-auto" />
            <p className="text-sm text-gray-500">Synchronizing your shopping cart...</p>
          </div>
        ) : cart.items.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-gray-950">
                Your shopping cart is empty
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Add a furnished 1- or 2-bedroom residence, a 3D fleet vehicle rental, concierge arrival services, or prepaid Lodging Unit bundles to get started.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('properties')}
                className="px-5 py-3 rounded-xl bg-[#00b7a8] hover:bg-[#009f92] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Browse Residences
              </button>
              <button
                type="button"
                onClick={() => onNavigate('vehicles')}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Explore 3D Fleet
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Services &amp; Unit Bundles
              </button>
            </div>
          </div>
        ) : activeTab === 'cart' ? (
          /* FULL DEDICATED CART PAGE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                    Selected Items ({cart.items.length})
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={handleManualRevalidate}
                      className="text-xs font-bold text-[#358385] hover:text-[#00b7a8] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isMutating ? 'animate-spin' : ''}`} />
                      Revalidate Availability &amp; Pricing
                    </button>
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => clearCart()}
                      className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Cart
                    </button>
                  </div>
                </div>

                {revalidatedMessage && (
                  <div className="px-6 py-3 bg-teal-50/70 border-b border-teal-200 text-xs text-teal-900 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00b7a8] shrink-0" />
                    <span>{revalidatedMessage}</span>
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                        className="w-full sm:w-28 h-36 sm:h-28 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#358385]">
                              {item.category}
                            </span>
                            <h3 className="font-heading font-extrabold text-base md:text-lg text-gray-950">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                            {!item.available && (
                              <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold">
                                {item.unavailableReason || 'Unavailable — Remove to proceed'}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50">
                              <button
                                type="button"
                                disabled={isMutating || item.quantity <= item.minQuantity}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 text-gray-700 hover:text-gray-950 disabled:opacity-35 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3.5 text-sm font-extrabold text-gray-900 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={isMutating || item.quantity >= item.maxQuantity}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 text-gray-700 hover:text-gray-950 disabled:opacity-35 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {item.quantityLabel} (min {item.minQuantity}, max {item.maxQuantity})
                            </span>
                          </div>

                          <div className="text-right tabular-nums">
                            <div className="text-lg font-heading font-black text-gray-950">
                              ${item.lineSubtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-400">
                              ${item.unitPriceUsd.toLocaleString()} per unit
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping & Quick Add-ons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('properties')}
                  className="text-xs font-extrabold uppercase tracking-wider text-gray-700 hover:text-[#00b7a8] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping Residences &amp; Services
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="text-xs font-bold text-[#358385] hover:underline cursor-pointer"
                >
                  Browse All Add-On Services →
                </button>
              </div>

              {recommendedAddons.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-700">
                    Popular Arrival &amp; Comfort Upgrades
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedAddons.map((addon) => (
                      <div
                        key={addon.id}
                        className="p-4 rounded-xl border border-gray-200 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#358385]">{addon.category}</div>
                          <div className="font-heading font-bold text-sm text-gray-900 mt-0.5 line-clamp-2">
                            {addon.title}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="font-extrabold text-sm text-gray-900 tabular-nums">
                            ${addon.priceUsd.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() =>
                              addItem(
                                { referenceId: addon.id, itemType: addon.itemType, quantity: 1 },
                                { openDrawer: false, successMessage: `Added "${addon.title}" to cart.` },
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-bold cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Price Breakdown & Promo */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e6dfd5] p-6 space-y-5 shadow-xs sticky top-24">
              <h2 className="font-heading font-extrabold text-lg text-[#282828] border-b border-[#efe9e0] pb-3">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5c5046] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#00b7a8]" />
                  Promotional Code
                </label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder={cart.promoCode || 'WELCOME10'}
                    className="flex-1 h-10 px-3 rounded-xl border border-[#dfd7cc] text-xs font-bold uppercase outline-none focus:border-[#00b7a8]"
                  />
                  <button
                    type="submit"
                    disabled={isMutating || !promoInput.trim()}
                    className="px-4 h-10 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {cart.promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>Applied: {cart.promoCode}</span>
                    <button
                      type="button"
                      onClick={() => removePromo()}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {cart.promoDescription && (
                  <p className="text-[11px] text-gray-500">{cart.promoDescription}</p>
                )}
                {!cart.promoCode && promoHints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {promoHints.map((hint) => (
                      <button
                        key={hint.code}
                        type="button"
                        onClick={() => applyPromo(hint.code)}
                        className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-[10px] font-bold text-teal-900 hover:bg-teal-100 cursor-pointer"
                        title={hint.description}
                      >
                        {hint.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-3 border-t border-gray-100 text-sm tabular-nums">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${cart.subtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {cart.serviceFeeUsd > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Suite Prep &amp; Inspection</span>
                    <span className="font-semibold text-gray-900">
                      ${cart.serviceFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Taxes</span>
                  <span className="font-semibold text-gray-900">
                    {cart.taxUsd === 0
                      ? '$0.00'
                      : `$${cart.taxUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                {cart.discountUsd > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promo Savings</span>
                    <span>
                      -${cart.discountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
                  <div>
                    <span className="font-heading font-extrabold text-base text-gray-950">
                      Estimated Total
                    </span>
                    <span className="block text-xs text-gray-500">
                      Or {cart.totalUnitsRequired} Lodging Units
                    </span>
                  </div>
                  <span className="text-2xl font-heading font-black text-gray-950">
                    ${cart.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isMutating || hasUnavailableItems}
                onClick={() => {
                  setActiveTab('checkout');
                  onNavigate('checkout');
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-[#00b7a8] hover:bg-[#009f92] disabled:bg-gray-300 text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                All totals are calculated on our server. Stays of 30+ consecutive days qualify for California occupancy tax exemption.
              </p>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Guest / Contact Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="font-heading font-extrabold text-lg text-gray-950">
                    1. Primary Guest or Purchaser Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Used for booking agreements, arrival instructions, and official payment receipts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(916) 555-0192"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Household, Organization, or Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional — family stay, relocation, employer, etc."
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Stay, Arrival, or Delivery Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    placeholder="Flight arrival time, dietary notes for pantry provisioning, pet details, or check-in questions..."
                    className="w-full p-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="font-heading font-extrabold text-lg text-gray-950">
                    2. Billing Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="400 Capitol Mall, Suite 100"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ZIP / Postal *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#00b7a8]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="font-heading font-extrabold text-lg text-gray-950">
                    3. Payment &amp; Settlement Method
                  </h2>
                  <p className="text-xs text-gray-500">
                    Orders paid with verified Client Portal Units confirm immediately. Bank Wire, Direct ACH, and Zelle orders remain Pending Verification until settlement is confirmed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'wire_transfer' as const,
                      label: 'Bank Wire Transfer',
                      sub: 'Domestic or international wire',
                      icon: Building2,
                      disabled: false,
                    },
                    {
                      id: 'direct_ach' as const,
                      label: 'Direct ACH Transfer',
                      sub: 'Personal or business checking',
                      icon: CreditCard,
                      disabled: false,
                    },
                    {
                      id: 'zelle' as const,
                      label: 'Zelle Transfer',
                      sub: 'Fast bank-to-bank remittance',
                      icon: ShieldCheck,
                      disabled: false,
                    },
                    {
                      id: 'unit_balance' as const,
                      label: 'Client Portal Unit Balance',
                      sub: hasUnitPackage
                        ? 'Unavailable for Unit Bundles'
                        : `${cart.totalUnitsRequired} Units required`,
                      icon: Wallet,
                      disabled: hasUnitPackage,
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const selected = paymentMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          selected
                            ? 'border-[#00b7a8] bg-teal-50/40 ring-1 ring-[#00b7a8]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            selected ? 'text-[#00b7a8]' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <div className="font-heading font-bold text-sm text-gray-900">
                            {opt.label}
                          </div>
                          <div className="text-xs text-gray-500 tabular-nums">{opt.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'unit_balance' ? (
                  <div className="p-5 rounded-xl bg-[#f5efe8] border border-[#dfd3c5] text-[#282828] space-y-4">
                    {clientAccount ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6b5c50]">Signed-In Client Account</span>
                          <span className="text-xs font-bold text-[#00897d]">{clientAccount.email}</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-2 border-t border-[#dfd3c5] tabular-nums">
                          <span className="text-sm font-bold text-[#282828]">Available Balance</span>
                          <span className="text-xl font-heading font-black text-[#282828]">
                            {clientAccount.units_balance} Units (${clientAccount.balance_usd.toLocaleString()})
                          </span>
                        </div>
                        {clientAccount.units_balance < cart.totalUnitsRequired && (
                          <p className="text-xs text-amber-800 pt-1">
                            Your balance ({clientAccount.units_balance} Units) is below the{' '}
                            {cart.totalUnitsRequired} Units required for this order. Choose Wire/ACH/Zelle or add Units in the Client Portal.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-[#4a3d33]">
                          Sign in to your Client Portal account to verify and deduct{' '}
                          <strong className="text-[#282828]">{cart.totalUnitsRequired} Lodging Units</strong>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="email"
                            value={portalEmail}
                            onChange={(e) => setPortalEmail(e.target.value)}
                            placeholder="Client Email"
                            className="h-10 px-3 rounded-lg bg-white border border-[#dfd3c5] text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                          />
                          <input
                            type="password"
                            value={portalPassword}
                            onChange={(e) => setPortalPassword(e.target.value)}
                            placeholder="Password"
                            className="h-10 px-3 rounded-lg bg-white border border-[#dfd3c5] text-xs text-[#282828] outline-none focus:border-[#00b7a8]"
                          />
                        </div>
                        {portalAuthError && (
                          <p className="text-xs text-rose-700 font-semibold">{portalAuthError}</p>
                        )}
                        <button
                          type="button"
                          disabled={portalAuthLoading}
                          onClick={handlePortalQuickSignIn}
                          className="px-4 py-2 rounded-lg bg-[#00b7a8] hover:bg-[#009e91] text-white text-xs font-black uppercase tracking-wider cursor-pointer"
                        >
                          {portalAuthLoading ? 'Signing In...' : 'Connect Client Balance'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                    {paymentAccounts && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3.5 rounded-xl border border-gray-200 tabular-nums">
                        <div>
                          <span className="text-gray-400 block">Receiving Bank</span>
                          <span className="font-bold text-gray-900">{paymentAccounts.bankName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Beneficiary</span>
                          <span className="font-bold text-gray-900">{paymentAccounts.accountName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Account / Routing</span>
                          <span className="font-mono font-bold text-gray-900">
                            Acct {paymentAccounts.accountNumber} • ACH {paymentAccounts.achRoutingNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Zelle Recipient</span>
                          <span className="font-mono font-bold text-[#358385]">{paymentAccounts.zelleEmail}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>Already initiated your transfer?</strong> Enter your remittance details below to queue immediate treasury verification, or leave blank to receive an official invoice first and submit your transfer reference afterward.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Sender Account Name (Optional now)"
                          className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#00b7a8]"
                        />
                        <input
                          type="text"
                          value={originatingBank}
                          onChange={(e) => setOriginatingBank(e.target.value)}
                          placeholder="Originating Bank (Optional now)"
                          className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#00b7a8]"
                        />
                        <input
                          type="text"
                          value={wireReference}
                          onChange={(e) => setWireReference(e.target.value)}
                          placeholder="Wire / ACH / Zelle Reference # (Optional now)"
                          className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#00b7a8]"
                        />
                        <input
                          type="date"
                          value={transferDate}
                          onChange={(e) => setTransferDate(e.target.value)}
                          className="h-10 px-3 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:border-[#00b7a8]"
                        />
                      </div>

                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:border-[#00b7a8] cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#00b7a8]" />
                        <span>
                          {receiptFileName ? `Attached: ${receiptFileName}` : 'Attach Optional Transfer Receipt (PDF/Image)'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Final Order Review */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-heading font-extrabold text-lg text-gray-950">
                  Order Review ({cart.items.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cart');
                    onNavigate('cart');
                  }}
                  className="text-xs font-bold text-[#358385] hover:underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{item.title}</div>
                        <div className="text-gray-500 truncate">{item.subtitle}</div>
                        <div className="text-gray-400 tabular-nums">
                          {item.quantity} {item.quantityLabel}
                        </div>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 tabular-nums shrink-0">
                      ${item.lineSubtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100 text-sm tabular-nums">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.subtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {cart.serviceFeeUsd > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Suite Preparation &amp; Sanitization</span>
                    <span>${cart.serviceFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Taxes</span>
                  <span>
                    {cart.taxUsd === 0
                      ? '$0.00 (Tax-Exempt)'
                      : `$${cart.taxUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                {cart.discountUsd > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({cart.promoCode})</span>
                    <span>-${cart.discountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
                  <div>
                    <span className="font-heading font-extrabold text-base text-gray-950">
                      Total Due
                    </span>
                    <span className="block text-xs text-gray-500">
                      {cart.totalUnitsRequired} Lodging Units equivalent
                    </span>
                  </div>
                  <span className="text-2xl font-heading font-black text-gray-950">
                    ${cart.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  submittingCheckout ||
                  hasUnavailableItems ||
                  (paymentMethod === 'unit_balance' &&
                    (!clientAccount || clientAccount.units_balance < cart.totalUnitsRequired))
                }
                className="w-full py-4 px-6 rounded-xl bg-[#00b7a8] hover:bg-[#009f92] disabled:bg-gray-300 text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {submittingCheckout ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying &amp; Creating Order...</span>
                  </>
                ) : paymentMethod === 'unit_balance' ? (
                  <span>Verify &amp; Pay with {cart.totalUnitsRequired} Lodging Units</span>
                ) : wireReference.trim() && senderName.trim() ? (
                  <span>Submit Order &amp; Queue Payment Verification</span>
                ) : (
                  <span>Place Order &amp; Generate Transfer Invoice</span>
                )}
              </button>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                By placing your order, you agree to our house guidelines and cancellation terms. Bank wire, ACH, and Zelle orders are confirmed once settlement is verified by our accounting team.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
