import { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';

export default function ProductDetailPage({ id }) {
  const { navigate, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    }).then(p => {
      setProduct(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;
  if (!product) return (
    <div className="container">
      <div className="empty" style={{ marginTop: 80 }}>
        <div className="empty-icon">😕</div>
        <h3>المنتج غير موجود</h3>
        <button onClick={() => navigate('#/products')} className="btn btn-primary" style={{ marginTop: 16 }}>العودة للمنتجات</button>
      </div>
    </div>
  );

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null;

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
        <a href="#/" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>الرئيسية</a>
        <span style={{ color: '#aaa' }}>›</span>
        <a href="#/products" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>المنتجات</a>
        {product.category_name && <>
          <span style={{ color: '#aaa' }}>›</span>
          <a href={`#/category/${product.category_id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>{product.category_name}</a>
        </>}
        <span style={{ color: '#aaa' }}>›</span>
        <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: '#f0f4f8', borderRadius: 16, overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: 100, color: '#c0cfe8' }}>📦</div>
          )}
          {discount && (
            <div style={{ position: 'absolute', top: 14, left: 14, background: '#FF6F00', color: '#fff', borderRadius: 10, padding: '5px 14px', fontSize: 16, fontWeight: 700 }}>
              خصم {discount}%
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category_name && (
            <a href={`#/category/${product.category_id}`} style={{
              display: 'inline-block', background: '#e3f0ff', color: 'var(--primary)',
              padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 14
            }}>{product.category_name}</a>
          )}
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginBottom: 20, color: 'var(--text)' }}>{product.name}</h1>

          {/* Price */}
          <div style={{ background: 'linear-gradient(135deg, #e3f0ff, #f0f7ff)', borderRadius: 12, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>{product.price.toLocaleString()}</span>
              <span style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 600 }}>دينار أردني</span>
              {product.old_price && (
                <span className="price-old" style={{ fontSize: 18 }}>{product.old_price.toLocaleString()} د.ا</span>
              )}
            </div>
            {discount && <div style={{ color: '#2e7d32', fontWeight: 700, fontSize: 14, marginTop: 6 }}>✅ وفر {(product.old_price - product.price).toLocaleString()} د.ا</div>}
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 600 }}>الكمية المتاحة:</span>
            {product.stock > 0 ? (
              <span className="badge badge-success">{product.stock} قطعة</span>
            ) : (
              <span className="badge badge-danger">نفذ المخزون</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: 16 }}>وصف المنتج</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.9, fontSize: 15 }}>{product.description}</p>
            </div>
          )}

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-light)' }}>الكمية:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f7f5', borderRadius: 10, padding: '6px 12px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#e0e0e0', fontWeight: 900, fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 18, minWidth: 32, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: '#004729', color: '#fff', fontWeight: 900, fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', fontSize: 16 }}
              disabled={product.stock === 0}
              onClick={() => { if (product.stock > 0) { addToCart(product, qty); navigate('#/cart'); } }}>
              {product.stock > 0 ? '🛒 أضف للسلة' : 'نفذت الكمية'}
            </button>
            <button className="btn btn-outline" onClick={() => navigate('#/products')} style={{ padding: '14px 20px' }}>
              ← العودة
            </button>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .container > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
