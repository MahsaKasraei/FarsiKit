# Changelog

## [0.4.0] - 2026-11-22

### Added
- Rebuilt the Playground as a focused English-first workspace with a calmer visual hierarchy and three progressive tool categories.
- Added a suggested Persian text correction beside the rule-based quality report.
- Added quick numeral conversion actions and a detailed text snapshot.

### Improved
- Made the primary normalization workspace the clear starting point and moved secondary tools into three compact tabs.
- Improved mixed numeral-system reporting so the count represents affected digits rather than the number of numeral systems.
- Synchronized root, core, and Playground package versions at 0.4.0.

### Tests
- Added regression coverage for suggested text corrections and mixed numeral counts.


## [0.3.5] - 2026-11-22

### Changed
- Replaced the minimal sample with a mixed Arabic/Persian example containing Arabic ك and ي, diacritics, Latin digits (123), and Persian ezafe examples so users can see normalization clearly.
- Updated the Playground version label and synchronized root, core, and Playground package versions at 0.3.5.

### Fixed
- Corrected ezafe normalization for the precomposed heh-with-yeh-above spelling when it follows a Persian heh; this fixes the regression test that failed in 0.3.4.


## [0.3.4] - 2026-11-22

### Changed
- Removed Word document import because the Playground does not generate a corrected Word file; accepting a full document without a downloadable document output was misleading.
- Replaced whole-document import with focused text input, limited to 5,000 characters per pass.
- Bounded the input and normalized-output panels with internal scrolling so long text does not stretch the page.
- Removed the unused Mammoth dependency and synchronized workspace versions at 0.3.4.

## [0.3.3] - 2026-11-22

### Added
- Added in-browser Word DOCX text extraction to the Playground (removed in 0.3.4 because no corrected Word document was produced).

### Changed
- Synchronized root, core, and Playground package versions at 0.3.3.

All notable changes to FarsiKit are documented here.

## [0.3.2] - 2026-11-22

### Fixed
- Fixed ezafe normalization order so the hamza above heh is converted before optional diacritic removal.
- Added regression tests for ezafe normalization with diacritic removal enabled and for the precomposed heh-with-yeh-above character.
- Moved the Persian Text Inspector directly below the main input/output workspace so it is immediately visible.

## [0.3.1] - 2026-11-22

### Added
- Added `normalizeEzafe` to convert Persian ezafe hamza forms (`ۀ` and `هٔ`) to ZWNJ + Persian Yeh (`ه‌ی`).
- Added the opt-in `normalizeEzafe` option to `normalizePersian`.
- Added `analyzePersianText`, a rule-based inspector for Arabic character variants, ezafe hamza, mixed digit systems, repeated spaces, and punctuation spacing.
- Added a Persian text quality report and an ezafe correction toggle to the Playground.
- Added unit tests for ezafe normalization and text inspection.

### Changed
- Synchronized workspace, core, and Playground package versions at 0.3.1.
- Updated README API documentation and usage examples.

### Notes
- Ezafe normalization is deliberately targeted; unrelated hamza characters are preserved.
- The inspector reports common typographic patterns. It is not a full spell-checker or linguistic analyzer.

## [0.2.0] - 2026-11-21

### Added
- Unicode NFC normalization helper.
- Optional Arabic diacritic removal in `normalizePersian`.
- Standalone Arabic diacritic stripping helper.
- Persian-friendly URL slug generation.
- Arabic-script text detection helper.
- Diacritic count in text statistics.
- Expanded unit coverage for digit conversion, normalization options, ZWNJ, slugs, and statistics.

### Changed
- Expanded README with API reference, usage examples, and behavior notes.
- Synchronized workspace and playground versions at 0.2.0.

### Notes
- ZWNJ insertion remains a conservative heuristic, not a full Persian morphology engine.
- No claim of complete language detection is made; script detection checks the Arabic Unicode block.
