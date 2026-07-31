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
      background: '#ffffff',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 18px rgba(0,71,41,0.15)',
      borderBottom: '1px solid #c8d9cf'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 68 }}>

        {/* Logo */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0, textDecoration: 'none' }}>
          <img src="/logo.png" alt="logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div>
            <div style={{ color: '#1a1a1a', fontWeight: 900, fontSize: 17, letterSpacing: 1, lineHeight: 1.1 }}>بذور زراعية</div>
            <div style={{ color: '#004729', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>للمحترفين</div>
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
              border: '1px solid rgba(0,71,41,0.5)',
              borderRadius: '8px 0 0 8px',
              fontFamily: 'Cairo, sans-serif', fontSize: 14,
              outline: 'none', background: '#f5f5f5', color: '#1a1a1a',
            }}
          />
          <button type="submit" style={{
            padding: '9px 18px', background: '#004729', border: 'none',
            borderRadius: '0 8px 8px 0', color: '#fff',
            cursor: 'pointer', fontSize: 16, fontWeight: 700
          }}>🔍</button>
        </form>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[['الرئيسية','#/'],['المنتجات','#/products']].map(([label, href]) => (
            <a key={href} href={href} style={{
              color: 'rgba(0,0,0,0.75)', fontWeight: 600,
              padding: '7px 13px', borderRadius: 8, fontSize: 14, transition: '0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(0,71,41,0.1)'; e.currentTarget.style.color='#004729'; }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(0,0,0,0.75)'; }}>
              {label}
            </a>
          ))}
          {user?.isAdmin && (
            <a href="#/admin" style={{
              color: '#fff', fontWeight: 700, padding: '7px 14px',
              borderRadius: 8, fontSize: 14, background: '#004729',
              boxShadow: '0 2px 8px rgba(0,71,41,0.5)'
            }}>⚙️ التحكم</a>
          )}
          {user ? (
            <button onClick={logout} style={{
              background: 'rgba(0,0,0,0.06)', color: '#333', border: '1px solid rgba(0,0,0,0.15)',
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14
            }}>خروج</button>
          ) : (
            <a href="#/login" style={{
              background: 'transparent', color: '#5aba87',
              border: '1.5px solid #004729',
              padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14
            }}>دخول</a>
          )}
        </nav>
      </div>
    </header>
  );
}
