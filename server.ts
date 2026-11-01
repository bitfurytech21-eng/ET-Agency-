import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { execFile, spawn } from 'child_process';
import http from 'http';
import path from 'path';
import {
  addCartItem,
  applyCartPromo,
  clearCart,
  confirmManualPayment,
  createBooking,
  createCatalogItemAdmin,
  createInquiry,
  createPromoCodeAdmin,
  createUser,
  createVehicleBooking,
  deleteCatalogItemAdmin,
  deletePromoCodeAdmin,
  findUserByEmail,
  getAdminOverview,
  getBookings,
  getOrCreateCart,
  getOrderByReference,
  getPaymentAccounts,
  getPropertyById,
  getPublicCatalog,
  listProperties,
  listVehicles,
  readPlatformDb,
  removeCartItem,
  updateCartItemQuantity,
  updateCatalogItemAdmin,
  updateHousingBookingAdmin,
  updateInquiryStatusAdmin,
  updatePaymentAccounts,
  updatePromoCodeAdmin,
  updatePropertyAdmin,
  updateVehicleAdmin,
  updateVehicleBookingAdmin,
} from './server/lib/store.js';
import {
  adminAllocateCustomerUnits,
  adminUpdateOrder,
  adminVerifyManualPayment,
  createCheckoutOrder,
  listAllCustomersSafe,
  phpAuthLogin,
  phpAuthRegister,
  phpAuthVerify,
  phpCheckoutPayFromBalance,
  phpDashboardBuyUnits,
  phpDashboardGet,
  phpMarkNotificationsRead,
  phpSubmitManualPayment,
  phpUpdateCustomerProfile,
  submitOrderPaymentProof,
} from './server/lib/customerStore.js';
import { comparePassword, hashPassword, requireAdmin, requireAuth, signToken } from './server/auth.js';
import { createServer as createViteServer } from 'vite';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '6mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    validate: { xForwardedForHeader: false },
  }),
);

app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'easy-travel-platform',
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    paymentMode: process.env.PAYMENT_MODE || 'manual',
  });
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required registration fields' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await createUser({
    id: `usr_${Date.now()}`,
    email,
    name,
    passwordHash: hashPassword(password),
    role: 'guest',
    createdAt: new Date().toISOString(),
    isActive: true,
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const user = await findUserByEmail(email);
  if (!user || !comparePassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

// =========================================================================
// PROPERTIES & HOUSING BOOKINGS
// =========================================================================
app.get('/api/properties', async (_req: Request, res: Response) => {
  try {
    const properties = await listProperties();
    res.json({ properties, total: properties.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load properties', error: (error as Error).message });
  }
});

app.get('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    return res.json({ property });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load property', error: (error as Error).message });
  }
});

