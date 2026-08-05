-- ===== SEEDS STORE DATA =====

-- Categories
INSERT INTO categories (id, name, description, image, created_at) VALUES (1, 'محاصيل شتوية', 'بذور المحاصيل الموسمية الشتوية مثل القمح والشعير والبصل', NULL, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;
INSERT INTO categories (id, name, description, image, created_at) VALUES (2, 'محاصيل صيفية', 'بذور المحاصيل الصيفية مثل الطماطم والخيار والفلفل', NULL, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;
INSERT INTO categories (id, name, description, image, created_at) VALUES (3, 'زينة صيفية', 'بذور نباتات الزينة التي تزهر في الصيف', NULL, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;
INSERT INTO categories (id, name, description, image, created_at) VALUES (4, 'زينة شتوية', 'بذور نباتات الزينة التي تزهر في الشتاء', NULL, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;
INSERT INTO categories (id, name, description, image, created_at) VALUES (5, 'بذور للاستنبات (المايكروجرين)', 'بذور مخصصة للإنبات السريع والمايكروجرين الصحي', NULL, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description;

-- Products
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (1, 'بذور بصل أبيض هجين F1', 'بذور بصل هجين عالي الإنتاج مناسب للزراعة الشتوية، حجم كبير ولون أبيض ناصع', 15000, 18000, NULL, 1, 100, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (2, 'بذور قمح صلب ممتاز', 'قمح صلب مصفى مناسب للمناطق الباردة، إنتاجية عالية ومقاوم للصدأ', 25000, NULL, NULL, 1, 80, 0, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (3, 'بذور جزر نانتيس', 'جزر برتقالي حلو جذر متوسط الطول مناسب للتربة الطينية والرملية', 12000, 14000, NULL, 1, 120, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (4, 'بذور طماطم هجين سوبر ميت', 'طماطم هجين عالية الإنتاج مقاومة للأمراض، ثمرة كبيرة لحمية', 20000, 24000, NULL, 2, 90, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (5, 'بذور خيار هجين بارثينوكارب', 'خيار لا يحتاج تلقيح صناعي، مناسب للبيوت المحمية والمكشوفة', 18000, 22000, NULL, 2, 75, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (6, 'بذور فلفل رومي أحمر', 'فلفل حلو ثمرة ضخمة ذات 4 فصوص مناسب للتصدير والسوق المحلي', 16000, NULL, NULL, 2, 60, 0, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (7, 'بذور زهرة عباد الشمس مزدوجة', 'عباد شمس مزدوج الأزهار بارتفاع 80سم مثالي للحدائق', 8000, 10000, NULL, 3, 200, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (8, 'بذور زينيا مشكّل', 'خليط ألوان زينيا مبهجة تتحمل الحرارة وتزهر طوال الصيف', 7000, NULL, NULL, 3, 150, 0, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (9, 'بذور برسيم حجازي للزينة', 'غطاء أخضر كثيف مناسب لتجميل الحدائق في الشتاء', 10000, 12000, NULL, 4, 180, 0, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (10, 'بذور خزامى (لافندر) حقيقي', 'لافندر حقيقي ذو رائحة عطرية رائعة مناسب للمناطق الباردة', 14000, 16000, NULL, 4, 95, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (11, 'بذور مايكروجرين برسيم أحمر', 'برسيم أحمر للاستنبات غني بالفيتامينات ينبت خلال 5-7 أيام', 9000, 11000, NULL, 5, 300, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (12, 'بذور مايكروجرين عباد الشمس', 'حبوب عباد شمس مقشورة للاستنبات، لذيذة ومغذية جداً', 11000, 13000, NULL, 5, 250, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;
INSERT INTO products (id, name, description, price, old_price, image, category_id, stock, featured, created_at) VALUES (13, 'بذور مايكروجرين فجل داريكون', 'فجل حار ومقرمش للاستنبات، جاهز للحصاد خلال 6 أيام', 8500, NULL, NULL, 5, 280, 0, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;

-- Site Settings
INSERT INTO site_settings (key, value) VALUES ('store_name', 'بذور') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('store_tagline', 'وجهتك الأولى للبذور الزراعية') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('hero_title', 'أجود البذور الزراعية') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('hero_subtitle', 'لكل موسم وكل محصول') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('hero_desc', 'محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('hero_btn_shop', '🛒 تسوق الآن') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('hero_btn_offers', '⭐ العروض المميزة') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('features', '[{"icon":"🌿","title":"بذور معتمدة","sub":"جميع البذور مختبرة ومعتمدة"},{"icon":"🚚","title":"توصيل سريع","sub":"توصيل لجميع المحافظات"}]') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('footer_desc', 'وجهتك الأولى للبذور الزراعية الاحترافية — محاصيل، زينة، ومايكروجرين.') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('footer_phone', '07700000000') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('footer_email_contact', 'info@seeds-pro.com') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('footer_location', 'الاردن') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('footer_copyright', '© 2024 بذور — جميع الحقوق محفوظة') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('smtp_host', '') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('smtp_port', '587') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('smtp_user', '') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('smtp_pass', '') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;
INSERT INTO site_settings (key, value) VALUES ('smtp_from', '') ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;

-- Admin user (password: admin123)
INSERT INTO users (id, username, password, email, is_admin, created_at) VALUES (1, 'admin', '$2a$10$rpnjftQrohcGKPf2VjJ0TeWUd.8GziaYA8mYsxJlmVuZf4zgmrM9S', NULL, 1, 'Wed Aug 05 2026 11:17:44 GMT+0000 (Coordinated Universal Time)') ON CONFLICT (id) DO NOTHING;

-- Fix sequences
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
