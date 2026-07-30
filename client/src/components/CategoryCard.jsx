const ICONS = {
  'محاصيل شتوية': '❄️🌾',
  'محاصيل صيفية': '☀️🍅',
  'زينة صيفية': '🌻',
  'زينة شتوية': '🌸',
  'بذور للاستنبات (المايكروجرين)': '🌱',
};

export default function CategoryCard({ cat }) {
  return (
    <a href={`#/category/${cat.id}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#fff', borderRadius: 'var(--radius)', padding: '22px 10px',
        boxShadow: 'var(--shadow)', border: '2px solid transparent',
        transition: 'var(--transition)', cursor: 'pointer', textDecoration: 'none'
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = '#6DC534';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #e8f8d8, #d0f0b0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 10
      }}>
        {cat.image
          ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : (ICONS[cat.name] || '🌿')}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', textAlign: 'center', marginBottom: 4, lineHeight: 1.4 }}>{cat.name}</div>
      {cat.product_count !== undefined && (
        <div style={{ fontSize: 12, color: '#6DC534', fontWeight: 700 }}>{cat.product_count} منتج</div>
      )}
    </a>
  );
}
