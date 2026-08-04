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
      className="product-card"
      onClick={() => navigate(`#/products/${product.id}`)}
    >
      {/* Image */}
      <div className="product-card__img-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__img"
          />
        ) : (
          <div className="product-card__img-placeholder">🌱</div>
        )}

        {/* Gradient overlay */}
        <div className="product-card__overlay" />

        {/* Badges */}
        <div className="product-card__badges">
          {discount && (
            <span className="product-card__badge product-card__badge--discount">
              خصم {discount}%
            </span>
          )}
          {product.featured === 1 && (
            <span className="product-card__badge product-card__badge--featured">
              ⭐ مميز
            </span>
          )}
        </div>

        {product.stock === 0 && (
          <div className="product-card__soldout">نفذت الكمية</div>
        )}

        {/* Quick add button on hover */}
        <button
          className="product-card__quick-add"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          🛒 أضف للسلة
        </button>
      </div>

      {/* Info */}
      <div className="product-card__body">
        {product.category_name && (
          <div className="product-card__category">{product.category_name}</div>
        )}
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__footer">
          <div className="product-card__prices">
            <span className="product-card__price">
              {product.price.toLocaleString()}
              <span className="product-card__currency"> د.ا</span>
            </span>
            {product.old_price && (
              <span className="product-card__old-price">
                {product.old_price.toLocaleString()}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <span className="product-card__stock-ok">متوفر</span>
          ) : (
            <span className="product-card__stock-out">نفذ</span>
          )}
        </div>
      </div>
    </div>
  );
}
