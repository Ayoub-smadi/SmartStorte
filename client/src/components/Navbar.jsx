import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function Navbar() {
  const { user, setUser, navigate, toast } = useApp();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.hash = `#/products?search=${encodeURIComponent(search.trim())}`;
      window.scrollTo(0, 0);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('#/');
    toast('تم تسجيل الخروج بنجاح');
  };

  return (
    <header style={{
      background: '#2A2A2A',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 18px rgba(0,0,0,0.45)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 68 }}>

        {/* Logo — SEC style */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, textDecoration: 'none' }}>
          {/* Circle icon */}
          <div style={{ position: 'relative', width: 42, height: 42, flexShrink: 0 }}>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="20" stroke="#6DC534" strokeWidth="2.5" fill="transparent"/>
              <polygon points="23,7 14,23 21,23 19,35 28,19 21,19" fill="#6DC534"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 17, letterSpacing: 1, lineHeight: 1.1 }}>بذور زراعية</div>
            <div style={{ color: '#6DC534', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>للمحترفين</div>
          </div>
        </a>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500, display: 'flex' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن البذور..."
            style={{
              flex: 1, padding: '9px 16px',
              border: '1px solid rgba(109,197,52,0.3)',
              borderRadius: '8px 0 0 8px',
              fontFamily: 'Cairo, sans-serif', fontSize: 14,
              outline: 'none', background: '#3a3a3a', color: '#fff',
            }}
          />
          <button type="submit" style={{
            padding: '9px 18px', background: '#6DC534', border: 'none',
            borderRadius: '0 8px 8px 0', color: '#1C1C1C',
            cursor: 'pointer', fontSize: 16, fontWeight: 700
          }}>🔍</button>
        </form>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['الرئيسية','#/'],['المنتجات','#/products']].map(([label, href]) => (
            <a key={href} href={href} style={{
              color: 'rgba(255,255,255,0.85)', fontWeight: 600,
              padding: '7px 13px', borderRadius: 8, fontSize: 14, transition: '0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(109,197,52,0.15)'; e.currentTarget.style.color='#6DC534'; }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}>
              {label}
            </a>
          ))}
          {user?.isAdmin && (
            <a href="#/admin" style={{
              color: '#2A2A2A', fontWeight: 700, padding: '7px 14px',
              borderRadius: 8, fontSize: 14, background: '#6DC534',
              boxShadow: '0 2px 8px rgba(109,197,52,0.4)'
            }}>⚙️ التحكم</a>
          )}
          {user ? (
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14
            }}>خروج</button>
          ) : (
            <a href="#/login" style={{
              background: 'transparent', color: '#6DC534',
              border: '1.5px solid #6DC534',
              padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14
            }}>دخول</a>
          )}
        </nav>
      </div>
    </header>
  );
}
