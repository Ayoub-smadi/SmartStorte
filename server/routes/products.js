import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function isAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  next();
}

router.get('/', (req, res) => {
  const { category, featured, search, limit = 50, offset = 0 } = req.query;
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params = [];
  if (category) { query += ' AND p.category_id = ?'; params.push(category); }
  if (featured === '1') { query += ' AND p.featured = 1'; }
  if (search) { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY p.id DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  const products = db.prepare(query).all(...params);
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
  res.json(product);
});

router.post('/', isAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, old_price, category_id, stock, featured } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'الاسم والسعر مطلوبان' });
  const image = req.file ? '/uploads/' + req.file.filename : null;
  const result = db.prepare(`
    INSERT INTO products (name, description, price, old_price, image, category_id, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, description || null, Number(price), old_price ? Number(old_price) : null, image,
    category_id ? Number(category_id) : null, Number(stock || 0), featured === '1' ? 1 : 0);
  res.json({ id: result.lastInsertRowid });
});

router.put('/:id', isAdmin, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'المنتج غير موجود' });
  const { name, description, price, old_price, category_id, stock, featured } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : existing.image;
  db.prepare(`
    UPDATE products SET name=?, description=?, price=?, old_price=?, image=?, category_id=?, stock=?, featured=?
    WHERE id=?
  `).run(
    name || existing.name, description ?? existing.description,
    price ? Number(price) : existing.price,
    old_price !== undefined ? (old_price ? Number(old_price) : null) : existing.old_price,
    image, category_id ? Number(category_id) : existing.category_id,
    stock !== undefined ? Number(stock) : existing.stock,
    featured !== undefined ? (featured === '1' ? 1 : 0) : existing.featured,
    req.params.id
  );
  res.json({ ok: true });
});

router.delete('/:id', isAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
