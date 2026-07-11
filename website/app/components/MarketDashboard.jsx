'use client';

import { useEffect, useState, useCallback } from 'react';

function fmt(n, digits) {
  if (n == null || Number.isNaN(n)) return '--';
  return Number(n).toLocaleString('vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function Spark({ data, up }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 34;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const color = up ? 'var(--mk-up)' : 'var(--mk-down)';
  return (
    <svg className="mk-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Card lấy tự động từ API.
function LiveCard({ it }) {
  const up = (it.changePct ?? 0) >= 0;
  const hasData = it.price != null;
  return (
    <div className={`mk-card${hasData ? '' : ' mk-card-empty'}`}>
      <div className="mk-card-top">
        <span className="mk-label">{it.label}</span>
        <span className="mk-unit">{it.unit}</span>
      </div>
      <div className="mk-price">{fmt(it.price, it.digits ?? 2)}</div>
      <div className="mk-card-bottom">
        {!hasData ? (
          <span className="mk-change flat">chưa lấy được dữ liệu</span>
        ) : it.changePct != null ? (
          <span className={`mk-change ${up ? 'up' : 'down'}`}>
            {up ? '▲' : '▼'} {Math.abs(it.changePct).toFixed(2)}%
          </span>
        ) : (
          <span className="mk-change flat">{it.note || 'giá hiện tại'}</span>
        )}
        <Spark data={it.spark} up={up} />
      </div>
    </div>
  );
}

// Card số liệu bổ sung, điền từ CMS (dùng cho chỉ số chưa có nguồn tự động).
function ManualCard({ c }) {
  return (
    <div className="mk-card mk-card-manual">
      <div className="mk-card-top">
        <span className="mk-label">{c.label}</span>
        {c.unit && <span className="mk-unit">{c.unit}</span>}
      </div>
      <div className="mk-price">{c.value || '--'}</div>
      <div className="mk-card-bottom">
        {c.note ? <span className="mk-change flat">{c.note}</span> : <span />}
      </div>
    </div>
  );
}

export default function MarketDashboard({ manualCards = [] }) {
  const [state, setState] = useState({ loading: true, error: false, items: [], updatedAt: null });

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/market', { cache: 'no-store' });
      if (!r.ok) throw new Error('bad');
      const j = await r.json();
      setState({ loading: false, error: false, items: j.items || [], updatedAt: j.updatedAt });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: s.items.length === 0 }));
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 120000); // làm mới mỗi 2 phút
    return () => clearInterval(id);
  }, [load]);

  const manual = Array.isArray(manualCards) ? manualCards.filter((c) => c && c.label) : [];

  if (state.loading) {
    return (
      <div className="mk-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="mk-card mk-skeleton" key={i} />
        ))}
      </div>
    );
  }

  // Lỗi toàn phần: vẫn hiện các card nhập tay nếu có, thay vì trắng trang.
  if (state.error && state.items.length === 0) {
    return (
      <>
        {manual.length > 0 && (
          <div className="mk-grid">
            {manual.map((c, i) => (
              <ManualCard c={c} key={`m-${i}`} />
            ))}
          </div>
        )}
        <p className="mk-note">Chưa tải được dữ liệu thị trường. Thử lại sau ít phút nhé.</p>
      </>
    );
  }

  const failed = state.items.filter((it) => it.price == null).length;

  return (
    <>
      <div className="mk-grid">
        {state.items.map((it) => (
          <LiveCard it={it} key={it.key} />
        ))}
        {manual.map((c, i) => (
          <ManualCard c={c} key={`m-${i}`} />
        ))}
      </div>
      {state.updatedAt && (
        <p className="mk-updated">
          Cập nhật lúc{' '}
          {new Date(state.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · tự làm mới mỗi 2 phút
          {failed > 0 ? ` · ${failed} nguồn đang lỗi` : ''}
        </p>
      )}
    </>
  );
}
