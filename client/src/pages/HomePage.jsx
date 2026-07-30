import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/products?featured=1&limit=8').then(r => r.json()),
      fetch('/api/products?limit=8').then(r => r.json()),
    ]).then(([cats, feat, lat]) => {
      setCategories(cats);
      setFeatured(feat);
      setLatest(lat);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
        padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,111,0,0.2)', color: '#FF6F00', padding: '6px 20px', borderRadius: 30, fontSize: 14, fontWeight: 700, marginBottom: 20, border: '1px solid rgba(255,111,0,0.4)' }}>
            🛒 تسوق أجهزتك المنزلية
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            أفضل الأجهزة الكهربائية<br />
            <span style={{ color: '#FF6F00' }}>بأفضل الأسعار</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36, lineHeight: 1.8 }}>
            تشكيلة واسعة من التلفزيونات، الثلاجات، الغسالات، المكيفات وأكثر
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/products" className="btn btn-accent" style={{ fontSize: 16, padding: '13px 32px' }}>
              🛍️ تسوق الآن
            </a>
            <a href="#/products?featured=1" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', fontSize: 16, padding: '13px 32px' }}>
              ⭐ العروض المميزة
            </a>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 60, flexWrap: 'wrap' }}>
          {[['100+', 'منتج متوفر'], ['6', 'أقسام رئيسية'], ['توصيل', 'سريع'], ['ضمان', 'سنة كاملة']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#FF6F00', fontSize: 26, fontWeight: 900 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">تصفح الأقسام</h2>
            <a href="#/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
          </div>
          <div className="categories-grid">
            {categories.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #fff8e1, #fff3cd)', padding: '60px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: '#FF6F00' }}>⭐ العروض المميزة</h2>
              <a href="#/products?featured=1" style={{ color: '#FF6F00', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Latest */}
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🆕 أحدث المنتجات</h2>
            <a href="#/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
          </div>
          <div className="products-grid">
            {latest.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ background: 'var(--primary)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30, textAlign: 'center' }}>
            {[
              ['🚚', 'توصيل سريع', 'توصيل لجميع المحافظات'],
              ['🔒', 'دفع آمن', 'طرق دفع متعددة وآمنة'],
              ['↩️', 'إرجاع سهل', 'إرجاع خلال 7 أيام'],
              ['🛠️', 'ضمان سنة', 'ضمان على جميع المنتجات'],
            ].map(([icon, title, sub]) => (
              <div key={title}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>{icon}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
