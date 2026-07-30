import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function Navbar() {
  const { user, setUser, navigate, toast } = useApp();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.hash = `#/products?search=${encodeURIComponent(search.trim())}`;
      window.scrollTo(0, 0);
      setMenuOpen(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('#/');
    toast('تم تسجيل الخروج بنجاح');
  };

  return (
    <header style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(13,71,161,0.3)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 68 }}>
        {/* Logo */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, background: '#FF6F00', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: '#fff', fontWeight: 900, boxShadow: '0 2px 8px rgba(255,111,0,0.4)'
          }}>⚡</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>متجر الكترو</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>للأجهزة الكهربائية</div>
          </div>
        </a>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500, display: 'flex', gap: 0 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن المنتج..."
            style={{
              flex: 1, padding: '9px 16px', border: 'none', borderRadius: '8px 0 0 8px',
              fontFamily: 'Cairo, sans-serif', fontSize: 14, outline: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
            }}
          />
          <button type="submit" style={{
            padding: '9px 18px', background: '#FF6F00', border: 'none', borderRadius: '0 8px 8px 0',
            color: '#fff', cursor: 'pointer', fontSize: 18
          }}>🔍</button>
        </form>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <a href="#/" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, padding: '6px 12px', borderRadius: 8, fontSize: 14, transition: '0.2s' }}
            onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.target.style.background = 'transparent'}>
            الرئيسية
          </a>
          <a href="#/products" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, padding: '6px 12px', borderRadius: 8, fontSize: 14, transition: '0.2s' }}
            onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseOut={e => e.target.style.background = 'transparent'}>
            المنتجات
          </a>
          {user?.isAdmin && (
            <a href="#/admin" style={{ color: '#FF6F00', fontWeight: 700, padding: '6px 14px', borderRadius: 8, fontSize: 14, background: 'rgba(255,111,0,0.15)', border: '1px solid rgba(255,111,0,0.4)' }}>
              لوحة التحكم
            </a>
          )}
          {user ? (
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none',
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Cairo,sans-serif',
              fontWeight: 600, fontSize: 14
            }}>خروج</button>
          ) : (
            <a href="#/login" style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              padding: '7px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14
            }}>دخول</a>
          )}
        </nav>
      </div>
    </header>
  );
}
