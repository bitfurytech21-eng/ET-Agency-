import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import {
  VEHICLE_THUMBNAILS,
  calculatePropertyStayQuote,
  calculateVehiclePricing,
  findOverlappingPropertyRange,
  recomputeCart,
  readPlatformDb,
  writePlatformDb,
} from './store.js';
import type {
  BookingRecord,
  DatabaseState,
  ManualPaymentRecord,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderRecord,
  OrderStatus,
  SupportTicketRecord,
  VehicleBookingRecord,
} from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');
const customersFile = path.join(dataDir, 'php_customers.json');

export interface CustomerPurchase {
  id: string;
  description: string;
  unit_number: string;
  units_purchased: number;
  amount_usd: number;
  status: string;
  purchased_at: string;
  payment_method: string;
}

export interface CustomerTransaction {
  id: string;
  type: string;
  units: number;
  amount_usd: number;
  description: string;
  date: string;
  command_code?: string;
  booking_id?: string;
  status?: string;
}

export interface CustomerDashboardConfig {
  id: string;
  user_id: string;
  created_at: string;
  last_accessed_at: string;
  initialized: boolean;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CustomerPreferences {
  thermostat: string;
  pillows: string;
  quietHours: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  preferredCurrency: string;
  timezone: string;
}

export interface CustomerDriverInfo {
  primaryDriver: string;
  licenseNumber: string;
  issuingState: string;
}

export interface CustomerLoginEvent {
  id: string;
  timestamp: string;
  device: string;
  ip: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  company: string;
  role: string;
  phone: string;
  balance_usd: number;
  units_balance: number;
  created_at: string;
  password_updated_at?: string;
  two_factor_enabled?: boolean;
  dashboard: CustomerDashboardConfig;
  address?: CustomerAddress;
  preferences?: CustomerPreferences;
  driver_info?: CustomerDriverInfo;
  login_history?: CustomerLoginEvent[];
  wishlist?: string[];
  purchases: CustomerPurchase[];
  transactions: CustomerTransaction[];
}

export interface CustomerSession {
  customer_id: string;
  created_at: string;
  last_active_at?: string;
  expires_at: string;
  user_agent?: string;
  ip?: string;
}

export interface CustomerDbState {
  customers: CustomerRecord[];
  sessions: Record<string, CustomerSession>;
}

function buildDefaultPreferences(): CustomerPreferences {
  return {
    thermostat: '70°F (21°C)',
    pillows: 'Hypoallergenic Medium-Firm',
    quietHours: 'Standard (10:00 PM – 7:00 AM)',
    emailNotifications: true,
    smsNotifications: true,
    preferredCurrency: 'USD ($)',
    timezone: 'America/Los_Angeles (PT)',
  };
}

function ensureIndividualDashboard(customer: CustomerRecord, touchAccess = false): boolean {
  const nowIso = new Date().toISOString();
  let mutated = false;

  if (!customer.dashboard || !customer.dashboard.id) {
    customer.dashboard = {
      id: `dash_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
      user_id: customer.id,
      created_at: customer.created_at || nowIso,
      last_accessed_at: nowIso,
      initialized: true,
    };
    mutated = true;
  } else if (touchAccess) {
    customer.dashboard.last_accessed_at = nowIso;
    mutated = true;
  }

  if (!customer.preferences) {
    customer.preferences = buildDefaultPreferences();
    mutated = true;
  }

  if (!customer.address) {
    customer.address = {
      street: '',
      city: '',
      state: 'CA',
      zip: '',
      country: 'United States',
    };
    mutated = true;
  }

  if (!customer.driver_info) {
    customer.driver_info = {
      primaryDriver: customer.name,
      licenseNumber: '',
      issuingState: 'CA',
    };
    mutated = true;
  }

  if (!Array.isArray(customer.purchases)) {
    customer.purchases = [];
    mutated = true;
  }
  if (!Array.isArray(customer.transactions)) {
    customer.transactions = [];
    mutated = true;
  }
  if (!Array.isArray(customer.login_history)) {
    customer.login_history = [];
    mutated = true;
  }
  if (!Array.isArray(customer.wishlist)) {
    customer.wishlist = [];
    mutated = true;
  }

  return mutated;
}

async function ensureCustomerDb(): Promise<CustomerDbState> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const raw = await fs.readFile(customersFile, 'utf8');
    const data = JSON.parse(raw);
    const customers: CustomerRecord[] = Array.isArray(data.customers) ? data.customers : [];
    const sessions: Record<string, CustomerSession> =
      data.sessions && typeof data.sessions === 'object' ? data.sessions : {};

    let dirty = false;
    const now = Date.now();
    for (const [tok, sess] of Object.entries(sessions)) {
      if (!sess || !sess.customer_id || (sess.expires_at && new Date(sess.expires_at).getTime() <= now)) {
        delete sessions[tok];
        dirty = true;
      }
    }
    for (const cust of customers) {
      if (ensureIndividualDashboard(cust, false)) {
        dirty = true;
      }
    }

    const state: CustomerDbState = { customers, sessions };
    if (dirty) {
      await saveCustomerDb(state);
    }
    return state;
  } catch {
    const emptyState: CustomerDbState = {
      customers: [],
      sessions: {},
    };
    await fs.writeFile(customersFile, JSON.stringify(emptyState, null, 2), 'utf8');
    return emptyState;
  }
}

async function saveCustomerDb(state: CustomerDbState) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(customersFile, JSON.stringify(state, null, 2), 'utf8');
}

function resolveAuthenticatedCustomer(
  db: CustomerDbState,
  token?: string,
): { customer: CustomerRecord; session: CustomerSession } | null {
  if (!token || typeof token !== 'string') return null;
  const trimmed = token.trim();
  if (!trimmed) return null;
  const session = db.sessions[trimmed];
  if (!session) return null;
  if (session.expires_at && new Date(session.expires_at).getTime() <= Date.now()) {
    delete db.sessions[trimmed];
    return null;
  }
  const customer = db.customers.find((c) => c.id === session.customer_id);
  if (!customer) return null;
  return { customer, session };
}

function claimUnownedRecordsForCustomer(platformDb: DatabaseState, customer: CustomerRecord): boolean {
  const emailLower = customer.email.toLowerCase().trim();
  let changed = false;

  for (const bk of platformDb.bookings) {
    if (!bk.customerId && bk.guestEmail && bk.guestEmail.toLowerCase().trim() === emailLower) {
      bk.customerId = customer.id;
      changed = true;
    }
  }
  for (const vbk of platformDb.vehicleBookings) {
    if (!vbk.customerId && vbk.customerEmail && vbk.customerEmail.toLowerCase().trim() === emailLower) {
      vbk.customerId = customer.id;
      changed = true;
    }
  }
  for (const mp of platformDb.manualPayments) {
    if (!mp.customerId && mp.customerEmail && mp.customerEmail.toLowerCase().trim() === emailLower) {
      mp.customerId = customer.id;
      changed = true;
    }
  }
  for (const ord of platformDb.orders || []) {
    if (!ord.customerId && ord.customerEmail && ord.customerEmail.toLowerCase().trim() === emailLower) {
      ord.customerId = customer.id;
      changed = true;
    }
  }
  for (const ntf of platformDb.notifications) {
    if (!ntf.customerId && ntf.recipientEmail && ntf.recipientEmail.toLowerCase().trim() === emailLower) {
      ntf.customerId = customer.id;
      changed = true;
    }
  }
  for (const inq of platformDb.inquiries) {
    if (!inq.customerId && inq.email && inq.email.toLowerCase().trim() === emailLower) {
      inq.customerId = customer.id;
      changed = true;
    }
  }

  return changed;
}

export async function getCustomerByToken(token?: string): Promise<CustomerRecord | null> {
  if (!token) return null;
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) return null;
  return resolved.customer;
}

export async function listAllCustomersSafe() {
  const db = await ensureCustomerDb();
  return db.customers.map(({ password_hash, ...safe }) => safe);
}

export async function phpAuthLogin(
  payload: { email?: string; password?: string },
  meta?: { userAgent?: string; ip?: string },
) {
  const email = (payload.email || '').toLowerCase().trim();
  const password = payload.password || '';

  if (!email || !password) {
    return { success: false, message: 'Email address and password are required.', status: 400 };
  }

  const db = await ensureCustomerDb();
  const customer = db.customers.find((c) => c.email.toLowerCase() === email);

  if (!customer) {
    return { success: false, message: 'Invalid email address or password.', status: 401 };
  }

  let isValid = false;
  if (
    customer.password_hash.startsWith('$2y$') ||
    customer.password_hash.startsWith('$2a$') ||
    customer.password_hash.startsWith('$2b$')
  ) {
    const normalizedHash = customer.password_hash.replace(/^\$2y\$/, '$2a$');
    isValid = bcrypt.compareSync(password, normalizedHash);
  }

  if (!isValid) {
    return { success: false, message: 'Invalid email address or password.', status: 401 };
  }

  // Ensure existing personal dashboard is linked and never duplicated
  ensureIndividualDashboard(customer, true);

  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + 7 * 86400000);
  const token = crypto.randomBytes(24).toString('hex');

  const deviceLabel = summarizeUserAgent(meta?.userAgent);
  const ipLabel = meta?.ip || 'Verified Client Network';

  db.sessions[token] = {
    customer_id: customer.id,
    created_at: nowIso,
    last_active_at: nowIso,
    expires_at: expiresAt.toISOString(),
    user_agent: deviceLabel,
    ip: ipLabel,
  };

  customer.login_history = [
    {
      id: `lgn_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
      timestamp: nowIso,
      device: deviceLabel,
      ip: ipLabel,
    },
    ...(customer.login_history || []),
  ].slice(0, 15);

  await saveCustomerDb(db);

  const platformDb = await readPlatformDb();
  if (claimUnownedRecordsForCustomer(platformDb, customer)) {
    await writePlatformDb(platformDb);
  }

  const { password_hash, ...safeCustomer } = customer;
  return {
    success: true,
    token,
    customer: safeCustomer,
    dashboard: customer.dashboard,
    message: 'Signed in successfully.',
    status: 200,
  };
}

export async function phpAuthRegister(
  payload: {
    name?: string;
    email?: string;
    password?: string;
    company?: string;
    role?: string;
    phone?: string;
  },
  meta?: { userAgent?: string; ip?: string },
) {
  const name = (payload.name || '').trim();
  const email = (payload.email || '').toLowerCase().trim();
  const password = payload.password || '';
  const company = (payload.company || '').trim();
  const role = (payload.role || '').trim();
  const phone = (payload.phone || '').trim();

  if (!name || !email || !email.includes('@') || password.length < 6) {
    return {
      success: false,
      message: 'Please provide your full name, a valid email address, and a password of at least 6 characters.',
      status: 400,
    };
  }

  const db = await ensureCustomerDb();
  if (db.customers.some((c) => c.email.toLowerCase() === email)) {
    return {
      success: false,
      message: 'An account with this email address already exists. Please sign in to access your dashboard.',
      status: 409,
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const customerId = `cust_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;
  const dashboardId = `dash_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const deviceLabel = summarizeUserAgent(meta?.userAgent);
  const ipLabel = meta?.ip || 'Verified Client Network';

  const newCustomer: CustomerRecord = {
    id: customerId,
    name,
    email,
    password_hash: passwordHash,
    company,
    role,
    phone,
    balance_usd: 0,
    units_balance: 0,
    created_at: nowIso,
    password_updated_at: nowIso,
    two_factor_enabled: false,
    dashboard: {
      id: dashboardId,
      user_id: customerId,
      created_at: nowIso,
      last_accessed_at: nowIso,
      initialized: true,
    },
    address: {
      street: '',
      city: '',
      state: 'CA',
      zip: '',
      country: 'United States',
    },
    preferences: buildDefaultPreferences(),
    driver_info: {
      primaryDriver: name,
      licenseNumber: '',
      issuingState: 'CA',
    },
    login_history: [
      {
        id: `lgn_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
        timestamp: nowIso,
        device: deviceLabel,
        ip: ipLabel,
      },
    ],
    purchases: [],
    transactions: [],
    wishlist: [],
  };

  db.customers.push(newCustomer);

  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = {
    customer_id: customerId,
    created_at: nowIso,
    last_active_at: nowIso,
    expires_at: new Date(now.getTime() + 7 * 86400000).toISOString(),
    user_agent: deviceLabel,
    ip: ipLabel,
  };

  await saveCustomerDb(db);

  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, newCustomer);

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId,
    recipientEmail: email,
    title: 'Welcome to Your Personal Dashboard',
    message: `Hello ${name}, your personal Easy Travel Lodging account (${customerId}) is active. You can book residences, reserve fleet vehicles, and manage invoices directly from your dashboard.`,
    category: 'system',
    read: false,
    createdAt: nowIso,
  });
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    actorEmail: email,
    action: 'CLIENT_ACCOUNT_REGISTERED',
    targetId: customerId,
    details: `Registered new user ${name} (${email}) and initialised personal dashboard ${dashboardId}.`,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  const { password_hash, ...safeCustomer } = newCustomer;
  return {
    success: true,
    token,
    customer: safeCustomer,
    dashboard: newCustomer.dashboard,
    message: 'Account registered and personal dashboard created.',
    status: 201,
  };
}

export async function phpAuthLogout(token: string) {
  if (!token) {
    return { success: true, message: 'Signed out.', status: 200 };
  }
  const db = await ensureCustomerDb();
  if (db.sessions[token]) {
    delete db.sessions[token];
    await saveCustomerDb(db);
  }
  return { success: true, message: 'Session terminated successfully.', status: 200 };
}

export async function phpAuthVerify(token: string) {
  if (!token) return { success: false, message: 'Session token required.', status: 401 };
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) {
    await saveCustomerDb(db);
    return { success: false, message: 'Session expired or invalid.', status: 401 };
  }

  ensureIndividualDashboard(resolved.customer, false);
  const { password_hash, ...safeCustomer } = resolved.customer;
  return {
    success: true,
    customer: safeCustomer,
    dashboard: resolved.customer.dashboard,
    status: 200,
  };
}

export async function phpDashboardGet(token: string) {
  if (!token) {
    return { success: false, message: 'Unauthorized - Valid session token required.', status: 401 };
  }

  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) {
    await saveCustomerDb(db);
    return { success: false, message: 'Unauthorized - Session expired or invalid.', status: 401 };
  }

  const { customer, session } = resolved;
  const nowIso = new Date().toISOString();
  ensureIndividualDashboard(customer, true);
  session.last_active_at = nowIso;
  await saveCustomerDb(db);

  const platformDb = await readPlatformDb();
  if (claimUnownedRecordsForCustomer(platformDb, customer)) {
    await writePlatformDb(platformDb);
  }

  // Strictly isolate records by customerId ownership
  const customerBookings = platformDb.bookings
    .filter((b) => b.customerId === customer.id)
    .map((b) => {
      const prop = platformDb.properties.find((p) => p.id === b.propertyId);
      return {
        ...b,
        propertyTitle: prop?.title || `Residence ${b.propertyId}`,
        unitNumber: prop?.unitNumber || b.propertyId.toUpperCase(),
        location: prop?.location || 'Rancho Cordova, CA',
        image: prop?.images?.[0] || 'https://easytravellodging.com/wp-content/plugins/vikbooking/site/resources/uploads/big_cc-91-1.jpg',
        floor: prop?.floor || 'Downstairs',
        bedrooms: prop?.bedrooms ?? 1,
        bathrooms: prop?.bathrooms ?? 1,
      };
    });

  const customerVehicleBookings = platformDb.vehicleBookings
    .filter((vb) => vb.customerId === customer.id)
    .map((vb) => {
      const veh = platformDb.vehicles.find((v) => v.id === vb.vehicleId);
      return {
        ...vb,
        year: veh?.year || 2021,
        category: veh?.category || 'Executive Fleet Vehicle',
        image:
          VEHICLE_THUMBNAILS[vb.vehicleId] ||
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
      };
    });

  const customerManualPayments = platformDb.manualPayments.filter(
    (mp) => mp.customerId === customer.id,
  );

  const customerOrders = (platformDb.orders || []).filter(
    (o) => o.customerId === customer.id,
  );

  const ownedBookingIds = new Set(customerBookings.map((b) => b.id));
  const ownedVehicleIds = new Set(customerVehicleBookings.map((v) => v.id));
  const ownedOrderRefs = new Set(customerOrders.map((o) => o.orderReference));
  const ownedPurchaseIds = new Set((customer.purchases || []).map((p) => p.id));

  const customerPayments = platformDb.payments.filter(
    (p) =>
      p.customerId === customer.id ||
      ownedBookingIds.has(p.bookingId) ||
      ownedVehicleIds.has(p.bookingId) ||
      ownedOrderRefs.has(p.bookingId) ||
      ownedPurchaseIds.has(p.bookingId),
  );

  const customerNotifications = platformDb.notifications.filter(
    (n) => n.customerId === customer.id,
  );

  const customerSupportTickets = (platformDb.supportTickets || []).filter(
    (t) => t.customerId === customer.id,
  );

  const activeSessions = Object.entries(db.sessions)
    .filter(([, s]) => s.customer_id === customer.id)
    .map(([tokKey, s]) => ({
      id: `sess_${tokKey.slice(0, 8)}`,
      isCurrent: tokKey === token.trim(),
      device: s.user_agent || 'Web Browser',
      ip: s.ip || 'Verified Client Network',
      createdAt: s.created_at,
      lastActiveAt: s.last_active_at || s.created_at,
      expiresAt: s.expires_at,
    }));

  const { password_hash, ...safeCustomer } = customer;
  return {
    success: true,
    customer: safeCustomer,
    dashboard: customer.dashboard,
    bookings: customerBookings,
    vehicleBookings: customerVehicleBookings,
    manualPayments: customerManualPayments,
    payments: customerPayments,
    orders: customerOrders,
    notifications: customerNotifications,
    supportTickets: customerSupportTickets,
    paymentAccounts: platformDb.paymentAccounts,
    activeSessions,
    loginHistory: customer.login_history || [],
    purchases: [...(customer.purchases || [])].reverse(),
    transactions: [...(customer.transactions || [])].reverse(),
    wishlist: customer.wishlist || [],
    units_balance: customer.units_balance || 0,
    balance_usd: customer.balance_usd || 0,
    status: 200,
  };
}

export async function getCustomerWishlist(token: string) {
  if (!token) {
    return { success: false, message: 'Sign in required to access your wishlist.', status: 401 };
  }
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) {
    await saveCustomerDb(db);
    return { success: false, message: 'Session expired. Please sign in again.', status: 401 };
  }
  ensureIndividualDashboard(resolved.customer, false);
  return {
    success: true,
    wishlist: resolved.customer.wishlist || [],
    status: 200,
  };
}

export async function toggleCustomerWishlist(token: string, propertyId: string) {
  if (!token) {
    return { success: false, message: 'Please sign in to save properties to your wishlist.', status: 401 };
  }
  const propId = (propertyId || '').trim();
  if (!propId) {
    return { success: false, message: 'Property ID is required.', status: 400 };
  }

  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) {
    await saveCustomerDb(db);
    return { success: false, message: 'Session expired. Please sign in again.', status: 401 };
  }

  const { customer } = resolved;
  ensureIndividualDashboard(customer, false);

  const platformDb = await readPlatformDb();
  const prop = platformDb.properties.find((p) => p.id === propId);
  if (!prop) {
    return { success: false, message: 'Property not found.', status: 404 };
  }

  const current = new Set(customer.wishlist || []);
  let saved = false;
  if (current.has(propId)) {
    current.delete(propId);
    saved = false;
  } else {
    current.add(propId);
    saved = true;
  }
  customer.wishlist = Array.from(current);
  await saveCustomerDb(db);

  return {
    success: true,
    saved,
    propertyId: propId,
    wishlist: customer.wishlist,
    message: saved
      ? `${prop.unitNumber} saved to your personal wishlist.`
      : `${prop.unitNumber} removed from your wishlist.`,
    status: 200,
  };
}

export async function phpDashboardBuyUnits(
  token: string,
  units: number,
  packageType = 'Standard Unit Credit Pack',
  paymentMethod = 'Corporate Credit Facility',
) {
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) return { success: false, message: 'Unauthorized', status: 401 };
  if (units <= 0) return { success: false, message: 'Units must be greater than 0', status: 400 };

  const { customer } = resolved;
  const costPerUnit = Number(process.env.UNIT_PRICE_USD || 100.0);
  const totalCost = units * costPerUnit;
  const nowIso = new Date().toISOString();

  const purchaseRecord: CustomerPurchase = {
    id: `pch_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    description: `Purchased ${units} Lodging Units (${packageType})`,
    unit_number: 'Flex Unit Credits',
    units_purchased: units,
    amount_usd: totalCost,
    status: 'active',
    purchased_at: nowIso,
    payment_method: paymentMethod,
  };

  const transactionRecord: CustomerTransaction = {
    id: `tx_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    type: 'unit_purchase',
    units,
    amount_usd: totalCost,
    description: `Purchased ${units} Units via ${paymentMethod}`,
    date: nowIso,
    status: 'completed',
  };

  customer.units_balance = (customer.units_balance || 0) + units;
  customer.balance_usd = (customer.balance_usd || 0) + totalCost;
  customer.purchases.push(purchaseRecord);
  customer.transactions.push(transactionRecord);

  await saveCustomerDb(db);

  const platformDb = await readPlatformDb();
  platformDb.payments.push({
    id: `pay_${Date.now()}`,
    customerId: customer.id,
    bookingId: purchaseRecord.id,
    amount: totalCost,
    currency: 'USD',
    status: 'succeeded',
    provider: 'manual',
    reference: purchaseRecord.id,
    createdAt: nowIso,
  });
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: customer.email,
    action: 'UNIT_PACKAGE_PURCHASED',
    targetId: purchaseRecord.id,
    details: `${customer.name} purchased ${units} units ($${totalCost.toLocaleString()}) via ${paymentMethod}.`,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  return {
    success: true,
    message: `Purchased ${units} units. Balance updated to ${customer.units_balance} Units.`,
    purchase: purchaseRecord,
    new_units_balance: customer.units_balance,
    new_balance_usd: customer.balance_usd,
    status: 200,
  };
}

export async function phpCheckoutPayFromBalance(
  token: string,
  bookingId: string,
  unitsRequired: number,
  commandCode = 'INTERNAL_EXEC_PAY_FROM_BALANCE',
) {
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) {
    return {
      success: false,
      message: 'Unauthorized: Valid session token required.',
      status: 401,
    };
  }

  const { customer } = resolved;
  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, customer);

  const housingBooking = platformDb.bookings.find(
    (b) => (b.id === bookingId || b.propertyId === bookingId) && b.customerId === customer.id,
  );
  const vehicleBooking = platformDb.vehicleBookings.find(
    (vb) => vb.id === bookingId && vb.customerId === customer.id,
  );

  if (bookingId && !housingBooking && !vehicleBooking) {
    return {
      success: false,
      message: 'Reservation not found on your account.',
      status: 404,
    };
  }

  let computedUnits = unitsRequired;
  if (computedUnits <= 0) {
    if (housingBooking?.unitCostUnits) computedUnits = housingBooking.unitCostUnits;
    else if (vehicleBooking?.unitsRequired) computedUnits = vehicleBooking.unitsRequired;
    else computedUnits = 25;
  }

  const currentUnits = customer.units_balance || 0;
  if (currentUnits < computedUnits) {
    return {
      success: false,
      message: `Insufficient unit balance. You have ${currentUnits} units available, and ${computedUnits} units are required for this settlement.`,
      current_units: currentUnits,
      required_units: computedUnits,
      status: 400,
    };
  }

  const newUnits = currentUnits - computedUnits;
  const amountUsdDeducted = computedUnits * 100.0;
  const newBalanceUsd = Math.max(0, (customer.balance_usd || 0) - amountUsdDeducted);

  customer.units_balance = newUnits;
  customer.balance_usd = newBalanceUsd;

  const txId = `tx_pay_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;
  const nowIso = new Date().toISOString();

  const targetLabel = vehicleBooking
    ? `Car Rental ${vehicleBooking.id} (${vehicleBooking.vehicleName})`
    : housingBooking
    ? `Stay ${housingBooking.id} (${housingBooking.propertyId.toUpperCase()})`
    : `Booking ${bookingId || 'Direct'}`;

  const settlementTx: CustomerTransaction = {
    id: txId,
    type: 'balance_settlement',
    units: -computedUnits,
    amount_usd: -amountUsdDeducted,
    booking_id: bookingId || 'Direct_Unit_Settlement',
    description: `Settled ${targetLabel} using ${computedUnits} account units`,
    command_code: commandCode,
    date: nowIso,
    status: 'settled',
  };

  customer.transactions.push(settlementTx);
  await saveCustomerDb(db);

  if (housingBooking) {
    housingBooking.status = 'confirmed';
    housingBooking.paymentProvider = 'unit_balance';
    housingBooking.paymentReference = txId;
    housingBooking.notes = `${housingBooking.notes ? housingBooking.notes + ' | ' : ''}[Settled with ${computedUnits} units from ${customer.name} balance]`;
  }

  if (vehicleBooking) {
    vehicleBooking.status = 'confirmed';
    vehicleBooking.paymentMethod = 'unit_balance';
    vehicleBooking.paymentReference = txId;
    vehicleBooking.notes = `${vehicleBooking.notes ? vehicleBooking.notes + ' | ' : ''}[Settled with ${computedUnits} units from ${customer.name} balance]`;
  }

  platformDb.payments.push({
    id: `pay_${Date.now()}`,
    customerId: customer.id,
    bookingId: bookingId || txId,
    amount: amountUsdDeducted,
    currency: 'USD',
    status: 'succeeded',
    provider: 'unit_balance',
    reference: txId,
    createdAt: nowIso,
  });

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: `Balance Settlement Confirmed (${txId})`,
    message: `${computedUnits} Units ($${amountUsdDeducted.toLocaleString()}) applied to ${targetLabel}. Remaining balance: ${newUnits} Units.`,
    category: 'units',
    read: false,
    createdAt: nowIso,
  });

  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: customer.email.toLowerCase(),
    action: 'UNIT_BALANCE_SETTLEMENT',
    targetId: bookingId || txId,
    details: `${customer.name} settled ${targetLabel} with ${computedUnits} units ($${amountUsdDeducted.toLocaleString()}).`,
    createdAt: nowIso,
  });

  await writePlatformDb(platformDb);

  return {
    success: true,
    message: `Settlement executed: ${computedUnits} units deducted to confirm ${targetLabel}.`,
    internal_command: commandCode,
    booking_id: bookingId,
    units_deducted: computedUnits,
    amount_usd_deducted: amountUsdDeducted,
    remaining_units: newUnits,
    remaining_balance_usd: newBalanceUsd,
    transaction: settlementTx,
    booking: housingBooking || vehicleBooking || null,
    timestamp: nowIso,
    status: 200,
  };
}

export async function phpSubmitManualPayment(
  token: string,
  payload: {
    targetType?: 'units' | 'housing_booking' | 'vehicle_booking' | 'order';
    targetId?: string;
    unitsRequested?: number;
    amountUsd?: number;
    paymentMethod?: 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate';
    senderName?: string;
    originatingBank?: string;
    wireReference?: string;
    transferDate?: string;
    receiptFileName?: string;
    receiptDataUrl?: string;
    notes?: string;
  },
) {
  const customer = await getCustomerByToken(token);
  if (!customer) {
    return { success: false, message: 'Unauthorized session token.', status: 401 };
  }

  const amountUsd = Number(payload.amountUsd || 0);
  if (amountUsd <= 0) {
    return { success: false, message: 'Please enter a valid USD transfer amount.', status: 400 };
  }
  if (!payload.senderName?.trim() || !payload.wireReference?.trim()) {
    return {
      success: false,
      message: 'Sender account name and wire/ACH reference number are required.',
      status: 400,
    };
  }

  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, customer);

  // Enforce ownership if targeting a specific reservation or order
  if (payload.targetId) {
    if (payload.targetType === 'housing_booking') {
      const bk = platformDb.bookings.find((b) => b.id === payload.targetId);
      if (!bk || bk.customerId !== customer.id) {
        return { success: false, message: 'Target accommodation booking not found on your account.', status: 403 };
      }
    } else if (payload.targetType === 'vehicle_booking') {
      const vbk = platformDb.vehicleBookings.find((v) => v.id === payload.targetId);
      if (!vbk || vbk.customerId !== customer.id) {
        return { success: false, message: 'Target vehicle reservation not found on your account.', status: 403 };
      }
    } else if (payload.targetType === 'order') {
      const ord = (platformDb.orders || []).find(
        (o) => o.id === payload.targetId || o.orderReference === payload.targetId,
      );
      if (!ord || ord.customerId !== customer.id) {
        return { success: false, message: 'Target order not found on your account.', status: 403 };
      }
    }
  }

  const unitsRequested =
    payload.unitsRequested && payload.unitsRequested > 0
      ? Number(payload.unitsRequested)
      : Math.max(1, Math.round(amountUsd / 100));

  const nowIso = new Date().toISOString();
  const refCode = `ETL-WIRE-${Math.floor(1000 + Math.random() * 9000)}`;

  const record: ManualPaymentRecord = {
    id: `mpay_${Date.now().toString().slice(-6)}`,
    referenceCode: refCode,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    targetType: payload.targetType || 'units',
    targetId: payload.targetId || undefined,
    unitsRequested,
    amountUsd,
    paymentMethod: payload.paymentMethod || 'Wire Transfer',
    senderName: payload.senderName.trim(),
    originatingBank: (payload.originatingBank || 'Client Financial Institution').trim(),
    wireReference: payload.wireReference.trim(),
    transferDate: payload.transferDate || nowIso.split('T')[0],
    receiptFileName: payload.receiptFileName || undefined,
    receiptDataUrl: payload.receiptDataUrl || undefined,
    notes: payload.notes?.trim() || undefined,
    status: 'pending_verification',
    createdAt: nowIso,
  };

  platformDb.manualPayments.unshift(record);
  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: `Transfer Notice Submitted (${refCode})`,
    message: `Your $${amountUsd.toLocaleString()} ${record.paymentMethod} notice (${record.wireReference}) is queued for treasury verification.`,
    category: 'payment',
    read: false,
    createdAt: nowIso,
  });
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: customer.email.toLowerCase(),
    action: 'MANUAL_PAYMENT_SUBMITTED',
    targetId: record.id,
    details: `${customer.name} submitted $${amountUsd.toLocaleString()} ${record.paymentMethod} (${record.wireReference}) for ${record.targetType}.`,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  return {
    success: true,
    message: `Transfer notice ${refCode} submitted for verification. Balance or booking confirmation will post upon bank clearance.`,
    manualPayment: record,
    status: 201,
  };
}

