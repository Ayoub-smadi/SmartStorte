export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)', color: '#fff', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, background: '#FF6F00', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>متجر الكترو</div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.8 }}>
              وجهتك الأولى للأجهزة الكهربائية المنزلية بأفضل الأسعار وأعلى جودة.
            </p>
          </div>
          {/* Links */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16, borderBottom: '2px solid rgba(255,111,0,0.5)', paddingBottom: 8 }}>روابط سريعة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['الرئيسية', '#/'], ['المنتجات', '#/products']].map(([label, href]) => (
                <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, transition: '0.2s' }}
                  onMouseOver={e => e.target.style.color = '#FF6F00'}
                  onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>{label}</a>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16, borderBottom: '2px solid rgba(255,111,0,0.5)', paddingBottom: 8 }}>تواصل معنا</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              <span>📞 07700000000</span>
              <span>📧 info@electro-store.com</span>
              <span>📍 بغداد، العراق</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          © 2024 متجر الكترو — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
