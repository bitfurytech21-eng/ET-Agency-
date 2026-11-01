import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {
  addCartItem,
  applyCartPromo,
  clearCart,
  getAdminOverview,
  getBookings,
  getOrCreateCart,
  getPublicCatalog,
  listProperties,
  removeCartItem,
  updateCartItemQuantity,
} from './server/lib/store.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'etl-api', timestamp: new Date().toISOString() });
});

app.get('/api/catalog', async (_req, res) => {
  try {
    res.json(await getPublicCatalog());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load catalog';
    res.status(500).json({ message });
  }
});

app.get('/api/properties', async (_req, res) => {
  try {
    res.json(await listProperties());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load properties';
    res.status(500).json({ message });
  }
});

app.get('/api/bookings', async (_req, res) => {
  try {
    res.json(await getBookings());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load bookings';
    res.status(500).json({ message });
  }
});

app.get('/api/admin/overview', async (_req, res) => {
  try {
    res.json(await getAdminOverview());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load admin overview';
    res.status(500).json({ message });
  }
});

app.get('/api/cart/:cartId', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    res.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load cart';
    res.status(400).json({ message });
  }
});

app.post('/api/cart/:cartId/items', async (req, res) => {
  try {
    const cart = await addCartItem(req.params.cartId, req.body ?? {});
    res.status(201).json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to add cart item';
    res.status(400).json({ message });
  }
});

app.patch('/api/cart/:cartId/items/:itemId', async (req, res) => {
  try {
    const quantity = Number(req.body?.quantity ?? 0);
    const cart = await updateCartItemQuantity(req.params.cartId, req.params.itemId, quantity);
    res.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update cart item';
    res.status(400).json({ message });
  }
});

app.delete('/api/cart/:cartId/items/:itemId', async (req, res) => {
  try {
    const cart = await removeCartItem(req.params.cartId, req.params.itemId);
    res.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to remove cart item';
    res.status(400).json({ message });
  }
});

app.delete('/api/cart/:cartId', async (req, res) => {
  try {
    const cart = await clearCart(req.params.cartId);
    res.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to clear cart';
    res.status(400).json({ message });
  }
});

app.post('/api/cart/:cartId/promo', async (req, res) => {
  try {
    const cart = await applyCartPromo(req.params.cartId, req.body?.code);
    res.json({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to apply promo code';
    res.status(400).json({ message });
  }
});

app.post('/api/cart/:cartId/validate', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    res.json({
      valid: cart.validationIssues.length === 0,
      issues: cart.validationIssues,
      cart,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to validate cart';
    res.status(400).json({ message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`ETL API listening on http://0.0.0.0:${port}`);
});