export async function phpUpdateCustomerProfile(
  token: string,
  updates: {
    name?: string;
    company?: string;
    role?: string;
    phone?: string;
    address?: Partial<CustomerAddress>;
    preferences?: Partial<CustomerPreferences>;
    driver_info?: Partial<CustomerDriverInfo>;
  },
) {
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) return { success: false, message: 'Unauthorized', status: 401 };

  const { customer } = resolved;
  ensureIndividualDashboard(customer, false);

  if (typeof updates.name === 'string' && updates.name.trim()) {
    customer.name = updates.name.trim();
  }
  if (typeof updates.company === 'string') {
    customer.company = updates.company.trim();
  }
  if (typeof updates.role === 'string') {
    customer.role = updates.role.trim();
  }
  if (typeof updates.phone === 'string') {
    customer.phone = updates.phone.trim();
  }
  if (updates.address && typeof updates.address === 'object') {
    customer.address = {
      street: updates.address.street ?? customer.address?.street ?? '',
      city: updates.address.city ?? customer.address?.city ?? '',
      state: updates.address.state ?? customer.address?.state ?? 'CA',
      zip: updates.address.zip ?? customer.address?.zip ?? '',
      country: updates.address.country ?? customer.address?.country ?? 'United States',
    };
  }
  if (updates.preferences && typeof updates.preferences === 'object') {
    const currentPrefs = customer.preferences || buildDefaultPreferences();
    customer.preferences = {
      ...currentPrefs,
      ...updates.preferences,
    };
  }
  if (updates.driver_info && typeof updates.driver_info === 'object') {
    customer.driver_info = {
      primaryDriver: updates.driver_info.primaryDriver ?? customer.driver_info?.primaryDriver ?? customer.name,
      licenseNumber: updates.driver_info.licenseNumber ?? customer.driver_info?.licenseNumber ?? '',
      issuingState: updates.driver_info.issuingState ?? customer.driver_info?.issuingState ?? 'CA',
    };
  }

  await saveCustomerDb(db);
  const { password_hash, ...safe } = customer;
  return { success: true, customer: safe, message: 'Account profile saved.', status: 200 };
}

