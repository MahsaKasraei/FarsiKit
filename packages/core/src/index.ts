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
