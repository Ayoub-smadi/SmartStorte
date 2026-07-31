import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function LoginPage() {
  const { setUser, navigate, toast } = useApp();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
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

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '48px 40px',
          boxShadow: '0 8px 40px rgba(0,71,41,0.15)', border: '1px solid var(--border)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ marginBottom: 16 }}>
              <img src="/logo.png" alt="بذور" style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>تسجيل الدخول</h1>
            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>أدخل بيانات الدخول للوصول للحساب</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#fce4e4', color: '#c62828', padding: '12px 16px',
                borderRadius: 8, fontSize: 14, fontWeight: 600, marginBottom: 18,
                border: '1px solid #f5c6cb'
              }}>
                ⚠️ {error}
              </div>
            )}
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
          </form>
        </div>
      </div>
    </div>
  );
}
