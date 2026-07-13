# BMT Platform — SLA Performance Baseline

This document lists SLA response requirements and estimated hardware constraints for production clusters.

---

## 1. Response Latencies SLA

*   **API Gateway Routing latency:** $\le 50\text{ms}$
*   **Database Query Latency:** $\le 10\text{ms}$ (on indexes)
*   **AI Recommendation Generation:** $\le 1.2\text{s}$ (evaluating provider capability registries)
*   **Notification Delivery Queue Processing:** $\le 200\text{ms}$ (async delivery)
*   **Marketplace template installation:** $\le 800\text{ms}$ (compilation + database transaction)

---

## 2. Cluster Hardware Baseline (Per Replica)

*   **CPU Allocation:**
    *   Request: `100m`
    *   Limit: `500m`
*   **Memory Allocation:**
    *   Request: `256Mi`
    *   Limit: `512Mi`
*   **Autoscaling Threshold:** Scales when CPU utilization $\ge 75\%$
