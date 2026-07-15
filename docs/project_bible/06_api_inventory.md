# BMT — Public REST API Inventory

All API endpoints are prefixed with `/api/v1` and require header authentication credentials.

---

## 1. Recommendations API

### `GET /api/v1/automation/recommendations`
*   **Description:** Returns active optimization suggestions.
*   **Headers:** `x-workspace-id` (UUID), `Authorization` (Bearer token)
*   **Response:** JSON list of recommendations.

### `POST /api/v1/automation/recommendations/:id/accept`
*   **Description:** Accepts a suggestion and triggers its automation action.
*   **Status Codes:** `200 OK`, `404 Not Found`

---

## 2. Marketplace API

### `POST /api/v1/automation/marketplace/:id/install`
*   **Description:** Validates canvas digital signatures and imports the template.
*   **Payload:** `{ "targetWorkspaceId": "UUID" }`

### `POST /api/v1/automation/marketplace/:id/rollback`
*   **Description:** Reverts to a previous version of an installed template.
