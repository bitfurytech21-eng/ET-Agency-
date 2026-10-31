import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { execFile, spawn } from 'child_process';
import http from 'http';
import path from 'path';
import {
  confirmManualPayment,
  createBooking,
  createUser,
  findUserByEmail,
  getAdminOverview,
  getBookings,
  getPropertyById,
  listProperties,
} from './server/lib/store.js';
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
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    validate: { xForwardedForHeader: false },
  }),
);

app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'easy-travel-platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
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
        else if (duration.includes('60-90')) daysToAdd = 90;
        else if (duration.includes('90-180')) daysToAdd = 180;
        else if (duration.includes('6mo')) daysToAdd = 180;
      }
      startDate.setDate(startDate.getDate() + daysToAdd);
      finalCheckOut = startDate.toISOString().split('T')[0];
    }

    const booking = await createBooking({
      propertyId: propertyId || 'unit-91',
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

app.post('/api/payments/manual-confirm', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, currency = 'USD', reference } = req.body ?? {};
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

app.get('/api/admin/overview', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const overview = await getAdminOverview();
    res.json({ overview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate admin overview', error: (error as Error).message });
  }
});

// Helper to execute PHP backend services
interface PhpExecutionResult {
  stdout: string;
  data: Record<string, any>;
}

function runPhpService(scriptName: string, action: string, payload: unknown): Promise<PhpExecutionResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve('server/php', scriptName);
    const payloadStr = JSON.stringify(payload ?? {});
    execFile('php', [scriptPath, action, payloadStr], (err, stdout, stderr) => {
      if (err) {
        console.error(`[PHP Service ${scriptName}] Error:`, stderr || err.message);
        try {
          const parsed = JSON.parse(stdout);
          return resolve({ stdout, data: parsed });
        } catch {
          return reject(new Error(stderr || err.message));
        }
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

// PHP Customer Authentication Endpoints
app.post('/api/php/auth/login', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'login', req.body);
    return res.status(result.data.success ? 200 : 401).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/register', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'register', req.body);
    return res.status(result.data.success ? 200 : 400).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/auth/verify', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('auth.php', 'verify', req.body);
    return res.status(result.data.success ? 200 : 401).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// PHP Customer Dashboard & Unit Purchases
app.post('/api/php/dashboard/get', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('dashboard.php', 'get', req.body);
    return res.status(result.data.success ? 200 : 400).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.post('/api/php/dashboard/buy-units', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('dashboard.php', 'buy_units', req.body);
    return res.status(result.data.success ? 200 : 400).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// PHP Internal Command: Checkout & Pay from Dashboard Units Balance
app.post('/api/php/checkout/pay-from-balance', async (req: Request, res: Response) => {
  try {
    const result = await runPhpService('checkout_balance.php', 'pay', req.body);
    return res.status(result.data.success ? 200 : 400).json(result.data);
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// PHP MVC Portal Proxy Handler
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

  proxyReq.on('error', (err) => {
    res.status(502).send(`PHP Portal gateway error: ${err.message}. Make sure PHP server is running.`);
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
    phpProc.unref();
    console.log('PHP Portal Server started on 127.0.0.1:8080');
  } catch (err) {
    console.error('Could not spawn PHP portal daemon:', err);
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
