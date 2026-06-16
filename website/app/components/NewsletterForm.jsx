'use client';

import { useState } from 'react';

export default function NewsletterForm({ action = '', button = 'Đăng ký' }) {
  const [msg, setMsg] = useState('');

  if (action) {
    return (
      <form className="newsletter-form" action={action} method="post" target="_blank">
        <input type="email" name="email" required placeholder="Email của bạn" aria-label="Email" />
        <button type="submit" className="btn btn-primary">{button}</button>
      </form>
    );
  }

  return (
    <form
      className="newsletter-form"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg('Form nhận tin chưa được kết nối dịch vụ. Vào /admin → Cài đặt chung để dán link dịch vụ (Buttondown/Mailchimp...).');
      }}
    >
      <input type="email" name="email" required placeholder="Email của bạn" aria-label="Email" />
      <button type="submit" className="btn btn-primary">{button}</button>
      {msg && <p className="newsletter-msg">{msg}</p>}
    </form>
  );
}
