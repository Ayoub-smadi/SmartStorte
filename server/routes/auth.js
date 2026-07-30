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
  res.json({ id: user.id, username: user.username, isAdmin: user.is_admin === 1 });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json(null);
  const user = db.prepare('SELECT id, username, is_admin FROM users WHERE id = ?').get(req.session.userId);
  if (!user) return res.json(null);
  res.json({ id: user.id, username: user.username, isAdmin: user.is_admin === 1 });
});

export default router;
