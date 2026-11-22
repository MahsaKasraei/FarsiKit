# Changelog

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
