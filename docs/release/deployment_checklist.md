# BMT Platform — Production Deployment Checklist

Use this checklist during cluster deploy events.

---

## Pre-Deployment Preparation
* [ ] Verify configuration properties using startup schemas (`loadEnvConfig()`).
* [ ] Confirm PostgreSQL container state is healthy.
* [ ] Verify current Git release tag is signed off.

## Deployment Rollout Sequence
* [ ] Trigger database schema backups.
* [ ] Execute migrations pipeline using `scripts/migrate.sh`.
* [ ] Build multi-stage API Docker images:
  ```bash
  docker build -f docker/Dockerfile.api -t bmt-api:1.0.0 .
  ```
* [ ] Upgrade Helm release package:
  ```bash
  helm upgrade --install bmt-release ./helm/bmt-app --namespace bmt-prod --values ./helm/bmt-app/values.yaml
  ```

## Post-Deployment Sanity Check
* [ ] Verify liveness heartbeats: `/api/observability/live` returns status 200.
* [ ] Verify readiness connection checks: `/api/observability/ready` returns status 200.
* [ ] Monitor Prometheus metrics path: `/api/observability/metrics`.
