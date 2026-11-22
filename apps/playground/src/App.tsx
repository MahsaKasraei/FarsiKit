import { useMemo, useState } from "react";
import {
  addZwnj,
  inspectPersianText,
  containsPersian,
  createMetaDescription,
  convertنوع ارقام,
  getKeywordStats,
  getReadingTime,
  isValidIranianMobile,
  normalizeIranianPhone,
  getTextStats,
  normalizePersian,
  normalizeUnicode,
  slugifyPersian,
  stripArabicاعراب
} from "@farsikit/core";

const sample = "اين يك متن فارسی برای آزمايش حروف عربي است؛ علي در اين كتاب دربارهٔ زندگي، مسئوليت‌ های مهم و خانهٔ زيبايش می‌نويسد. شماره 123 را هم ببينيد.";
type ToolTab = "inspect" | "content" | "utilities";

export default function App() {
  const [input, setInput] = useState(sample);
  const [digits, setنوع ارقام] = useState<"persian" | "arabic" | "latin" | "none">("persian");
  const [removeاعراب, setRemoveاعراب] = useState(false);
  const [useZwnj, setUseZwnj] = useState(true);
  const [fixEzafe, setFixEzafe] = useState(true);
  const [activeTab, setActiveTab] = useState<ToolTab>("inspect");
  const [phone, setPhone] = useState("۰۹۱۲ ۳۴۵ ۶۷۸۹");
  const [toast, setToast] = useState("");

  const normalized = useMemo(() => {
    const value = normalizePersian(input, {
      convertنوع ارقام: digits,
      removeاعراب,
      normalizeEzafe: fixEzafe,
      normalizeWhitespace: true,
      fixPunctuation: true
    });
    return useZwnj ? addZwnj(value) : value;
  }, [input, digits, removeاعراب, fixEzafe, useZwnj]);

  const inspection = useMemo(() => inspectPersianText(input), [input]);
  const stats = useMemo(() => getTextStats(input), [input]);
  const slug = useMemo(() => slugifyPersian(input), [input]);
  const unicode = useMemo(() => normalizeUnicode(input), [input]);
  const withoutMarks = useMemo(() => stripArabicاعراب(input), [input]);
  const phoneNormalized = normalizeIranianPhone(phone);
  const reading = getReadingTime(input);
  const metaDescription = createMetaDescription(input);
  const keyواژه = getKeywordStats(input, 8);

  const copy = async (value: string, label = "در کلیپ‌بورد کپی شد") => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setToast(label);
      window.setTimeout(() => setToast(""), 1800);
    } catch {
      setToast("دسترسی به کلیپ‌بورد در این مرورگر ممکن نیست");
      window.setTimeout(() => setToast(""), 2200);
    }
  };

  const tabs: { id: ToolTab; label: string; detail: string }[] = [
    { id: "inspect", label: "بررسی متن", detail: "کیفیت و اصلاح" },
    { id: "content", label: "ابزارهای محتوا", detail: "سئو و بومی‌سازی" },
    { id: "utilities", label: "ابزارهای کاربردی", detail: "ابزارهای متن" }
  ];

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="FarsiKit home">
          <span className="brand-mark">F</span><span>farsikit</span><span className="brand-beta">متن‌باز</span>
        </a>
        <div className="top-meta"><span className="status-dot" /> پردازش مستقیم در مرورگر شما <span className="version">v0.4.0</span></div>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> جعبه‌ابزار متن فارسی</div>
        <h1>متن فارسی را<br /><em>درست و زیبا بنویسید.</em></h1>
        <p>متن فارسی را پاک‌سازی، بررسی و برای انتشار آماده کنید؛ با ابزارهایی دقیق و کاربردی.</p>
      </section>

      <section className="editor-grid" aria-label="فضای یکدست‌سازی متن فارسی">
        <article className="editor-card">
          <div className="card-head">
            <div><span className="overline">۰۱ / متن ورودی</span><h2>متن شما</h2></div>
            <button className="text-button" onClick={() => setInput("")}>پاک کردن</button>
          </div>
          <textarea dir="auto" maxLength={5000} value={input} onChange={e => setInput(e.target.value)} placeholder="متن فارسی را اینجا وارد یا جای‌گذاری کنید…" />
          <div className="editor-foot"><span>پردازش در همین مرورگر انجام می‌شود؛ متنی بارگذاری نمی‌شود</span><span className="count">{input.length.toLocaleString("fa-IR")} <i>/ 5,000</i></span></div>
        </article>

        <article className="editor-card result-card">
          <div className="card-head">
            <div><span className="overline">۰۲ / نتیجه</span><h2>متن یکدست‌شده</h2></div>
            <button className="primary-button small" onClick={() => copy(normalized, "متن یکدست‌شده copied")} disabled={!normalized}>کپی نتیجه <span>↗</span></button>
          </div>
          <div className="options">
            <label>نوع ارقام
              <select value={digits} onChange={e => setنوع ارقام(e.target.value as typeof digits)}>
                <option value="persian">فارسی ۱۲۳</option><option value="latin">لاتین 123</option><option value="arabic">عربی ١٢٣</option><option value="none">بدون تغییر</option>
              </select>
            </label>
            <label className="check"><input type="checkbox" checked={useZwnj} onChange={e => setUseZwnj(e.target.checked)} /><span />اصلاح نیم‌فاصله</label>
            <label className="check"><input type="checkbox" checked={fixEzafe} onChange={e => setFixEzafe(e.target.checked)} /><span />اصلاح اضافه</label>
            <label className="check"><input type="checkbox" checked={removeاعراب} onChange={e => setRemoveاعراب(e.target.checked)} /><span />حذف اعراب</label>
          </div>
          <div className="result-output" dir="auto">{normalized || <span className="muted">متن اصلاح‌شده اینجا نمایش داده می‌شود…</span>}</div>
          <div className="editor-foot"><span>حروف عربی و فارسی · فاصله‌گذاری · نشانه‌گذاری · نیم‌فاصله</span><span className="live-label"><span className="status-dot" /> زنده</span></div>
        </article>
      </section>

      <section className="insights-strip">
        <div className="strip-title"><span className="overline">نمای کلی</span><strong>آمار متن</strong></div>
        <Metric label="واژه" value={stats.واژه} /><Metric label="نویسه" value={stats.نویسه} /><Metric label="حروف فارسی" value={stats.persianLetters} /><Metric label="ایراد شناسایی‌شده" value={inspection.ایرادs.length} />
      </section>

      <section className="tools-area">
        <div className="tools-heading"><div><span className="overline">ابزارهای شما</span><h2>ابزارهای بیشتر برای کار با متن</h2></div><p>همه ابزارهای موردنیاز، در یک فضای کاری ساده و منظم.</p></div>
        <nav className="tool-tabs" aria-label="دسته‌بندی ابزارها">
          {tabs.map(tab => <button key={tab.id} className={activeTab === tab.id ? "tab active" : "tab"} onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id}><span>{tab.label}</span><small>{tab.detail}</small></button>)}
        </nav>

        {activeTab === "inspect" && <div className="tool-panel">
          <div className="panel-intro"><div><span className="overline">بررسی کیفیت</span><h3>بازرس متن فارسی</h3></div><span className={inspection.ایرادs.length ? "ایراد-count" : "clean-count"}>{inspection.ایرادs.length} {inspection.ایرادs.length === 1 ? "ایراد" : "ایرادs"}</span></div>
          <p className="panel-description">ایرادهای رایج نگارشی و تایپی را پیدا کنید و پیشنهاد اصلاح را ببینید. این ابزار بر پایه قواعد نگارشی است و غلط‌یاب املایی نیست.</p>
          <div className="inspection-grid">
            <div className="suggestion">
              <div className="mini-heading"><strong>متن پیشنهادی اصلاح‌شده</strong><button className="text-button" onClick={() => copy(inspection.correctedText, "متن پیشنهادی اصلاح‌شده copied")} disabled={!inspection.correctedText}>Copy</button></div>
              <div className="suggestion-text" dir="auto">{inspection.correctedText || <span className="muted">برای مشاهده پیشنهاد اصلاح، متنی وارد کنید.</span>}</div>
            </div>
            <div className="ایراد-list">
              {inspection.ایرادs.length ? inspection.ایرادs.map(ایراد => <div className="ایراد-row" key={ایراد.code}><span className={ایراد.severity === "warning" ? "ایراد-icon warning" : "ایراد-icon"}>!</span><div><strong>{ایرادTitle(ایراد.code)}</strong><span>{ایراد.count} {ایراد.count === 1 ? "مورد" : "موردs"} · {ایراد.message}</span></div></div>) : <div className="empty-state"><span>✓</span><strong>No common ایرادs found</strong><small>متن شما passed the available typography checks.</small></div>}
            </div>
          </div>
        </div>}

        {activeTab === "content" && <div className="content-grid">
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">SEO</span><h3>توضیحات متا</h3></div><code>۱۶۰ نویسه</code></div>
            <p>پیشنهاد توضیحات کوتاه و یکدست برای نمایش در نتایج جست‌وجو.</p>
            <div className="tool-result" dir="auto">{metaDescription || <span className="muted">برای ساخت توضیحات، متن وارد کنید.</span>}</div>
            <div className="tool-card-foot"><span>{[...metaDescription].length} / 160 نویسه</span><button className="text-button" onClick={() => copy(metaDescription, "توضیحات متا copied")} disabled={!metaDescription}>Copy</button></div>
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">خوانایی</span><h3>زمان مطالعه</h3></div><code>۲۰۰ واژه در دقیقه</code></div>
            <p>زمان تقریبی مطالعه بر اساس تعداد واژه‌ها.</p>
            <div className="reading-result"><strong>{reading.minutes}</strong><span>دقیقه مطالعه</span><i>{reading.واژه.toLocaleString("en-US")} واژه</i></div>
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">کلیدواژه‌ها</span><h3>تکرار کلیدواژه</h3></div><code>۸ مورد برتر</code></div>
            <p>نمایی سریع از فراوانی واژه‌ها در متن.</p>
            {keyواژه.length ? <div className="keyword-list">{keyواژه.map(item => <div className="keyword-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count}×</span><div className="keyword-bar"><i style={{width: item.density + "%"}} /></div><small>{item.density}%</small></div>)}</div> : <div className="empty-inline">برای مشاهده کلیدواژه‌ها متنی وارد کنید.</div>}
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">استاندارد ایران</span><h3>اعتبارسنجی شماره موبایل</h3></div><code>IR +98</code></div>
            <p>بررسی و یکدست‌سازی قالب‌های رایج شماره موبایل ایران.</p>
            <input className="phone-input" dir="auto" value={phone} onChange={e => setPhone(e.target.value)} placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹ یا ‎+98 912 345 6789" />
            <div className="phone-result"><strong className={isValidIranianMobile(phone) ? "valid" : "invalid"}>{isValidIranianMobile(phone) ? "شماره موبایل معتبر است" : "قالب شماره موبایل معتبر نیست"}</strong><button className="text-button" onClick={() => copy(phoneNormalized, "شماره موبایل کپی شد")} disabled={!phoneNormalized}>کپی شماره یکدست‌شده</button></div>
            {phoneNormalized && <div className="normalized-phone">{phoneNormalized}</div>}
          </div>
        </div>}

        {activeTab === "utilities" && <div className="utilities-grid">
          <Utility title="اسلاگ فارسی نشانی" code="slugifyPersian" description="Readable URL slugs with حروف فارسی preserved." value={slug} onCopy={() => copy(slug, "اسلاگ کپی شد")} />
          <Utility title="یکدست‌سازی یونیکد" code="normalizeUnicode" description="یکدست‌سازی نمایش‌های معادل نویسه‌ها بر اساس استاندارد NFC." value={unicode} onCopy={() => copy(unicode, "متن یونیکد کپی شد")} />
          <Utility title="حذف اعراب" code="stripArabicاعراب" description="Remove Arabic marks while preserving base نویسه." value={withoutMarks} onCopy={() => copy(withoutMarks, "متن بدون اعراب کپی شد")} />
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">تشخیص خط</span><h3>خط فارسی و عربی</h3></div><code>containsPersian</code></div><p>Checks whether the text contains نویسه from the Arabic Unicode block.</p><div className={containsPersian(input) ? "detection-result detected" : "detection-result"}>{containsPersian(input) ? "نویسه فارسی یا عربی شناسایی شد" : "نویسه فارسی یا عربی پیدا نشد"}</div></div>
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">آمار متن</span><h3>جزئیات آمار</h3></div><code>getTextStats</code></div><div className="detail-stats"><Metric label="خط" value={stats.lines}/><Metric label="بدون فاصله" value={stats.نویسهWithoutWhitespace}/><Metric label="حروف عربی" value={stats.arabicVariants}/><Metric label="نیم‌فاصله" value={stats.zwnj}/><Metric label="اعراب" value={stats.diacritics}/></div></div>
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">تبدیل ارقام</span><h3>تبدیل نوع ارقام</h3></div><code>convertنوع ارقام</code></div><div className="digit-actions"><button onClick={() => copy(convertنوع ارقام(input, "persian"), "ارقام فارسی کپی شد")}>To فارسی ۱۲۳</button><button onClick={() => copy(convertنوع ارقام(input, "latin"), "ارقام لاتین کپی شد")}>To لاتین 123</button><button onClick={() => copy(convertنوع ارقام(input, "arabic"), "ارقام عربی کپی شد")}>To عربی ١٢٣</button></div></div>
        </div>}
      </section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">F</span><span>farsikit</span></a><span>ابزارهای متن‌باز برای وب فارسی.</span><a href="https://github.com/MahsaKasraei/FarsiKit" target="_blank" rel="noreferrer">مشاهده در گیت‌هاب ↗</a></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function ایرادTitle(code: string): string {
  const titles: Record<string, string> = {
    "arabic-variants": "تفاوت حروف عربی و فارسی",
    "ezafe-hamza": "شیوه نگارش همزه اضافه",
    "mixed-digit-systems": "ترکیب چند نوع رقم",
    "extra-spaces": "فاصله‌های تکراری",
    "space-before-punctuation": "فاصله پیش از نشانه نگارشی",
    "missing-space-after-punctuation": "نبود فاصله پس از نشانه نگارشی"
  };
  return titles[code] ?? code;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="metric"><span>{label}</span><strong>{value.toLocaleString("en-US")}</strong></div>;
}

function Utility({ title, code, description, value, onCopy }: { title: string; code: string; description: string; value: string; onCopy: () => void }) {
  return <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">ابزار متن</span><h3>{title}</h3></div><code>{code}</code></div><p>{description}</p><div className="tool-result" dir="auto">{value || <span className="muted">—</span>}</div><div className="tool-card-foot"><span>پیش‌نمایش زنده</span><button className="text-button" onClick={onCopy} disabled={!value}>Copy</button></div></div>;
}
