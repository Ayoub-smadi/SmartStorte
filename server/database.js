import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'store.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    old_price REAL,
    image TEXT,
    category_id INTEGER,
    stock INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );
`);

// Seed admin user
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password, is_admin) VALUES (?, ?, 1)').run('admin', hash);
  console.log('✅ Admin account created: admin / admin123');
}

// Seed categories
const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
if (catCount.c === 0) {
  const cats = [
    ['تلفزيونات', 'أحدث شاشات التلفاز بدقة عالية', null],
    ['ثلاجات', 'ثلاجات لجميع الأحجام والأنواع', null],
    ['غسالات', 'غسالات أوتوماتيك وأمامية', null],
    ['مكيفات', 'مكيفات هواء سبليت وشباك', null],
    ['مطابخ', 'طباخات ومايكرويف وأفران', null],
    ['هواتف', 'أحدث الهواتف الذكية', null],
  ];
  const stmt = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)');
  cats.forEach(c => stmt.run(...c));
  console.log('✅ Categories seeded');
}

// Seed products
const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (prodCount.c === 0) {
  const products = [
    ['تلفزيون سامسونج 55 بوصة 4K', 'شاشة QLED بدقة 4K مع تقنية HDR المتقدمة', 850000, 1000000, null, 1, 15, 1],
    ['تلفزيون LG OLED 65 بوصة', 'جودة صورة لا مثيل لها مع تقنية OLED', 1200000, 1400000, null, 1, 8, 1],
    ['ثلاجة سامسونج Side by Side', 'ثلاجة 650 لتر مع ديسبنسر مياه', 950000, 1100000, null, 2, 10, 1],
    ['ثلاجة LG 450 لتر', 'ثلاجة نوفروست بتصميم أنيق', 650000, 750000, null, 2, 20, 0],
    ['غسالة أوتوماتيك Samsung 12 كيلو', 'غسالة ذكية بتقنية AI Wash', 520000, 600000, null, 3, 12, 1],
    ['مكيف سبليت Gree 2 طن', 'مكيف انفيرتر بكفاءة عالية', 480000, 550000, null, 4, 25, 1],
    ['مكيف شباك LG 1.5 طن', 'مكيف اقتصادي مناسب للغرف الصغيرة', 220000, 260000, null, 4, 30, 0],
    ['طباخ Bompani 5 شعلة', 'طباخ غاز بشعلة إيطالية', 380000, 420000, null, 5, 18, 0],
    ['ايفون 15 Pro Max', 'أحدث هاتف من آبل بكاميرا 48 ميغا', 1500000, 1700000, null, 6, 5, 1],
    ['سامسونج Galaxy S24 Ultra', 'هاتف أندرويد الأفضل بقلم S Pen', 1350000, 1500000, null, 6, 7, 1],
  ];
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, old_price, image, category_id, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  products.forEach(p => stmt.run(...p));
  console.log('✅ Products seeded');
}

export default db;
