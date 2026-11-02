import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
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
  createPropertyAdmin,
  createPropertyReview,
  createUser,
  createVehicleBooking,
  deleteCatalogItemAdmin,
  deletePromoCodeAdmin,
  deletePropertyReviewAdmin,
  findUserByEmail,
  getAdminOverview,
  getBookings,
  getOrCreateCart,
  getOrderByReference,
  getPaymentAccounts,
  getPropertyAvailabilityPublic,
  getPropertyById,
  getPublicCatalog,
  listProperties,
  listPropertyReviews,
  listVehicles,
  quotePropertyStayPublic,
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
  customerChangePassword,
  customerCreateSupportTicket,
  customerToggleTwoFactor,
  customerUpdateHousingBooking,
  customerUpdateVehicleBooking,
  getCustomerByToken,
  getCustomerWishlist,
  listAllCustomersSafe,
  phpAuthLogin,
  phpAuthLogout,
  phpAuthRegister,
  phpAuthVerify,
  phpCheckoutPayFromBalance,
  phpDashboardBuyUnits,
  phpDashboardGet,
  phpMarkNotificationsRead,
  phpSubmitManualPayment,
  phpUpdateCustomerProfile,
  submitOrderPaymentProof,
  toggleCustomerWishlist,
} from './server/lib/customerStore.js';
import { comparePassword, hashPassword, requireAdmin, requireAuth, signToken } from './server/auth.js';
import { createServer as createViteServer } from 'vite';
import { sendTransactionalEmail } from './server/lib/mailer.js';

function getEmailFromEnv() {
  return process.env.SMTP_FROM || process.env.MAIL_FROM_ADDRESS || 'easytravelagency@trustagent.space';
}

async function sendUserNotification({
  to,
  name,
  subject,
  intro,
  details,
}: {
  to: string;
  name?: string;
  subject: string;
  intro: string;
  details: string[];
}) {
  if (!to) return;

  const displayName = name?.trim() || 'Guest';
  const lines = details.length > 0 ? details : ['Thank you for reaching out to Easy Travel Lodging.'];
  const text = [
    `Hello ${displayName},`,
    '',
    intro,
    '',
    ...lines.map((line) => `- ${line}`),
    '',
    'Warm regards,',
    'Easy Travel Lodging Team',
    '',
    `Reply to: ${getEmailFromEnv()}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#282828;max-width:640px;margin:0 auto;">
      <h2 style="margin:0 0 12px;color:#1f2937;">${subject}</h2>
      <p style="margin:0 0 12px;">Hello ${displayName},</p>
      <p style="margin:0 0 12px;">${intro}</p>
      <ul style="margin:0 0 16px;padding-left:18px;">
        ${lines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
      <p style="margin:0;">Warm regards,<br />Easy Travel Lodging Team</p>
      <p style="margin-top:16px;color:#6b7280;">Reply to: ${getEmailFromEnv()}</p>
    </div>
  `;

  try {
    await sendTransactionalEmail({
      to,
      subject,
      text,
      html,
      replyTo: getEmailFromEnv(),
    });
  } catch (error) {
    console.warn('[mailer] user notification skipped:', error instanceof Error ? error.message : error);
  }
}

function extractCustomerToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }
  const bodyToken = req.body?.token || req.body?.customerToken;
  return typeof bodyToken === 'string' ? bodyToken.trim() : '';
}

function extractRequestMeta(req: Request) {
  return {
    userAgent: String(req.headers['user-agent'] || ''),
    ip: String(req.ip || req.socket.remoteAddress || 'Verified Client Network'),
  };
}

async function runPhpService(
  service: string,
  action: string,
  payload: Record<string, unknown> = {},
  meta?: { userAgent?: string; ip?: string },
) {
  switch (`${service}:${action}`) {
    case 'auth.php:login':
      return { data: await phpAuthLogin(payload as { email?: string; password?: string }, meta) };
    case 'auth.php:register':
      return {
        data: await phpAuthRegister(
          payload as { name?: string; email?: string; password?: string; company?: string; role?: string; phone?: string },
          meta,
        ),
      };
    case 'auth.php:verify':
      return { data: await phpAuthVerify(String(payload.token ?? '')) };
    case 'dashboard.php:get':
      return { data: await phpDashboardGet(String(payload.token ?? '')) };
    case 'dashboard.php:buy_units':
      return {
        data: await phpDashboardBuyUnits(
          String(payload.token ?? ''),
          Number(payload.units ?? 0),
          String(payload.packageType ?? 'Standard Unit Credit Pack'),
          String(payload.paymentMethod ?? 'Corporate Credit Facility'),
        ),
      };
    case 'checkout_balance.php:pay':
      return {
        data: await phpCheckoutPayFromBalance(
          String(payload.token ?? ''),
          String(payload.bookingId ?? ''),
          Number(payload.unitsRequired ?? 0),
          String(payload.commandCode ?? 'INTERNAL_EXEC_PAY_FROM_BALANCE'),
        ),
      };
    default:
      throw new Error(`Unknown PHP service: ${service}:${action}`);
  }
}

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '6mb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    validate: { xForwardedForHeader: false },
  }),
);

