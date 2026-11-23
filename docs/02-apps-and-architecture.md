# Apps & Architecture

## The three surfaces

### 1. Customer App
- iOS and Android, **separate download** from the business/influencer app
- Discovery, interactive map, deals, rewards, event tickets
- Multiple languages, matching existing Sparkr One-Tab localization

### 2. Business & Influencer App
- iOS and Android, **one download, separate logins** (a business owner and an
  influencer use the same app binary but log in as one role or the other)
- Contains all business tools AND all influencer tools
- Multiple languages, matching existing Sparkr One-Tab localization

### 3. Admin Panel
- Web app for the Sparkr team only
- Controls every feature across all apps
- Announcements and reports

> Note: "Business app" and "Influencer app" are referenced as separate feature sets
> throughout the proposal (numbered 1–16 for business, 20–23 for influencer), but they
> ship as **one app with two login types**, not two binaries.

## Proposed tech stack (subject to change during discovery)

| Layer | Technology |
| --- | --- |
| Mobile frontend | React Native (iOS + Android) |
| Admin frontend | Next.js + React |
| Backend | Node.js (NestJS) APIs |
| Data | PostgreSQL, Redis, WebSockets (for real-time sync) |
| Messaging / Payments | Twilio (SMS/MMS), Stripe Connect |
| Integrations | Google Business Profile + Google Maps, Meta (Facebook/Instagram), TikTok, YouTube, an LLM (AI captions, review replies, copy assistant) |
| Hosting / Security | HostArmada hosting, SSL, daily backups, role-based access, audit logs |

**Architecture note**: one shared backend serves both mobile apps and the admin panel,
connects to the existing One-Tab landing pages, and keeps campaigns, coins, deals and
messages in sync in real time.

## Key external dependencies (block or shape scope)

- **Google Business Profile API approval** — required for Google review replies /
  management; one approval covers every business on Sparkr. A test application has been
  submitted; until approved, build/test with sample data.
- **Meta app review** — needed for Facebook/Instagram publishing (social media management).
- **Meta, TikTok, YouTube access** — needed for post-link verification (confirming an
  influencer's post is live).
- **Twilio sender verification** — needed for SMS/MMS sending.
- **Stripe Connect setup** — needed for all payments (vouchers, gift cards, tickets,
  wallet top-ups go straight to the business, not through Sparkr).
- **Yelp is explicitly out of scope** for AI review replies — Yelp's reply API is
  limited to approved partners (e.g. Yext), paid/invite-only, aimed at large reputation
  firms. Not realistic for Sparkr.
