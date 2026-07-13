# BMT Platform — Production Launch Checklist

Use this checklist during public go-live events.

---

## 1. Domain & Routing Cutover
* [ ] Point public DNS settings for `api.bmt.io` to Ingress load balancer IP.
* [ ] Verify SSL cert activation.

## 2. Platform Integrations Verification
* [ ] Verify external API connections (Meta Ads, LLMs) resolve using correct API tokens.
* [ ] Check SMTP mail servers are reachable.

## 3. Active Monitoring & Alarms Activation
* [ ] Assert Prometheus metric scrapers are receiving latency counts.
* [ ] Confirm Grafana alarm thresholds are activated.
* [ ] Verify Slack alert channels are receiving alert events.
