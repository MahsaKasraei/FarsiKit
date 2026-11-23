import { useMemo, useState } from "react";
import {
  addZwnj, analyzePersianText, containsPersian, createMetaDescription,
  getKeywordStats, getReadingTime, isValidIranianMobile, normalizeIranianPhone,
  getTextStats, normalizePersian, normalizeUnicode, slugifyPersian, stripArabicDiacritics
} from "@farsikit/core";

const sample = "اين يك متن فارسی برای آزمايش حروف عربي است؛ علي در اين كتاب دربارهٔ زندگي، مسئوليت‌ های مهم و خانهٔ زيبايش می‌نويسد. شماره 123 را هم ببينيد.";

type Panel = "review" | "quick" | "stats" | "content" | null;

export default function App() {
  const [input, setInput] = useState("");
  const [digits, setDigits] = useState<"persian" | "arabic" | "latin">("persian");
  const [removeDiacritics, setRemoveDiacritics] = useState(false);
  const [useZwnj, setUseZwnj] = useState(true);
  const [fixEzafe, setFixEzafe] = useState(true);
  const [copied, setCopied] = useState("");
  const [phone, setPhone] = useState("۰۹۱۲ ۳۴۵ ۶۷۸۹");
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [showMore, setShowMore] = useState(false);
  const [dark, setDark] = useState(false);

  const normalized = useMemo(() => {
    const value = normalizePersian(input, {
      convertDigits: digits, removeDiacritics, normalizeEzafe: fixEzafe,
      normalizeWhitespace: true, fixPunctuation: true
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

  const openPanel = (panel: Exclude<Panel, null>) => {
    setActivePanel(panel);
    window.setTimeout(() => document.getElementById("special-tools")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  return (
    <main className={dark ? "page dark" : "page"} dir="rtl">
      <header className="topbar">
        <a className="brand" href="#" aria-label="FarsiKit home">
          <span className="brand-mark">ف</span><span>FarsiKit</span>
        </a>
        <nav className="main-nav" aria-label="ناوبری اصلی">
          <a href="#workspace">⌂ <span>ابزارها</span></a>
          <a href="#special-tools">درباره ما</a>
          <a href="#footer">؟ <span>راهنما</span></a>
        </nav>
        <div className="top-actions">
          <button className="theme-switch" onClick={() => setDark(!dark)} aria-label="تغییر پوسته">{dark ? "☀" : "☾"} <span>☼</span></button>
          <a className="github-link" href="https://github.com/MahsaKasraei/FarsiKit" target="_blank" rel="noreferrer" aria-label="GitHub">●</a>
          <span className="version"><i /> نسخه ۰.۴.۱</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="plant plant-left"><i/><i/><i/><i/><b/></div>
          <div className="desk-book book-one"/><div className="desk-book book-two"/>
          <div className="laptop">
            <div className="laptop-screen"><span>ف</span><i/></div>
            <div className="laptop-base"/>
          </div>
          <span className="float-icon icon-type">T</span><span className="float-icon icon-code">&lt;/&gt;</span><span className="float-icon icon-check">✓</span>
          <div className="plant plant-small"><i/><i/><i/><b/></div>
        </div>
        <div className="hero-copy">
          <h1>FarsiKit</h1>
          <h2>جعبه‌ابزار حرفه‌ای پردازش متن فارسی</h2>
          <p>اصلاح متن، نیم‌فاصله، تبدیل اعداد، و ابزارهای کاربردی دیگر<br/> همه در یک محیط زیبا و قدرتمند!</p>
          <div className="hero-actions">
            <a className="button button-outline" href="#special-tools">▦ مشاهده همه ابزارها</a>
            <a className="button button-primary" href="#workspace">شروع کنید ↗</a>
          </div>
        </div>
      </section>

      <section className="workspace" id="workspace">
        <div className="editor-shell">
          <div className="editor-heading">
            <div className="editor-title"><span className="edit-icon">✎</span><h2>ویرایشگر فارسی</h2></div>
            <div className="editor-actions">
              <button onClick={() => setInput(sample)}>▣ <span>نمونه متن</span></button>
              <button onClick={() => copy(input, "متن ورودی کپی شد")}>⇄ <span>مقایسه</span></button>
              <button onClick={() => setInput("")}>♧ <span>پاک کردن</span></button>
            </div>
          </div>
          <div className="editor-panels">
            <section className="output-box">
              <div className="output-heading"><span>خروجی اصلاح‌شده</span><b>✓</b></div>
              <div className="output-content">{normalized || <div className="empty-state"><span className="document-icon">☷<b>✓</b></span><p>متن شما اینجا نمایش داده می‌شود</p></div>}</div>
              <div className="output-actions">
                <button className="button button-primary small" onClick={() => copy(normalized, "خروجی کپی شد")} disabled={!normalized}>کپی خروجی ▣</button>
                <button className="button button-soft small" onClick={() => {
                  const blob = new Blob([normalized], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "farsikit-output.txt"; a.click(); URL.revokeObjectURL(url);
                }} disabled={!normalized}>دانلود ↓</button>
              </div>
            </section>
            <section className="input-box">
              <textarea maxLength={5000} value={input} onChange={(event) => setInput(event.target.value)} placeholder="نمونه متن: اين يك متن فارسی برای آزمايش حروف عربي است؛ علي در اين كتاب دربارهٔ زندگي می‌نويسد..." />
              <div className="character-count">{input.length.toLocaleString("fa-IR")} کاراکتر</div>
            </section>
          </div>
        </div>

        <aside className="quick-settings">
          <h2>تنظیمات سریع <span>⚡</span></h2>
          <div className="quick-list">
            <label><span>نیم‌فاصله</span><input type="checkbox" checked={useZwnj} onChange={(e) => setUseZwnj(e.target.checked)}/><i/></label>
            <label><span>اصلاح حروف عربی</span><input type="checkbox" checked={true} readOnly/><i/></label>
            <label><span>تبدیل ارقام</span><select value={digits} onChange={(e) => setDigits(e.target.value as typeof digits)} aria-label="تبدیل ارقام"><option value="persian">۱۲۳</option><option value="arabic">١٢٣</option><option value="latin">123</option></select></label>
            <label><span>حذف اعراب</span><input type="checkbox" checked={removeDiacritics} onChange={(e) => setRemoveDiacritics(e.target.checked)}/><i/></label>
            <label><span>اصلاح همزه</span><input type="checkbox" checked={fixEzafe} onChange={(e) => setFixEzafe(e.target.checked)}/><i/></label>
          </div>
          <button className="more-settings" onClick={() => setShowMore(!showMore)} aria-expanded={showMore}>{showMore ? "بستن تنظیمات" : "تنظیمات بیشتر"} <span>⚙</span><b>{showMore ? "⌃" : "⌄"}</b></button>
          {showMore && <div className="more-settings-content">
            <p>حداکثر ۵۰۰۰ کاراکتر در هر نوبت</p>
            <p>متن فقط در همین مرورگر پردازش می‌شود.</p>
            <button onClick={() => { setDigits("persian"); setUseZwnj(true); setRemoveDiacritics(false); setFixEzafe(true); }}>بازنشانی تنظیمات</button>
          </div>}
        </aside>
      </section>

      <section className="special-tools" id="special-tools">
        <div className="special-heading">
          <div><span className="section-symbol">▦</span><div><h2>ابزارهای تخصصی</h2><p>ابزارهای کاربردی برای کار حرفه‌ای</p></div></div>
          <button onClick={() => { setActivePanel(null); document.getElementById("special-tools")?.scrollIntoView({ behavior: "smooth" }); }}>مشاهده همه <span>‹</span></button>
        </div>
        <div className="special-grid">
          <button className="special-card purple" onClick={() => openPanel("quick")}><span className="special-icon">&lt;/&gt;</span><strong>ابزارهای توسعه</strong><small>ابزارهای مفید برنامه‌نویسان</small><i>←</i></button>
          <button className="special-card mint" onClick={() => openPanel("review")}><span className="special-icon">✓</span><strong>بازرس کیفیت متن</strong><small>بررسی و رفع خطاها</small><i>←</i></button>
          <button className="special-card green" onClick={() => openPanel("stats")}><span className="special-icon">▥</span><strong>تحلیل و آمار متن</strong><small>بررسی و نمایش آمار</small><i>←</i></button>
          <button className="special-card peach" onClick={() => openPanel("content")}><span className="special-icon">⌕</span><strong>ابزارهای سئو</strong><small>بهینه‌سازی محتوای وب</small><i>←</i></button>
          <button className="special-card blue" onClick={() => openPanel("content")}><span className="special-icon">☎</span><strong>ابزار شماره موبایل</strong><small>استانداردسازی شماره‌ها</small><i>←</i></button>
          <button className="special-card lavender" onClick={() => openPanel("quick")}><span className="special-icon">↗</span><strong>ساخت اسلاگ</strong><small>تبدیل متن به اسلاگ استاندارد</small><i>←</i></button>
        </div>
      </section>

      {activePanel === "review" && <section className="detail-section" id="detail-panel">
        <div className="section-heading"><span className="section-symbol">✓</span><h2>بازرس کیفیت متن فارسی</h2></div>
        <div className="detail-card">
          <div className="inspector-summary"><strong>{issues.length.toLocaleString("fa-IR")}</strong><span>دستهٔ ایرادهای شناسایی‌شده</span><p>بررسی خودکار متن برای پیدا کردن چند خطای رایج تایپی و نگارشی فارسی. این ابزار پیشنهاددهنده است و جایگزین ویراستار انسانی نیست.</p></div>
          {issues.length ? <div className="issue-list">{issues.map((issue) => <div className="issue-row" key={issue.code}><span className={issue.severity === "warning" ? "issue-dot warning" : "issue-dot"}/><div><strong>{issue.message}</strong><span>تعداد موارد: {issue.count.toLocaleString("fa-IR")}</span></div></div>)}</div> : <div className="clean-report">متن از نظر قواعدی که بررسی می‌کنیم، موردی برای گزارش ندارد. ✨</div>}
        </div>
      </section>}

      {activePanel === "quick" && <section className="detail-section">
        <div className="section-heading"><span className="section-symbol">⌘</span><h2>ابزارهای سریع متن</h2></div>
        <div className="tool-grid">
          <Tool title="اسلاگ فارسی" code="slugifyPersian" description="ساخت آدرس خوانا برای URL؛ تبدیل ارقام به لاتین و حذف نشانه‌های اضافی." value={slug} onCopy={() => copy(slug, "اسلاگ کپی شد")} />
          <Tool title="حذف اعراب" code="stripArabicDiacritics" description="حذف حرکات و اعراب عربی بدون حذف حروف اصلی." value={withoutMarks} onCopy={() => copy(withoutMarks, "متن بدون اعراب کپی شد")} />
          <Tool title="نرمال‌سازی یونیکد" code="normalizeUnicode" description="یکسان‌سازی نمایش کاراکتر‌های معادل با استاندارد NFC." value={unicode} onCopy={() => copy(unicode, "متن یونیکد کپی شد")} />
          <div className="tool-card"><h3>تشخیص متن فارسی</h3><code>containsPersian</code><p>بررسی وجود کاراکتر‌هایی از بلوک یونیکد فارسی و عربی در متن ورودی.</p><strong className={hasPersian ? "detected" : "not-detected"}>{hasPersian ? "متن فارسی/عربی دارد" : "حروف فارسی/عربی پیدا نشد"}</strong></div>
        </div>
      </section>}

      {activePanel === "stats" && <section className="detail-section">
        <div className="section-heading"><span className="section-symbol">▥</span><h2>آمار پیشرفته متن</h2></div>
        <div className="stat-grid">
          <Stat label="تعداد واژه" value={stats.words}/><Stat label="تعداد کاراکتر" value={stats.characters}/>
          <Stat label="بدون فاصله" value={stats.charactersWithoutWhitespace}/><Stat label="تعداد خطوط" value={stats.lines}/>
          <Stat label="حروف فارسی" value={stats.persianLetters}/><Stat label="حروف عربی جایگزین" value={stats.arabicVariants}/>
          <Stat label="نیم‌فاصله" value={stats.zwnj}/><Stat label="اعراب و حرکات" value={stats.diacritics}/>
        </div>
      </section>}

      {activePanel === "content" && <section className="detail-section">
        <div className="section-heading"><span className="section-symbol">⌕</span><h2>ابزارهای محتوا، سئو و شماره موبایل</h2></div>
        <div className="tool-grid">
          <div className="tool-card"><h3>تبدیل و اعتبارسنجی موبایل ایران</h3><code>Iranian phone</code><p>شماره را با ارقام فارسی، لاتین یا پیش‌شماره بین‌المللی وارد کن.</p><input className="phone-input" dir="auto" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"/><div className="phone-result"><strong className={phoneNormalized ? (isValidIranianMobile(phone) ? "detected" : "not-detected") : "not-detected"}>{phoneNormalized ? (isValidIranianMobile(phone) ? "شماره معتبر است" : "فرمت پشتیبانی نمی‌شود") : "شماره قابل تشخیص نیست"}</strong><span dir="ltr">{phoneNormalized || "—"}</span></div><button className="tool-copy" onClick={() => copy(phoneNormalized, "شماره نرمال‌شده کپی شد")} disabled={!phoneNormalized}>کپی شماره استاندارد</button></div>
          <div className="tool-card"><h3>آماده‌سازی توضیحات متا</h3><code>createMetaDescription</code><p>پیشنهاد توضیحات متا با پاک‌سازی فاصله‌ها و محدودیت پیش‌فرض ۱۶۰ کاراکتر.</p><div className="tool-value">{metaDescription || "متن مقاله را وارد کن..."}</div><div className="mini-meta"><span>{[...metaDescription].length} / ۱۶۰ کاراکتر</span><button className="tool-copy" onClick={() => copy(metaDescription, "توضیحات متا کپی شد")} disabled={!metaDescription}>کپی متا</button></div></div>
          <div className="tool-card"><h3>زمان تقریبی مطالعه</h3><code>getReadingTime</code><p>برآورد بر اساس تعداد واژه و سرعت پیش‌فرض ۲۰۰ واژه در دقیقه.</p><div className="reading-metrics"><div><strong>{reading.minutes.toLocaleString("fa-IR")}</strong><span>دقیقه</span></div><div><strong>{reading.words.toLocaleString("fa-IR")}</strong><span>واژه</span></div><div><strong>{reading.seconds.toLocaleString("fa-IR")}</strong><span>ثانیه</span></div></div></div>
          <div className="tool-card"><h3>تکرار واژه‌های کلیدی</h3><code>getKeywordStats</code><p>نمایش فراوانی ساده واژه‌ها برای بازبینی محتوای مقاله؛ نه تحلیل‌گر کامل سئو.</p>{keywords.length ? <div className="keyword-list">{keywords.map((item) => <div className="keyword-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count.toLocaleString("fa-IR")} بار</span><span>{item.density.toLocaleString("fa-IR")}%</span></div>)}</div> : <div className="tool-value">برای تحلیل، متن وارد کن.</div>}</div>
        </div>
      </section>}

      {copied && <div className="toast" role="status">{copied}</div>}
      <footer id="footer"><span>FarsiKit</span><span>🛡 رایگان برای همه متن‌باز</span><span>⚡ سریع و سبک</span><span>ساخته‌شده برای وب فارسی</span></footer>
    </main>
  );
}

function Tool({ title, code, description, value, onCopy }: { title: string; code: string; description: string; value: string; onCopy: () => void }) {
  return <div className="tool-card"><div className="tool-top"><h3>{title}</h3><code>{code}</code></div><p>{description}</p><div className="tool-value">{value || <span className="placeholder">—</span>}</div><button className="tool-copy" onClick={onCopy} disabled={!value}>کپی نتیجه</button></div>;
}
function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><span>{label}</span><strong>{value.toLocaleString("fa-IR")}</strong></div>;
}
