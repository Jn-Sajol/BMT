# BMT — Requirement Traceability & Conformance Matrix

This document traces BMT requirements to codebase proof files and validation checks.

---

| Req ID | Requirement | Status | Code Evidence / Files | Conformance Check |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | Multi-tenant tenant separation | **✅ Fully Implemented** | `workspace-isolation.interceptor.ts` | Header presence checks |
| **REQ-02** | Rule-based automation triggers | **✅ Fully Implemented** | `trigger-engine.service.ts` | Node status evaluation tests |
| **REQ-03** | Topological workflow compiler | **✅ Fully Implemented** | `designer.service.ts` | Kahn sort algorithm checks |
| **REQ-04** | AI recommendation deduplication| **✅ Fully Implemented** | `recommendation-engine.service.ts` | Deterministic SHA-256 hash checks |
| **REQ-05** | Cryptographic checks on templates| **✅ Fully Implemented** | `template-installer.service.ts` | SHA-256 checksum verify |
| **REQ-06** | Quiet hours notification limits | **✅ Fully Implemented** | `notification-dispatcher.service.ts` | Local timezone calculation |
| **REQ-07** | Prometheus observability scrape | **✅ Fully Implemented** | `observability.controller.ts` | `/api/observability/metrics` route |
