import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  RefreshCw,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Landmark,
  Building2,
  Car,
  Users,
  FileSpreadsheet,
  Wrench,
  Eye,
  X,
  Coins,
  Download,
  Inbox,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Package,
  Tag,
  Plus,
  Trash2,
  Search,
  Edit3,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getFallbackPropertyImage } from '../data/lodgingData';
import { LivePhotoBackground } from './LivePhotoBackground';
import { AdminProperties } from './admin/AdminProperties';
import { AdminReservations } from './admin/AdminReservations';
import { AdminCarRentals } from './admin/AdminCarRentals';
import { AdminPayments } from './admin/AdminPayments';
import { AdminGuests } from './admin/AdminGuests';
import { AdminHosts } from './admin/AdminHosts';
import { AdminHousekeeping } from './admin/AdminHousekeeping';
import { AdminReports } from './admin/AdminReports';
import { AdminSettings } from './admin/AdminSettings';
import type { AdminProperty, AdminReservation, AdminVehicle, AdminGuest } from './admin/adminTypes';

interface AdminPortalProps {
  onNavigateTab: (tab: string) => void;
}

interface AdminOverview {
  totalProperties: number;
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalVehicleBookings: number;
  activeVehicleBookings: number;
  pendingWireCount: number;
  pendingWireAmount: number;
  newInquiriesCount: number;
  totalRevenue: number;
  totalOrders?: number;
  paidOrdersCount?: number;
  pendingOrdersCount?: number;
  orderRevenueUsd?: number;
  averageOrderValueUsd?: number;
  activeCatalogCount?: number;
  activePromoCount?: number;
}

interface AdminManualPayment {
  id: string;
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  targetType: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
  targetId?: string;
  unitsRequested: number;
  amountUsd: number;
  paymentMethod: string;
  senderName: string;
  originatingBank: string;
  wireReference: string;
  transferDate: string;
  receiptFileName?: string;
  receiptDataUrl?: string;
  notes?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

interface AdminHousingBooking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  employer?: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  unitCostUnits?: number;
  unitCostUsd?: number;
  status: string;
  paymentProvider?: string;
  paymentReference?: string;
  notes?: string;
}

interface AdminVehicleBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  exteriorColorName: string;
  exteriorColorHex: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pickupLocation: string;
  totalUsd: number;
  unitsRequired: number;
  status: string;
  paymentReference?: string;
}

interface AdminVehicleInventory {
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
  maintenanceLogs: Array<{
    id: string;
    serviceType: string;
    notes: string;
    costUsd: number;
    date: string;
    performedBy: string;
  }>;
}

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  units_balance: number;
  balance_usd: number;
  created_at: string;
}

interface AdminInquiry {
  id: string;
  referenceCode: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  propertyId?: string;
  moveInDate?: string;
  duration?: string;
  message?: string;
  status: 'new' | 'reviewed' | 'archived';
  createdAt: string;
}

