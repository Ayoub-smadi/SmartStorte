import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductsPage({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(categoryId || '');
  const [featured, setFeatured] = useState(false);

  // Read search param from hash
  useEffect(() => {
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const params = new URLSearchParams(hash.slice(qIndex + 1));
      setSearch(params.get('search') || '');
      setFeatured(params.get('featured') === '1');
    }
  }, []);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCat) params.set('category', activeCat);
    if (search) params.set('search', search);
    if (featured) params.set('featured', '1');
    params.set('limit', '60');
    fetch(`/api/products?${params}`).then(r => r.json()).then(data => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCat, search, featured]);

  const currentCat = categories.find(c => String(c.id) === String(activeCat));

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
          {featured ? '⭐ العروض المميزة' : currentCat ? currentCat.name : '🛒 جميع المنتجات'}
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: 14 }}>
          {search ? `نتائج البحث عن: "${search}"` : `${products.length} منتج متوفر`}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 'var(--radius)', padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}
          className="sidebar">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--text)' }}>تصفية حسب القسم</div>
          <button
            onClick={() => { setActiveCat(''); setFeatured(false); }}
            style={{
              display: 'block', width: '100%', textAlign: 'right',
              padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: !activeCat && !featured ? 'var(--primary)' : 'transparent',
              color: !activeCat && !featured ? '#fff' : 'var(--text)',
              fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 6
            }}>
            كل المنتجات
          </button>
          <button
            onClick={() => { setActiveCat(''); setFeatured(true); }}
            style={{
              display: 'block', width: '100%', textAlign: 'right',
              padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: featured ? '#FF6F00' : 'transparent',
              color: featured ? '#fff' : 'var(--text)',
              fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14, marginBottom: 12
            }}>
            ⭐ مميز
          </button>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => { setActiveCat(String(cat.id)); setFeatured(false); }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: String(activeCat) === String(cat.id) ? 'var(--primary)' : 'transparent',
                  color: String(activeCat) === String(cat.id) ? '#fff' : 'var(--text)',
                  fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14, width: '100%', textAlign: 'right'
                }}>
                <span>{cat.name}</span>
                <span style={{ fontSize: 12, opacity: 0.75 }}>{cat.product_count}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? <div className="spinner" /> : products.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📦</div>
              <h3>لا توجد منتجات</h3>
              <p>لا توجد منتجات تطابق بحثك، جرب قسماً آخر</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
