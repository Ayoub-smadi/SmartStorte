import express from 'express';
import db from '../database.js';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../email.js';

const router = express.Router();

// Place an order (public or logged-in user)
router.post('/', async (req, res) => {
  const { customer_name, customer_phone, customer_email, items, total, notes } = req.body;
  if (!customer_name || !customer_phone || !items || !total) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }
  if (!customer_email && !req.session?.userId) {
    return res.status(400).json({ error: 'البريد الإلكتروني مطلوب لاستلام تأكيد الطلب' });
  }
  // Use logged-in user's email if not provided
  let email = customer_email || null;
  const userId = req.session?.userId || null;
  if (!email && userId) {
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId);
    if (user?.email) email = user.email;
  }
  try {
    const result = db.prepare(
      `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, items, total, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(userId, customer_name, customer_phone, email, JSON.stringify(items), total, notes || null);
    const orderId = result.lastInsertRowid;
    // Send confirmation email asynchronously
    const storeName = db.prepare("SELECT value FROM site_settings WHERE key='store_name'").get()?.value;
    sendOrderConfirmation({ to: email, orderId, items, total, storeName }).catch(() => {});
    res.json({ id: orderId, message: 'تم إرسال طلبك بنجاح' });
  } catch (e) {
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
