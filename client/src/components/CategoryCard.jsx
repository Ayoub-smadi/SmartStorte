const ICONS = { 'تلفزيونات': '📺', 'ثلاجات': '🧊', 'غسالات': '🫧', 'مكيفات': '❄️', 'مطابخ': '🍳', 'هواتف': '📱' };

export default function CategoryCard({ cat }) {
  return (
    <a href={`#/category/${cat.id}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#fff', borderRadius: 'var(--radius)', padding: '20px 10px',
        boxShadow: 'var(--shadow)', border: '2px solid transparent',
        transition: 'var(--transition)', cursor: 'pointer', textDecoration: 'none'
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #e3f0ff, #c8dffe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, marginBottom: 10, transition: 'var(--transition)'
      }}>
        {cat.image ? (
          <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        ) : (ICONS[cat.name] || '🔌')}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', textAlign: 'center', marginBottom: 4 }}>{cat.name}</div>
      {cat.product_count !== undefined && (
        <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{cat.product_count} منتج</div>
      )}
    </a>
  );
}
