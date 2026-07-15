# BMT — Database Conformance Report

This report confirms compliance with the Database Architecture requirements.

---

## 1. Schema Constraints
*   **Foreign Keys:** All relation tables enforce explicit UUID constraints.
*   **Indexes:** Indexes are configured on lookup keys (e.g. `(workspace_id, status)`) to accelerate database queries.
*   **Deduplication:** Unique constraints on `recommendation_hash` prevent duplicate recommendations from being inserted.

## 2. Cascade Policies
*   Child structures (e.g., recommendation histories or template versions) use `ON DELETE CASCADE` constraints to prevent orphan database records.
