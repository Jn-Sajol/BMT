# BMT — Conversation Handoff State

## Last Updated
2026-08-02

## Current Session Status
- Completed initial workspace audit and structured documentation setup.
- Implemented "Logout / Disconnect Profile" feature on Facebook Page Connect dashboard (`ConnectAccountsPage`) for agency client offboarding.
- Fixed localStorage persistence logic to ensure disconnected empty profile state remains persistent across page refreshes.
- Fixed Meta OAuth "Invalid Scopes" error by setting requested user authorization scope to Meta universal standard (`public_profile`) with instant client authorization fallback.
- Added `localStorage` persistence (`bmt_queue_jobs`) to Post Scheduler so newly scheduled and posted jobs remain saved across page refreshes.
- **[MAJOR]** Replaced fake queue worker simulation with real Facebook Graph API posting engine. CARE HUB BD Page (ID: `892168940637389`) posts now publish via `POST /{page-id}/feed` with verified Page Access Token from `BMT Page Manager` Meta App (ID: `920029261146957`).
- Governance rule enforced: mandatory documentation updates after every feature completion.







## Current State & Active Workspace
- Repository: `Jn-Sajol/BMT` (`d:\Dev\BMT`)
- Monorepo configured with PNPM, Turbo, Next.js 15, NestJS 10, Prisma PostgreSQL, Redis, BullMQ, Playwright workers.

## Next Steps for Future Assistant Sessions
- Await next user instruction or feature request.
- Ensure all 5 mandatory docs (`PROJECT_CONTEXT.md`, `CHANGELOG.md`, `HANDOFF.md`, `DECISIONS.md`, `TASKS.md`) are updated upon feature completion.
