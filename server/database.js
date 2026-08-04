import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// On Vercel: set DATABASE_URL. On Replit: set NEON_DATABASE_URL.
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);

async function initialize() {
  // Session table for connect-pg-simple
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
    );
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      governorate TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      old_price REAL,
      image TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      stock INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seed admin
  const adminRes = await pool.query("SELECT id FROM users WHERE username = 'admin'");
  if (adminRes.rows.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    await pool.query("INSERT INTO users (username, password, is_admin) VALUES ('admin', $1, 1)", [hash]);
    console.log('✅ Admin created: admin / admin123');
  }

  // Seed categories
  const catRes = await pool.query("SELECT COUNT(*) as c FROM categories");
  if (Number(catRes.rows[0].c) === 0) {
    const cats = [
      ['محاصيل شتوية', 'بذور المحاصيل الموسمية الشتوية مثل القمح والشعير والبصل'],
      ['محاصيل صيفية', 'بذور المحاصيل الصيفية مثل الطماطم والخيار والفلفل'],
      ['زينة صيفية', 'بذور نباتات الزينة التي تزهر في الصيف'],
      ['زينة شتوية', 'بذور نباتات الزينة التي تزهر في الشتاء'],
      ['بذور للاستنبات (المايكروجرين)', 'بذور مخصصة للإنبات السريع والمايكروجرين الصحي'],
    ];
    for (const [name, desc] of cats) {
      await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [name, desc]);
    }
    console.log('✅ Categories seeded');
  }

  // Seed products
  const prodRes = await pool.query("SELECT COUNT(*) as c FROM products");
  if (Number(prodRes.rows[0].c) === 0) {
    const products = [
      ['بذور بصل أبيض هجين F1', 'بذور بصل هجين عالي الإنتاج مناسب للزراعة الشتوية، حجم كبير ولون أبيض ناصع', 15000, 18000, null, 1, 100, 1],
      ['بذور قمح صلب ممتاز', 'قمح صلب مصفى مناسب للمناطق الباردة، إنتاجية عالية ومقاوم للصدأ', 25000, null, null, 1, 80, 0],
      ['بذور جزر نانتيس', 'جزر برتقالي حلو جذر متوسط الطول مناسب للتربة الطينية والرملية', 12000, 14000, null, 1, 120, 1],
      ['بذور طماطم هجين سوبر ميت', 'طماطم هجين عالية الإنتاج مقاومة للأمراض، ثمرة كبيرة لحمية', 20000, 24000, null, 2, 90, 1],
      ['بذور خيار هجين بارثينوكارب', 'خيار لا يحتاج تلقيح صناعي، مناسب للبيوت المحمية والمكشوفة', 18000, 22000, null, 2, 75, 1],
      ['بذور فلفل رومي أحمر', 'فلفل حلو ثمرة ضخمة ذات 4 فصوص مناسب للتصدير والسوق المحلي', 16000, null, null, 2, 60, 0],
      ['بذور زهرة عباد الشمس مزدوجة', 'عباد شمس مزدوج الأزهار بارتفاع 80سم مثالي للحدائق', 8000, 10000, null, 3, 200, 1],
      ['بذور زينيا مشكّل', 'خليط ألوان زينيا مبهجة تتحمل الحرارة وتزهر طوال الصيف', 7000, null, null, 3, 150, 0],
      ['بذور برسيم حجازي للزينة', 'غطاء أخضر كثيف مناسب لتجميل الحدائق في الشتاء', 10000, 12000, null, 4, 180, 0],
      ['بذور خزامى (لافندر) حقيقي', 'لافندر حقيقي ذو رائحة عطرية رائعة مناسب للمناطق الباردة', 14000, 16000, null, 4, 95, 1],
      ['بذور مايكروجرين برسيم أحمر', 'برسيم أحمر للاستنبات غني بالفيتامينات ينبت خلال 5-7 أيام', 9000, 11000, null, 5, 300, 1],
      ['بذور مايكروجرين عباد الشمس', 'حبوب عباد شمس مقشورة للاستنبات، لذيذة ومغذية جداً', 11000, 13000, null, 5, 250, 1],
      ['بذور مايكروجرين فجل داريكون', 'فجل حار ومقرمش للاستنبات، جاهز للحصاد خلال 6 أيام', 8500, null, null, 5, 280, 0],
    ];
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (name, description, price, old_price, image, category_id, stock, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        p
      );
    }
    console.log('✅ Products seeded');
  }

  // Seed default settings
  const defaultSettings = {
    store_name: 'بذور',
    store_tagline: 'وجهتك الأولى للبذور الزراعية',
    hero_title: 'أجود البذور الزراعية',
    hero_subtitle: 'لكل موسم وكل محصول',
    hero_desc: 'محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف',
    hero_btn_shop: '🛒 تسوق الآن',
    hero_btn_offers: '⭐ العروض المميزة',
    features: JSON.stringify([
      { icon: '🌿', title: 'بذور معتمدة', sub: 'جميع البذور مختبرة ومعتمدة' },
      { icon: '🚚', title: 'توصيل سريع', sub: 'توصيل لجميع المحافظات' },
    ]),
    footer_desc: 'وجهتك الأولى للبذور الزراعية الاحترافية — محاصيل، زينة، ومايكروجرين.',
    footer_phone: '07700000000',
    footer_email_contact: 'info@seeds-pro.com',
    footer_location: 'الاردن',
    footer_copyright: '© 2024 بذور — جميع الحقوق محفوظة',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: '',
  };
  for (const [k, v] of Object.entries(defaultSettings)) {
    await pool.query(
      "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
      [k, v]
    );
  }

  console.log('✅ Database initialized');
}

initialize().catch(err => console.error('DB init error:', err.message));

export default pool;
