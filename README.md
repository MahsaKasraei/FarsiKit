# FarsiKit

An open-source TypeScript toolkit for Persian text, content SEO, Iranian locale utilities, typography, and RTL-friendly web development.

FarsiKit provides framework-agnostic utilities for cleaning Persian text, handling Arabic/Persian character variants, converting digits, managing common ZWNJ patterns, and preparing readable URL slugs.

## Features

- Normalize Arabic Yeh/Kaf variants to Persian ی and ک
- Normalize canonically equivalent Unicode sequences (NFC)
- Convert digits between Persian, Arabic-Indic, and Latin systems
- Clean whitespace and punctuation spacing
- Optionally remove Arabic diacritics (harakat)
- Apply conservative ZWNJ rules for common Persian prefixes and suffixes
- Generate Persian-friendly URL slugs
- Detect Persian/Arabic-script text
- Inspect text statistics, including characters, words, lines, ZWNJ, and diacritics
- Iranian mobile number normalization and validation\n- Reading-time estimates and meta-description generation\n- Lightweight keyword frequency analysis for Persian and mixed-language content\n- React + Vite playground for trying the utilities

## Project structure

```text
FarsiKit/
├── apps/
│   └── playground/       # React + Vite demo
├── packages/
│   └── core/             # Framework-agnostic TypeScript utilities
└── .github/workflows/    # CI
```

## Requirements

- Node.js 18+
- npm 9+

## Getting started

```bash
npm install
npm run test
npm run build
npm run dev
```

## Usage

Install the package when published, then import the helpers:

```ts
import {
  addZwnj,
  containsPersian,
  createMetaDescription,
  convertDigits,
  getKeywordStats,
  getReadingTime,
  isValidIranianMobile,
  normalizeIranianPhone,
  getTextStats,
  normalizePersian,
  slugifyPersian,
  stripArabicDiacritics
} from "@farsikit/core";

normalizePersian("كتاب علي 123", { convertDigits: "persian" });
// "کتاب علی ۱۲۳"

addZwnj("می رود و کتاب ها");
// "می‌رود و کتاب‌ها"

slugifyPersian("راهنمای توسعه وب فارسی");
// "راهنمای-توسعه-وب-فارسی"

containsPersian("Hello فارسی");
// true

stripArabicDiacritics("عَرَبِيّ");
// "عربي"

getTextStats("سلام دنیا");
// Includes characters, words, lines, Persian letters, ZWNJ, and diacritic counts.

normalizeIranianPhone("+98 912 345 6789");
// "09123456789"
isValidIranianMobile("۰۹۱۲۳۴۵۶۷۸۹");
// true

getReadingTime("یک متن نمونه برای برآورد زمان مطالعه");
// { words: 7, seconds: 3, minutes: 1 }

createMetaDescription("متن مقاله برای توضیحات متا");
getKeywordStats("سئو فارسی و تولید محتوای فارسی");
```

## API

### `normalizePersian(text, options?)`

Normalizes common Arabic character variants, Unicode composition, whitespace, and punctuation.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `convertDigits` | `"persian" \| "arabic" \| "latin" \| "none"` | `"none"` | Convert all supported digit systems |
| `normalizeWhitespace` | `boolean` | `true` | Normalize spacing and trim outer whitespace |
| `fixPunctuation` | `boolean` | `true` | Normalize spacing around common punctuation |
| `removeDiacritics` | `boolean` | `false` | Remove Arabic combining marks |

### Other helpers

- `convertDigits(text, target)`: convert Persian, Arabic-Indic, or Latin digits.
- `normalizeUnicode(text)`: normalize Unicode to NFC.
- `stripArabicDiacritics(text)`: remove Arabic combining marks.
- `addZwnj(text)`: apply limited, conservative ZWNJ rules.
- `slugifyPersian(text)`: create a URL-friendly slug while preserving Persian and Latin letters.
- `containsPersian(text)`: detect characters in the Arabic Unicode block.
- `getTextStats(text)`: count characters, words, lines, Persian letters, Arabic variants, ZWNJ, and diacritics.

## Important behavior notes

- ZWNJ insertion is heuristic and intentionally limited; it is not a Persian spell-checker or morphological analyzer.
- `containsPersian` checks the Arabic Unicode block, which includes Persian and Arabic characters. It does not identify a language with certainty.
- Slugs preserve letters and numbers from supported scripts; applications should still URL-encode values when constructing URLs.

## Content and SEO helpers

- `normalizeIranianPhone(input)`: normalize common Iranian mobile formats to `09xxxxxxxxx`; returns an empty string for unsupported input.
- `isValidIranianMobile(input)`: validate common Iranian mobile number formats.
- `getReadingTime(text, wordsPerMinute?)`: estimate reading time using whitespace-separated words (default 200 words/minute).
- `createMetaDescription(text, maxLength?)`: normalize text and create a word-boundary-aware meta description (default 160 Unicode code points).
- `getKeywordStats(text, limit?)`: show simple token frequency and density, excluding a small built-in stop-word list. This is a lightweight hint, not a full linguistic analyzer.

## Development

```bash
npm install
npm test
npm run build
```

Contributions, bug reports, and Persian-language test cases are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
