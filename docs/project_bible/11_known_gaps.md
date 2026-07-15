# BMT — Known Gaps & Limitations

This document lists real codebase gaps for version `v1.0.0-rc-1`.

---

## 1. Google Ads Adapter Implementation
*   **Gap:** The provider registry lists Google Ads as a target, but the adapter implementation relies on placeholder mocks.
*   **Impact:** Google Ads optimization recommends are currently simulated.
*   **Fix:** Build a real Google Ads SDK connector module.

---

## 2. Dynamic Rules Compilation (Custom Scripts)
*   **Gap:** Marketplace templates compile to predefined NestJS trigger nodes. Completely custom scripts require redeploying the application.
*   **Impact:** Users cannot deploy arbitrary Javascript code directly into the rule engine.
*   **Fix:** Add a sandboxed JS compiler runtime (e.g. `vm2` or `quickjs`).
