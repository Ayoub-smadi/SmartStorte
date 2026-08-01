import { useApp } from '../App.jsx';

export default function Footer() {
  const { settings } = useApp();
  const storeName = settings?.store_name || 'بذور';
  const logoUrl = settings?.logo_url || '/logo.png';
  const footerDesc = settings?.footer_desc || 'وجهتك الأولى للبذور الزراعية الاحترافية — محاصيل، زينة، ومايكروجرين.';
  const phone = settings?.footer_phone || '07700000000';
  const emailContact = settings?.footer_email_contact || 'info@seeds-pro.com';
  const location = settings?.footer_location || 'العراق';
  const copyright = settings?.footer_copyright || `© 2024 ${storeName} — جميع الحقوق محفوظة`;

  return (
    <footer style={{ background: '#004729', color: '#fff', marginTop: 60, borderTop: '1px solid #003320' }}>
      <div className="container" style={{ padding: '48px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src={logoUrl} alt="logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: 900, fontSize: 20 }}>{storeName}</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.8 }}>
              {footerDesc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: '#5aba87', borderBottom: '1px solid rgba(0,71,41,0.5)', paddingBottom: 10 }}>روابط سريعة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['الرئيسية','#/'],['المنتجات','#/products'],['تواصل معنا',`mailto:${emailContact}`]].map(([label,href]) => (
                <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, transition: '0.2s' }}
                  onMouseOver={e => e.target.style.color='#5aba87'}
                  onMouseOut={e => e.target.style.color='rgba(255,255,255,0.55)'}>{label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: '#5aba87', borderBottom: '1px solid rgba(0,71,41,0.5)', paddingBottom: 10 }}>تواصل معنا</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
              {phone && <span>📞 {phone}</span>}
              {emailContact && <span>📧 {emailContact}</span>}
              {location && <span>📍 {location}</span>}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          {copyright}
        </div>
      </div>
    </footer>
  );
}
