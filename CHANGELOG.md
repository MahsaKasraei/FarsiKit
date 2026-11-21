# Changelog

All notable changes to FarsiKit are documented here.

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
