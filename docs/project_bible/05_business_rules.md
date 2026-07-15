# BMT — Core Business Rules & Execution Rules

This document outlines key validation constraints and business logic.

---

## 1. Recommendation Hashing & Deduplication
To prevent flooding user workspaces with repetitive suggestions, the engine generates a deterministic SHA-256 hash using:
$$\text{Hash} = \text{SHA256}(\text{provider} \mathbin{\Vert} \text{entityId} \mathbin{\Vert} \text{recommendationType} \mathbin{\Vert} \text{metricWindow} \mathbin{\Vert} \text{recommendationVersion})$$
Duplicates with matching hashes are discarded.

---

## 2. Notification Dispatch Limits
*   **Quiet Hours Check:** If the recipient's timezone indicates local quiet hours (e.g. 10 PM - 8 AM), dispatch is queued until the morning unless labeled `CRITICAL`.
*   **Opt-out Verification:** The engine verifies that the user has not disabled the specific category before scheduling email/Slack alerts.

---

## 3. Marketplace Signature Verifications
Installations are blocked if the SHA-256 digital signature of the canvas layout template does not match its public packaging key, protecting against external script injections.
