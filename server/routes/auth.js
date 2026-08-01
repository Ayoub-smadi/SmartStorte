import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../database.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
  req.session.userId = user.id;
  req.session.isAdmin = user.is_admin === 1;
  res.json({ id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin === 1 });
});

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
  if (username.length < 3) return res.status(400).json({ error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
  if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(409).json({ error: 'اسم المستخدم مستخدم بالفعل' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)').run(username, hash, email || null);
  const user = { id: result.lastInsertRowid, username, email: email || null, isAdmin: false };
  req.session.userId = user.id;
  req.session.isAdmin = false;
  res.json(user);
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json(null);
  const user = db.prepare('SELECT id, username, email, is_admin FROM users WHERE id = ?').get(req.session.userId);
  if (!user) return res.json(null);
  res.json({ id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin === 1 });
});

export default router;
