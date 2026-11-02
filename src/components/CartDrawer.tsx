import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LivePhotoBackground } from './LivePhotoBackground';

interface CartDrawerProps {
  onNavigate: (view: string) => void;
}

const FALLBACK_IMAGE =
  'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg';

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    isLoading,
    isMutating,
    banner,
    clearBanner,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromo,
    removePromo,
    promoHints,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = await applyPromo(promoInput.trim());
    if (ok) setPromoInput('');
  };

  const hasUnavailableItems = cart.items.some((item) => !item.available);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Warm Espresso Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-[#1c1613]/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Shopping Cart"
        className="relative z-10 w-full max-w-lg bg-[#faf8f5] h-full shadow-2xl flex flex-col border-l border-[#e6dfd5]"
      >
        {/* Live Realistic Photo Header */}
        <div className="relative overflow-hidden px-6 py-5 border-b border-[#3a2f28] flex items-center justify-between text-white">
          <LivePhotoBackground scene="courtyard" overlay="espresso" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b7a8]/20 border border-[#00b7a8]/50 flex items-center justify-center text-[#7ce8df] shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="type-h4 text-white">
                  Your Reservation &amp; Service Cart
                </h2>
                <span className="px-2 py-0.5 type-support font-semibold bg-[#00b7a8] text-white rounded-md tabular-nums">
                  {cart.itemCount}
                </span>
              </div>
              <p className="type-support text-[#efe7dc]">
                Residences, fleet rentals, guest add-ons &amp; unit packages
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
            className="relative z-10 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        {banner && (
          <div
            className={`px-6 py-3 type-support font-semibold flex items-center justify-between gap-2 border-b ${
              banner.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : banner.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-[#f5efe8] text-[#3d2e24] border-[#dfd3c5]'
            }`}
          >
            <div className="flex items-center gap-2">
              {banner.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#00b7a8] shrink-0" />
              )}
              <span>{banner.text}</span>
            </div>
            <button
              type="button"
              onClick={clearBanner}
              className="text-current opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Validation Warnings */}
        {cart.validationIssues.length > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 type-support text-amber-900 space-y-1">
            {cart.validationIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#5c5046] gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#00b7a8]" />
              <p className="type-body font-medium">Loading your saved items...</p>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="py-14 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#e6dfd5] flex items-center justify-center text-[#82634f]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="type-h3 text-[#282828]">
                  Your cart is currently empty
                </h3>
                <p className="type-body text-[#5c5046]">
                  Explore furnished apartments, 3D fleet rentals, arrival services, or prepaid Lodging Unit bundles to start building your order.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    onNavigate('properties');
                  }}
                  className="px-3 py-2.5 rounded-lg bg-white border border-[#dfd7cc] hover:border-[#00b7a8] type-btn whitespace-nowrap text-[#282828] hover:text-[#00897d] transition-colors cursor-pointer"
                >
                  Browse Suites
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    onNavigate('vehicles');
                  }}
                  className="px-3 py-2.5 rounded-lg bg-white border border-[#dfd7cc] hover:border-[#00b7a8] type-btn whitespace-nowrap text-[#282828] hover:text-[#00897d] transition-colors cursor-pointer"
                >
                  Fleet Rentals
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    onNavigate('shop');
                  }}
                  className="px-3 py-2.5 rounded-lg bg-[#00b7a8] hover:bg-[#009e91] type-btn whitespace-nowrap text-white transition-colors cursor-pointer"
                >
                  Guest Services
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between type-support text-[#5c5046] pb-1">
                <span>
                  {cart.items.length} distinct {cart.items.length === 1 ? 'listing' : 'listings'}
                </span>
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => clearCart()}
                  className="text-rose-600 hover:text-rose-700 type-btn inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.available
                      ? 'bg-white border-[#e6dfd5] hover:border-[#d5cabd]'
                      : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-20 h-20 rounded-lg object-cover shrink-0 bg-[#f4efe9] border border-[#e6dfd5]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="type-support font-semibold text-[#00897d] truncate">
                          {item.itemType === 'accommodation'
                            ? 'Furnished Residence'
                            : item.itemType === 'vehicle'
                            ? 'Fleet Rental'
                            : item.itemType === 'unit_package'
                            ? 'Lodging Unit Bundle'
                            : 'Concierge Add-On'}
                        </span>
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-[#857568] hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="type-h4 text-[#282828] mt-0.5">
                        {item.title}
                      </h3>
                      <p className="type-support text-[#5c5046] mt-0.5">{item.subtitle}</p>

                      {!item.available && (
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded bg-rose-100 text-rose-700 type-support font-semibold">
                          {item.unavailableReason || 'Currently Unavailable'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Line Price */}
                  <div className="mt-3.5 pt-3 border-t border-[#efe9e0] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center border border-[#dfd7cc] rounded-lg bg-[#faf8f5]">
                        <button
                          type="button"
                          disabled={isMutating || item.quantity <= item.minQuantity}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-2 text-[#5c5046] hover:text-[#282828] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-sm font-semibold text-[#282828] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={isMutating || item.quantity >= item.maxQuantity}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-2 text-[#5c5046] hover:text-[#282828] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="type-support text-[#5c5046] font-medium">
                        {item.quantityLabel}
                      </span>
                    </div>

                    <div className="text-right tabular-nums">
                      <div className="text-base font-bold text-[#282828]">
                        ${item.lineSubtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="type-support text-[#857568]">
                        ${item.unitPriceUsd.toLocaleString()} /{' '}
                        {item.quantityLabel === 'Months (30-Day)'
                          ? 'mo'
                          : item.quantityLabel === 'Nights'
                          ? 'night'
                          : item.quantityLabel === 'Rental Days'
                          ? 'day'
                          : 'ea'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Box */}
              <div className="p-4 rounded-xl bg-white border border-[#e6dfd5] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="type-label text-[#282828] flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#00b7a8]" />
                    Promotional or Extended-Stay Code
                  </span>
                  {cart.promoCode && (
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => removePromo()}
                      className="type-support font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove ({cart.promoCode})
                    </button>
                  )}
                </div>

                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder={cart.promoCode ? `Active: ${cart.promoCode}` : 'Enter code (e.g. WELCOME10)'}
                    className="flex-1 h-10 px-3 rounded-lg border border-[#dfd7cc] bg-[#faf8f5] text-sm font-mono font-medium uppercase text-[#282828] outline-none focus:border-[#00b7a8]"
                  />
                  <button
                    type="submit"
                    disabled={isMutating || !promoInput.trim()}
                    className="px-4 h-10 rounded-lg bg-[#82634f] hover:bg-[#6e5240] text-white type-btn transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {cart.promoDescription && (
                  <p className="type-support text-[#00897d] font-medium">{cart.promoDescription}</p>
                )}

                {!cart.promoCode && promoHints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {promoHints.map((hint) => (
                      <button
                        key={hint.code}
                        type="button"
                        disabled={isMutating}
                        onClick={() => applyPromo(hint.code)}
                        className="px-2.5 py-1 rounded-md border border-[#b9ebe6] bg-[#e8f8f6] hover:bg-[#d5f3ef] type-support font-mono font-semibold text-[#007a70] cursor-pointer transition-colors"
                        title={hint.description}
                      >
                        {hint.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.items.length > 0 && (
          <div className="border-t border-[#e6dfd5] bg-white px-6 py-5 space-y-4">
            <div className="space-y-2 type-support tabular-nums">
              <div className="flex justify-between text-[#5c5046]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#282828]">
                  ${cart.subtotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {cart.serviceFeeUsd > 0 && (
                <div className="flex justify-between text-[#5c5046]">
                  <span>Suite Preparation &amp; Sanitization</span>
                  <span className="font-semibold text-[#282828]">
                    ${cart.serviceFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#5c5046]">
                <span>Estimated Taxes</span>
                <span className="font-semibold text-[#282828]">
                  {cart.taxUsd === 0
                    ? '$0.00 (Tax-Exempt Eligible)'
                    : `$${cart.taxUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
              {cart.discountUsd > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount ({cart.promoCode})</span>
                  <span>
                    -${cart.discountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="pt-2.5 border-t border-[#e6dfd5] flex items-baseline justify-between gap-2">
                <div>
                  <span className="type-h4 text-[#282828]">Estimated Total</span>
                  <span className="block type-support text-[#857568]">
                    Or {cart.totalUnitsRequired} Lodging Units via Client Portal
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-[#282828]">
                  ${cart.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  onNavigate('cart');
                }}
                className="py-3 px-4 rounded-xl border border-[#dfd7cc] bg-[#faf8f5] hover:bg-[#f2ece4] type-btn whitespace-nowrap text-[#282828] transition-colors cursor-pointer"
              >
                View Full Cart
              </button>
              <button
                type="button"
                disabled={isMutating || hasUnavailableItems}
                onClick={() => {
                  closeDrawer();
                  onNavigate('checkout');
                }}
                className="py-3 px-4 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] disabled:bg-[#dfd7cc] type-btn whitespace-nowrap text-white transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
