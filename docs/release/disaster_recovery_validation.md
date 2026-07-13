# BMT Platform — Disaster Recovery Validation Report

This report outlines targets for Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO).

---

## 1. Disaster Scenarios & Recovery Parameters

| Disaster Scenario | Recovery Strategy | Target RTO | Target RPO |
| :--- | :--- | :--- | :--- |
| **Zone Outage** | Kubernetes spreads replicas across zones. Traffic rerouted by Ingress rules. | $\le 1\text{ min}$ | $0\text{ (no data loss)}$ |
| **Database Failure**| Spin up secondary replicas and attach backup dump. | $\le 15\text{ mins}$ | $\le 1\text{ hour}$ |
| **Bad Release** | Rollback Helm package release version. | $\le 2\text{ mins}$ | $0\text{ (no data loss)}$ |

---

## 2. Validation Testing Outcomes
*   Helm rollback tested successfully.
*   Autoscaling pod recovery tested successfully.
