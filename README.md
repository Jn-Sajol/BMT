# JNS Marketing OS Monorepo

Welcome to the official repository for the **JNS Marketing OS** (formerly mOS), developed by **JNSoft**. This platform is an enterprise-grade multi-tenant marketing orchestration dashboard and automation engine.

## System Specifications

### **Minimum System Requirements**
*   **Operating System Compatibility:** Windows 10/11 (WSL2 recommended), macOS 12+ (Intel or Apple Silicon), or Linux (Ubuntu 20.04+, Debian 11+).
*   **Recommended Hardware:**
    *   **CPU:** 4-Core Processor (x86_64 or ARM64)
    *   **Memory:** Minimum 8GB RAM (16GB RAM recommended for running local Playwright browser workers)
    *   **Storage:** 20GB free SSD disk space

### **Supported Software Versions**
*   **Node.js:** Node.js v20+ (LTS)
*   **PNPM:** PNPM v8+
*   **Docker:** Docker Engine v20.10+ and docker-compose v2.0+

---

## Monorepo Architecture

This project is structured as a monorepo managed using `pnpm` workspaces and `turbo` build pipelines under the `jn-platform` workspace.

### Directory Structure

```
.
├── .github/                 # GitHub workflows & CI/CD configurations
├── apps/                    # Core Applications
│   ├── api/                 # NestJS Backend API (Placeholder)
│   ├── web/                 # Next.js Frontend Web (Placeholder)
│   └── workers/             # Headless Browser Workers (Placeholder)
├── docs/                    # System design, PRD, SRS, & Database documentations
├── docker/                  # Dockerfiles for containerized environments
├── infrastructure/          # Local Docker services (Postgres, Redis, Mailhog, PgAdmin)
├── packages/                # Shared internal packages
│   ├── eslint-config/       # ESLint configurations
│   ├── shared-types/        # Shared TS types
│   └── tsconfig/            # Shared base TS configs
├── scripts/                 # Automation & local initialization scripts
├── package.json             # Root monorepo configuration
├── pnpm-workspace.yaml      # Monorepo workspaces map
├── tsconfig.json            # Root typescript settings
└── turbo.json               # Pipeline build rules
```

---

## Getting Started

### 1. Configure Local Environment
Copy the environment variables template to a local configuration file:
```bash
cp .env.example .env
```

### 2. Start Infrastructure Services
Launch PostgreSQL, PgAdmin, Redis, and Mailhog using docker-compose:
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```
*   **PostgreSQL:** Available at `localhost:5432`
*   **PgAdmin Web UI:** Available at `http://localhost:5050` (Login: `admin@jnsoft.local` / `adminpassword123`)
*   **Redis:** Available at `localhost:6379`
*   **Mailhog Web UI:** Available at `http://localhost:8025`

### 3. Initialize Workspaces
Install local dependencies using pnpm:
```bash
pnpm install
```
*Note: Run `pnpm build` to compile the shared packages skeleton.*

---

## Troubleshooting Guide

*   **Error: PostgreSQL connection refused on pgAdmin**
    *   *Cause:* The database container is still performing its initial health checks.
    *   *Fix:* Wait 5-10 seconds for the database service to turn healthy, then click refresh inside pgAdmin.
*   **Error: Docker ports already allocated**
    *   *Cause:* Another local process is using ports 5432, 6379, or 5050.
    *   *Fix:* Terminate conflicting local servers, or map alternate port values inside your `.env` and `docker-compose.yml`.
