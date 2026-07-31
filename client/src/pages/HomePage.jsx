import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import FarmAnimation from '../components/FarmAnimation.jsx';

function _FarmScene_UNUSED() {
  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
      <svg viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="skyGrad" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#b8e4f7"/>
            <stop offset="100%" stopColor="#e8f6fd"/>
          </radialGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B4226"/>
            <stop offset="100%" stopColor="#4a2f1a"/>
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CAF50"/>
            <stop offset="100%" stopColor="#2E7D32"/>
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="900" height="260" fill="url(#skyGrad)" rx="18"/>

        {/* Sun */}
        <circle cx="100" cy="60" r="38" fill="#FFD54F" opacity="0.9"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line key={i}
            x1={100 + 46 * Math.cos(deg * Math.PI / 180)}
            y1={60 + 46 * Math.sin(deg * Math.PI / 180)}
            x2={100 + 58 * Math.cos(deg * Math.PI / 180)}
            y2={60 + 58 * Math.sin(deg * Math.PI / 180)}
            stroke="#FFD54F" strokeWidth="3" strokeLinecap="round"/>
        ))}

        {/* Clouds */}
        {/* Cloud 1 */}
        <g opacity="0.9">
          <ellipse cx="240" cy="55" rx="48" ry="28" fill="#fff"/>
          <ellipse cx="210" cy="65" rx="32" ry="22" fill="#fff"/>
          <ellipse cx="275" cy="65" rx="35" ry="22" fill="#fff"/>
          <ellipse cx="245" cy="72" rx="42" ry="18" fill="#fff"/>
        </g>
        {/* Cloud 2 - rain cloud (dark) */}
        <g>
          <ellipse cx="580" cy="50" rx="55" ry="30" fill="#90A4AE"/>
          <ellipse cx="548" cy="62" rx="36" ry="24" fill="#90A4AE"/>
          <ellipse cx="616" cy="62" rx="38" ry="24" fill="#90A4AE"/>
          <ellipse cx="582" cy="70" rx="50" ry="20" fill="#78909C"/>
        </g>
        {/* Cloud 3 */}
        <g opacity="0.8">
          <ellipse cx="760" cy="45" rx="44" ry="25" fill="#fff"/>
          <ellipse cx="735" cy="56" rx="30" ry="20" fill="#fff"/>
          <ellipse cx="788" cy="56" rx="32" ry="20" fill="#fff"/>
          <ellipse cx="762" cy="63" rx="40" ry="17" fill="#fff"/>
        </g>

        {/* Rain drops from dark cloud */}
        {[560,575,590,605,545,618,555,598,570,585].map((x, i) => (
          <line key={i}
            x1={x} y1={82 + (i % 3) * 10}
            x2={x - 4} y2={110 + (i % 3) * 10}
            stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        ))}

        {/* Ground */}
        <rect x="0" y="255" width="900" height="125" fill="url(#groundGrad)" rx="0"/>
        {/* Grass strip */}
        <ellipse cx="450" cy="255" rx="450" ry="22" fill="#4CAF50"/>

        {/* Farm rows / furrows */}
        {[0,1,2].map(i => (
          <ellipse key={i} cx="450" cy={285 + i * 28} rx="380" ry="7" fill="#5D3A1A" opacity="0.35"/>
        ))}

        {/* Sprouting seeds - left side */}
        {[
          { x: 120, h: 38, leaves: true },
          { x: 180, h: 26, leaves: false },
          { x: 245, h: 44, leaves: true },
          { x: 310, h: 30, leaves: false },
          { x: 370, h: 50, leaves: true },
        ].map(({ x, h, leaves }, i) => (
          <g key={i}>
            {/* Stem */}
            <line x1={x} y1={255} x2={x} y2={255 - h} stroke="#2E7D32" strokeWidth="3" strokeLinecap="round"/>
            {/* Sprout tip */}
            <circle cx={x} cy={255 - h} r="4" fill="#66BB6A"/>
            {leaves && (
              <>
                <ellipse cx={x - 10} cy={255 - h + 8} rx="10" ry="5" fill="#4CAF50" transform={`rotate(-30 ${x - 10} ${255 - h + 8})`}/>
                <ellipse cx={x + 10} cy={255 - h + 8} rx="10" ry="5" fill="#4CAF50" transform={`rotate(30 ${x + 10} ${255 - h + 8})`}/>
              </>
            )}
          </g>
        ))}

        {/* Seeds on ground - right area */}
        {[680, 720, 760, 800].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={260 + i * 2} rx="6" ry="4" fill="#795548" opacity="0.9"/>
            <line x1={x} y1={256 + i * 2} x2={x + 4} y2={250 + i * 2} stroke="#A5D6A7" strokeWidth="1.5"/>
          </g>
        ))}

        {/* Big tree - far left */}
        <rect x="38" y="190" width="12" height="65" fill="#5D4037" rx="3"/>
        <ellipse cx="44" cy="185" rx="30" ry="28" fill="#388E3C"/>
        <ellipse cx="30" cy="198" rx="20" ry="16" fill="#43A047"/>
        <ellipse cx="58" cy="198" rx="20" ry="16" fill="#2E7D32"/>

        {/* Small tree - far right */}
        <rect x="840" y="205" width="10" height="50" fill="#5D4037" rx="2"/>
        <ellipse cx="845" cy="200" rx="24" ry="22" fill="#388E3C"/>
        <ellipse cx="833" cy="210" rx="16" ry="13" fill="#43A047"/>
        <ellipse cx="857" cy="210" rx="16" ry="13" fill="#2E7D32"/>

        {/* Fence */}
        {[430, 455, 480, 505, 530].map((x, i) => (
          <g key={i}>
            <rect x={x} y={238} width="8" height="26" fill="#8D6E63" rx="2"/>
            <polygon points={`${x},238 ${x + 4},230 ${x + 8},238`} fill="#795548"/>
          </g>
        ))}
        <rect x="430" y="244" width="108" height="5" fill="#8D6E63" rx="2"/>
        <rect x="430" y="254" width="108" height="4" fill="#8D6E63" rx="2"/>

        {/* === FARMER CHARACTER === */}
        <g transform="translate(600, 145)">
          {/* Shadow */}
          <ellipse cx="20" cy="112" rx="28" ry="7" fill="rgba(0,0,0,0.15)"/>

          {/* Body */}
          <rect x="2" y="52" width="36" height="42" fill="#1565C0" rx="8"/>

          {/* Overalls bib */}
          <rect x="9" y="52" width="22" height="25" fill="#1976D2" rx="4"/>
          <rect x="12" y="56" width="6" height="8" fill="#42A5F5" rx="2"/>
          <rect x="22" y="56" width="6" height="8" fill="#42A5F5" rx="2"/>

          {/* Suspenders */}
          <line x1="10" y1="52" x2="6" y2="42" stroke="#1565C0" strokeWidth="3" strokeLinecap="round"/>
          <line x1="30" y1="52" x2="34" y2="42" stroke="#1565C0" strokeWidth="3" strokeLinecap="round"/>

          {/* Head */}
          <circle cx="20" cy="28" r="20" fill="#FFCC80"/>

          {/* Hat */}
          <ellipse cx="20" cy="12" rx="24" ry="5" fill="#8B6914"/>
          <rect x="8" y="4" width="24" height="10" fill="#A0782A" rx="3"/>

          {/* Eyes */}
          <circle cx="14" cy="27" r="2.5" fill="#3E2723"/>
          <circle cx="26" cy="27" r="2.5" fill="#3E2723"/>
          <circle cx="15" cy="26" r="1" fill="#fff"/>
          <circle cx="27" cy="26" r="1" fill="#fff"/>

          {/* Smile */}
          <path d="M14 33 Q20 39 26 33" stroke="#BF360C" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

          {/* Left arm - down holding seeds */}
          <line x1="2" y1="60" x2="-12" y2="80" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round"/>
          {/* Hand with seeds */}
          <circle cx="-13" cy="83" r="6" fill="#FFCC80"/>
          {/* Seeds falling from hand */}
          <circle cx="-18" cy="95" r="3" fill="#795548"/>
          <circle cx="-10" cy="100" r="2.5" fill="#795548"/>
          <circle cx="-22" cy="102" r="2" fill="#795548"/>
          <line x1="-18" y1="92" x2="-19" y2="88" stroke="#A5D6A7" strokeWidth="1.5"/>
          <line x1="-10" y1="97" x2="-9" y2="93" stroke="#A5D6A7" strokeWidth="1.5"/>

          {/* Right arm - raised holding hoe */}
          <line x1="38" y1="60" x2="55" y2="40" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round"/>
          {/* Hoe handle */}
          <line x1="55" y1="40" x2="72" y2="10" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round"/>
          {/* Hoe head */}
          <rect x="62" y="4" width="20" height="8" fill="#607D8B" rx="2" transform="rotate(-35 62 4)"/>

          {/* Legs */}
          <rect x="4" y="90" width="14" height="26" fill="#1565C0" rx="5"/>
          <rect x="22" y="90" width="14" height="26" fill="#1565C0" rx="5"/>
          {/* Boots */}
          <ellipse cx="11" cy="116" rx="10" ry="6" fill="#3E2723"/>
          <ellipse cx="29" cy="116" rx="10" ry="6" fill="#3E2723"/>
        </g>

        {/* Water droplets near farmer */}
        {[
          { x: 595, y: 155 }, { x: 608, y: 168 }, { x: 582, y: 172 },
          { x: 618, y: 158 }, { x: 572, y: 162 }
        ].map((d, i) => (
          <g key={i}>
            <ellipse cx={d.x} cy={d.y} rx="3" ry="5" fill="#4FC3F7" opacity="0.8"/>
            <polygon points={`${d.x},${d.y - 5} ${d.x - 3},${d.y + 2} ${d.x + 3},${d.y + 2}`} fill="#4FC3F7" opacity="0.8"/>
          </g>
        ))}

        {/* Ground details - small pebbles */}
        {[150, 280, 420, 820].map((x, i) => (
          <ellipse key={i} cx={x} cy={268 + i * 5} rx="5" ry="3" fill="#4a2f1a" opacity="0.5"/>
        ))}
      </svg>
    </div>
  );
}

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
            <img src="/logo.png" alt="logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 28, lineHeight: 1 }}>بذور</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 5vw, 50px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            أجود البذور الزراعية<br/>
            <span style={{ color: '#a8e6c4' }}>لكل موسم وكل محصول</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 38, lineHeight: 1.8 }}>
            محاصيل شتوية وصيفية، نباتات زينة، ومايكروجرين — بذور مختارة بعناية للمزارع المحترف
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#/products" style={{
              background: '#fff', color: '#004729', fontWeight: 800,
              padding: '13px 36px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(0,0,0,0.2)', transition: '0.2s'
            }}>🛒 تسوق الآن</a>
            <a href="#/products?featured=1" style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.6)', fontWeight: 700,
              padding: '13px 32px', borderRadius: 8, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>⭐ العروض المميزة</a>
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
        <p style={{ textAlign: 'center', color: '#004729', fontWeight: 700, fontSize: 15, paddingBottom: 20, marginTop: -10 }}>
          🌱 ابدأ رحلتك الزراعية معنا اليوم
        </p>
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

      {/* Features */}
      <div style={{ background: '#004729', padding: '60px 0' }}>
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
                <div style={{ color: '#a8e6c4', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
