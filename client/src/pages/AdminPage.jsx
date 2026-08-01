import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App.jsx';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#f0f4f8', border: 'none', borderRadius: 8, width: 34, height: 34, fontSize: 18, cursor: 'pointer', color: '#666' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductForm({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || '', description: initial?.description || '',
    price: initial?.price || '', old_price: initial?.old_price || '',
    category_id: initial?.category_id || '', stock: initial?.stock ?? 0,
    featured: initial?.featured === 1 ? '1' : '0',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    const url = initial ? `/api/products/${initial.id}` : '/api/products';
    const method = initial ? 'PUT' : 'POST';
    const res = await fetch(url, { method, credentials: 'include', body: fd });
    setLoading(false);
    if (res.ok) onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">اسم المنتج *</label>
        <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="form-label">الوصف</label>
        <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">السعر (د.ع) *</label>
          <input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">السعر القديم (د.ع)</label>
          <input className="form-input" type="number" value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))} min="0" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">القسم</label>
          <select className="form-select" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
            <option value="">بدون قسم</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">المخزون</label>
          <input className="form-input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">مميز</label>
        <select className="form-select" value={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.value }))}>
          <option value="0">لا</option>
          <option value="1">نعم ⭐</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">صورة المنتج</label>
        {initial?.image && !image && (
          <img src={initial.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8, display: 'block' }} />
        )}
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ fontSize: 13 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-outline">إلغاء</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '⏳ جاري الحفظ...' : '💾 حفظ'}</button>
      </div>
    </form>
  );
}

function CategoryForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ name: initial?.name || '', description: initial?.description || '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    const url = initial ? `/api/categories/${initial.id}` : '/api/categories';
    const method = initial ? 'PUT' : 'POST';
    const res = await fetch(url, { method, credentials: 'include', body: fd });
    setLoading(false);
    if (res.ok) onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">اسم القسم *</label>
        <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="form-label">الوصف</label>
        <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">صورة القسم</label>
        {initial?.image && !image && (
          <img src={initial.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8, display: 'block' }} />
        )}
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ fontSize: 13 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-outline">إلغاء</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '⏳...' : '💾 حفظ'}</button>
      </div>
    </form>
  );
}

const STATUS_MAP = {
  pending:   { label: '⏳ قيد المعالجة', bg: '#FFF8E1', color: '#FF6F00' },
  confirmed: { label: '✅ مؤكد',         bg: '#E8F5E9', color: '#2E7D32' },
  delivered: { label: '📦 تم التوصيل',   bg: '#E3F2FD', color: '#1565C0' },
  cancelled: { label: '❌ ملغي',          bg: '#FFEBEE', color: '#C62828' },
};

