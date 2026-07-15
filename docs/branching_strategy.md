# BMT — Branching Strategy

BMT adopts a structured GitFlow variant to manage concurrent developers.

---

## 1. Branch Mappings
*   **`main`:** Contains production-ready code. Commits here represent stable releases (`v1.0.0`).
*   **`develop`:** Integration branch for the next release cycle.
*   **`feature/*`:** Developer feature branches off `develop`.
*   **`release/*`:** Release candidates created off `develop` to prepare for main release merges.
*   **`hotfix/*`:** Emergency hotfix branches off `main` to repair production bugs.
