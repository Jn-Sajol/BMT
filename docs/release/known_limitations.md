# BMT Platform — Known Limitations Report

This document records known platform limits and future optimizations.

---

## 1. System Scaling Limitations
*   **Database connection pool:** High parallel concurrency is limited by PostgreSQL connection pool constraints. Can be resolved by scaling PgBouncer.
*   **Polling latency:** Recommendation sweeps execute on database transaction level queries. Extremely high numbers of workspaces might require shifting to Event-driven triggers.

---

## 2. Dynamic Capabilities Registry
*   Adapters for external providers (Gemini, Claude, OpenAI) are currently configured at compile time. Dynamic capability additions require deploying version updates.
