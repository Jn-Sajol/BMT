# BMT — API Contract Conformance Report

This report confirms compliance with the API Specification.

---

## 1. Routing & Headers
*   **Version URI Prefix:** `/api/v1`
*   **Mandatory Headers:**
    *   `x-workspace-id`: UUID (tenant context isolation)
    *   `x-correlation-id`: Trace propagation ID

## 2. API Endpoints Audit
*   `GET /api/v1/automation/recommendations` (Conforms to DTO expectations)
*   `POST /api/v1/automation/marketplace/:id/install` (Returns draft nodes layout)
*   `GET /api/observability/metrics` (Exposes Prometheus metrics)
