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
      setCategories(cats); setFeatured(feat); setLatest(lat); setLoading(false);
    });
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: '#2A2A2A',
        padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(109,197,52,1) 1px, transparent 1px), linear-gradient(90deg, rgba(109,197,52,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Green glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(109,197,52,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          {/* Logo badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
            <svg width="52" height="52" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="20" stroke="#6DC534" strokeWidth="2.5" fill="rgba(109,197,52,0.1)"/>
              <polygon points="23,7 14,23 21,23 19,35 28,19 21,19" fill="#6DC534"/>
            </svg>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>بذور زراعية</div>
              <div style={{ color: '#6DC534', fontSize: 13, fontWeight: 700 }}>للمحترفين</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 5vw, 50px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            أجود البذور الزراعية<br/>
            <span style={{ color: '#6DC534' }}>لكل موسم وكل محصول</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, marginBottom: 38, lineHeight: 1.8 }}>
            محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/products" style={{
              background: '#6DC534', color: '#1C1C1C', fontWeight: 800,
              padding: '13px 36px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(109,197,52,0.4)', transition: '0.2s'
            }}>🛒 تسوق الآن</a>
            <a href="#/products?featured=1" style={{
              background: 'transparent', color: '#6DC534',
              border: '2px solid #6DC534', fontWeight: 700,
              padding: '13px 32px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>⭐ العروض المميزة</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 52, marginTop: 60, flexWrap: 'wrap' }}>
          {[['100+','صنف من البذور'],['5','أقسام رئيسية'],['توصيل','سريع'],['جودة','مضمونة']].map(([val,label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#6DC534', fontSize: 26, fontWeight: 900 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</div>
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
        <div style={{ background: '#2A2A2A', padding: '60px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: '#6DC534' }}>⭐ منتجات مميزة</h2>
              <a href="#/products?featured=1" style={{ color: '#6DC534', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
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
      <div style={{ background: '#2A2A2A', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30, textAlign: 'center' }}>
            {[
              ['🌿','بذور معتمدة','جميع البذور مختبرة ومعتمدة'],
              ['🚚','توصيل سريع','توصيل لجميع المحافظات'],
              ['📦','تعبئة محكمة','تعبئة تحافظ على حيوية البذور'],
              ['🤝','دعم فني','إرشاد زراعي مجاني مع كل طلب'],
            ].map(([icon,title,sub]) => (
              <div key={title}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <div style={{ color: '#6DC534', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
