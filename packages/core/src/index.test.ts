import { describe, expect, it } from "vitest";
import {
  addZwnj,
  analyzePersianText,
  containsPersian,
  convertDigits,
  getTextStats,
  normalizePersian,
  normalizeEzafe,
  normalizeUnicode,
  slugifyPersian,
  stripArabicDiacritics
} from "./index.js";

describe("convertDigits", () => {
  it("converts Latin and Arabic digits to Persian", () => {
    expect(convertDigits("A12 ٣٤", "persian")).toBe("A۱۲ ۳۴");
  });

  it("converts Persian digits to Latin", () => {
    expect(convertDigits("۱۲۳", "latin")).toBe("123");
  });

  it("converts across all three digit systems", () => {
    expect(convertDigits("۱۲٣۰", "arabic")).toBe("١٢٣٠");
  });

  it("leaves non-digit characters untouched", () => {
    expect(convertDigits("نسخه v1.2", "persian")).toBe("نسخه v۱.۲");
  });
});

describe("normalizeUnicode", () => {
  it("normalizes canonically equivalent Unicode sequences", () => {
    expect(normalizeUnicode("e\u0301")).toBe("é");
  });
});

describe("stripArabicDiacritics", () => {
  it("removes harakat and preserves base letters", () => {
    expect(stripArabicDiacritics("عَرَبِيّ")).toBe("عربي");
  });

  it("does not remove ordinary Persian letters", () => {
    expect(stripArabicDiacritics("فارسی")).toBe("فارسی");
  });
});

describe("normalizePersian", () => {
  it("normalizes Arabic Yeh and Kaf", () => {
    expect(normalizePersian("كتاب علي")).toBe("کتاب علی");
  });

  it("cleans whitespace and punctuation", () => {
    expect(normalizePersian("سلام  ، دنیا  ؟")).toBe("سلام، دنیا؟");
  });

  it("can convert digits", () => {
    expect(normalizePersian("شماره 123", { convertDigits: "persian" })).toBe("شماره ۱۲۳");
  });

  it("can remove diacritics when explicitly requested", () => {
    expect(normalizePersian("عَلِی", { removeDiacritics: true })).toBe("علی");
  });

  it("can preserve whitespace and punctuation when requested", () => {
    expect(normalizePersian("سلام  ،دنیا", {
      normalizeWhitespace: false,
      fixPunctuation: false
    })).toBe("سلام  ،دنیا");
  });

  it("normalizes Unicode before Persian substitutions", () => {
    expect(normalizePersian("ﻻ")).toBe("ﻻ");
  });
});

describe("addZwnj", () => {
  it("adds ZWNJ to common prefixes", () => {
    expect(addZwnj("می رود و نمی شود")).toBe("می‌رود و نمی‌شود");
  });

  it("joins common suffixes to the preceding word", () => {
    expect(addZwnj("کتاب ها و خانه های بزرگ")).toBe("کتاب‌ها و خانه‌های بزرگ");
  });

  it("does not alter unrelated spaces", () => {
    expect(addZwnj("خانه بزرگ")).toBe("خانه بزرگ");
  });
});

describe("containsPersian", () => {
  it("detects Persian/Arabic-script text", () => {
    expect(containsPersian("Hello فارسی")).toBe(true);
  });

  it("returns false for Latin-only text and empty input", () => {
    expect(containsPersian("Hello 123")).toBe(false);
    expect(containsPersian("")).toBe(false);
  });
});

describe("slugifyPersian", () => {
  it("creates readable Persian slugs", () => {
    expect(slugifyPersian("راهنمای توسعه وب فارسی")).toBe("راهنمای-توسعه-وب-فارسی");
  });

  it("normalizes Arabic variants and converts digits to Latin", () => {
    expect(slugifyPersian("كتاب ۱۲۳")).toBe("کتاب-123");
  });

  it("removes punctuation and repeated separators", () => {
    expect(slugifyPersian("  سلام___دنیا!!!  ")).toBe("سلام-دنیا");
  });

  it("returns an empty string for punctuation-only input", () => {
    expect(slugifyPersian("!!! ...")).toBe("");
  });
});

