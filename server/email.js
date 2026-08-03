import nodemailer from 'nodemailer';
import db from './database.js';

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

function createTransporter(s) {
  if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) return null;
  return nodemailer.createTransport({
    host: s.smtp_host,
    port: Number(s.smtp_port) || 587,
    secure: Number(s.smtp_port) === 465,
    auth: { user: s.smtp_user, pass: s.smtp_pass },
  });
}

export async function sendOrderConfirmation({ to, orderId, items, total, shippingFee, governorate, storeName }) {
  const s = getSettings();
  const transporter = createTransporter(s);
  if (!transporter || !to) return;
  const name = storeName || s.store_name || 'بذور';
  const fee = Number(shippingFee) || 0;
  const subtotal = Number(total) - fee;
  const itemsHtml = (items || []).map(i =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:left">${(i.price*i.qty).toLocaleString()} د.ا</td></tr>`
  ).join('');
  const shippingRow = fee > 0 ? `
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#555">
      <span>🚚 رسوم التوصيل${governorate ? ` (${governorate})` : ''}</span>
      <span>${fee.toLocaleString()} د.ا</span>
    </div>` : '';
  try {
    await transporter.sendMail({
      from: s.smtp_from || s.smtp_user,
      to,
      subject: `✅ تم استلام طلبك #${orderId} — ${name}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden">
          <div style="background:#004729;padding:28px 32px;text-align:center">
            <h2 style="color:#fff;margin:0;font-size:22px">✅ تم استلام طلبك!</h2>
            <p style="color:rgba(255,255,255,0.75);margin:8px 0 0">رقم الطلب: <strong style="color:#a8e6c4">#${orderId}</strong></p>
          </div>
          <div style="padding:28px 32px">
            <p style="color:#333;font-size:15px;line-height:1.7">شكراً لطلبك من <strong>${name}</strong>. سيتواصل معك فريقنا قريباً لتأكيد الطلب والتوصيل.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
              <thead><tr style="background:#f5f7f5"><th style="padding:8px 12px;text-align:right">المنتج</th><th style="padding:8px 12px;text-align:center">الكمية</th><th style="padding:8px 12px;text-align:left">السعر</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="border-top:2px solid #e0e0e0;padding-top:14px;margin-top:4px">
              ${fee > 0 ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#555"><span>المجموع الفرعي</span><span>${subtotal.toLocaleString()} د.ا</span></div>` : ''}
              ${shippingRow}
              <div style="background:#f0f9f4;border-radius:8px;padding:14px 18px;margin-top:10px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:15px;font-weight:bold;color:#004729">الإجمالي</span>
                <span style="font-size:18px;font-weight:900;color:#004729">${Number(total).toLocaleString()} د.ا</span>
              </div>
            </div>
          </div>
          <div style="background:#f5f7f5;padding:16px 32px;text-align:center;color:#888;font-size:13px">${name}</div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

export async function sendOutOfStockNotification({ to, outOfStockItems, storeName }) {
  const s = getSettings();
  const transporter = createTransporter(s);
  if (!transporter || !to) return;
  const name = storeName || s.store_name || 'بذور';
  const itemsHtml = outOfStockItems.map(i =>
    `<li style="padding:6px 0;border-bottom:1px solid #eee;color:#333">${i.name}</li>`
  ).join('');
  try {
    await transporter.sendMail({
      from: s.smtp_from || s.smtp_user,
      to,
      subject: `⚠️ منتج غير متوفر في طلبك — ${name}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden">
          <div style="background:#FF6F00;padding:28px 32px;text-align:center">
            <h2 style="color:#fff;margin:0;font-size:22px">⚠️ منتج غير متوفر حالياً</h2>
          </div>
          <div style="padding:28px 32px">
            <p style="color:#333;font-size:15px;line-height:1.7">عذراً، المنتجات التالية غير متوفرة حالياً في مخزوننا:</p>
            <ul style="list-style:none;padding:0;margin:16px 0;font-size:14px">${itemsHtml}</ul>
            <p style="color:#555;font-size:14px;line-height:1.7">يرجى التواصل معنا أو اختيار منتجات بديلة. نعتذر عن الإزعاج.</p>
          </div>
          <div style="background:#f5f7f5;padding:16px 32px;text-align:center;color:#888;font-size:13px">${name}</div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

export async function sendOrderStatusUpdate({ to, orderId, status, storeName }) {
  const s = getSettings();
  const transporter = createTransporter(s);
  if (!transporter || !to) return;
  const name = storeName || s.store_name || 'بذور';
  const statusLabels = {
    confirmed: '✅ تم تأكيد طلبك',
    delivered: '🚚 طلبك قيد التوصيل',
    cancelled: '❌ تم إلغاء طلبك',
    pending: '⏳ طلبك قيد المعالجة',
  };
  const label = statusLabels[status] || 'تم تحديث حالة طلبك';
  try {
    await transporter.sendMail({
      from: s.smtp_from || s.smtp_user,
      to,
      subject: `${label} #${orderId} — ${name}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden">
          <div style="background:#004729;padding:28px 32px;text-align:center">
            <h2 style="color:#fff;margin:0;font-size:22px">${label}</h2>
            <p style="color:rgba(255,255,255,0.75);margin:8px 0 0">رقم الطلب: <strong style="color:#a8e6c4">#${orderId}</strong></p>
          </div>
          <div style="padding:28px 32px;text-align:center">
            <p style="color:#333;font-size:15px;line-height:1.7">تم تحديث حالة طلبك رقم <strong>#${orderId}</strong>.</p>
            ${status === 'cancelled' ? '<p style="color:#c62828">إذا كان لديك أي استفسار يرجى التواصل معنا.</p>' : ''}
          </div>
          <div style="background:#f5f7f5;padding:16px 32px;text-align:center;color:#888;font-size:13px">${name}</div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}
