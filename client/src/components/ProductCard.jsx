import { useApp } from '../App.jsx';

export default function ProductCard({ product }) {
  const { navigate, addToCart } = useApp();
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock > 0) addToCart(product);
  };

  return (
    <div
      onClick={() => navigate(`#/products/${product.id}`)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,71,41,0.08)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        border: '1px solid #e0ede6',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,71,41,0.18)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,71,41,0.08)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '70%', background: '#f2f7f4', overflow: 'hidden' }}>
        {product.image ? (
          <img src={product.image} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
            🌱
          </div>
        )}
        {discount && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#e53935', color: '#fff', borderRadius: 8,
            padding: '4px 10px', fontSize: 13, fontWeight: 800
          }}>خصم {discount}%</div>
        )}
        {product.featured === 1 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#FF6F00', color: '#fff', borderRadius: 8,
            padding: '4px 10px', fontSize: 12, fontWeight: 700
          }}>⭐ مميز</div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16
          }}>نفذت الكمية</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {product.category_name && (
          <div style={{ fontSize: 11, color: '#004729', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {product.category_name}
          </div>
        )}
        <h3 style={{
          fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.5, color: '#1a1a1a', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {product.name}
        </h3>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#004729' }}>
            {product.price.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 600 }}>د.ا</span>
          </span>
          {product.old_price && (
            <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: 13 }}>
              {product.old_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            width: '100%',
            padding: '11px 0',
            background: product.stock > 0 ? '#004729' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            transition: '0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          onMouseOver={e => { if (product.stock > 0) e.currentTarget.style.background = '#001A02'; }}
          onMouseOut={e => { if (product.stock > 0) e.currentTarget.style.background = '#004729'; }}
        >
          🛒 {product.stock > 0 ? 'أضف للسلة' : 'نفذ المخزون'}
        </button>
      </div>
    </div>
  );
}
