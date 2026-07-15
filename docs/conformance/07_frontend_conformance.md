# BMT — Frontend Conformance Report

This report documents the frontend monorepo app configurations.

---

## 1. Monorepo Layout
*   Frontend app is located under `apps/web/`.
*   Extends base TypeScript configs from `@jn-platform/tsconfig/base.json`.
*   Shares type interfaces with the backend through the `packages/shared-types` workspace package.

## 2. API Connection Rules
*   Leverages the versioned REST endpoint route system (`/api/v1`).
*   Passes tenant context headers (`x-workspace-id`) on all requests.