app.get('/api/bookings', requireAuth, async (_req: Request, res: Response) => {
  try {
    const bookings = await getBookings();
    res.json({ bookings, total: bookings.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load bookings', error: (error as Error).message });
  }
});

app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const {
      propertyId = 'unit-91',
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      notes,
      employer,
      role,
      specialRequests,
      duration,
    } = req.body ?? {};

    if (!guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ message: 'Missing required guest contact fields (Name, Email, Phone)' });
    }

    let finalCheckIn = checkIn;
    if (!finalCheckIn) {
      const today = new Date();
      today.setDate(today.getDate() + 3);
      finalCheckIn = today.toISOString().split('T')[0];
    }

    let finalCheckOut = checkOut;
    if (!finalCheckOut) {
      const startDate = new Date(finalCheckIn);
      let daysToAdd = 30;
      if (typeof duration === 'string') {
        if (duration.includes('5-10')) daysToAdd = 10;
        else if (duration.includes('10-30')) daysToAdd = 30;
        else if (duration.includes('30-60')) daysToAdd = 60;
        else if (duration.includes('60-90') || duration.includes('30-90')) daysToAdd = 90;
        else if (duration.includes('90-180')) daysToAdd = 180;
        else if (duration.includes('6mo')) daysToAdd = 180;
        else {
          const parsedDays = parseInt(duration, 10);
          if (!Number.isNaN(parsedDays) && parsedDays > 0) daysToAdd = parsedDays;
        }
      }
      startDate.setDate(startDate.getDate() + daysToAdd);
      finalCheckOut = startDate.toISOString().split('T')[0];
    }

    const booking = await createBooking({
      propertyId: propertyId === 'any' || !propertyId ? 'unit-91' : propertyId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      notes: notes || undefined,
      employer: employer || undefined,
      role: role || undefined,
      specialRequests: specialRequests || undefined,
      paymentProvider: 'manual',
    });

    return res.status(201).json({
      booking,
      message: 'Reservation inquiry received successfully. Bill & Marlena will review your stay.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

// =========================================================================
// AMERICAN FLEET & VEHICLE RENTALS
// =========================================================================
app.get('/api/vehicles', async (_req: Request, res: Response) => {
  try {
    const vehicles = await listVehicles();
    return res.json({ vehicles, total: vehicles.length });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load fleet inventory', error: (error as Error).message });
  }
});

app.post('/api/vehicle-bookings', async (req: Request, res: Response) => {
  try {
    const {
      vehicleId,
      exteriorColorName,
      exteriorColorHex,
      customerName,
      customerEmail,
      customerPhone,
      employer,
      pickupDate,
      returnDate,
      pickupLocation,
      protectionPlan,
      paymentMethod,
      customerToken,
      notes,
    } = req.body ?? {};

    if (!vehicleId || !customerName || !customerEmail || !customerPhone || !pickupDate || !returnDate) {
      return res.status(400).json({
        message: 'Please provide vehicle, guest contact details, pickup date, and return date.',
      });
    }

    const vBooking = await createVehicleBooking({
      vehicleId,
      exteriorColorName: exteriorColorName || 'Standard Finish',
      exteriorColorHex: exteriorColorHex || '#1e40af',
      customerName,
      customerEmail,
      customerPhone,
      employer,
      pickupDate,
      returnDate,
      pickupLocation: pickupLocation || 'SMF Sacramento Int’l Airport Concierge Delivery',
      protectionPlan: protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard',
      paymentMethod: paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual_wire',
      notes,
    });

    // Optional instant settlement from logged-in customer unit balance
    if (paymentMethod === 'unit_balance' && customerToken) {
      const settlement = await phpCheckoutPayFromBalance(
        customerToken,
        vBooking.id,
        vBooking.unitsRequired,
        'FLEET_CHECKOUT_PAY_FROM_BALANCE',
      );
      if (!settlement.success) {
        return res.status(201).json({
          booking: vBooking,
          settledWithUnits: false,
          settlementWarning: settlement.message,
          message: `Reservation ${vBooking.id} recorded as Awaiting Payment (${settlement.message})`,
        });
      }
      return res.status(201).json({
        booking: settlement.booking || vBooking,
        settledWithUnits: true,
        remainingUnits: settlement.remaining_units,
        transaction: settlement.transaction,
        message: `Vehicle reservation ${vBooking.id} confirmed and settled with ${vBooking.unitsRequired} Lodging Units!`,
      });
    }

    return res.status(201).json({
      booking: vBooking,
      settledWithUnits: false,
      message: 'American Fleet reservation received! Concierge delivery details have been queued.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

// =========================================================================
// OFFICIAL PAYMENT ACCOUNTS & LEAD INQUIRIES
// =========================================================================
app.get('/api/payment-accounts', async (_req: Request, res: Response) => {
  try {
    const paymentAccounts = await getPaymentAccounts();
    return res.json({ paymentAccounts });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
});

app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { type = 'contact', name, email, phone, company, role, propertyId, moveInDate, duration, message } =
      req.body ?? {};
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }
    const inquiry = await createInquiry({
      type,
      name,
      email,
      phone,
      company,
      role,
      propertyId,
      moveInDate,
      duration,
      message,
    });
    return res.status(201).json({
      success: true,
      inquiry,
      referenceCode: inquiry.referenceCode,
      message: 'Inquiry logged successfully.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

// =========================================================================
// STOREFRONT CATALOG, PERSISTENT CART & CHECKOUT ORDERS
// =========================================================================
app.get('/api/catalog', async (_req: Request, res: Response) => {
  try {
    const catalog = await getPublicCatalog();
    return res.json({ success: true, ...catalog });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load catalog', error: (error as Error).message });
  }
});

app.get('/api/cart/:cartId', async (req: Request, res: Response) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/cart/:cartId/items', async (req: Request, res: Response) => {
  try {
    const cart = await addCartItem(req.params.cartId, req.body ?? {});
    return res.status(201).json({
      success: true,
      cart,
      message: 'Cart updated with latest pricing and availability.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/cart/:cartId/items/:itemId', async (req: Request, res: Response) => {
  try {
    const cart = await updateCartItemQuantity(
      req.params.cartId,
      req.params.itemId,
      Number(req.body?.quantity),
    );
    return res.json({ success: true, cart, message: 'Item quantity updated.' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/cart/:cartId/items/:itemId', async (req: Request, res: Response) => {
  try {
    const cart = await removeCartItem(req.params.cartId, req.params.itemId);
    return res.json({ success: true, cart, message: 'Item removed from cart.' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/cart/:cartId', async (req: Request, res: Response) => {
  try {
    const cart = await clearCart(req.params.cartId);
    return res.json({ success: true, cart, message: 'Cart cleared.' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/cart/:cartId/promo', async (req: Request, res: Response) => {
  try {
    const cart = await applyCartPromo(req.params.cartId, req.body?.code);
    return res.json({
      success: true,
      cart,
      message: cart.promoCode ? `Promo code ${cart.promoCode} applied.` : 'Promo code removed.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/cart/:cartId/validate', async (req: Request, res: Response) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    const isValid = cart.items.length > 0 && cart.items.every((i) => i.available);
    return res.json({
      success: true,
      valid: isValid,
      cart,
      issues: cart.validationIssues,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/orders/checkout', async (req: Request, res: Response) => {
  try {
    const result = await createCheckoutOrder(req.body ?? {});
    const isPaid = result.order.paymentStatus === 'paid';
    return res.status(201).json({
      success: true,
      ...result,
      message: isPaid
        ? `Order ${result.order.orderReference} confirmed and paid via verified Lodging Unit balance.`
        : result.order.paymentStatus === 'pending_verification'
        ? `Order ${result.order.orderReference} recorded. Your transfer reference is pending treasury verification.`
        : `Order ${result.order.orderReference} placed. Please complete your bank transfer using the instructions below so our team can verify settlement.`,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.get('/api/orders/:orderRef', async (req: Request, res: Response) => {
  try {
    const order = await getOrderByReference(req.params.orderRef);
    if (!order) {
      return res.status(404).json({ message: 'No order found matching that reference code.' });
    }
    const paymentAccounts = await getPaymentAccounts();
    return res.json({ success: true, order, paymentAccounts });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/orders/:orderRef/submit-payment-proof', async (req: Request, res: Response) => {
  try {
    const result = await submitOrderPaymentProof(req.params.orderRef, req.body ?? {});
    return res.status(201).json({
      success: true,
      ...result,
      message: `Transfer proof submitted for ${result.order.orderReference}. Payment status is now Pending Verification.`,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

// =========================================================================
// CUSTOMER PORTAL & UNIT ENGINE ENDPOINTS (/api/php/*)
// =========================================================================
interface PhpExecutionResult {
  stdout: string;
  data: Record<string, any>;
}

async function runPhpService(scriptName: string, action: string, payload: any): Promise<PhpExecutionResult> {
  try {
    if (scriptName === 'auth.php') {
      if (action === 'login') {
        const res = await phpAuthLogin(payload);
        return { stdout: JSON.stringify(res), data: res };
      }
      if (action === 'register') {
        const res = await phpAuthRegister(payload);
        return { stdout: JSON.stringify(res), data: res };
      }
      if (action === 'verify') {
        const res = await phpAuthVerify(payload?.token);
        return { stdout: JSON.stringify(res), data: res };
      }
    }
    if (scriptName === 'dashboard.php') {
      if (action === 'get') {
        const res = await phpDashboardGet(payload?.token);
        return { stdout: JSON.stringify(res), data: res };
      }
      if (action === 'buy_units') {
        const res = await phpDashboardBuyUnits(
          payload?.token,
          Number(payload?.units || 0),
          payload?.package_type,
          payload?.payment_method,
        );
        return { stdout: JSON.stringify(res), data: res };
      }
    }
    if (scriptName === 'checkout_balance.php') {
      const res = await phpCheckoutPayFromBalance(
        payload?.token,
        payload?.booking_id,
        Number(payload?.units || 0),
        payload?.command_code,
      );
      return { stdout: JSON.stringify(res), data: res };
    }
  } catch (err) {
    console.warn('[Customer Engine] Fallback error:', err);
  }

  return new Promise((resolve) => {
    const scriptPath = path.resolve('server/php', scriptName);
    const payloadStr = JSON.stringify(payload ?? {});
    execFile('php', [scriptPath, action, payloadStr], (err, stdout) => {
      if (err) {
        return resolve({ stdout: '', data: { success: false, message: 'Customer service error' } });
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve({ stdout, data: parsed });
      } catch {
        resolve({ stdout, data: { raw: stdout } });
      }
    });
  });
}

app.post('/api/php/auth/login', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'login', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 401)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/register', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'register', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/verify', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'verify', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 401)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/dashboard/get', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('dashboard.php', 'get', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/dashboard/buy-units', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('dashboard.php', 'buy_units', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/checkout/pay-from-balance', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('checkout_balance.php', 'pay', req.body);
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/payments/manual', async (req: Request, res: Response) => {
  try {
    const { token, ...payload } = req.body ?? {};
    const result = await phpSubmitManualPayment(token, payload);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/profile/update', async (req: Request, res: Response) => {
  try {
    const { token, ...updates } = req.body ?? {};
    const result = await phpUpdateCustomerProfile(token, updates);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/notifications/mark-read', async (req: Request, res: Response) => {
  try {
    const result = await phpMarkNotificationsRead(req.body?.token);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// =========================================================================
// ADMINISTRATIVE CONTROL CENTER ENDPOINTS (/api/admin/*)
// =========================================================================
app.post('/api/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password are required.' });
    }
    const user = await findUserByEmail(email);
    if (!user || !['admin', 'staff'].includes(user.role) || !comparePassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: 'admin',
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      admin: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
});

app.get('/api/admin/overview', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const overview = await getAdminOverview();
    res.json({ overview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate admin overview', error: (error as Error).message });
  }
});

app.get('/api/admin/dashboard', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [overview, platformDb, customers] = await Promise.all([
      getAdminOverview(),
      readPlatformDb(),
      listAllCustomersSafe(),
    ]);

    return res.json({
      success: true,
      overview,
      bookings: platformDb.bookings,
      vehicleBookings: platformDb.vehicleBookings,
      vehicles: platformDb.vehicles,
      manualPayments: platformDb.manualPayments,
      payments: platformDb.payments,
      paymentAccounts: platformDb.paymentAccounts,
      inquiries: platformDb.inquiries,
      auditLogs: platformDb.auditLogs.slice(0, 120),
      customers,
      properties: platformDb.properties,
      orders: platformDb.orders,
      catalogItems: platformDb.catalogItems,
      promoCodes: platformDb.promoCodes,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load admin control center', error: (error as Error).message });
  }
});

app.post('/api/admin/payments/verify', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { paymentId, decision, adminNotes } = req.body ?? {};
    if (!paymentId || !['verified', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'paymentId and valid decision (verified | rejected) are required.' });
    }
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const updated = await adminVerifyManualPayment(paymentId, decision, adminNotes || '', actorEmail);
    return res.json({
      success: true,
      manualPayment: updated,
      message:
        decision === 'verified'
          ? `Payment ${updated.referenceCode} verified and credited.`
          : `Payment ${updated.referenceCode} rejected.`,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/payments/manual-confirm', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, reference } = req.body ?? {};
    if (!bookingId || amount === undefined) {
      return res.status(400).json({ message: 'Missing bookingId or amount' });
    }

    const { booking, payment } = await confirmManualPayment(bookingId, Number(amount), reference);
    return res.json({
      message: 'Manual payment confirmed. Booking status updated to confirmed.',
      booking,
      payment,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/bookings/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const booking = await updateHousingBookingAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, booking, message: `Booking ${booking.id} updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/vehicle-bookings/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const vehicleBooking = await updateVehicleBookingAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, vehicleBooking, message: `Fleet booking ${vehicleBooking.id} updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/vehicles/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const vehicle = await updateVehicleAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, vehicle, message: `${vehicle.name} updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/admin/customers/:id/allocate-units', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { unitsDelta, reason } = req.body ?? {};
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const customer = await adminAllocateCustomerUnits(
      req.params.id,
      Number(unitsDelta),
      reason || 'Executive Account Adjustment',
      actorEmail,
    );
    return res.json({
      success: true,
      customer,
      message: `Updated ${customer.name} balance to ${customer.units_balance} Units.`,
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.put('/api/admin/payment-accounts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const paymentAccounts = await updatePaymentAccounts(req.body ?? {}, actorEmail);
    return res.json({ success: true, paymentAccounts, message: 'Official receiving bank instructions updated.' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const inquiry = await updateInquiryStatusAdmin(req.params.id, req.body?.status || 'reviewed', actorEmail);
    return res.json({ success: true, inquiry });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const order = await adminUpdateOrder(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, order, message: `Order ${order.orderReference} updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/properties/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const property = await updatePropertyAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, property, message: `${property.unitNumber} listing updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/admin/catalog', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const item = await createCatalogItemAdmin(req.body ?? {}, actorEmail);
    return res.status(201).json({ success: true, item, message: `"${item.title}" added to catalog.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/catalog/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const item = await updateCatalogItemAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, item, message: `"${item.title}" updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/admin/catalog/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const removed = await deleteCatalogItemAdmin(req.params.id, actorEmail);
    return res.json({ success: true, removed, message: `"${removed.title}" removed.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.post('/api/admin/promos', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const promo = await createPromoCodeAdmin(req.body ?? {}, actorEmail);
    return res.status(201).json({ success: true, promo, message: `Promo code ${promo.code} created.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.patch('/api/admin/promos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const promo = await updatePromoCodeAdmin(req.params.id, req.body ?? {}, actorEmail);
    return res.json({ success: true, promo, message: `Promo code ${promo.code} updated.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/admin/promos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const removed = await deletePromoCodeAdmin(req.params.id, actorEmail);
    return res.json({ success: true, removed, message: `Promo code ${removed.code} deleted.` });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

// Portal Route Proxy / Smart Redirect Handler
app.all('/portal*', (req: Request, res: Response) => {
  const options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:8080',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    const urlLower = req.originalUrl.toLowerCase();
    if (urlLower.includes('/admin')) {
      return res.redirect('/#admin');
    }
    if (urlLower.includes('/car-rental') || urlLower.includes('/vehicle')) {
      return res.redirect('/#vehicles');
    }
    return res.redirect('/#portal');
  });

  if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
    const contentType = req.headers['content-type'] || '';
    let bodyData: string;
    if (contentType.includes('application/json')) {
      bodyData = JSON.stringify(req.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      bodyData = new URLSearchParams(req.body as Record<string, string>).toString();
    } else {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    proxyReq.write(bodyData);
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error', error: error.message });
});

function startPhpServerDaemon() {
  try {
    const phpProc = spawn('php', ['-S', '127.0.0.1:8080', '-t', 'portal/public'], {
      detached: true,
      stdio: 'ignore',
    });
    phpProc.on('error', () => {
      console.log('PHP CLI binary not available in environment — using Node native platform & customer store');
    });
    phpProc.unref();
  } catch {
    console.log('PHP CLI not installed — operating using Node native platform & customer store');
  }
}

async function startServer() {
  startPhpServerDaemon();

  if (process.env.NODE_ENV !== 'production') {
    const viteServer = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Easy Travel Platform listening on http://0.0.0.0:${port}`);
  });
}

startServer();
