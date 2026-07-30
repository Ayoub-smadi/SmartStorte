import { useState, useEffect } from 'react';
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
            <option value="">-- اختر القسم --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">الكمية في المخزن</label>
          <input className="form-input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">منتج مميز</label>
          <select className="form-select" value={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.value }))}>
            <option value="0">لا</option>
            <option value="1">نعم ⭐</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">صورة المنتج</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
            style={{ padding: 6, border: '1.5px solid var(--border)', borderRadius: 8, width: '100%', fontSize: 13 }} />
        </div>
      </div>
      {initial?.image && !image && (
        <div style={{ marginBottom: 14 }}>
          <img src={initial.image} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-outline">إلغاء</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ جاري الحفظ...' : '💾 حفظ'}
        </button>
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
    fd.append('name', form.name);
    fd.append('description', form.description);
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
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
          style={{ padding: 6, border: '1.5px solid var(--border)', borderRadius: 8, width: '100%', fontSize: 13 }} />
      </div>
      {initial?.image && !image && (
        <img src={initial.image} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} />
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-outline">إلغاء</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ جاري الحفظ...' : '💾 حفظ'}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { toast } = useApp();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'add-product' | 'edit-product' | 'add-cat' | 'edit-cat', data? }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, name }
  const [search, setSearch] = useState('');

  const loadAll = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      fetch('/api/products?limit=200', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/categories', { credentials: 'include' }).then(r => r.json()),
    ]);
    setProducts(p); setCategories(c); setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const url = deleteConfirm.type === 'product' ? `/api/products/${deleteConfirm.id}` : `/api/categories/${deleteConfirm.id}`;
    const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { toast('تم الحذف بنجاح', 'success'); loadAll(); }
    else toast('فشل الحذف', 'error');
    setDeleteConfirm(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name || '').includes(search)
  );

  const tabStyle = (t) => ({
    padding: '10px 24px', borderRadius: '10px 10px 0 0', border: 'none',
    fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer',
    background: tab === t ? '#fff' : 'transparent',
    color: tab === t ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
    borderBottom: tab === t ? '3px solid var(--accent)' : 'none',
    transition: '0.2s',
  });

  return (
    <div>
      {/* Admin Header */}
      <div style={{ background: 'linear-gradient(135deg, #1565C0, #0D47A1)', padding: '28px 0 0' }}>
        <div className="container" style={{ padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 20 }}>
            ⚙️ لوحة التحكم
          </h1>
          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'إجمالي المنتجات', value: products.length, icon: '📦', color: '#fff' },
              { label: 'الأقسام', value: categories.length, icon: '📂', color: '#fff' },
              { label: 'مميز', value: products.filter(p => p.featured).length, icon: '⭐', color: '#FFD700' },
              { label: 'نفذ المخزون', value: products.filter(p => p.stock === 0).length, icon: '⚠️', color: '#FF6F00' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '16px 24px', minWidth: 140, flex: 1 }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ color: s.color, fontWeight: 900, fontSize: 24 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setTab('products')} style={tabStyle('products')}>📦 المنتجات</button>
            <button onClick={() => setTab('categories')} style={tabStyle('categories')}>📂 الأقسام</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div className="container" style={{ padding: '24px 20px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {tab === 'products' ? (
              <>
                <input className="form-input" style={{ maxWidth: 280, flex: 1 }} placeholder="🔍 بحث في المنتجات..."
                  value={search} onChange={e => setSearch(e.target.value)} />
                <button onClick={() => setModal({ type: 'add-product' })} className="btn btn-accent">
                  + إضافة منتج
                </button>
              </>
            ) : (
              <button onClick={() => setModal({ type: 'add-cat' })} className="btn btn-accent">
                + إضافة قسم
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px 48px' }}>
        {loading ? <div className="spinner" /> : (
          <>
            {/* Products Tab */}
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
                          <span style={{ background: '#e3f0ff', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                            {p.category_name || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                          {p.price.toLocaleString()} د.ع
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          {p.featured ? '⭐' : '—'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setModal({ type: 'edit-product', data: p })}
                              style={{ background: '#e3f0ff', color: 'var(--primary)', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>
                              ✏️ تعديل
                            </button>
                            <button onClick={() => setDeleteConfirm({ type: 'product', id: p.id, name: p.name })}
                              style={{ background: '#fce4e4', color: '#c62828', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>
                              🗑️ حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Categories Tab */}
            {tab === 'categories' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #e3f0ff, #c8dffe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
                      {cat.image ? <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📂'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 8 }}>{cat.product_count} منتج</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setModal({ type: 'edit-cat', data: cat })}
                          style={{ background: '#e3f0ff', color: 'var(--primary)', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 12 }}>
                          ✏️ تعديل
                        </button>
                        <button onClick={() => setDeleteConfirm({ type: 'category', id: cat.id, name: cat.name })}
                          style={{ background: '#fce4e4', color: '#c62828', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 12 }}>
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
