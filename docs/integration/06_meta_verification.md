# 06 Meta Verification — IV-01

## 1. API Integrations Coverage
*   **Auth Flow:** Exchanging codes redirects to credentials vault registration.
*   **Graph Read Client:** Fetches campaigns, ad sets, ads, pixels, and ad insights.

## 2. Rate Limiting & Cursor Pagination
*   Cursor iteration parses paginated payloads recursively.
*   Exponential backoff retries manage rate limits automatically.
