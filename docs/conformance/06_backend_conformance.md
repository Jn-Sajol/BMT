# BMT — Backend Architecture Conformance Report

This report confirms compliance with the Backend Architecture requirements.

---

## 1. Clean Architecture Compliance
*   **Infrastructure Isolation:** Prisma database client calls are isolated behind Domain Repository ports.
*   **API Controllers:** Presentation controllers handle HTTP mapping and validate payloads using Zod schemas before routing to Application Services.

## 2. SOLID Adherence
*   **Single Responsibility (SRP):** Schedulers handle task loops exclusively, while dispatchers manage alert formatting and deliveries.
*   **Open/Closed (OCP):** The AI advisor registry allows adding new LLM providers without modifying core recommendation services.