app.use(express.static('public'));

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

  await sendUserNotification({
    to: user.email,
    name: user.name,
    subject: 'Welcome to Easy Travel Lodging',
    intro: 'Your account has been created successfully and is ready to use.',
    details: [
      'Sign in anytime to view your dashboard, manage reservations, and track payments.',
      'Your welcome access includes a working client portal for lodging, vehicles, and service orders.',
    ],
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

app.get('/api/properties/:id/availability', async (req: Request, res: Response) => {
  try {
    const availability = await getPropertyAvailabilityPublic(req.params.id);
    return res.json({ success: true, ...availability });
  } catch (error) {
    return res.status(404).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/properties/:id/quote-availability', async (req: Request, res: Response) => {
  try {
    const quote = await quotePropertyStayPublic({
      propertyId: req.params.id,
      checkIn: String(req.body?.checkIn || ''),
      checkOut: String(req.body?.checkOut || ''),
      adults: Number(req.body?.adults ?? 1),
      children: Number(req.body?.children ?? 0),
      infants: Number(req.body?.infants ?? 0),
      selectedAddons: Array.isArray(req.body?.selectedAddons) ? req.body.selectedAddons : [],
    });
    return res.json({ success: true, quote });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/properties/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await listPropertyReviews(req.params.id);
    const total = reviews.length;
    const averageRating =
      total > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
        : null;
    return res.json({ success: true, reviews, total, averageRating });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/properties/:id/reviews', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const customer = await getCustomerByToken(token);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to your account to submit a property review.',
      });
    }
    const review = await createPropertyReview({
      propertyId: req.params.id,
      customerId: customer.id,
      customerEmail: customer.email,
      authorName: customer.name,
      authorRole: req.body?.authorRole || customer.role || customer.company || undefined,
      stayContext: req.body?.stayContext || undefined,
      rating: Number(req.body?.rating || 5),
      title: req.body?.title || undefined,
      content: String(req.body?.content || ''),
    });
    return res.status(201).json({
      success: true,
      review,
      message: 'Thank you. Your review has been published.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/properties/:id/book', async (req: Request, res: Response) => {
  try {
    const resolvedToken = extractCustomerToken(req);
    const activeCustomer = await getCustomerByToken(resolvedToken);
    const {
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      infants = 0,
      selectedAddons = [],
      specialRequests,
      notes,
      employer,
      role,
      paymentMethod = 'manual',
    } = req.body ?? {};

    const finalName = (guestName || activeCustomer?.name || '').trim();
    const finalEmail = (guestEmail || activeCustomer?.email || '').trim();
    const finalPhone = (guestPhone || activeCustomer?.phone || '').trim();

    if (!finalName || !finalEmail || !finalPhone) {
      return res.status(400).json({
        success: false,
        message: 'Guest full name, email address, and phone number are required.',
      });
    }
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please select both check-in and check-out dates.',
      });
    }

    const booking = await createBooking({
      customerId: activeCustomer?.id,
      propertyId: req.params.id,
      guestName: finalName,
      guestEmail: finalEmail,
      guestPhone: finalPhone,
      checkIn,
      checkOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      selectedAddons: Array.isArray(selectedAddons) ? selectedAddons : [],
      specialRequests,
      notes,
      employer: employer || activeCustomer?.company || undefined,
      role: role || activeCustomer?.role || undefined,
      paymentProvider: paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual',
    });

    if (paymentMethod === 'unit_balance') {
      if (!resolvedToken || !activeCustomer) {
        return res.status(201).json({
          success: true,
          booking,
          settledWithUnits: false,
          paymentAccounts: await getPaymentAccounts(),
          message: `Reservation ${booking.id} recorded as Awaiting Payment. Sign in to settle with Lodging Units or remit via bank transfer.`,
        });
      }
      const settlement = await phpCheckoutPayFromBalance(
        resolvedToken,
        booking.id,
        booking.unitCostUnits || 1,
        'PROPERTY_DIRECT_UNIT_SETTLEMENT',
      );
      if (!settlement.success) {
        return res.status(201).json({
          success: true,
          booking,
          settledWithUnits: false,
          settlementWarning: settlement.message,
          paymentAccounts: await getPaymentAccounts(),
          message: `Reservation ${booking.id} saved as Awaiting Payment (${settlement.message}).`,
        });
      }
      await sendUserNotification({
        to: finalEmail,
        name: finalName,
        subject: `Reservation Confirmed — ${booking.id}`,
        intro: 'Your stay and selected concierge services have been confirmed via your Lodging Unit balance.',
        details: [
          `Reservation ID: ${booking.id}`,
          `Dates: ${booking.checkIn} to ${booking.checkOut} (${booking.totalNights} nights)`,
          `Total Settled: $${(booking.totalUsd || booking.unitCostUsd || 0).toLocaleString()} (${booking.unitCostUnits} Units)`,
        ],
      });
      return res.status(201).json({
        success: true,
        booking: settlement.booking || booking,
        settledWithUnits: true,
        remainingUnits: settlement.remaining_units,
        message: `Reservation ${booking.id} confirmed and settled with ${booking.unitCostUnits} Lodging Units.`,
      });
    }

    const paymentAccounts = await getPaymentAccounts();
    await sendUserNotification({
      to: finalEmail,
      name: finalName,
      subject: `Reservation Recorded (Awaiting Payment) — ${booking.id}`,
      intro: 'Your reservation request has been recorded and dates are held pending payment verification.',
      details: [
        `Reservation ID: ${booking.id}`,
        `Dates: ${booking.checkIn} to ${booking.checkOut} (${booking.totalNights} nights)`,
        `Amount Due: $${(booking.totalUsd || booking.unitCostUsd || 0).toLocaleString()}`,
        'Complete payment via Wire, ACH, Zelle, or Client Portal Units to finalize confirmation.',
      ],
    });

    return res.status(201).json({
      success: true,
      booking,
      settledWithUnits: false,
      paymentAccounts,
      message: `Reservation ${booking.id} recorded as Awaiting Payment. Complete transfer verification in your dashboard to confirm.`,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { role?: string; email?: string } }).user;
    const allBookings = await getBookings();
    if (user?.role === 'admin' || user?.role === 'staff') {
      return res.json({ bookings: allBookings, total: allBookings.length });
    }
    const emailLower = (user?.email || '').toLowerCase();
    const ownBookings = allBookings.filter((b) => b.guestEmail.toLowerCase() === emailLower);
    return res.json({ bookings: ownBookings, total: ownBookings.length });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load bookings', error: (error as Error).message });
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

    const activeCustomer = await getCustomerByToken(extractCustomerToken(req));

    const booking = await createBooking({
      customerId: activeCustomer?.id,
      propertyId: propertyId === 'any' || !propertyId ? 'unit-91' : propertyId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(req.body?.infants) || 0,
      selectedAddons: Array.isArray(req.body?.selectedAddons) ? req.body.selectedAddons : [],
      notes: notes || undefined,
      employer: employer || undefined,
      role: role || undefined,
      specialRequests: specialRequests || undefined,
      paymentProvider: 'manual',
    });

    await sendUserNotification({
      to: guestEmail,
      name: guestName,
      subject: `Stay inquiry received — ${booking.id}`,
      intro: 'Your reservation inquiry has been received and our team will review it shortly.',
      details: [
        `Check-in: ${finalCheckIn}`,
        `Check-out: ${finalCheckOut}`,
        `Property: ${propertyId || 'Flexible matching'}`,
        'A concierge team member will follow up with availability and next steps.',
      ],
    });

    return res.status(201).json({
      booking,
      message: 'Reservation inquiry received successfully. Bill & Marlena will review your stay.',
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

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

    const resolvedToken = extractCustomerToken(req) || (typeof customerToken === 'string' ? customerToken : '');
    const activeCustomer = await getCustomerByToken(resolvedToken);

    const vBooking = await createVehicleBooking({
      customerId: activeCustomer?.id,
      vehicleId,
      exteriorColorName: exteriorColorName || 'Standard Finish',
      exteriorColorHex: exteriorColorHex || '#1e40af',
      customerName,
      customerEmail,
      customerPhone,
      employer,
      pickupDate,
      returnDate,
      pickupLocation: pickupLocation || 'El Dorado Hills, CA / SMF Airport Concierge Delivery',
      protectionPlan: protectionPlan === 'executive_shield' ? 'executive_shield' : 'standard',
      paymentMethod: paymentMethod === 'unit_balance' ? 'unit_balance' : 'manual_wire',
      notes,
    });

    await sendUserNotification({
      to: customerEmail,
      name: customerName,
      subject: `Vehicle reservation received — ${vBooking.id}`,
      intro: 'Your fleet booking request is in our queue and our concierge team will confirm the itinerary.',
      details: [
        `Pickup: ${pickupDate}`,
        `Return: ${returnDate}`,
        `Vehicle request: ${vehicleId}`,
        'We will confirm delivery, protection, and final trip details by email.',
      ],
    });

    if (paymentMethod === 'unit_balance' && resolvedToken) {
      const settlement = await phpCheckoutPayFromBalance(
        resolvedToken,
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
    const activeCustomer = await getCustomerByToken(extractCustomerToken(req));
    const inquiry = await createInquiry({
      customerId: activeCustomer?.id,
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

    await sendUserNotification({
      to: email,
      name,
      subject: 'Your inquiry was received',
      intro: 'Thank you for reaching out to Easy Travel Lodging. Our team has received your message and will respond shortly.',
      details: [
        `Inquiry type: ${type}`,
        propertyId ? `Property: ${propertyId}` : 'Property: Flexible matching',
        'A concierge or account specialist will contact you with next steps.',
      ],
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

app.get('/api/catalog', async (_req: Request, res: Response) => {
  try {
    const catalog = await getPublicCatalog();
    return res.json({ success: true, ...catalog });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load catalog', error: (error as Error).message });
  }
});

app.get('/api/cart', async (req: Request, res: Response) => {
  try {
    const cartId = typeof req.query.cartId === 'string' && req.query.cartId.trim()
      ? req.query.cartId.trim()
      : 'etl_cart_default';
    const cart = await getOrCreateCart(cartId);
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
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
    const token = extractCustomerToken(req);
    const result = await createCheckoutOrder({
      ...(req.body ?? {}),
      customerToken: req.body?.customerToken || token || undefined,
    });
    const isPaid = result.order.paymentStatus === 'paid';

    await sendUserNotification({
      to: result.order.customerEmail,
      name: result.order.customerName,
      subject: `Order confirmed — ${result.order.orderReference}`,
      intro:
        isPaid
          ? 'Your order has been confirmed and paid. We are preparing your stay or service details.'
          : 'Your order has been received and is awaiting final payment verification from our treasury team.',
      details: [
        `Order reference: ${result.order.orderReference}`,
        `Total: $${result.order.totalUsd.toLocaleString()}`,
        'We will send a follow-up once payment is fully verified and your reservation details are finalized.',
      ],
    });

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

app.post('/api/auth/customer/login', async (req: Request, res: Response) => {
  try {
    const result = await phpAuthLogin(req.body ?? {}, extractRequestMeta(req));
    return res.status(result.status || (result.success ? 200 : 401)).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/auth/customer/register', async (req: Request, res: Response) => {
  try {
    const result = await phpAuthRegister(req.body ?? {}, extractRequestMeta(req));
    if (result.success && result.customer?.email) {
      await sendUserNotification({
        to: result.customer.email,
        name: result.customer.name,
        subject: 'Welcome to Easy Travel Lodging — Your Personal Dashboard is Ready',
        intro: 'Your account has been created and your personal dashboard is ready for immediate access.',
        details: [
          `User ID: ${result.customer.id}`,
          'Access your reservations, car rentals, invoices, and concierge requests from your dashboard.',
        ],
      });
    }
    return res.status(result.status || (result.success ? 201 : 400)).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/auth/customer/logout', async (req: Request, res: Response) => {
  try {
    const result = await phpAuthLogout(extractCustomerToken(req));
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/auth/customer/session', async (req: Request, res: Response) => {
  try {
    const result = await phpAuthVerify(extractCustomerToken(req));
    return res.status(result.status || (result.success ? 200 : 401)).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const result = await phpDashboardGet(extractCustomerToken(req));
    return res.status(result.status || (result.success ? 200 : 401)).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.put('/api/dashboard/profile', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const { token: _t, ...updates } = req.body ?? {};
    const result = await phpUpdateCustomerProfile(token, updates);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/password', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const { currentPassword, newPassword } = req.body ?? {};
    const result = await customerChangePassword(token, currentPassword, newPassword);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/two-factor', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await customerToggleTwoFactor(token, Boolean(req.body?.enabled));
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.patch('/api/dashboard/bookings/:id', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await customerUpdateHousingBooking(token, req.params.id, req.body ?? {});
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.patch('/api/dashboard/vehicle-bookings/:id', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await customerUpdateVehicleBooking(token, req.params.id, req.body ?? {});
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/payments/manual', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const { token: _t, ...payload } = req.body ?? {};
    const result = await phpSubmitManualPayment(token, payload);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/notifications/read', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await phpMarkNotificationsRead(token, req.body?.notificationId);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/support-tickets', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await customerCreateSupportTicket(token, req.body ?? {});
    return res.status(result.status || 201).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/dashboard/wishlist', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await getCustomerWishlist(token);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/dashboard/wishlist/toggle', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await toggleCustomerWishlist(token, String(req.body?.propertyId || ''));
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/login', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'login', req.body, extractRequestMeta(req));
    return res.status(result.data.status || (result.data.success ? 200 : 401)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/register', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'register', req.body, extractRequestMeta(req));
    const data = result.data as { success?: boolean; customer?: { id: string; email: string; name: string } };
    if (data.success && data.customer?.email) {
      await sendUserNotification({
        to: data.customer.email,
        name: data.customer.name,
        subject: 'Welcome to Easy Travel Lodging — Your Personal Dashboard is Ready',
        intro: 'Your client account is active and your personal dashboard has been initialised.',
        details: [
          `User ID: ${data.customer.id}`,
          'Sign in anytime to manage your accommodation bookings, car rentals, payments, and account preferences.',
        ],
      });
    }
    return res.status(result.data.status || (result.data.success ? 201 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/verify', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await runPhpService('auth.php', 'verify', { ...(req.body ?? {}), token });
    return res.status(result.data.status || (result.data.success ? 200 : 401)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/dashboard/get', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await runPhpService('dashboard.php', 'get', { ...(req.body ?? {}), token });
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/dashboard/buy-units', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await runPhpService('dashboard.php', 'buy_units', { ...(req.body ?? {}), token });
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/checkout/pay-from-balance', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await runPhpService('checkout_balance.php', 'pay', { ...(req.body ?? {}), token });
    return res.status(result.data.status || (result.data.success ? 200 : 400)).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/payments/manual', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const { token: _t, ...payload } = req.body ?? {};
    const result = await phpSubmitManualPayment(token, payload);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/profile/update', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const { token: _t, ...updates } = req.body ?? {};
    const result = await phpUpdateCustomerProfile(token, updates);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/notifications/mark-read', async (req: Request, res: Response) => {
  try {
    const token = extractCustomerToken(req);
    const result = await phpMarkNotificationsRead(token, req.body?.notificationId);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

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
      reviews: platformDb.reviews || [],
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
    return res.status(500).json({ message: (error as Error).message });
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

app.post('/api/admin/properties', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const property = await createPropertyAdmin(req.body ?? {}, actorEmail);
    return res.status(201).json({ success: true, property, message: `${property.unitNumber} created.` });
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

app.get('/api/admin/reviews', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const reviews = await listPropertyReviews();
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const actorEmail = (req as Request & { user?: { email?: string } }).user?.email || 'admin@easytravellodging.com';
    const removed = await deletePropertyReviewAdmin(req.params.id, actorEmail);
    return res.json({ success: true, removed, message: 'Review removed.' });
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

app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.all('/portal*', (req: Request, res: Response) => {
  const urlLower = req.originalUrl.toLowerCase();
  if (urlLower.includes('/admin')) {
    return res.redirect('/admin');
  }
  if (urlLower.includes('/car-rental') || urlLower.includes('/vehicle')) {
    return res.redirect('/#vehicles');
  }
  return res.redirect('/#portal');
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Unexpected server error', error: error.message });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const viteServer = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
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
