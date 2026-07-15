# BMT — Feature Validation Matrix

This matrix maps user-facing features to their backend, frontend, database, API, and verification components.

---

| Feature | Backend Service | Database Schema | API Endpoint | E2E Spec | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Workspace Creation** | `WorkspaceService` | `workspaces` | `POST /api/v1/workspaces` | `workspace.e2e.spec.ts` | **VERIFIED** |
| **Template Installation**| `TemplateInstallerService`| `automation_template_installations` | `POST /api/v1/automation/marketplace/:id/install` | `marketplace.e2e.spec.ts`| **VERIFIED** |
| **Template Rollback** | `TemplateInstallerService`| `automation_template_versions` | `POST /api/v1/automation/marketplace/:id/rollback` | `marketplace.e2e.spec.ts`| **VERIFIED** |
| **AI Recommendation** | `RecommendationEngineService`| `automation_recommendations` | `GET /api/v1/automation/recommendations` | `recommendation.e2e.spec.ts`| **VERIFIED** |
| **Alert Config** | `NotificationService` | `notification_settings` | `PUT /api/v1/notifications/config` | `notification.e2e.spec.ts`| **VERIFIED** |
| **Observability Scrape** | `TelemetryService` | N/A (Prometheus) | `GET /api/observability/metrics` | `observability.e2e.spec.ts`| **VERIFIED** |