export async function customerChangePassword(
  token: string,
  currentPassword?: string,
  newPassword?: string,
) {
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) return { success: false, message: 'Unauthorized', status: 401 };

  if (!currentPassword || !newPassword) {
    return { success: false, message: 'Current password and new password are required.', status: 400 };
  }
  if (newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.', status: 400 };
  }

  const { customer } = resolved;
  const normalizedHash = customer.password_hash.replace(/^\$2y\$/, '$2a$');
  const isCurrentValid = bcrypt.compareSync(currentPassword, normalizedHash);
  if (!isCurrentValid) {
    return { success: false, message: 'Your current password is incorrect.', status: 400 };
  }

  const nowIso = new Date().toISOString();
  customer.password_hash = bcrypt.hashSync(newPassword, 10);
  customer.password_updated_at = nowIso;
  await saveCustomerDb(db);

  const platformDb = await readPlatformDb();
  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: 'Account Password Updated',
    message: 'Your account password was changed from your personal security settings.',
    category: 'system',
    read: false,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  return {
    success: true,
    password_updated_at: nowIso,
    message: 'Password updated successfully.',
    status: 200,
  };
}

export async function customerToggleTwoFactor(token: string, enabled: boolean) {
  const db = await ensureCustomerDb();
  const resolved = resolveAuthenticatedCustomer(db, token);
  if (!resolved) return { success: false, message: 'Unauthorized', status: 401 };

  const { customer } = resolved;
  customer.two_factor_enabled = Boolean(enabled);
  await saveCustomerDb(db);

  const { password_hash, ...safe } = customer;
  return {
    success: true,
    two_factor_enabled: customer.two_factor_enabled,
    customer: safe,
    message: customer.two_factor_enabled
      ? 'Two-factor authentication enabled for your account.'
      : 'Two-factor authentication disabled.',
    status: 200,
  };
}

