// Shared domain types used across business-app, customer-app, and admin-web.
// Filled in incrementally as each screen/feature is built — see docs/03-07 for the
// feature definitions these types should model (campaigns, vouchers, reservations, etc).

export type UserRole = "business" | "influencer" | "customer" | "admin";
