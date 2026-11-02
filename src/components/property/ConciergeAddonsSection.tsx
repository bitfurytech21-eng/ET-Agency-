import React, { useMemo, useState } from 'react';
import {
  Activity,
  Car,
  Check,
  Compass,
  ConciergeBell,
  HeartHandshake,
  Minus,
  Plane,
  Plus,
  ShoppingBasket,
  Utensils,
  Waves,
} from 'lucide-react';
import { CatalogServiceItem } from '../../context/CartContext';
import { CONCIERGE_CATEGORIES } from '../../data/propertyEnrichment';

interface ConciergeAddonsSectionProps {
  services: CatalogServiceItem[];
  selectedQuantities: Record<string, number>;
  onChangeQuantity: (serviceId: string, nextQty: number) => void;
  onExploreVehicles?: () => void;
}

function getCategoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes('airport')) return Plane;
  if (c.includes('chauffeur') || c.includes('car')) return Car;
  if (c.includes('chef')) return Utensils;
  if (c.includes('grocery') || c.includes('restock')) return ShoppingBasket;
  if (c.includes('massage') || c.includes('spa')) return HeartHandshake;
  if (c.includes('yoga')) return Activity;
  if (c.includes('surf')) return Waves;
  if (c.includes('hiking') || c.includes('horse') || c.includes('wine')) return Compass;
  return ConciergeBell;
}

export const ConciergeAddonsSection: React.FC<ConciergeAddonsSectionProps> = ({
  services,
  selectedQuantities,
  onChangeQuantity,
  onExploreVehicles,
}) => {
  const activeServices = useMemo(
    () => services.filter((item) => item.itemType === 'addon_service' && item.available),
    [services],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const availableCategories = useMemo(() => {
    const present = new Set(activeServices.map((s) => s.category));
    const ordered: string[] = [];
    for (const cat of CONCIERGE_CATEGORIES) {
      if (present.has(cat)) ordered.push(cat);
    }
    for (const cat of present) {
      if (!ordered.includes(cat)) ordered.push(cat);
    }
    return ordered;
  }, [activeServices]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return activeServices;
    return activeServices.filter((s) => s.category === selectedCategory);
  }, [activeServices, selectedCategory]);

  const selectedCount = useMemo(
    () => Object.values(selectedQuantities).reduce((acc, q) => acc + (q > 0 ? 1 : 0), 0),
    [selectedQuantities],
  );

  const selectedSubtotal = useMemo(() => {
    return activeServices.reduce((sum, svc) => {
      const qty = selectedQuantities[svc.id] || 0;
      return sum + svc.priceUsd * qty;
    }, 0);
  }, [activeServices, selectedQuantities]);

  if (activeServices.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="type-h2 text-[#1b1d20]">Concierge Add-Ons &amp; Tailored Experiences</h2>
          <p className="type-body text-[#5c5046] mt-1">
            Personalize your arrival and stay with private transportation, culinary service, wellness sessions, and curated California experiences. Selected services calculate directly into your reservation total.
          </p>
        </div>

        {selectedCount > 0 && (
          <div className="type-support text-[#1b1d20] bg-[#faf8f5] border border-[#e6dfd5] px-4 py-2.5 rounded-lg tabular-nums shrink-0">
            <strong className="font-semibold text-[#00897d]">{selectedCount}</strong>{' '}
            {selectedCount === 1 ? 'service' : 'services'} added ·{' '}
            <strong className="font-semibold">${selectedSubtotal.toLocaleString()}</strong>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`type-btn px-3.5 py-2 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#1b1d20] text-white border-[#1b1d20]'
              : 'bg-white text-[#5c5046] border-[#dfd7cc] hover:border-[#82634f] hover:text-[#1b1d20]'
          }`}
        >
          All Services ({activeServices.length})
        </button>

        {availableCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`type-btn px-3.5 py-2 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#1b1d20] text-white border-[#1b1d20]'
                  : 'bg-white text-[#5c5046] border-[#dfd7cc] hover:border-[#82634f] hover:text-[#1b1d20]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Concierge Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const Icon = getCategoryIcon(service.category);
          const qty = selectedQuantities[service.id] || 0;
          const isSelected = qty > 0;
          const maxQty = Math.max(1, service.maxQuantity || 10);

          return (
            <div
              key={service.id}
              className={`p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-[#f4fbfa] border-[#00897d]'
                  : 'bg-white border-[#e6dfd5] hover:border-[#c8bdb0]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg border border-[#e6dfd5] bg-[#faf8f5] flex items-center justify-center shrink-0 text-[#5c5046]">
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div className="type-support text-[#697076] truncate">
                      <span>{service.category}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="text-[#00897d] font-medium">Available</span>
                    </div>
                  </div>

                  <div className="text-right tabular-nums shrink-0">
                    <span className="type-nav font-bold text-[#1b1d20] block">
                      ${service.priceUsd.toLocaleString()}
                    </span>
                    <span className="type-support text-[#697076]">{service.billingUnitLabel}</span>
                  </div>
                </div>

                <h3 className="type-nav font-semibold text-[#1b1d20]">{service.title}</h3>
                <p className="type-support text-[#434a4f]">{service.shortDesc}</p>
              </div>

              <div className="pt-3 border-t border-[#efe9e0] flex items-center justify-between gap-3">
                {service.category === 'Car Rentals' && onExploreVehicles ? (
                  <button
                    type="button"
                    onClick={onExploreVehicles}
                    className="type-support font-semibold text-[#00897d] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Browse 3D Vehicle Fleet →
                  </button>
                ) : (
                  <span className="type-support text-[#697076] tabular-nums">
                    {isSelected
                      ? `Line subtotal: $${(service.priceUsd * qty).toLocaleString()}`
                      : 'Optional stay enhancement'}
                  </span>
                )}

                {isSelected ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(service.id, Math.max(0, qty - 1))}
                      aria-label={`Decrease quantity for ${service.title}`}
                      className="w-9 h-9 rounded-lg border border-[#dfd7cc] bg-white hover:bg-[#faf8f5] text-[#1b1d20] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="type-nav font-semibold text-[#1b1d20] w-6 text-center tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      disabled={qty >= maxQty}
                      onClick={() => onChangeQuantity(service.id, Math.min(maxQty, qty + 1))}
                      aria-label={`Increase quantity for ${service.title}`}
                      className="w-9 h-9 rounded-lg border border-[#dfd7cc] bg-white hover:bg-[#faf8f5] disabled:opacity-40 text-[#1b1d20] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(service.id, 1)}
                    className="type-btn px-3.5 py-2 rounded-lg border border-[#dfd7cc] bg-white hover:border-[#00897d] hover:text-[#00897d] text-[#1b1d20] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Stay</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="type-support text-[#282828] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#00897d] shrink-0" />
            <span>
              Your selected concierge services ({selectedCount}) are included in the booking summary and checkout estimate.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              Object.keys(selectedQuantities).forEach((id) => onChangeQuantity(id, 0));
            }}
            className="type-btn text-[#5c5046] hover:text-[#1b1d20] cursor-pointer whitespace-nowrap"
          >
            Clear Selected Add-Ons
          </button>
        </div>
      )}
    </div>
  );
};
