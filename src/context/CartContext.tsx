import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PROPERTIES, Property } from '../data/lodgingData';
import { BookingAddonSelection, enrichPropertyRecord } from '../data/propertyEnrichment';

export type CatalogItemType = 'accommodation' | 'vehicle' | 'addon_service' | 'unit_package';

export interface CatalogServiceItem {
  id: string;
  sku: string;
  itemType: 'addon_service' | 'unit_package';
  category: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceUsd: number;
  billingUnitLabel: string;
  unitsIncluded?: number;
  image: string;
  available: boolean;
  maxQuantity: number;
  featured?: boolean;
  highlights: string[];
}

export interface LiveVehicleInventory {
  id: string;
  name: string;
  make: string;
  category: string;
  year: number;
  licensePlate: string;
  mileage: number;
  hubLocation: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  inventoryStatus: 'available' | 'rented' | 'maintenance';
  image: string;
}

export interface PromoHint {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotalUsd: number;
}

export interface CartItemMetadata {
  billingUnit?: 'month' | 'night' | 'day' | 'item';
  checkIn?: string;
  checkOut?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  exteriorColorName?: string;
  exteriorColorHex?: string;
  protectionPlan?: 'standard' | 'executive_shield';
  guests?: number;
  adults?: number;
  children?: number;
  infants?: number;
  selectedAddons?: BookingAddonSelection[];
  unitsIncluded?: number;
  notes?: string;
}

export interface CartItem {
  id: string;
  referenceId: string;
  itemType: CatalogItemType;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  quantityLabel: string;
  lineSubtotalUsd: number;
  available: boolean;
  unavailableReason?: string;
  metadata?: CartItemMetadata;
}

export interface CartData {
  cartId: string;
  items: CartItem[];
  promoCode?: string;
  promoDescription?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  itemCount: number;
  validationIssues: string[];
  updatedAt: string;
}

export interface AddCartPayload {
  referenceId: string;
  itemType: CatalogItemType;
  quantity?: number;
  metadata?: CartItemMetadata;
}

interface CartBanner {
  type: 'success' | 'error' | 'info';
  text: string;
}

