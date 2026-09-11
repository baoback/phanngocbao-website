'use client';

import { useState } from 'react';

// ---- Tiện ích chung ----------------------------------------------------------

// Đọc số từ ô nhập: rỗng/không hợp lệ trả null để biết là "chưa nhập".
function num(v) {
  if (v === '' || v == null) return null;
  const n = Number(String(v).replace(/,/g, '.'));
  return Number.isFinite(n) ? n : null;
}

const vnd = (n) =>
  n == null || !Number.isFinite(n)
    ? '--'
    : Math.round(n).toLocaleString('vi-VN') + ' đ';

const numFmt = (n, d = 0) =>
  n == null || !Number.isFinite(n)
    ? '--'
    : Number(n).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });

const pct = (n, d = 1) => (n == null || !Number.isFinite(n) ? '--' : `${numFmt(n, d)}%`);

function Field({ label, value, onChange, suffix, placeholder }) {
  return (
    <label className="tl-field">
      <span className="tl-field-label">{label}</span>
      <span className="tl-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          min="0"
        />
        {suffix && <span className="tl-suffix">{suffix}</span>}
      </span>
    </label>
  );
}

function Stat({ label, value, tone, hint }) {
  return (
    <div className={`tl-stat${tone ? ` ${tone}` : ''}`}>
      <span className="tl-stat-label">{label}</span>
      <span className="tl-stat-value">{value}</span>
      {hint && <span className="tl-stat-hint">{hint}</span>}
    </div>
  );
}

function Tool({ title, note, children }) {
  return (
    <section className="tl-tool reveal-up">
      <div className="tl-tool-head">
        <h2 className="tl-tool-title">{title}</h2>
        {note && <p className="tl-tool-note">{note}</p>}
      </div>
      <div className="tl-tool-body">{children}</div>
    </section>
  );
}

// ---- 1) ROI / ROAS -----------------------------------------------------------

function RoiTool({ title, note }) {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');

  const c = num(cost);
  const r = num(revenue);
  const g = num(cogs) || 0;
  const ready = c != null && c > 0 && r != null;

  const roas = ready ? r / c : null;
  const profit = ready ? r - c - g : null;
  const roi = ready ? ((r - c - g) / c) * 100 : null;

  return (
    <Tool title={title} note={note}>
      <div className="tl-grid">
        <div className="tl-inputs">
          <Field label="Chi phí quảng cáo" value={cost} onChange={setCost} suffix="đ" />
          <Field label="Doanh thu thu về" value={revenue} onChange={setRevenue} suffix="đ" />
          <Field label="Giá vốn hàng bán (tuỳ chọn)" value={cogs} onChange={setCogs} suffix="đ" />
        </div>
        <div className="tl-results">
          <Stat label="ROAS (doanh thu / chi phí QC)" value={ready ? `${numFmt(roas, 2)}x` : '--'} />
          <Stat
            label="ROI"
            value={pct(roi, 1)}
            tone={ready ? (roi >= 0 ? 'good' : 'bad') : ''}
          />
          <Stat
            label="Lợi nhuận"
            value={vnd(profit)}
            tone={ready ? (profit >= 0 ? 'good' : 'bad') : ''}
            hint={g > 0 ? 'đã trừ chi phí QC và giá vốn' : 'đã trừ chi phí quảng cáo'}
          />
        </div>
      </div>
    </Tool>
  );
}

// ---- 2) Ngân sách Ads -> số đơn ---------------------------------------------

function AdBudgetTool({ title, note }) {
  const [budget, setBudget] = useState('');
  const [cpc, setCpc] = useState('');
  const [cr, setCr] = useState('');

  const b = num(budget);
  const p = num(cpc);
  const rate = num(cr);
  const ready = b != null && b > 0 && p != null && p > 0;

  const clicks = ready ? b / p : null;
  const orders = ready && rate != null ? clicks * (rate / 100) : null;
  const cpa = orders && orders > 0 ? b / orders : null;

  return (
    <Tool title={title} note={note}>
      <div className="tl-grid">
        <div className="tl-inputs">
          <Field label="Ngân sách chiến dịch" value={budget} onChange={setBudget} suffix="đ" />
          <Field label="Giá mỗi click (CPC)" value={cpc} onChange={setCpc} suffix="đ" />
          <Field label="Tỷ lệ chuyển đổi" value={cr} onChange={setCr} suffix="%" />
        </div>
        <div className="tl-results">
          <Stat label="Số click ước tính" value={clicks != null ? numFmt(clicks, 0) : '--'} />
          <Stat
            label="Số đơn / lead"
            value={orders != null ? numFmt(orders, 0) : '--'}
            tone={orders != null && orders > 0 ? 'good' : ''}
          />
          <Stat label="Chi phí mỗi đơn (CPA)" value={vnd(cpa)} hint="ngân sách / số đơn" />
        </div>
      </div>
    </Tool>
  );
}

// ---- 3) Điểm hòa vốn & biên lợi nhuận ---------------------------------------

