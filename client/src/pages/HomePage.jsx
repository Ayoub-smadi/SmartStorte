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
        background: 'linear-gradient(135deg, #095405 0%, #0D6E08 50%, #138A0D 100%)',
        padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 25% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 25%, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,166,35,0.2)', color: '#F5A623', padding: '6px 20px', borderRadius: 30, fontSize: 14, fontWeight: 700, marginBottom: 20, border: '1px solid rgba(245,166,35,0.45)' }}>
            🌱 بذور زراعية للمحترفين
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            أجود البذور الزراعية<br />
            <span style={{ color: '#F5A623' }}>لكل موسم وكل محصول</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginBottom: 36, lineHeight: 1.8 }}>
            محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/products" className="btn btn-accent" style={{ fontSize: 16, padding: '13px 32px' }}>
              🛒 تسوق الآن
            </a>
            <a href="#/products?featured=1" style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.5)',
              padding: '13px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
              ⭐ العروض المميزة
            </a>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 60, flexWrap: 'wrap' }}>
          {[['100+', 'صنف من البذور'], ['5', 'أقسام رئيسية'], ['توصيل', 'سريع'], ['جودة', 'مضمونة']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#F5A623', fontSize: 26, fontWeight: 900 }}>{val}</div>
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
        <div style={{ background: 'linear-gradient(135deg, #f5f9ee, #edf5e1)', padding: '60px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: '#0D6E08' }}>⭐ منتجات مميزة</h2>
              <a href="#/products?featured=1" style={{ color: '#0D6E08', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
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
      <div style={{ background: 'linear-gradient(135deg, #0D6E08, #095405)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30, textAlign: 'center' }}>
            {[
              ['🌿', 'بذور معتمدة', 'جميع البذور مختبرة ومعتمدة'],
              ['🚚', 'توصيل سريع', 'توصيل لجميع المحافظات'],
              ['📦', 'تعبئة محكمة', 'تعبئة تحافظ على حيوية البذور'],
              ['🤝', 'دعم فني', 'إرشاد زراعي مجاني مع كل طلب'],
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
