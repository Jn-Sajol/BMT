# BMT Platform — REST API Contract Freeze Document

This document lists and freezes all public endpoints, schemas, and request parameters for version `1.0.0-rc-1`.

---

## 1. Base Routing Configuration
*   **Version URI prefix:** `/api/v1`
*   **Default headers:**
    *   `x-workspace-id`: UUID (tenant context isolation)
    *   `x-correlation-id`: Trace propagation ID

---

## 2. API Schema Definitions

### Recommendations API
*   `GET /api/v1/automation/recommendations` (List suggestions)
*   `POST /api/v1/automation/recommendations/:id/accept` (Accept recommendation)
*   `POST /api/v1/automation/recommendations/:id/reject` (Reject recommendation)
*   `GET /api/v1/automation/recommendations/dashboard` (Reads from CQRS dashboard projection)

### Marketplace & Templates API
*   `GET /api/v1/automation/marketplace` (Browse catalog)
*   `POST /api/v1/automation/marketplace/publish` (Publish template package)
*   `POST /api/v1/automation/marketplace/:id/install` (Validates and imports template as a draft)
*   `POST /api/v1/automation/marketplace/:id/rollback` (Roll back installation version reference)

### Telemetry & Observability API
*   `GET /api/v1/observability/metrics` (Prometheus exposition payload)
*   `GET /api/v1/observability/health` (Database and queue check response)
*   `GET /api/v1/observability/live` (Liveness check heartbeat)
*   `GET /api/v1/observability/ready` (Readiness check response)
