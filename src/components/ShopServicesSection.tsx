import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Car,
  Check,
  Minus,
  Package,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { CatalogServiceItem, useCart } from '../context/CartContext';
import { LivePhotoBackground } from './LivePhotoBackground';

interface ShopServicesSectionProps {
  compact?: boolean;
  onNavigate?: (view: string) => void;
}

const FALLBACK_IMAGE =
  'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg';

export const ShopServicesSection: React.FC<ShopServicesSectionProps> = ({
  compact = false,
  onNavigate,
}) => {
  const { catalogItems, addItem, isMutating, openDrawer, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(catalogItems.map((i) => i.category)));
    return ['All', ...unique];
  }, [catalogItems]);

  const displayedItems = useMemo(() => {
    const filtered =
      selectedCategory === 'All'
        ? catalogItems
        : catalogItems.filter((item) => item.category === selectedCategory);
    return compact ? filtered.slice(0, 4) : filtered;
  }, [catalogItems, compact, selectedCategory]);

  const getQty = (id: string) => quantities[id] || 1;

  const setQty = (item: CatalogServiceItem, next: number) => {
    const clamped = Math.min(item.maxQuantity || 10, Math.max(1, next));
    setQuantities((prev) => ({ ...prev, [item.id]: clamped }));
  };

  const handleAdd = async (item: CatalogServiceItem) => {
    const qty = getQty(item.id);
    const ok = await addItem(
      {
        referenceId: item.id,
        itemType: item.itemType,
        quantity: qty,
      },
      {
        openDrawer: true,
        successMessage: `Added ${qty} × "${item.title}" to your cart.`,
      },
    );
    if (ok) {
      setJustAddedId(item.id);
      window.setTimeout(() => setJustAddedId(null), 2000);
    }
  };

  return (
    <section
      id="shop-services"
      className={compact ? 'py-16 bg-[#f7f3ed] border-t border-[#e6dfd5]' : 'bg-[#faf8f5] pb-16 md:pb-24'}
    >
      {/* Live Realistic Header Banner on Dedicated Storefront View */}
      {!compact && (
        <div className="relative overflow-hidden py-14 md:py-20 mb-12 border-b border-[#e6dfd5]">
          <LivePhotoBackground
            scene="interior"
            secondaryScene="courtyard"
            overlay="espresso"
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 type-support font-semibold text-[#7ce8df]">
                <Package className="w-4 h-4 text-[#00b7a8]" />
                Guest Services, Arrival Add-Ons &amp; Prepaid Unit Packages
              </span>
              <h1 className="type-h1 text-white">
                Services, Arrival Upgrades &amp; Lodging Unit Packages
              </h1>
              <p className="type-body-lg text-[#efe7dc]">
                Combine furnished residences and fleet rentals with airport pickups, stocked pantries, scheduled housekeeping, home-office equipment, or prepaid Lodging Unit bundles in one unified order.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={openDrawer}
                className="px-5 py-3 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white type-btn whitespace-nowrap inline-flex items-center gap-2 transition-colors cursor-pointer tabular-nums shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Open Cart ({cart.itemCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        {compact && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 type-support font-semibold text-[#00897d]">
                <Package className="w-4 h-4 text-[#00b7a8]" />
                Guest Services, Add-Ons &amp; Prepaid Unit Packages
              </span>
              <h2 className="type-h2 text-[#282828]">
                Tailor Your Stay with Concierge Add-Ons &amp; Flexible Unit Bundles
              </h2>
              <p className="type-body text-[#5c5046]">
                Combine furnished residences and fleet rentals with airport pickups, stocked pantries, scheduled housekeeping, home-office equipment, or prepaid Lodging Unit bundles in one unified order.
              </p>
            </div>

            {onNavigate && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="px-5 py-3 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-white type-btn whitespace-nowrap inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>View All Services &amp; Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Filter Bar */}
        {!compact && categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-[#e6dfd5] mb-10">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg type-btn whitespace-nowrap transition-colors cursor-pointer border ${
                    active
                      ? 'bg-[#00b7a8] text-white border-[#00b7a8] shadow-xs'
                      : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#00b7a8] hover:text-[#282828]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {displayedItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#e6dfd5]">
            <Package className="w-10 h-10 text-[#857568] mx-auto mb-3" />
            <h3 className="type-h3 text-[#282828]">
              No catalog services match this filter
            </h3>
            <p className="type-body text-[#5c5046] mt-1.5">
              Select another category or browse our furnished residences and vehicle fleet below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedItems.map((item) => {
              const qty = getQty(item.id);
              const isAdded = justAddedId === item.id;
              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white overflow-hidden flex flex-col transition-all shadow-2xs hover:shadow-md ${
                    item.available ? 'border-[#e6dfd5]' : 'border-[#e6dfd5] opacity-75'
                  }`}
                >
                  <div className="relative h-48 bg-[#f4efe9] overflow-hidden">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#241d18]/85 text-white type-support font-semibold">
                        {item.category}
                      </span>
                      {item.itemType === 'unit_package' && item.unitsIncluded && (
                        <span className="px-2.5 py-1 rounded-md bg-[#00b7a8] text-white type-support font-semibold tabular-nums">
                          {item.unitsIncluded} Units
                        </span>
                      )}
                    </div>
                    {!item.available && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-rose-600 text-white type-support font-semibold">
                        Currently Unavailable
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="type-support font-mono text-[#857568] uppercase">
                          {item.sku}
                        </span>
                        <div className="text-right tabular-nums">
                          <span className="text-xl sm:text-2xl font-bold text-[#282828]">
                            ${item.priceUsd.toLocaleString()}
                          </span>
                          <span className="type-support text-[#857568] ml-1">{item.billingUnitLabel}</span>
                        </div>
                      </div>

                      <h3 className="type-h3 text-[#282828]">
                        {item.title}
                      </h3>
                      <p className="type-body text-[#5c5046]">{item.shortDesc}</p>

                      {!compact && item.highlights?.length > 0 && (
                        <ul className="pt-2.5 space-y-2 border-t border-[#efe9e0]">
                          {item.highlights.slice(0, 3).map((point, idx) => (
                            <li
                              key={idx}
                              className="type-support text-[#5c5046] flex items-start gap-2"
                            >
                              <Check className="w-4 h-4 text-[#00b7a8] shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#efe9e0] flex items-center justify-between gap-3">
                      <div className="inline-flex items-center border border-[#dfd7cc] rounded-xl bg-[#faf8f5]">
                        <button
                          type="button"
                          disabled={!item.available || qty <= 1 || isMutating}
                          onClick={() => setQty(item, qty - 1)}
                          aria-label="Decrease quantity"
                          className="p-2.5 text-[#5c5046] hover:text-[#282828] disabled:opacity-35 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-[#282828] tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          disabled={!item.available || qty >= item.maxQuantity || isMutating}
                          onClick={() => setQty(item, qty + 1)}
                          aria-label="Increase quantity"
                          className="p-2.5 text-[#5c5046] hover:text-[#282828] disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={!item.available || isMutating}
                        onClick={() => handleAdd(item)}
                        className={`flex-1 py-2.5 px-4 rounded-xl type-btn whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${
                          !item.available
                            ? 'bg-[#ebe4da] text-[#857568]'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#00b7a8] hover:bg-[#009e91] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : item.available ? (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        ) : (
                          <span>Unavailable</span>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Cross-Navigation Cards on Full Storefront Page */}
        {!compact && onNavigate && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden p-7 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#3d3129]">
              <LivePhotoBackground scene="courtyard" overlay="espresso" />
              <div className="relative z-10 space-y-2">
                <span className="type-support font-semibold text-[#7ce8df] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#00b7a8]" />
                  1- &amp; 2-Bedroom Residences
                </span>
                <h3 className="type-h3 text-white">
                  Add a Furnished Suite to Your Order
                </h3>
                <p className="type-body text-[#efe7dc] max-w-md">
                  Choose short stays (5–29 nights) or tax-exempt extended stays (1–12 months) with utilities, Wi-Fi, and parking included.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('properties')}
                className="relative z-10 px-5 py-3 rounded-xl bg-[#00b7a8] hover:bg-[#009e91] text-white type-btn whitespace-nowrap shrink-0 cursor-pointer transition-colors shadow-sm"
              >
                Explore Suites
              </button>
            </div>

            <div className="relative overflow-hidden p-7 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#3d3129]">
              <LivePhotoBackground scene="twilight" overlay="espresso" />
              <div className="relative z-10 space-y-2">
                <span className="type-support font-semibold text-[#f3d9c4] flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#00b7a8]" />
                  Interactive 3D Vehicle Fleet
                </span>
                <h3 className="type-h3 text-white">
                  Bundle Airport or Doorstep Mobility
                </h3>
                <p className="type-body text-[#efe7dc] max-w-md">
                  Inspect vehicles in 3D and add daily, weekly, or monthly rental days directly to the same cart.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('vehicles')}
                className="relative z-10 px-5 py-3 rounded-xl bg-[#82634f] hover:bg-[#6e5240] text-white type-btn whitespace-nowrap shrink-0 cursor-pointer transition-colors shadow-sm"
              >
                Inspect Fleet
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
