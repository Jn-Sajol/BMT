# 01 Auth Verification — IV-01

## 1. Authentication Streams
*   **JWT Token Exchanges:** Cookie payloads are validated on every request.
*   **Workspace Gateway:** Resolves IDs and routes user views based on target paths.

## 2. RBAC Boundaries
*   `Owner`, `Admin`, and `Developer` roles are granted credential vault editing scopes.
*   `Viewer` role query results mask all sensitive token parameters.
