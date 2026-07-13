# BMT SaaS Platform — Production Operations Runbook & Deployment Guide

This document describes go-live protocols, scaling limits, backup/restore cycles, and operational incident response metrics for the BMT Marketing Operating System.

---

## 1. Go-Live & Deployment Checklist
* [ ] Validate env parameters via startup schema checks.
* [ ] Execute database pre-deploy backup script.
* [ ] Execute schema migrations via `scripts/migrate.sh`.
* [ ] Build multi-stage Docker images (`Dockerfile.api`).
* [ ] Deploy Helm chart release package:
  ```bash
  helm upgrade --install bmt-release ./helm/bmt-app --namespace bmt-prod --values ./helm/bmt-app/values.yaml
  ```
* [ ] Verify container logs via kubectl and monitor live endpoints `/api/observability/ready`.

---

## 2. Backup & Restore Policy
* **Snapshot Schedules:** Daily full database backups and hourly transaction log sweeps.
* **Database Restoration Run:**
  ```bash
  pg_restore -h $DB_HOST -U $DB_USER -d bmt-prod backup_file.dump
  ```

---

## 3. Scaling & Horizontal Pod Autoscaling (HPA)
* **Limits:** Scales up to 10 pod replicas dynamically when CPU limits exceed 75% or Memory usage exceeds 400Mi.
* **Anti-Affinity:** Pod spread constraints are enforced to distribute API traffic evenly across multiple availability zones.

---

## 4. Incident Response
* **Alert Trigger:** Spike in `http_errors_total` or latency boundaries.
* **Remediation Action:** Inspect structured JSON logs matching correlation IDs across services to isolate database timeouts.
