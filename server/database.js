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

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
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
    ['محاصيل شتوية', 'بذور المحاصيل الموسمية الشتوية مثل القمح والشعير والبصل', null],
    ['محاصيل صيفية', 'بذور المحاصيل الصيفية مثل الطماطم والخيار والفلفل', null],
    ['زينة صيفية', 'بذور نباتات الزينة التي تزهر في الصيف', null],
    ['زينة شتوية', 'بذور نباتات الزينة التي تزهر في الشتاء', null],
    ['بذور للاستنبات (المايكروجرين)', 'بذور مخصصة للإنبات السريع والمايكروجرين الصحي', null],
  ];
  const stmt = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)');
  cats.forEach(c => stmt.run(...c));
  console.log('✅ Categories seeded');
}

// Seed products
const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (prodCount.c === 0) {
  const products = [
    // محاصيل شتوية
    ['بذور بصل أبيض هجين F1', 'بذور بصل هجين عالي الإنتاج مناسب للزراعة الشتوية، حجم كبير ولون أبيض ناصع', 15000, 18000, null, 1, 100, 1],
    ['بذور قمح صلب ممتاز', 'قمح صلب مصفى مناسب للمناطق الباردة، إنتاجية عالية ومقاوم للصدأ', 25000, null, null, 1, 80, 0],
    ['بذور جزر نانتيس', 'جزر برتقالي حلو جذر متوسط الطول مناسب للتربة الطينية والرملية', 12000, 14000, null, 1, 120, 1],
    // محاصيل صيفية
    ['بذور طماطم هجين سوبر ميت', 'طماطم هجين عالية الإنتاج مقاومة للأمراض، ثمرة كبيرة لحمية', 20000, 24000, null, 2, 90, 1],
    ['بذور خيار هجين بارثينوكارب', 'خيار لا يحتاج تلقيح صناعي، مناسب للبيوت المحمية والمكشوفة', 18000, 22000, null, 2, 75, 1],
    ['بذور فلفل رومي أحمر', 'فلفل حلو ثمرة ضخمة ذات 4 فصوص مناسب للتصدير والسوق المحلي', 16000, null, null, 2, 60, 0],
    // زينة صيفية
    ['بذور زهرة عباد الشمس مزدوجة', 'عباد شمس مزدوج الأزهار بارتفاع 80سم مثالي للحدائق', 8000, 10000, null, 3, 200, 1],
    ['بذور زينيا مشكّل', 'خليط ألوان زينيا مبهجة تتحمل الحرارة وتزهر طوال الصيف', 7000, null, null, 3, 150, 0],
    // زينة شتوية
    ['بذور برسيم حجازي للزينة', 'غطاء أخضر كثيف مناسب لتجميل الحدائق في الشتاء', 10000, 12000, null, 4, 180, 0],
    ['بذور خزامى (لافندر) حقيقي', 'لافندر حقيقي ذو رائحة عطرية رائعة مناسب للمناطق الباردة', 14000, 16000, null, 4, 95, 1],
    // مايكروجرين
    ['بذور مايكروجرين برسيم أحمر', 'برسيم أحمر للاستنبات غني بالفيتامينات ينبت خلال 5-7 أيام', 9000, 11000, null, 5, 300, 1],
    ['بذور مايكروجرين عباد الشمس', 'حبوب عباد شمس مقشورة للاستنبات، لذيذة ومغذية جداً', 11000, 13000, null, 5, 250, 1],
    ['بذور مايكروجرين فجل داريكون', 'فجل حار ومقرمش للاستنبات، جاهز للحصاد خلال 6 أيام', 8500, null, null, 5, 280, 0],
  ];
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, old_price, image, category_id, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  products.forEach(p => stmt.run(...p));
  console.log('✅ Products seeded');
}

export default db;