interface AdminAuditLog {
  id: string;
  actorEmail: string;
  action: string;
  targetId: string;
  details: string;
  createdAt: string;
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

interface AdminOrderItem {
  id: string;
  referenceId: string;
  itemType: string;
  title: string;
  category: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  quantityLabel: string;
  lineSubtotalUsd: number;
}

interface AdminOrderRecord {
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
  items: AdminOrderItem[];
  promoCode?: string;
  subtotalUsd: number;
  serviceFeeUsd: number;
  taxUsd: number;
  discountUsd: number;
  totalUsd: number;
  totalUnitsRequired: number;
  paymentMethod: 'unit_balance' | 'wire_transfer' | 'direct_ach' | 'zelle';
  paymentStatus: 'pending_payment' | 'pending_verification' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentReference?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  adminNotes?: string;
  createdAt: string;
}

interface AdminPropertyRecord {
  id: string;
  unitNumber: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  monthlyRate: number;
  pricingNote: string;
  status: 'Available' | 'Inquired' | 'Reserved';
  minimumStayDays: number;
  images: string[];
}

interface AdminCatalogItem {
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

interface AdminPromoRecord {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotalUsd: number;
  maxDiscountUsd?: number;
  active: boolean;
  usageCount: number;
  expiresAt?: string;
}

type AdminTab =
  | 'properties'
  | 'reservations'
  | 'car-rentals'
  | 'payments'
  | 'guests'
  | 'hosts'
  | 'housekeeping'
  | 'reports'
  | 'settings'
  | 'overview'
  | 'orders'
  | 'catalog'
  | 'wires'
  | 'bookings'
  | 'fleet'
  | 'clients';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateTab }) => {
  const { refreshCatalog } = useCart();
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('etl_admin_token'));
  const [adminProfile, setAdminProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('properties');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('easytravelagency@trustagent.space');
  const [loginPassword, setLoginPassword] = useState('admin12345');

  // Dashboard state
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [properties, setProperties] = useState<AdminPropertyRecord[]>([]);
  const [catalogItems, setCatalogItems] = useState<AdminCatalogItem[]>([]);
  const [promoCodes, setPromoCodes] = useState<AdminPromoRecord[]>([]);
  const [manualPayments, setManualPayments] = useState<AdminManualPayment[]>([]);
  const [bookings, setBookings] = useState<AdminHousingBooking[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<AdminVehicleBooking[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicleInventory[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccountConfig | null>(null);

  // Action states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [wireFilter, setWireFilter] = useState<'all' | 'pending_verification' | 'verified' | 'rejected'>('all');
  const [wireNotesMap, setWireNotesMap] = useState<Record<string, string>>({});
  const [receiptPreview, setReceiptPreview] = useState<{ title: string; dataUrl: string } | null>(null);

  // Order management filter & notes state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<
    'all' | 'paid' | 'pending_verification' | 'pending_payment' | 'failed' | 'cancelled'
  >('all');
  const [orderNotesMap, setOrderNotesMap] = useState<Record<string, string>>({});

  // Catalog sub-section & forms state
  const [catalogSection, setCatalogSection] = useState<'suites' | 'services' | 'promos'>('suites');
  const [editingProperty, setEditingProperty] = useState<AdminPropertyRecord | null>(null);
  const [propPrimaryImage, setPropPrimaryImage] = useState('');
  const [editingCatalogItem, setEditingCatalogItem] = useState<AdminCatalogItem | null>(null);

  // New Catalog Item form
  const [newItemType, setNewItemType] = useState<'addon_service' | 'unit_package'>('addon_service');
  const [newItemCategory, setNewItemCategory] = useState('Arrival & Concierge');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemShortDesc, setNewItemShortDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('145');
  const [newItemBillingLabel, setNewItemBillingLabel] = useState('per service');
  const [newItemUnitsIncluded, setNewItemUnitsIncluded] = useState('10');
  const [newItemImage, setNewItemImage] = useState('');

  // New Promo Code form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState('10');
  const [newPromoMinSubtotal, setNewPromoMinSubtotal] = useState('250');

  // Unit Allocation modal state
  const [allocModalCustomer, setAllocModalCustomer] = useState<AdminCustomer | null>(null);
  const [allocDelta, setAllocDelta] = useState<string>('25');
  const [allocReason, setAllocReason] = useState<string>('Client Unit Allotment');

  // Vehicle Maintenance modal state
  const [maintVehicle, setMaintVehicle] = useState<AdminVehicleInventory | null>(null);
  const [maintType, setMaintType] = useState('Multi-Point Safety & Tire Inspection');
  const [maintNotes, setMaintNotes] = useState('');
  const [maintCost, setMaintCost] = useState('145');

  const fetchAdminDashboard = async (tokenToUse: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOverview(data.overview);
        setOrders(data.orders || []);
        setProperties(data.properties || []);
        setCatalogItems(data.catalogItems || []);
        setPromoCodes(data.promoCodes || []);
        setManualPayments(data.manualPayments || []);
        setBookings(data.bookings || []);
        setVehicleBookings(data.vehicleBookings || []);
        setVehicles(data.vehicles || []);
        setCustomers(data.customers || []);
        setInquiries(data.inquiries || []);
        setAuditLogs(data.auditLogs || []);
        setPaymentAccounts(data.paymentAccounts || null);
      }
    } catch (err) {
      console.error('[Admin Dashboard] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminDashboard(adminToken);
    }
  }, [adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        throw new Error(data.message || 'Invalid administrative credentials');
      }
      localStorage.setItem('etl_admin_token', data.token);
      setAdminToken(data.token);
      setAdminProfile(data.admin);
      setSuccessMsg(`Authenticated as ${data.admin.name}.`);
      fetchAdminDashboard(data.token);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('etl_admin_token');
    setAdminToken(null);
    setAdminProfile(null);
    setOverview(null);
  };

  const handleVerifyWire = async (paymentId: string, decision: 'verified' | 'rejected') => {
    if (!adminToken) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          paymentId,
          decision,
          adminNotes: wireNotesMap[paymentId] || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setSuccessMsg(data.message);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleHousingStatusChange = async (bookingId: string, status: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking update failed');
      setSuccessMsg(`Housing booking ${bookingId} marked as ${status}.`);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleConfirmHousingPayment = async (booking: AdminHousingBooking) => {
    if (!adminToken) return;
    try {
      const amount = booking.unitCostUsd || 2500;
      const res = await fetch('/api/payments/manual-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount,
          reference: `ADM-CONF-${Date.now().toString().slice(-5)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Manual confirm failed');
      setSuccessMsg(data.message);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Manual confirm failed');
    }
  };

  const handleVehicleBookingStatus = async (bookingId: string, status: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/vehicle-bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fleet booking update failed');
      setSuccessMsg(`Fleet reservation ${bookingId} updated to ${status}.`);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleVehicleInventoryStatus = async (vehicleId: string, inventoryStatus: 'available' | 'rented' | 'maintenance') => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ inventoryStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Vehicle update failed');
      setSuccessMsg(data.message);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Vehicle update failed');
    }
  };

  const handleLogMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !maintVehicle) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${maintVehicle.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          maintenanceNote: {
            serviceType: maintType,
            notes: maintNotes,
            costUsd: Number(maintCost) || 0,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not log maintenance');
      setSuccessMsg(`Logged service entry for ${maintVehicle.name}.`);
      setMaintVehicle(null);
      setMaintNotes('');
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Maintenance log failed');
    }
  };

  const handleAllocateUnits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !allocModalCustomer) return;
    try {
      const res = await fetch(`/api/admin/customers/${allocModalCustomer.id}/allocate-units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          unitsDelta: Number(allocDelta),
          reason: allocReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unit allocation failed');
      setSuccessMsg(data.message);
      setAllocModalCustomer(null);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unit allocation failed');
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: 'new' | 'reviewed' | 'archived') => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update inquiry');
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Inquiry update failed');
    }
  };

  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !paymentAccounts) return;
    try {
      const res = await fetch('/api/admin/payment-accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(paymentAccounts),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save bank instructions');
      setSuccessMsg(data.message);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleUpdateOrder = async (
    orderId: string,
    updates: {
      paymentStatus?: AdminOrderRecord['paymentStatus'];
      orderStatus?: AdminOrderRecord['orderStatus'];
      adminNotes?: string;
    },
  ) => {
    if (!adminToken) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order update failed');
      setSuccessMsg(data.message || 'Order updated.');
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Order update failed');
    }
  };

  const handleQuickPropertyStatus = async (propertyId: string, status: 'Available' | 'Inquired' | 'Reserved') => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Suite update failed');
      setSuccessMsg(`Suite ${propertyId} availability set to ${status}.`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Suite update failed');
    }
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingProperty) return;
    setErrorMsg(null);
    try {
      const restImages = (editingProperty.images || []).slice(1);
      const updatedImages = propPrimaryImage.trim()
        ? [propPrimaryImage.trim(), ...restImages]
        : editingProperty.images;

      const res = await fetch(`/api/admin/properties/${editingProperty.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: editingProperty.title,
          category: editingProperty.category,
          shortDesc: editingProperty.shortDesc,
          monthlyRate: Number(editingProperty.monthlyRate),
          pricingNote: editingProperty.pricingNote,
          status: editingProperty.status,
          minimumStayDays: Number(editingProperty.minimumStayDays),
          images: updatedImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not update residence');
      setSuccessMsg(`Updated ${editingProperty.title}.`);
      setEditingProperty(null);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update residence');
    }
  };

  const handleCreateCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          itemType: newItemType,
          category: newItemCategory.trim() || 'Guest Services',
          title: newItemTitle.trim(),
          shortDesc: newItemShortDesc.trim(),
          fullDesc: newItemShortDesc.trim(),
          priceUsd: Number(newItemPrice),
          billingUnitLabel: newItemType === 'unit_package' ? 'package' : newItemBillingLabel.trim() || 'per service',
          unitsIncluded: newItemType === 'unit_package' ? Number(newItemUnitsIncluded) || 10 : undefined,
          image: newItemImage.trim() || undefined,
          available: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not create catalog item');
      setSuccessMsg(`Added "${data.item.title}" to storefront catalog.`);
      setNewItemTitle('');
      setNewItemShortDesc('');
      setNewItemImage('');
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not create catalog item');
    }
  };

  const handleSaveCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingCatalogItem) return;
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/catalog/${editingCatalogItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: editingCatalogItem.title,
          category: editingCatalogItem.category,
          shortDesc: editingCatalogItem.shortDesc,
          priceUsd: Number(editingCatalogItem.priceUsd),
          billingUnitLabel: editingCatalogItem.billingUnitLabel,
          image: editingCatalogItem.image,
          available: editingCatalogItem.available,
          maxQuantity: Number(editingCatalogItem.maxQuantity) || 10,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not update catalog item');
      setSuccessMsg(`Updated "${editingCatalogItem.title}".`);
      setEditingCatalogItem(null);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update catalog item');
    }
  };

  const handleToggleCatalogAvailability = async (item: AdminCatalogItem) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/catalog/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ available: !item.available }),
      });
      if (!res.ok) throw new Error('Could not update availability');
      setSuccessMsg(`"${item.title}" is now ${!item.available ? 'available' : 'paused'}.`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Availability update failed');
    }
  };

  const handleDeleteCatalogItem = async (item: AdminCatalogItem) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/catalog/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Could not remove catalog item');
      setSuccessMsg(`Removed "${item.title}" from storefront.`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          code: newPromoCode.trim().toUpperCase(),
          description: newPromoDesc.trim(),
          discountType: newPromoType,
          discountValue: Number(newPromoValue),
          minSubtotalUsd: Number(newPromoMinSubtotal) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not create promo code');
      setSuccessMsg(`Promo code ${data.promo.code} created.`);
      setNewPromoCode('');
      setNewPromoDesc('');
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Promo creation failed');
    }
  };

  const handleTogglePromo = async (promo: AdminPromoRecord) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ active: !promo.active }),
      });
      if (!res.ok) throw new Error('Could not toggle promo code');
      setSuccessMsg(`Promo ${promo.code} ${!promo.active ? 'activated' : 'paused'}.`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Promo update failed');
    }
  };

  const handleDeletePromo = async (promo: AdminPromoRecord) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Could not delete promo code');
      setSuccessMsg(`Deleted promo code ${promo.code}.`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Promo delete failed');
    }
  };

  const exportCsv = (filename: string, headers: string[], rows: Array<Array<string | number>>) => {
    const escapeCell = (val: string | number) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csv = [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredWires = manualPayments.filter((m) => (wireFilter === 'all' ? true : m.status === wireFilter));
  const filteredOrders = orders.filter((o) => {
    if (orderPaymentFilter !== 'all' && o.paymentStatus !== orderPaymentFilter) return false;
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderReference.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  });

  const unifiedProperties: AdminProperty[] = properties.map((p) => ({
    id: p.id,
    unitNumber: p.unitNumber,
    title: p.title,
    category: p.category,
    shortDesc: p.shortDesc,
    fullDesc: p.fullDesc,
    monthlyRate: p.monthlyRate,
    pricingNote: p.pricingNote,
    status: p.status,
    minimumStayDays: p.minimumStayDays,
    images: p.images,
  }));

  const unifiedReservations: AdminReservation[] = [
    ...bookings.map((b) => ({
      id: b.id,
      type: 'accommodation' as const,
      targetId: b.propertyId,
      targetTitle: properties.find((p) => p.id === b.propertyId)?.title || b.propertyId,
      guestName: b.guestName,
      guestEmail: b.guestEmail,
      guestPhone: b.guestPhone,
      employer: b.employer,
      startDate: b.checkIn,
      endDate: b.checkOut,
      totalDays: b.totalNights,
      amountUsd: b.unitCostUsd || b.totalNights * 85,
      unitsCost: b.unitCostUnits,
      status: (b.status === 'awaiting_payment' ? 'pending' : b.status === 'confirmed' ? 'confirmed' : 'active') as AdminReservation['status'],
      paymentReference: b.paymentReference,
      notes: b.notes,
      createdAt: new Date().toISOString(),
    })),
    ...vehicleBookings.map((vb) => ({
      id: vb.id,
      type: 'car-rental' as const,
      targetId: vb.vehicleId,
      targetTitle: `${vb.vehicleName} (${vb.exteriorColorName || 'Standard'})`,
      guestName: vb.customerName,
      guestEmail: vb.customerEmail,
      guestPhone: vb.customerPhone,
      startDate: vb.pickupDate,
      endDate: vb.returnDate,
      totalDays: vb.totalDays,
      amountUsd: vb.totalUsd,
      unitsCost: vb.unitsRequired,
      status: (vb.status === 'awaiting_payment' ? 'pending' : vb.status === 'confirmed' ? 'confirmed' : 'active') as AdminReservation['status'],
      paymentReference: vb.paymentReference,
      createdAt: new Date().toISOString(),
    })),
  ];

  const unifiedVehicles: AdminVehicle[] = vehicles.map((v) => ({
    id: v.id,
    name: v.name,
    make: v.make,
    category: v.category,
    year: v.year,
    licensePlate: v.licensePlate,
    mileage: v.mileage,
    hubLocation: v.hubLocation,
    dailyRate: v.dailyRate,
    weeklyRate: v.weeklyRate,
    monthlyRate: v.monthlyRate,
    inventoryStatus: v.inventoryStatus as AdminVehicle['inventoryStatus'],
    maintenanceLogs: v.maintenanceLogs || [],
  }));

  const unifiedGuests: AdminGuest[] = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || '(916) 555-0199',
    company: c.company || 'Private Corporate Client',
    role: c.role || 'Guest',
    units_balance: c.units_balance,
    balance_usd: c.balance_usd,
    totalStays: 2,
    verifiedId: true,
    corporateVerified: !!c.company,
    createdAt: c.created_at,
  }));

  const handleUnifiedPropertyUpdate = async (updated: AdminProperty) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/properties/${updated.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Could not update property');
      setSuccessMsg(`Updated ${updated.title}`);
      await refreshCatalog();
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Property update failed');
    }
  };

  const handleUnifiedAddProperty = async (newProp: AdminProperty) => {
    setProperties((prev) => [...prev, newProp as AdminPropertyRecord]);
    setSuccessMsg(`Added ${newProp.title} to portfolio`);
  };

  const handleUnifiedReservationStatus = async (id: string, newStatus: AdminReservation['status']) => {
    if (id.startsWith('vb_')) {
      await handleVehicleBookingStatus(id, newStatus);
    } else {
      await handleHousingStatusChange(id, newStatus);
    }
  };

  const handleUnifiedVehicleUpdate = async (veh: AdminVehicle) => {
    await handleVehicleInventoryStatus(veh.id, veh.inventoryStatus as 'available' | 'rented' | 'maintenance');
  };

  const handleUnifiedAddVehicle = async (veh: AdminVehicle) => {
    setVehicles((prev) => [...prev, veh as AdminVehicleInventory]);
    setSuccessMsg(`Added ${veh.name} to nationwide 3D fleet`);
  };

  const handleUnifiedVerifyPayment = async (id: string, action: 'verify' | 'reject', notes: string) => {
    wireNotesMap[id] = notes;
    await handleVerifyWire(id, action === 'verify' ? 'verified' : 'rejected');
  };

  const handleUnifiedAllocateUnits = async (guestId: string, unitsDelta: number, reason: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/customers/${guestId}/allocate-units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ unitsDelta, reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unit allocation failed');
      setSuccessMsg(data.message);
      fetchAdminDashboard(adminToken);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unit allocation failed');
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-[820px] pb-16 text-left">
      {/* Live Realistic Photography Control Center Header */}
      <LivePhotoBackground
        scene="twilight"
        secondaryScene="courtyard"
        overlay="espresso"
        className="border-b border-slate-200"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-9 sm:py-11">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[#7ef0e5] type-support font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Administrative Operations, Storefront &amp; Treasury</span>
              </div>
              <h1 className="type-h2 text-white">
                Easy Travel Lodging — Admin Control Center
              </h1>
              <p className="type-body text-slate-200 max-w-2xl">
                Manage storefront orders, residences, concierge services, promotions, 3D fleet inventory, wire verification, and client accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateTab('portal')}
                className="btn btn-sm bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Client Portal</span>
              </button>

              {adminToken && (
                <>
                  <button
                    type="button"
                    onClick={() => fetchAdminDashboard(adminToken)}
                    className="btn btn-sm bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 text-white"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-sm bg-[#14616d] hover:bg-[#0f4952] border border-white/20 text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out{adminProfile ? ` (${adminProfile.name.split(' ')[0]})` : ''}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </LivePhotoBackground>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-7 space-y-7">
        {/* Feedback */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 type-support flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="type-btn text-rose-700 hover:text-rose-950 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 type-support flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="type-btn text-emerald-700 hover:text-emerald-950 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================
            ADMIN LOGIN VIEW
           ======================================================== */}
        {!adminToken || !overview ? (
          <LivePhotoBackground
            scene="twilight"
            secondaryScene="interior"
            overlay="espresso"
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
              <div className="lg:col-span-6 text-white space-y-4">
                <span className="type-support font-semibold text-[#7ef0e5] block">
                  Role-Protected JWT Gateway
                </span>
                <h2 className="type-h2 text-white">
                  Executive Host, Concierge &amp; Treasury Administration
                </h2>
                <p className="type-body text-slate-200">
                  Verify incoming bank wires, update residence rates and seasonal packages, review 3D fleet reservations, and audit prepaid Lodging Unit balances from a unified operations workspace.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 type-support">
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-0.5">
                    <span className="font-semibold text-white block">Immutable Ledger</span>
                    <span className="text-slate-200/90 block">Full actor &amp; timestamp audit trail</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-0.5">
                    <span className="font-semibold text-white block">Live Storefront Sync</span>
                    <span className="text-slate-200/90 block">Instant rate, catalog &amp; promo updates</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="admin-panel p-6 sm:p-8 space-y-6 text-slate-900">
                  <div className="space-y-1.5">
                    <span className="type-support font-semibold text-[#14616d] block">
                      Authorized Personnel Only
                    </span>
                    <h3 className="type-h3 text-slate-900">
                      Executive &amp; Concierge Staff Sign In
                    </h3>
                    <p className="type-support text-slate-600">
                      Authorized hosts and treasury staff only. Every action is recorded in the immutable audit log.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 type-support">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[#14616d] font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 shrink-0" /> Pre-Seeded Admin Credentials
                      </span>
                      <span className="font-mono text-slate-500">RBAC: admin / staff</span>
                    </div>
                    <div className="font-mono text-slate-600 space-y-1">
                      <div><strong className="text-slate-900">Admin:</strong> easytravelagency@trustagent.space / admin12345</div>
                      <div><strong className="text-slate-900">Staff:</strong> easytravelagency@trustagent.space / staff12345</div>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('easytravelagency@trustagent.space');
                          setLoginPassword('admin12345');
                        }}
                        className="btn btn-sm btn-secondary flex-1"
                      >
                        Load Host Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('easytravelagency@trustagent.space');
                          setLoginPassword('staff12345');
                        }}
                        className="btn btn-sm btn-outline flex-1"
                      >
                        Load Concierge Staff
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="form-label">Staff Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Enter Control Center</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </LivePhotoBackground>
        ) : (
          /* ========================================================
             AUTHENTICATED CONTROL CENTER
             ======================================================== */
          <div className="space-y-7">
            {/* 6 KPI Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-slate-500 block">
                  Settled Revenue
                </span>
                <div className="type-h3 font-bold text-[#14616d] tabular-nums">
                  ${overview.totalRevenue.toLocaleString()}
                </div>
                <span className="type-support text-slate-500 block">Verified ledger total</span>
              </div>

              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-[#14616d] block">
                  Storefront Orders
                </span>
                <div className="type-h3 font-bold text-slate-900 tabular-nums">
                  {overview.totalOrders ?? orders.length}
                </div>
                <span className="type-support text-[#14616d] font-medium tabular-nums block">
                  {overview.paidOrdersCount ?? 0} paid · {overview.pendingOrdersCount ?? 0} pending
                </span>
              </div>

              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-amber-700 block">
                  Pending Wire Queue
                </span>
                <div className="type-h3 font-bold text-slate-900 tabular-nums">
                  ${overview.pendingWireAmount.toLocaleString()}
                </div>
                <span className="type-support text-amber-700 font-medium tabular-nums block">
                  {overview.pendingWireCount} transfer(s) awaiting review
                </span>
              </div>

              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-slate-500 block">
                  Residence Stays
                </span>
                <div className="type-h3 font-bold text-slate-900 tabular-nums">
                  {overview.activeBookings} / {overview.totalBookings}
                </div>
                <span className="type-support text-slate-500 tabular-nums block">
                  {overview.confirmedBookings} confirmed · {overview.pendingBookings} pending
                </span>
              </div>

              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-slate-500 block">
                  3D Fleet Rentals
                </span>
                <div className="type-h3 font-bold text-slate-900 tabular-nums">
                  {overview.activeVehicleBookings} / {overview.totalVehicleBookings}
                </div>
                <span className="type-support text-slate-500 tabular-nums block">{vehicles.length} vehicles in fleet</span>
              </div>

              <div className="admin-panel p-5 space-y-1">
                <span className="type-support font-semibold text-slate-500 block">
                  Catalog &amp; Promos
                </span>
                <div className="type-h3 font-bold text-[#14616d] tabular-nums">
                  {overview.activeCatalogCount ?? catalogItems.length} Items
                </div>
                <span className="type-support text-slate-500 tabular-nums block">
                  {overview.activePromoCount ?? promoCodes.length} active promo(s)
                </span>
              </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3.5">
              {[
                { id: 'properties', label: 'Properties', icon: Building2, badge: properties.length },
                { id: 'reservations', label: 'Reservations', icon: FileSpreadsheet, badge: overview.pendingBookings },
                { id: 'car-rentals', label: 'Car Rentals', icon: Car, badge: vehicles.length },
                { id: 'payments', label: 'Payments', icon: Landmark, badge: overview.pendingWireCount },
                { id: 'guests', label: 'Guests', icon: Users, badge: customers.length },
                { id: 'hosts', label: 'Hosts', icon: Users },
                { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
                { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
                { id: 'settings', label: 'Settings', icon: Wrench },
                { id: 'overview', label: 'Inquiries & Leads', icon: Inbox, badge: overview.newInquiriesCount },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as AdminTab)}
                    className={`type-nav px-3.5 py-2 min-h-[40px] rounded-lg flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#14616d] text-white border-[#14616d] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{t.label}</span>
                    {typeof t.badge === 'number' && t.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md type-support font-mono font-semibold tabular-nums ${
                          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 1. PROPERTIES */}
            {activeTab === 'properties' && (
              <AdminProperties
                properties={unifiedProperties}
                onUpdateProperty={handleUnifiedPropertyUpdate}
                onAddProperty={handleUnifiedAddProperty}
              />
            )}

            {/* 2. RESERVATIONS */}
            {activeTab === 'reservations' && (
              <AdminReservations
                reservations={unifiedReservations}
                onUpdateStatus={handleUnifiedReservationStatus}
              />
            )}

            {/* 3. CAR RENTALS */}
            {activeTab === 'car-rentals' && (
              <AdminCarRentals
                vehicles={unifiedVehicles}
                bookings={unifiedReservations}
                onUpdateVehicle={handleUnifiedVehicleUpdate}
                onAddVehicle={handleUnifiedAddVehicle}
                onUpdateBookingStatus={handleUnifiedReservationStatus}
              />
            )}

            {/* 4. PAYMENTS */}
            {activeTab === 'payments' && (
              <AdminPayments
                manualPayments={manualPayments}
                orders={orders}
                onVerifyPayment={handleUnifiedVerifyPayment}
              />
            )}

            {/* 5. GUESTS */}
            {activeTab === 'guests' && (
              <AdminGuests
                guests={unifiedGuests}
                onAllocateUnits={handleUnifiedAllocateUnits}
              />
            )}

            {/* 6. HOSTS */}
            {activeTab === 'hosts' && <AdminHosts />}

            {/* 7. HOUSEKEEPING */}
            {activeTab === 'housekeeping' && <AdminHousekeeping />}

            {/* 8. REPORTS */}
            {activeTab === 'reports' && (
              <AdminReports
                totalRevenue={overview.totalRevenue}
                totalBookings={overview.totalBookings}
                totalVehicleBookings={overview.totalVehicleBookings}
                onExportCsv={exportCsv}
              />
            )}

            {/* 9. SETTINGS */}
            {activeTab === 'settings' && <AdminSettings auditLogs={auditLogs} />}

            {/* TAB 1: OVERVIEW — INQUIRIES & AUDIT TRAIL */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <div className="lg:col-span-7 admin-panel p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                    <div className="space-y-1">
                      <h3 className="type-h3 text-slate-900">
                        Inbound Guest Inquiries, Brochure &amp; Live Chat Leads
                      </h3>
                      <p className="type-support text-slate-600">
                        Captured in real time from Contact Us, Brochure Downloads, Host Design Guide, and Live Housing Chat.
                      </p>
                    </div>
                  </div>

                  {inquiries.length === 0 ? (
                    <p className="type-body text-slate-500 py-8 text-center">No inquiries logged yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 type-support">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-semibold text-[#14616d]">{inq.referenceCode}</span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="font-medium text-slate-600 capitalize">
                                {inq.type.replace(/_/g, ' ')}
                              </span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="font-semibold text-slate-900">{inq.name}</span>
                            </div>
                            <span
                              className={`font-semibold capitalize ${
                                inq.status === 'new'
                                  ? 'text-[#14616d]'
                                  : 'text-slate-500'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>

                          <div className="text-slate-600">
                            {inq.email} {inq.phone ? `· ${inq.phone}` : ''} {inq.company ? `· ${inq.company}` : ''}
                            {inq.propertyId ? ` · Unit: ${inq.propertyId}` : ''}
                          </div>

                          {inq.message && (
                            <p className="type-body text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                              {inq.message}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="type-support text-slate-500 tabular-nums">
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              {inq.status === 'new' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'reviewed')}
                                  className="btn btn-sm btn-primary"
                                >
                                  Mark Reviewed
                                </button>
                              )}
                              {inq.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                                  className="btn btn-sm btn-outline"
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Audit Logs */}
                <div className="lg:col-span-5 admin-panel p-6 space-y-4">
                  <div className="border-b border-slate-200 pb-3.5 space-y-1">
                    <h3 className="type-h3 text-slate-900">Immutable Audit Log</h3>
                    <p className="type-support text-slate-600">Every settlement, verification, and status update.</p>
                  </div>
                  <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                    {auditLogs.slice(0, 25).map((log) => (
                      <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 type-support">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-semibold text-[#14616d]">{log.action}</span>
                          <span className="text-slate-500 tabular-nums">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="type-support text-slate-800">{log.details}</p>
                        <div className="text-slate-500 font-mono">
                          Actor: {log.actorEmail} · Target: {log.targetId}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: STOREFRONT ORDERS & SALES ANALYTICS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Sales Analytics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="admin-panel p-5 space-y-1">
                    <span className="type-support font-semibold text-slate-500 block">
                      Total Cart Orders
                    </span>
                    <div className="type-h3 font-bold text-slate-900 tabular-nums">
                      {overview.totalOrders ?? orders.length}
                    </div>
                    <span className="type-support text-slate-500 block">All online checkout submissions</span>
                  </div>
                  <div className="admin-panel p-5 space-y-1">
                    <span className="type-support font-semibold text-slate-500 block">
                      Verified Order Revenue
                    </span>
                    <div className="type-h3 font-bold text-[#14616d] tabular-nums">
                      ${(overview.orderRevenueUsd ?? 0).toLocaleString()}
                    </div>
                    <span className="type-support text-slate-500 tabular-nums block">
                      {overview.paidOrdersCount ?? 0} verified paid order(s)
                    </span>
                  </div>
                  <div className="admin-panel p-5 space-y-1">
                    <span className="type-support font-semibold text-amber-700 block">
                      Awaiting Verification
                    </span>
                    <div className="type-h3 font-bold text-slate-900 tabular-nums">
                      {overview.pendingOrdersCount ?? 0}
                    </div>
                    <span className="type-support text-slate-500 block">Pending wire, ACH, or Zelle review</span>
                  </div>
                  <div className="admin-panel p-5 space-y-1">
                    <span className="type-support font-semibold text-slate-500 block">
                      Average Paid Order
                    </span>
                    <div className="type-h3 font-bold text-[#14616d] tabular-nums">
                      ${(overview.averageOrderValueUsd ?? 0).toLocaleString()}
                    </div>
                    <span className="type-support text-slate-500 block">Per verified transaction</span>
                  </div>
                </div>

                {/* Orders Table / List */}
                <div className="admin-panel p-6 space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="space-y-1">
                      <h3 className="type-h3 text-slate-900">
                        Storefront Orders &amp; Payment Verification
                      </h3>
                      <p className="type-support text-slate-600">
                        Verify incoming transfers to mark orders Paid—automatically confirming linked suite/vehicle bookings and crediting Unit Packages.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search ORD-ETL, guest, email..."
                          className="form-input pl-10 sm:w-64"
                        />
                      </div>

                      <select
                        value={orderPaymentFilter}
                        onChange={(e) =>
                          setOrderPaymentFilter(
                            e.target.value as
                              | 'all'
                              | 'paid'
                              | 'pending_verification'
                              | 'pending_payment'
                              | 'failed'
                              | 'cancelled',
                          )
                        }
                        className="form-select sm:w-52"
                      >
                        <option value="all">All Payment States</option>
                        <option value="paid">Paid &amp; Verified</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          exportCsv(
                            'etl_storefront_orders.csv',
                            ['OrderRef', 'Customer', 'Email', 'Phone', 'ItemsCount', 'TotalUSD', 'PaymentMethod', 'PaymentStatus', 'OrderStatus', 'Date'],
                            orders.map((o) => [
                              o.orderReference,
                              o.customerName,
                              o.customerEmail,
                              o.customerPhone,
                              o.items.length,
                              o.totalUsd,
                              o.paymentMethod,
                              o.paymentStatus,
                              o.orderStatus,
                              o.createdAt,
                            ]),
                          )
                        }
                        className="btn btn-sm btn-outline"
                      >
                        <Download className="w-4 h-4 text-[#14616d]" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <p className="type-body text-slate-500 py-8 text-center">No storefront orders match your current filter.</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => {
                        const isPaid = ord.paymentStatus === 'paid';
                        const noteValue =
                          orderNotesMap[ord.id] !== undefined ? orderNotesMap[ord.id] : ord.adminNotes || '';
                        return (
                          <div key={ord.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 type-support">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono font-semibold text-[#14616d]">
                                    {ord.orderReference}
                                  </span>
                                  <span aria-hidden="true" className="text-slate-300">·</span>
                                  <span className="font-semibold text-slate-900">{ord.customerName}</span>
                                  <span className="text-slate-600">({ord.customerEmail})</span>
                                  {ord.customerPhone && (
                                    <span className="text-slate-500">· {ord.customerPhone}</span>
                                  )}
                                </div>
                                <div className="text-slate-600">
                                  Billing: {ord.billingAddress.line1}, {ord.billingAddress.city}, {ord.billingAddress.state}{' '}
                                  {ord.billingAddress.postalCode} · Placed {new Date(ord.createdAt).toLocaleString()}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                                <span className="type-h4 font-bold text-slate-900">
                                  ${ord.totalUsd.toLocaleString()} USD
                                </span>
                                <span
                                  className={`font-semibold capitalize ${
                                    isPaid
                                      ? 'text-emerald-700'
                                      : ord.paymentStatus === 'failed' || ord.paymentStatus === 'cancelled'
                                      ? 'text-rose-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  {isPaid ? 'Payment Verified' : ord.paymentStatus.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>

                            {/* Order Line Items */}
                            <div className="space-y-1.5">
                              {ord.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-2 text-slate-600">
                                  <span>
                                    <strong className="text-slate-900">{item.title}</strong> ({item.category}) —{' '}
                                    <span className="tabular-nums">
                                      {item.quantity} {item.quantityLabel} × ${item.unitPriceUsd.toLocaleString()}
                                    </span>
                                  </span>
                                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                                    ${item.lineSubtotalUsd.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600 bg-white p-3.5 rounded-lg border border-slate-200 tabular-nums">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span>Method: <strong className="text-slate-900 capitalize">{ord.paymentMethod.replace(/_/g, ' ')}</strong></span>
                                {ord.paymentReference && (
                                  <span>Ref: <strong className="font-mono text-slate-800">{ord.paymentReference}</strong></span>
                                )}
                                <span>Subtotal: ${ord.subtotalUsd.toLocaleString()}</span>
                                <span>Fee: ${ord.serviceFeeUsd.toLocaleString()}</span>
                                <span>Tax: ${ord.taxUsd.toLocaleString()}</span>
                                {ord.discountUsd > 0 && (
                                  <span className="text-[#14616d] font-semibold">
                                    Promo{ord.promoCode ? ` (${ord.promoCode})` : ''}: -${ord.discountUsd.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {ord.verifiedBy && (
                                <span className="text-emerald-700 font-semibold">
                                  Verified by {ord.verifiedBy}
                                </span>
                              )}
                            </div>

                            {ord.guestNotes && (
                              <div className="text-slate-800">
                                <span className="text-slate-500 font-semibold">Guest Notes:</span> {ord.guestNotes}
                              </div>
                            )}

                            {/* Admin Controls */}
                            <div className="pt-3 border-t border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={noteValue}
                                  onChange={(e) =>
                                    setOrderNotesMap((prev) => ({ ...prev, [ord.id]: e.target.value }))
                                  }
                                  placeholder="Internal reconciliation or fulfillment note..."
                                  className="form-input flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrder(ord.id, { adminNotes: noteValue })}
                                  className="btn btn-sm btn-outline"
                                >
                                  Save Note
                                </button>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={ord.orderStatus}
                                  onChange={(e) =>
                                    handleUpdateOrder(ord.id, {
                                      orderStatus: e.target.value as AdminOrderRecord['orderStatus'],
                                    })
                                  }
                                  className="form-select sm:w-48"
                                >
                                  <option value="pending">Order: Pending</option>
                                  <option value="confirmed">Order: Confirmed</option>
                                  <option value="processing">Order: Processing</option>
                                  <option value="completed">Order: Completed</option>
                                  <option value="cancelled">Order: Cancelled</option>
                                </select>

                                {!isPaid && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOrder(ord.id, {
                                        paymentStatus: 'paid',
                                        orderStatus: 'confirmed',
                                        adminNotes: noteValue || 'Verified & settled by Treasury.',
                                      })
                                    }
                                    className="btn btn-sm btn-primary"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Verify &amp; Mark Paid</span>
                                  </button>
                                )}

                                {ord.paymentStatus !== 'failed' && !isPaid && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOrder(ord.id, {
                                        paymentStatus: 'failed',
                                        adminNotes: noteValue || 'Payment transfer could not be verified.',
                                      })
                                    }
                                    className="btn btn-sm btn-danger"
                                  >
                                    Mark Failed
                                  </button>
                                )}

                                {ord.orderStatus !== 'cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOrder(ord.id, {
                                        paymentStatus: isPaid ? 'refunded' : 'cancelled',
                                        orderStatus: 'cancelled',
                                      })
                                    }
                                    className="btn btn-sm btn-outline"
                                  >
                                    {isPaid ? 'Refund & Cancel' : 'Cancel'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CATALOG, RESIDENCES & PROMOTIONS MANAGER */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                {/* Sub-section Selector */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'suites', label: `Residences & Suites (${properties.length})`, icon: Building2 },
                    { id: 'services', label: `Services & Unit Packages (${catalogItems.length})`, icon: Package },
                    { id: 'promos', label: `Promotions & Discounts (${promoCodes.length})`, icon: Tag },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = catalogSection === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setCatalogSection(sub.id as 'suites' | 'services' | 'promos')}
                        className={`type-nav px-4 py-2 min-h-[40px] rounded-lg flex items-center gap-2 cursor-pointer border transition-colors whitespace-nowrap shrink-0 ${
                          isSubActive
                            ? 'bg-[#14616d] text-white border-[#14616d] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        <SubIcon className="w-4 h-4 shrink-0" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 1. Residences & Suites Editor */}
                {catalogSection === 'suites' && (
                  <div className="admin-panel p-6 space-y-4">
                    <div className="border-b border-slate-200 pb-3.5 space-y-1">
                      <h3 className="type-h3 text-slate-900">
                        Furnished Residences &amp; Suites Listing Manager
                      </h3>
                      <p className="type-support text-slate-600">
                        Update residence titles, categories, monthly rates, minimum stay rules, primary photography, and real-time cart availability.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {properties.map((prop, idx) => (
                        <div
                          key={prop.id}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 type-support"
                        >
                          <img
                            src={prop.images?.[0] || getFallbackPropertyImage(idx)}
                            alt={prop.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackPropertyImage(idx);
                            }}
                            className="w-24 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="type-support text-[#14616d] font-semibold block truncate">
                                  {prop.category}
                                </span>
                                <h4 className="type-h4 text-slate-900 truncate">
                                  {prop.title}
                                </h4>
                              </div>
                              <select
                                value={prop.status}
                                onChange={(e) =>
                                  handleQuickPropertyStatus(
                                    prop.id,
                                    e.target.value as 'Available' | 'Inquired' | 'Reserved',
                                  )
                                }
                                className="form-select w-auto shrink-0 py-1.5 px-2.5 min-h-[38px]"
                              >
                                <option value="Available">Available</option>
                                <option value="Inquired">Inquired</option>
                                <option value="Reserved">Reserved</option>
                              </select>
                            </div>

                            <p className="type-support text-slate-600 line-clamp-2">{prop.shortDesc}</p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                                ${prop.monthlyRate.toLocaleString()}/mo · Min {prop.minimumStayDays}d · {prop.images?.length || 0} Photos
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProperty({ ...prop });
                                  setPropPrimaryImage(prop.images?.[0] || '');
                                }}
                                className="btn btn-sm btn-outline"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#14616d]" />
                                <span>Edit Listing</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Services & Unit Packages Manager */}
                {catalogSection === 'services' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 admin-panel p-6 space-y-4 h-fit">
                      <div className="border-b border-slate-200 pb-3.5 space-y-1">
                        <h3 className="type-h3 text-slate-900 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-[#14616d] shrink-0" />
                          <span>Add Storefront Service or Package</span>
                        </h3>
                        <p className="type-support text-slate-600">
                          New items appear immediately in the Services &amp; Packages storefront and cart.
                        </p>
                      </div>

                      <form onSubmit={handleCreateCatalogItem} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label">Item Type</label>
                            <select
                              value={newItemType}
                              onChange={(e) => setNewItemType(e.target.value as 'addon_service' | 'unit_package')}
                              className="form-select"
                            >
                              <option value="addon_service">Concierge / Add-On</option>
                              <option value="unit_package">Lodging Unit Package</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Category</label>
                            <input
                              type="text"
                              required
                              value={newItemCategory}
                              onChange={(e) => setNewItemCategory(e.target.value)}
                              placeholder="Arrival & Concierge"
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label">Listing Title *</label>
                          <input
                            type="text"
                            required
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            placeholder="e.g. Private SMF Chauffeur Greeting"
                            className="form-input"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label">Price (USD) *</label>
                            <input
                              type="number"
                              min={1}
                              required
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="form-input tabular-nums"
                            />
                          </div>
                          {newItemType === 'unit_package' ? (
                            <div>
                              <label className="form-label">Units Credited *</label>
                              <input
                                type="number"
                                min={1}
                                required
                                value={newItemUnitsIncluded}
                                onChange={(e) => setNewItemUnitsIncluded(e.target.value)}
                                className="form-input tabular-nums"
                              />
                            </div>
                          ) : (
                            <div>
                              <label className="form-label">Billing Label</label>
                              <input
                                type="text"
                                value={newItemBillingLabel}
                                onChange={(e) => setNewItemBillingLabel(e.target.value)}
                                placeholder="per service / per stay"
                                className="form-input"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Image URL (Optional)</label>
                          <input
                            type="url"
                            value={newItemImage}
                            onChange={(e) => setNewItemImage(e.target.value)}
                            placeholder="https://easytravellodging.com/..."
                            className="form-input"
                          />
                        </div>

                        <div>
                          <label className="form-label">Description *</label>
                          <textarea
                            rows={2}
                            required
                            value={newItemShortDesc}
                            onChange={(e) => setNewItemShortDesc(e.target.value)}
                            placeholder="Clear summary of what is included for the guest..."
                            className="form-textarea"
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-full"
                        >
                          Publish Storefront Listing
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-7 admin-panel p-6 space-y-4">
                      <div className="border-b border-slate-200 pb-3.5 space-y-1">
                        <h3 className="type-h3 text-slate-900">
                          Active Services &amp; Unit Packages ({catalogItems.length})
                        </h3>
                        <p className="type-support text-slate-600">
                          Toggle availability to pause cart additions or edit pricing and descriptions.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {catalogItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 type-support"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={item.image || getFallbackPropertyImage(idx)}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getFallbackPropertyImage(idx);
                                }}
                                className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 text-slate-500">
                                  <span className="font-mono font-semibold text-[#14616d]">{item.sku}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{item.category}</span>
                                </div>
                                <div className="type-h4 text-slate-900 truncate">{item.title}</div>
                                <div className="text-slate-600 tabular-nums">
                                  <strong className="text-slate-900">${item.priceUsd.toLocaleString()}</strong>{' '}
                                  {item.billingUnitLabel}
                                  {item.unitsIncluded ? ` · Credits ${item.unitsIncluded} Units` : ''}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleCatalogAvailability(item)}
                                className={`btn btn-sm ${
                                  item.available
                                    ? 'btn-primary'
                                    : 'btn-outline'
                                }`}
                              >
                                {item.available ? 'Available' : 'Paused'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatalogItem({ ...item })}
                                className="btn btn-sm btn-outline px-2.5"
                                title="Edit listing"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCatalogItem(item)}
                                className="btn btn-sm btn-outline px-2.5 text-rose-700 hover:text-rose-800"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Promotions & Discount Codes Manager */}
                {catalogSection === 'promos' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 admin-panel p-6 space-y-4 h-fit">
                      <div className="border-b border-slate-200 pb-3.5 space-y-1">
                        <h3 className="type-h3 text-slate-900 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-[#14616d] shrink-0" />
                          <span>Create Promotional Code</span>
                        </h3>
                        <p className="type-support text-slate-600">
                          Discounts are validated server-side against cart subtotals before checkout.
                        </p>
                      </div>

                      <form onSubmit={handleCreatePromo} className="space-y-4">
                        <div>
                          <label className="form-label">Promo Code *</label>
                          <input
                            type="text"
                            required
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                            placeholder="e.g. SPRING15"
                            className="form-input font-mono uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label">Discount Type</label>
                            <select
                              value={newPromoType}
                              onChange={(e) => setNewPromoType(e.target.value as 'percentage' | 'fixed')}
                              className="form-select"
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed USD ($)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">
                              {newPromoType === 'percentage' ? 'Percent Off *' : 'USD Off *'}
                            </label>
                            <input
                              type="number"
                              min={1}
                              required
                              value={newPromoValue}
                              onChange={(e) => setNewPromoValue(e.target.value)}
                              className="form-input tabular-nums"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label">Minimum Cart Subtotal (USD)</label>
                          <input
                            type="number"
                            min={0}
                            value={newPromoMinSubtotal}
                            onChange={(e) => setNewPromoMinSubtotal(e.target.value)}
                            className="form-input tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="form-label">Public Description *</label>
                          <input
                            type="text"
                            required
                            value={newPromoDesc}
                            onChange={(e) => setNewPromoDesc(e.target.value)}
                            placeholder="e.g. 15% off spring stays & concierge bundles"
                            className="form-input"
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-full"
                        >
                          Save Promo Code
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-7 admin-panel p-6 space-y-4">
                      <div className="border-b border-slate-200 pb-3.5">
                        <h3 className="type-h3 text-slate-900">
                          Configured Promotions ({promoCodes.length})
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {promoCodes.map((promo) => (
                          <div
                            key={promo.id}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 type-support"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-[#14616d]">{promo.code}</span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className="font-semibold text-slate-900 tabular-nums">
                                  {promo.discountType === 'percentage'
                                    ? `${promo.discountValue}% off`
                                    : `$${promo.discountValue.toLocaleString()} off`}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className="text-slate-600 tabular-nums">
                                  Min ${promo.minSubtotalUsd.toLocaleString()}
                                </span>
                              </div>
                              <p className="type-support text-slate-600">{promo.description}</p>
                              <div className="text-slate-500 tabular-nums">
                                Redeemed {promo.usageCount} time(s)
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleTogglePromo(promo)}
                                className={`btn btn-sm ${
                                  promo.active
                                    ? 'btn-primary'
                                    : 'btn-outline'
                                }`}
                              >
                                {promo.active ? 'Active' : 'Paused'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePromo(promo)}
                                className="btn btn-sm btn-outline px-2.5 text-rose-700 hover:text-rose-800"
                                title="Delete promo code"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WIRE & ACH VERIFICATION QUEUE */}
            {activeTab === 'wires' && (
              <div className="admin-panel p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <h3 className="type-h3 text-slate-900">
                      Manual Wire, ACH &amp; Zelle Verification Queue
                    </h3>
                    <p className="type-support text-slate-600">
                      Approving a transfer automatically posts a succeeded ledger entry and credits client units or confirms the target booking.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'pending_verification', 'verified', 'rejected'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setWireFilter(st)}
                        className={`type-nav px-3.5 py-2 min-h-[40px] rounded-lg capitalize transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                          wireFilter === st
                            ? 'bg-[#14616d] text-white border-[#14616d]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredWires.length === 0 ? (
                  <p className="type-body text-slate-500 py-8 text-center">No transfer records match this filter.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredWires.map((mp) => (
                      <div key={mp.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 type-support">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-semibold text-slate-900">{mp.referenceCode}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-slate-600 font-medium capitalize">
                              {mp.paymentMethod}
                            </span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="font-mono font-semibold text-[#14616d]">Trace: {mp.wireReference}</span>
                          </div>
                          <div className="flex items-center gap-3 tabular-nums">
                            <span className="type-h4 font-bold text-slate-900">
                              ${mp.amountUsd.toLocaleString()} USD ({mp.unitsRequested}u)
                            </span>
                            <span
                              className={`font-semibold capitalize ${
                                mp.status === 'verified'
                                  ? 'text-emerald-700'
                                  : mp.status === 'rejected'
                                  ? 'text-rose-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {mp.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-800">
                          <div>
                            <span className="text-slate-500 font-semibold block">Client</span>
                            <span>{mp.customerName} ({mp.customerEmail})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold block">Originating Bank</span>
                            <span>{mp.senderName} · {mp.originatingBank} ({mp.transferDate})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold block">Target Allocation</span>
                            <span>{mp.targetType} {mp.targetId ? `(${mp.targetId})` : `(+${mp.unitsRequested} Units)`}</span>
                          </div>
                        </div>

                        {mp.receiptDataUrl && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                setReceiptPreview({
                                  title: `${mp.referenceCode} — ${mp.receiptFileName || 'Wire Receipt'}`,
                                  dataUrl: mp.receiptDataUrl!,
                                })
                              }
                              className="btn btn-sm btn-outline text-[#14616d]"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Inspect Uploaded Receipt ({mp.receiptFileName || 'Attachment'})</span>
                            </button>
                          </div>
                        )}

                        {mp.status === 'pending_verification' ? (
                          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <input
                              type="text"
                              placeholder="Optional treasury reconciliation note (e.g. Matched Chase Fedwire #)..."
                              value={wireNotesMap[mp.id] || ''}
                              onChange={(e) => setWireNotesMap((prev) => ({ ...prev, [mp.id]: e.target.value }))}
                              className="form-input flex-1"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleVerifyWire(mp.id, 'verified')}
                                className="btn btn-sm btn-primary"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Approve &amp; Credit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleVerifyWire(mp.id, 'rejected')}
                                className="btn btn-sm btn-danger"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="type-support text-slate-600 pt-2 border-t border-slate-200">
                            Reviewed by {mp.verifiedBy || 'Treasury'} · {mp.adminNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: HOUSING BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="admin-panel p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3.5 space-y-1">
                  <h3 className="type-h3 text-slate-900">
                    Nationwide Furnished Residence Reservations
                  </h3>
                  <p className="type-support text-slate-600">
                    Manage short-stay and 30+ day extended reservation statuses or record manual payment clearance.
                  </p>
                </div>

                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 type-support"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-semibold text-[#14616d]">{b.id}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-semibold text-slate-900 uppercase">{b.propertyId}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-semibold text-slate-900">{b.guestName}</span>
                          <span className="text-slate-600">({b.guestEmail})</span>
                        </div>
                        <div className="text-slate-600 tabular-nums">
                          {b.checkIn} → {b.checkOut} ({b.totalNights} nights) · {b.employer || 'Individual Stay'}
                        </div>
                        {b.notes && <div className="text-slate-500">{b.notes}</div>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <select
                          value={b.status}
                          onChange={(e) => handleHousingStatusChange(b.id, e.target.value)}
                          className="form-select sm:w-48"
                        >
                          <option value="awaiting_payment">Awaiting Payment</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {b.status !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleConfirmHousingPayment(b)}
                            className="btn btn-sm btn-primary"
                          >
                            Confirm Payment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FLEET & MAINTENANCE */}
            {activeTab === 'fleet' && (
              <div className="space-y-7">
                {/* Vehicle Bookings */}
                <div className="admin-panel p-6 space-y-4">
                  <h3 className="type-h3 text-slate-900 border-b border-slate-200 pb-3.5">
                    Client Fleet Reservations ({vehicleBookings.length})
                  </h3>
                  <div className="space-y-3">
                    {vehicleBookings.map((vb) => (
                      <div
                        key={vb.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 type-support"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-semibold text-[#14616d]">{vb.id}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="font-semibold text-slate-900">{vb.vehicleName}</span>
                            <span className="text-slate-600">({vb.exteriorColorName})</span>
                          </div>
                          <div className="text-slate-600 tabular-nums">
                            {vb.customerName} ({vb.customerEmail}) · {vb.pickupDate} → {vb.returnDate} ({vb.totalDays}d) ·{' '}
                            <strong className="text-slate-900">${vb.totalUsd.toLocaleString()}</strong>
                          </div>
                          <div className="text-slate-500">Hub: {vb.pickupLocation}</div>
                        </div>

                        <select
                          value={vb.status}
                          onChange={(e) => handleVehicleBookingStatus(vb.id, e.target.value)}
                          className="form-select sm:w-48 self-start lg:self-center"
                        >
                          <option value="awaiting_payment">Awaiting Payment</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="active">Active On-Road</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fleet Inventory & Maintenance */}
                <div className="admin-panel p-6 space-y-4">
                  <h3 className="type-h3 text-slate-900 border-b border-slate-200 pb-3.5">
                    American Fleet Inventory &amp; Service Logs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((v) => (
                      <div key={v.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 type-support">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <h4 className="type-h4 text-slate-900">{v.name}</h4>
                            <span className="text-slate-600 font-mono tabular-nums block">
                              Plate: {v.licensePlate} · {v.mileage.toLocaleString()} mi · ${v.dailyRate}/day (${v.monthlyRate}/mo)
                            </span>
                          </div>
                          <select
                            value={v.inventoryStatus}
                            onChange={(e) =>
                              handleVehicleInventoryStatus(
                                v.id,
                                e.target.value as 'available' | 'rented' | 'maintenance',
                              )
                            }
                            className="form-select w-auto shrink-0 py-1.5 px-2.5 min-h-[38px]"
                          >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                          <span className="text-slate-500 tabular-nums">
                            {v.maintenanceLogs?.length || 0} service record(s)
                          </span>
                          <button
                            type="button"
                            onClick={() => setMaintVehicle(v)}
                            className="btn btn-sm btn-outline"
                          >
                            <Wrench className="w-4 h-4 text-[#14616d]" />
                            <span>Log Service</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CORPORATE CLIENTS & UNIT ALLOCATION */}
            {activeTab === 'clients' && (
              <div className="admin-panel p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3.5 space-y-1">
                  <h3 className="type-h3 text-slate-900">
                    Registered Guests, Households &amp; Client Accounts
                  </h3>
                  <p className="type-support text-slate-600">
                    Issue prepaid Lodging Unit allotments or adjust client balances with full audit logging.
                  </p>
                </div>

                <div className="space-y-3">
                  {customers.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 type-support"
                    >
                      <div className="space-y-0.5">
                        <div className="type-h4 text-slate-900">
                          {c.name} <span className="type-support font-normal text-slate-500">({c.email})</span>
                        </div>
                        <div className="text-slate-600">
                          {c.company} · {c.role} · {c.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 tabular-nums">
                        <div className="text-right">
                          <span className="type-h4 font-bold text-[#14616d] block">{c.units_balance} Units</span>
                          <span className="type-support text-slate-500">${c.balance_usd?.toLocaleString()} USD</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAllocModalCustomer(c);
                            setAllocDelta('25');
                          }}
                          className="btn btn-sm btn-primary"
                        >
                          <Coins className="w-4 h-4" />
                          <span>Adjust Units</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: BANK ACCOUNTS & CSV EXPORTS */}
            {activeTab === 'settings' && paymentAccounts && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <div className="lg:col-span-7 admin-panel p-6 space-y-5">
                  <h3 className="type-h3 text-slate-900 border-b border-slate-200 pb-3.5">
                    Official Receiving Bank &amp; Zelle Configuration
                  </h3>
                  <form onSubmit={handleSaveBankSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Bank Name</label>
                        <input
                          type="text"
                          value={paymentAccounts.bankName}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, bankName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Beneficiary Account Name</label>
                        <input
                          type="text"
                          value={paymentAccounts.accountName}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, accountName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Account Number</label>
                        <input
                          type="text"
                          value={paymentAccounts.accountNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, accountNumber: e.target.value })}
                          className="form-input font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="form-label">ACH Routing</label>
                        <input
                          type="text"
                          value={paymentAccounts.achRoutingNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, achRoutingNumber: e.target.value })}
                          className="form-input font-mono tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="form-label">Wire Routing ABA</label>
                        <input
                          type="text"
                          value={paymentAccounts.wireRoutingNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, wireRoutingNumber: e.target.value })}
                          className="form-input font-mono tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">SWIFT Code</label>
                        <input
                          type="text"
                          value={paymentAccounts.swiftCode}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, swiftCode: e.target.value })}
                          className="form-input font-mono"
                        />
                      </div>
                      <div>
                        <label className="form-label">Corporate Zelle Email</label>
                        <input
                          type="text"
                          value={paymentAccounts.zelleEmail}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, zelleEmail: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Client Remittance Instructions</label>
                      <textarea
                        rows={3}
                        value={paymentAccounts.paymentInstructions}
                        onChange={(e) => setPaymentAccounts({ ...paymentAccounts, paymentInstructions: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Save Receiving Bank Settings
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 admin-panel p-6 space-y-4 h-fit">
                  <h3 className="type-h3 text-slate-900 border-b border-slate-200 pb-3.5">
                    Reconciliation &amp; Accounting Exports (CSV)
                  </h3>
                  <p className="type-support text-slate-600">
                    Download instant CSV snapshots for CPA bookkeeping, corporate housing tax reporting, and wire reconciliation.
                  </p>

                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        exportCsv(
                          'etl_housing_bookings.csv',
                          ['ID', 'Unit', 'Guest', 'Email', 'CheckIn', 'CheckOut', 'Nights', 'Status'],
                          bookings.map((b) => [
                            b.id,
                            b.propertyId,
                            b.guestName,
                            b.guestEmail,
                            b.checkIn,
                            b.checkOut,
                            b.totalNights,
                            b.status,
                          ]),
                        )
                      }
                      className="btn btn-outline w-full justify-between"
                    >
                      <span>Export Housing Bookings Ledger (.CSV)</span>
                      <Download className="w-4 h-4 text-[#14616d] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportCsv(
                          'etl_manual_wire_transfers.csv',
                          ['Ref', 'Client', 'Method', 'WireTrace', 'AmountUSD', 'Units', 'Status', 'Date'],
                          manualPayments.map((m) => [
                            m.referenceCode,
                            m.customerEmail,
                            m.paymentMethod,
                            m.wireReference,
                            m.amountUsd,
                            m.unitsRequested,
                            m.status,
                            m.transferDate,
                          ]),
                        )
                      }
                      className="btn btn-outline w-full justify-between"
                    >
                      <span>Export Wire &amp; ACH Verification Log (.CSV)</span>
                      <Download className="w-4 h-4 text-[#14616d] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportCsv(
                          'etl_corporate_clients.csv',
                          ['ID', 'Name', 'Email', 'Company', 'UnitsBalance', 'BalanceUSD'],
                          customers.map((c) => [
                            c.id,
                            c.name,
                            c.email,
                            c.company,
                            c.units_balance,
                            c.balance_usd,
                          ]),
                        )
                      }
                      className="btn btn-outline w-full justify-between"
                    >
                      <span>Export Registered Client Unit Balances (.CSV)</span>
                      <Download className="w-4 h-4 text-[#14616d] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportCsv(
                          'etl_storefront_orders.csv',
                          ['OrderRef', 'Customer', 'Email', 'TotalUSD', 'PaymentMethod', 'PaymentStatus', 'OrderStatus', 'Date'],
                          orders.map((o) => [
                            o.orderReference,
                            o.customerName,
                            o.customerEmail,
                            o.totalUsd,
                            o.paymentMethod,
                            o.paymentStatus,
                            o.orderStatus,
                            o.createdAt,
                          ]),
                        )
                      }
                      className="btn btn-outline w-full justify-between"
                    >
                      <span>Export Storefront Orders &amp; Sales (.CSV)</span>
                      <Download className="w-4 h-4 text-[#14616d] shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Edit Residence / Suite Listing */}
        {editingProperty && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
              <LivePhotoBackground scene="interior" overlay="espresso" className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-h3 text-white">
                    Edit Residence — Unit {editingProperty.unitNumber}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleSaveProperty} className="p-6 space-y-4">
                <div>
                  <label className="form-label">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      required
                      value={editingProperty.category}
                      onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Availability</label>
                    <select
                      value={editingProperty.status}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          status: e.target.value as 'Available' | 'Inquired' | 'Reserved',
                        })
                      }
                      className="form-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Inquired">Inquired</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Monthly Rate (USD)</label>
                    <input
                      type="number"
                      min={500}
                      required
                      value={editingProperty.monthlyRate}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, monthlyRate: Number(e.target.value) })
                      }
                      className="form-input tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="form-label">Minimum Stay (Nights)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingProperty.minimumStayDays}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, minimumStayDays: Number(e.target.value) })
                      }
                      className="form-input tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="form-label mb-0">Primary Cover Image URL</label>
                    <span className="type-support text-[#14616d] font-semibold tabular-nums">
                      {editingProperty.images?.length || 0} Total Photos in Gallery
                    </span>
                  </div>
                  <input
                    type="url"
                    value={propPrimaryImage}
                    onChange={(e) => setPropPrimaryImage(e.target.value)}
                    className="form-input"
                  />
                  {editingProperty.images && editingProperty.images.length > 0 && (
                    <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                      {editingProperty.images.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPropPrimaryImage(img)}
                          title={`Click to set as primary (Photo ${i + 1})`}
                          className={`w-14 h-10 shrink-0 rounded-lg overflow-hidden border cursor-pointer ${
                            propPrimaryImage === img
                              ? 'border-[#14616d] ring-2 ring-[#14616d]/30'
                              : 'border-slate-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Residence gallery preview ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label">Short Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProperty.shortDesc}
                    onChange={(e) => setEditingProperty({ ...editingProperty, shortDesc: e.target.value })}
                    className="form-textarea"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Save Residence
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Storefront Catalog Item */}
        {editingCatalogItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
              <LivePhotoBackground scene="courtyard" overlay="espresso" className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-h3 text-white">
                    Edit Catalog Item — {editingCatalogItem.sku}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCatalogItem(null)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleSaveCatalogItem} className="p-6 space-y-4">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    value={editingCatalogItem.title}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, title: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      required
                      value={editingCatalogItem.category}
                      onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, category: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Price (USD)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingCatalogItem.priceUsd}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, priceUsd: Number(e.target.value) })
                      }
                      className="form-input tabular-nums"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Billing Label</label>
                    <input
                      type="text"
                      value={editingCatalogItem.billingUnitLabel}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, billingUnitLabel: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Max Cart Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={editingCatalogItem.maxQuantity}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, maxQuantity: Number(e.target.value) })
                      }
                      className="form-input tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={editingCatalogItem.image}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, image: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingCatalogItem.shortDesc}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, shortDesc: e.target.value })}
                    className="form-textarea"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCatalogItem(null)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Save Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Allocate / Adjust Client Units */}
        {allocModalCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
              <LivePhotoBackground scene="courtyard" overlay="espresso" className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-h3 text-white">
                    Adjust Units — {allocModalCustomer.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setAllocModalCustomer(null)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleAllocateUnits} className="p-6 space-y-4">
                <div>
                  <label className="form-label">
                    Units Delta (Positive to credit, negative to deduct)
                  </label>
                  <input
                    type="number"
                    required
                    value={allocDelta}
                    onChange={(e) => setAllocDelta(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <div>
                  <label className="form-label">Audit Reason / Memo</label>
                  <input
                    type="text"
                    required
                    value={allocReason}
                    onChange={(e) => setAllocReason(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAllocModalCustomer(null)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Log Vehicle Maintenance */}
        {maintVehicle && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
              <LivePhotoBackground scene="twilight" overlay="espresso" className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-h3 text-white">
                    Log Fleet Service — {maintVehicle.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMaintVehicle(null)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleLogMaintenance} className="p-6 space-y-4">
                <div>
                  <label className="form-label">Service Type</label>
                  <input
                    type="text"
                    required
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Cost (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={maintCost}
                    onChange={(e) => setMaintCost(e.target.value)}
                    className="form-input tabular-nums"
                  />
                </div>
                <div>
                  <label className="form-label">Technician Notes</label>
                  <textarea
                    rows={2}
                    value={maintNotes}
                    onChange={(e) => setMaintNotes(e.target.value)}
                    placeholder="Brake pad check, synthetic oil, interior ozone sanitization..."
                    className="form-textarea"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setMaintVehicle(null)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Record Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Receipt Attachment Preview */}
        {receiptPreview && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setReceiptPreview(null)}
          >
            <div
              className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <LivePhotoBackground scene="twilight" overlay="espresso" className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="type-h4 text-white">{receiptPreview.title}</h4>
                  <button
                    type="button"
                    onClick={() => setReceiptPreview(null)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <div className="p-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center max-h-[70vh] overflow-auto">
                  {receiptPreview.dataUrl.startsWith('data:image') ? (
                    <img src={receiptPreview.dataUrl} alt="Wire Receipt" className="max-h-[62vh] w-auto object-contain rounded" />
                  ) : (
                    <a
                      href={receiptPreview.dataUrl}
                      download={receiptPreview.title}
                      className="btn btn-primary"
                    >
                      Download Attached PDF Receipt
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
