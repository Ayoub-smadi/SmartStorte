import { useState, useEffect } from 'react';
import { useApp } from '../App.jsx';

const STATUS_MAP = {
  pending:   { label: '⏳ قيد المعالجة', bg: '#FFF8E1', color: '#FF6F00' },
  confirmed: { label: '✅ مؤكد',         bg: '#E8F5E9', color: '#2E7D32' },
  delivered: { label: '📦 تم التوصيل',   bg: '#E3F2FD', color: '#1565C0' },
  cancelled: { label: '❌ ملغي',          bg: '#FFEBEE', color: '#C62828' },
};

export default function MyOrdersPage() {
  const { user, navigate, settings } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetch('/api/orders/my', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" style={{ marginTop: 100 }} />;

  return (
    <div className="container" style={{ padding: '36px 20px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#004729', marginBottom: 6 }}>📋 طلباتي</h1>
        <p style={{ color: '#888', fontSize: 14 }}>مرحباً <strong>{user?.username}</strong> — هنا جميع طلباتك</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#333', marginBottom: 10 }}>لا توجد طلبات بعد</h2>
          <p style={{ color: '#888', marginBottom: 28 }}>ابدأ تسوقك الآن واستمتع بأجود البذور</p>
          <button onClick={() => navigate('#/products')} className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 16 }}>
            🌱 تصفح المنتجات
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => {
            const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #e8f0e9', overflow: 'hidden' }}>
                {/* Header */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', flexWrap: 'wrap', cursor: 'pointer' }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div style={{ background: '#f0f9f4', borderRadius: 10, padding: '8px 14px', minWidth: 60, textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#004729' }}>#{order.id}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>
                      {(order.items || []).length} منتج
                    </div>
                    <div style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, fontSize: 17, color: '#004729' }}>{Number(order.total).toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>دينار أردني</div>
                  </div>
                  <div>
                    <span style={{ background: s.bg, color: s.color, padding: '6px 16px', borderRadius: 20, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ color: '#bbb', fontSize: 18 }}>{isExpanded ? '▲' : '▼'}</div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0f0f0', padding: '20px 22px', background: '#fafcfa' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: '#444' }}>🧾 تفاصيل الطلب</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {(order.items || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '10px 16px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}>
                          <span style={{ color: '#333' }}>{item.name} <span style={{ color: '#aaa' }}>× {item.qty}</span></span>
                          <span style={{ fontWeight: 700, color: '#004729' }}>{(item.price * item.qty).toLocaleString()} د.ا</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <div style={{ background: '#fff8e1', padding: '10px 16px', borderRadius: 8, fontSize: 13, color: '#666', border: '1px solid #ffe082', marginBottom: 12 }}>
                        📝 ملاحظة: {order.notes}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f9f4', padding: '12px 16px', borderRadius: 10 }}>
                      <span style={{ fontWeight: 700, color: '#004729' }}>المجموع الكلي</span>
                      <span style={{ fontWeight: 900, fontSize: 17, color: '#004729' }}>{Number(order.total).toLocaleString()} د.ا</span>
                    </div>
                    {order.customer_phone && (
                      <div style={{ marginTop: 10, fontSize: 13, color: '#888' }}>📞 {order.customer_phone}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
