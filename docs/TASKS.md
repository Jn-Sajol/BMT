# BMT — Task Tracking & Backlog

## Active Tasks
- [x] Initial workspace audit & project stack analysis.
- [x] Initialize mandatory 5-part documentation governance suite (`docs/PROJECT_CONTEXT.md`, `docs/CHANGELOG.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`, `docs/TASKS.md`).
- [x] Add "Logout / Disconnect Profile" feature on Facebook Page Connect dashboard (`ConnectAccountsPage`).
- [x] Fix `localStorage` persistence logic for empty disconnected profile state.
- [x] Align Meta OAuth scopes to official Meta universal permission (`public_profile`) with instant agency authorization fallback.
- [x] Add `localStorage` persistence (`bmt_queue_jobs`) to Post Scheduler for persistent job queue state across page reloads.
- [x] **[MAJOR]** Build real Facebook Graph API posting engine replacing frontend simulation. CARE HUB BD Page publishes via `POST /{page-id}/feed`.








## Backlog / Planned Roadmap (`v1.1.0`)
- [ ] Implement Google Ads SDK Adapter (`apps/api/src/modules/` & `packages/providers`).
- [ ] Build sandboxed JS runtime compiler for dynamic user rules.
- [ ] Add AI Recommendation historical CPA reduction trend visualizations to frontend dashboard.
- [ ] Implement automated workflow deadlock simulation in `DesignerModule`.
