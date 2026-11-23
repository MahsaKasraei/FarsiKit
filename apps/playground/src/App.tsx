import { useMemo, useState } from "react";
import {
  addZwnj,
  analyzePersianText,
  containsPersian,
  createMetaDescription,
  convertDigits,
  getKeywordStats,
  getReadingTime,
  isValidIranianMobile,
  normalizeIranianPhone,
  getTextStats,
  normalizePersian,
  normalizeUnicode,
  slugifyPersian,
  stripArabicDiacritics
} from "@farsikit/core";

const sample = "اين يك متن فارسی برای آزمايش حروف عربي است؛ علي در اين كتاب دربارهٔ زندگي، مسئوليت‌ های مهم و خانهٔ زيبايش می‌نويسد. شماره 123 را هم ببينيد.";

export default function App() {
  const [input, setInput] = useState(sample);
  const [digits, setDigits] = useState<"persian" | "arabic" | "latin">("latin");
  const [removeDiacritics, setRemoveDiacritics] = useState(false);
  const [useZwnj, setUseZwnj] = useState(true);
  const [fixEzafe, setFixEzafe] = useState(false);
  const [copied, setCopied] = useState("");
  const [phone, setPhone] = useState("۰۹۱۲ ۳۴۵ ۶۷۸۹");
  const [activePanel, setActivePanel] = useState<"review" | "quick" | "stats" | "content" | null>(null);
  const normalized = useMemo(() => {
    const value = normalizePersian(input, {
      convertDigits: digits,
      removeDiacritics,
      normalizeEzafe: fixEzafe,
      normalizeWhitespace: true,
      fixPunctuation: true
    });
    return useZwnj ? addZwnj(value) : value;
  }, [input, digits, removeDiacritics, fixEzafe, useZwnj]);

  const slug = useMemo(() => slugifyPersian(input), [input]);
  const unicode = useMemo(() => normalizeUnicode(input), [input]);
  const withoutMarks = useMemo(() => stripArabicDiacritics(input), [input]);
  const stats = useMemo(() => getTextStats(input), [input]);
  const hasPersian = containsPersian(input);
  const phoneNormalized = normalizeIranianPhone(phone);
  const reading = getReadingTime(input);
  const metaDescription = createMetaDescription(input);
  const keywords = getKeywordStats(input, 8);
  const issues = useMemo(() => analyzePersianText(input), [input]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      setCopied("کپی در این مرورگر در دسترس نیست");
    }
  };

  return (
    <main className="page" dir="rtl">
      <header className="topbar">
        <div className="top-actions"><span className="version"><i /> نسخه ۰.۳.۵</span><button className="round-action" aria-label="تغییر پوسته">☾</button><a className="github-link" href="https://github.com/MahsaKasraei/FarsiKit" target="_blank" rel="noreferrer" aria-label="گیت‌هاب">●</a></div>
        <nav className="main-nav"><a href="#tools">ابزارها⌂</a><a href="#about">درباره ما⌄</a><a href="#help">راهنما ؟</a></nav>
        <a className="brand" href="#" aria-label="FarsiKit home"><span>FarsiKit</span><span className="brand-mark">ف</span></a>
      </header>

      <section className="hero">
        <div className="hero-art" aria-label="تصویر لپ‌تاپ با حرف ف فارسی"><div className="plant plant-left"><i/><i/><i/><i/><i/></div><div className="book-stack"><i/><i/></div><div className="laptop"><div className="laptop-screen"><b>ف</b><i/></div><div className="laptop-base"/></div><span className="float-chip chip-type">T</span><span className="float-chip chip-check">✓</span><span className="float-chip chip-code">&lt;/&gt;</span></div>
        <div className="hero-copy"><div className="hero-brand">FarsiKit</div><h1>جعبه‌ابزار حرفه‌ای پردازش متن فارسی</h1><p>اصلاح متن، نیم‌فاصله، تبدیل اعداد، و ابزارهای کاربردی دیگر<br/>همه در یک محیط زیبا و قدرتمند!</p><div className="hero-actions"><a href="#workspace" className="primary-cta">شروع کنید ↗</a><a href="#tools" className="secondary-cta">مشاهده همه ابزارها ⠿</a></div></div>
      </section>

      <section className="workspace" id="workspace">
        <div className="panel">
          <div className="panel-heading">
            <div><span className="step">۰۱</span><h2>متن ورودی</h2></div>
            <button className="subtle" onClick={() => setInput("")}>پاک کردن</button>
          </div>
          <p className="input-hint">هر بار یک بخش از متن را وارد کن؛ برای حفظ دقت و سرعت، حداکثر ۵۰۰۰ کاراکتر در هر نوبت.</p>
          <textarea maxLength={5000} value={input} onChange={(event) => setInput(event.target.value)} placeholder="متن خود را اینجا وارد کنید..." />
          <div className="panel-footer"><span>متن فقط در همین مرورگر پردازش می‌شود.</span><span>{input.length.toLocaleString("fa-IR")} از ۵۰۰۰ کاراکتر</span></div>
        </div>

        <div className="panel output-panel">
          <div className="panel-heading">
            <div><span className="step">۰۲</span><h2>خروجی نرمال‌سازی</h2></div>
            <select value={digits} onChange={(event) => setDigits(event.target.value as typeof digits)} aria-label="نوع ارقام">
              <option value="persian">اعداد فارسی</option>
              <option value="arabic">اعداد عربی</option>
              <option value="latin">اعداد لاتین</option>
            </select>
          </div>
          <div className="toggles">
            <label><input type="checkbox" checked={removeDiacritics} onChange={(e) => setRemoveDiacritics(e.target.checked)} /> حذف اعراب</label>
            <label><input type="checkbox" checked={useZwnj} onChange={(e) => setUseZwnj(e.target.checked)} /> اصلاح نیم‌فاصله</label>
            <label><input type="checkbox" checked={fixEzafe} onChange={(e) => setFixEzafe(e.target.checked)} /> تبدیل همزهٔ اضافه به نیم‌فاصله + ی</label>
          </div>
          <div className="output" dir="rtl">{normalized || <span className="placeholder">خروجی اینجا نمایش داده می‌شود...</span>}</div>
          <div className="panel-footer"><span>یکسان‌سازی حروف، فاصله‌ها، ارقام و نیم‌فاصله</span><button className="copy" onClick={() => copy(normalized, "خروجی نرمال‌سازی کپی شد")}>کپی خروجی ↗</button></div>
        </div>
      </section>

      <section className="extras">
        <div className="extras-heading">
          <div><span className="eyebrow">امکانات تکمیلی</span><h2>ابزارهای بیشتر، فقط وقتی به آن‌ها نیاز داری</h2></div>
          <p>برای باز کردن هر بخش، یکی از گزینه‌ها را انتخاب کن.</p>
        </div>
        <div className="extras-tabs" role="tablist" aria-label="امکانات تکمیلی">
          <button role="tab" aria-selected={activePanel === "review"} className="shortcut quality" onClick={() => setActivePanel(activePanel === "review" ? null : "review")}><b>✓</b><strong>بازرس کیفیت متن</strong><small>بررسی و رفع خطاها</small></button>
          <button role="tab" aria-selected={activePanel === "quick"} className="shortcut dev" onClick={() => setActivePanel(activePanel === "quick" ? null : "quick")}><b>&lt;/&gt;</b><strong>ابزارهای توسعه</strong><small>ابزارهای مفید برنامه‌نویسان</small></button>
          <button role="tab" aria-selected={activePanel === "stats"} className="shortcut analytics" onClick={() => setActivePanel(activePanel === "stats" ? null : "stats")}><b>▥</b><strong>تحلیل و آمار متن</strong><small>بررسی و نمایش آمار</small></button>
          <button role="tab" aria-selected={activePanel === "content"} className="shortcut seo" onClick={() => setActivePanel(activePanel === "content" ? null : "content")}><b>⌕</b><strong>ابزارهای سئو</strong><small>بهینه‌سازی محتوای وب</small></button>
        </div>
      </section>

      {activePanel === "review" && (
      <section className="inspector">
        <div className="section-heading"><span className="step">۰۶</span><h2>بازرس کیفیت متن فارسی</h2></div>
        <div className="inspector-card">
          <div className="inspector-summary">
            <div><strong>{issues.length.toLocaleString("fa-IR")}</strong><span>دستهٔ ایرادهای شناسایی‌شده</span></div>
            <p>بررسی خودکار متن برای پیدا کردن چند خطای رایج تایپی و نگارشی فارسی. این ابزار پیشنهاددهنده است و جایگزین ویراستار انسانی نیست.</p>
          </div>
          {issues.length ? <div className="issue-list">{issues.map((issue) => (
            <div className="issue-row" key={issue.code}>
              <span className={issue.severity === "warning" ? "issue-dot warning" : "issue-dot"} />
              <div><strong>{issue.message}</strong><span>تعداد موارد: {issue.count.toLocaleString("fa-IR")}</span></div>
            </div>
          ))}</div> : <div className="clean-report">متن از نظر قواعدی که بررسی می‌کنیم، موردی برای گزارش ندارد. ✨</div>}
        </div>
      </section>
      )}

      {activePanel === "quick" && (
      <section className="tools-section">
        <div className="section-heading"><span className="step">۰۳</span><h2>ابزارهای سریع متن</h2></div>
        <div className="tool-grid">
          <Tool title="اسلاگ فارسی" code="slugifyPersian" description="ساخت آدرس خوانا برای URL؛ تبدیل ارقام به لاتین و حذف نشانه‌های اضافی." value={slug} onCopy={() => copy(slug, "اسلاگ کپی شد")} />
          <Tool title="حذف اعراب" code="stripArabicDiacritics" description="حذف حرکات و اعراب عربی بدون حذف حروف اصلی." value={withoutMarks} onCopy={() => copy(withoutMarks, "متن بدون اعراب کپی شد")} />
          <Tool title="نرمال‌سازی یونیکد" code="normalizeUnicode" description="یکسان‌سازی نمایش کاراکتر‌های معادل با استاندارد NFC." value={unicode} onCopy={() => copy(unicode, "متن یونیکد کپی شد")} />
          <div className="tool-card detector">
            <div className="tool-top"><h3>تشخیص متن فارسی</h3><code>containsPersian</code></div>
            <p>بررسی وجود کاراکتر‌هایی از بلوک یونیکد فارسی و عربی در متن ورودی.</p>
            <strong className={hasPersian ? "detected" : "not-detected"}>{hasPersian ? "متن فارسی/عربی دارد" : "حروف فارسی/عربی پیدا نشد"}</strong>
          </div>
        </div>
      </section>
      )}

      {activePanel === "stats" && (
      <section className="stats">
        <div className="stats-title"><span className="step">۰۴</span><h2>آمار پیشرفته متن</h2></div>
        <div className="stat-grid">
          <Stat label="تعداد واژه" value={stats.words} />
          <Stat label="تعداد کاراکتر" value={stats.characters} />
          <Stat label="بدون فاصله" value={stats.charactersWithoutWhitespace} />
          <Stat label="تعداد خطوط" value={stats.lines} />
          <Stat label="حروف فارسی" value={stats.persianLetters} />
          <Stat label="حروف عربی جایگزین" value={stats.arabicVariants} />
          <Stat label="نیم‌فاصله" value={stats.zwnj} />
          <Stat label="اعراب و حرکات" value={stats.diacritics} />
        </div>
      </section>
      )}

      {activePanel === "content" && (
      <section className="pro-tools">
        <div className="section-heading"><span className="step">۰۵</span><h2>ابزارهای محتوا، سئو و شماره موبایل</h2></div>
        <div className="pro-grid">
          <div className="tool-card">
            <div className="tool-top"><h3>تبدیل و اعتبارسنجی موبایل ایران</h3><code>Iranian phone</code></div>
            <p>شماره را با ارقام فارسی، لاتین یا پیش‌شماره بین‌المللی وارد کن.</p>
            <input className="phone-input" dir="auto" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷" />
            <div className="phone-result">
              <strong className={phoneNormalized ? "detected" : "not-detected"}>{phoneNormalized ? (isValidIranianMobile(phone) ? "شماره معتبر است" : "فرمت پشتیبانی نمی‌شود") : "شماره قابل تشخیص نیست"}</strong>
              <span dir="ltr">{phoneNormalized || "—"}</span>
            </div>
            <button className="tool-copy" onClick={() => copy(phoneNormalized, "شماره نرمال‌شده کپی شد")} disabled={!phoneNormalized}>کپی شماره استاندارد</button>
          </div>
          <div className="tool-card">
            <div className="tool-top"><h3>آماده‌سازی توضیحات متا</h3><code>createMetaDescription</code></div>
            <p>پیشنهاد توضیحات متا با پاک‌سازی فاصله‌ها و محدودیت پیش‌فرض ۱۶۰ کاراکتر.</p>
            <div className="tool-value" dir="rtl">{metaDescription || <span className="placeholder">متن مقاله را وارد کن...</span>}</div>
            <div className="mini-meta"><span>{[...metaDescription].length} / ۱۶۰ کاراکتر</span><button className="tool-copy" onClick={() => copy(metaDescription, "توضیحات متا کپی شد")} disabled={!metaDescription}>کپی متا</button></div>
          </div>
          <div className="tool-card">
            <div className="tool-top"><h3>زمان تقریبی مطالعه</h3><code>getReadingTime</code></div>
            <p>برآورد بر اساس تعداد واژه و سرعت پیش‌فرض ۲۰۰ واژه در دقیقه.</p>
            <div className="reading-metrics">
              <div><strong>{reading.minutes.toLocaleString("fa-IR")}</strong><span>دقیقه</span></div>
              <div><strong>{reading.words.toLocaleString("fa-IR")}</strong><span>واژه</span></div>
              <div><strong>{reading.seconds.toLocaleString("fa-IR")}</strong><span>ثانیه</span></div>
            </div>
          </div>
          <div className="tool-card">
            <div className="tool-top"><h3>تکرار واژه‌های کلیدی</h3><code>getKeywordStats</code></div>
            <p>نمایش فراوانی ساده واژه‌ها برای بازبینی محتوای مقاله؛ نه تحلیل‌گر کامل سئو.</p>
            {keywords.length ? <div className="keyword-list">{keywords.map((item) => <div className="keyword-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count.toLocaleString("fa-IR")} بار</span><span>{item.density.toLocaleString("fa-IR")}%</span></div>)}</div> : <div className="tool-value">برای تحلیل، متن وارد کن.</div>}
          </div>
        </div>
      </section>
      )}




      {copied && <div className="toast" role="status">{copied}</div>}

      <footer id="about"><span>FarsiKit</span><span>رایگان برای همه متن‌باز با مجوز MIT　│　سریع و سبک ⚡</span></footer>
    </main>
  );
}

function Tool({ title, code, description, value, onCopy }: {
  title: string; code: string; description: string; value: string; onCopy: () => void;
}) {
  return <div className="tool-card">
    <div className="tool-top"><h3>{title}</h3><code>{code}</code></div>
    <p>{description}</p>
    <div className="tool-value" dir="rtl">{value || <span className="placeholder">—</span>}</div>
    <button className="tool-copy" onClick={onCopy} disabled={!value}>کپی نتیجه</button>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><span>{label}</span><strong>{value.toLocaleString("fa-IR")}</strong></div>;
}
