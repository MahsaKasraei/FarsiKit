FarsiKit 🇮🇷

A lightweight, open-source toolkit for Persian text normalization, typography, and RTL-friendly web development.

FarsiKit helps developers build better Persian-language experiences by providing simple, reliable utilities for cleaning, normalizing, and processing Persian text.

Whether you’re building a website, web application, or content management system, FarsiKit makes working with Persian text easier and more consistent.

✨ Features

* Persian Character Normalization — Convert Arabic Yeh (ي) and Kaf (ك) to their standard Persian equivalents (ی, ک).
* Digit Conversion — Convert between Persian, Arabic-Indic, and Latin numerals.
* Text Normalization — Clean repeated spaces and normalize common punctuation spacing.
* Half-Space Support — Optionally apply ZWNJ (Zero-Width Non-Joiner) to common Persian prefixes.
* Text Inspection — Count characters, words, and Persian letters, and detect common text inconsistencies.
* Lightweight Core — TypeScript utilities with no runtime dependencies.

🚀 Getting Started

Installation

npm install @farsikit/core

Basic Usage

import {
  normalizePersian,
  toPersianDigits,
  toLatinDigits
} from "@farsikit/core";
// Normalize Persian characters and spacing
const text = normalizePersian("مي خواهم كد بنويسم");
// Convert Latin digits to Persian
const persianNumbers = toPersianDigits("Order 12345");
// Convert Persian digits to Latin
const latinNumbers = toLatinDigits("سفارش ۱۲۳۴۵");
console.log(text);
console.log(persianNumbers);
console.log(latinNumbers);

Enable Half-Space Normalization

import { normalizePersian } from "@farsikit/core";
const result = normalizePersian("می روم و نمی دانم", {
  halfSpace: true
});
console.log(result);
// می‌روم و نمی‌دانم

🧰 Available Utilities

Utility	Description
normalizePersian()	Normalize common Persian text inconsistencies
normalizeArabicLetters()	Convert Arabic Yeh and Kaf
convertDigits()	Convert digits to a selected numeral system
toPersianDigits()	Convert digits to Persian
toArabicDigits()	Convert digits to Arabic-Indic
toLatinDigits()	Convert digits to Latin
countPersianLetters()	Count Persian/Arabic-script characters
inspectPersianText()	Inspect text and detect common issues

🖥️ Playground

FarsiKit includes a web-based playground where you can:

* Enter Persian text and see normalized output.
* Convert numbers between numeral systems.
* Preview text-cleaning results.
* Copy the processed output.

🛠️ Development

Clone the repository:

git clone https://github.com/YOUR_USERNAME/farsikit.git
cd farsikit

Install dependencies:

npm install

Run tests:

npm test

Start the playground:

npm run dev

Build the project:

npm run build

🗺️ Roadmap

* [x]	Persian character normalization
* [x]	Persian, Arabic-Indic, and Latin digit conversion
* [x]	Basic whitespace and punctuation normalization
* [x]	Initial TypeScript test suite
* [x]	React playground
* [ ]	Expanded Persian typography rules
* [ ]	RTL layout inspection utilities
* [ ]	More comprehensive documentation and examples
* [ ]	npm package release
* [ ]	Community contributions and integrations

🤝 Contributing

Contributions are welcome!

If you find a bug, have an idea for a new feature, or want to improve the documentation, feel free to open an issue or submit a pull request.

Please read CONTRIBUTING.md before contributing.

📄 License

FarsiKit is released under the MIT License.

⸻

Built to make the Persian web better.
