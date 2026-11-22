import { useMemo, useState } from "react";
import {
  addZwnj,
  inspectPersianText,
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
type ToolTab = "inspect" | "content" | "utilities";

export default function App() {
  const [input, setInput] = useState(sample);
  const [digits, setDigits] = useState<"persian" | "arabic" | "latin" | "none">("persian");
  const [removeDiacritics, setRemoveDiacritics] = useState(false);
  const [useZwnj, setUseZwnj] = useState(true);
  const [fixEzafe, setFixEzafe] = useState(true);
  const [activeTab, setActiveTab] = useState<ToolTab>("inspect");
  const [phone, setPhone] = useState("۰۹۱۲ ۳۴۵ ۶۷۸۹");
  const [toast, setToast] = useState("");

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

  const inspection = useMemo(() => inspectPersianText(input), [input]);
  const stats = useMemo(() => getTextStats(input), [input]);
  const slug = useMemo(() => slugifyPersian(input), [input]);
  const unicode = useMemo(() => normalizeUnicode(input), [input]);
  const withoutMarks = useMemo(() => stripArabicDiacritics(input), [input]);
  const phoneNormalized = normalizeIranianPhone(phone);
  const reading = getReadingTime(input);
  const metaDescription = createMetaDescription(input);
  const keywords = getKeywordStats(input, 8);

  const copy = async (value: string, label = "Copied to clipboard") => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setToast(label);
      window.setTimeout(() => setToast(""), 1800);
    } catch {
      setToast("Clipboard access is unavailable in this browser");
      window.setTimeout(() => setToast(""), 2200);
    }
  };

  const tabs: { id: ToolTab; label: string; detail: string }[] = [
    { id: "inspect", label: "Text inspector", detail: "Quality & cleanup" },
    { id: "content", label: "Content tools", detail: "SEO & locale" },
    { id: "utilities", label: "Utilities", detail: "Text helpers" }
  ];

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="FarsiKit home">
          <span className="brand-mark">F</span><span>farsikit</span><span className="brand-beta">OPEN SOURCE</span>
        </a>
        <div className="top-meta"><span className="status-dot" /> Runs locally in your browser <span className="version">v0.4.0</span></div>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-line" /> THE PERSIAN WEB TOOLKIT</div>
        <h1>Make Persian text<br /><em>work beautifully.</em></h1>
        <p>Clean, inspect and prepare Persian content with a focused set of developer-friendly tools.</p>
      </section>

      <section className="editor-grid" aria-label="Persian text normalization workspace">
        <article className="editor-card">
          <div className="card-head">
            <div><span className="overline">01 / INPUT</span><h2>Your text</h2></div>
            <button className="text-button" onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea dir="auto" maxLength={5000} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste or type Persian text…" />
          <div className="editor-foot"><span>Processed locally · Nothing is uploaded</span><span className="count">{input.length.toLocaleString("en-US")} <i>/ 5,000</i></span></div>
        </article>

        <article className="editor-card result-card">
          <div className="card-head">
            <div><span className="overline">02 / RESULT</span><h2>Normalized text</h2></div>
            <button className="primary-button small" onClick={() => copy(normalized, "Normalized text copied")} disabled={!normalized}>Copy result <span>↗</span></button>
          </div>
          <div className="options">
            <label>Digits
              <select value={digits} onChange={e => setDigits(e.target.value as typeof digits)}>
                <option value="persian">Persian ۱۲۳</option><option value="latin">Latin 123</option><option value="arabic">Arabic ١٢٣</option><option value="none">Keep as-is</option>
              </select>
            </label>
            <label className="check"><input type="checkbox" checked={useZwnj} onChange={e => setUseZwnj(e.target.checked)} /><span />Fix half-spaces</label>
            <label className="check"><input type="checkbox" checked={fixEzafe} onChange={e => setFixEzafe(e.target.checked)} /><span />Normalize ezafe</label>
            <label className="check"><input type="checkbox" checked={removeDiacritics} onChange={e => setRemoveDiacritics(e.target.checked)} /><span />Remove diacritics</label>
          </div>
          <div className="result-output" dir="auto">{normalized || <span className="muted">Your cleaned text will appear here…</span>}</div>
          <div className="editor-foot"><span>Arabic variants · spacing · punctuation · ZWNJ</span><span className="live-label"><span className="status-dot" /> LIVE</span></div>
        </article>
      </section>

      <section className="insights-strip">
        <div className="strip-title"><span className="overline">AT A GLANCE</span><strong>Text snapshot</strong></div>
        <Metric label="Words" value={stats.words} /><Metric label="Characters" value={stats.characters} /><Metric label="Persian letters" value={stats.persianLetters} /><Metric label="Issues found" value={inspection.issues.length} />
      </section>

      <section className="tools-area">
        <div className="tools-heading"><div><span className="overline">YOUR WORKSPACE</span><h2>More ways to work with text</h2></div><p>One focused workspace. The tools you need, when you need them.</p></div>
        <nav className="tool-tabs" aria-label="Tool categories">
          {tabs.map(tab => <button key={tab.id} className={activeTab === tab.id ? "tab active" : "tab"} onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id}><span>{tab.label}</span><small>{tab.detail}</small></button>)}
        </nav>

        {activeTab === "inspect" && <div className="tool-panel">
          <div className="panel-intro"><div><span className="overline">QUALITY CHECK</span><h3>Persian text inspector</h3></div><span className={inspection.issues.length ? "issue-count" : "clean-count"}>{inspection.issues.length} {inspection.issues.length === 1 ? "issue" : "issues"}</span></div>
          <p className="panel-description">Find common typography problems and review a suggested cleanup. This is a rule-based assistant, not a spell-checker.</p>
          <div className="inspection-grid">
            <div className="suggestion">
              <div className="mini-heading"><strong>Suggested correction</strong><button className="text-button" onClick={() => copy(inspection.correctedText, "Suggested correction copied")} disabled={!inspection.correctedText}>Copy</button></div>
              <div className="suggestion-text" dir="auto">{inspection.correctedText || <span className="muted">Enter text to see a suggested correction.</span>}</div>
            </div>
            <div className="issue-list">
              {inspection.issues.length ? inspection.issues.map(issue => <div className="issue-row" key={issue.code}><span className={issue.severity === "warning" ? "issue-icon warning" : "issue-icon"}>!</span><div><strong>{issueTitle(issue.code)}</strong><span>{issue.count} {issue.count === 1 ? "occurrence" : "occurrences"} · {issue.message}</span></div></div>) : <div className="empty-state"><span>✓</span><strong>No common issues found</strong><small>Your text passed the available typography checks.</small></div>}
            </div>
          </div>
        </div>}

        {activeTab === "content" && <div className="content-grid">
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">SEO</span><h3>Meta description</h3></div><code>160 chars</code></div>
            <p>A concise, normalized description for search snippets.</p>
            <div className="tool-result" dir="auto">{metaDescription || <span className="muted">Enter content to generate a description.</span>}</div>
            <div className="tool-card-foot"><span>{[...metaDescription].length} / 160 characters</span><button className="text-button" onClick={() => copy(metaDescription, "Meta description copied")} disabled={!metaDescription}>Copy</button></div>
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">READABILITY</span><h3>Reading time</h3></div><code>200 WPM</code></div>
            <p>Estimated reading time based on whitespace-separated words.</p>
            <div className="reading-result"><strong>{reading.minutes}</strong><span>min read</span><i>{reading.words.toLocaleString("en-US")} words</i></div>
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">KEYWORDS</span><h3>Keyword frequency</h3></div><code>TOP 8</code></div>
            <p>A lightweight frequency hint for reviewing your content.</p>
            {keywords.length ? <div className="keyword-list">{keywords.map(item => <div className="keyword-row" key={item.keyword}><strong>{item.keyword}</strong><span>{item.count}×</span><div className="keyword-bar"><i style={{width: item.density + "%"}} /></div><small>{item.density}%</small></div>)}</div> : <div className="empty-inline">Add some text to see keyword frequency.</div>}
          </div>
          <div className="tool-card">
            <div className="mini-heading"><div><span className="overline">IRAN LOCALE</span><h3>Mobile number validator</h3></div><code>IR +98</code></div>
            <p>Normalize common Iranian mobile formats.</p>
            <input className="phone-input" dir="auto" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +98 912 345 6789" />
            <div className="phone-result"><strong className={isValidIranianMobile(phone) ? "valid" : "invalid"}>{isValidIranianMobile(phone) ? "Valid mobile number" : "Not a valid mobile format"}</strong><button className="text-button" onClick={() => copy(phoneNormalized, "Phone number copied")} disabled={!phoneNormalized}>Copy normalized</button></div>
            {phoneNormalized && <div className="normalized-phone">{phoneNormalized}</div>}
          </div>
        </div>}

        {activeTab === "utilities" && <div className="utilities-grid">
          <Utility title="Persian URL slug" code="slugifyPersian" description="Readable URL slugs with Persian letters preserved." value={slug} onCopy={() => copy(slug, "Slug copied")} />
          <Utility title="Unicode normalization" code="normalizeUnicode" description="Normalize canonically equivalent Unicode sequences (NFC)." value={unicode} onCopy={() => copy(unicode, "Unicode text copied")} />
          <Utility title="Remove diacritics" code="stripArabicDiacritics" description="Remove Arabic marks while preserving base characters." value={withoutMarks} onCopy={() => copy(withoutMarks, "Text without diacritics copied")} />
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">SCRIPT DETECTION</span><h3>Persian / Arabic script</h3></div><code>containsPersian</code></div><p>Checks whether the text contains characters from the Arabic Unicode block.</p><div className={containsPersian(input) ? "detection-result detected" : "detection-result"}>{containsPersian(input) ? "Script detected" : "No matching script found"}</div></div>
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">TEXT STATISTICS</span><h3>Detailed counts</h3></div><code>getTextStats</code></div><div className="detail-stats"><Metric label="Lines" value={stats.lines}/><Metric label="No whitespace" value={stats.charactersWithoutWhitespace}/><Metric label="Arabic variants" value={stats.arabicVariants}/><Metric label="Half-spaces" value={stats.zwnj}/><Metric label="Diacritics" value={stats.diacritics}/></div></div>
          <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">DIGIT CONVERSION</span><h3>Convert numeral systems</h3></div><code>convertDigits</code></div><div className="digit-actions"><button onClick={() => copy(convertDigits(input, "persian"), "Persian digits copied")}>To Persian ۱۲۳</button><button onClick={() => copy(convertDigits(input, "latin"), "Latin digits copied")}>To Latin 123</button><button onClick={() => copy(convertDigits(input, "arabic"), "Arabic digits copied")}>To Arabic ١٢٣</button></div></div>
        </div>}
      </section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">F</span><span>farsikit</span></a><span>Open-source tools for the Persian web.</span><a href="https://github.com/MahsaKasraei/FarsiKit" target="_blank" rel="noreferrer">View on GitHub ↗</a></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function issueTitle(code: string): string {
  const titles: Record<string, string> = {
    "arabic-variants": "Arabic letter variants",
    "ezafe-hamza": "Ezafe hamza spelling",
    "mixed-digit-systems": "Mixed numeral systems",
    "extra-spaces": "Repeated spaces",
    "space-before-punctuation": "Space before punctuation",
    "missing-space-after-punctuation": "Missing space after punctuation"
  };
  return titles[code] ?? code;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="metric"><span>{label}</span><strong>{value.toLocaleString("en-US")}</strong></div>;
}

function Utility({ title, code, description, value, onCopy }: { title: string; code: string; description: string; value: string; onCopy: () => void }) {
  return <div className="tool-card utility-card"><div className="mini-heading"><div><span className="overline">TEXT UTILITY</span><h3>{title}</h3></div><code>{code}</code></div><p>{description}</p><div className="tool-result" dir="auto">{value || <span className="muted">—</span>}</div><div className="tool-card-foot"><span>Live preview</span><button className="text-button" onClick={onCopy} disabled={!value}>Copy</button></div></div>;
}
