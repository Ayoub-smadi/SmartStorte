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
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function isAdmin(req, res, next) {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  next();
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*, COUNT(p.id)::int as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id ORDER BY c.id
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'القسم غير موجود' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.post('/', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });
    const image = req.file ? '/uploads/' + req.file.filename : null;
    const result = await pool.query(
      'INSERT INTO categories (name, description, image) VALUES ($1, $2, $3) RETURNING id',
      [name, description || null, image]
    );
    res.json({ id: result.rows[0].id, name, description, image });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    const existing = rows[0];
    if (!existing) return res.status(404).json({ error: 'القسم غير موجود' });
    const { name, description } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : existing.image;
    await pool.query(
      'UPDATE categories SET name=$1, description=$2, image=$3 WHERE id=$4',
      [name || existing.name, description ?? existing.description, image, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;
