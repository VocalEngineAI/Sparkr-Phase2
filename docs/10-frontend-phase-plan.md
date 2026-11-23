# Frontend Implementation Plan (Phased)

Scope of this plan: **frontend only**, no backend/API work yet. Build order follows the
user's priority:

1. **Business & Influencer App** (mobile)
2. **Customer App** (mobile)
3. **Admin Dashboard** (web)

Each app will use mocked/static data until a backend exists, so screens can be built and
reviewed independently. Full feature definitions are in [03](03-business-app-features.md)–
[07](07-events-and-tickets.md); this file only tracks build order and screen inventory.

## Stack decisions (confirmed)

- **Scaffolding**: Expo-managed React Native (not bare) for both mobile apps
- **Styling**: NativeWind (Tailwind for RN), with shared tokens in `packages/ui`
- **Navigation**: React Navigation (bottom tabs for each role's main nav; native-stack
  installed for future drill-down screens)
- **State for mocked data**: React Context for now (see `AuthContext` in business-app);
  revisit when real data fetching is needed
- **Monorepo**: npm workspaces (`apps/*`, `packages/*`) — see repo structure in
  [`CLAUDE.md`](../CLAUDE.md)

## Progress

- [x] Repo scaffolded as npm workspaces monorepo (`apps/`, `packages/shared`, `packages/ui`, `backend/` placeholder)
- [x] `business-app` scaffolded (Expo + TypeScript + NativeWind + React Navigation)
- [x] Role-select auth flow + business/influencer tab shells with placeholder screens
- [ ] Build out each placeholder screen per the inventory below, in order

## Phase 1 — Business & Influencer App (mobile)

One app, two login modes. Build the business side first (it's the larger feature set),
then the influencer side (smaller, reuses shared components: campaigns, messaging, wallet).

**Screen inventory — Business side**
- Auth / role selection (business vs. influencer login)
- Dashboard home (wallet balance, active campaigns, alerts)
- Influencer Campaigns: list, create/edit wizard (paid/barter, dates/platforms, slots/budget,
  visit availability, offer), applicants review, hire flow, visit tracking, post review/revision
- Analytics & ROI dashboard
- Google Reviews & AI Replies: connect flow, review feed, AI reply review
- Social Media Management: calendar/scheduler, AI caption generator, performance tracking
- SMS Campaigns: audience builder, AI copy assistant, automated triggers config
- Personalised Picture Messages: photo upload, preview, send flow
- Vouchers & Gift Cards: create/manage, analytics
- Happy Hours & Deals: create/manage, schedule, analytics
- Business Posts Feed: composer, feed management, sponsored post purchase
- One-Tab Add-On: setup form, status tracker
- Customer Database & Segments: list, filters, segment builder
- Customer Import: CSV upload flow, welcome message composer
- Membership & Branded Cards: card designer/preview, tier builder
- Sparkr Coins & Rewards: rate config, QR scanner (cashier flow), ledger
- Wallet Top-Up & Gift Cards (business-facing)
- NFC Entry: tag management (view/status)
- Reservations & Waitlist: calendar/table view, deposit/policy config, guest details, arrival check flow
- Events & Tickets: create/publish, sales dashboard, promo codes, influencer promotion setup
- Wallet & billing: top-up, invoices, payment reminders

**Screen inventory — Influencer side**
- Auth / sign-up & account linking (IG/TikTok/YouTube/RedNote), follower count entry
- Home: balance, pending earnings, active/upcoming campaigns, action reminders
- Discovery & Search: filters, AI-recommended + featured campaigns
- My Campaigns: pipeline view (invited → applied → hired → scheduled → posted → completed)
- Calendar / saved campaigns
- Campaign detail: apply flow, messaging (post-acceptance), dispute flow
- Live Posts: submit link flow, revision thread
- Wallet: earnings, payout status
- Events: browse promotable events, join flow, referral tracking, earnings

**Build order within Phase 1**: Auth/role select → Dashboard shells → Influencer
Campaigns (biggest feature) → Vouchers/Deals/Posts → Messaging/SMS → Customers/Membership/
Coins → Reservations → Events & Tickets → Google/Social management → Influencer-side screens.

## Phase 2 — Customer App (mobile)

**Screen inventory**
- Auth / onboarding (one Sparkr account, multi-language)
- Home / Discover feed: deals, happy hours, vouchers, secret menus, rewards
- Interactive Map: pins, filters (radius/city/type/specials), pin detail sheet
- Business Profile: overview, info, social links, happy hours/deals, promotions, Memories wall,
  check-in, leaderboard entry
- Membership flow: join, wallet & cards, coin balance/history
- Wallet top-up (per business, opt-in)
- Vouchers & Gift Cards: browse, purchase, redeem, gift-send flow
- Reservations: booking flow, deposit payment (if enabled), confirmation, my bookings
- Events & Tickets: browse, event detail, purchase, promo code entry, My Tickets (QR), receipt
- Customer dashboard: Top Visited leaderboard, saved/followed businesses

**Build order within Phase 2**: Auth/onboarding → Discover feed → Business Profile →
Map → Membership/Wallet → Vouchers/Gift Cards → Reservations → Events & Tickets →
Memories/Leaderboard polish.

## Phase 3 — Admin Dashboard (web)

**Screen inventory**
- Auth (Sparkr staff)
- Overview: cross-app metrics, announcements composer
- Feature control panels (per-feature toggles/limits, mirroring every business/customer feature)
- Announcement Carousel manager
- Featured Marketing manager (campaigns, sponsored posts)
- Disputes & Moderation queue
- Reports: cross-app analytics, auto-emailed business invoices
- Coupon Generator
- Approvals queue (influencer profiles, One-Tab pages)
- Unpaid Campaign Alerts
- Payments & Fees dashboard (Stripe Connect status, fee config, invoices)

**Build order within Phase 3**: Auth → Overview/metrics shell → Approvals queue →
Disputes/Moderation → Coupon Generator → Payments & Fees → Reports → Announcement/Featured
Marketing managers.

## Tracking

As each screen is built, mark it here or in a project tracker. Backend integration,
real auth, and payments wiring are explicitly deferred to a later phase per the user's
current instruction (frontend-only, mocked data).