describe("getTextStats", () => {
  it("returns text statistics", () => {
    expect(getTextStats("سلام دنیا")).toMatchObject({
      words: 2,
      lines: 1,
      persianLetters: 8,
      zwnj: 0,
      diacritics: 0
    });
  });

  it("counts diacritics and handles mixed line endings", () => {
    expect(getTextStats("عَلِی\r\nسلام")).toMatchObject({
      lines: 2,
      diacritics: 2
    });
  });

  it("handles empty text", () => {
    expect(getTextStats("")).toMatchObject({ words: 0, lines: 0, characters: 0 });
  });
});


describe("Iranian mobile helpers", () => {
  it("normalizes local and international formats", async () => {
    const { normalizeIranianPhone } = await import("./index.js");
    expect(normalizeIranianPhone("۰۹۱۲ ۳۴۵ ۶۷۸۹")).toBe("09123456789");
    expect(normalizeIranianPhone("+98 (912) 345-6789")).toBe("09123456789");
    expect(normalizeIranianPhone("00989123456789")).toBe("09123456789");
    expect(normalizeIranianPhone("12345")).toBe("");
  });
  it("validates Iranian mobile numbers", async () => {
    const { isValidIranianMobile } = await import("./index.js");
    expect(isValidIranianMobile("+989123456789")).toBe(true);
    expect(isValidIranianMobile("۰۹۱۲۳۴۵۶۷۸۹")).toBe(true);
    expect(isValidIranianMobile("02112345678")).toBe(false);
  });
});

describe("content and SEO helpers", () => {
  it("estimates reading time and handles empty content", async () => {
    const { getReadingTime } = await import("./index.js");
    expect(getReadingTime("یکی دو سه چهار", 200)).toEqual({ words: 4, seconds: 2, minutes: 1 });
    expect(getReadingTime("")).toEqual({ words: 0, seconds: 0, minutes: 0 });
    expect(getReadingTime("one two", 0).seconds).toBe(1);
  });
  it("creates normalized meta descriptions within the requested limit", async () => {
    const { createMetaDescription } = await import("./index.js");
    expect(createMetaDescription("كتاب  علي  و توسعه وب", 100)).toBe("کتاب علی و توسعه وب");
    expect([...createMetaDescription("این یک متن آزمایشی برای توضیحات متای صفحه است", 20)].length).toBeLessThanOrEqual(20);
    expect(createMetaDescription("سلام", 0)).toBe("");
  });
  it("ranks keyword frequency and skips common stop words", async () => {
    const { getKeywordStats } = await import("./index.js");
    expect(getKeywordStats("سئو فارسی سئو و محتوا فارسی", 2)).toEqual([
      { keyword: "سئو", count: 2, density: 33.3 },
      { keyword: "فارسی", count: 2, density: 33.3 }
    ]);
    expect(getKeywordStats("")).toEqual([]);
  });
});


describe("normalizeEzafe", () => {
  it("converts precomposed and decomposed ezafe hamza to ZWNJ + Persian Yeh", () => {
    expect(normalizeEzafe("برنامهٔ آماده روی هاست")).toBe("برنامه‌ی آماده روی هاست");
    expect(normalizeEzafe("خانهٔ بزرگ")).toBe("خانه‌ی بزرگ");
    expect(normalizeEzafe("نوشتهٔ فارسی و خانهٔ قدیمی")).toBe("نوشته‌ی فارسی و خانه‌ی قدیمی");
  });

  it("does not alter unrelated hamza characters", () => {
    expect(normalizeEzafe("مسئله و سؤال")).toBe("مسئله و سؤال");
  });
});

describe("normalizePersian ezafe option", () => {
  it("normalizes ezafe only when explicitly enabled", () => {
    expect(normalizePersian("برنامهٔ آماده")).toBe("برنامهٔ آماده");
    expect(normalizePersian("برنامهٔ آماده", { normalizeEzafe: true })).toBe("برنامه‌ی آماده");
  });
});

describe("analyzePersianText", () => {
  it("reports common Persian typography issues with counts", () => {
    const report = analyzePersianText("كتاب  علي ، برنامهٔ آماده، عدد 12 و ۱۲");
    expect(report).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "arabic-variants", count: 2 }),
      expect.objectContaining({ code: "ezafe-hamza", count: 1 }),
      expect.objectContaining({ code: "mixed-digit-systems", count: 2 }),
      expect.objectContaining({ code: "extra-spaces", count: 1 }),
      expect.objectContaining({ code: "space-before-punctuation", count: 1 })
    ]));
  });

  it("returns an empty report for clean text", () => {
    expect(analyzePersianText("متن فارسی تمیز است.")).toEqual([]);
  });
});
