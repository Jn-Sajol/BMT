# BMT — System Modules Inventory

This document archives the purpose and dependencies of BMT modules.

---

## 1. `MarketplaceModule`
*   **Purpose:** Lists, installs, and rolls back workflow templates.
*   **Dependencies:** `AutomationModule`, `DatabaseModule`
*   **Core Entities:** `AutomationTemplate`, `AutomationTemplateInstallation`
*   **Internal Services:** `TemplateInstallerService`, `TemplateReviewService`

## 2. `RecommendationModule`
*   **Purpose:** Generates AI advisory recommendations and aggregates score indicators.
*   **Dependencies:** `AutomationModule`, `DatabaseModule`
*   **Core Entities:** `AutomationRecommendation`
*   **Internal Services:** `RecommendationEngineService`, `RecommendationScoreService`

## 3. `NotificationModule`
*   **Purpose:** Dispatches async email or Slack alerts according to workspace timezone settings.
*   **Dependencies:** `DatabaseModule`
*   **Core Entities:** `NotificationAlert`
