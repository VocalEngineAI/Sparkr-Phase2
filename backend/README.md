# Backend

Not started yet. Current phase is frontend-only (see [`docs/10-frontend-phase-plan.md`](../docs/10-frontend-phase-plan.md)) —
all three frontends use mocked data from `packages/shared` until this is built.

Planned stack (per `docs/02-apps-and-architecture.md`): Node.js (NestJS), PostgreSQL,
Redis, WebSockets. One shared backend serves `apps/business-app`, `apps/customer-app`,
and `apps/admin-web`.
