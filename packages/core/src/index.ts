export type DigitSystem = "persian" | "arabic" | "latin";

export interface NormalizeOptions {
  convertDigits?: DigitSystem | "none";
  normalizeWhitespace?: boolean;
  fixPunctuation?: boolean;
  removeDiacritics?: boolean;
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const LATIN_DIGITS = "0123456789";

const digitMaps: Record<DigitSystem, string> = {
  persian: PERSIAN_DIGITS,
  arabic: ARABIC_DIGITS,
  latin: LATIN_DIGITS
};

/** Convert Persian, Arabic-Indic, and Latin digits to the requested system. */
export function convertDigits(text: string, target: DigitSystem): string {
  const output = digitMaps[target];
  return text.replace(/[0-9۰-۹٠-٩]/g, (digit) => {
    const index = LATIN_DIGITS.indexOf(digit) >= 0
      ? LATIN_DIGITS.indexOf(digit)
      : PERSIAN_DIGITS.indexOf(digit) >= 0
        ? PERSIAN_DIGITS.indexOf(digit)
        : ARABIC_DIGITS.indexOf(digit);
    return output[index] ?? digit;
  });
}

/** Normalize canonically equivalent Unicode sequences using NFC. */
export function normalizeUnicode(text: string): string {
  return text.normalize("NFC");
}

/** Remove Arabic combining marks (harakat) without changing base letters. */
export function stripArabicDiacritics(text: string): string {
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

/**
 * Normalize common Persian character variants and typography.
 * This is a practical text cleanup helper, not a spell-checker.
 */
export function normalizePersian(
  text: string,
  options: NormalizeOptions = {}
): string {
  const {
    convertDigits: digitTarget = "none",
    normalizeWhitespace = true,
    fixPunctuation = true,
    removeDiacritics = false
  } = options;

  let result = normalizeUnicode(text)
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u0640/g, "");

  if (removeDiacritics) {
    result = stripArabicDiacritics(result);
  }

  if (normalizeWhitespace) {
    result = result
      .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .trim();
  }

  if (fixPunctuation) {
    result = result
      .replace(/\s+([،؛؟.!:])/g, "$1")
      .replace(/([،؛؟.!:])(?=\S)/g, "$1 ");
  }

  if (digitTarget !== "none") {
    result = convertDigits(result, digitTarget);
  }

  return result;
}

/**
 * Applies conservative ZWNJ rules for common Persian prefixes and suffixes.
 * This heuristic is intentionally limited and is not a morphology engine.
 */
export function addZwnj(text: string): string {
  return text
    .replace(/(^|\s)(نمی|می)\s+(?=[\u0600-\u06FF])/gu, "$1$2‌")
    .replace(/([\u0600-\u06FF]+)\s+(ها|های|تر|ترین)(?=\s|$|[،؛؟.!:])/gu, "$1‌$2");
}

/** Return true when text contains at least one character in the Persian block. */
export function containsPersian(text: string): boolean {
  return /[\u0600-\u06FF]/u.test(text);
}

/**
 * Create a URL-friendly slug while preserving Persian and Latin letters.
 * Diacritics and punctuation are removed; whitespace and underscores become hyphens.
 */
export function slugifyPersian(text: string): string {
  return normalizePersian(stripArabicDiacritics(text), {
    convertDigits: "latin",
    normalizeWhitespace: true,
    fixPunctuation: false
  })
    .toLocaleLowerCase()
    .replace(/[\s_]+/gu, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface TextStats {
  characters: number;
  charactersWithoutWhitespace: number;
  words: number;
  lines: number;
  persianLetters: number;
  arabicVariants: number;
  zwnj: number;
  diacritics: number;
}

export function getTextStats(text: string): TextStats {
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  return {
    characters: [...text].length,
    charactersWithoutWhitespace: [...text].filter((char) => !/\s/u.test(char)).length,
    words,
    lines: text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length,
    persianLetters: (text.match(/[آ-ی]/g) ?? []).length,
    arabicVariants: (text.match(/[يىك]/g) ?? []).length,
    zwnj: (text.match(/\u200c/g) ?? []).length,
    diacritics: (text.match(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g) ?? []).length
  };
}


/** Normalize common Iranian mobile formats to 09xxxxxxxxx. Returns an empty string for unsupported input. */
export function normalizeIranianPhone(input: string): string {
  let digits = convertDigits(input, "latin").replace(/[^0-9]/g, "");
  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^9\\d{9}$/.test(digits) ? `0${digits}` : "";
}

/** Validate an Iranian mobile number in common local or international formats. */
export function isValidIranianMobile(input: string): boolean {
  return normalizeIranianPhone(input).length === 11;
}

export interface ReadingTime {
  words: number;
  seconds: number;
  minutes: number;
}

/** Estimate reading time from whitespace-separated words (default: 200 words/minute). */
export function getReadingTime(text: string, wordsPerMinute = 200): ReadingTime {
  const words = text.trim() ? text.trim().split(/\\s+/u).length : 0;
  const safeRate = Number.isFinite(wordsPerMinute) && wordsPerMinute > 0 ? wordsPerMinute : 200;
  const seconds = words === 0 ? 0 : Math.ceil((words / safeRate) * 60);
  return { words, seconds, minutes: seconds === 0 ? 0 : Math.ceil(seconds / 60) };
}

/** Create a plain-text meta description, truncated on a word boundary. */
export function createMetaDescription(text: string, maxLength = 160): string {
  const limit = Number.isFinite(maxLength) ? Math.max(0, Math.floor(maxLength)) : 160;
  if (limit === 0) return "";
  const clean = normalizePersian(text).replace(/\\s+/gu, " ").trim();
  const chars = [...clean];
  if (chars.length <= limit) return clean;
  if (limit <= 1) return "…";
  const candidate = chars.slice(0, limit - 1).join("");
  const boundary = candidate.lastIndexOf(" ");
  const shortened = boundary > Math.floor(limit * 0.55) ? candidate.slice(0, boundary) : candidate;
  return `${shortened.trimEnd()}…`;
}

export interface KeywordStat {
  keyword: string;
  count: number;
  density: number;
}

/** Simple token frequency analysis; this is a content hint, not a linguistic SEO analyzer. */
export function getKeywordStats(text: string, limit = 10): KeywordStat[] {
  const stopWords = new Set(["و", "در", "به", "از", "که", "را", "با", "برای", "این", "آن", "یک", "the", "and", "for", "with", "this", "that"]);
  const tokens = normalizePersian(text).toLocaleLowerCase().match(/[\\p{L}\\p{N}]+/gu) ?? [];
  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (token.length < 2 || stopWords.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 10;
  return [...counts.entries()]
    .map(([keyword, count]) => ({ keyword, count, density: tokens.length === 0 ? 0 : Number(((count / tokens.length) * 100).toFixed(1)) }))
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, "fa"))
    .slice(0, safeLimit);
}
