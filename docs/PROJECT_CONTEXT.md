# BMT — Project Context

## Overview
**JNS Marketing OS** (developed by **JNSoft**) is an enterprise-grade multi-tenant marketing orchestration dashboard and automation engine.
- **Page Publishing Engine**: Integrated Facebook Graph API (`/feed`, `/photos`, `/videos`) supporting multi-page batch post scheduling, long-lived 60-day token auto-refresh, and secure env credential management.

## Monorepo Architecture
Managed via `pnpm` workspaces (`jn-platform`) and `turbo` build pipelines.

- **`apps/api`**: NestJS backend service (REST API, Webhooks, Schedulers, Automation engine, Prisma ORM).
- **`apps/web`**: Next.js 15 App Router frontend web application.
- **`apps/workers`**: Playwright Stealth headless browser workers and BullMQ queue consumers.
- **`packages/*`**: Shared monorepo packages (`ai-copilot`, `automation-nodes`, `notifications-engine`, `plugin-sdk`, `automation-providers`, `security-vault`, `shared-types`, `eslint-config-custom`, `tsconfig`).

## Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5.5, Tailwind CSS, Zustand, @tanstack/react-query, Axios, React Hook Form, Zod, Framer Motion, Lucide React, @xyflow/react.
- **Backend**: NestJS 10, Express, TypeScript 5.0, Swagger/OpenAPI, Argon2, Helmet, BullMQ, ioRedis.
- **Database & Storage**: PostgreSQL (managed via Prisma v5.10), Redis 7.
- **Infrastructure**: Docker, Kubernetes, Helm (`helm/bmt-app`), Docker Compose (`infrastructure/docker-compose.yml`).

## System Status
- Current Release Milestone: `v1.0.0-rc-1` (Code Freeze)
- Next Planned Milestone: `v1.0.0` (Production Release) / `v1.1.0` (Google Ads Adapter & Custom Script Runtime)
