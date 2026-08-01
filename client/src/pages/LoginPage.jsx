import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function LoginPage() {
  const { setUser, navigate, toast, settings } = useApp();
  // Support ?register=1 to open register tab directly
  const startMode = typeof window !== 'undefined' && window.location.hash.includes('register=1') ? 'register' : 'login';
  const [mode, setMode] = useState(startMode); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', email: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoUrl = settings?.logo_url || '/logo.png';
  const storeName = settings?.store_name || 'بذور';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setUser(data);
      toast('مرحباً ' + data.username + '!');
      navigate(data.isAdmin ? '#/admin' : '#/');
    } catch {
      setError('خطأ في الاتصال، حاول مرة أخرى');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور غير متطابقة'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: form.username, password: form.password, email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setUser(data);
      toast('مرحباً بك في ' + storeName + '! 🌱');
      navigate('#/');
    } catch {
      setError('خطأ في الاتصال، حاول مرة أخرى');
      setLoading(false);
    }
  };

  const tabStyle = (t) => ({
    flex: 1, padding: '11px', border: 'none', cursor: 'pointer',
    fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 15,
    background: mode === t ? '#004729' : '#f5f7f5',
    color: mode === t ? '#fff' : '#666',
    transition: '0.2s',
  });

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,71,41,0.15)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', padding: '36px 40px 24px' }}>
            <img src={logoUrl} alt={storeName} style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 10 }} />
            <div style={{ fontWeight: 900, fontSize: 22, color: '#004729' }}>{storeName}</div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <button style={{ ...tabStyle('login'), borderRadius: 0 }} onClick={() => { setMode('login'); setError(''); }}>تسجيل الدخول</button>
            <button style={{ ...tabStyle('register'), borderRadius: 0 }} onClick={() => { setMode('register'); setError(''); }}>حساب جديد</button>
          </div>

          <div style={{ padding: '28px 36px 36px' }}>
            {error && (
              <div style={{
                background: '#fce4e4', color: '#c62828', padding: '12px 16px',
                borderRadius: 8, fontSize: 14, fontWeight: 600, marginBottom: 18,
                border: '1px solid #f5c6cb'
              }}>⚠️ {error}</div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">اسم المستخدم</label>
                  <input className="form-input" type="text" value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="أدخل اسم المستخدم" required autoComplete="username" />
                </div>
                <div className="form-group">
                  <label className="form-label">كلمة المرور</label>
                  <input className="form-input" type="password" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 16, marginTop: 8 }}>
                  {loading ? '⏳ جاري الدخول...' : '🔑 دخول'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#888' }}>
                  ليس لديك حساب؟{' '}
                  <button type="button" onClick={() => { setMode('register'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#004729', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontSize: 14 }}>
                    سجّل الآن
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">اسم المستخدم *</label>
                  <input className="form-input" type="text" value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="3 أحرف على الأقل" required autoComplete="username" />
                </div>
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني * <span style={{ color: '#888', fontWeight: 400, fontSize: 12 }}>لاستلام إشعارات الطلبات</span></label>
                  <input className="form-input" type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="example@email.com" required autoComplete="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">كلمة المرور *</label>
                  <input className="form-input" type="password" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="6 أحرف على الأقل" required autoComplete="new-password" />
                </div>
                <div className="form-group">
                  <label className="form-label">تأكيد كلمة المرور *</label>
                  <input className="form-input" type="password" value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="••••••••" required autoComplete="new-password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 16, marginTop: 8 }}>
                  {loading ? '⏳ جاري التسجيل...' : '🌱 إنشاء حساب'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#888' }}>
                  لديك حساب بالفعل؟{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#004729', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo,sans-serif', fontSize: 14 }}>
                    سجّل الدخول
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
