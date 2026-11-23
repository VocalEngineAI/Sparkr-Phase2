# Sparkr Phase 2

Mobile ecosystem for Sparkr (restaurants, nail salons, spas): a Business & Influencer
app, a Customer app, and a web Admin panel, sharing one backend. Client: Kenny Moy,
Sparkr. Built by VocalEngineAI.

Full project understanding lives in [`docs/`](docs/01-overview.md) — start there.
Source of truth for the proposal itself is `Sparkr Phase 2 Proposal.pptx` in the repo
root; the docs/ files are a structured breakdown of it.

## Current phase

**Frontend-only**, building in this order:
1. Business & Influencer App (mobile) — **in progress**
2. Customer App (mobile)
3. Admin Dashboard (web)

No backend/API integration yet — screens use mocked/static data from `packages/shared`.
See [`docs/10-frontend-phase-plan.md`](docs/10-frontend-phase-plan.md) for the screen
inventory and build order within each phase.

## Repo structure

One monorepo (npm workspaces), not separate repos — all three frontends and the future
backend share types/contracts.

```
apps/
  business-app/   Expo RN app (business + influencer logins) — Phase 1
  customer-app/   Expo RN app — Phase 2 (not started)
  admin-web/      Next.js app — Phase 3 (not started)
packages/
  shared/         @sparkr/shared — TS types + mock data, used by all frontends (and later the backend)
  ui/             @sparkr/ui — design tokens shared by the two RN apps (admin-web has its own Tailwind config)
backend/          NestJS API — not started; placeholder README only
docs/             project documentation (this index continues below)
```

`business-app` uses Expo + NativeWind (Tailwind for RN) + React Navigation (bottom tabs).
Root-level `package.json` defines the npm workspaces; run `npm install` from the repo
root, not inside an individual app, so `@sparkr/shared`/`@sparkr/ui` stay linked.

## Docs index

- `docs/01-overview.md` — project summary, problem/solution, doc map
- `docs/02-apps-and-architecture.md` — the three apps, proposed tech stack, dependencies
- `docs/03-business-app-features.md` — business features 1–16 (campaigns, Google,
  social, SMS, vouchers, deals, posts, One-Tab, customers, membership, coins, NFC, reservations)
- `docs/04-customer-app-features.md` — customer features 17–19 (discover, profiles, map)
- `docs/05-influencer-app-features.md` — influencer features 20–23
- `docs/06-admin-panel-features.md` — admin features 24–26
- `docs/07-events-and-tickets.md` — events/ticketing (cross-app)
- `docs/08-business-model.md` — revenue/fee structure, money-flow rules
- `docs/09-timeline-and-scope.md` — schedule, scope, assumptions, client responsibilities
- `docs/10-frontend-phase-plan.md` — our implementation plan (this is what to follow when building)
