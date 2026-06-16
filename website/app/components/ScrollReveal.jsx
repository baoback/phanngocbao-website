'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Chạy lại mỗi khi đổi trang (kể cả khi bấm back), tránh các thẻ bị kẹt ẩn
    const els = document.querySelectorAll('.reveal:not(.in-view), .reveal-up:not(.in-view)');
    if (els.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));

    // Phòng hờ: sau 1.2s, hiện hết những gì còn sót (vd ảnh/layout dịch chuyển)
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in-view), .reveal-up:not(.in-view)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('in-view');
      });
    }, 1200);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [pathname]);

  return null;
}
