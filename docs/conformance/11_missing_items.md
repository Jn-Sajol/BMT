# BMT — Missing Items & Core Gaps

This document registers missing integrations and capabilities for version `v1.0.0-rc-1`.

---

## 1. Google Ads Integration
*   **Gap:** The dynamic provider registry includes Google Ads, but the adapter uses simulated mocks.
*   **Impact:** Google Ads recommendations are currently simulated.
*   **Status:** **PARTIAL**

## 2. Dynamic Rules Sandbox
*   **Gap:** Standard templates compile to predefined NestJS nodes. Custom javascript execution within the rule engine requires application redeployments.
*   **Impact:** Users cannot run arbitrary scripts.
*   **Status:** **PARTIAL**
