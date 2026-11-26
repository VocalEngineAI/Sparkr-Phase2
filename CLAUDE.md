# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Commands

Run from `apps/business-app/`:

```bash
npx expo start            # dev server (also: npm run android | ios | web)
npx tsc --noEmit          # typecheck — the only automated check that exists today
npx expo install <pkg>    # add deps this way (SDK-compatible versions), not npm install
```

There is no test runner and no ESLint config yet. `npx expo lint` would scaffold one on
first run — only do that if asked.

## business-app architecture

- **One binary, two roles.** `src/context/AuthContext.tsx` holds a mock `role`
  (`business` | `influencer` | null). `src/navigation/RootNavigator.tsx` switches on it:
  null → `AuthNavigator` (welcome video reel → sign up / log in), otherwise
  `BusinessTabNavigator` or `InfluencerTabNavigator`. Auth is mocked: submitting the form just
  calls `signInAs(role)`. The animated splash overlays everything on launch; `useSplashDone()`
  tells screens underneath when it has gone.
  Screens live under `src/screens/{auth,business,influencer}/`.
- **Navigation is React Navigation (bottom tabs), not Expo Router.** `apps/business-app/AGENTS.md`
  is the stock Expo template and says to use Expo Router in `src/app/` — ignore that part;
  its Expo-version warnings (check `expo` major in package.json, read versioned docs) still apply.
- **Unbuilt screens** render `src/components/PlaceholderScreen.tsx` with an `upcoming`
  list taken from `docs/10-frontend-phase-plan.md`; replace it when building the feature.
- **Styling** is NativeWind `className` using the token names from `packages/ui/theme.js`
  (`bg-primary`, `text-textMuted`, `bg-surface`, …). Brand palette: linen `#F1ECE3` is the
  base/background, navy `#14213D` is ink, buttons and the logo (`primary`), amber `#FFB020` is
  hints only (`accent`; too light for text on linen). For non-className props (e.g. tab
  tint colors) import `colors` from `@sparkr/ui`. `theme.js` is plain JS on purpose so
  `tailwind.config.js` can `require()` it — keep it JS and update `theme.d.ts` alongside.
- **Monorepo wiring:** `metro.config.js` adds the repo root to `watchFolders`/`nodeModulesPaths`
  so Metro resolves the workspace packages; `@sparkr/shared` is consumed as raw TS (`main: index.ts`).
- **Mock data:** lives in `packages/shared`, split by area — types in `types/*.ts`, data in
  `mocks/*.ts` (business, home, marketing, customers, bookings, account), re-exported by the
  `types.ts` / `mocks.ts` barrels. The demo business is **Tang Sushie** (NYC sushi
  restaurant, owner Kenny Moy) — keep new business-side mocks consistent with it.
- **Business tabs** are Home · Marketing · Customers · Bookings · More. Every tab except
  Home is a native stack: a hub screen (`*HubScreen`, no header, large title, list of
  `FeatureCard`s) → feature screens under the native header. Param lists and screen-prop
  types live in `src/navigation/businessTypes.ts`; screens are in
  `src/screens/business/{marketing,customers,bookings,more}/`. Cross-tab links use
  `navigate("<Tab>", { screen, initial: false })` so the hub stays underneath.
- **Business UI kit:** `src/components/business/kit.tsx` (Screen, Section, Card, ListRow,
  SwitchRow, Segmented, Chips, StatGrid, Badge, PlatformIcon, `useHeaderButton`, `money`,
  `notYet` for not-yet-built actions) — build business screens from it. `QrScanner.tsx` is
  the shared camera scanner (ticket entry + cashier coins). Everything tappable is the ui
  `Button` or a native RN control (`Switch`, `TextInput` via ui `Input`) — don't hand-style
  `Pressable`s. Icons come from `@expo/vector-icons` (Ionicons).
- Create/edit wizards (campaign builder, new deal/voucher/event, etc.) are not built yet;
  their buttons call `notYet()` with a description of the flow.

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