export async function customerUpdateHousingBooking(
  token: string,
  bookingId: string,
  updates: {
    action?: 'modify' | 'cancel';
    checkIn?: string;
    checkOut?: string;
    specialRequests?: string;
    notes?: string;
  },
) {
  const customer = await getCustomerByToken(token);
  if (!customer) return { success: false, message: 'Unauthorized', status: 401 };

  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, customer);

  const booking = platformDb.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return { success: false, message: 'Accommodation booking not found.', status: 404 };
  }
  if (booking.customerId !== customer.id) {
    return {
      success: false,
      message: 'Forbidden: You do not have permission to modify another user’s booking.',
      status: 403,
    };
  }

  const nowIso = new Date().toISOString();

  if (updates.action === 'cancel') {
    if (booking.status === 'cancelled') {
      return { success: false, message: 'This booking is already cancelled.', status: 400 };
    }
    booking.status = 'cancelled';
    platformDb.notifications.unshift({
      id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
      customerId: customer.id,
      recipientEmail: customer.email.toLowerCase(),
      title: `Stay Cancelled (${booking.id})`,
      message: `Your reservation ${booking.id} (${booking.checkIn} to ${booking.checkOut}) has been cancelled.`,
      category: 'booking',
      read: false,
      createdAt: nowIso,
    });
    platformDb.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorEmail: customer.email.toLowerCase(),
      action: 'CUSTOMER_BOOKING_CANCELLED',
      targetId: booking.id,
      details: `${customer.name} cancelled accommodation booking ${booking.id}.`,
      createdAt: nowIso,
    });
    await writePlatformDb(platformDb);
    return { success: true, booking, message: `Reservation ${booking.id} cancelled.`, status: 200 };
  }

  const nextCheckIn = updates.checkIn || booking.checkIn;
  const nextCheckOut = updates.checkOut || booking.checkOut;
  const start = new Date(nextCheckIn);
  const end = new Date(nextCheckOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { success: false, message: 'Check-out date must be after check-in date.', status: 400 };
  }

  const prop = platformDb.properties.find((p) => p.id === booking.propertyId);
  const overlap = findOverlappingPropertyRange(
    platformDb,
    booking.propertyId,
    nextCheckIn,
    nextCheckOut,
    booking.id,
  );
  if (overlap) {
    return {
      success: false,
      message: `Requested dates conflict with unavailable dates (${overlap.start} through ${overlap.end}).`,
      status: 400,
    };
  }

  const quote = calculatePropertyStayQuote(platformDb, {
    propertyId: booking.propertyId,
    checkIn: nextCheckIn,
    checkOut: nextCheckOut,
    adults: booking.adults,
    children: booking.children,
    infants: booking.infants,
    selectedAddons: booking.selectedAddons?.map((a) => ({ serviceId: a.serviceId, quantity: a.quantity })),
    excludeBookingId: booking.id,
  });

  if (!quote.available) {
    return {
      success: false,
      message: quote.reason || 'Unable to update reservation to those dates.',
      status: 400,
    };
  }

  const nights = quote.nights;
  const estimatedUsd = quote.totalUsd;
  const estimatedUnits = quote.unitsRequired;

  booking.checkIn = nextCheckIn;
  booking.checkOut = nextCheckOut;
  booking.totalNights = nights;
  booking.accommodationSubtotalUsd = quote.accommodationSubtotalUsd;
  booking.taxUsd = quote.taxUsd;
  booking.totalUsd = estimatedUsd;
  booking.unitCostUsd = estimatedUsd;
  booking.unitCostUnits = estimatedUnits;
  if (updates.specialRequests !== undefined) booking.specialRequests = updates.specialRequests.trim();
  if (updates.notes !== undefined) booking.notes = updates.notes.trim();

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: `Stay Dates Updated (${booking.id})`,
    message: `Your reservation ${booking.id} is updated to ${booking.checkIn} → ${booking.checkOut} (${nights} nights).`,
    category: 'booking',
    read: false,
    createdAt: nowIso,
  });
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: customer.email.toLowerCase(),
    action: 'CUSTOMER_BOOKING_MODIFIED',
    targetId: booking.id,
    details: `${customer.name} updated booking ${booking.id} dates to ${booking.checkIn} -> ${booking.checkOut}.`,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  return { success: true, booking, message: `Reservation ${booking.id} updated.`, status: 200 };
}

