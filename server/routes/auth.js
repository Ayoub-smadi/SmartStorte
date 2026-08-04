import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }
    req.session.userId = user.id;
    req.session.isAdmin = user.is_admin === 1;
    res.json({ id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin === 1 });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    if (username.length < 3) return res.status(400).json({ error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
    if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ error: 'صيغة البريد الإلكتروني غير صحيحة' });

    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length) return res.status(409).json({ error: 'اسم المستخدم مستخدم بالفعل' });
    const existingEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim()]);
    if (existingEmail.rows.length) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });

    const hash = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
      [username, hash, email.trim()]
    );
    const user = { id: result.rows[0].id, username, email: email.trim(), isAdmin: false };
    req.session.userId = user.id;
    req.session.isAdmin = false;
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  try {
    if (!req.session?.userId) return res.json(null);
    const { rows } = await pool.query('SELECT id, username, email, is_admin FROM users WHERE id = $1', [req.session.userId]);
    const user = rows[0];
    if (!user) return res.json(null);
    res.json({ id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin === 1 });
  } catch (e) {
    res.json(null);
  }
});

export default router;
