# Events & Tickets

A cross-app feature touching the business app (create/sell), customer app (discover/buy),
influencer app (promote/earn commission), and admin (fee tracking).

## Business side — creating events

- Create & publish: title, description, date, time, venue, photos; chains pick a branch
- Ticket quantity & price: set price + max tickets; sales **auto-stop when sold out**
- Promo codes: percentage or fixed discount, use limit, expiry date
- Sales dashboard: tickets sold/remaining, revenue, promo code usage per event
- Paid to the business via Stripe Connect; **Sparkr takes 10% of all ticket sales**
- Drafts stay private; publishing makes the event appear immediately in the customer app
- **Not included**: seat maps/reserved seating, printed/physical tickets, Sparkr-handled refunds, multiple ticket tiers per event, recurring event series, cash/door sales

## Influencer promotion

- Business opens a published event to influencer promotion (same flow as influencer campaigns)
- Business sets the commission influencers earn per ticket sold through their referral
  (*commission range and payout timing to be finalised after discovery*)
- Each influencer gets a unique code/link; tickets through it are credited to them
- Referral tracking: both sides see tickets sold / commission earned per influencer
- Fees & payout: Sparkr takes 10% of every ticket sale; business pays influencer commission from its share
- **Not included**: guaranteed ticket sales, influencer contracts/legal terms, sales made outside Sparkr

## How it works end-to-end (5 steps)

1. **Create** — business sets date, venue, price, max quantity, optional promo codes
2. **Publish** — event goes live in the customer app's Events & Tickets section
3. **Promote** — business invites influencers, who share a unique code/link for commission
4. **Buy** — customers browse, pay in-app, optionally apply a promo code, get a digital ticket
5. **Earn** — Sparkr takes 10%; business sees sales, influencer sees commission

## Customer side

- Dedicated "Events & Tickets" section in customer discovery, separate from deals/vouchers
- Browse upcoming events nearby (e.g. concerts), filtered by date/location/type
- Event page: photos, description, date, venue, price, tickets remaining, hosting business
- Buy with Apple Pay / Google Pay / credit card; enter promo code at checkout
- Digital ticket delivered in-app + emailed
- **Not included**: events from non-Sparkr businesses, ticket transfers/resale, Sparkr-handled refunds

### My Tickets & entry
- All purchased tickets in one place, split into upcoming/past
- Each ticket has a unique QR code — single use
- Email copy sent immediately after purchase
- Business staff scan the QR in the business app; ticket marked used
- Purchase receipt shows event, quantity, price paid, promo code applied
- **Not included**: Apple/Google Wallet passes, printed tickets, hardware scanners

## Influencer side

- Browse events open for promotion, see commission offered per event
- Once approved by the business, get a unique code/link to share
- Track referrals: tickets sold through their code/link, per event
- Earn commission on every ticket sold through their link; paid to their connected Stripe account
- **Not included**: customer details shown to influencers, guaranteed earnings, posting to social media through Sparkr
