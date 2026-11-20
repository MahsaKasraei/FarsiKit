export type DigitSystem = "persian" | "arabic" | "latin";

export interface NormalizeOptions {
  convertDigits?: DigitSystem | "none";
  normalizeWhitespace?: boolean;
  fixPunctuation?: boolean;
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const LATIN_DIGITS = "0123456789";

const digitMaps: Record<DigitSystem, string> = {
  persian: PERSIAN_DIGITS,
  arabic: ARABIC_DIGITS,
  latin: LATIN_DIGITS
};

export function convertDigits(text: string, target: DigitSustem): string {
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

export function normalizePersian(
  text: string,
  options: NormalizeOptions = {}
): string {
  const {
    convertDigits: digitTarget = "none",
    normalizeWhitespace = true,
    fixPunctuation = true
  } = options;

  let result = text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u0640/g, "");

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
 * Adds ZWNJ in a deliberately small set of common Persian constructions.
 * This heuristic is not a complete Persian morphology or spell-check engine.
 */
export function addZwnj(text: string): string {
  return text
    .replace(/\bمی\s+(?=[\u0600-\u06FF])/g, "می‌")
    .replace(/\bنمی\s+(?=[\u0600-\u06FF])/g, "نمی‌")
    .replace(/ها\s+(?=[\u0600-\u06FF])/g, "ها‌")
    .replace(/های\s+(?=[\u0600-\u06FF])/g, "های‌")
    .replace(/تر\s+(?=[\u0600-\u06FF])/g, "تر‌")
    .replace(/ترین\s+(?=[\u0600-\u06FF])/g, "ترین‌");
}

export interface TextStats {
  characters: number;
  charactersWithoutWhitespace: number;
  words: number;
  lines: number;
  persianLetters: number;
  arabicVariants: number;
  zwnj: number;
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
    zwnj: (text.match(/\u200c/g) ?? []).length
  };
}
