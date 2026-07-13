# BMT Platform — Database Schema Freeze Document

This document lists and locks the Prisma schema configuration, table constraints, and relations.

---

## 1. Table Definitions

*   **`automation_recommendations`**:
    *   Primary key: `id` (UUID)
    *   Unique Index: `recommendation_hash` (Deduplication)
    *   Indexes: `(workspace_id, status)`, `expires_at`

*   **`automation_recommendation_history`**:
    *   Foreign Key: `recommendation_id` references `automation_recommendations(id)` with `ON DELETE CASCADE`

*   **`automation_recommendation_dashboard_projections`**:
    *   Unique constraint on `workspace_id`

*   **`automation_templates`**:
    *   Foreign Key: `workspace_id` UUID
    *   Index on `(workspace_id, visibility)`

*   **`automation_template_versions`**:
    *   Unique constraint: `(template_id, version)`

*   **`automation_template_installations`**:
    *   Index on `(workspace_id, status)`

*   **`automation_template_analytics`**:
    *   Index on `template_id`

*   **`automation_template_reviews`**:
    *   Index on `(template_id, rating)`

---

## 2. Constraints & Cascade Policy
*   All child tables reference parent identifiers using `ON DELETE CASCADE` constraints to prevent orphaned database records.
