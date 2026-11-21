import { useMemo, useState } from "react";
import { addZwnj, convertDigits, getTextStats, normalizePersian } from "@farsikit/core";

const sample = "كتاب علي 123 ، این یک متن آزمایشی است.";

export default function App() {
  const [input, setInput] = useState(sample);
  const [digits, setDigits] = useState<"persian" | "arabic" | "latin">("persian");
  const normalized = useMemo(
    () => addZwnj(normalizePersian(input, { convertDigits: digits })),
    [input, digits]
  );
  const stats = useMemo(() => getTextStats(input), [input]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(normalized);
    } catch {
      // Clipboard access may be unavailable in insecure contexts.
    }
  };

  return (
    <main className="page" dir="rtl">
      <header className="topbar">
        <a className="brand" href="#" aria-label="FarsiKit home">
          <span className="brand-mark">ف</span>
          <span>FarsiKit</span>
        </a>
        <span className="version">نسخه ۰.۲.۰</span>
      </header>

      <section className="hero">
        <div className="eyebrow">ابزار متن‌باز توسعه فارسی</div>
        <h1>متن فارسی، <span>مرتب و استاندارد.</span></h1>
        <p>ابزارهای کوچک و کاربردی برای نرمال‌سازی متن فارسی و تجربه بهتر راست‌به‌چپ در وب.</p>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-heading">
            <div><span className="step">۰۱</span><h2>متن ورودی</h2></div>
            <button className="subtle" onClick={() => setInput("")}>پاک کردن</button>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="متن فارسی‌ات را اینجا وارد کن..." />
          <div className="panel-footer">
            <span>متن شما در همین مرورگر پردازش می‌شود.</span>
            <span>{stats.characters} نویسه</span>
          </div>
        </div>

        <div className="panel output-panel">
          <div className="panel-heading">
            <div><span className="step">۰۲</span><h2>خروجی استاندارد</h2></div>
            <select value={digits} onChange={(event) => setDigits(event.target.value as typeof digits)} aria-label="نوع ارقام">
              <option value="persian">اعداد فارسی</option>
              <option value="arabic">اعداد عربی</option>
              <option value="latin">اعداد لاتین</option>
            </select>
          </div>
          <div className="output" dir="rtl">{normalized || <span className="placeholder">خروجی اینجا نمایش داده می‌شود...</span>}</div>
          <div className="panel-footer">
            <span>یکسان‌سازی حروف، فاصله‌ها و ارقام</span>
            <button className="copy" onClick={copy}>کپی خروجی ↗</button>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-title"><span className="step">۰۳</span><h2>آمار متن</h2></div>
        <div className="stat-grid">
          <Stat label="تعداد واژه" value={stats.words} />
          <Stat label="تعداد نویسه" value={stats.characters} />
          <Stat label="حروف فارسی" value={stats.persianLetters} />
          <Stat label="نیم‌فاصله" value={stats.zwnj} />
        </div>
      </section>

      <footer><span>FarsiKit</span><span>ساخته‌شده برای وب فارسی · متن‌باز با مجوز MIT</span></footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><span>{label}</span><strong>{value.toLocaleString("fa-IR")}</strong></div>;
}
