# BMT — Architectural & System Decisions Log

## ADR-001: Mandatory Documentation Protocol
- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Need a robust context preservation strategy across AI coding assistant turns and development sessions.
- **Decision:** Every completed feature MUST update 5 core documents:
  1. `docs/PROJECT_CONTEXT.md`
  2. `docs/CHANGELOG.md`
  3. `docs/HANDOFF.md`
  4. `docs/DECISIONS.md`
  5. `docs/TASKS.md`
  Additionally, when approaching context limits, implementation must pause to update documentation and construct a seamless handoff prompt.
- **Consequences:** Ensures zero context drift and full auditability across feature iterations.

## ADR-002: Monorepo & Service Architecture
- **Date:** 2026-07-15
- **Status:** Accepted
- **Context:** Multi-tenant enterprise marketing OS requiring decoupled micro-frontend / micro-service separation.
- **Decision:** Adopt PNPM workspaces + Turbo monorepo split into `apps/api` (NestJS), `apps/web` (Next.js 15), `apps/workers` (Playwright Stealth + BullMQ), and modular `packages/*`.

## ADR-003: Facebook Profile Disconnect & Client Offboarding
- **Date:** 2026-08-02
- **Status:** Accepted
- **Context:** Agency clients requiring full profile and page token unlinking when contract terms end.
- **Decision:** Added `Logout / Disconnect Profile` action on primary profile card in `ConnectAccountsPage`, purging profile tree state, clearing stored tokens, and switching UI to empty OAuth authorization state.
- **Facebook Page Credentials in Env**: Store App Credentials & Page Tokens in `.env.local` validated by Zod schema in `env.ts`.
- **Long-Lived Access Token Management**: Implement short-lived token to 60-day long-lived token exchange with automated local storage caching & 7-day pre-expiration auto-refresh.
- **Dynamic Post Endpoint Selection**: Automatically choose Graph API `/feed` (text), `/photos` (images), or `/videos` (video format) based on post format.
- **Multi-Page Registry & Scheduling**: Maintain a client-side Facebook page registry enabling multi-select checkboxes for batch scheduling.
