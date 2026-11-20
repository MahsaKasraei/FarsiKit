# @farsikit/core

Framework-agnostic TypeScript utilities for Persian text normalization.

```ts
import { normalizePersian, convertDigits, addZwnj } from "@farsikit/core";

normalizePersian("كتاب علي"); // کتاب علی
convertDigits("123", "persian"); // ۱۲۳
addZwnj("می رود"); // می‌رود
```

See the root README for the full API overview.
