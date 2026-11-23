# Business App — Features 1–16

The business side of the Business & Influencer App. Each feature below is written as:
what it does, how it works, and what's explicitly **not included**.

## Feature 1 — Influencer Campaigns

**Paid or Barter**
- Barter: business enters only the dining/promo credit offered. No Sparkr fee.
- Paid: business enters the credit + payment per influencer. Sparkr takes a platform fee.

**Setup**
- Dates & platforms: start today or later, set end date, pick one or more of Instagram, TikTok, RedNote, YouTube
- Slots & budget: one campaign has many influencer slots (e.g. 5 or 10) + a budget; closes once all slots fill
- Visit availability: business sets hours influencers can visit (most campaigns are in person)
- Offer for followers (optional): e.g. a secret menu item followers can claim
- Title, description, branch: business writes title/description manually; chains pick a branch
- Minimum followers: none, or a preset (1K / 5K / 10K / 50K)
- Deliverables by platform: Instagram = 1 Reel + 2 Stories; TikTok = 1 video; YouTube = 1 short; RedNote = 1 post/video
- Shared slots: multiple platforms can share one slot pool; separate per-platform limits need separate campaigns
- Rules shown upfront before the business submits (reschedule/cancellation/payment rules)

**Not included**: influencer contracts/legal terms, guaranteed views/results, influencer
posts on the Sparkr feed, separate slot limits per platform in one campaign.

### How it works (5 steps)
1. **Create** — business sets slots, platforms, deliverables, optional offer, booking availability, start/end dates
2. **Apply** — business sets party-size limit + availability; only verified influencers on that platform can apply
3. **Hire** — business reviews profile and hires; applications stay open until slots fill
4. **Visit** — influencer visits at booked time; post due 10 days later unless agreed otherwise
5. **Track** — followers use unique code/link to join; business sees real visits and redemptions

### Posting workflow (5 steps)
1. **Post** — influencer posts directly on their own socials; no prior approval needed
2. **Submit** — influencer submits the live post URL through Sparkr (Sparkr never posts on anyone's behalf)
3. **Review** — business approves or requests revisions; **no response within 7 days = automatic approval**
4. **Revise** — business can request changes to caption/hashtags only, via in-app messaging
5. **Complete** — barter completes on approval; paid campaigns must pay within 72 hours

### Wallet, cancellations & payment
- Cancellations/rescheduling: free for the business at any time, no fee. Rescheduling needs business approval of new date/time. Influencer-initiated cancellation → booking marked Cancelled, business notified.
- Business wallet: businesses top up a wallet to launch campaigns and buy features (SMS, AI). **Top-ups are non-refundable.**
- Payment within 72 hours: paid campaigns pay from wallet within 72h of approval; Sparkr deducts its fee, rest to influencer.
- Reminders & enforcement: unpaid businesses get dashboard reminders; admin alerted, can disable/ban repeat offenders.
- **Not included**: refunds of wallet top-ups, Sparkr holding customer funds, QR/NFC check-in at visits.
- *To be finalised*: exact fees and limits, after case-study research + follow-up call. Optional per-customer bonus idea floated (e.g. $1/customer brought in) — undecided.

## Feature 2 — Analytics & Influencer ROI

- Unique influencer codes/links assigned per hired influencer, used in captions/stories for redemption
- Follower sign-up: followers use the link to download the app and auto-become members of that business
- Real foot traffic: business sees each influencer's visits/redemptions (members only, without a POS)
- Advanced analytics (**paid feature**): influencer results, offer sales, deals, vouchers in one dashboard
- Downloadable/shareable reports

**Not included**: tracking sales made outside Sparkr, third-party analytics sync, verifying influencer follower counts.

## Feature 3 — Google Reviews & AI Replies

*Requires Google API approval* (see [02-apps-and-architecture.md](02-apps-and-architecture.md)).

- Connect Google securely via OAuth (no passwords shared)
- Choose one or more verified locations on that Google account
- All reviews surface in the business app automatically
- **AI auto-replies**: AI writes a reply in the business's tone and posts it automatically as the owner's response, no pre-approval needed; replies to every review, negative reviews get a simple polite response
- **Not included**: Yelp review replies, deleting/hiding reviews, rewards for reviews/follows

**Google approval notes**: Google must approve API access for Sparkr's project (one
approval covers every business). Requires a verified Business Profile active 60+ days
with a website. A test application has been submitted; until approved, build/test with
sample data.

**Why not Yelp**: Yelp reply-via-API is limited to approved partners (e.g. Yext), is
paid/invite/application-based, aimed at large reputation firms — not realistic for Sparkr now.

