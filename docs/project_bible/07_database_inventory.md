# BMT — Database Table Inventory

The schema is built on PostgreSQL and version-controlled via Prisma migrations.

---

## 1. Recommendations Table

### `automation_recommendations`
*   `id`: UUID (Primary Key)
*   `workspace_id`: UUID (Foreign Key to workspace)
*   `recommendation_hash`: String (Unique constraint)
*   `status`: Enum (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`)
*   `priority`: Enum (`CRITICAL`, `HIGH`, `NORMAL`, `LOW`)
*   **Indexes:**
    *   Index on `(workspace_id, status)`
    *   Index on `expires_at`

---

## 2. Marketplace Tables

### `automation_templates`
*   `id`: UUID (Primary Key)
*   `workspace_id`: UUID
*   `visibility`: Enum (`PUBLIC`, `PRIVATE`)
*   **Indexes:** Index on `(workspace_id, visibility)`

### `automation_template_installations`
*   `id`: UUID (Primary Key)
*   `template_id`: UUID (Foreign Key to templates)
*   `workspace_id`: UUID
*   `status`: Enum (`ACTIVE`, `INACTIVE`, `ROLLED_BACK`)
