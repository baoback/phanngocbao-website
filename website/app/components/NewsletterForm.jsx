'use client';

import { useState } from 'react';

export default function NewsletterForm({ action = '', button = 'Đăng ký', field = 'email' }) {
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = (e.target.elements.email.value || '').trim();
    if (!email) return;

    if (!action) {
      setMsg(
        'Form nhận tin chưa được kết nối. Vào /admin → Cài đặt chung để dán link thu email.'
      );
      return;
    }

    setLoading(true);
    try {
      await fetch(action, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ [field]: email }).toString(),
      });
    } catch (err) {
      // no-cors: không đọc được phản hồi, vẫn coi như đã gửi thành công
    }
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <p className="newsletter-msg" style={{ flexBasis: '100%', fontSize: 16 }}>
        Cảm ơn bạn đã đăng ký! 🎉
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <input
        type="email"
        name="email"
        required
        placeholder="Email của bạn"
        aria-label="Email"
        disabled={loading}
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Đang gửi…' : button}
      </button>
      {msg && <p className="newsletter-msg">{msg}</p>}
    </form>
  );
}
