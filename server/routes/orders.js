import express from 'express';
import db from '../database.js';

const router = express.Router();

// Place an order (public)
router.post('/', (req, res) => {
  const { customer_name, customer_phone, items, total, notes } = req.body;
  if (!customer_name || !customer_phone || !items || !total) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }
  try {
    const result = db.prepare(
      `INSERT INTO orders (customer_name, customer_phone, items, total, notes)
       VALUES (?, ?, ?, ?, ?)`
    ).run(customer_name, customer_phone, JSON.stringify(items), total, notes || null);
    res.json({ id: result.lastInsertRowid, message: 'تم إرسال طلبك بنجاح' });
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

// Update order status (admin)
router.put('/:id', (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'حالة غير صحيحة' });
  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, req.params.id);
  res.json({ ok: true });
});

// Delete order (admin)
router.delete('/:id', (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  db.prepare(`DELETE FROM orders WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
