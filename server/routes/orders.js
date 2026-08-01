import express from 'express';
import db from '../database.js';
import { sendOrderConfirmation, sendOrderStatusUpdate, sendOutOfStockNotification } from '../email.js';

const router = express.Router();

// Place an order — requires login
router.post('/', async (req, res) => {
  // Must be logged in to place an order
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً لإتمام الطلب' });
  }

  const { customer_name, customer_phone, customer_email, items, total, notes } = req.body;
  if (!customer_name || !customer_phone || !items || !total) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }

  const userId = req.session.userId;
  const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
  // Use email from form; fallback to account email
  const email = customer_email?.trim() || user?.email || null;
  if (!email) {
    return res.status(400).json({ error: 'البريد الإلكتروني مطلوب لاستلام تأكيد الطلب' });
  }

  // Check stock for each item
  const outOfStockItems = [];
  for (const item of items) {
    const product = db.prepare('SELECT name, stock FROM products WHERE id = ?').get(item.id);
    if (product && product.stock !== null && product.stock <= 0) {
      outOfStockItems.push({ id: item.id, name: product.name });
    }
  }
  if (outOfStockItems.length > 0) {
    // Notify user by email about out-of-stock items
    const storeName = db.prepare("SELECT value FROM site_settings WHERE key='store_name'").get()?.value;
    sendOutOfStockNotification({ to: email, outOfStockItems, storeName }).catch(() => {});
    return res.status(400).json({
      error: `المنتجات التالية غير متوفرة حالياً: ${outOfStockItems.map(i => i.name).join('، ')}`,
    });
  }

  try {
    const result = db.prepare(
      `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, items, total, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(userId, customer_name, customer_phone, email, JSON.stringify(items), total, notes || null);
    const orderId = result.lastInsertRowid;

    // Decrement stock for each ordered item
    for (const item of items) {
      db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').run(item.qty || 1, item.id);
    }

    // Send confirmation email asynchronously
    const storeName = db.prepare("SELECT value FROM site_settings WHERE key='store_name'").get()?.value;
    sendOrderConfirmation({ to: email, orderId, items, total, storeName }).catch(() => {});
    res.json({ id: orderId, message: 'تم إرسال طلبك بنجاح' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get all orders (admin)
router.get('/', (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  const orders = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`).all();
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

// Get current user's orders
router.get('/my', (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'يجب تسجيل الدخول' });
  const orders = db.prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`).all(req.session.userId);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

// Update order status (admin) - also sends status email
router.put('/:id', async (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'حالة غير صحيحة' });
  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, req.params.id);
  // Send status update email
  const order = db.prepare('SELECT customer_email FROM orders WHERE id = ?').get(req.params.id);
  const storeName = db.prepare("SELECT value FROM site_settings WHERE key='store_name'").get()?.value;
  if (order?.customer_email) {
    sendOrderStatusUpdate({ to: order.customer_email, orderId: req.params.id, status, storeName }).catch(() => {});
  }
  res.json({ ok: true });
});

// Delete order (admin)
router.delete('/:id', (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  db.prepare(`DELETE FROM orders WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
