import { describe, expect, it } from "vitest";
import {
  addZwnj,
  containsPersian,
  convertDigits,
  getTextStats,
  normalizePersian,
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
