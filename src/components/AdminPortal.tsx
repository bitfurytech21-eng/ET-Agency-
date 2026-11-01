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

type AdminTab = 'overview' | 'orders' | 'catalog' | 'wires' | 'bookings' | 'fleet' | 'clients' | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateTab }) => {
  const { refreshCatalog } = useCart();
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('etl_admin_token'));
  const [adminProfile, setAdminProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('admin@easytravellodging.com');
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

  return (
    <div className="bg-[#f7f3ed] text-[#282828] min-h-[820px] pb-16 text-left">
      {/* Live Realistic Photography Control Center Header */}
      <LivePhotoBackground
        scene="twilight"
        secondaryScene="courtyard"
        overlay="espresso"
        className="border-b border-[#e6dfd5]"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-9 sm:py-11">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[#7ef0e5] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Administrative Operations, Storefront &amp; Treasury</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
                Easy Travel Lodging — Admin Control Center
              </h1>
              <p className="text-xs sm:text-sm text-[#f0e9e1]/90 max-w-2xl">
                Manage storefront orders, residences, concierge services, promotions, 3D fleet inventory, wire verification, and client accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigateTab('portal')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Client Portal</span>
              </button>

              {adminToken && (
                <>
                  <button
                    type="button"
                    onClick={() => fetchAdminDashboard(adminToken)}
                    className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-[#82634f] hover:bg-[#6e5240] border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-950 font-semibold cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-semibold cursor-pointer">
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
            className="rounded-3xl overflow-hidden border border-[#e6dfd5] shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
              <div className="lg:col-span-6 text-white space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7ef0e5] block">
                  Role-Protected JWT Gateway
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight text-white">
                  Executive Host, Concierge &amp; Treasury Administration
                </h2>
                <p className="text-sm text-[#f2ece4]/90 leading-relaxed">
                  Verify incoming bank wires, update residence rates and seasonal packages, review 3D fleet reservations, and audit prepaid Lodging Unit balances from a unified operations workspace.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                    <span className="font-bold text-white block">Immutable Ledger</span>
                    <span className="text-[#e8dfd5]/85">Full actor &amp; timestamp audit trail</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                    <span className="font-bold text-white block">Live Storefront Sync</span>
                    <span className="text-[#e8dfd5]/85">Instant rate, catalog &amp; promo updates</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-[#282828]">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00897d]">
                      Authorized Personnel Only
                    </span>
                    <h3 className="text-xl font-heading font-black text-[#282828]">
                      Executive &amp; Concierge Staff Sign In
                    </h3>
                    <p className="text-xs text-[#5c5046]">
                      Authorized hosts and treasury staff only. Every action is recorded in the immutable audit log.
                    </p>
                  </div>

                  <div className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#00897d] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Pre-Seeded Admin Credentials
                      </span>
                      <span className="text-[10px] font-mono text-[#857568]">RBAC: admin / staff</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#5c5046] space-y-1">
                      <div><strong className="text-[#282828]">Admin:</strong> admin@easytravellodging.com / admin12345</div>
                      <div><strong className="text-[#282828]">Staff:</strong> concierge@easytravellodging.com / staff12345</div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('admin@easytravellodging.com');
                          setLoginPassword('admin12345');
                        }}
                        className="flex-1 py-1.5 bg-[#82634f] hover:bg-[#6e5240] rounded-lg text-[11px] font-bold text-white transition-colors cursor-pointer"
                      >
                        Load Host Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('concierge@easytravellodging.com');
                          setLoginPassword('staff12345');
                        }}
                        className="flex-1 py-1.5 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-[11px] font-bold text-[#5c5046] transition-colors cursor-pointer"
                      >
                        Load Concierge Staff
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5c5046] mb-1.5">Staff Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568]" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-sm text-[#282828] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5c5046] mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#857568]" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-10 pr-4 h-11 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-sm text-[#282828] focus:border-[#00b7a8] focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                  Settled Revenue
                </span>
                <div className="text-2xl font-heading font-black text-[#00897d] mt-1 tabular-nums">
                  ${overview.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#857568]">Verified ledger total</span>
              </div>

              <div className="p-4 bg-white border border-[#bfe8e3] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00897d] block">
                  Storefront Orders
                </span>
                <div className="text-2xl font-heading font-black text-[#282828] mt-1 tabular-nums">
                  {overview.totalOrders ?? orders.length}
                </div>
                <span className="text-[11px] text-[#00897d] font-medium tabular-nums">
                  {overview.paidOrdersCount ?? 0} paid · {overview.pendingOrdersCount ?? 0} pending
                </span>
              </div>

              <div className="p-4 bg-white border border-[#e5d2bc] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#82634f] block">
                  Pending Wire Queue
                </span>
                <div className="text-2xl font-heading font-black text-[#282828] mt-1 tabular-nums">
                  ${overview.pendingWireAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#82634f] font-medium tabular-nums">
                  {overview.pendingWireCount} transfer(s) awaiting review
                </span>
              </div>

              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                  Residence Stays
                </span>
                <div className="text-2xl font-heading font-black text-[#282828] mt-1 tabular-nums">
                  {overview.activeBookings} / {overview.totalBookings}
                </div>
                <span className="text-[11px] text-[#857568] tabular-nums">
                  {overview.confirmedBookings} confirmed · {overview.pendingBookings} pending
                </span>
              </div>

              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                  3D Fleet Rentals
                </span>
                <div className="text-2xl font-heading font-black text-[#82634f] mt-1 tabular-nums">
                  {overview.activeVehicleBookings} / {overview.totalVehicleBookings}
                </div>
                <span className="text-[11px] text-[#857568] tabular-nums">{vehicles.length} vehicles in fleet</span>
              </div>

              <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                  Catalog &amp; Promos
                </span>
                <div className="text-2xl font-heading font-black text-[#00897d] mt-1 tabular-nums">
                  {overview.activeCatalogCount ?? catalogItems.length} Items
                </div>
                <span className="text-[11px] text-[#857568] tabular-nums">
                  {overview.activePromoCount ?? promoCodes.length} active promo(s)
                </span>
              </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#e6dfd5] pb-3">
              {[
                { id: 'overview', label: 'Inquiries & Audit', icon: Inbox, badge: overview.newInquiriesCount },
                { id: 'orders', label: 'Orders & Sales', icon: ShoppingBag, badge: overview.pendingOrdersCount || orders.length },
                { id: 'catalog', label: 'Catalog, Suites & Promos', icon: Package, badge: properties.length + catalogItems.length },
                { id: 'wires', label: 'Wire / ACH Verification', icon: Landmark, badge: overview.pendingWireCount },
                { id: 'bookings', label: 'Residence Stays', icon: Building2, badge: overview.pendingBookings },
                { id: 'fleet', label: 'Fleet & Maintenance', icon: Car },
                { id: 'clients', label: 'Clients & Units', icon: Users, badge: customers.length },
                { id: 'settings', label: 'Bank Accounts & CSV', icon: FileSpreadsheet },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as AdminTab)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#00b7a8] text-white border-[#00b7a8] shadow-xs'
                        : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#82634f]/40 hover:text-[#282828]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                    {typeof t.badge === 'number' && t.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-black tabular-nums ${
                          active ? 'bg-white/25 text-white' : 'bg-[#f5efe8] text-[#82634f]'
                        }`}
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW — INQUIRIES & AUDIT TRAIL */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e6dfd5] pb-3">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#282828]">
                        Inbound Guest Inquiries, Brochure &amp; Live Chat Leads
                      </h3>
                      <p className="text-xs text-[#5c5046]">
                        Captured in real time from Contact Us, Brochure Downloads, Host Design Guide, and Live Housing Chat.
                      </p>
                    </div>
                  </div>

                  {inquiries.length === 0 ? (
                    <p className="text-xs text-[#857568] py-6 text-center">No inquiries logged yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#00897d]">{inq.referenceCode}</span>
                              <span className="px-2 py-0.5 rounded bg-white border border-[#dfd6ca] text-[10px] uppercase font-bold text-[#82634f]">
                                {inq.type.replace('_', ' ')}
                              </span>
                              <span className="font-bold text-[#282828]">{inq.name}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                inq.status === 'new'
                                  ? 'bg-[#e8f8f6] text-[#00897d] border border-[#bfe8e3]'
                                  : 'bg-white text-[#857568] border border-[#e6dfd5]'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>

                          <div className="text-[#5c5046]">
                            {inq.email} {inq.phone ? `• ${inq.phone}` : ''} {inq.company ? `• ${inq.company}` : ''}
                            {inq.propertyId ? ` • Unit: ${inq.propertyId}` : ''}
                          </div>

                          {inq.message && (
                            <p className="text-[#282828] bg-white p-2.5 rounded-lg border border-[#e6dfd5]">
                              {inq.message}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-[#857568]">
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              {inq.status === 'new' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'reviewed')}
                                  className="px-2.5 py-1 bg-[#e8f8f6] hover:bg-[#d3f2ee] text-[#00897d] border border-[#bfe8e3] rounded text-[11px] font-bold cursor-pointer"
                                >
                                  Mark Reviewed
                                </button>
                              )}
                              {inq.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                                  className="px-2.5 py-1 bg-white hover:bg-[#f4efe9] text-[#5c5046] border border-[#dfd6ca] rounded text-[11px] cursor-pointer"
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
                <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="border-b border-[#e6dfd5] pb-3">
                    <h3 className="font-heading font-bold text-base text-[#282828]">Immutable Audit Log</h3>
                    <p className="text-xs text-[#5c5046]">Every settlement, verification, and status update.</p>
                  </div>
                  <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1 text-xs">
                    {auditLogs.slice(0, 25).map((log) => (
                      <div key={log.id} className="p-3 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-[11px] text-[#82634f]">{log.action}</span>
                          <span className="text-[10px] text-[#857568]">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#282828]">{log.details}</p>
                        <div className="text-[10px] text-[#857568] font-mono">
                          Actor: {log.actorEmail} • Target: {log.targetId}
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
                  <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                      Total Cart Orders
                    </span>
                    <div className="text-2xl font-heading font-black text-[#282828] mt-1 tabular-nums">
                      {overview.totalOrders ?? orders.length}
                    </div>
                    <span className="text-[11px] text-[#857568]">All online checkout submissions</span>
                  </div>
                  <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                      Verified Order Revenue
                    </span>
                    <div className="text-2xl font-heading font-black text-[#00897d] mt-1 tabular-nums">
                      ${(overview.orderRevenueUsd ?? 0).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#857568] tabular-nums">
                      {overview.paidOrdersCount ?? 0} verified paid order(s)
                    </span>
                  </div>
                  <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                      Awaiting Verification
                    </span>
                    <div className="text-2xl font-heading font-black text-[#82634f] mt-1 tabular-nums">
                      {overview.pendingOrdersCount ?? 0}
                    </div>
                    <span className="text-[11px] text-[#857568]">Pending wire, ACH, or Zelle review</span>
                  </div>
                  <div className="p-4 bg-white border border-[#e6dfd5] rounded-2xl shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#857568] block">
                      Average Paid Order
                    </span>
                    <div className="text-2xl font-heading font-black text-[#00897d] mt-1 tabular-nums">
                      ${(overview.averageOrderValueUsd ?? 0).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#857568]">Per verified transaction</span>
                  </div>
                </div>

                {/* Orders Table / List */}
                <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e6dfd5] pb-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#282828]">
                        Storefront Orders &amp; Payment Verification
                      </h3>
                      <p className="text-xs text-[#5c5046]">
                        Verify incoming transfers to mark orders Paid—automatically confirming linked suite/vehicle bookings and crediting Unit Packages.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#857568] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search ORD-ETL, guest, email..."
                          className="h-9 pl-8 pr-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
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
                        className="h-9 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-lg text-xs font-bold text-[#282828] outline-none focus:border-[#00b7a8]"
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
                        className="h-9 px-3 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-xs font-bold text-[#282828] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#00897d]" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <p className="text-xs text-[#857568] py-8 text-center">No storefront orders match your current filter.</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => {
                        const isPaid = ord.paymentStatus === 'paid';
                        const noteValue =
                          orderNotesMap[ord.id] !== undefined ? orderNotesMap[ord.id] : ord.adminNotes || '';
                        return (
                          <div key={ord.id} className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-4 text-xs">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-3">
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono font-bold text-sm text-[#00897d]">
                                    {ord.orderReference}
                                  </span>
                                  <span className="text-[#c8bdb0]">·</span>
                                  <span className="font-bold text-[#282828]">{ord.customerName}</span>
                                  <span className="text-[#5c5046]">({ord.customerEmail})</span>
                                  {ord.customerPhone && (
                                    <span className="text-[#857568]">· {ord.customerPhone}</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#5c5046]">
                                  Billing: {ord.billingAddress.line1}, {ord.billingAddress.city}, {ord.billingAddress.state}{' '}
                                  {ord.billingAddress.postalCode} · Placed {new Date(ord.createdAt).toLocaleString()}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                                <span className="text-base font-black text-[#282828]">
                                  ${ord.totalUsd.toLocaleString()} USD
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] uppercase border ${
                                    isPaid
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : ord.paymentStatus === 'failed' || ord.paymentStatus === 'cancelled'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-[#f5efe8] text-[#82634f] border-[#e2d3c1]'
                                  }`}
                                >
                                  {isPaid ? 'Payment Verified' : ord.paymentStatus.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>

                            {/* Order Line Items */}
                            <div className="space-y-1.5">
                              {ord.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-2 text-[#5c5046]">
                                  <span>
                                    <strong className="text-[#282828]">{item.title}</strong> ({item.category}) —{' '}
                                    <span className="tabular-nums">
                                      {item.quantity} {item.quantityLabel} × ${item.unitPriceUsd.toLocaleString()}
                                    </span>
                                  </span>
                                  <span className="font-mono font-semibold text-[#282828] tabular-nums">
                                    ${item.lineSubtotalUsd.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5c5046] bg-white p-3 rounded-lg border border-[#e6dfd5] tabular-nums">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span>Method: <strong className="text-[#282828] uppercase">{ord.paymentMethod.replace(/_/g, ' ')}</strong></span>
                                {ord.paymentReference && (
                                  <span>Ref: <strong className="font-mono text-[#82634f]">{ord.paymentReference}</strong></span>
                                )}
                                <span>Subtotal: ${ord.subtotalUsd.toLocaleString()}</span>
                                <span>Fee: ${ord.serviceFeeUsd.toLocaleString()}</span>
                                <span>Tax: ${ord.taxUsd.toLocaleString()}</span>
                                {ord.discountUsd > 0 && (
                                  <span className="text-[#00897d] font-semibold">
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
                              <div className="text-[11px] text-[#282828]">
                                <span className="text-[#857568] font-semibold">Guest Notes:</span> {ord.guestNotes}
                              </div>
                            )}

                            {/* Admin Controls */}
                            <div className="pt-2 border-t border-[#e6dfd5] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={noteValue}
                                  onChange={(e) =>
                                    setOrderNotesMap((prev) => ({ ...prev, [ord.id]: e.target.value }))
                                  }
                                  placeholder="Internal reconciliation or fulfillment note..."
                                  className="flex-1 h-9 px-3 bg-white border border-[#dfd6ca] rounded-lg text-[#282828] outline-none focus:border-[#00b7a8]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrder(ord.id, { adminNotes: noteValue })}
                                  className="h-9 px-3 bg-white hover:bg-[#f4efe9] text-[#5c5046] font-semibold rounded-lg border border-[#dfd6ca] cursor-pointer"
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
                                  className="h-9 px-3 bg-white border border-[#dfd6ca] rounded-lg text-xs font-bold text-[#282828] outline-none focus:border-[#00b7a8]"
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
                                    className="px-3.5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
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
                                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-lg cursor-pointer"
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
                                    className="px-3 py-2 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] text-[#5c5046] font-semibold rounded-lg cursor-pointer"
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
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer border transition-colors ${
                          isSubActive
                            ? 'bg-[#82634f] text-white border-[#82634f] shadow-xs'
                            : 'bg-white text-[#5c5046] border-[#e6dfd5] hover:border-[#82634f]/40 hover:text-[#282828]'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 1. Residences & Suites Editor */}
                {catalogSection === 'suites' && (
                  <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="border-b border-[#e6dfd5] pb-3">
                      <h3 className="font-heading font-bold text-lg text-[#282828]">
                        Furnished Residences &amp; Suites Listing Manager
                      </h3>
                      <p className="text-xs text-[#5c5046]">
                        Update residence titles, categories, monthly rates, minimum stay rules, primary photography, and real-time cart availability.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {properties.map((prop, idx) => (
                        <div
                          key={prop.id}
                          className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex gap-4 text-xs"
                        >
                          <img
                            src={prop.images?.[0] || getFallbackPropertyImage(idx)}
                            alt={prop.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackPropertyImage(idx);
                            }}
                            className="w-24 h-24 rounded-xl object-cover bg-[#f4efe9] border border-[#e6dfd5] shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[11px] text-[#00897d] font-bold block truncate">
                                  {prop.category}
                                </span>
                                <h4 className="font-heading font-bold text-sm text-[#282828] truncate">
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
                                className="h-8 px-2 bg-white border border-[#dfd6ca] rounded-lg text-[11px] font-bold text-[#282828] shrink-0"
                              >
                                <option value="Available">Available</option>
                                <option value="Inquired">Inquired</option>
                                <option value="Reserved">Reserved</option>
                              </select>
                            </div>

                            <p className="text-[11px] text-[#5c5046] line-clamp-2">{prop.shortDesc}</p>

                            <div className="flex items-center justify-between pt-1">
                              <span className="font-mono font-bold text-[#282828] tabular-nums">
                                ${prop.monthlyRate.toLocaleString()}/mo · Min {prop.minimumStayDays}d
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProperty({ ...prop });
                                  setPropPrimaryImage(prop.images?.[0] || '');
                                }}
                                className="px-3 py-1.5 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-[#282828] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-[#00897d]" />
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
                    <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4 h-fit">
                      <div className="border-b border-[#e6dfd5] pb-3">
                        <h3 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#00897d]" />
                          <span>Add Storefront Service or Package</span>
                        </h3>
                        <p className="text-xs text-[#5c5046]">
                          New items appear immediately in the Services &amp; Packages storefront and cart.
                        </p>
                      </div>

                      <form onSubmit={handleCreateCatalogItem} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#5c5046] mb-1">Item Type</label>
                            <select
                              value={newItemType}
                              onChange={(e) => setNewItemType(e.target.value as 'addon_service' | 'unit_package')}
                              className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                            >
                              <option value="addon_service">Concierge / Add-On</option>
                              <option value="unit_package">Lodging Unit Package</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-[#5c5046] mb-1">Category</label>
                            <input
                              type="text"
                              required
                              value={newItemCategory}
                              onChange={(e) => setNewItemCategory(e.target.value)}
                              placeholder="Arrival & Concierge"
                              className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Listing Title *</label>
                          <input
                            type="text"
                            required
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            placeholder="e.g. Private SMF Chauffeur Greeting"
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#5c5046] mb-1">Price (USD) *</label>
                            <input
                              type="number"
                              min={1}
                              required
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                            />
                          </div>
                          {newItemType === 'unit_package' ? (
                            <div>
                              <label className="block font-bold text-[#5c5046] mb-1">Units Credited *</label>
                              <input
                                type="number"
                                min={1}
                                required
                                value={newItemUnitsIncluded}
                                onChange={(e) => setNewItemUnitsIncluded(e.target.value)}
                                className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                              />
                            </div>
                          ) : (
                            <div>
                              <label className="block font-bold text-[#5c5046] mb-1">Billing Label</label>
                              <input
                                type="text"
                                value={newItemBillingLabel}
                                onChange={(e) => setNewItemBillingLabel(e.target.value)}
                                placeholder="per service / per stay"
                                className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Image URL (Optional)</label>
                          <input
                            type="url"
                            value={newItemImage}
                            onChange={(e) => setNewItemImage(e.target.value)}
                            placeholder="https://easytravellodging.com/..."
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Description *</label>
                          <textarea
                            rows={2}
                            required
                            value={newItemShortDesc}
                            onChange={(e) => setNewItemShortDesc(e.target.value)}
                            placeholder="Clear summary of what is included for the guest..."
                            className="w-full p-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Publish Storefront Listing
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                      <div className="border-b border-[#e6dfd5] pb-3">
                        <h3 className="font-heading font-bold text-base text-[#282828]">
                          Active Services &amp; Unit Packages ({catalogItems.length})
                        </h3>
                        <p className="text-xs text-[#5c5046]">
                          Toggle availability to pause cart additions or edit pricing and descriptions.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {catalogItems.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.image || getFallbackPropertyImage(idx)}
                                alt={item.title}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getFallbackPropertyImage(idx);
                                }}
                                className="w-14 h-14 rounded-lg object-cover bg-[#f4efe9] border border-[#e6dfd5] shrink-0"
                              />
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 text-[11px] text-[#5c5046]">
                                  <span className="font-mono font-semibold text-[#00897d]">{item.sku}</span>
                                  <span>·</span>
                                  <span>{item.category}</span>
                                </div>
                                <div className="font-bold text-sm text-[#282828] truncate">{item.title}</div>
                                <div className="text-[11px] text-[#5c5046] tabular-nums">
                                  <strong className="text-[#282828]">${item.priceUsd.toLocaleString()}</strong>{' '}
                                  {item.billingUnitLabel}
                                  {item.unitsIncluded ? ` · Credits ${item.unitsIncluded} Units` : ''}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleCatalogAvailability(item)}
                                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer border ${
                                  item.available
                                    ? 'bg-[#e8f8f6] text-[#00897d] border-[#bfe8e3]'
                                    : 'bg-white text-[#857568] border-[#dfd6ca]'
                                }`}
                              >
                                {item.available ? 'Available' : 'Paused'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatalogItem({ ...item })}
                                className="px-2.5 py-1.5 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-[#5c5046] cursor-pointer"
                                title="Edit listing"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCatalogItem(item)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-700 cursor-pointer"
                                title="Delete listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
                    <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4 h-fit">
                      <div className="border-b border-[#e6dfd5] pb-3">
                        <h3 className="font-heading font-bold text-base text-[#282828] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#00897d]" />
                          <span>Create Promotional Code</span>
                        </h3>
                        <p className="text-xs text-[#5c5046]">
                          Discounts are validated server-side against cart subtotals before checkout.
                        </p>
                      </div>

                      <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Promo Code *</label>
                          <input
                            type="text"
                            required
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                            placeholder="e.g. SPRING15"
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] font-mono uppercase outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#5c5046] mb-1">Discount Type</label>
                            <select
                              value={newPromoType}
                              onChange={(e) => setNewPromoType(e.target.value as 'percentage' | 'fixed')}
                              className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed USD ($)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-[#5c5046] mb-1">
                              {newPromoType === 'percentage' ? 'Percent Off *' : 'USD Off *'}
                            </label>
                            <input
                              type="number"
                              min={1}
                              required
                              value={newPromoValue}
                              onChange={(e) => setNewPromoValue(e.target.value)}
                              className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Minimum Cart Subtotal (USD)</label>
                          <input
                            type="number"
                            min={0}
                            value={newPromoMinSubtotal}
                            onChange={(e) => setNewPromoMinSubtotal(e.target.value)}
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#5c5046] mb-1">Public Description *</label>
                          <input
                            type="text"
                            required
                            value={newPromoDesc}
                            onChange={(e) => setNewPromoDesc(e.target.value)}
                            placeholder="e.g. 15% off spring stays & concierge bundles"
                            className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Save Promo Code
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                      <div className="border-b border-[#e6dfd5] pb-3">
                        <h3 className="font-heading font-bold text-base text-[#282828]">
                          Configured Promotions ({promoCodes.length})
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {promoCodes.map((promo) => (
                          <div
                            key={promo.id}
                            className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-sm text-[#00897d]">{promo.code}</span>
                                <span className="text-[#c8bdb0]">·</span>
                                <span className="font-bold text-[#282828] tabular-nums">
                                  {promo.discountType === 'percentage'
                                    ? `${promo.discountValue}% OFF`
                                    : `$${promo.discountValue.toLocaleString()} OFF`}
                                </span>
                                <span className="text-[#c8bdb0]">·</span>
                                <span className="text-[#5c5046] tabular-nums">
                                  Min ${promo.minSubtotalUsd.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-[#5c5046]">{promo.description}</p>
                              <div className="text-[11px] text-[#857568] tabular-nums">
                                Redeemed {promo.usageCount} time(s)
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleTogglePromo(promo)}
                                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer border ${
                                  promo.active
                                    ? 'bg-[#e8f8f6] text-[#00897d] border-[#bfe8e3]'
                                    : 'bg-white text-[#857568] border-[#dfd6ca]'
                                }`}
                              >
                                {promo.active ? 'Active' : 'Paused'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePromo(promo)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-700 cursor-pointer"
                                title="Delete promo code"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd5] pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#282828]">
                      Manual Wire, ACH &amp; Zelle Verification Queue
                    </h3>
                    <p className="text-xs text-[#5c5046]">
                      Approving a transfer automatically posts a succeeded ledger entry and credits client units or confirms the target booking.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'pending_verification', 'verified', 'rejected'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setWireFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                          wireFilter === st
                            ? 'bg-[#00b7a8] text-white'
                            : 'bg-[#faf8f5] text-[#5c5046] border border-[#e6dfd5] hover:border-[#82634f]/40'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredWires.length === 0 ? (
                  <p className="text-xs text-[#857568] py-8 text-center">No transfer records match this filter.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredWires.map((mp) => (
                      <div key={mp.id} className="p-5 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#282828]">{mp.referenceCode}</span>
                            <span className="px-2 py-0.5 rounded bg-white border border-[#dfd6ca] text-[#5c5046] font-semibold">
                              {mp.paymentMethod}
                            </span>
                            <span className="font-mono font-semibold text-[#82634f]">Trace: {mp.wireReference}</span>
                          </div>
                          <div className="flex items-center gap-3 tabular-nums">
                            <span className="text-base font-black text-[#282828]">
                              ${mp.amountUsd.toLocaleString()} USD ({mp.unitsRequested}u)
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                mp.status === 'verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : mp.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-[#f5efe8] text-[#82634f] border border-[#e2d3c1]'
                              }`}
                            >
                              {mp.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#282828]">
                          <div>
                            <span className="text-[#857568] font-semibold block text-[10px] uppercase">Client</span>
                            {mp.customerName} ({mp.customerEmail})
                          </div>
                          <div>
                            <span className="text-[#857568] font-semibold block text-[10px] uppercase">Originating Bank</span>
                            {mp.senderName} • {mp.originatingBank} ({mp.transferDate})
                          </div>
                          <div>
                            <span className="text-[#857568] font-semibold block text-[10px] uppercase">Target Allocation</span>
                            {mp.targetType} {mp.targetId ? `(${mp.targetId})` : `(+${mp.unitsRequested} Units)`}
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
                              className="px-3 py-1.5 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-[#00897d] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Uploaded Receipt ({mp.receiptFileName || 'Attachment'})</span>
                            </button>
                          </div>
                        )}

                        {mp.status === 'pending_verification' ? (
                          <div className="pt-2 border-t border-[#e6dfd5] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <input
                              type="text"
                              placeholder="Optional treasury reconciliation note (e.g. Matched Chase Fedwire #)..."
                              value={wireNotesMap[mp.id] || ''}
                              onChange={(e) => setWireNotesMap((prev) => ({ ...prev, [mp.id]: e.target.value }))}
                              className="flex-1 h-9 px-3 bg-white border border-[#dfd6ca] rounded-lg text-[#282828] outline-none focus:border-[#00b7a8]"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleVerifyWire(mp.id, 'verified')}
                                className="px-4 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve &amp; Credit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleVerifyWire(mp.id, 'rejected')}
                                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#5c5046] pt-1 border-t border-[#e6dfd5]">
                            Reviewed by {mp.verifiedBy || 'Treasury'} • {mp.adminNotes}
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
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-[#e6dfd5] pb-3">
                  <h3 className="font-heading font-bold text-lg text-[#282828]">
                    Rancho Cordova &amp; Sacramento Residence Reservations
                  </h3>
                  <p className="text-xs text-[#5c5046]">
                    Manage short-stay and 30+ day extended reservation statuses or record manual payment clearance.
                  </p>
                </div>

                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-[#00897d]">{b.id}</span>
                          <span className="font-bold text-[#282828] uppercase">{b.propertyId}</span>
                          <span className="text-[#c8bdb0]">•</span>
                          <span className="font-semibold text-[#282828]">{b.guestName}</span>
                          <span className="text-[#5c5046]">({b.guestEmail})</span>
                        </div>
                        <div className="text-[#5c5046] tabular-nums">
                          {b.checkIn} → {b.checkOut} ({b.totalNights} nights) • {b.employer || 'Individual Stay'}
                        </div>
                        {b.notes && <div className="text-[11px] text-[#857568]">{b.notes}</div>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <select
                          value={b.status}
                          onChange={(e) => handleHousingStatusChange(b.id, e.target.value)}
                          className="h-9 px-3 bg-white border border-[#dfd6ca] rounded-lg text-xs font-bold text-[#282828] outline-none focus:border-[#00b7a8]"
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
                            className="px-3 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-lg transition-colors cursor-pointer"
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
                <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-lg text-[#282828] border-b border-[#e6dfd5] pb-3">
                    Client Fleet Reservations ({vehicleBookings.length})
                  </h3>
                  <div className="space-y-3">
                    {vehicleBookings.map((vb) => (
                      <div
                        key={vb.id}
                        className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-[#82634f]">{vb.id}</span>
                            <span className="font-bold text-[#282828]">{vb.vehicleName}</span>
                            <span className="text-[#5c5046]">({vb.exteriorColorName})</span>
                          </div>
                          <div className="text-[#5c5046] tabular-nums">
                            {vb.customerName} ({vb.customerEmail}) • {vb.pickupDate} → {vb.returnDate} ({vb.totalDays}d) •{' '}
                            <strong className="text-[#282828]">${vb.totalUsd.toLocaleString()}</strong>
                          </div>
                          <div className="text-[11px] text-[#857568]">Hub: {vb.pickupLocation}</div>
                        </div>

                        <select
                          value={vb.status}
                          onChange={(e) => handleVehicleBookingStatus(vb.id, e.target.value)}
                          className="h-9 px-3 bg-white border border-[#dfd6ca] rounded-lg text-xs font-bold text-[#282828] outline-none focus:border-[#00b7a8] self-start lg:self-center"
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
                <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-lg text-[#282828] border-b border-[#e6dfd5] pb-3">
                    American Fleet Inventory &amp; Service Logs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((v) => (
                      <div key={v.id} className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-3 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-bold text-sm text-[#282828]">{v.name}</h4>
                            <span className="text-[11px] text-[#5c5046] font-mono tabular-nums">
                              Plate: {v.licensePlate} • {v.mileage.toLocaleString()} mi • ${v.dailyRate}/day (${v.monthlyRate}/mo)
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
                            className="h-8 px-2.5 bg-white border border-[#dfd6ca] rounded-lg text-[11px] font-bold text-[#282828]"
                          >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#e6dfd5]">
                          <span className="text-[11px] text-[#857568] tabular-nums">
                            {v.maintenanceLogs?.length || 0} service record(s)
                          </span>
                          <button
                            type="button"
                            onClick={() => setMaintVehicle(v)}
                            className="px-3 py-1 bg-white hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-lg text-[#282828] font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Wrench className="w-3 h-3 text-[#00897d]" />
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
              <div className="bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="border-b border-[#e6dfd5] pb-3">
                  <h3 className="font-heading font-bold text-lg text-[#282828]">
                    Registered Guests, Households &amp; Client Accounts
                  </h3>
                  <p className="text-xs text-[#5c5046]">
                    Issue prepaid Lodging Unit allotments or adjust client balances with full audit logging.
                  </p>
                </div>

                <div className="space-y-3">
                  {customers.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-[#282828]">
                          {c.name} <span className="text-xs font-normal text-[#5c5046]">({c.email})</span>
                        </div>
                        <div className="text-[#5c5046]">
                          {c.company} • {c.role} • {c.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 tabular-nums">
                        <div className="text-right">
                          <span className="font-black text-base text-[#00897d] block">{c.units_balance} Units</span>
                          <span className="text-[11px] text-[#857568]">${c.balance_usd?.toLocaleString()} USD</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAllocModalCustomer(c);
                            setAllocDelta('25');
                          }}
                          className="px-3.5 py-2 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
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
                <div className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-lg text-[#282828] border-b border-[#e6dfd5] pb-3">
                    Official Receiving Bank &amp; Zelle Configuration
                  </h3>
                  <form onSubmit={handleSaveBankSettings} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={paymentAccounts.bankName}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, bankName: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">Beneficiary Account Name</label>
                        <input
                          type="text"
                          value={paymentAccounts.accountName}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, accountName: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">Account Number</label>
                        <input
                          type="text"
                          value={paymentAccounts.accountNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, accountNumber: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">ACH Routing</label>
                        <input
                          type="text"
                          value={paymentAccounts.achRoutingNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, achRoutingNumber: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">Wire Routing ABA</label>
                        <input
                          type="text"
                          value={paymentAccounts.wireRoutingNumber}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, wireRoutingNumber: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">SWIFT Code</label>
                        <input
                          type="text"
                          value={paymentAccounts.swiftCode}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, swiftCode: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] font-mono outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#5c5046] mb-1">Corporate Zelle Email</label>
                        <input
                          type="text"
                          value={paymentAccounts.zelleEmail}
                          onChange={(e) => setPaymentAccounts({ ...paymentAccounts, zelleEmail: e.target.value })}
                          className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#5c5046] mb-1">Client Remittance Instructions</label>
                      <textarea
                        rows={3}
                        value={paymentAccounts.paymentInstructions}
                        onChange={(e) => setPaymentAccounts({ ...paymentAccounts, paymentInstructions: e.target.value })}
                        className="w-full p-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Save Receiving Bank Settings
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-2xl p-6 shadow-xs space-y-4 h-fit">
                  <h3 className="font-heading font-bold text-lg text-[#282828] border-b border-[#e6dfd5] pb-3">
                    Reconciliation &amp; Accounting Exports (CSV)
                  </h3>
                  <p className="text-xs text-[#5c5046]">
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
                      className="w-full p-3.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#e6dfd5] rounded-xl text-xs font-bold text-[#282828] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Export Housing Bookings Ledger (.CSV)</span>
                      <Download className="w-4 h-4 text-[#00897d]" />
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
                      className="w-full p-3.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#e6dfd5] rounded-xl text-xs font-bold text-[#282828] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Export Wire &amp; ACH Verification Log (.CSV)</span>
                      <Download className="w-4 h-4 text-[#00897d]" />
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
                      className="w-full p-3.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#e6dfd5] rounded-xl text-xs font-bold text-[#282828] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Export Registered Client Unit Balances (.CSV)</span>
                      <Download className="w-4 h-4 text-[#00897d]" />
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
                      className="w-full p-3.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#e6dfd5] rounded-xl text-xs font-bold text-[#282828] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Export Storefront Orders &amp; Sales (.CSV)</span>
                      <Download className="w-4 h-4 text-[#00897d]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Edit Residence / Suite Listing */}
        {editingProperty && (
          <div className="fixed inset-0 z-50 bg-[#1c1613]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
              <LivePhotoBackground scene="interior" overlay="espresso" className="px-6 py-4 border-b border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Edit Residence — Unit {editingProperty.unitNumber}
                  </h3>
                  <button onClick={() => setEditingProperty(null)} className="text-white/80 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleSaveProperty} className="p-6 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editingProperty.category}
                      onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value })}
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Availability</label>
                    <select
                      value={editingProperty.status}
                      onChange={(e) =>
                        setEditingProperty({
                          ...editingProperty,
                          status: e.target.value as 'Available' | 'Inquired' | 'Reserved',
                        })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Inquired">Inquired</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Monthly Rate (USD)</label>
                    <input
                      type="number"
                      min={500}
                      required
                      value={editingProperty.monthlyRate}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, monthlyRate: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Minimum Stay (Nights)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingProperty.minimumStayDays}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, minimumStayDays: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Primary Cover Image URL</label>
                  <input
                    type="url"
                    value={propPrimaryImage}
                    onChange={(e) => setPropPrimaryImage(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProperty.shortDesc}
                    onChange={(e) => setEditingProperty({ ...editingProperty, shortDesc: e.target.value })}
                    className="w-full p-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="flex-1 py-2.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-xl font-bold text-[#5c5046] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl font-black uppercase cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-[#1c1613]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
              <LivePhotoBackground scene="courtyard" overlay="espresso" className="px-6 py-4 border-b border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Edit Catalog Item — {editingCatalogItem.sku}
                  </h3>
                  <button
                    onClick={() => setEditingCatalogItem(null)}
                    className="text-white/80 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleSaveCatalogItem} className="p-6 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingCatalogItem.title}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, title: e.target.value })}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editingCatalogItem.category}
                      onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, category: e.target.value })}
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Price (USD)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingCatalogItem.priceUsd}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, priceUsd: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Billing Label</label>
                    <input
                      type="text"
                      value={editingCatalogItem.billingUnitLabel}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, billingUnitLabel: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5c5046] mb-1">Max Cart Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={editingCatalogItem.maxQuantity}
                      onChange={(e) =>
                        setEditingCatalogItem({ ...editingCatalogItem, maxQuantity: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingCatalogItem.image}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, image: e.target.value })}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingCatalogItem.shortDesc}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, shortDesc: e.target.value })}
                    className="w-full p-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCatalogItem(null)}
                    className="flex-1 py-2.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-xl font-bold text-[#5c5046] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl font-black uppercase cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-[#1c1613]/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <LivePhotoBackground scene="courtyard" overlay="espresso" className="px-6 py-4 border-b border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Adjust Units — {allocModalCustomer.name}
                  </h3>
                  <button onClick={() => setAllocModalCustomer(null)} className="text-white/80 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleAllocateUnits} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">
                    Units Delta (Positive to credit, negative to deduct)
                  </label>
                  <input
                    type="number"
                    required
                    value={allocDelta}
                    onChange={(e) => setAllocDelta(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Audit Reason / Memo</label>
                  <input
                    type="text"
                    required
                    value={allocReason}
                    onChange={(e) => setAllocReason(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAllocModalCustomer(null)}
                    className="flex-1 py-2.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-xl font-bold text-[#5c5046] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl font-black uppercase cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-[#1c1613]/65 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#e6dfd5] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <LivePhotoBackground scene="twilight" overlay="espresso" className="px-6 py-4 border-b border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Log Fleet Service — {maintVehicle.name}
                  </h3>
                  <button onClick={() => setMaintVehicle(null)} className="text-white/80 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <form onSubmit={handleLogMaintenance} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Service Type</label>
                  <input
                    type="text"
                    required
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={maintCost}
                    onChange={(e) => setMaintCost(e.target.value)}
                    className="w-full h-10 px-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] tabular-nums outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5c5046] mb-1">Technician Notes</label>
                  <textarea
                    rows={2}
                    value={maintNotes}
                    onChange={(e) => setMaintNotes(e.target.value)}
                    placeholder="Brake pad check, synthetic oil, interior ozone sanitization..."
                    className="w-full p-3 bg-[#faf8f5] border border-[#dfd6ca] rounded-xl text-[#282828] outline-none focus:border-[#00b7a8] focus:bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMaintVehicle(null)}
                    className="flex-1 py-2.5 bg-[#faf8f5] hover:bg-[#f4efe9] border border-[#dfd6ca] rounded-xl font-bold text-[#5c5046] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white rounded-xl font-black uppercase cursor-pointer"
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
            className="fixed inset-0 z-50 bg-[#1c1613]/75 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setReceiptPreview(null)}
          >
            <div
              className="bg-white border border-[#e6dfd5] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <LivePhotoBackground scene="twilight" overlay="espresso" className="px-6 py-4 border-b border-[#e6dfd5]">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-white">{receiptPreview.title}</h4>
                  <button onClick={() => setReceiptPreview(null)} className="text-white/80 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </LivePhotoBackground>
              <div className="p-5">
                <div className="bg-[#faf8f5] border border-[#e6dfd5] rounded-xl p-4 flex items-center justify-center max-h-[70vh] overflow-auto">
                  {receiptPreview.dataUrl.startsWith('data:image') ? (
                    <img src={receiptPreview.dataUrl} alt="Wire Receipt" className="max-h-[62vh] w-auto object-contain rounded" />
                  ) : (
                    <a
                      href={receiptPreview.dataUrl}
                      download={receiptPreview.title}
                      className="px-4 py-2.5 bg-[#00b7a8] hover:bg-[#009e91] text-white font-bold text-xs rounded-xl"
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
