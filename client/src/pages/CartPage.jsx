import { useState } from 'react';
import { useApp } from '../App.jsx';

const GOVERNORATES = [
  { name: 'عمّان',   fee: 2000 },
  { name: 'إربد',   fee: 3000 },
  { name: 'الزرقاء', fee: 3000 },
  { name: 'البلقاء', fee: 3000 },
  { name: 'مادبا',  fee: 3000 },
  { name: 'الكرك',  fee: 3000 },
  { name: 'الطفيلة', fee: 3000 },
  { name: 'معان',   fee: 3000 },
  { name: 'العقبة', fee: 3000 },
  { name: 'جرش',   fee: 3000 },
  { name: 'عجلون', fee: 3000 },
  { name: 'المفرق', fee: 3000 },
];

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, navigate, toast, user } = useApp();
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [form, setForm] = useState({
    customer_name: user?.username || '',
    customer_phone: '',
    customer_email: user?.email || '',
    governorate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const selectedGov = GOVERNORATES.find(g => g.name === form.governorate);
  const shippingFee = selectedGov ? selectedGov.fee : 0;
  const total = subtotal + shippingFee;

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
        image: i.product.image || null,
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          items,
          total,
          subtotal,
          shipping_fee: shippingFee,
          governorate: form.governorate,
          notes: form.notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderId(data.id);
      clearCart();
      setStep('success');
      toast('تم إرسال طلبك بنجاح! 🎉');
    } catch (err) {
      toast(err.message || 'خطأ، حاول مرة أخرى', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ─── SUCCESS ─── */
  if (step === 'success') return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#004729', marginBottom: 12 }}>تم استلام طلبك!</h2>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, marginBottom: 8 }}>
          رقم طلبك: <strong style={{ color: '#004729' }}>#{orderId}</strong>
        </p>
        <p style={{ color: '#555', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
          سيتواصل معك فريقنا على الرقم المسجل لتأكيد الطلب والتوصيل.
        </p>
        {form.customer_email && (
          <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
            📧 سيصلك تأكيد على بريدك الإلكتروني
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {user && !user.isAdmin && (
            <button onClick={() => navigate('#/my-orders')} className="btn btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>
              📋 تابع طلباتك
            </button>
          )}
          <button onClick={() => navigate('#/')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
            🏠 العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── NOT LOGGED IN ─── */
  if (!user && step !== 'success') return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#004729', marginBottom: 12 }}>يجب تسجيل الدخول أولاً</h2>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
          لإتمام طلبك وتلقّي إشعارات تأكيد الطلب والتوصيل، يجب أن يكون لديك حساب.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('#/login')} className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 16 }}>
            🔑 تسجيل الدخول
          </button>
          <button onClick={() => navigate('#/login?register=1')} className="btn btn-outline" style={{ padding: '13px 32px', fontSize: 15 }}>
            🌱 حساب جديد
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── EMPTY CART ─── */
  if (cart.length === 0 && step === 'cart') return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>سلتك فارغة</h2>
        <p style={{ color: '#888', marginBottom: 28 }}>أضف منتجات للمتابعة</p>
        <button onClick={() => navigate('#/products')} className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 16 }}>
          🌱 تصفح المنتجات
        </button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '36px 20px 60px' }}>
      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
        {[['1', 'السلة'], ['2', 'الدفع']].map(([num, label], i) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16,
                background: (step === 'cart' && i === 0) || (step === 'checkout' && i === 1) ? '#004729' : (step === 'checkout' && i === 0) ? '#a8e6c4' : '#e0e0e0',
                color: (step === 'cart' && i === 0) || (step === 'checkout' && i === 1) ? '#fff' : (step === 'checkout' && i === 0) ? '#004729' : '#888',
              }}>{(step === 'checkout' && i === 0) ? '✓' : num}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-light)' }}>{label}</span>
            </div>
            {i === 0 && <div style={{ width: 80, height: 2, background: step === 'checkout' ? '#004729' : '#e0e0e0', margin: '0 8px', marginBottom: 20 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

        {/* ─── CART ITEMS / CHECKOUT FORM ─── */}
        <div>
          {step === 'cart' ? (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>🛒 محتوى السلة ({cart.length})</h2>
                <button onClick={clearCart} style={{ background: '#fce4e4', color: '#c62828', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 13 }}>
                  🗑️ إفراغ السلة
                </button>
              </div>
              {cart.map(({ product, qty }) => (
                <div key={product.id} style={{ display: 'flex', gap: 16, padding: '18px 24px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', background: '#f5f7f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>📦</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>{product.name}</div>
                    <div style={{ color: '#004729', fontWeight: 800, fontSize: 15 }}>{(product.price * qty).toLocaleString()} د.ع</div>
                    <div style={{ fontSize: 13, color: '#aaa' }}>{product.price.toLocaleString()} د.ع × {qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f7f5', borderRadius: 10, padding: '4px 8px' }}>
                    <button onClick={() => updateQty(product.id, qty - 1)}
                      style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#e0e0e0', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontWeight: 800, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)}
                      style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#004729', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)}
                    style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 20, padding: 4, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          ) : (
            /* CHECKOUT FORM */
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', padding: '28px 32px', border: '1px solid var(--border)' }}>
              <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800 }}>📋 بيانات التوصيل</h2>
              <form id="checkout-form" onSubmit={handleOrder}>
                <div className="form-group">
                  <label className="form-label">الاسم الكامل *</label>
                  <input className="form-input" value={form.customer_name}
                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="أدخل اسمك الكامل" required />
                </div>
                <div className="form-group">
                  <label className="form-label">رقم الهاتف *</label>
                  <input className="form-input" type="tel" value={form.customer_phone}
                    onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                    placeholder="07XXXXXXXXX" required />
                </div>
                <div className="form-group">
                  <label className="form-label">المحافظة *</label>
                  <select className="form-select" value={form.governorate}
                    onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))} required>
                    <option value="">اختر محافظتك...</option>
                    {GOVERNORATES.map(g => (
                      <option key={g.name} value={g.name}>
                        {g.name} — توصيل {g.fee} دينار
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني * <span style={{ color: '#888', fontWeight: 400, fontSize: 12 }}>يصلك تأكيد الطلب وتحديثات الحالة</span></label>
                  <input className="form-input" type="email" value={form.customer_email}
                    onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                    placeholder="example@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">ملاحظات (اختياري)</label>
                  <textarea className="form-textarea" value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="العنوان التفصيلي أو أي ملاحظات للتوصيل..." />
                </div>
                <div style={{ background: '#f0f9f4', borderRadius: 10, padding: '14px 18px', marginTop: 8, border: '1px solid #c8e6c9' }}>
                  <div style={{ color: '#004729', fontWeight: 700, fontSize: 14 }}>💳 الدفع عند الاستلام (كاش)</div>
                  <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>سيتواصل معك فريقنا لتأكيد الطلب</div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ─── ORDER SUMMARY ─── */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow)', overflow: 'hidden', border: '1px solid var(--border)', position: 'sticky', top: 90 }}>
          <div style={{ background: '#004729', padding: '16px 22px' }}>
            <h3 style={{ color: '#fff', margin: 0, fontSize: 16, fontWeight: 800 }}>ملخص الطلب</h3>
          </div>
          <div style={{ padding: '20px 22px' }}>
            {cart.map(({ product, qty }) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--text)', flex: 1, marginLeft: 8, lineHeight: 1.4 }}>{product.name} × {qty}</span>
                <span style={{ fontWeight: 700, color: '#004729', whiteSpace: 'nowrap' }}>{(product.price * qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #f0f0f0', marginTop: 16, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                <span>المجموع الفرعي</span>
                <span style={{ fontWeight: 700 }}>{subtotal.toLocaleString()} دينار</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                <span>🚚 رسوم التوصيل {form.governorate ? `(${form.governorate})` : ''}</span>
                {shippingFee > 0
                  ? <span style={{ fontWeight: 700, color: '#FF6F00' }}>{shippingFee} دينار</span>
                  : <span style={{ color: '#aaa', fontSize: 13 }}>اختر المحافظة</span>
                }
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px dashed #e0e0e0', paddingTop: 10, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>الإجمالي</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: '#004729' }}>{total.toLocaleString()} <small style={{ fontSize: 13 }}>دينار</small></span>
              </div>
            </div>
            {step === 'cart' ? (
              <button onClick={() => setStep('checkout')}
                className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, marginTop: 20 }}>
                المتابعة للدفع ←
              </button>
            ) : (
              <>
                <button type="submit" form="checkout-form" disabled={loading}
                  className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, marginTop: 20 }}>
                  {loading ? '⏳ جاري الإرسال...' : '✅ تأكيد الطلب'}
                </button>
                <button onClick={() => setStep('cart')}
                  style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontSize: 14, padding: '8px' }}>
                  ← العودة للسلة
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
