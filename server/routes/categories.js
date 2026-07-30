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
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function isAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  next();
}

router.get('/', (req, res) => {
  const cats = db.prepare(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.id
  `).all();
  res.json(cats);
});

router.get('/:id', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!cat) return res.status(404).json({ error: 'القسم غير موجود' });
  res.json(cat);
});

router.post('/', isAdmin, upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });
  const image = req.file ? '/uploads/' + req.file.filename : null;
  const result = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)').run(name, description || null, image);
  res.json({ id: result.lastInsertRowid, name, description, image });
});

router.put('/:id', isAdmin, upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'القسم غير موجود' });
  const image = req.file ? '/uploads/' + req.file.filename : existing.image;
  db.prepare('UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?')
    .run(name || existing.name, description ?? existing.description, image, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', isAdmin, (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
