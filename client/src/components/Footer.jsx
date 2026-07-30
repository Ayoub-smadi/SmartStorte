export default function Footer() {
  return (
    <footer style={{ background: '#2A2A2A', color: '#fff', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <svg width="38" height="38" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="20" stroke="#6DC534" strokeWidth="2.5" fill="transparent"/>
                <polygon points="23,7 14,23 21,23 19,35 28,19 21,19" fill="#6DC534"/>
              </svg>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17 }}>بذور زراعية</div>
                <div style={{ fontSize: 11, color: '#6DC534', fontWeight: 600 }}>للمحترفين</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8 }}>
              وجهتك الأولى للبذور الزراعية الاحترافية — محاصيل، زينة، ومايكروجرين.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: '#6DC534', borderBottom: '1px solid rgba(109,197,52,0.3)', paddingBottom: 10 }}>روابط سريعة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['الرئيسية','#/'],['المنتجات','#/products']].map(([label,href]) => (
                <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, transition: '0.2s' }}
                  onMouseOver={e => e.target.style.color='#6DC534'}
                  onMouseOut={e => e.target.style.color='rgba(255,255,255,0.65)'}>{label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: '#6DC534', borderBottom: '1px solid rgba(109,197,52,0.3)', paddingBottom: 10 }}>تواصل معنا</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
              <span>📞 07700000000</span>
              <span>📧 info@seeds-pro.com</span>
              <span>📍 العراق</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          © 2024 بذور زراعية للمحترفين — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
