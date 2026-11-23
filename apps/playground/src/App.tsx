import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChevronDown, faCircleQuestion, faMoon, faArrowUpRightFromSquare, faBolt, faGear, faPenToSquare, faTrashCan, faFileLines, faCircleCheck, faCopy, faDownload, faCode, faCheck, faChartColumn, faMagnifyingGlass, faPhone, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
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
  const [input, setInput] = useState("");
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
        <div className="top-actions"><span className="version"><i /> نسخه ۰.۴.۹</span><button className="round-action" aria-label="تغییر پوسته"><FontAwesomeIcon icon={faMoon} /></button><a className="github-link" href="https://github.com/MahsaKasraei/FarsiKit" target="_blank" rel="noreferrer" aria-label="گیت‌هاب"><FontAwesomeIcon icon={faGithub} /></a></div>
        <nav className="main-nav"><a href="#tools"><FontAwesomeIcon icon={faHouse} /> ابزارها</a><a href="#about">درباره ما <FontAwesomeIcon icon={faChevronDown} /></a><a href="#help">راهنما <FontAwesomeIcon icon={faCircleQuestion} /></a></nav>
        <a className="brand" href="#" aria-label="FarsiKit home"><span>FarsiKit</span><span className="brand-mark">ف</span></a>
      </header>

      <section className="hero">
        <div className="hero-art"><img src="/farsikit-hero-hq.jpg" alt="لپ‌تاپ با حرف ف فارسی، گلدان و ابزارهای تایپوگرافی" /></div>
        <div className="hero-copy"><div className="hero-brand">FarsiKit</div><h1>جعبه‌ابزار حرفه‌ای پردازش متن فارسی</h1><p>اصلاح متن، نیم‌فاصله، تبدیل اعداد، و ابزارهای کاربردی دیگر<br/>همه در یک محیط زیبا و قدرتمند!</p><div className="hero-actions"><a href="#workspace" className="primary-cta">شروع کنید <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a><a href="#tools" className="secondary-cta">مشاهده همه ابزارها <FontAwesomeIcon icon={faArrowRight} /></a></div></div>
      </section>

      <section className="workspace" id="workspace">
        <aside className="quick-settings">
          <h2>تنظیمات سریع <span><FontAwesomeIcon icon={faBolt} /></span></h2>
          <label><span>نیم‌فاصله</span><input type="checkbox" checked={useZwnj} onChange={e=>setUseZwnj(e.target.checked)} /></label>
          <label><span>اصلاح حروف عربی</span><input type="checkbox" checked={removeDiacritics} onChange={e=>setRemoveDiacritics(e.target.checked)} /></label>
          <label><span>تبدیل ارقام</span><input type="checkbox" checked={digits==="persian"} onChange={e=>setDigits(e.target.checked?"persian":"latin")} /></label>
          <label><span>حذف اعراب</span><input type="checkbox" checked={removeDiacritics} onChange={e=>setRemoveDiacritics(e.target.checked)} /></label>
          <label><span>اصلاح همزه</span><input type="checkbox" checked={fixEzafe} onChange={e=>setFixEzafe(e.target.checked)} /></label>
          <button className="more-settings" onClick={()=>setActivePanel(activePanel==="quick"?null:"quick")}>تنظیمات بیشتر　<FontAwesomeIcon icon={faGear} /></button>
        </aside>
        <div className="editor-shell">
          <div className="editor-toolbar"><h2><FontAwesomeIcon icon={faPenToSquare} /> ویرایشگر فارسی</h2><div><button className="subtle" onClick={()=>setInput("")}><FontAwesomeIcon icon={faTrashCan} /> پاک کردن</button><button className="subtle" onClick={()=>{setInput(sample);setCopied("متن نمونه در ویرایشگر قرار گرفت")}}><FontAwesomeIcon icon={faFileLines} /> نمونه متن</button></div></div>
          <div className="editor-panels">
            <div className="panel output-panel">
              <div className="output-status">خروجی اصلاح‌شده　<FontAwesomeIcon icon={faCircleCheck} /></div>
              <div className="output" dir="rtl">{normalized || <span className="placeholder">متن شما اینجا نمایش داده می‌شود</span>}</div>
              <div className="panel-footer"><button className="copy" onClick={()=>copy(normalized,"خروجی کپی شد")}><><FontAwesomeIcon icon={faCopy} /> کپی خروجی</></button><button className="download-output" onClick={()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([normalized],{type:"text/plain;charset=utf-8"}));a.download="farsikit-output.txt";a.click();URL.revokeObjectURL(a.href)}}><><FontAwesomeIcon icon={faDownload} /> دانلود</></button></div>
            </div>
            <div className="panel input-panel">
              <textarea maxLength={5000} value={input} onChange={e=>setInput(e.target.value)} placeholder="اینجا متن فارسی خود را وارد کنید؛ مثلاً: این یک متن نمونه برای بررسی نیم‌فاصله و اصلاح حروف فارسی است..." />
              <div className="panel-footer"><span>{input.length.toLocaleString("fa-IR")} کاراکتر</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="extras" id="tools">
        <div className="extras-heading"><div><h2>ابزارهای تخصصی</h2><p>ابزارهای کاربردی برای کاربران حرفه‌ای‌تر</p></div><button className="all-tools" onClick={()=>setActivePanel("quick")}>مشاهده همه <FontAwesomeIcon icon={faArrowLeft} /></button></div>
        <div className="tool-shortcuts">
          <button className="shortcut dev" onClick={()=>setActivePanel("quick")}><b><FontAwesomeIcon icon={faCode} /></b><strong>ابزارهای توسعه</strong><small>ابزارهای مفید برنامه‌نویسان</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
          <button className="shortcut quality" onClick={()=>setActivePanel("review")}><b><FontAwesomeIcon icon={faCheck} /></b><strong>بازرس کیفیت متن</strong><small>بررسی و رفع خطاها</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
          <button className="shortcut analytics" onClick={()=>setActivePanel("stats")}><b><FontAwesomeIcon icon={faChartColumn} /></b><strong>تحلیل و آمار متن</strong><small>بررسی و نمایش آمار</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
          <button className="shortcut seo" onClick={()=>setActivePanel("content")}><b><FontAwesomeIcon icon={faMagnifyingGlass} /></b><strong>ابزارهای سئو</strong><small>بهینه‌سازی محتوای وب</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
          <button className="shortcut phone" onClick={()=>setActivePanel("content")}><b><FontAwesomeIcon icon={faPhone} /></b><strong>ابزار شماره موبایل</strong><small>استانداردسازی شماره‌ها</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
          <button className="shortcut slug" onClick={()=>setActivePanel("quick")}><b><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></b><strong>ساخت اسلاگ</strong><small>تبدیل متن به اسلاگ استاندارد</small><span className="shortcut-arrow"><FontAwesomeIcon icon={faArrowLeft} /></span></button>
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
          ))}</div> : <div className="clean-report">متن از نظر قواعدی که بررسی می‌کنیم، موردی برای گزارش ندارد. <FontAwesomeIcon icon={faCircleCheck} /></div>}
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
            <button className="tool-copy" onClick={() => copy(phoneNormalized, "شماره نرمال‌شده کپی شد")} disabled={!phoneNormalized}><><FontAwesomeIcon icon={faCopy} /> کپی شماره استاندارد</></button>
          </div>
          <div className="tool-card">
            <div className="tool-top"><h3>آماده‌سازی توضیحات متا</h3><code>createMetaDescription</code></div>
            <p>پیشنهاد توضیحات متا با پاک‌سازی فاصله‌ها و محدودیت پیش‌فرض ۱۶۰ کاراکتر.</p>
            <div className="tool-value" dir="rtl">{metaDescription || <span className="placeholder">متن مقاله را وارد کن...</span>}</div>
            <div className="mini-meta"><span>{[...metaDescription].length} / ۱۶۰ کاراکتر</span><button className="tool-copy" onClick={() => copy(metaDescription, "توضیحات متا کپی شد")} disabled={!metaDescription}><><FontAwesomeIcon icon={faCopy} /> کپی متا</></button></div>
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

      <footer id="about"><span>FarsiKit</span><span>رایگان برای همه متن‌باز با مجوز MIT　│　سریع و سبک <FontAwesomeIcon icon={faBolt} /></span></footer>
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
    <button className="tool-copy" onClick={onCopy} disabled={!value}><><FontAwesomeIcon icon={faCopy} /> کپی نتیجه</></button>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="stat"><span>{label}</span><strong>{value.toLocaleString("fa-IR")}</strong></div>;
}
