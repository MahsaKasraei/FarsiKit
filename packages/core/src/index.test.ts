import { describe, expect, it } from "vitest";
import { addZwnj, convertDigits, getTextStats, normalizePersian } from "./index.js";

describe("convertDigits", () => {
  it("converts Latin and Arabic digits to Persian", () => {
    expect(convertDigits("A12 ٣٤", "persian")).toBe("A۱۲ ۳۴");
  });

  it("converts Persian digits to Latin", () => {
    expect(convertDigits("۱۲۳", "latin")).toBe("123");
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
});

describe("addZwnj", () => {
  it("adds ZWNJ to common prefixes", () => {
    expect(addZwnj("می رود و نمی شود")).toBe("می‌رود و نمی‌شود");
  });

  it("joins common suffixes to the preceding word", () => {
    expect(addZwnj("کتاب ها و خانه های بزرگ")).toBe("کتاب‌ها و خانه‌های بزرگ");
  });
});

describe("getTextStats", () => {
  it("returns basic text statistics", () => {
    expect(getTextStats("سلام دنیا")).toMatchObject({
      words: 2,
      lines: 1,
      persianLetters: 8,
      zwnj: 0
    });
  });

  it("handles empty text", () => {
    expect(getTextStats("")).toMatchObject({ words: 0, lines: 0, characters: 0 });
  });
});
