# BMT — Release Strategy

This document outlines BMT's release and deployment procedures.

---

## 1. Release Lifecycle
1.  **Verification:** Automated CI pipelines validate compilation, linting, tests, and security scans on the `release/*` branch.
2.  **Staging Deploy:** Deploy candidate to staging namespace environment using Helm.
3.  **Audit Sign-off:** Verify readiness check results `/api/observability/ready` and performance logs.
4.  **Production Rollout:** Complete rolling deployment update to the production namespace environment.

## 2. Emergency Rollback
*   If error rates spike (`http_errors_total` $\ge 1\%$), execute immediate rollback:
    ```bash
    helm rollback bmt-release <revision> --namespace bmt-prod
    ```
