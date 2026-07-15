# BMT — Architectural Decision Log & System Boundaries

This document records the architectural standards enforced inside BMT.

---

## 1. Domain-Driven Design (DDD) Layers
*   **Domain:** Models, interfaces (ports), and domain errors. Completely framework-agnostic.
*   **Application:** Use cases, commands, queries, and business orchestrators (e.g. `TemplateInstallerService`).
*   **Infrastructure:** Controllers, database adapter repositories (Prisma), external API connectors (Meta API), and loggers.

---

## 2. Decoupled Interface Boundary Rule
No controller is permitted to interact directly with the Prisma database client. Database queries must navigate through Domain Port interfaces implemented by infrastructure adapters.

---

## 3. CQRS Read Projections
Read dashboards (like the Recommendation dashboard) use projections to isolate read performance spikes from core transactional locks.
