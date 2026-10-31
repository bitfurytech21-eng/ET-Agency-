import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultProperties } from '../data/seed.js';
import type {
  BookingRecord,
  DatabaseState,
  PaymentRecord,
  PropertyRecord,
  UserRecord,
} from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

const emptyState: DatabaseState = {
  users: [],
  properties: defaultProperties,
  bookings: [],
  payments: [],
};

async function ensureStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbFile);
  } catch {
    await fs.writeFile(dbFile, JSON.stringify(emptyState, null, 2), 'utf8');
  }
}

async function readDb(): Promise<DatabaseState> {
  await ensureStorage();
  const raw = await fs.readFile(dbFile, 'utf8');
  const parsed = JSON.parse(raw) as Partial<DatabaseState>;

  return {
    users: parsed.users ?? [],
    properties: parsed.properties?.length ? parsed.properties : defaultProperties,
    bookings: parsed.bookings ?? [],
    payments: parsed.payments ?? [],
  };
}

async function writeDb(next: DatabaseState) {
  await fs.writeFile(dbFile, JSON.stringify(next, null, 2), 'utf8');
}

export async function listProperties(): Promise<PropertyRecord[]> {
  const db = await readDb();
  return db.properties;
}

export async function getPropertyById(id: string) {
  const db = await readDb();
  return db.properties.find((property) => property.id === id);
}

export async function listUsers(): Promise<UserRecord[]> {
  const db = await readDb();
  return db.users;
}

export async function createUser(user: UserRecord) {
  const db = await readDb();
  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function createBooking(input: {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  notes?: string;
  employer?: string;
  role?: string;
  specialRequests?: string;
  paymentProvider?: 'manual' | 'stripe' | 'paypal';
}): Promise<BookingRecord> {
  const db = await readDb();
  let property = db.properties.find((entry) => entry.id === input.propertyId);

  if (!property && (input.propertyId === 'any' || !input.propertyId)) {
    property = db.properties[0];
  }

  if (!property) {
    property = db.properties[0];
  }

  const start = new Date(input.checkIn);
  const end = new Date(input.checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid date range');
  }
  if (end <= start) {
    throw new Error('Check-out must be after check-in');
  }

  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));

  const overlap = db.bookings.some((booking) => {
    if (booking.propertyId !== property?.id) return false;
    if (['cancelled', 'refunded'].includes(booking.status)) return false;
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    return bookingStart < end && start < bookingEnd;
  });

  if (overlap) {
    // For inquiry submissions, if dates overlap we can still record inquiry with pending status or inform
    console.warn(`[Easy Travel Lodging] Warning: Dates overlap for ${property?.id}, recording inquiry`);
  }

  const booking: BookingRecord = {
    id: `bk_${Date.now()}`,
    propertyId: property ? property.id : 'unit-91',
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    employer: input.employer,
    role: input.role,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults ?? 1,
    children: input.children ?? 0,
    status: 'awaiting_payment',
    notes: input.notes,
    specialRequests: input.specialRequests,
    totalNights: nights,
    createdAt: new Date().toISOString(),
    paymentProvider: input.paymentProvider ?? 'manual',
  };

  db.bookings.unshift(booking);
  await writeDb(db);
  return booking;
}

export async function getBookings(): Promise<BookingRecord[]> {
  const db = await readDb();
  return db.bookings;
}

export async function createPayment(input: {
  bookingId: string;
  amount: number;
  currency: string;
  provider: 'manual' | 'stripe' | 'paypal';
  reference?: string;
}) {
  const db = await readDb();
  const booking = db.bookings.find((entry) => entry.id === input.bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const payment: PaymentRecord = {
    id: `pay_${Date.now()}`,
    bookingId: input.bookingId,
    amount: input.amount,
    currency: input.currency,
    status: 'pending',
    provider: input.provider,
    reference: input.reference,
    createdAt: new Date().toISOString(),
  };

  db.payments.push(payment);
  await writeDb(db);
  return payment;
}

export async function confirmManualPayment(bookingId: string, amount: number, reference?: string) {
  const db = await readDb();
  const booking = db.bookings.find((entry) => entry.id === bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  const payment = db.payments.find((entry) => entry.bookingId === bookingId && entry.provider === 'manual');
  if (!payment) {
    db.payments.push({
      id: `pay_${Date.now()}`,
      bookingId,
      amount,
      currency: 'USD',
      status: 'succeeded',
      provider: 'manual',
      reference,
      createdAt: new Date().toISOString(),
    });
  } else {
    payment.status = 'succeeded';
    payment.amount = amount;
    payment.reference = reference;
  }

  booking.status = 'confirmed';
  booking.paymentReference = reference ?? `manual-${Date.now()}`;

  await writeDb(db);
  return {
    booking,
    payment: db.payments.find((entry) => entry.bookingId === bookingId && entry.provider === 'manual'),
  };
}

export async function getAdminOverview() {
  const db = await readDb();

  return {
    totalProperties: db.properties.length,
    totalBookings: db.bookings.length,
    activeBookings: db.bookings.filter((booking) => !['cancelled', 'refunded', 'completed'].includes(booking.status)).length,
    pendingBookings: db.bookings.filter((booking) => booking.status === 'pending' || booking.status === 'awaiting_payment').length,
    confirmedBookings: db.bookings.filter((booking) => booking.status === 'confirmed').length,
    totalRevenue: db.payments
      .filter((payment) => payment.status === 'succeeded')
      .reduce((sum, payment) => sum + payment.amount, 0),
  };
}
