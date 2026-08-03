# Changelog

All notable changes to the BMT project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc-1] - 2026-07-15
### Added
- P-0051 Automation Notification & Alerting Engine.
- P-0052 AI Recommendation & Optimization Engine.
- P-0053 Automation Marketplace & Template Hub.
- S-03 Enterprise Observability Platform.
- S-04 Enterprise Testing & Quality Platform.
- S-05 Enterprise CI/CD & Release Engineering.
- Mandatory documentation governance suite (`docs/PROJECT_CONTEXT.md`, `docs/CHANGELOG.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`, `docs/TASKS.md`).
- Added "Logout / Disconnect Profile" feature on Facebook Connect Accounts dashboard for full agency contract client unlinking.
- Fixed localStorage persistence bug so empty/disconnected profile state stays persistent across page refreshes.
- Fixed Meta OAuth "Invalid Scopes" error by setting requested user authorization scope to Meta universal standard (`public_profile`) with instant client authorization fallback.
- Fixed Post Scheduler `queueJobs` state persistence by writing scheduled/posted jobs to `localStorage` (`bmt_queue_jobs`).
- **[MAJOR]** Replaced fake queue worker simulation with real Facebook Graph API posting engine (`POST /{page-id}/feed`). CARE HUB BD posts now publish to the actual Facebook Page via verified Page Access Token.







