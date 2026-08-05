import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import FarmAnimation from '../components/FarmAnimation.jsx';
import { useApp } from '../App.jsx';

export default function HomePage() {
  const { settings } = useApp();
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
    }).catch(() => setLoading(false));
  }, []);

  const storeName = settings?.store_name || 'بذور';
  const logoUrl = settings?.logo_url || '/logo.png';
  const heroTitle = settings?.hero_title || 'أجود البذور الزراعية';
  const heroSubtitle = settings?.hero_subtitle || 'لكل موسم وكل محصول';
  const heroDesc = settings?.hero_desc || 'محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف';
  const btnShop = settings?.hero_btn_shop || '🛒 تسوق الآن';
  const btnOffers = settings?.hero_btn_offers || '⭐ العروض المميزة';
  const features = Array.isArray(settings?.features) ? settings.features : [
    { icon: '🌿', title: 'بذور معتمدة', sub: 'جميع البذور مختبرة ومعتمدة' },
    { icon: '🚚', title: 'توصيل سريع', sub: 'توصيل لجميع المحافظات' },
    { icon: '📦', title: 'تعبئة محكمة', sub: 'تعبئة تحافظ على حيوية البذور' },
    { icon: '🤝', title: 'دعم فني', sub: 'إرشاد زراعي مجاني مع كل طلب' },
  ];

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: '#004729',
        padding: '70px 20px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* subtle pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          {/* Logo badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
            <img src={logoUrl} alt="logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{storeName}</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 5vw, 50px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            {heroTitle}<br/>
            <span style={{ color: '#a8e6c4' }}>{heroSubtitle}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 38, lineHeight: 1.8 }}>
            {heroDesc}
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/products" style={{
              background: '#fff', color: '#004729', fontWeight: 800,
              padding: '13px 36px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(0,0,0,0.2)', transition: '0.2s'
            }}>{btnShop}</a>
            <a href="#/products?featured=1" style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.6)', fontWeight: 700,
              padding: '13px 32px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>{btnOffers}</a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 52, marginTop: 50, flexWrap: 'wrap' }}>
          {[['100+','صنف من البذور'],['5','أقسام رئيسية'],['توصيل','سريع'],['جودة','مضمونة']].map(([val,label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#a8e6c4', fontSize: 26, fontWeight: 900 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Farm Illustration */}
      <div style={{ background: '#f0f9f4', padding: '40px 0 10px', borderBottom: '3px solid #c8e6c9' }}>
        <FarmAnimation />
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
        <div style={{ background: '#004729', padding: '60px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: '#a8e6c4' }}>⭐ منتجات مميزة</h2>
              <a href="#/products?featured=1" style={{ color: '#a8e6c4', fontWeight: 700, fontSize: 14 }}>عرض الكل ←</a>
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
    </div>
  );
}
