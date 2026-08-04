import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function isAdmin(req, res, next) {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  next();
}

router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params = [];
    let i = 1;
    if (category) { query += ` AND p.category_id = $${i++}`; params.push(category); }
    if (featured === '1') { query += ` AND p.featured = 1`; }
    if (search) {
      query += ` AND (p.name ILIKE $${i} OR p.description ILIKE $${i + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      i += 2;
    }
    query += ` ORDER BY p.id DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(Number(limit), Number(offset));
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, old_price, category_id, stock, featured } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'الاسم والسعر مطلوبان' });
    const image = req.file ? '/uploads/' + req.file.filename : null;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, old_price, image, category_id, stock, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [name, description || null, Number(price), old_price ? Number(old_price) : null,
       image, category_id ? Number(category_id) : null,
       Number(stock || 0), featured === '1' ? 1 : 0]
    );
    res.json({ id: result.rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const existing = rows[0];
    if (!existing) return res.status(404).json({ error: 'المنتج غير موجود' });
    const { name, description, price, old_price, category_id, stock, featured } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : existing.image;
    await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, old_price=$4,
       image=$5, category_id=$6, stock=$7, featured=$8 WHERE id=$9`,
      [
        name || existing.name,
        description ?? existing.description,
        price ? Number(price) : existing.price,
        old_price !== undefined ? (old_price ? Number(old_price) : null) : existing.old_price,
        image,
        category_id ? Number(category_id) : existing.category_id,
        stock !== undefined ? Number(stock) : existing.stock,
        featured !== undefined ? (featured === '1' ? 1 : 0) : existing.featured,
        req.params.id,
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;
