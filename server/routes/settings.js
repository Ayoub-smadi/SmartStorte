import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database.js';

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

// GET all settings (public - excluding SMTP passwords)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
  // Parse features JSON
  if (settings.features) {
    try { settings.features = JSON.parse(settings.features); } catch(e) {}
  }
  // Hide SMTP pass from public
  if (!req.session?.isAdmin) {
    delete settings.smtp_pass;
  }
  res.json(settings);
});

// PUT update settings (admin only)
router.put('/', isAdmin, (req, res) => {
  const allowed = [
    'store_name', 'store_tagline', 'hero_title', 'hero_subtitle', 'hero_desc',
    'hero_btn_shop', 'hero_btn_offers', 'features',
    'footer_desc', 'footer_phone', 'footer_email_contact', 'footer_location', 'footer_copyright',
    'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from',
  ];
  const upsert = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
  const updateMany = db.transaction((data) => {
    for (const [k, v] of Object.entries(data)) {
      if (allowed.includes(k)) {
        const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
        upsert.run(k, val);
      }
    }
  });
  updateMany(req.body);
  res.json({ ok: true });
});

// POST upload logo (admin only)
router.post('/logo', isAdmin, upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'لم يتم رفع ملف' });
  const logoUrl = '/uploads/' + req.file.filename;
  db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').run('logo_url', logoUrl);
  res.json({ logo_url: logoUrl });
});

export default router;
