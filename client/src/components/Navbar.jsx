import { useState } from 'react';
import { useApp } from '../App.jsx';

export default function Navbar() {
  const { user, setUser, navigate, toast, cartCount, settings } = useApp();
  const [search, setSearch] = useState('');

  const storeName = settings?.store_name || 'بذور';
  const logoUrl = settings?.logo_url || '/logo.png';

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
      boxShadow: '0 2px 18px rgba(0,71,41,0.12)',
      borderBottom: '1px solid #c8d9cf'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', height: 68 }}>

        {/* Logo */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
          <img src={logoUrl} alt="logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <div style={{ color: '#1a1a1a', fontWeight: 900, fontSize: 20, letterSpacing: 1 }}>{storeName}</div>
        </a>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, display: 'flex' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`ابحث في ${storeName}...`}
            style={{
              flex: 1, padding: '9px 16px',
              border: '1.5px solid #c8d9cf',
              borderRadius: '8px 0 0 8px',
              fontFamily: 'Cairo, sans-serif', fontSize: 14,
              outline: 'none', background: '#f5f7f5', color: '#1a1a1a',
              transition: '0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#004729'}
            onBlur={e => e.target.style.borderColor = '#c8d9cf'}
          />
          <button type="submit" style={{
            padding: '9px 18px', background: '#004729', border: 'none',
            borderRadius: '0 8px 8px 0', color: '#fff',
            cursor: 'pointer', fontSize: 15, fontWeight: 700
          }}>🔍</button>
        </form>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[['الرئيسية','#/'],['المنتجات','#/products']].map(([label, href]) => (
            <a key={href} href={href} style={{
              color: 'rgba(0,0,0,0.7)', fontWeight: 600,
              padding: '7px 12px', borderRadius: 8, fontSize: 14, transition: '0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(0,71,41,0.08)'; e.currentTarget.style.color='#004729'; }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(0,0,0,0.7)'; }}>
              {label}
            </a>
          ))}

          {/* Cart icon */}
          <a href="#/cart" style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 42, height: 42, borderRadius: 10, textDecoration: 'none',
            background: cartCount > 0 ? '#004729' : 'rgba(0,71,41,0.08)',
            transition: '0.2s', marginLeft: 2,
          }}
            onMouseOver={e => { e.currentTarget.style.background='#004729'; }}
            onMouseOut={e => { e.currentTarget.style.background = cartCount > 0 ? '#004729' : 'rgba(0,71,41,0.08)'; }}
          >
            <span style={{ fontSize: 18 }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, left: -6,
                background: '#e53935', color: '#fff',
                borderRadius: '50%', width: 20, height: 20,
                fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}>{cartCount > 9 ? '9+' : cartCount}</span>
            )}
          </a>

          {user?.isAdmin && (
            <a href="#/admin" style={{
              color: '#fff', fontWeight: 700, padding: '7px 14px',
              borderRadius: 8, fontSize: 14, background: '#004729',
              boxShadow: '0 2px 8px rgba(0,71,41,0.3)', marginLeft: 4
            }}>⚙️ التحكم</a>
          )}
          {user && !user.isAdmin && (
            <a href="#/my-orders" style={{
              color: '#004729', fontWeight: 700, padding: '7px 12px',
              borderRadius: 8, fontSize: 14, border: '1.5px solid #c8d9cf', marginLeft: 4
            }}>📋 طلباتي</a>
          )}
          {user ? (
            <button onClick={logout} style={{
              background: 'rgba(0,0,0,0.06)', color: '#333', border: '1px solid rgba(0,0,0,0.12)',
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'Cairo,sans-serif', fontWeight: 600, fontSize: 14, marginLeft: 4
            }}>خروج</button>
          ) : (
            <a href="#/login" style={{
              background: 'transparent', color: '#004729',
              border: '1.5px solid #004729',
              padding: '7px 16px', borderRadius: 8, fontWeight: 700, fontSize: 14, marginLeft: 4
            }}>دخول</a>
          )}
        </nav>
      </div>
    </header>
  );
}
