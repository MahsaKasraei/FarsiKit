# FarsiKit

A lightweight, open-source toolkit for Persian text normalization, typography, and RTL-friendly web development.

FarsiKit helps developers build better Persian-language experiences with practical utilities for normalizing Arabic/Persian characters, converting digits, cleaning whitespace, and inspecting text.

## Features

- Normalize Arabic Yeh/Kaf variants to Persian ی and ک
- Convert digits between Persian, Arabic, and Latin forms
- Clean repeated whitespace and punctuation spacing
- Optional ZWNJ insertion for common Persian prefixes and suffixes
- Get useful text statistics, including word count and ZWNJ count
- A small RTL playground built with React and Vite

## Project structure

```text
FarsiKit/
├── apps/
│   └── playground/       # React + Vite demo
├── packages/
│   └── core/             # Framework-agnostic TypeScript utilities
└── .github/workflows/    # CI
```

## Getting started

Requirements: Node.js 18+ and npm 9+.

```bash
npm install
npm run test
npm run dev
```

To build all workspaces:

```bash
npm run build
```

## Core usage

```ts
import {
  normalizePersian,
  convertDigits,
  getTextStats
} from "@farsikit/core";

normalizePersian("كتاب و علي"); // "کتاب و علی"
convertDigits("Order 123", "persian"); // "Order ۱۲۳"
getTextStats("سلام دنیا"); // { characters: 9, ... }
```

## API

### `normalizePersian(text, options?)`

Normalizes common Arabic character variants and whitespace.

Options:
- `convertDigits`: `"persian" | "arabic" | "latin" | "none"` (default: `"none"`)
- `normalizeWhitespace`: boolean (default: `true`)
- `fixPunctuation`: boolean (default: `true`)
- ` نیمSpace`: not applicable; use `addZwnj` separately.

### `convertDigits(text, target)`

Converts digits to `"persian"`, `"arabic"`, or `"latin"`.

### `addZwnj(text)`

Applies conservative ZWNJ rules for a small set of common Persian prefixes and suffixes. It is intentionally lightweight and is not a full Persian morphological analyzer.

### `getTextStats(text)`

Returns character, word, line, Persian-letter, Arabic-variant, and ZWNJ counts.

## Roadmap

- Expand normalization rules with carefully tested examples
- Add configurable typography helpers
- Improve documentation and browser playground
- Add framework integrations only when they provide clear value

## Contributing

Contributions, bug reports, and Persian-language test cases are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