export async function customerUpdateVehicleBooking(
  token: string,
  rentalId: string,
  updates: {
    action?: 'modify' | 'cancel';
    pickupDate?: string;
    returnDate?: string;
    pickupLocation?: string;
    notes?: string;
  },
) {
  const customer = await getCustomerByToken(token);
  if (!customer) return { success: false, message: 'Unauthorized', status: 401 };

  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, customer);

  const rental = platformDb.vehicleBookings.find((vb) => vb.id === rentalId);
  if (!rental) {
    return { success: false, message: 'Vehicle reservation not found.', status: 404 };
  }
  if (rental.customerId !== customer.id) {
    return {
      success: false,
      message: 'Forbidden: You do not have permission to modify another user’s vehicle reservation.',
      status: 403,
    };
  }

  const nowIso = new Date().toISOString();

  if (updates.action === 'cancel') {
    if (rental.status === 'cancelled') {
      return { success: false, message: 'This vehicle reservation is already cancelled.', status: 400 };
    }
    rental.status = 'cancelled';
    const veh = platformDb.vehicles.find((v) => v.id === rental.vehicleId);
    if (veh && veh.inventoryStatus === 'rented') {
      veh.inventoryStatus = 'available';
    }
    platformDb.notifications.unshift({
      id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
      customerId: customer.id,
      recipientEmail: customer.email.toLowerCase(),
      title: `Car Rental Cancelled (${rental.id})`,
      message: `Your reservation for ${rental.vehicleName} (${rental.pickupDate} → ${rental.returnDate}) has been cancelled.`,
      category: 'fleet',
      read: false,
      createdAt: nowIso,
    });
    platformDb.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actorEmail: customer.email.toLowerCase(),
      action: 'CUSTOMER_VEHICLE_BOOKING_CANCELLED',
      targetId: rental.id,
      details: `${customer.name} cancelled vehicle reservation ${rental.id}.`,
      createdAt: nowIso,
    });
    await writePlatformDb(platformDb);
    return { success: true, vehicleBooking: rental, message: `Vehicle reservation ${rental.id} cancelled.`, status: 200 };
  }

  const nextPickup = updates.pickupDate || rental.pickupDate;
  const nextReturn = updates.returnDate || rental.returnDate;
  const start = new Date(nextPickup);
  const end = new Date(nextReturn);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return { success: false, message: 'Return date must be after pickup date.', status: 400 };
  }

  const veh = platformDb.vehicles.find((v) => v.id === rental.vehicleId) || {
    dailyRate: 115,
    weeklyRate: 680,
    monthlyRate: 2250,
  };
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const pricing = calculateVehiclePricing(veh, totalDays, rental.protectionPlan);

  rental.pickupDate = nextPickup;
  rental.returnDate = nextReturn;
  rental.totalDays = totalDays;
  rental.rateTier = pricing.rateTier;
  rental.totalUsd = pricing.totalUsd;
  rental.unitsRequired = pricing.unitsRequired;
  if (updates.pickupLocation?.trim()) rental.pickupLocation = updates.pickupLocation.trim();
  if (updates.notes !== undefined) rental.notes = updates.notes.trim();

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: `Car Rental Updated (${rental.id})`,
    message: `Your ${rental.vehicleName} reservation is updated to ${rental.pickupDate} → ${rental.returnDate} (${totalDays} days).`,
    category: 'fleet',
    read: false,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  return { success: true, vehicleBooking: rental, message: `Vehicle reservation ${rental.id} updated.`, status: 200 };
}

export async function phpMarkNotificationsRead(token: string, notificationId?: string) {
  const customer = await getCustomerByToken(token);
  if (!customer) return { success: false, message: 'Unauthorized', status: 401 };

  const platformDb = await readPlatformDb();
  claimUnownedRecordsForCustomer(platformDb, customer);

  for (const n of platformDb.notifications) {
    if (n.customerId === customer.id) {
      if (!notificationId || n.id === notificationId) {
        n.read = true;
      }
    }
  }
  await writePlatformDb(platformDb);
  return { success: true, message: 'Notifications updated.', status: 200 };
}

export async function customerCreateSupportTicket(
  token: string,
  payload: {
    category?: string;
    priority?: 'normal' | 'urgent';
    subject?: string;
    message?: string;
  },
) {
  const customer = await getCustomerByToken(token);
  if (!customer) return { success: false, message: 'Unauthorized', status: 401 };

  const subject = (payload.subject || '').trim();
  const message = (payload.message || '').trim();
  if (!subject || !message) {
    return { success: false, message: 'Subject and message details are required.', status: 400 };
  }

  const nowIso = new Date().toISOString();
  const ticketNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticket: SupportTicketRecord = {
    id: `tkt_${Date.now().toString().slice(-6)}`,
    ticketNumber,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    category: (payload.category || 'Stay & Concierge Support').trim(),
    priority: payload.priority === 'urgent' ? 'urgent' : 'normal',
    subject,
    message,
    status: 'open',
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const platformDb = await readPlatformDb();
  if (!Array.isArray(platformDb.supportTickets)) {
    platformDb.supportTickets = [];
  }
  platformDb.supportTickets.unshift(ticket);

  platformDb.inquiries.unshift({
    id: `inq_${Date.now().toString().slice(-6)}`,
    customerId: customer.id,
    referenceCode: ticketNumber,
    type: 'contact',
    name: customer.name,
    email: customer.email,
    phone: customer.phone || undefined,
    company: customer.company || undefined,
    role: customer.role || undefined,
    message: `[${ticket.category} — ${ticket.priority.toUpperCase()}] ${subject}: ${message}`,
    status: 'new',
    createdAt: nowIso,
  });

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: `Support Ticket Logged (${ticketNumber})`,
    message: `We received "${subject}". Our Rancho Cordova concierge team will respond via ${customer.email}.`,
    category: 'system',
    read: false,
    createdAt: nowIso,
  });

  await writePlatformDb(platformDb);

  return {
    success: true,
    ticket,
    message: `Support request ${ticketNumber} submitted.`,
    status: 201,
  };
}

export async function adminVerifyManualPayment(
  paymentId: string,
  decision: 'verified' | 'rejected',
  adminNotes: string,
  actorEmail: string,
) {
  const platformDb = await readPlatformDb();
  const mpay = platformDb.manualPayments.find((m) => m.id === paymentId);
  if (!mpay) throw new Error('Manual payment record not found');
  if (mpay.status !== 'pending_verification') {
    throw new Error(`Payment is already marked as ${mpay.status}`);
  }

  const nowIso = new Date().toISOString();
  mpay.status = decision;
  mpay.adminNotes =
    adminNotes ||
    (decision === 'verified' ? 'Verified against bank wire ledger.' : 'Unable to match wire reference.');
  mpay.verifiedBy = actorEmail;
  mpay.verifiedAt = nowIso;

  const custDb = await ensureCustomerDb();
  const matchedCustomer = custDb.customers.find(
    (c) => c.id === mpay.customerId || c.email.toLowerCase() === mpay.customerEmail.toLowerCase(),
  );
  const resolvedCustomerId = mpay.customerId || matchedCustomer?.id;
  if (resolvedCustomerId && !mpay.customerId) {
    mpay.customerId = resolvedCustomerId;
  }

  if (decision === 'verified') {
    platformDb.payments.push({
      id: `pay_${Date.now()}`,
      customerId: resolvedCustomerId,
      bookingId: mpay.targetId || mpay.id,
      amount: mpay.amountUsd,
      currency: 'USD',
      status: 'succeeded',
      provider: 'manual',
      reference: mpay.wireReference,
      createdAt: nowIso,
    });

    if (mpay.targetType === 'units' && matchedCustomer) {
      matchedCustomer.units_balance = (matchedCustomer.units_balance || 0) + mpay.unitsRequested;
      matchedCustomer.balance_usd = (matchedCustomer.balance_usd || 0) + mpay.amountUsd;
      matchedCustomer.purchases.push({
        id: `pch_wire_${Date.now()}`,
        description: `Verified ${mpay.paymentMethod} (${mpay.referenceCode})`,
        unit_number: 'Verified Wire Credit',
        units_purchased: mpay.unitsRequested,
        amount_usd: mpay.amountUsd,
        status: 'active',
        purchased_at: nowIso,
        payment_method: mpay.paymentMethod,
      });
      matchedCustomer.transactions.push({
        id: `tx_wire_${Date.now()}`,
        type: 'wire_verified_credit',
        units: mpay.unitsRequested,
        amount_usd: mpay.amountUsd,
        description: `Treasury Verified ${mpay.paymentMethod} (${mpay.wireReference})`,
        date: nowIso,
        status: 'verified',
      });
      await saveCustomerDb(custDb);
    } else if (mpay.targetType === 'housing_booking' && mpay.targetId) {
      const bk = platformDb.bookings.find((b) => b.id === mpay.targetId);
      if (bk) {
        bk.status = 'confirmed';
        bk.paymentProvider = 'manual';
        bk.paymentReference = mpay.wireReference;
      }
    } else if (mpay.targetType === 'vehicle_booking' && mpay.targetId) {
      const vbk = platformDb.vehicleBookings.find((v) => v.id === mpay.targetId);
      if (vbk) {
        vbk.status = 'confirmed';
        vbk.paymentReference = mpay.wireReference;
      }
    } else if (mpay.targetType === 'order' && mpay.targetId) {
      const ord = (platformDb.orders || []).find(
        (o) => o.id === mpay.targetId || o.orderReference === mpay.targetId,
      );
      if (ord) {
        await fulfillVerifiedOrder(platformDb, ord, mpay.wireReference, actorEmail, mpay.paymentMethod);
      }
    }

    platformDb.notifications.unshift({
      id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
      customerId: resolvedCustomerId,
      recipientEmail: mpay.customerEmail.toLowerCase(),
      title: `Payment Verified (${mpay.referenceCode})`,
      message: `Your $${mpay.amountUsd.toLocaleString()} ${mpay.paymentMethod} has been verified and applied to your account.`,
      category: 'payment',
      read: false,
      createdAt: nowIso,
    });
  } else {
    if (mpay.targetType === 'order' && mpay.targetId) {
      const ord = (platformDb.orders || []).find(
        (o) => o.id === mpay.targetId || o.orderReference === mpay.targetId,
      );
      if (ord && ord.paymentStatus !== 'paid') {
        ord.paymentStatus = 'failed';
        ord.adminNotes = mpay.adminNotes;
        ord.updatedAt = nowIso;
      }
    }
    platformDb.notifications.unshift({
      id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
      customerId: resolvedCustomerId,
      recipientEmail: mpay.customerEmail.toLowerCase(),
      title: `Transfer Verification Update (${mpay.referenceCode})`,
      message: `Your ${mpay.paymentMethod} notice could not be verified: ${mpay.adminNotes}`,
      category: 'payment',
      read: false,
      createdAt: nowIso,
    });
  }

  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: decision === 'verified' ? 'MANUAL_PAYMENT_VERIFIED' : 'MANUAL_PAYMENT_REJECTED',
    targetId: mpay.id,
    details: `${decision.toUpperCase()} ${mpay.referenceCode} ($${mpay.amountUsd.toLocaleString()}) for ${mpay.customerName}. Note: ${mpay.adminNotes}`,
    createdAt: nowIso,
  });

  await writePlatformDb(platformDb);
  return mpay;
}