**Full Google management scope** (delivered unless Google's API restricts a use case):
connect & monitor (connect profile, monitor reviews, review notifications), reply & post
(AI-assisted replies, review management, post/manage on Google — similar AI tool to
social media management), reputation insights (reputation analytics, review trend
tracking, profile performance monitoring).

## Social Media Management

*Delivered unless a platform's API restricts a use case.*

- Platform management: Instagram, Facebook, TikTok, RedNote, YouTube, with FB+IG cross-posting
- Calendar & scheduling: write once, schedule/post to FB+IG together
- AI captions & hashtags for pictures/videos
- Performance tracking: post performance, social analytics, campaign content tracking
- **Business posting only** — influencers cannot post through this feature

## Feature 4 — SMS Campaigns & AI Messaging

- Mass SMS: send hourly to monthly, to opted-in/imported/hand-picked customers, filtered by
  last check-in (1/3/6 months), offers claimed, birthdays, etc.
- AI copy assistant: drafts promo/birthday/win-back messages; business edits before sending
- Automated triggers: birthday offers, inactive-customer nudges, coin-expiry reminders
- Pricing: bundles (500/1,000 messages) or pay per message
- One Sparkr master Twilio account with business sub-accounts; every send logged for billing
- **Not included**: messaging non-opted-in customers, WhatsApp/other chat channels, email marketing

## Feature 5 — Personalised Picture Messages

- Business uploads one real photo of team/owner/chef holding a blank white sign
- AI finds the sign and adds each customer's first name (does not create/redraw the image)
- Personal message text sent with the photo (AI can draft it), e.g. "Hey Kenny, we missed you, 10% off today."
- Plain SMS remains available for any campaign; picture messages are optional, priced
  higher (~2¢ vs ~1¢ per SMS, MMS pricing)
- **Not included**: generating images from prompts, changing anything but the name, video messages

## Feature 6 — Vouchers & Gift Cards

**Vouchers**
- Paid or free vouchers: sell upfront (e.g. $125 for $100) or free, redeemed in store
- Redemption rules: business sets usage window/conditions/validity
- Paid to the business via Stripe Connect; **Sparkr default commission 5% (adjustable)**
- Only members can redeem; marked redeemed after use
- Voucher analytics (sold, revenue, redemptions) — in advanced analytics
- **Not included**: Sparkr holding voucher funds, cross-business vouchers, Sparkr-handled refunds

**Gift Cards**
- Businesses sell gift cards; customers buy in-app to give to friends
- Shared via link, QR, or code; friend must download Sparkr app first to claim
- Spend only in store at that one business
- Sparkr commission (e.g. 5%) via Stripe Connect
- **Not included**: cross-business gift cards, Sparkr holding funds, Sparkr-handled refunds

## Feature 7 — Happy Hours & Deals

- Happy hours: e.g. 4–6pm drinks, auto-shown to customers, with min spend/redemption limits
- Special deals: flash deals, secret menus, limited-time offers — nothing to buy in advance
- Automatic schedules: daily repeat or set dates; schedule, expire, toggle on/off — **free to post**
- Shown to customers in real time on profile, discovery, and the interactive map, with filters
- Deal analytics (redemptions, revenue, views, saves) — advanced analytics
- **Not included**: prepaid deals (see vouchers), automatic checkout discounts, deals from non-Sparkr businesses

**Feature list**: create flash deals, happy hour promos, secret menus, limited-time
offers; set min spend, redemption limits, expiry dates; schedule, activate/deactivate;
track redemptions and promotion revenue.

## Feature 8 — Business Posts Feed

- Business posts photos/videos to its profile; appears in customer app discovery feed
- A post can link directly to a voucher offer
- Customers follow, like, save businesses/posts
- Share outside the app via deep link (viewers sign up to open)
- Posting is free; **sponsored posts**: top spots rotate among paying businesses for 1/3/7 days at low prices
- **Not included**: posts by customers/influencers, in-app sharing/friend lists, comments/DMs, bidding for top spots

## Feature 9 — One-Tab Landing Page Add-On

- A paid add-on any business can add in-app (no more manual emails)
- Business fills a setup form in-app; **admin approves within 5 business days**, then sets it up and mails the NFC tag
- NFC access: customers open the page with an NFC tap once live
- Self-service editing after approval: info/photos/menus/links update near real time
- Paying businesses get monthly advanced analytics by email if not on dashboard
- **Not included**: new page builder/redesign, custom domains, SEO/ads management

## Feature 10 — Customer Database & Segments

- Member records: name, phone, email, birthday, coin balance, activity — one place
- Automatic customer list: joiners appear automatically, no manual entry
- Segments: filter by last check-in (1/3/6 months), offers claimed, birthdays, new-but-not-returned, opt-in, etc.
- SMS opt-in tracked per customer; phone used for messages but never shown on the card
- In-app activity: Sparkr app members build full visit/coin/redemption history
- **Not included**: importing past activity/history, sales pipelines, buying/exporting customer data

## Feature 11 — Customer Import & Welcome Messages

- CSV import from any tool (name, phone, email, birthday, coin balance) — automatic, no manual entry
- Matched by email or phone: imported customers who sign up with the same contact see membership immediately
- Ready-made branded virtual membership cards auto-created for each imported customer
- Free welcome message (SMS or email, one channel) — first send free, capped per business
- Extra sends bought in bundles (e.g. $10 for 500 SMS) — final pricing TBD
- **Not included**: manual data entry, importing visit/redemption history, both SMS+email to one person

## Feature 12 — Membership & Branded Cards

- Register once in the Sparkr app (name, phone, email, DOB)
- One-tap "Become a Member" reuses saved details for any new business — free for customers
- Business-branded card: business logo/colors, shows name, birthday, coin balance, QR, tier
- Card is linked to the customer profile — status/balance update in real time
- **Not included**: a Sparkr-wide (cross-business) membership, new card designs (info can only be added/removed)

## Feature 13 — Membership Tiers & Promotions

- Optional tiers: Bronze/Silver/Gold (e.g. by 12-month spend); businesses can switch off
- Business sets its own thresholds and rewards (e.g. 5/7.5/10/15%) — rules TBC
- Simple, non-technical tier/reward/rules builder
- Offers & holiday promotions: daily/weekly/time-specific, business-created/edited
- A business user guide for setup
- **Not included**: tiers shared across businesses, mandatory tiers, final tier rules (set in discovery)

## Feature 14 — Sparkr Coins & Rewards

- Business-specific coins: 1 coin = $1 at the issuing business only, non-transferable
- Configurable reward rate per business (e.g. 10%: $100 purchase → 10 coins)
- Cashier scans customer QR at checkout to add coins; every action confirmed
- Coins can pay part of a bill (e.g. $50 bill = $20 coins + $30 money)
- Expiry (1 year proposed) with SMS reminder; every earn/redeem logged
- **Not included**: buying coins with money, cross-business coin use, refunding/cashing out coins, billing history beyond redemptions

**Wallet top-up & gift cards (sub-feature)**
- Customers can top up a wallet *for a specific business*; payment goes directly
  customer → business. **Sparkr is not involved and never holds funds.**
- Businesses can also sell gift cards (same as Feature 6)
- **Not included**: spending balances at other businesses, Sparkr holding wallet funds, Sparkr-handled refunds

## Feature 15 — NFC Entry & Joining

- In-store NFC tags at storefront/tables/counter/cashier
- Tap to open the business's page instantly
- New customers join from the page, then download the app to continue
- QR code still used at the counter for coins
- Existing users: a tap takes them straight to that business's membership in their account
- **Not included**: QR codes for store entry, contactless payments

## Feature 16 — Reservations & Digital Waitlist

**Core booking**
- Business sets bookable times/tables per slot; any Sparkr user books a free slot with no approval, gets confirmation
- Digital waitlist, optional per business
- Simple capacity setup (tables, seats, capacity, time slots — like OpenTable but simpler)
- Free to use; customers pay the business **$0.25 only** if a "special reservation" is made
- Business-initiated chat: no acceptance needed, but business can message guest if something changes (e.g. overbooking)
- Schedule view + manual phone-booking entry; cancel reservations
- **Not included**: automatic refunds/deposits applied to the bill, floor-plan/table-map designer, OpenTable sync

**Deposits & policies**
- Deposit threshold: minimum party size requiring a deposit (optional per business)
- Fixed-per-booking or per-person deposit, business's choice
- Cancellation deadline set by the business, with optional penalty after it
- No-show policy/penalty configured by the business
- Deposits collected in-app at booking, only where enabled, shown on the reservation view
- **Not included**: automatic refund of deposits, deposit applied toward the final bill

**Deposit display**
- Every reservation shows its deposit next to party size/notes/special requests
- Clear warning: **the restaurant is responsible for managing each deposit against the final bill** — Sparkr does not apply, refund, or reconcile deposits
- Same warning shown at setup, before the first booking
- Per-business setting; businesses without it keep the standard view

**Reservation management**
- Calendar + live tables: real-time management, table availability, party size, deposits shown per booking
- Confirm/modify/cancel with SMS confirmations and reminders
- Guest details: reservation history, notes, special requests, VIP flags
- Waitlist managed in the same view as reservations
- Arrival check: e.g. for a 6–7PM booking, at 6:10PM the business is prompted "did the guest arrive?" — if not, slot frees and logs a no-show
- **Not included**: floor-plan/table-map designer, OpenTable sync, automatic refunds of deposits
