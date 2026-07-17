# 08 Database Verification — IV-01

## 1. Schema Constraints
*   **Prisma Client:** Schemas are loaded and compiled cleanly.
*   **Cascading Rules:** Foreign keys automatically clean up associated execution runs when workflows are deleted.

## 2. Workspace Multi-Tenant Isolation
*   Prisma repositories filter database queries by `workspaceId` to prevent tenant data leakage.