export async function adminAllocateCustomerUnits(
  customerId: string,
  unitsDelta: number,
  reason: string,
  actorEmail: string,
) {
  if (!unitsDelta || Number.isNaN(unitsDelta)) {
    throw new Error('Units adjustment must be a non-zero number');
  }

  const custDb = await ensureCustomerDb();
  const customer = custDb.customers.find((c) => c.id === customerId);
  if (!customer) throw new Error('Customer not found');

  const nextUnits = Math.max(0, (customer.units_balance || 0) + unitsDelta);
  const deltaUsd = unitsDelta * 100;
  const nextUsd = Math.max(0, (customer.balance_usd || 0) + deltaUsd);
  const nowIso = new Date().toISOString();

  customer.units_balance = nextUnits;
  customer.balance_usd = nextUsd;

  if (unitsDelta > 0) {
    customer.purchases.push({
      id: `pch_adm_${Date.now()}`,
      description: `Admin Unit Allocation: ${reason}`,
      unit_number: 'Executive Allotment',
      units_purchased: unitsDelta,
      amount_usd: deltaUsd,
      status: 'active',
      purchased_at: nowIso,
      payment_method: 'Admin Allocation',
    });
  }

  customer.transactions.push({
    id: `tx_adm_${Date.now()}`,
    type: unitsDelta > 0 ? 'admin_credit' : 'admin_debit',
    units: unitsDelta,
    amount_usd: deltaUsd,
    description: `Admin Adjustment: ${reason}`,
    date: nowIso,
    status: 'completed',
  });

  await saveCustomerDb(custDb);

  const platformDb = await readPlatformDb();
  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: customer.id,
    recipientEmail: customer.email.toLowerCase(),
    title: unitsDelta > 0 ? `+${unitsDelta} Lodging Units Credited` : `${unitsDelta} Lodging Units Adjusted`,
    message: `${reason} • Updated Balance: ${nextUnits} Units ($${nextUsd.toLocaleString()}).`,
    category: 'units',
    read: false,
    createdAt: nowIso,
  });
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'ADMIN_UNIT_ALLOCATION',
    targetId: customer.id,
    details: `Adjusted ${customer.name} by ${unitsDelta > 0 ? '+' : ''}${unitsDelta} units. Reason: ${reason}`,
    createdAt: nowIso,
  });
  await writePlatformDb(platformDb);

  const { password_hash, ...safe } = customer;
  return safe;
}

async function fulfillVerifiedOrder(
  platformDb: DatabaseState,
  order: OrderRecord,
  paymentRef: string,
  actorEmail: string,
  paymentMethodLabel: string,
) {
  const nowIso = new Date().toISOString();
  const wasAlreadyPaid = order.paymentStatus === 'paid';
  order.paymentStatus = 'paid';
  if (order.orderStatus === 'pending') {
    order.orderStatus = 'confirmed';
  }
  order.paymentReference = paymentRef || order.paymentReference || `VERIFIED-${Date.now()}`;
  order.verifiedBy = actorEmail;
  order.verifiedAt = nowIso;
  order.updatedAt = nowIso;

  for (const bkId of order.linkedBookingIds) {
    const bk = platformDb.bookings.find((b) => b.id === bkId);
    if (bk && bk.status === 'awaiting_payment') {
      bk.status = 'confirmed';
      bk.paymentReference = order.paymentReference;
    }
  }
  for (const vbkId of order.linkedVehicleBookingIds) {
    const vbk = platformDb.vehicleBookings.find((v) => v.id === vbkId);
    if (vbk && vbk.status === 'awaiting_payment') {
      vbk.status = 'confirmed';
      vbk.paymentReference = order.paymentReference;
    }
  }

  if (!wasAlreadyPaid) {
    const unitPackageItems = order.items.filter((i) => i.itemType === 'unit_package');
    const totalPurchasedUnits = unitPackageItems.reduce(
      (sum, i) => sum + (i.metadata?.unitsIncluded || Math.round(i.unitPriceUsd / 100)) * i.quantity,
      0,
    );

    if (totalPurchasedUnits > 0) {
      const custDb = await ensureCustomerDb();
      const customer = custDb.customers.find(
        (c) =>
          (order.customerId && c.id === order.customerId) ||
          c.email.toLowerCase() === order.customerEmail.toLowerCase(),
      );
      if (customer) {
        if (!order.customerId) order.customerId = customer.id;
        const creditUsd = totalPurchasedUnits * 100;
        customer.units_balance = (customer.units_balance || 0) + totalPurchasedUnits;
        customer.balance_usd = (customer.balance_usd || 0) + creditUsd;
        customer.purchases.push({
          id: `pch_ord_${Date.now()}`,
          description: `Order ${order.orderReference} (${totalPurchasedUnits} Lodging Units)`,
          unit_number: 'Storefront Unit Package',
          units_purchased: totalPurchasedUnits,
          amount_usd: creditUsd,
          status: 'active',
          purchased_at: nowIso,
          payment_method: paymentMethodLabel,
        });
        customer.transactions.push({
          id: `tx_ord_${Date.now()}`,
          type: 'order_unit_credit',
          units: totalPurchasedUnits,
          amount_usd: creditUsd,
          booking_id: order.orderReference,
          description: `Credited ${totalPurchasedUnits} Units from verified Order ${order.orderReference}`,
          date: nowIso,
          status: 'verified',
        });
        await saveCustomerDb(custDb);
      }
    }
  }
}

function mapPaymentMethodToManualLabel(
  method: OrderPaymentMethod,
): 'Wire Transfer' | 'Direct ACH' | 'Zelle Corporate' {
  if (method === 'direct_ach') return 'Direct ACH';
  if (method === 'zelle') return 'Zelle Corporate';
  return 'Wire Transfer';
}

function summarizeUserAgent(ua?: string): string {
  if (!ua) return 'Web Browser Session';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'Safari on iOS';
  if (ua.includes('Android')) return 'Chrome on Android';
  if (ua.includes('Mac OS X')) {
    if (ua.includes('Chrome')) return 'Chrome on macOS';
    if (ua.includes('Safari')) return 'Safari on macOS';
    return 'macOS Browser';
  }
  if (ua.includes('Windows')) {
    if (ua.includes('Edg')) return 'Edge on Windows';
    if (ua.includes('Chrome')) return 'Chrome on Windows';
    return 'Windows Browser';
  }
  if (ua.includes('Linux')) return 'Browser on Linux';
  return 'Web Browser Session';
}

