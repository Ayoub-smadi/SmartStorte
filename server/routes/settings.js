import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => cb(null, 'logo-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function isAdmin(req, res, next) {
  if (!req.session?.isAdmin) return res.status(403).json({ error: 'غير مصرح' });
  next();
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM site_settings');
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
    if (settings.features) {
      try { settings.features = JSON.parse(settings.features); } catch (e) {}
    }
    if (!req.session?.isAdmin) delete settings.smtp_pass;
    res.json(settings);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.put('/', isAdmin, async (req, res) => {
  try {
    const allowed = [
      'store_name', 'store_tagline', 'hero_title', 'hero_subtitle', 'hero_desc',
      'hero_btn_shop', 'hero_btn_offers', 'features',
      'footer_desc', 'footer_phone', 'footer_email_contact', 'footer_location', 'footer_copyright',
      'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from',
    ];
    for (const [k, v] of Object.entries(req.body)) {
      if (allowed.includes(k)) {
        const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
        await pool.query(
          'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [k, val]
        );
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.post('/logo', isAdmin, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع ملف' });
    const logoUrl = '/uploads/' + req.file.filename;
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      ['logo_url', logoUrl]
    );
    res.json({ logo_url: logoUrl });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;