interface CartContextValue {
  cartId: string;
  cart: CartData;
  isLoading: boolean;
  isMutating: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  banner: CartBanner | null;
  clearBanner: () => void;
  liveProperties: Property[];
  liveVehicles: LiveVehicleInventory[];
  catalogItems: CatalogServiceItem[];
  promoHints: PromoHint[];
  refreshCatalog: () => Promise<void>;
  syncCart: () => Promise<void>;
  addItem: (
    payload: AddCartPayload,
    options?: { openDrawer?: boolean; openDrawerOnSuccess?: boolean; successMessage?: string },
  ) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  applyPromo: (code: string) => Promise<boolean>;
  removePromo: () => Promise<boolean>;
  revalidateCart: () => Promise<{ valid: boolean; issues: string[]; cart: CartData }>;
  wishlistIds: string[];
  isWishlisted: (propertyId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (propertyId: string) => Promise<{ ok: boolean; saved?: boolean; requiresAuth?: boolean }>;
}

const CART_STORAGE_KEY = 'etl_cart_id';

function getInitialCartId(): string {
  if (typeof window === 'undefined') return 'etl_cart_ssr';
  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  if (stored && /^[a-zA-Z0-9_-]{8,64}$/.test(stored)) {
    return stored;
  }
  const fresh = `etl_cart_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
  window.localStorage.setItem(CART_STORAGE_KEY, fresh);
  return fresh;
}

function createEmptyCart(cartId: string): CartData {
  return {
    cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: new Date().toISOString(),
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartId] = useState<string>(getInitialCartId);
  const [cart, setCart] = useState<CartData>(() => createEmptyCart(cartId));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [banner, setBanner] = useState<CartBanner | null>(null);

  const [liveProperties, setLiveProperties] = useState<Property[]>(PROPERTIES);
  const [liveVehicles, setLiveVehicles] = useState<LiveVehicleInventory[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogServiceItem[]>([]);
  const [promoHints, setPromoHints] = useState<PromoHint[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const showBanner = useCallback((type: CartBanner['type'], text: string) => {
    setBanner({ type, text });
  }, []);

  const clearBanner = useCallback(() => setBanner(null), []);

  const refreshWishlist = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('etl_php_token');
    if (!token) {
      setWishlistIds([]);
      return;
    }
    try {
      const res = await fetch('/api/dashboard/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) setWishlistIds([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.wishlist)) {
        setWishlistIds(data.wishlist);
      }
    } catch {
      // Keep current wishlist state on transient failure
    }
  }, []);

  const isWishlisted = useCallback(
    (propertyId: string) => wishlistIds.includes(propertyId),
    [wishlistIds],
  );

  const toggleWishlist = useCallback(
    async (propertyId: string): Promise<{ ok: boolean; saved?: boolean; requiresAuth?: boolean }> => {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('etl_php_token') : null;
      if (!token) {
        return { ok: false, requiresAuth: true };
      }
      try {
        const res = await fetch('/api/dashboard/wishlist/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId }),
        });
        const data = await res.json();
        if (res.status === 401) {
          setWishlistIds([]);
          return { ok: false, requiresAuth: true };
        }
        if (!res.ok) {
          showBanner('error', data.message || 'Unable to update wishlist.');
          return { ok: false };
        }
        if (Array.isArray(data.wishlist)) {
          setWishlistIds(data.wishlist);
        }
        showBanner('info', data.message || (data.saved ? 'Saved to wishlist.' : 'Removed from wishlist.'));
        return { ok: true, saved: Boolean(data.saved) };
      } catch {
        showBanner('error', 'Network error while updating wishlist.');
        return { ok: false };
      }
    },
    [showBanner],
  );

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.properties) && data.properties.length > 0) {
        const merged: Property[] = data.properties.map((srvProp: any) => {
          const fallback = PROPERTIES.find((p) => p.id === srvProp.id);
          const srvImages = Array.isArray(srvProp.images) ? srvProp.images.filter(Boolean) : [];
          const fallbackImages = fallback?.images || [];
          const resolvedImages = srvImages.length > 0 ? srvImages : fallbackImages;
          return enrichPropertyRecord({
            ...(fallback || {}),
            ...srvProp,
            images: resolvedImages,
            liveUrl: srvProp.liveUrl || fallback?.liveUrl || 'https://easytravellodging.com/',
          });
        });
        setLiveProperties(merged);
      }
      if (Array.isArray(data.vehicles)) {
        setLiveVehicles(data.vehicles);
      }
      if (Array.isArray(data.catalogItems)) {
        setCatalogItems(data.catalogItems);
      }
      if (Array.isArray(data.promoHints)) {
        setPromoHints(data.promoHints);
      }
    } catch {
      // Keep local fallback catalog if network momentarily unavailable
    }
  }, []);

  const syncCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`);
      const data = await res.json();
      if (res.ok && data.cart) {
        setCart(data.cart);
      }
    } catch {
      // Retain current state on transient failure
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    refreshCatalog();
    syncCart();
    refreshWishlist();
  }, [refreshCatalog, syncCart, refreshWishlist]);

  useEffect(() => {
    if (!banner) return;
    const timer = window.setTimeout(() => {
      setBanner(null);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [banner]);

  const addItem = useCallback(
    async (
      payload: AddCartPayload,
      options?: { openDrawer?: boolean; openDrawerOnSuccess?: boolean; successMessage?: string },
    ): Promise<boolean> => {
      setIsMutating(true);
      clearBanner();
      try {
        const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          showBanner('error', data.message || 'Unable to add item to cart.');
          return false;
        }
        setCart(data.cart);
        showBanner('success', options?.successMessage || 'Added to your cart.');
        const shouldOpen = options?.openDrawerOnSuccess ?? options?.openDrawer ?? true;
        if (shouldOpen) {
          setIsDrawerOpen(true);
        }
        return true;
      } catch {
        showBanner('error', 'Network error while updating your cart. Please try again.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [cartId, clearBanner, showBanner],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<boolean> => {
      setIsMutating(true);
      clearBanner();
      try {
        const res = await fetch(
          `/api/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          },
        );
        const data = await res.json();
        if (!res.ok) {
          showBanner('error', data.message || 'Unable to update quantity.');
          return false;
        }
        setCart(data.cart);
        showBanner('success', 'Cart totals updated.');
        return true;
      } catch {
        showBanner('error', 'Unable to reach server to update quantity.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [cartId, clearBanner, showBanner],
  );

  const removeItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      setIsMutating(true);
      clearBanner();
      try {
        const res = await fetch(
          `/api/cart/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`,
          { method: 'DELETE' },
        );
        const data = await res.json();
        if (!res.ok) {
          showBanner('error', data.message || 'Unable to remove item.');
          return false;
        }
        setCart(data.cart);
        showBanner('info', 'Item removed from your cart.');
        return true;
      } catch {
        showBanner('error', 'Network error while removing item.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [cartId, clearBanner, showBanner],
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsMutating(true);
    clearBanner();
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.message || 'Unable to clear cart.');
        return false;
      }
      setCart(data.cart);
      showBanner('info', 'Your shopping cart has been cleared.');
      return true;
    } catch {
      showBanner('error', 'Network error while clearing cart.');
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [cartId, clearBanner, showBanner]);

  const applyPromo = useCallback(
    async (code: string): Promise<boolean> => {
      setIsMutating(true);
      clearBanner();
      try {
        const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}/promo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (!res.ok) {
          showBanner('error', data.message || 'Invalid promotional code.');
          return false;
        }
        setCart(data.cart);
        showBanner(
          'success',
          data.cart.promoCode
            ? `Promotional code ${data.cart.promoCode} applied.`
            : 'Promotional code removed.',
        );
        return true;
      } catch {
        showBanner('error', 'Unable to validate promotional code right now.');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [cartId, clearBanner, showBanner],
  );

  const removePromo = useCallback(async (): Promise<boolean> => {
    return applyPromo('');
  }, [applyPromo]);

  const revalidateCart = useCallback(async () => {
    setIsMutating(true);
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(cartId)}/validate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.cart) {
        setCart(data.cart);
        await refreshCatalog();
        return {
          valid: Boolean(data.valid),
          issues: Array.isArray(data.issues) ? data.issues : [],
          cart: data.cart as CartData,
        };
      }
      return { valid: false, issues: [data.message || 'Validation failed'], cart };
    } catch {
      return {
        valid: false,
        issues: ['Could not verify live availability with the server.'],
        cart,
      };
    } finally {
      setIsMutating(false);
    }
  }, [cart, cartId, refreshCatalog]);

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        isLoading,
        isMutating,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        banner,
        clearBanner,
        liveProperties,
        liveVehicles,
        catalogItems,
        promoHints,
        refreshCatalog,
        syncCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromo,
        removePromo,
        revalidateCart,
        wishlistIds,
        isWishlisted,
        refreshWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
