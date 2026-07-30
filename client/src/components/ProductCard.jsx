import { useApp } from '../App.jsx';

export default function ProductCard({ product }) {
  const { navigate } = useApp();
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  return (
    <div
      onClick={() => navigate(`#/products/${product.id}`)}
      style={{
        background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden',
        boxShadow: 'var(--shadow)', cursor: 'pointer', transition: 'var(--transition)',
        border: '1px solid var(--border)'
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '62%', background: '#f0f4f8', overflow: 'hidden' }}>
        {product.image ? (
          <img src={product.image} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, color: '#c0cfe8' }}>
            📦
          </div>
        )}
        {discount && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#FF6F00', color: '#fff', borderRadius: 8,
            padding: '3px 10px', fontSize: 13, fontWeight: 700
          }}>-{discount}%</div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15
          }}>نفذت الكمية</div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '14px 16px 18px' }}>
        {product.category_name && (
          <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{product.category_name}</div>
        )}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.4, color: 'var(--text)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span className="price" style={{ fontSize: 17 }}>{product.price.toLocaleString()} د.ع</span>
          {product.old_price && (
            <span className="price-old">{product.old_price.toLocaleString()} د.ع</span>
          )}
        </div>
      </div>
    </div>
  );
}