// ── Site Settings Tab ──
function SettingsTab({ toast, reloadSettings }) {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [features, setFeatures] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setS(data);
        setFeatures(Array.isArray(data.features) ? data.features : []);
        setLogoPreview(data.logo_url || '/logo.png');
      });
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async () => {
    if (!logoFile) return;
    const fd = new FormData();
    fd.append('logo', logoFile);
    const res = await fetch('/api/settings/logo', { method: 'POST', credentials: 'include', body: fd });
    const data = await res.json();
    if (res.ok) { setLogoFile(null); return data.logo_url; }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Upload logo first if changed
    if (logoFile) await uploadLogo();
    // Save settings
    const payload = { ...s, features };
    delete payload.logo_url;
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      toast('✅ تم حفظ الإعدادات بنجاح');
      reloadSettings();
    } else {
      toast('حدث خطأ أثناء الحفظ', 'error');
    }
  };

  if (!s) return <div className="spinner" style={{ marginTop: 60 }} />;

  const field = (label, key, placeholder, multiline) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {multiline
        ? <textarea className="form-textarea" value={s[key] || ''} onChange={e => setS(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} rows={2} />
        : <input className="form-input" value={s[key] || ''} onChange={e => setS(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
      }
    </div>
  );

  const sectionTitle = (title) => (
    <div style={{ fontWeight: 800, fontSize: 15, color: '#004729', margin: '28px 0 16px', paddingBottom: 8, borderBottom: '2px solid #e8f5e9' }}>{title}</div>
  );

  return (
    <form onSubmit={handleSave}>
      {/* Logo */}
      {sectionTitle('🖼️ الشعار (Logo)')}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <img src={logoPreview} alt="logo" style={{ width: 80, height: 80, objectFit: 'contain', border: '2px dashed #c8e6c9', borderRadius: 12, background: '#f0f9f4', padding: 6 }} />
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileRef.current.click()}
            className="btn btn-outline" style={{ marginBottom: 6 }}>
            📁 اختر شعار جديد
          </button>
          {logoFile && <div style={{ fontSize: 12, color: '#004729', marginTop: 4 }}>✅ {logoFile.name}</div>}
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>PNG / JPG — حتى 5MB</div>
        </div>
      </div>

      {/* Store identity */}
      {sectionTitle('🏪 هوية المتجر')}
      <div className="form-row">
        {field('اسم المتجر', 'store_name', 'بذور')}
        {field('الشعار التعريفي', 'store_tagline', 'وجهتك الأولى للبذور...')}
      </div>

      {/* Hero section */}
      {sectionTitle('🌟 قسم الهيرو (الصفحة الرئيسية)')}
      <div className="form-row">
        {field('العنوان الكبير', 'hero_title', 'أجود البذور الزراعية')}
        {field('العنوان الثانوي', 'hero_subtitle', 'لكل موسم وكل محصول')}
      </div>
      {field('الوصف', 'hero_desc', 'محاصيل شتوية وصيفية...', true)}
      <div className="form-row">
        {field('نص زر "تسوق"', 'hero_btn_shop', '🛒 تسوق الآن')}
        {field('نص زر "العروض"', 'hero_btn_offers', '⭐ العروض المميزة')}
      </div>

      {/* Features */}
      {sectionTitle('✨ مميزات المتجر (4 مربعات)')}
      {features.map((f, i) => (
        <div key={i} style={{ background: '#f8fdf9', border: '1px solid #c8e6c9', borderRadius: 10, padding: '14px 18px', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#555', marginBottom: 10 }}>مميزة #{i + 1}</div>
          <div className="form-row" style={{ gap: 10 }}>
            <div className="form-group" style={{ flex: '0 0 80px' }}>
              <label className="form-label">أيقونة</label>
              <input className="form-input" value={f.icon} onChange={e => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} placeholder="🌿" style={{ fontSize: 20, textAlign: 'center' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">العنوان</label>
              <input className="form-input" value={f.title} onChange={e => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">الوصف</label>
              <input className="form-input" value={f.sub} onChange={e => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, sub: e.target.value } : x))} />
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      {sectionTitle('📋 الفوتر')}
      {field('وصف المتجر في الفوتر', 'footer_desc', 'وجهتك الأولى...', true)}
      <div className="form-row">
        {field('رقم الهاتف', 'footer_phone', '07700000000')}
        {field('البريد الإلكتروني', 'footer_email_contact', 'info@seeds-pro.com')}
      </div>
      <div className="form-row">
        {field('الموقع / المدينة', 'footer_location', 'العراق')}
        {field('نص حقوق النشر', 'footer_copyright', '© 2024 بذور')}
      </div>

      {/* SMTP */}
      {sectionTitle('📧 إعدادات البريد الإلكتروني (SMTP)')}
      <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#666' }}>
        💡 مطلوب لإرسال تأكيد الطلبات وإشعارات الحالة للعملاء تلقائياً.
        يمكن استخدام Gmail (app password) أو أي خادم SMTP.
      </div>
      <div className="form-row">
        {field('SMTP Host', 'smtp_host', 'smtp.gmail.com')}
        {field('Port', 'smtp_port', '587')}
      </div>
      <div className="form-row">
        {field('اسم المستخدم / الإيميل', 'smtp_user', 'example@gmail.com')}
        <div className="form-group">
          <label className="form-label">كلمة المرور (App Password)</label>
          <input className="form-input" type="password" value={s.smtp_pass || ''} onChange={e => setS(p => ({ ...p, smtp_pass: e.target.value }))} placeholder="••••••••••••" />
        </div>
      </div>
      {field('من (from)', 'smtp_from', '"بذور" <noreply@seeds-pro.com>')}

      <div style={{ marginTop: 28 }}>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '13px 40px', fontSize: 16 }}>
          {saving ? '⏳ جاري الحفظ...' : '💾 حفظ جميع الإعدادات'}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { toast, reloadSettings } = useApp();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    const [prods, cats, ords] = await Promise.all([
      fetch('/api/products?limit=200', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/categories', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/orders', { credentials: 'include' }).then(r => r.json()),
    ]);
    setProducts(prods); setCategories(cats); setOrders(ords);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const updateOrderStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast('تم تحديث حالة الطلب');
  };

  const handleDelete = async () => {
    const { type, id } = deleteConfirm;
    const url = type === 'product' ? `/api/products/${id}` : type === 'category' ? `/api/categories/${id}` : `/api/orders/${id}`;
    await fetch(url, { method: 'DELETE', credentials: 'include' });
    setDeleteConfirm(null);
    loadAll();
    toast('تم الحذف بنجاح');
  };

  const filteredProducts = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (t) => ({
    padding: '12px 22px', background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14,
    color: tab === t ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
    borderBottom: tab === t ? '3px solid var(--accent)' : 'none',
    transition: '0.2s',
  });

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      {/* Admin Header */}
      <div style={{ background: '#004729', padding: '28px 0 0' }}>
        <div className="container" style={{ padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
            ⚙️ لوحة التحكم
          </h1>
          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'إجمالي المنتجات', value: products.length, icon: '📦', color: '#fff' },
              { label: 'الأقسام', value: categories.length, icon: '📂', color: '#fff' },
              { label: 'مميز', value: products.filter(p => p.featured).length, icon: '⭐', color: '#FFD700' },
              { label: 'طلبات جديدة', value: pendingOrders, icon: '🛒', color: pendingOrders > 0 ? '#FFD700' : '#fff' },
              { label: 'إجمالي الطلبات', value: orders.length, icon: '📋', color: '#fff' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 20px', minWidth: 130, flex: 1 }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div style={{ color: s.color, fontWeight: 900, fontSize: 24 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setTab('products')} style={tabStyle('products')}>📦 المنتجات</button>
            <button onClick={() => setTab('categories')} style={tabStyle('categories')}>📂 الأقسام</button>
            <button onClick={() => setTab('orders')} style={{ ...tabStyle('orders'), position: 'relative' }}>
              📋 الطلبات
              {pendingOrders > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  background: '#FFD700', color: '#004729', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 11, fontWeight: 900,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{pendingOrders}</span>
              )}
            </button>
            <button onClick={() => setTab('settings')} style={tabStyle('settings')}>⚙️ إعدادات الموقع</button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {tab !== 'settings' && (
        <div style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <div className="container" style={{ padding: '20px 20px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {tab === 'products' ? (
                <>
                  <input className="form-input" style={{ maxWidth: 280, flex: 1 }} placeholder="🔍 بحث في المنتجات..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                  <button onClick={() => setModal({ type: 'add-product' })} className="btn btn-accent">
                    + إضافة منتج
                  </button>
                </>
              ) : tab === 'categories' ? (
                <button onClick={() => setModal({ type: 'add-cat' })} className="btn btn-accent">
                  + إضافة قسم
                </button>
              ) : (
                <div style={{ color: 'var(--text-light)', fontSize: 14 }}>
                  إجمالي الطلبات: <strong>{orders.length}</strong> — قيد المعالجة: <strong style={{ color: '#FF6F00' }}>{pendingOrders}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: tab === 'settings' ? '32px 20px 48px' : '0 20px 48px' }}>
        {/* ── Site Settings Tab ── */}
        {tab === 'settings' && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', padding: '32px 36px', border: '1px solid var(--border)' }}>
            <SettingsTab toast={toast} reloadSettings={reloadSettings} />
          </div>
        )}

        {tab !== 'settings' && (loading ? <div className="spinner" /> : (
          <>
            {/* ── Products Tab ── */}
            {tab === 'products' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#f5f7fa', borderBottom: '2px solid var(--border)' }}>
                      {['#', 'المنتج', 'القسم', 'السعر', 'المخزون', 'مميز', 'إجراءات'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>لا توجد منتجات</td></tr>
                    ) : filteredProducts.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f9fbff'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 16px', color: '#aaa', width: 40 }}>{i + 1}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#f0f4f8', flexShrink: 0 }}>
                              {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                              {p.old_price && <div style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>{p.old_price.toLocaleString()} د.ع</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: '#e8f5e9', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                            {p.category_name || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                          {p.price.toLocaleString()} د.ع
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{p.featured ? '⭐' : '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setModal({ type: 'edit-product', data: p })}
                              style={{ background: '#e8f5e9', color: 'var(--primary)', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>✏️ تعديل</button>
                            <button onClick={() => setDeleteConfirm({ type: 'product', id: p.id, name: p.name })}
                              style={{ background: '#fce4e4', color: '#c62828', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>🗑️ حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Categories Tab ── */}
            {tab === 'categories' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
                      {cat.image ? <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📂'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 8 }}>{cat.product_count} منتج</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setModal({ type: 'edit-cat', data: cat })}
                          style={{ background: '#e8f5e9', color: 'var(--primary)', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 12 }}>✏️ تعديل</button>
                        <button onClick={() => setDeleteConfirm({ type: 'category', id: cat.id, name: cat.name })}
                          style={{ background: '#fce4e4', color: '#c62828', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 12 }}>🗑️ حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Orders Tab ── */}
            {tab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📋</div>
                    <h3>لا توجد طلبات بعد</h3>
                    <p style={{ color: 'var(--text-light)', marginTop: 8 }}>ستظهر هنا الطلبات عند وصولها</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map(order => {
                      const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                      const isExpanded = expandedOrder === order.id;
                      return (
                        <div key={order.id} style={{ background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', flexWrap: 'wrap', cursor: 'pointer' }}
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                            <div style={{ background: '#f0f9f4', borderRadius: 10, padding: '8px 14px', minWidth: 60, textAlign: 'center' }}>
                              <div style={{ fontWeight: 900, fontSize: 18, color: '#004729' }}>#{order.id}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 180 }}>
                              <div style={{ fontWeight: 700, fontSize: 15 }}>{order.customer_name}</div>
                              <div style={{ color: '#888', fontSize: 13 }}>📞 {order.customer_phone}{order.customer_email && <> · 📧 {order.customer_email}</>}</div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: 100 }}>
                              <div style={{ fontWeight: 900, fontSize: 16, color: '#004729' }}>{Number(order.total).toLocaleString()}</div>
                              <div style={{ fontSize: 12, color: '#aaa' }}>دينار عراقي</div>
                            </div>
                            <div style={{ minWidth: 120 }}>
                              <span style={{ background: s.bg, color: s.color, padding: '5px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13 }}>
                                {s.label}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: '#aaa', minWidth: 130 }}>
                              {new Date(order.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div style={{ color: '#aaa', fontSize: 18 }}>{isExpanded ? '▲' : '▼'}</div>
                          </div>

                          {isExpanded && (
                            <div style={{ borderTop: '1px solid var(--border)', padding: '18px 22px', background: '#fafafa' }}>
                              <div style={{ marginBottom: 16 }}>
                                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>🧾 تفاصيل الطلب</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {(order.items || []).map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid #eee', fontSize: 14 }}>
                                      <span>{item.name} × {item.qty}</span>
                                      <span style={{ fontWeight: 700, color: '#004729' }}>{(item.price * item.qty).toLocaleString()} د.ع</span>
                                    </div>
                                  ))}
                                </div>
                                {order.notes && (
                                  <div style={{ marginTop: 10, background: '#fff8e1', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: '#666', border: '1px solid #ffe082' }}>
                                    📝 ملاحظة: {order.notes}
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>تغيير الحالة:</span>
                                {Object.entries(STATUS_MAP).map(([key, val]) => (
                                  <button key={key} onClick={() => updateOrderStatus(order.id, key)}
                                    style={{
                                      background: order.status === key ? val.color : val.bg,
                                      color: order.status === key ? '#fff' : val.color,
                                      border: `1.5px solid ${val.color}`,
                                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                                      fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 13,
                                    }}>
                                    {val.label}
                                  </button>
                                ))}
                                <button onClick={() => setDeleteConfirm({ type: 'order', id: order.id, name: `طلب #${order.id}` })}
                                  style={{ marginRight: 'auto', background: '#fce4e4', color: '#c62828', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>
                                  🗑️ حذف
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ))}
      </div>

      {/* Modals */}
      {modal?.type === 'add-product' && (
        <Modal title="إضافة منتج جديد" onClose={() => setModal(null)}>
          <ProductForm categories={categories} onSave={() => { setModal(null); loadAll(); toast('تمت إضافة المنتج بنجاح'); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'edit-product' && (
        <Modal title="تعديل المنتج" onClose={() => setModal(null)}>
          <ProductForm initial={modal.data} categories={categories} onSave={() => { setModal(null); loadAll(); toast('تم تعديل المنتج بنجاح'); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'add-cat' && (
        <Modal title="إضافة قسم جديد" onClose={() => setModal(null)}>
          <CategoryForm onSave={() => { setModal(null); loadAll(); toast('تمت إضافة القسم بنجاح'); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'edit-cat' && (
        <Modal title="تعديل القسم" onClose={() => setModal(null)}>
          <CategoryForm initial={modal.data} onSave={() => { setModal(null); loadAll(); toast('تم تعديل القسم بنجاح'); }} onClose={() => setModal(null)} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🗑️</div>
            <h2 style={{ color: '#c62828' }}>تأكيد الحذف</h2>
            <p style={{ color: 'var(--text-light)', margin: '12px 0 24px', lineHeight: 1.7 }}>
              هل أنت متأكد من حذف <strong>{deleteConfirm.name}</strong>؟<br />
              <span style={{ color: '#c62828', fontSize: 13 }}>لا يمكن التراجع عن هذا الإجراء</span>
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-outline">إلغاء</button>
              <button onClick={handleDelete} className="btn btn-danger">🗑️ نعم، احذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
