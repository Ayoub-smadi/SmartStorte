import express from 'express';
import { pool } from '../database.js';
import { sendOrderConfirmation, sendOrderStatusUpdate, sendOutOfStockNotification } from '../email.js';

const router = express.Router();

// Place an order — requires login
router.post('/', async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً لإتمام الطلب' });
  }
  const { customer_name, customer_phone, customer_email, items, total, shipping_fee, governorate, notes } = req.body;
  if (!customer_name || !customer_phone || !items || !total) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }
  try {
    const userId = req.session.userId;
    const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = customer_email?.trim() || userRes.rows[0]?.email || null;
    if (!email) return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });

    // Check stock
    const outOfStockItems = [];
    for (const item of items) {
      const { rows } = await pool.query('SELECT name, stock FROM products WHERE id = $1', [item.id]);
      const product = rows[0];
      if (product && product.stock !== null && product.stock <= 0) {
        outOfStockItems.push({ id: item.id, name: product.name });
      }
    }
    if (outOfStockItems.length > 0) {
      const storeRes = await pool.query("SELECT value FROM site_settings WHERE key='store_name'");
      const storeName = storeRes.rows[0]?.value;
      sendOutOfStockNotification({ to: email, outOfStockItems, storeName }).catch(() => {});
      return res.status(400).json({
        error: `المنتجات التالية غير متوفرة حالياً: ${outOfStockItems.map(i => i.name).join('، ')}`,
      });
    }

    const fee = Number(shipping_fee) || 0;
    const result = await pool.query(
      `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, items, total, shipping_fee, governorate, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [userId, customer_name, customer_phone, email, JSON.stringify(items), total, fee, governorate || null, notes || null]
    );
    const orderId = result.rows[0].id;

    // Decrement stock
    for (const item of items) {
      await pool.query('UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2', [item.qty || 1, item.id]);
    }

    const storeRes = await pool.query("SELECT value FROM site_settings WHERE key='store_name'");
    const storeName = storeRes.rows[0]?.value;
    sendOrderConfirmation({ to: email, orderId, items, total, shippingFee: fee, governorate: governorate || null, storeName }).catch(() => {});
    res.json({ id: orderId, message: 'تم إرسال طلبك بنجاح' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows.map(o => ({ ...o, items: JSON.parse(o.items) })));
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Get current user's orders
router.get('/my', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'يجب تسجيل الدخول' });
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.session.userId]);
    res.json(rows.map(o => ({ ...o, items: JSON.parse(o.items) })));
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Update order status (admin)
router.put('/:id', async (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'حالة غير صحيحة' });
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
    const orderRes = await pool.query('SELECT customer_email FROM orders WHERE id = $1', [req.params.id]);
    const storeRes = await pool.query("SELECT value FROM site_settings WHERE key='store_name'");
    const storeName = storeRes.rows[0]?.value;
    if (orderRes.rows[0]?.customer_email) {
      sendOrderStatusUpdate({ to: orderRes.rows[0].customer_email, orderId: req.params.id, status, storeName }).catch(() => {});
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// Delete order (admin)
router.delete('/:id', async (req, res) => {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;
