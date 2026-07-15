# BMT — Architectural Decision Log

This log documents major design decisions, reasons, and trade-offs.

---

## 1. Clean Architecture Selection
*   **Decision:** Decouple controllers and Prisma client layers using use cases and ports.
*   **Reason:** Allows replacing the database or external APIs (e.g. Meta Ads API) without rewriting core business logic.
*   **Trade-off:** Requires writing boilerplate interface wrappers.

---

## 2. Dynamic Provider Registry
*   **Decision:** Route provider-specific code through a central `ProviderCapabilityRegistry`.
*   **Reason:** Ensures the platform remains provider-agnostic, supporting easy future additions of TikTok, Google, or other ad networks.
*   **Trade-off:** Higher upfront design complexity.

---

## 3. Read-Only AI Advisor
*   **Decision:** Design the recommendation engine as an advisory-only service.
*   **Reason:** Prevents automated algorithms from spending ad budgets without explicit user approval.
*   **Trade-off:** Users must manually accept optimizations before they run.