export async function createCheckoutOrder(input: {
  cartId: string;
  customerToken?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  role?: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    zip?: string;
    postalCode: string;
    country?: string;
  };
  guestNotes?: string;
  paymentMethod: OrderPaymentMethod;
  transferDetails?: {
    senderName?: string;
    originatingBank?: string;
    wireReference?: string;
    transferDate?: string;
    receiptFileName?: string;
    receiptDataUrl?: string;
  };
}) {
  if (!input.cartId) throw new Error('Cart session ID is required.');
  if (!input.customerName?.trim() || !input.customerEmail?.trim() || !input.customerPhone?.trim()) {
    throw new Error('Full name, email address, and phone number are required to place an order.');
  }
  if (
    !input.billingAddress?.line1?.trim() ||
    !input.billingAddress?.city?.trim() ||
    !input.billingAddress?.state?.trim() ||
    !input.billingAddress?.postalCode?.trim()
  ) {
    throw new Error('Complete billing street address, city, state, and postal code are required.');
  }
  if (!['unit_balance', 'wire_transfer', 'direct_ach', 'zelle'].includes(input.paymentMethod)) {
    throw new Error('Please choose a valid payment method.');
  }

  const platformDb = await readPlatformDb();
  const rawCart = platformDb.carts[input.cartId];
  if (!rawCart || !Array.isArray(rawCart.items) || rawCart.items.length === 0) {
    throw new Error('Your cart is empty. Add at least one residence, vehicle, or service before checking out.');
  }

  const verifiedCart = recomputeCart(platformDb, rawCart);
  if (verifiedCart.items.some((i) => !i.available)) {
    throw new Error(
      verifiedCart.validationIssues[0] ||
        'One or more items in your cart are no longer available. Please review your cart before proceeding.',
    );
  }
  if (verifiedCart.totalUsd <= 0) {
    throw new Error('Invalid order total calculated.');
  }

  const hasUnitPackage = verifiedCart.items.some((i) => i.itemType === 'unit_package');
  if (input.paymentMethod === 'unit_balance' && hasUnitPackage) {
    throw new Error(
      'Prepaid Lodging Unit packages cannot be purchased using existing Unit Balance. Please select Wire Transfer, Direct ACH, or Corporate Zelle.',
    );
  }

  const nowIso = new Date().toISOString();
  const orderId = `ord_${Date.now().toString().slice(-6)}`;
  const orderReference = `ORD-ETL-${Math.floor(100000 + Math.random() * 900000)}`;

  let paymentStatus: OrderPaymentStatus = 'pending_payment';
  let orderStatus: OrderStatus = 'pending';
  let paymentReference: string | undefined;
  let verifiedBy: string | undefined;
  let verifiedAt: string | undefined;
  let matchedCustomerId: string | undefined;
  let manualPaymentRecord: ManualPaymentRecord | undefined;

  if (input.paymentMethod === 'unit_balance') {
    if (!input.customerToken) {
      throw new Error('Sign in to your account to pay with your Lodging Unit balance.');
    }
    const custDb = await ensureCustomerDb();
    const resolved = resolveAuthenticatedCustomer(custDb, input.customerToken);
    if (!resolved) {
      await saveCustomerDb(custDb);
      throw new Error('Your session has expired. Please sign in again to settle with Units.');
    }
    const { customer } = resolved;
    const currentUnits = customer.units_balance || 0;
    if (currentUnits < verifiedCart.totalUnitsRequired) {
      throw new Error(
        `Insufficient Lodging Unit balance: this order requires ${verifiedCart.totalUnitsRequired} Units ($${verifiedCart.totalUsd.toLocaleString()}), and your account currently holds ${currentUnits} Units.`,
      );
    }

    matchedCustomerId = customer.id;
    const newUnits = currentUnits - verifiedCart.totalUnitsRequired;
    const deductedUsd = verifiedCart.totalUnitsRequired * 100;
    customer.units_balance = newUnits;
    customer.balance_usd = Math.max(0, (customer.balance_usd || 0) - deductedUsd);

    const txId = `tx_ord_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;
    customer.transactions.push({
      id: txId,
      type: 'order_settlement',
      units: -verifiedCart.totalUnitsRequired,
      amount_usd: -deductedUsd,
      booking_id: orderReference,
      description: `Order ${orderReference} settled (${verifiedCart.items.length} item${
        verifiedCart.items.length === 1 ? '' : 's'
      })`,
      command_code: 'STOREFRONT_UNIT_CHECKOUT',
      date: nowIso,
      status: 'settled',
    });
    await saveCustomerDb(custDb);

    paymentStatus = 'paid';
    orderStatus = 'confirmed';
    paymentReference = txId;
    verifiedBy = 'Unit Balance Ledger';
    verifiedAt = nowIso;

    platformDb.payments.push({
      id: `pay_${Date.now()}`,
      customerId: matchedCustomerId,
      bookingId: orderReference,
      amount: verifiedCart.totalUsd,
      currency: 'USD',
      status: 'succeeded',
      provider: 'unit_balance',
      reference: txId,
      createdAt: nowIso,
    });
  } else {
    const custFromToken = await getCustomerByToken(input.customerToken);
    if (custFromToken) {
      matchedCustomerId = custFromToken.id;
    }

    const senderName = input.transferDetails?.senderName?.trim();
    const wireRef = input.transferDetails?.wireReference?.trim();

    if (senderName && wireRef) {
      paymentStatus = 'pending_verification';
      paymentReference = wireRef;
      const mpayRef = `ETL-WIRE-${Math.floor(1000 + Math.random() * 9000)}`;
      manualPaymentRecord = {
        id: `mpay_${Date.now().toString().slice(-6)}`,
        referenceCode: mpayRef,
        customerId: matchedCustomerId,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.trim().toLowerCase(),
        targetType: 'order',
        targetId: orderId,
        unitsRequested: verifiedCart.totalUnitsRequired,
        amountUsd: verifiedCart.totalUsd,
        paymentMethod: mapPaymentMethodToManualLabel(input.paymentMethod),
        senderName,
        originatingBank: input.transferDetails?.originatingBank?.trim() || 'Client Financial Institution',
        wireReference: wireRef,
        transferDate: input.transferDetails?.transferDate || nowIso.split('T')[0],
        receiptFileName: input.transferDetails?.receiptFileName || undefined,
        receiptDataUrl: input.transferDetails?.receiptDataUrl || undefined,
        notes: `Order ${orderReference} checkout remittance`,
        status: 'pending_verification',
        createdAt: nowIso,
      };
      platformDb.manualPayments.unshift(manualPaymentRecord);
    } else {
      paymentStatus = 'pending_payment';
    }
  }

  const linkedBookingIds: string[] = [];
  const linkedVehicleBookingIds: string[] = [];

  for (const item of verifiedCart.items) {
    if (item.itemType === 'accommodation') {
      const checkIn = item.metadata?.checkIn || nowIso.split('T')[0];
      const checkOut = item.metadata?.checkOut || checkIn;
      const overlap = findOverlappingPropertyRange(platformDb, item.referenceId, checkIn, checkOut);
      if (overlap) {
        throw new Error(
          `Residence dates (${checkIn} to ${checkOut}) are no longer available due to a conflicting reservation (${overlap.start}–${overlap.end}).`,
        );
      }
      const stayNights =
        item.metadata?.billingUnit === 'night' ? item.quantity : item.quantity * 30;
      const bk: BookingRecord = {
        id: `bk_${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`,
        customerId: matchedCustomerId,
        propertyId: item.referenceId,
        guestName: input.customerName.trim(),
        guestEmail: input.customerEmail.trim(),
        guestPhone: input.customerPhone.trim(),
        employer: input.company?.trim() || undefined,
        role: input.role?.trim() || undefined,
        checkIn,
        checkOut,
        adults: item.metadata?.adults || item.metadata?.guests || 1,
        children: item.metadata?.children || 0,
        infants: item.metadata?.infants || 0,
        status: paymentStatus === 'paid' ? 'confirmed' : 'awaiting_payment',
        notes: `Created via Order ${orderReference}${input.guestNotes ? ` • ${input.guestNotes.trim()}` : ''}`,
        totalNights: stayNights,
        unitCostUsd: item.lineSubtotalUsd,
        unitCostUnits: Math.max(1, Math.ceil(item.lineSubtotalUsd / 100)),
        createdAt: nowIso,
        paymentProvider: input.paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual',
        paymentReference,
      };
      platformDb.bookings.unshift(bk);
      linkedBookingIds.push(bk.id);
    } else if (item.itemType === 'vehicle') {
      const veh = platformDb.vehicles.find((v) => v.id === item.referenceId);
      const pickupDate = item.metadata?.pickupDate || nowIso.split('T')[0];
      const returnDate = item.metadata?.returnDate || pickupDate;
      const vbk: VehicleBookingRecord = {
        id: `vbk_${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`,
        customerId: matchedCustomerId,
        vehicleId: item.referenceId,
        vehicleName: veh ? veh.name : item.title,
        exteriorColorName: item.metadata?.exteriorColorName || 'Signature Finish',
        exteriorColorHex: item.metadata?.exteriorColorHex || '#1e40af',
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.trim(),
        customerPhone: input.customerPhone.trim(),
        employer: input.company?.trim() || undefined,
        pickupDate,
        returnDate,
        totalDays: item.quantity,
        pickupLocation:
          item.metadata?.pickupLocation || veh?.hubLocation || 'Rancho Cordova Suite Delivery Hub',
        protectionPlan:
          item.metadata?.protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard',
        rateTier: item.quantity >= 30 ? 'monthly' : item.quantity >= 7 ? 'weekly' : 'daily',
        totalUsd: item.lineSubtotalUsd,
        unitsRequired: Math.max(1, Math.ceil(item.lineSubtotalUsd / 100)),
        paymentMethod: input.paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual_wire',
        status: paymentStatus === 'paid' ? 'confirmed' : 'awaiting_payment',
        paymentReference,
        notes: `Created via Order ${orderReference}`,
        createdAt: nowIso,
      };
      platformDb.vehicleBookings.unshift(vbk);
      linkedVehicleBookingIds.push(vbk.id);
    }
  }

  if (verifiedCart.promoCode) {
    const promo = platformDb.promoCodes.find(
      (p) => p.code.toUpperCase() === verifiedCart.promoCode?.toUpperCase(),
    );
    if (promo) {
      promo.usageCount = (promo.usageCount || 0) + 1;
    }
  }

  const order: OrderRecord = {
    id: orderId,
    orderReference,
    cartId: verifiedCart.cartId,
    customerId: matchedCustomerId,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    company: input.company?.trim() || undefined,
    role: input.role?.trim() || undefined,
    billingAddress: {
      line1: input.billingAddress.line1.trim(),
      city: input.billingAddress.city.trim(),
      state: input.billingAddress.state.trim(),
      postalCode: input.billingAddress.postalCode.trim(),
      country: input.billingAddress.country?.trim() || 'United States',
    },
    guestNotes: input.guestNotes?.trim() || undefined,
    items: verifiedCart.items,
    promoCode: verifiedCart.promoCode,
    subtotalUsd: verifiedCart.subtotalUsd,
    serviceFeeUsd: verifiedCart.serviceFeeUsd,
    taxUsd: verifiedCart.taxUsd,
    discountUsd: verifiedCart.discountUsd,
    totalUsd: verifiedCart.totalUsd,
    totalUnitsRequired: verifiedCart.totalUnitsRequired,
    paymentMethod: input.paymentMethod,
    paymentStatus,
    orderStatus,
    paymentReference,
    manualPaymentId: manualPaymentRecord?.id,
    linkedBookingIds,
    linkedVehicleBookingIds,
    verifiedBy,
    verifiedAt,
    confirmationEmailSentAt: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  if (!Array.isArray(platformDb.orders)) {
    platformDb.orders = [];
  }
  platformDb.orders.unshift(order);

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: matchedCustomerId,
    recipientEmail: order.customerEmail,
    title:
      paymentStatus === 'paid'
        ? `Order Confirmed & Paid (${order.orderReference})`
        : paymentStatus === 'pending_verification'
        ? `Order Received — Payment Under Verification (${order.orderReference})`
        : `Order Invoice Created — Awaiting Transfer (${order.orderReference})`,
    message:
      paymentStatus === 'paid'
        ? `Thank you, ${order.customerName}. Your order of $${order.totalUsd.toLocaleString()} was verified via Unit Balance (${order.totalUnitsRequired} Units).`
        : paymentStatus === 'pending_verification'
        ? `We logged your order ($${order.totalUsd.toLocaleString()}) and transfer reference ${order.paymentReference}. Confirmation will issue once bank settlement is verified.`
        : `Your order ${order.orderReference} ($${order.totalUsd.toLocaleString()}) has been reserved pending Wire/ACH/Zelle remittance.`,
    category: 'payment',
    read: false,
    createdAt: nowIso,
  });

  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: order.customerEmail,
    action: 'ORDER_CREATED',
    targetId: order.orderReference,
    details: `Order ${order.orderReference} ($${order.totalUsd.toLocaleString()}) created via ${order.paymentMethod} [paymentStatus=${order.paymentStatus}].`,
    createdAt: nowIso,
  });

  platformDb.carts[verifiedCart.cartId] = {
    cartId: verifiedCart.cartId,
    items: [],
    subtotalUsd: 0,
    serviceFeeUsd: 0,
    taxUsd: 0,
    discountUsd: 0,
    totalUsd: 0,
    totalUnitsRequired: 0,
    itemCount: 0,
    validationIssues: [],
    updatedAt: nowIso,
  };

  await writePlatformDb(platformDb);

  return {
    order,
    manualPayment: manualPaymentRecord || null,
    paymentAccounts: platformDb.paymentAccounts,
  };
}

export async function submitOrderPaymentProof(
  orderRef: string,
  payload: {
    senderName: string;
    originatingBank?: string;
    wireReference: string;
    transferDate?: string;
    receiptFileName?: string;
    receiptDataUrl?: string;
    notes?: string;
  },
) {
  if (!payload.senderName?.trim() || !payload.wireReference?.trim()) {
    throw new Error('Sender name and bank/Zelle reference number are required.');
  }

  const platformDb = await readPlatformDb();
  const normalized = (orderRef || '').trim().toUpperCase();
  const order = (platformDb.orders || []).find(
    (o) => o.orderReference.toUpperCase() === normalized || o.id.toUpperCase() === normalized,
  );
  if (!order) throw new Error('Order not found.');
  if (order.paymentStatus === 'paid') {
    throw new Error('This order has already been verified and paid.');
  }

  const nowIso = new Date().toISOString();
  const mpayRef = `ETL-WIRE-${Math.floor(1000 + Math.random() * 9000)}`;
  const mpay: ManualPaymentRecord = {
    id: `mpay_${Date.now().toString().slice(-6)}`,
    referenceCode: mpayRef,
    customerId: order.customerId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    targetType: 'order',
    targetId: order.id,
    unitsRequested: order.totalUnitsRequired,
    amountUsd: order.totalUsd,
    paymentMethod: mapPaymentMethodToManualLabel(order.paymentMethod),
    senderName: payload.senderName.trim(),
    originatingBank: payload.originatingBank?.trim() || 'Client Financial Institution',
    wireReference: payload.wireReference.trim(),
    transferDate: payload.transferDate || nowIso.split('T')[0],
    receiptFileName: payload.receiptFileName || undefined,
    receiptDataUrl: payload.receiptDataUrl || undefined,
    notes: payload.notes?.trim() || `Submitted for Order ${order.orderReference}`,
    status: 'pending_verification',
    createdAt: nowIso,
  };

  platformDb.manualPayments.unshift(mpay);
  order.paymentStatus = 'pending_verification';
  order.paymentReference = payload.wireReference.trim();
  order.manualPaymentId = mpay.id;
  order.updatedAt = nowIso;

  platformDb.notifications.unshift({
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
    customerId: order.customerId,
    recipientEmail: order.customerEmail,
    title: `Transfer Proof Received (${order.orderReference})`,
    message: `Reference ${mpay.wireReference} ($${order.totalUsd.toLocaleString()}) is queued for treasury verification.`,
    category: 'payment',
    read: false,
    createdAt: nowIso,
  });

  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail: order.customerEmail,
    action: 'ORDER_PAYMENT_PROOF_SUBMITTED',
    targetId: order.orderReference,
    details: `Submitted remittance ${mpay.wireReference} (${mpay.referenceCode}) for Order ${order.orderReference}.`,
    createdAt: nowIso,
  });

  await writePlatformDb(platformDb);
  return { order, manualPayment: mpay };
}

export async function adminUpdateOrder(
  orderId: string,
  updates: {
    orderStatus?: OrderStatus;
    paymentStatus?: OrderPaymentStatus;
    paymentReference?: string;
    adminNotes?: string;
  },
  actorEmail: string,
) {
  const platformDb = await readPlatformDb();
  const order = (platformDb.orders || []).find((o) => o.id === orderId || o.orderReference === orderId);
  if (!order) throw new Error('Order not found');

  const nowIso = new Date().toISOString();
  const previousPaymentStatus = order.paymentStatus;

  if (updates.orderStatus) {
    order.orderStatus = updates.orderStatus;
  }
  if (updates.paymentReference !== undefined && updates.paymentReference.trim()) {
    order.paymentReference = updates.paymentReference.trim();
  }
  if (updates.adminNotes !== undefined) {
    order.adminNotes = updates.adminNotes;
  }

  if (updates.paymentStatus && updates.paymentStatus !== previousPaymentStatus) {
    if (updates.paymentStatus === 'paid') {
      await fulfillVerifiedOrder(
        platformDb,
        order,
        order.paymentReference || `ADMIN-VERIFIED-${Date.now()}`,
        actorEmail,
        mapPaymentMethodToManualLabel(order.paymentMethod),
      );
      if (order.manualPaymentId) {
        const linkedMpay = platformDb.manualPayments.find((m) => m.id === order.manualPaymentId);
        if (linkedMpay && linkedMpay.status === 'pending_verification') {
          linkedMpay.status = 'verified';
          linkedMpay.verifiedBy = actorEmail;
          linkedMpay.verifiedAt = nowIso;
          linkedMpay.adminNotes = updates.adminNotes || 'Verified via Order Administration.';
        }
      }
      platformDb.payments.push({
        id: `pay_${Date.now()}`,
        customerId: order.customerId,
        bookingId: order.orderReference,
        amount: order.totalUsd,
        currency: 'USD',
        status: 'succeeded',
        provider: order.paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual',
        reference: order.paymentReference,
        createdAt: nowIso,
      });
      platformDb.notifications.unshift({
        id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
        customerId: order.customerId,
        recipientEmail: order.customerEmail,
        title: `Payment Verified & Order Confirmed (${order.orderReference})`,
        message: `Your payment of $${order.totalUsd.toLocaleString()} for Order ${order.orderReference} has been verified. Your reservations and services are confirmed.`,
        category: 'payment',
        read: false,
        createdAt: nowIso,
      });
    } else {
      order.paymentStatus = updates.paymentStatus;
      if (updates.paymentStatus === 'cancelled' || updates.paymentStatus === 'refunded') {
        order.orderStatus = 'cancelled';
      }
      platformDb.notifications.unshift({
        id: `ntf_${Date.now()}_${Math.floor(Math.random() * 90 + 10)}`,
        customerId: order.customerId,
        recipientEmail: order.customerEmail,
        title: `Order Payment Status Updated (${order.orderReference})`,
        message: `Order ${order.orderReference} payment status is now "${order.paymentStatus.replace(/_/g, ' ')}"${
          order.adminNotes ? `: ${order.adminNotes}` : '.'
        }`,
        category: 'payment',
        read: false,
        createdAt: nowIso,
      });
    }
  }

  order.updatedAt = nowIso;
  platformDb.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    actorEmail,
    action: 'ADMIN_ORDER_UPDATED',
    targetId: order.orderReference,
    details: `Updated ${order.orderReference}: orderStatus=${order.orderStatus}, paymentStatus=${order.paymentStatus}.`,
    createdAt: nowIso,
  });

  await writePlatformDb(platformDb);
  return order;
}