function BreakEvenTool({ title, note }) {
  const [price, setPrice] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [fixed, setFixed] = useState('');

  const pr = num(price);
  const uc = num(unitCost);
  const fx = num(fixed) || 0;
  const ready = pr != null && pr > 0 && uc != null;

  const contrib = ready ? pr - uc : null; // lợi nhuận mỗi sản phẩm
  const margin = ready ? (contrib / pr) * 100 : null;
  const canBreak = ready && contrib > 0;
  const beUnits = canBreak ? Math.ceil(fx / contrib) : null;

  return (
    <Tool title={title} note={note}>
      <div className="tl-grid">
        <div className="tl-inputs">
          <Field label="Giá bán mỗi sản phẩm" value={price} onChange={setPrice} suffix="đ" />
          <Field label="Giá vốn mỗi sản phẩm" value={unitCost} onChange={setUnitCost} suffix="đ" />
          <Field label="Chi phí cố định (tháng)" value={fixed} onChange={setFixed} suffix="đ" />
        </div>
        <div className="tl-results">
          <Stat
            label="Lợi nhuận mỗi sản phẩm"
            value={vnd(contrib)}
            tone={ready ? (contrib > 0 ? 'good' : 'bad') : ''}
          />
          <Stat label="Biên lợi nhuận" value={pct(margin, 1)} />
          <Stat
            label="Số lượng hòa vốn"
            value={
              !ready
                ? '--'
                : canBreak
                ? `${numFmt(beUnits, 0)} sản phẩm`
                : 'Không thể hòa vốn'
            }
            tone={ready && !canBreak ? 'bad' : ''}
            hint={
              ready && !canBreak
                ? 'giá bán đang thấp hơn hoặc bằng giá vốn'
                : 'để bù hết chi phí cố định'
            }
          />
        </div>
      </div>
    </Tool>
  );
}

// ---- 4) CAC & LTV ------------------------------------------------------------

function CacLtvTool({ title, note }) {
  const [spend, setSpend] = useState('');
  const [customers, setCustomers] = useState('');
  const [arpu, setArpu] = useState('');
  const [marginPct, setMarginPct] = useState('');
  const [months, setMonths] = useState('');

  const s = num(spend);
  const cus = num(customers);
  const a = num(arpu);
  const m = num(marginPct);
  const mo = num(months);

  const cacReady = s != null && s > 0 && cus != null && cus > 0;
  const cac = cacReady ? s / cus : null;

  const ltvReady = a != null && a > 0 && m != null && mo != null && mo > 0;
  const ltv = ltvReady ? a * (m / 100) * mo : null;

  const ratio = cac && cac > 0 && ltv != null ? ltv / cac : null;
  const ratioTone = ratio == null ? '' : ratio >= 3 ? 'good' : ratio >= 1 ? 'warn' : 'bad';
  const ratioHint =
    ratio == null
      ? 'lý tưởng khi ≥ 3 lần'
      : ratio >= 3
      ? 'mô hình khỏe: mỗi đồng thu hút khách sinh lời tốt'
      : ratio >= 1
      ? 'tạm ổn nhưng còn mỏng, nên tối ưu thêm'
      : 'đang lỗ: khách mang lại ít hơn chi phí thu hút';

  return (
    <Tool title={title} note={note}>
      <div className="tl-grid">
        <div className="tl-inputs">
          <Field label="Tổng chi phí sales + marketing" value={spend} onChange={setSpend} suffix="đ" />
          <Field label="Số khách hàng mới có được" value={customers} onChange={setCustomers} suffix="khách" />
          <Field label="Doanh thu TB mỗi khách / tháng" value={arpu} onChange={setArpu} suffix="đ" />
          <Field label="Biên lợi nhuận" value={marginPct} onChange={setMarginPct} suffix="%" />
          <Field label="Số tháng giữ chân TB" value={months} onChange={setMonths} suffix="tháng" />
        </div>
        <div className="tl-results">
          <Stat label="CAC (chi phí / 1 khách)" value={vnd(cac)} />
          <Stat label="LTV (giá trị vòng đời)" value={vnd(ltv)} />
          <Stat
            label="Tỷ lệ LTV / CAC"
            value={ratio != null ? `${numFmt(ratio, 1)}x` : '--'}
            tone={ratioTone}
            hint={ratioHint}
          />
        </div>
      </div>
    </Tool>
  );
}

const REGISTRY = {
  roi: RoiTool,
  adbudget: AdBudgetTool,
  breakeven: BreakEvenTool,
  cacltv: CacLtvTool,
};

export default function ToolsClient({ tools = [] }) {
  const list = (tools || []).filter((t) => t && t.enabled !== false && REGISTRY[t.key]);
  if (list.length === 0) {
    return <p className="tl-empty">Chưa có công cụ nào được bật.</p>;
  }
  return (
    <div className="tl-list">
      {list.map((t) => {
        const Comp = REGISTRY[t.key];
        return <Comp key={t.key} title={t.title} note={t.note} />;
      })}
    </div>
  );
}
